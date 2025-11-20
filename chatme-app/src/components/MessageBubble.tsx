/**
 * MessageBubble Component
 * Individual chat message bubble with timestamp
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Theme } from '../constants';
import { useThemedColors } from '../hooks';
import type { Message } from '../types';
import { formatTime } from '../utils';

const { width } = Dimensions.get('window');
const MAX_IMAGE_WIDTH = width * 0.6;
const MAX_IMAGE_HEIGHT = 300;

interface MessageBubbleProps {
  message: Message;
  showTimestamp: boolean;
  showDate?: boolean;
  dateText?: string | null;
}

export default function MessageBubble({
  message,
  showTimestamp,
  showDate,
  dateText,
}: MessageBubbleProps) {
  const Colors = useThemedColors();
  const dynamicStyles = createStyles(Colors);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Check if the image is a GIF (base64 data URI with image/gif MIME type)
  const imageUrl = message.imageUrl || '';
  const isGif =
    imageUrl.startsWith('data:image/gif') ||
    imageUrl.toLowerCase().includes('.gif') ||
    imageUrl.toLowerCase().includes('image/gif');

  // Debug: Log GIF detection and image info
  useEffect(() => {
    if (imageUrl) {
      console.log('[MessageBubble] Image URL type check:', {
        startsWithDataImageGif: imageUrl.startsWith('data:image/gif'),
        includesGif: imageUrl.toLowerCase().includes('.gif'),
        includesImageGif: imageUrl.toLowerCase().includes('image/gif'),
        isGif: isGif,
        urlStart: imageUrl.substring(0, 50),
      });
    }
  }, [imageUrl, isGif]);

  return (
    <View>
      {showDate && dateText && (
        <View style={dynamicStyles.dateSeparator}>
          <Text style={dynamicStyles.dateText}>{dateText}</Text>
        </View>
      )}
      <View
        style={[
          dynamicStyles.messageWrapper,
          message.isUser && dynamicStyles.messageWrapperRight,
        ]}
      >
        <View
          style={[
            dynamicStyles.messageBubble,
            message.isUser
              ? dynamicStyles.userMessage
              : dynamicStyles.otherMessage,
          ]}
        >
          {message.imageUrl ? (
            <View style={dynamicStyles.imageContainer}>
              {imageLoading && !imageError && (
                <View style={dynamicStyles.imageLoader}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              )}
              {imageError ? (
                <View style={dynamicStyles.imageErrorContainer}>
                  <Text style={dynamicStyles.imageErrorText}>
                    Failed to load image
                  </Text>
                </View>
              ) : isGif ? (
                // Use WebView for GIFs to ensure animation works (especially for base64 data URIs)
                <WebView
                  source={{
                    html: `
                      <!DOCTYPE html>
                      <html style="width: ${MAX_IMAGE_WIDTH}px; height: ${MAX_IMAGE_HEIGHT}px; margin: 0; padding: 0;">
                        <head>
                          <meta name="viewport" content="width=${MAX_IMAGE_WIDTH}, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                          <style>
                            * {
                              margin: 0;
                              padding: 0;
                              box-sizing: border-box;
                            }
                            html, body {
                              width: ${MAX_IMAGE_WIDTH}px;
                              height: ${MAX_IMAGE_HEIGHT}px;
                              overflow: hidden;
                              background: transparent;
                              margin: 0;
                              padding: 0;
                            }
                            body {
                              display: flex;
                              justify-content: center;
                              align-items: center;
                              width: ${MAX_IMAGE_WIDTH}px;
                              height: ${MAX_IMAGE_HEIGHT}px;
                            }
                            img {
                              width: ${MAX_IMAGE_WIDTH}px;
                              height: ${MAX_IMAGE_HEIGHT}px;
                              object-fit: contain;
                              display: block;
                            }
                          </style>
                        </head>
                        <body>
                          <img src="${imageUrl
                            .replace(/\\/g, '\\\\')
                            .replace(/"/g, '&quot;')
                            .replace(/'/g, '&#39;')}" alt="GIF" />
                        </body>
                      </html>
                    `,
                  }}
                  style={[
                    dynamicStyles.messageImage,
                    dynamicStyles.webViewGif,
                    message.text && dynamicStyles.messageImageWithText,
                  ]}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  bounces={false}
                  nestedScrollEnabled={false}
                  onLoadStart={() => {
                    setImageLoading(true);
                    setImageError(false);
                  }}
                  onLoadEnd={() => {
                    setImageLoading(false);
                    console.log('[MessageBubble] WebView GIF loaded');
                  }}
                  onError={syntheticEvent => {
                    const { nativeEvent } = syntheticEvent;
                    console.error(
                      '[MessageBubble] WebView error:',
                      nativeEvent,
                    );
                    setImageError(true);
                    setImageLoading(false);
                  }}
                  javaScriptEnabled={true}
                  domStorageEnabled={false}
                  originWhitelist={['*']}
                  mixedContentMode="always"
                  allowsInlineMediaPlayback={true}
                  mediaPlaybackRequiresUserAction={false}
                />
              ) : (
                <Image
                  source={{ uri: imageUrl }}
                  style={[
                    dynamicStyles.messageImage,
                    message.text && dynamicStyles.messageImageWithText,
                    imageLoading && dynamicStyles.imageLoading,
                  ]}
                  resizeMode="contain"
                  onLoadStart={() => {
                    setImageLoading(true);
                    setImageError(false);
                  }}
                  onLoadEnd={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                />
              )}
            </View>
          ) : null}
          {message.text ? (
            <Text
              style={[
                dynamicStyles.messageText,
                message.isUser
                  ? dynamicStyles.userMessageText
                  : dynamicStyles.otherMessageText,
              ]}
            >
              {message.text}
            </Text>
          ) : null}
        </View>
        {showTimestamp && (
          <Text style={dynamicStyles.timestamp}>
            {formatTime(message.timestamp)}
          </Text>
        )}
      </View>
    </View>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) =>
  StyleSheet.create({
    dateSeparator: {
      alignItems: 'center',
      marginVertical: Theme.spacing.md,
    },
    dateText: {
      fontSize: Theme.fontSize.sm,
      color: Colors.textSecondary,
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
      backgroundColor: Colors.glassBackground,
      borderWidth: 1,
      borderColor: Colors.glassBorder,
    },
    userMessage: {
      backgroundColor: Colors.primary,
      borderWidth: 1,
      borderColor: Colors.primaryLight,
    },
    otherMessage: {
      backgroundColor: Colors.glassBackground,
      borderWidth: 1,
      borderColor: Colors.glassBorder,
    },
    messageText: {
      fontSize: Theme.fontSize.md,
      lineHeight: 20,
      color: Colors.text,
    },
    userMessageText: {
      color: Colors.white,
    },
    otherMessageText: {
      color: Colors.text,
    },
    imageContainer: {
      position: 'relative',
      width: MAX_IMAGE_WIDTH,
      height: MAX_IMAGE_HEIGHT,
      borderRadius: Theme.borderRadius.md,
      overflow: 'hidden',
    },
    messageImage: {
      width: MAX_IMAGE_WIDTH,
      height: MAX_IMAGE_HEIGHT,
      borderRadius: Theme.borderRadius.md,
    },
    webViewGif: {
      backgroundColor: 'transparent',
      width: MAX_IMAGE_WIDTH,
      height: MAX_IMAGE_HEIGHT,
      borderRadius: Theme.borderRadius.md,
      flex: 0,
    },
    imageLoading: {
      opacity: 0.3,
    },
    imageLoader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    imageErrorContainer: {
      width: MAX_IMAGE_WIDTH,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.glassBackground,
      borderRadius: Theme.borderRadius.md,
    },
    imageErrorText: {
      fontSize: Theme.fontSize.sm,
      color: Colors.textSecondary,
    },
    messageImageWithText: {
      marginBottom: Theme.spacing.xs,
    },
    timestamp: {
      fontSize: 11,
      color: Colors.textSecondary,
      marginTop: 4,
      marginHorizontal: Theme.spacing.xs,
    },
  });
