import { useEffect, useRef, useState } from 'react';
import { Contact } from './types';
import Avatar from './Avatar';

interface Props {
  contact: Contact;
  mode: 'calling' | 'incoming' | 'active';
  onAccept?: () => void;
  onDecline: () => void;
}

export default function VideoCall({ contact, mode, onAccept, onDecline }: Props) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Request camera+mic when call becomes active
  useEffect(() => {
    if (mode === 'active') {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setLocalStream(stream);
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        })
        .catch(() => setCameraError(true));
    }
    return () => {
      localStream?.getTracks().forEach((t) => t.stop());
    };
  }, [mode]);

  // Timer for active call
  useEffect(() => {
    if (mode !== 'active') return;
    const interval = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => clearInterval(interval);
  }, [mode]);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(14,22,33,0.97)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Remote video (fake for demo) */}
      {mode === 'active' && (
        <div style={{
          width: '100%', maxWidth: 480, aspectRatio: '16/9',
          background: '#0e1621', borderRadius: 16, marginBottom: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ textAlign: 'center', color: '#6b7a8d' }}>
            <Avatar name={contact.name} size="lg" />
            <div style={{ marginTop: 12, fontSize: 14 }}>Камера собеседника</div>
          </div>

          {/* Local video (PiP) */}
          {!cameraError ? (
            <video
              ref={localVideoRef}
              autoPlay muted playsInline
              style={{
                position: 'absolute', bottom: 12, right: 12,
                width: 100, height: 75, borderRadius: 8,
                objectFit: 'cover', background: '#17212b',
                border: '2px solid #2b5278',
              }}
            />
          ) : (
            <div style={{
              position: 'absolute', bottom: 12, right: 12,
              width: 100, height: 75, borderRadius: 8,
              background: '#17212b', border: '2px solid #2b5278',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: '#6b7a8d', textAlign: 'center', padding: 4,
            }}>
              Нет камеры
            </div>
          )}
        </div>
      )}

      {/* Contact info */}
      {mode !== 'active' && (
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <Avatar name={contact.name} size="lg" />
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{contact.name}</div>
        <div style={{ fontSize: 14, color: '#6b7a8d', marginTop: 4 }}>
          {mode === 'calling' && 'Вызов...'}
          {mode === 'incoming' && 'Входящий видеозвонок'}
          {mode === 'active' && formatDuration(callDuration)}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 24, marginTop: 32 }}>
        {mode === 'incoming' && onAccept && (
          <button
            onClick={onAccept}
            style={{
              width: 64, height: 64, borderRadius: '50%',
              background: '#4cd964', border: 'none', cursor: 'pointer',
              fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            📞
          </button>
        )}
        <button
          onClick={onDecline}
          style={{
            width: 64, height: 64, borderRadius: '50%',
            background: '#e05f6b', border: 'none', cursor: 'pointer',
            fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {mode === 'active' ? '📵' : '❌'}
        </button>
      </div>

      {mode === 'calling' && (
        <div style={{ marginTop: 16, fontSize: 13, color: '#6b7a8d' }}>
          Нажмите ❌ чтобы отменить вызов
        </div>
      )}
    </div>
  );
}
