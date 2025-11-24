import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useChatWebSocket } from '../../hooks/useChatWebSocket';
import { AnimatedBackground } from '../../components/common/AnimatedBackground';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { Footer } from '../../components/common/Footer';
import { ChatHeader } from '../../components/chat/ChatHeader';
import { MessageList } from '../../components/chat/MessageList';
import { ChatInput } from '../../components/chat/ChatInput';
import { EmojiPicker } from '../../components/chat/EmojiPicker';
import { ChatActions } from '../../components/chat/ChatActions';
import { logger } from '../../utils/logger';
import './ChatScreen.css';

export const ChatScreen: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const {
    connectionState,
    messages,
    sendMessage: sendWebSocketMessage,
    startSearch,
    endChat: endWebSocketChat,
    partnerId,
    disconnect,
    clearMessages,
    isPartnerTyping,
    notifyTyping,
  } = useChatWebSocket();

  const isConnecting = connectionState === 'connecting' || connectionState === 'searching';

  const contactName = partnerId
    ? `Anonymous ${partnerId.substring(0, 8)}`
    : 'Anonymous User';
  const contactStatus =
    connectionState === 'searching'
      ? 'Finding a stranger...'
      : connectionState === 'matched'
      ? isPartnerTyping
        ? 'typing...'
        : 'Online'
      : connectionState === 'connecting'
      ? 'Connecting...'
      : 'Offline';

  useEffect(() => {
    logger.debug('[ChatScreen] Starting search on mount');
    startSearch();
  }, [startSearch]);

  const handleSend = () => {
    if (message.trim() && connectionState === 'matched') {
      sendWebSocketMessage(message.trim());
      setMessage('');
    }
  };

  const handleNextChat = () => {
    setMessage('');
    clearMessages();
    setShowEmojiPicker(false);
    endWebSocketChat();
  };

  const handleEndChat = () => {
    disconnect();
    navigate('/');
  };

  const handleEmojiSelect = (emoji: string) => {
    if (connectionState === 'matched') {
      sendWebSocketMessage(emoji);
      setShowEmojiPicker(false);
    } else {
      setMessage(prev => prev + emoji);
    }
  };

  return (
    <div className="chat-screen">
      <AnimatedBackground variant="chat" />
      
      <div className="theme-toggle-container">
        <ThemeToggle />
      </div>

      <motion.div
        className="chat-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ChatHeader contactName={contactName} contactStatus={contactStatus} />
        
        <MessageList 
          messages={messages} 
          isConnecting={isConnecting}
          isPartnerTyping={isPartnerTyping}
        />
        
        <div className="input-section">
          <EmojiPicker
            visible={showEmojiPicker}
            onSelect={handleEmojiSelect}
          />
          
          <ChatInput
            message={message}
            onChangeText={setMessage}
            onSend={handleSend}
            onToggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
            connectionState={connectionState}
            onTyping={notifyTyping}
          />
        </div>
        
        <ChatActions
          onEndChat={handleEndChat}
          onNextChat={handleNextChat}
          connectionState={connectionState}
        />
      </motion.div>

      <Footer />
    </div>
  );
};
