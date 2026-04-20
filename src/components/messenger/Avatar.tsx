interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  online?: boolean;
}

const COLORS = [
  '#5b9bd5', '#e05f6b', '#6cb86a', '#d4a843', '#9b6fc9',
  '#4dc8c8', '#e8924e', '#7eb8d4',
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function Avatar({ name, size = 'md', online }: AvatarProps) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const bg = getColor(name);
  const sizes = { sm: 32, md: 42, lg: 52 };
  const px = sizes[size];
  const fontSize = size === 'sm' ? 12 : size === 'md' ? 16 : 20;

  return (
    <div style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}>
      <div
        style={{
          width: px, height: px,
          borderRadius: '50%',
          background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize, fontWeight: 600, color: '#fff',
          userSelect: 'none',
        }}
      >
        {initials}
      </div>
      {online !== undefined && (
        <span
          style={{
            position: 'absolute', bottom: 1, right: 1,
            width: size === 'sm' ? 8 : 10, height: size === 'sm' ? 8 : 10,
            borderRadius: '50%',
            background: online ? '#4cd964' : '#6b7a8d',
            border: '2px solid #17212b',
          }}
        />
      )}
    </div>
  );
}
