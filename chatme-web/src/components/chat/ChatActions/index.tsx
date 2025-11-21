import { motion } from 'framer-motion';
import type { ConnectionState } from '../../../types';
import './ChatActions.css';

interface ChatActionsProps {
  onEndChat: () => void;
  onNextChat: () => void;
  connectionState: ConnectionState;
}

export const ChatActions: React.FC<ChatActionsProps> = ({
  onEndChat,
  onNextChat,
  connectionState,
}) => {
  const isMatched = connectionState === 'matched';

  return (
    <div className="chat-actions">
      <motion.button
        className="action-button next-button"
        onClick={onNextChat}
        disabled={!isMatched}
        whileHover={isMatched ? { scale: 1.05 } : {}}
        whileTap={isMatched ? { scale: 0.95 } : {}}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="13 17 18 12 13 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="6 17 11 12 6 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Next Chat
      </motion.button>
      
      <motion.button
        className="action-button end-button"
        onClick={onEndChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        End Chat
      </motion.button>
    </div>
  );
};
