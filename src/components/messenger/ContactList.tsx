import { Contact } from './types';
import Avatar from './Avatar';

interface Props {
  contacts: Contact[];
  activeId: string | null;
  onSelect: (id: string) => void;
  currentUser: string;
}

function formatTime(time?: string) {
  return time || '';
}

export default function ContactList({ contacts, activeId, onSelect, currentUser }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '16px 16px 12px',
        borderBottom: '1px solid #0e1621',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
          Family
        </span>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: '#2b5278', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer',
        }}>
          {currentUser[0]?.toUpperCase()}
        </div>
      </div>

      {/* Search bar */}
      <div style={{ padding: '8px 12px' }}>
        <div style={{
          background: '#0e1621', borderRadius: 20,
          padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ color: '#6b7a8d', fontSize: 14 }}>🔍</span>
          <span style={{ color: '#6b7a8d', fontSize: 14 }}>Поиск</span>
        </div>
      </div>

      {/* Contacts */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {contacts.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 16px', cursor: 'pointer',
              background: activeId === c.id ? '#2b5278' : 'transparent',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => {
              if (activeId !== c.id) (e.currentTarget as HTMLDivElement).style.background = '#1e2a36';
            }}
            onMouseLeave={(e) => {
              if (activeId !== c.id) (e.currentTarget as HTMLDivElement).style.background = 'transparent';
            }}
          >
            <Avatar name={c.name} size="md" online={c.online} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{c.name}</span>
                <span style={{ fontSize: 12, color: '#6b7a8d', flexShrink: 0, marginLeft: 4 }}>
                  {formatTime(c.lastTime)}
                </span>
              </div>
              <div style={{
                fontSize: 13, color: '#6b7a8d',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {c.lastMessage}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
