import './ChatHeader.css';

interface ChatHeaderProps {
  contactName: string;
  contactStatus: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ contactName, contactStatus }) => {
  const isOnline = contactStatus === 'Online';
  
  return (
    <div className="chat-header glass">
      <div className="contact-avatar">
        <div className="avatar-circle gradient-bg">
          <span>👤</span>
        </div>
        {isOnline && <div className="status-indicator online" />}
      </div>
      <div className="contact-info">
        <h2 className="contact-name">{contactName}</h2>
        <p className="contact-status">{contactStatus}</p>
      </div>
    </div>
  );
};
