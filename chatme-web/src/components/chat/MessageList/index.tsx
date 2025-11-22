import { useEffect, useRef } from 'react';
import type { Message } from '../../../types';
import { MessageBubble } from '../MessageBubble';
import { LoadingIndicator } from '../../common/LoadingIndicator';
import './MessageList.css';

interface MessageListProps {
  messages: Message[];
  isConnecting: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isConnecting }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="message-list" ref={scrollRef}>
      {isConnecting && messages.length === 0 ? (
        <div className="message-list-empty">
          <LoadingIndicator text="Finding a stranger..." />
        </div>
      ) : messages.length === 0 ? (
        <div className="message-list-empty">
          <p className="empty-message">Say hi to start chatting! 👋</p>
        </div>
      ) : (
        <div className="messages-container">
          {messages.map((message, index) => (
            <MessageBubble key={message.id} message={message} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};
