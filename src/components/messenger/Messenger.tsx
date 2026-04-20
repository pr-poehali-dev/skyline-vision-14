import { useState } from 'react';
import { useChat } from './useChat';
import ContactList from './ContactList';
import ChatWindow from './ChatWindow';
import { Message } from './types';

interface Props {
  currentUser: string;
  onLogout: () => void;
}

export default function Messenger({ currentUser, onLogout }: Props) {
  const userId = currentUser.toLowerCase().replace(/\s/g, '_');
  const { contacts, getMessages, sendMessage } = useChat(userId);
  const [activeContactId, setActiveContactId] = useState<string | null>(contacts[0]?.id || null);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const activeContact = contacts.find((c) => c.id === activeContactId) || null;
  const chatMessages = activeContactId ? getMessages(activeContactId) : [];

  const handleSelectContact = (id: string) => {
    setActiveContactId(id);
    setMobileShowChat(true);
  };

  const handleSend = (toId: string, text: string, file?: Message['file'], type?: Message['type']) => {
    sendMessage(toId, text, file, type);
  };

  return (
    <div style={{
      display: 'flex', height: '100vh', background: '#0e1621',
      fontFamily: 'Inter, system-ui, sans-serif',
      overflow: 'hidden',
    }}>
      {/* Left panel — contact list */}
      <div style={{
        width: 320, flexShrink: 0,
        background: '#17212b',
        borderRight: '1px solid #0e1621',
        display: 'flex', flexDirection: 'column',
        // Mobile: hide when chat is open
        ...(mobileShowChat ? { display: 'none' } : {}),
      }}
        className="family-sidebar"
      >
        <ContactList
          contacts={contacts}
          activeId={activeContactId}
          onSelect={handleSelectContact}
          currentUser={currentUser}
        />
        <div style={{
          padding: '12px 16px', borderTop: '1px solid #0e1621',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 13, color: '#4a5a6b' }}>
            Вы: <span style={{ color: '#8a9bb0' }}>{currentUser}</span>
          </span>
          <button
            onClick={onLogout}
            style={{
              background: 'none', border: 'none', color: '#6b7a8d',
              fontSize: 12, cursor: 'pointer', padding: '4px 8px', borderRadius: 6,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#e05f6b')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7a8d')}
          >
            Выйти
          </button>
        </div>
      </div>

      {/* Right panel — active chat */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        // Mobile: show only when chat is open
        ...(!mobileShowChat && window.innerWidth < 640 ? { display: 'none' } : {}),
      }}
        className="family-chat"
      >
        {activeContact ? (
          <ChatWindow
            contact={activeContact}
            messages={chatMessages}
            currentUserId={userId}
            onSend={handleSend}
            onBack={() => setMobileShowChat(false)}
          />
        ) : (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#0e1621', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ fontSize: 48 }}>💬</div>
            <div style={{ color: '#4a5a6b', fontSize: 15 }}>Выберите чат для начала общения</div>
          </div>
        )}
      </div>
    </div>
  );
}
