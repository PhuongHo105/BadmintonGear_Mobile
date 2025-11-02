import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FullButton from '@/components/ui/fullbutton';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { FC } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';


const FeedbackScreen: FC = () => {
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const textColor: string = Colors[scheme].text;
    const secondaryText: string = Colors[scheme].secondaryText;
    const tint: string = Colors[scheme].tint;

    const [rating, setRating] = React.useState<number>(0); // 0..5
    const [comment, setComment] = React.useState<string>('');
    const [isFocused, setIsFocused] = React.useState<boolean>(false);

    const onSubmit = () => {
        if (rating <= 0) {
            Alert.alert('Thiếu thông tin', 'Vui lòng chọn số sao đánh giá.');
            return;
        }
        // Optionally validate comment length; we’ll accept empty comment
        Alert.alert('Cảm ơn bạn!', 'Đánh giá của bạn đã được ghi nhận.');
        // Here you could call an API to submit rating/comment
        setRating(0);
        setComment('');
    };

    const Star = ({ filled }: { filled: boolean }) => (
        <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <Path
                d="M11.9902 2.75C12.3502 2.75 12.6902 2.96 12.8502 3.28L14.6602 6.93C14.7202 7.05 14.8702 7.16 15.0002 7.16L19.0602 7.75C19.7502 7.85 20.0202 8.64 19.5202 9.13L16.6002 12C16.5002 12.09 16.4502 12.27 16.4802 12.41L17.1602 16.45C17.2802 17.13 16.6102 17.64 15.9902 17.34L12.3602 15.59C12.2302 15.53 12.0002 15.53 11.8702 15.59L8.24022 17.34C7.62022 17.64 6.95022 17.13 7.07022 16.45L7.75022 12.41C7.77022 12.27 7.72022 12.09 7.62022 12L4.70022 9.13C4.20022 8.64 4.47022 7.85 5.16022 7.75L9.22022 7.16C9.35022 7.14 9.50022 7.05 9.56022 6.93L11.3702 3.28C11.5302 2.96 11.8302 2.75 12.0002 2.75H11.9902Z"
                fill={filled ? tint : 'transparent'}
                stroke={filled ? tint : Colors[scheme].icon}
                strokeWidth={1.5}
            />
        </Svg>
    );

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>Feedback</ThemedText>
                </ThemedView>
            </ThemedView>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <ThemedView style={{ gap: 16 }}>
                        <ThemedView style={{ gap: 8 }}>
                            <ThemedText style={{ color: textColor, fontSize: 16, fontWeight: '600' }}>Score</ThemedText>
                            <View style={styles.starsRow}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Pressable key={i} onPress={() => setRating(i)} hitSlop={8}>
                                        <Star filled={i <= rating} />
                                    </Pressable>
                                ))}
                            </View>
                            <ThemedText style={{ color: secondaryText, fontSize: 12 }}>{rating > 0 ? `${rating}/5` : 'Chọn số sao'}</ThemedText>
                        </ThemedView>

                        <ThemedView style={{ gap: 8 }}>
                            <ThemedText style={{ color: textColor, fontSize: 16, fontWeight: '600' }}>Comment</ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        color: Colors[scheme].text,
                                        borderColor: isFocused ? Colors[scheme].tint : Colors[scheme].border,
                                    },
                                ]}
                                multiline
                                numberOfLines={5}
                                value={comment}
                                onChangeText={setComment}
                                placeholder="Hãy chia sẻ cảm nhận của bạn..."
                                placeholderTextColor={Colors[scheme].icon}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                maxLength={500}
                            />
                            <ThemedText style={{ color: secondaryText, fontSize: 12 }}>{comment.length}/500</ThemedText>
                        </ThemedView>
                        <FullButton text="Submit Feedback" onPress={onSubmit} />
                    </ThemedView>
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedView>
    )
}

export default FeedbackScreen;

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
    starsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        textAlignVertical: 'top',
    },
});