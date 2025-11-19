import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Keyboard,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Theme } from '../constants';
import type { ChatScreenProps } from '../types';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

/**
 * ChatScreen Component
 * Redesigned to match modern chat interface with profile header and message bubbles
 */
// Face emojis list
const FACE_EMOJIS = [
  '😊',
  '😃',
  '😄',
  '😁',
  '😆',
  '😅',
  '🤣',
  '😂',
  '🙂',
  '🙃',
  '😉',
  '😌',
  '😍',
  '🥰',
  '😘',
  '😗',
  '😙',
  '😚',
  '😋',
  '😛',
  '😝',
  '😜',
  '🤪',
  '🤨',
  '🧐',
  '🤓',
  '😎',
  '🤩',
  '🥳',
  '😏',
  '😒',
  '😞',
  '😔',
  '😟',
  '😕',
  '🙁',
  '☹️',
  '😣',
  '😖',
  '😫',
  '😩',
  '🥺',
  '😢',
  '😭',
  '😤',
  '😠',
  '😡',
  '🤬',
  '🤯',
  '😳',
  '🥵',
  '🥶',
  '😱',
  '😨',
  '😰',
  '😥',
  '😓',
  '🤗',
  '🤔',
  '🤭',
  '🤫',
  '🤥',
  '😶',
  '😐',
  '😑',
  '😬',
  '🙄',
  '😯',
  '😦',
  '😧',
  '😮',
  '😲',
  '🥱',
  '😴',
  '🤤',
  '😪',
  '😵',
  '🤐',
  '🥴',
  '🤢',
  '🤮',
  '🤧',
  '😷',
  '🤒',
  '🤕',
  '🤑',
  '🤠',
  '😈',
  '👿',
  '💀',
  '☠️',
  '💩',
  '🤡',
  '👹',
  '👺',
  '👻',
  '👽',
  '👾',
  '🤖',
  '😺',
  '😸',
  '😹',
  '😻',
  '😼',
  '😽',
  '🙀',
  '😿',
  '😾',
];

