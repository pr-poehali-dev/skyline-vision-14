import { useEffect, useRef, useState, useCallback } from 'react';
import { Contact, Message } from './types';
import Avatar from './Avatar';
import MessageBubble from './MessageBubble';
import VideoCall from './VideoCall';

interface Props {
  contact: Contact;
  messages: Message[];
  currentUserId: string;
  onSend: (toId: string, text: string, file?: Message['file'], type?: Message['type']) => void;
  onBack?: () => void;
}

const ALLOWED_TYPES: Record<string, Message['type']> = {
  'image/jpeg': 'image', 'image/png': 'image', 'image/gif': 'image', 'image/webp': 'image',
  'video/mp4': 'video', 'video/quicktime': 'video', 'video/webm': 'video',
  'application/pdf': 'document', 'application/msword': 'document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
  'text/plain': 'document',
};

type CallState = 'idle' | 'calling' | 'incoming' | 'active';

export default function ChatWindow({ contact, messages, currentUserId, onSend, onBack }: Props) {
  const [text, setText] = useState('');
  const [callState, setCallState] = useState<CallState>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendText = () => {
    if (!text.trim()) return;
    onSend(contact.id, text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const processFile = useCallback((file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      alert('Файл слишком большой. Максимум 50 МБ.');
      return;
    }
    const msgType = ALLOWED_TYPES[file.type] || 'document';
    const url = URL.createObjectURL(file);
    onSend(contact.id, '', {
      name: file.name,
      url,
      size: file.size,
      mimeType: file.type,
    }, msgType);
  }, [contact.id, onSend]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  // Simulate incoming call demo
  const handleCall = () => {
    setCallState('calling');
    setTimeout(() => {
      setCallState('active');
    }, 3000);
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div style={{
        height: 56, background: '#17212b',
        borderBottom: '1px solid #0e1621',
        display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px',
        flexShrink: 0,
      }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', color: '#6b7a8d', cursor: 'pointer', fontSize: 20, padding: '0 4px' }}
          >
            ‹
          </button>
        )}
        <Avatar name={contact.name} size="sm" online={contact.online} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{contact.name}</div>
          <div style={{ fontSize: 12, color: contact.online ? '#4cd964' : '#6b7a8d' }}>
            {contact.online ? 'онлайн' : 'был(а) недавно'}
          </div>
        </div>
        <button
          onClick={handleCall}
          title="Видеозвонок"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#5b9bd5', fontSize: 20, padding: 8, borderRadius: 8,
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#1e2a36')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
        >
          📹
        </button>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '12px 0',
        background: '#0e1621',
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(43,82,120,0.07) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(43,82,120,0.05) 0%, transparent 50%)',
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#4a5a6b', marginTop: 60, fontSize: 14 }}>
            Начните общение с {contact.name} 💬
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.fromId === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Drag overlay */}
      {isDragging && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(43,82,120,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: '#5b9bd5', pointerEvents: 'none',
          border: '2px dashed #2b5278', borderRadius: 8, zIndex: 10,
        }}>
          📎 Отпустите файл для отправки
        </div>
      )}

      {/* Input area */}
      <div style={{
        background: '#17212b', borderTop: '1px solid #0e1621',
        padding: '10px 12px', display: 'flex', alignItems: 'flex-end', gap: 8, flexShrink: 0,
      }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/mp4,video/quicktime,video/webm,application/pdf,.doc,.docx,.txt"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Прикрепить файл"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6b7a8d', fontSize: 22, padding: '6px 4px',
            transition: 'color 0.15s', flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#5b9bd5')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7a8d')}
        >
          📎
        </button>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Написать сообщение..."
          rows={1}
          style={{
            flex: 1, background: '#0e1621', border: 'none', borderRadius: 20,
            padding: '10px 16px', color: '#e8edf0', fontSize: 15, resize: 'none',
            outline: 'none', fontFamily: 'inherit', lineHeight: 1.4,
            maxHeight: 120, overflowY: 'auto',
          }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = 'auto';
            el.style.height = Math.min(el.scrollHeight, 120) + 'px';
          }}
        />

        <button
          onClick={handleSendText}
          disabled={!text.trim()}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: text.trim() ? '#2b5278' : '#1e2a36',
            border: 'none', cursor: text.trim() ? 'pointer' : 'default',
            color: text.trim() ? '#fff' : '#4a5a6b',
            fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s', flexShrink: 0,
          }}
        >
          ➤
        </button>
      </div>

      {/* Video call overlay */}
      {callState !== 'idle' && (
        <VideoCall
          contact={contact}
          mode={callState}
          onAccept={() => setCallState('active')}
          onDecline={() => setCallState('idle')}
        />
      )}
    </div>
  );
}
