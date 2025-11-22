import { motion } from 'framer-motion';
import type { ConnectionState } from '../../../types';
import './ChatInput.css';

interface ChatInputProps {
  message: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onToggleEmojiPicker: () => void;
  connectionState: ConnectionState;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  message,
  onChangeText,
  onSend,
  onToggleEmojiPicker,
  connectionState,
}) => {
  const canSend = connectionState === 'matched' && message.trim().length > 0;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend) {
        onSend();
      }
    }
  };

  return (
    <div className="chat-input-container glass">
      <button
        className="emoji-button"
        onClick={onToggleEmojiPicker}
        aria-label="Toggle emoji picker"
        disabled={connectionState !== 'matched'}
      >
        😊
      </button>
      
      <input
        type="text"
        className="chat-input"
        placeholder={connectionState === 'matched' ? 'Type a message...' : 'Waiting for connection...'}
        value={message}
        onChange={(e) => onChangeText(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={connectionState !== 'matched'}
      />
      
      <motion.button
        className={`send-button ${canSend ? 'active' : ''}`}
        onClick={onSend}
        disabled={!canSend}
        whileTap={canSend ? { scale: 0.95 } : {}}
        aria-label="Send message"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="22" y1="2" x2="11" y2="13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>
    </div>
  );
};