export default function ChatScreen({ onEndChat, onNextChat }: ChatScreenProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const inputScaleAnim = useRef(new Animated.Value(1)).current;
  const keyboardHeightAnim = useRef(new Animated.Value(0)).current;
  const emojiPickerAnim = useRef(new Animated.Value(0)).current;
  const dot1Anim = useRef(new Animated.Value(0.3)).current;
  const dot2Anim = useRef(new Animated.Value(0.3)).current;
  const dot3Anim = useRef(new Animated.Value(0.3)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Generate a random contact name for demo
  const contactName = 'Anonymous User';
  const contactStatus = 'Typing...';

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

  // Loading dots animation for connecting state
  useEffect(() => {
    if (isConnecting) {
      const createPulse = (anim: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, {
              toValue: 1,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.3,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        );
      };

      const animation = Animated.parallel([
        createPulse(dot1Anim, 0),
        createPulse(dot2Anim, 200),
        createPulse(dot3Anim, 400),
      ]);

      animation.start();

      // Simulate connection after 2-3 seconds
      const connectionTimer = setTimeout(() => {
        setIsConnecting(false);
        animation.stop();
      }, 2500);

      return () => {
        animation.stop();
        clearTimeout(connectionTimer);
      };
    }
  }, [isConnecting, dot1Anim, dot2Anim, dot3Anim]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        isUser: true,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
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

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleNextChat = () => {
    setMessages([]);
    setMessage('');
    setIsConnecting(true);
    setShowEmojiPicker(false);
    onNextChat();
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
    setMessage(prev => prev + emoji);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    const isToday =
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();

    if (isToday) {
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      return `Today, ${
        months[messageDate.getMonth()]
      } ${messageDate.getDate()}`;
    }
    return null;
  };

  const shouldShowDate = (currentMsg: Message, previousMsg: Message | null) => {
    if (!previousMsg) return true;
    const currentDate = new Date(currentMsg.timestamp);
    const previousDate = new Date(previousMsg.timestamp);
    return (
      currentDate.getDate() !== previousDate.getDate() ||
      currentDate.getMonth() !== previousDate.getMonth() ||
      currentDate.getFullYear() !== previousDate.getFullYear()
    );
  };

  const shouldShowTimestamp = (
    currentMsg: Message,
    nextMsg: Message | null,
  ) => {
    if (!nextMsg) return true;
    const currentDate = new Date(currentMsg.timestamp);
    const nextDate = new Date(nextMsg.timestamp);
    const timeDiff = Math.abs(nextDate.getTime() - currentDate.getTime());
    return timeDiff > 5 * 60 * 1000 || currentMsg.isUser !== nextMsg.isUser;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
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
          <View style={styles.header}>
            <View style={styles.headerCenter}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  {/* <Text style={styles.avatarText}>
                    {contactName.charAt(0).toUpperCase()}
                  </Text> */}
                  <Image
                    source={require('../assets/chatme_avatar.png')}
                    style={styles.avatar}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.contactName}>{contactName}</Text>
                <Text style={styles.contactStatus}>{contactStatus}</Text>
              </View>
            </View>
          </View>

          {/* Messages Area */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="interactive"
          >
            {messages.length === 0 ? (
              <View style={styles.emptyState}>
                {isConnecting ? (
                  <>
                    <View style={styles.emptyStateIconContainer}>
                      {/* <Image
                        source={require('../assets/chatme_avatar.png')}
                        style={styles.emptyStateIcon}
                        resizeMode="contain"
                      /> */}
                      <Text style={styles.searchIcon}>🔍</Text>
                    </View>
                    <Text style={styles.emptyStateText}>
                      Connecting to a random stranger
                    </Text>
                    <View style={styles.loadingDotsContainer}>
                      <Animated.View
                        style={[
                          styles.loadingDot,
                          {
                            opacity: dot1Anim,
                            transform: [{ scale: dot1Anim }],
                          },
                        ]}
                      />
                      <Animated.View
                        style={[
                          styles.loadingDot,
                          {
                            opacity: dot2Anim,
                            transform: [{ scale: dot2Anim }],
                          },
                        ]}
                      />
                      <Animated.View
                        style={[
                          styles.loadingDot,
                          {
                            opacity: dot3Anim,
                            transform: [{ scale: dot3Anim }],
                          },
                        ]}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.emptyStateIconContainer}>
                      <Image
                        source={require('../assets/chatme.png')}
                        style={styles.emptyStateIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.emptyStateText}>
                      Connected! Start chatting...
                    </Text>
                    <Text style={styles.emptyStateSubtext}>
                      Your messages will appear here
                    </Text>
                  </>
                )}
              </View>
            ) : (
              messages.map((msg, index) => {
                const previousMsg = index > 0 ? messages[index - 1] : null;
                const nextMsg =
                  index < messages.length - 1 ? messages[index + 1] : null;
                const showDate = shouldShowDate(msg, previousMsg);
                const showTimestamp = shouldShowTimestamp(msg, nextMsg);

                return (
                  <View key={msg.id}>
                    {showDate && (
                      <View style={styles.dateSeparator}>
                        <Text style={styles.dateText}>
                          {formatDate(msg.timestamp)}
                        </Text>
                      </View>
                    )}
                    <View
                      style={[
                        styles.messageWrapper,
                        msg.isUser && styles.messageWrapperRight,
                      ]}
                    >
                      <View
                        style={[
                          styles.messageBubble,
                          msg.isUser ? styles.userMessage : styles.otherMessage,
                        ]}
                      >
                        <Text
                          style={[
                            styles.messageText,
                            msg.isUser
                              ? styles.userMessageText
                              : styles.otherMessageText,
                          ]}
                        >
                          {msg.text}
                        </Text>
                      </View>
                      {showTimestamp && (
                        <Text style={styles.timestamp}>
                          {formatTime(msg.timestamp)}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <Animated.View
              style={[
                styles.emojiPickerContainer,
                {
                  opacity: emojiPickerAnim,
                  transform: [
                    {
                      translateY: emojiPickerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [100, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.emojiPickerHeader}>
                <Text style={styles.emojiPickerTitle}>Face Emojis</Text>
                <TouchableOpacity
                  onPress={toggleEmojiPicker}
                  style={styles.emojiPickerCloseButton}
                >
                  <Text style={styles.emojiPickerCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                style={styles.emojiPickerScroll}
                contentContainerStyle={styles.emojiPickerContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {FACE_EMOJIS.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.emojiItem}
                    onPress={() => handleEmojiSelect(emoji)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.emojiItemText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          )}

          {/* Input Area */}
          <Animated.View
            style={[
              styles.inputContainer,
              {
                transform: [{ scale: inputScaleAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.inputIcon,
                showEmojiPicker && styles.inputIconActive,
              ]}
              onPress={toggleEmojiPicker}
              activeOpacity={0.7}
              disabled={isConnecting}
            >
              <Text
                style={[
                  styles.iconText,
                  isConnecting && styles.iconTextDisabled,
                ]}
              >
                😊
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Hey..."
              placeholderTextColor={Colors.textGray}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                !message.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!message.trim()}
              activeOpacity={0.7}
            >
              <Text style={styles.sendIcon}>➤</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Action buttons at bottom - hide when keyboard is visible */}
          {keyboardHeight === 0 && (
            <View style={styles.bottomActions}>
              <TouchableOpacity
                style={styles.bottomActionButton}
                onPress={onEndChat}
                activeOpacity={0.7}
              >
                <Text style={styles.bottomActionText}>End Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bottomActionButton, styles.nextActionButton]}
                onPress={handleNextChat}
                activeOpacity={0.7}
              >
                <Text style={styles.bottomActionText}>Next</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.white,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    ...Theme.shadow.small,
  },
  backButton: {
    padding: Theme.spacing.xs,
    marginRight: Theme.spacing.sm,
  },
  backIcon: {
    fontSize: 24,
    color: Colors.textDark,
    fontWeight: Theme.fontWeight.bold,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: Theme.spacing.sm,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.white,
  },
  headerInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.textDark,
    marginBottom: 2,
  },
  contactStatus: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textGray,
    fontStyle: 'italic',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: Theme.spacing.xs,
    marginLeft: Theme.spacing.sm,
  },
  actionIcon: {
    fontSize: 24,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  messagesContent: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  emptyStateIconContainer: {
    marginBottom: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateIcon: {
    width: 90,
    height: 90,
  },
  searchIcon: {
    fontSize: 64,
    color: Colors.textDark,
  },
  emptyStateText: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.textDark,
    marginBottom: Theme.spacing.md,
  },
  emptyStateSubtext: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textGray,
    marginTop: Theme.spacing.xs,
  },
  loadingDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.md,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginHorizontal: Theme.spacing.xs,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: Theme.spacing.md,
  },
  dateText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textGray,
    fontWeight: Theme.fontWeight.medium,
  },
  messageWrapper: {
    marginBottom: Theme.spacing.xs,
    maxWidth: '75%',
  },
  messageWrapperRight: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  messageBubble: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: 18,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  userMessage: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  otherMessage: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  messageText: {
    fontSize: Theme.fontSize.md,
    lineHeight: 20,
    color: Colors.textDark,
  },
  userMessageText: {
    color: Colors.textDark,
  },
  otherMessageText: {
    color: Colors.textDark,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.textGray,
    marginTop: 4,
    marginHorizontal: Theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? Theme.spacing.sm : Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    alignItems: 'center',
  },
  inputIcon: {
    padding: Theme.spacing.xs,
    marginHorizontal: Theme.spacing.xs,
  },
  inputIconActive: {
    backgroundColor: '#F3F4F6',
    borderRadius: Theme.borderRadius.md,
  },
  iconText: {
    fontSize: 24,
  },
  iconTextDisabled: {
    opacity: 0.5,
  },
  emojiPickerContainer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    maxHeight: 300,
    ...Theme.shadow.medium,
  },
  emojiPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  emojiPickerTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.textDark,
  },
  emojiPickerCloseButton: {
    padding: Theme.spacing.xs,
  },
  emojiPickerCloseText: {
    fontSize: 20,
    color: Colors.textGray,
    fontWeight: Theme.fontWeight.bold,
  },
  emojiPickerScroll: {
    maxHeight: 250,
  },
  emojiPickerContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Theme.spacing.sm,
  },
  emojiItem: {
    width: '12.5%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xs,
  },
  emojiItemText: {
    fontSize: 28,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    fontSize: Theme.fontSize.md,
    color: Colors.textDark,
    maxHeight: 100,
    marginHorizontal: Theme.spacing.xs,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Theme.spacing.xs,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.textGray,
    opacity: 0.5,
  },
  sendIcon: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: Theme.fontWeight.bold,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: Colors.white,
  },
  bottomActionButton: {
    flex: 1,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    marginHorizontal: Theme.spacing.xs,
  },
  nextActionButton: {
    backgroundColor: '#DBEAFE',
  },
  bottomActionText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.textDark,
  },
});
