import { motion } from 'framer-motion';
import type { Message } from '../../../types';
import './MessageBubble.css';

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, index }) => {
  const { text, imageUrl, isUser } = message;

  return (
    <motion.div
      className={`message-bubble-container ${isUser ? 'user' : 'partner'}`}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className={`message-bubble ${isUser ? 'user' : 'partner'}`}>
        {text && <p className="message-text">{text}</p>}
        {imageUrl && <img src={imageUrl} alt="Shared" className="message-image" />}
      </div>
    </motion.div>
  );
};
