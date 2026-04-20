import { Message } from './types';

interface Props {
  message: Message;
  isOwn: boolean;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function MessageBubble({ message, isOwn }: Props) {
  const bubbleBg = isOwn ? '#2b5278' : '#1e2a36';

  return (
    <div style={{
      display: 'flex',
      justifyContent: isOwn ? 'flex-end' : 'flex-start',
      marginBottom: 4,
      padding: '2px 16px',
    }}>
      <div style={{
        maxWidth: '65%',
        background: bubbleBg,
        borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        padding: '8px 12px',
        position: 'relative',
        wordBreak: 'break-word',
      }}>
        {/* Text message */}
        {message.type === 'text' && message.text && (
          <div style={{ fontSize: 15, color: '#e8edf0', lineHeight: 1.45 }}>
            {message.text}
          </div>
        )}

        {/* Image */}
        {message.type === 'image' && message.file && (
          <div>
            <img
              src={message.file.url}
              alt={message.file.name}
              style={{ maxWidth: 280, maxHeight: 280, borderRadius: 10, display: 'block', cursor: 'pointer' }}
              onClick={() => window.open(message.file!.url, '_blank')}
            />
            {message.text && (
              <div style={{ fontSize: 14, color: '#e8edf0', marginTop: 6 }}>{message.text}</div>
            )}
          </div>
        )}

        {/* Video */}
        {message.type === 'video' && message.file && (
          <video
            src={message.file.url}
            controls
            style={{ maxWidth: 280, maxHeight: 200, borderRadius: 10, display: 'block' }}
          />
        )}

        {/* Document */}
        {message.type === 'document' && message.file && (
          <a
            href={message.file.url}
            download={message.file.name}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              textDecoration: 'none', color: 'inherit',
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: '#2b5278', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0,
            }}>
              📄
            </div>
            <div>
              <div style={{ fontSize: 14, color: '#e8edf0', fontWeight: 500 }}>{message.file.name}</div>
              <div style={{ fontSize: 12, color: '#8a9bb0' }}>{formatSize(message.file.size)}</div>
            </div>
          </a>
        )}

        {/* Time */}
        <div style={{
          fontSize: 11, color: '#8a9bb0',
          textAlign: 'right', marginTop: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4,
        }}>
          {formatTime(message.timestamp)}
          {isOwn && <span style={{ color: '#6ea8d8' }}>✓✓</span>}
        </div>
      </div>
    </div>
  );
}
