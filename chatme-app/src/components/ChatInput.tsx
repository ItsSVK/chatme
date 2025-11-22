/**
 * ChatInput Component
 * Input area with emoji button, text input, and send button
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Theme } from '../constants';
import { useThemedColors } from '../hooks';
import type { ConnectionState } from '../types/websocket';
import {
  extractBase64Image,
  extractImageUri,
  imageToBase64,
} from '../utils/imageHelpers';

interface ChatInputProps {
  message: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onSendImage?: (imageBase64: string) => void;
  onToggleEmojiPicker: () => void;
  showEmojiPicker: boolean;
  connectionState: ConnectionState;
  isConnecting: boolean;
  inputScaleAnim: Animated.Value;
}

export default function ChatInput({
  message,
  onChangeText,
  onSend,
  onSendImage,
  onToggleEmojiPicker,
  showEmojiPicker,
  connectionState,
  isConnecting,
  inputScaleAnim,
}: ChatInputProps) {
  const Colors = useThemedColors();
  const dynamicStyles = createStyles(Colors);
  const inputRef = useRef<TextInput>(null);

  const placeholder =
    connectionState === 'matched'
      ? 'Hey...'
      : connectionState === 'searching'
      ? 'Searching...'
      : 'Connecting...';

  const canSend = message.trim() && connectionState === 'matched';

  // Handle text changes and check for pasted base64 images or image URIs
  // This handles cases where images are pasted as text (base64 or URI)
  const handleTextChange = async (text: string) => {
    // Check if the text contains a base64 image (from clipboard paste)
    const base64Image = extractBase64Image(text);

    if (base64Image && onSendImage) {
      // If it's a base64 image, send it immediately and clear input
      onSendImage(base64Image);
      onChangeText('');
      return;
    }

    // Check if the text contains an image URI (content://, file://, etc.)
    const imageUri = extractImageUri(text);
    if (imageUri && onSendImage) {
      // Convert image URI to base64 and send
      onChangeText(''); // Clear input immediately
      try {
        const base64Data = await imageToBase64(imageUri);
        if (base64Data) {
          onSendImage(base64Data);
        }
      } catch (error) {
        console.error('Error converting image URI to base64:', error);
        // Restore text if conversion failed
        onChangeText(text);
      }
      return;
    }

    // Otherwise, update text normally
    onChangeText(text);
  };

  // Handle manual image selection button (📎 button)
  const handlePasteImage = () => {
    if (connectionState !== 'matched' || !onSendImage) return;

    try {
      const { launchImageLibrary } = require('react-native-image-picker');

      launchImageLibrary(
        {
          mediaType: 'photo', // Only images (includes GIFs, PNGs, JPEGs, etc.)
          includeBase64: true,
          maxHeight: 2000,
          maxWidth: 2000,
          quality: 1.0, // Use full quality to preserve GIF format
          selectionLimit: 1,
        },
        (response: any) => {
          if (response.assets && response.assets[0]) {
            const asset = response.assets[0];
            console.log('[ChatInput] Selected asset:', {
              type: asset.type,
              fileName: asset.fileName,
              uri: asset.uri?.substring(0, 50),
              hasBase64: !!asset.base64,
            });

            if (asset.base64) {
              // Preserve the original MIME type (important for GIFs!)
              // Check file extension first, then fall back to asset.type
              let mimeType = asset.type;
              if (asset.fileName) {
                const ext = asset.fileName.toLowerCase().split('.').pop();
                if (ext === 'gif') mimeType = 'image/gif';
                else if (ext === 'png') mimeType = 'image/png';
                else if (ext === 'jpg' || ext === 'jpeg')
                  mimeType = 'image/jpeg';
                else if (ext === 'webp') mimeType = 'image/webp';
              }
              // If still no type, default based on extension or use jpeg
              if (!mimeType) {
                mimeType = asset.fileName?.toLowerCase().endsWith('.gif')
                  ? 'image/gif'
                  : 'image/jpeg';
              }

              const base64Uri = `data:${mimeType};base64,${asset.base64}`;
              console.log(
                '[ChatInput] Sending image with type:',
                mimeType,
                'URI starts with:',
                base64Uri.substring(0, 30),
              );
              onSendImage(base64Uri);
            } else if (asset.uri) {
              // Convert URI to base64 if base64 not available
              // This preserves the original format
              imageToBase64(asset.uri).then(base64Uri => {
                if (base64Uri) {
                  console.log(
                    '[ChatInput] Converted URI to base64, starts with:',
                    base64Uri.substring(0, 30),
                  );
                  onSendImage(base64Uri);
                }
              });
            }
          }
        },
      );
    } catch (error) {
      console.error('Error opening image picker:', error);
    }
  };

  return (
    <Animated.View
      style={[
        dynamicStyles.container,
        {
          transform: [{ scale: inputScaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          dynamicStyles.emojiButton,
          showEmojiPicker && dynamicStyles.emojiButtonActive,
        ]}
        onPress={onToggleEmojiPicker}
        activeOpacity={0.7}
        disabled={isConnecting}
      >
        <Text
          style={[
            dynamicStyles.emojiIcon,
            isConnecting && dynamicStyles.emojiIconDisabled,
          ]}
        >
          😊
        </Text>
      </TouchableOpacity>

      {/* Manual paste/image button - workaround for Gboard image paste limitation */}
      {Platform.OS === 'android' && connectionState === 'matched' && (
        <TouchableOpacity
          style={dynamicStyles.pasteButton}
          onPress={handlePasteImage}
          activeOpacity={0.7}
          disabled={isConnecting}
        >
          <Text style={dynamicStyles.pasteIcon}>📎</Text>
        </TouchableOpacity>
      )}

      <TextInput
        ref={inputRef}
        style={dynamicStyles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        value={message}
        onChangeText={handleTextChange}
        multiline
        maxLength={5000}
        editable={connectionState === 'matched'}
        // Enable rich content support for GIFs/stickers from keyboard
        allowFontScaling={true}
        textContentType="none"
        autoCorrect={true}
        autoCapitalize="sentences"
        // Android: Enable content description for accessibility
        accessibilityLabel="Chat input"
        // Android specific props
        {...(Platform.OS === 'android' && {
          importantForAutofill: 'no',
        })}
      />

      <TouchableOpacity
        style={[
          dynamicStyles.sendButton,
          !canSend && dynamicStyles.sendButtonDisabled,
        ]}
        onPress={onSend}
        disabled={!canSend}
        activeOpacity={0.7}
      >
        <Text style={dynamicStyles.sendIcon}>➤</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: Colors.background,
      paddingVertical: Theme.spacing.sm,
      paddingHorizontal: Theme.spacing.sm,
      paddingBottom:
        Platform.OS === 'ios' ? Theme.spacing.sm : Theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: Colors.glassBorder,
      alignItems: 'center',
    },
    emojiButton: {
      padding: Theme.spacing.xs,
      marginHorizontal: Theme.spacing.xs,
    },
    emojiButtonActive: {
      backgroundColor: Colors.glassBackground,
      borderRadius: Theme.borderRadius.md,
    },
    emojiIcon: {
      fontSize: 24,
    },
    emojiIconDisabled: {
      opacity: 0.5,
    },
    pasteButton: {
      padding: Theme.spacing.xs,
      marginHorizontal: Theme.spacing.xs,
    },
    pasteIcon: {
      fontSize: 20,
    },
    input: {
      flex: 1,
      backgroundColor: Colors.glassBackground,
      borderRadius: 20,
      paddingVertical: Theme.spacing.sm,
      paddingHorizontal: Theme.spacing.md,
      fontSize: Theme.fontSize.md,
      color: Colors.text,
      maxHeight: 100,
      marginHorizontal: Theme.spacing.xs,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: Colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: Theme.spacing.xs,
    },
    sendButtonDisabled: {
      backgroundColor: Colors.textSecondary,
      opacity: 0.5,
    },
    sendIcon: {
      fontSize: 16,
      color: Colors.white,
      fontWeight: Theme.fontWeight.bold,
    },
  });
