import { Audio } from 'expo-av';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export interface VoiceRecognizerRef {
    start: () => void;
    stop: () => void;
}

interface VoiceRecognizerProps {
    onSpeechStart?: () => void;
    onSpeechEnd?: () => void;
    onSpeechResults?: (results: string[]) => void;
    onSpeechError?: (error: any) => void;
}

interface WebViewPermissionRequest {
    grant: (resources: string[]) => void;
    deny: () => void;
    resources?: string[];
}

const HTML = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <script>
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition = null;

        function sendMessage(type, payload) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
        }

        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'vi-VN'; 

            recognition.onstart = () => sendMessage('onSpeechStart');
            recognition.onend = () => sendMessage('onSpeechEnd');
            recognition.onerror = (e) => sendMessage('onSpeechError', {
                error: e.error,
                message: e.message,
                type: e.type
            });
            recognition.onresult = (e) => {
                const results = [];
                for (let i = 0; i < e.results.length; i++) {
                    results.push(e.results[i][0].transcript);
                }
                sendMessage('onSpeechResults', results);
            };
        } else {
             sendMessage('onSpeechError', { error: 'not-supported', message: 'Web Speech API not supported' });
        }

        window.startRecognition = () => {
             if (recognition) {
                 try {
                     recognition.start();
                 } catch (e) {
                     // Already started or other error
                     sendMessage('onSpeechError', { error: 'start-error', message: e.message });
                 }
             }
        };

        window.stopRecognition = () => {
             if (recognition) recognition.stop();
        };

    </script>
</body>
</html>
`;

const VoiceRecognizer = forwardRef<VoiceRecognizerRef, VoiceRecognizerProps>((props, ref) => {
    const webViewRef = useRef<WebView>(null);
    const [key, setKey] = useState(0); // Force reload if needed

    useImperativeHandle(ref, () => ({
        start: () => {
            webViewRef.current?.injectJavaScript(`window.startRecognition(); true;`);
        },
        stop: () => {
            webViewRef.current?.injectJavaScript(`window.stopRecognition(); true;`);
        }
    }));

    useEffect(() => {
        const configureAudioSession = async () => {
            try {
                // Important for iOS: allows usage of microphone
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });

                const { status } = await Audio.requestPermissionsAsync();
                if (status === 'granted') {
                    console.log("Microphone permission granted");
                } else {
                    console.log("Microphone permission denied");
                }
            } catch (err) {
                console.warn(err);
            }
        };

        configureAudioSession();
    }, []);

    const handleMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            switch (data.type) {
                case 'onSpeechStart':
                    props.onSpeechStart?.();
                    break;
                case 'onSpeechEnd':
                    props.onSpeechEnd?.();
                    break;
                case 'onSpeechResults':
                    props.onSpeechResults?.(data.payload);
                    break;
                case 'onSpeechError':
                    props.onSpeechError?.(data.payload);
                    break;
            }
        } catch (e) {
            console.error("VoiceRecognizer parse error", e);
        }
    };

    const WebViewAny = WebView as any;

    return (
        <View style={styles.container}>
            <WebViewAny
                key={key}
                ref={webViewRef}
                originWhitelist={['*']}
                source={{ html: HTML, baseUrl: 'https://google.com' }} // Dummy baseUrl for secure context
                onMessage={handleMessage}
                javaScriptEnabled={true}
                // Important for Android permissions
                androidLayerType="hardware"
                // Improved props for Android WebView Speech API
                domStorageEnabled={true}
                mixedContentMode="always"
                userAgent="Mozilla/5.0 (Linux; Android 10; Mobile; rv:89.0) Gecko/89.0 Firefox/89.0"

                onPermissionRequest={(req: any) => {
                    console.log("WebView onPermissionRequest", req);
                    // Grant whatever is requested to ensure we don't miss anything
                    req.grant(req.resources);
                }}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: 1,
        height: 1,
        opacity: 0,
        position: 'absolute',
        top: -10, // Move offscreen instead of hidden
    },
});

export default VoiceRecognizer;
