import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
  Keyboard,
  ScrollView,
  Platform,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemedColors } from '../hooks';
import { useTheme } from '../contexts/ThemeContext';
import type { ChatScreenProps } from '../types';
import { useChatWebSocket } from '../hooks/useChatWebSocket';
import {
  ChatHeader,
  MessageList,
  EmojiPicker,
  ChatInput,
  ChatActions,
  ThemeToggle,
} from '../components';

/**
 * ChatScreen Component
 * Redesigned to match modern chat interface with profile header and message bubbles
 */

export default function ChatScreen({ onEndChat, onNextChat }: ChatScreenProps) {
  const Colors = useThemedColors();
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const inputScaleAnim = useRef(new Animated.Value(1)).current;
  const keyboardHeightAnim = useRef(new Animated.Value(0)).current;
  const emojiPickerAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // WebSocket hook for real-time chat
  const {
    connectionState,
    messages,
    sendMessage: sendWebSocketMessage,
    sendImage: sendWebSocketImage,
    startSearch,
    endChat: endWebSocketChat,
    partnerId,
    disconnect,
    clearMessages,
  } = useChatWebSocket();

  // Determine if we're connecting/searching
  const isConnecting =
    connectionState === 'connecting' || connectionState === 'searching';

  // Generate contact name and status based on connection state
  const contactName = partnerId
    ? `Anonymous ${partnerId.substring(0, 8)}`
    : 'Anonymous User';
  const contactStatus =
    connectionState === 'searching'
      ? 'Finding a stranger...'
      : connectionState === 'matched'
      ? 'Online'
      : connectionState === 'connecting'
      ? 'Connecting...'
      : 'Offline';

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Keyboard listeners - listen to all keyboard events including height changes
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      event => {
        const height = event.endCoordinates.height;
        setKeyboardHeight(height);
        Animated.timing(keyboardHeightAnim, {
          toValue: height,
          duration: event.duration || 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      },
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      event => {
        setKeyboardHeight(0);
        Animated.timing(keyboardHeightAnim, {
          toValue: 0,
          duration: event.duration || 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      },
    );

    // Listen to keyboard frame changes (important for emoji picker)
    const keyboardWillChangeFrameListener = Keyboard.addListener(
      'keyboardWillChangeFrame',
      event => {
        const height = event.endCoordinates.height;
        setKeyboardHeight(height);
        Animated.timing(keyboardHeightAnim, {
          toValue: height,
          duration: event.duration || 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      },
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
      keyboardWillChangeFrameListener.remove();
    };
  }, [keyboardHeightAnim]);

  // Start search when component mounts
  useEffect(() => {
    console.log('[ChatScreen] Starting search on mount');
    startSearch();

    return () => {
      // Cleanup: disconnect when unmounting
      console.log('[ChatScreen] Component unmounting, disconnecting');
    };
  }, [startSearch]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (message.trim() && connectionState === 'matched') {
      // Send message through WebSocket
      sendWebSocketMessage(message.trim());
      setMessage('');

      // Animate input
      Animated.sequence([
        Animated.timing(inputScaleAnim, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(inputScaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleNextChat = () => {
    setMessage('');
    clearMessages();
    setShowEmojiPicker(false);
    // End current chat and search for new partner
    endWebSocketChat();
  };

  const handleEndChatButton = () => {
    // Disconnect and go back to home screen
    disconnect();
    onEndChat();
  };

  const toggleEmojiPicker = () => {
    const newValue = !showEmojiPicker;
    setShowEmojiPicker(newValue);

    if (newValue) {
      // Hide keyboard when opening emoji picker
      Keyboard.dismiss();
      Animated.spring(emojiPickerAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(emojiPickerAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    // Send emoji directly as quick reaction if connected and matched
    if (connectionState === 'matched') {
      sendWebSocketMessage(emoji);
      // Close emoji picker after sending
      setShowEmojiPicker(false);
      Animated.spring(emojiPickerAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      // If not matched, fall back to adding to text input
      setMessage(prev => prev + emoji);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: Colors.background }]}
      edges={['top']}
    >
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.background}
        translucent
      />

      {/* Theme Toggle Button */}
      <View style={styles.themeToggleContainer}>
        <ThemeToggle />
      </View>

      <Animated.View
        style={[
          styles.container,
          {
            paddingBottom: keyboardHeightAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <ChatHeader contactName={contactName} contactStatus={contactStatus} />

          {/* Messages Area */}
          <MessageList
            messages={messages}
            isConnecting={isConnecting}
            scrollViewRef={scrollViewRef as React.RefObject<ScrollView>}
          />

          {/* Emoji Picker */}
          <EmojiPicker
            visible={showEmojiPicker}
            onSelect={handleEmojiSelect}
            animationValue={emojiPickerAnim}
          />

          {/* Input Area */}
          <ChatInput
            message={message}
            onChangeText={setMessage}
            onSend={handleSend}
            onSendImage={sendWebSocketImage}
            onToggleEmojiPicker={toggleEmojiPicker}
            showEmojiPicker={showEmojiPicker}
            connectionState={connectionState}
            isConnecting={isConnecting}
            inputScaleAnim={inputScaleAnim}
          />

          {/* Action buttons at bottom - hide when keyboard is visible */}
          <ChatActions
            onEndChat={handleEndChatButton}
            onNextChat={handleNextChat}
            connectionState={connectionState}
            visible={keyboardHeight === 0}
          />
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  themeToggleContainer: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
  },
});
