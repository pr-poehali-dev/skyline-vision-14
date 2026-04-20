import { useState, useEffect } from 'react';
import LoginScreen from '@/components/messenger/LoginScreen';
import Messenger from '@/components/messenger/Messenger';

export default function Index() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('family_user');
    if (saved) setCurrentUser(saved);
  }, []);

  const handleLogin = (name: string) => {
    sessionStorage.setItem('family_user', name);
    setCurrentUser(name);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('family_user');
    setCurrentUser(null);
  };

  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;
  return <Messenger currentUser={currentUser} onLogout={handleLogout} />;
}
