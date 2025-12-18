import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    KeyboardAvoidingView, Platform, Pressable, ScrollView,
    StyleSheet, TextInput, View
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { chat, getChatHistory } from '@/services/chatService';
import { getSocket, initSocket } from '@/services/socket';

type Message = {
    from: 'user' | 'bot' | 'admin';
    text: string;
    mode: 'bot' | 'admin';
    pending?: boolean;
};

const ChatScreen: React.FC = () => {
    const { t } = useTranslation();
    const scheme = useColorScheme() ?? 'light';
    const palette = Colors[scheme];

    const [draft, setDraft] = useState('');
    const [chatMode, setChatMode] = useState<'bot' | 'admin'>('bot');
    const [messages, setMessages] = useState<Message[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const scrollRef = useRef<ScrollView>(null);

    const room = useMemo(() => userId ? `user_${userId}` : '', [userId]);

    // 1. Khởi tạo User ID từ Token
    useEffect(() => {
        const loadUser = async () => {
            const token = await AsyncStorage.getItem('loginToken');
            if (token) {
                try {
                    const decoded: any = jwtDecode(token);
                    setUserId(decoded.userid || decoded.id);
                } catch (e) {
                    console.error("Token decode error", e);
                }
            }
        };
        loadUser();
    }, []);

    // 2. Logic dành riêng cho Bot Mode
    useEffect(() => {
        if (chatMode === 'bot' && messages.filter(m => m.mode === 'bot').length === 0) {
            setMessages(prev => [
                ...prev,
                { from: 'bot', text: t('chat.welcomeMessage') || 'Hello!', mode: 'bot' }
            ]);
        }
    }, [chatMode]);

    // 3. Logic dành riêng cho Admin (Socket) Mode
    useEffect(() => {
        if (chatMode !== 'admin' || !room) return;

        let isMounted = true;

        const setupSocket = async () => {
            const socket = await initSocket();

            // Join room
            socket.emit('join_room', { room });

            // Load lịch sử chat
            try {
                const history = await getChatHistory(room);
                if (isMounted && Array.isArray(history)) {
                    const normalized: Message[] = history.map((item: any) => ({
                        text: item.content || '',
                        from: item.senderrole === 'user' ? 'user' : 'admin',
                        mode: 'admin'
                    }));
                    setMessages(prev => [...prev.filter(m => m.mode !== 'admin'), ...normalized]);
                }
            } catch (err) {
                console.warn("History load failed", err);
            }

            // Lắng nghe tin nhắn mới
            socket.on('receive_message', (data: any) => {
                if (isMounted) {
                    setMessages(prev => [...prev, {
                        from: data.senderrole === 'user' ? 'user' : 'admin',
                        text: data.content,
                        mode: 'admin'
                    }]);
                }
            });
        };

        setupSocket();

        return () => {
            isMounted = false;
            getSocket()?.off('receive_message');
        };
    }, [room, chatMode]);

    // 4. Tự động cuộn xuống
    useEffect(() => {
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, [messages, chatMode]);

    // Lọc tin nhắn theo Tab hiện tại
    const visibleMessages = useMemo(() =>
        messages.filter(m => m.mode === chatMode),
        [messages, chatMode]);

    const formatBotReply = (text: string) => {
        return text
            .split(/\n+/)
            .map(line => line.trim())
            .filter(Boolean)
            .map(line => `* ${line}`)
            .join('\n');
    };

    const renderBoldSegments = (line: string, color: string) => {
        // Split by **bold** markers and render bold segments separately
        const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
        return parts.map((part, idx) => {
            const isBold = part.startsWith('**') && part.endsWith('**');
            const text = isBold ? part.slice(2, -2) : part;
            return (
                <ThemedText key={idx} style={{ color, fontSize: 15, fontWeight: isBold ? '700' : '400' }}>
                    {text}
                </ThemedText>
            );
        });
    };

    const renderMessageContent = (msg: Message, color: string) => {
        const lines = msg.text.split('\n');
        if (lines.length <= 1) {
            return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>{renderBoldSegments(msg.text, color)}</View>;
        }

        return (
            <View style={{ gap: 4 }}>
                {lines.map((line, idx) => (
                    <View key={idx} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
                        {renderBoldSegments(line, color)}
                    </View>
                ))}
            </View>
        );
    };

    const handleSend = () => {
        const text = draft.trim();
        if (!text) return;

        if (chatMode === 'bot') {
            const chatWithBot = async () => {
                setMessages(prev => [
                    ...prev,
                    { from: 'user', text, mode: 'bot' },
                    { from: 'bot', text: t('chat.processing') || 'Đang xử lý...', mode: 'bot', pending: true }
                ]);

                try {
                    const res = await chat(text);
                    setMessages(prev => [
                        ...prev.filter(m => !(m.mode === 'bot' && m.pending)),
                        { from: 'bot', text: formatBotReply(res.reply || '...'), mode: 'bot' }
                    ]);
                } catch (err) {
                    setMessages(prev => [
                        ...prev.filter(m => !(m.mode === 'bot' && m.pending)),
                        { from: 'bot', text: t('chat.error') || 'Bot đang gặp sự cố, vui lòng thử lại.', mode: 'bot' }
                    ]);
                }
            };

            chatWithBot();

        } else {
            const socket = getSocket();
            if (socket && room) {
                socket.emit("send_message", {
                    room,
                    senderid: userId,
                    senderrole: "user",
                    content: text,
                    productid: null,
                });
            }
        }
        setDraft('');
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: palette.background }]}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>{t('chat.title')}</ThemedText>
                </View>
            </View>

            {/* Switch Mode */}
            <View style={[styles.modeSwitch, { borderColor: palette.border }]}>
                {(['bot', 'admin'] as const).map((mode) => (
                    <Pressable
                        key={mode}
                        style={[styles.modeButton, chatMode === mode && { backgroundColor: palette.tint }]}
                        onPress={() => setChatMode(mode)}
                    >
                        <ThemedText style={{ color: chatMode === mode ? '#FFF' : palette.text, fontWeight: '600' }}>
                            {mode === 'bot' ? (t('chat.botMode') || 'Bot AI') : (t('chat.sellerMode') || 'Admin')}
                        </ThemedText>
                    </Pressable>
                ))}
            </View>

            {/* Chat List */}
            <ScrollView
                ref={scrollRef}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            >
                {visibleMessages.map((msg, index) => {
                    const isUser = msg.from === 'user';
                    return (
                        <View key={index} style={[styles.row, isUser ? styles.rowEnd : styles.rowStart]}>
                            <View style={[
                                styles.bubble,
                                isUser ? styles.bubbleUser : styles.bubbleOther,
                                { backgroundColor: isUser ? palette.tint : (scheme === 'dark' ? '#333' : '#E9E9EB') }
                            ]}>
                                {renderMessageContent(msg, isUser ? '#FFF' : palette.text)}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            {/* Input */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
                <View style={styles.inputContainer}>
                    <View style={[styles.inputRow, { borderColor: palette.border, backgroundColor: palette.background }]}>
                        <TextInput
                            style={[styles.input, { color: palette.text }]}
                            value={draft}
                            onChangeText={setDraft}
                            placeholder={t('chat.typeMessage')}
                            placeholderTextColor="#999"
                        />
                        <Feather name="mic" size={20} color={palette.tint} />
                    </View>
                    <Pressable
                        style={[styles.sendBtn, { backgroundColor: palette.tint, opacity: draft.trim() ? 1 : 0.6 }]}
                        onPress={handleSend}
                        disabled={!draft.trim()}
                    >
                        <Feather name="send" size={22} color="#FFF" />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </ThemedView>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 50 },
    headerContainer: { paddingHorizontal: 20, marginBottom: 15 },
    leftHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    modeSwitch: {
        flexDirection: 'row',
        marginHorizontal: 20,
        borderWidth: 1,
        borderRadius: 25,
        padding: 4,
        marginBottom: 10
    },
    modeButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 20 },
    list: { paddingHorizontal: 15, paddingBottom: 20 },
    row: { flexDirection: 'row', width: '100%', marginVertical: 5 },
    rowStart: { justifyContent: 'flex-start' },
    rowEnd: { justifyContent: 'flex-end' },
    bubble: {
        maxWidth: '80%',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18
    },
    bubbleUser: { borderBottomRightRadius: 2 },
    bubbleOther: { borderBottomLeftRadius: 2 },
    inputContainer: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        gap: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc'
    },
    inputRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15
    },
    input: { flex: 1, height: 40 },
    sendBtn: { width: 45, height: 45, borderRadius: 23, justifyContent: 'center', alignItems: 'center' }
});