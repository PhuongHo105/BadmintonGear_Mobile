import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

type Message = {
    id: string;
    author: 'user' | 'support';
    content: string;
};

const supportMessages: Message[] = [
    { id: '1', author: 'support', content: 'Xin chào! Hãy để lại câu hỏi của bạn, đội ngũ hỗ trợ sẽ phản hồi sớm nhất.' },
    { id: '2', author: 'user', content: 'Mình muốn hỏi về chính sách đổi trả.' },
    { id: '3', author: 'support', content: 'Bạn có thể đổi trả trong vòng 7 ngày nếu sản phẩm còn tem và hóa đơn.' },
];

const sellerMessages: Message[] = [
    { id: 's1', author: 'support', content: 'Xin chào! Tôi là người bán. Bạn đang quan tâm sản phẩm nào?' },
    { id: 's2', author: 'user', content: 'Cho mình hỏi tình trạng hàng còn không và thời gian giao?' },
    { id: 's3', author: 'support', content: 'Sản phẩm còn hàng. Thời gian giao dự kiến từ 2-4 ngày làm việc.' },
];

const ChatScreen: React.FC = () => {
    const { t } = useTranslation();
    const scheme = useColorScheme() ?? 'light';
    const palette = Colors[scheme];
    const [draft, setDraft] = useState('');
    const [showSellerChat, setShowSellerChat] = useState(false);

    return (
        <ThemedView style={[styles.container, { backgroundColor: palette.background }]}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>{t('chat.title')}</ThemedText>
                </ThemedView>
            </ThemedView>
            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {supportMessages.map((message) => {
                    const isUser = message.author === 'user';
                    return (
                        <ThemedView key={message.id} style={[styles.row, isUser ? styles.rowEnd : styles.rowStart]}>
                            <ThemedView style={[
                                styles.bubble,
                                isUser ? styles.bubbleUser : styles.bubbleSeller,
                                { backgroundColor: isUser ? palette.tint : palette.border }
                            ]}>
                                <ThemedText style={[styles.message, { color: isUser ? palette.background : palette.text }]}>{message.content}</ThemedText>
                            </ThemedView>
                        </ThemedView>
                    );
                })}

                {!showSellerChat && (
                    <ThemedView style={[styles.row, { justifyContent: 'center', marginVertical: 16 }]}>
                        <Pressable
                            onPress={() => setShowSellerChat(true)}
                            style={[styles.chatWithSellerBtn, { backgroundColor: palette.tint }]}
                        >
                            <ThemedText style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>
                                {t('chat.chatWithSeller')}
                            </ThemedText>
                        </Pressable>
                    </ThemedView>
                )}

                {showSellerChat && (
                    <>
                        <ThemedView style={[styles.divider, { borderTopColor: palette.border, marginVertical: 12 }]} />
                        <ThemedView style={styles.dividerLabel}>
                            <ThemedText style={[styles.dividerText, { color: palette.secondaryText }]}>
                                {t('chat.chatWithSeller')}
                            </ThemedText>
                        </ThemedView>
                        <ThemedView style={[styles.divider, { borderTopColor: palette.border, marginVertical: 12 }]} />
                    </>
                )}

                {showSellerChat && sellerMessages.map((message) => {
                    const isUser = message.author === 'user';
                    return (
                        <ThemedView key={message.id} style={[styles.row, isUser ? styles.rowEnd : styles.rowStart]}>
                            <ThemedView style={[
                                styles.bubble,
                                isUser ? styles.bubbleUser : styles.bubbleSeller,
                                { backgroundColor: isUser ? palette.tint : palette.border }
                            ]}>
                                <ThemedText style={[styles.message, { color: isUser ? palette.background : palette.text }]}>{message.content}</ThemedText>
                            </ThemedView>
                        </ThemedView>
                    );
                })}
            </ScrollView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
                <ThemedView style={styles.inputContainer}>
                    <ThemedView style={[styles.inputRow, { borderColor: palette.border, backgroundColor: palette.background }]}>
                        <TextInput
                            style={[styles.input, { color: palette.text }]}
                            value={draft}
                            onChangeText={setDraft}
                            placeholder={t('chat.typeMessage')}
                            placeholderTextColor={palette.secondaryText}
                            editable
                        />
                        <Pressable onPress={() => { }}>
                            <Feather name="mic" size={24} color={palette.tint} />
                        </Pressable>
                    </ThemedView>
                    <Pressable style={[styles.sendBtn, { backgroundColor: palette.tint }]} disabled>
                        <Feather name="send" size={30} color="#FFFFFF" />
                    </Pressable>
                </ThemedView>
            </KeyboardAvoidingView>
        </ThemedView>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        padding: 15,
        paddingTop: 50,
        position: 'relative',
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    leftHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    rightHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        borderTopWidth: 1,
    },
    dividerLabel: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    dividerText: {
        fontSize: 13,
        fontWeight: '600',
    },
    chatWithSellerBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    list: {
        padding: 16,
        gap: 12
    },
    row: {
        flexDirection: 'row'
    },
    rowStart: {
        justifyContent: 'flex-start'
    },
    rowEnd: {
        justifyContent: 'flex-end'
    },
    bubble: {
        maxWidth: '82%',
        paddingVertical: 10,
        paddingHorizontal: 14
    },
    bubbleUser: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 0,
    },
    bubbleSeller: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 16,
    },
    message: {
        fontSize: 15,
        lineHeight: 20
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    inputRow: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 18,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 6
    },
    sendBtn: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '100%'
    },
    sendLabel: {
        color: '#fff',
        fontWeight: '600'
    },
});