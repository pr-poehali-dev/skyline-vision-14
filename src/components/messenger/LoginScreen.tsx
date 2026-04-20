import { useState } from 'react';

interface Props {
  onLogin: (name: string) => void;
}

const PRESET_USERS = ['Мама', 'Папа', 'Сестра', 'Брат'];

export default function LoginScreen({ onLogin }: Props) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onLogin(name.trim());
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0e1621',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{
        background: '#17212b', borderRadius: 16, padding: '40px 36px',
        width: '100%', maxWidth: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            fontSize: 48, marginBottom: 12,
            filter: 'drop-shadow(0 4px 12px rgba(91,155,213,0.4))',
          }}>
            🏠
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
            Family
          </div>
          <div style={{ fontSize: 14, color: '#6b7a8d', marginTop: 6 }}>
            Семейный мессенджер
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Введите ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              style={{
                width: '100%', background: '#0e1621', border: '1px solid #2b5278',
                borderRadius: 10, padding: '12px 16px', color: '#e8edf0',
                fontSize: 15, outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#5b9bd5')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#2b5278')}
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            style={{
              width: '100%', padding: '12px', borderRadius: 10,
              background: name.trim() ? '#2b5278' : '#1e2a36',
              border: 'none', color: name.trim() ? '#fff' : '#4a5a6b',
              fontSize: 15, fontWeight: 600, cursor: name.trim() ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
          >
            Войти
          </button>
        </form>

        {/* Preset users */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 12, color: '#4a5a6b', textAlign: 'center', marginBottom: 12 }}>
            Или выберите:
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {PRESET_USERS.map((u) => (
              <button
                key={u}
                onClick={() => onLogin(u)}
                style={{
                  padding: '7px 14px', borderRadius: 20,
                  background: '#0e1621', border: '1px solid #2b5278',
                  color: '#5b9bd5', fontSize: 13, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#2b5278';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#0e1621';
                  e.currentTarget.style.color = '#5b9bd5';
                }}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
