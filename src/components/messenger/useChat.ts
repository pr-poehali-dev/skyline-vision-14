import { useState, useCallback } from 'react';
import { Message, Contact } from './types';

const DEMO_CONTACTS: Contact[] = [
  { id: 'mama', name: 'Мама', online: true, lastMessage: 'Как дела? 💕', lastTime: '14:32' },
  { id: 'papa', name: 'Папа', online: false, lastMessage: 'Увидимся на выходных', lastTime: 'вчера' },
  { id: 'sestra', name: 'Сестра', online: true, lastMessage: 'Посмотри фото 📸', lastTime: '09:15' },
  { id: 'brat', name: 'Брат', online: false, lastMessage: 'Окей, договорились!', lastTime: 'пн' },
];

const INITIAL_MESSAGES: Message[] = [
  { id: '1', fromId: 'mama', toId: 'me', text: 'Привет, как ты? 😊', timestamp: Date.now() - 3600000, type: 'text' },
  { id: '2', fromId: 'me', toId: 'mama', text: 'Всё хорошо, мам! Работаю 🙂', timestamp: Date.now() - 3500000, type: 'text' },
  { id: '3', fromId: 'mama', toId: 'me', text: 'Как дела? 💕', timestamp: Date.now() - 1800000, type: 'text' },
  { id: '4', fromId: 'papa', toId: 'me', text: 'Увидимся на выходных', timestamp: Date.now() - 86400000, type: 'text' },
  { id: '5', fromId: 'me', toId: 'papa', text: 'Конечно, пап! Буду ждать', timestamp: Date.now() - 86000000, type: 'text' },
  { id: '6', fromId: 'sestra', toId: 'me', text: 'Посмотри фото 📸', timestamp: Date.now() - 7200000, type: 'text' },
  { id: '7', fromId: 'brat', toId: 'me', text: 'Окей, договорились!', timestamp: Date.now() - 259200000, type: 'text' },
];

export function useChat(currentUserId: string) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [contacts] = useState<Contact[]>(DEMO_CONTACTS);

  const getMessages = useCallback((contactId: string) => {
    return messages.filter(
      (m) =>
        (m.fromId === currentUserId && m.toId === contactId) ||
        (m.fromId === contactId && m.toId === currentUserId)
    );
  }, [messages, currentUserId]);

  const sendMessage = useCallback((toId: string, text: string, file?: Message['file'], type: Message['type'] = 'text') => {
    const msg: Message = {
      id: Date.now().toString(),
      fromId: currentUserId,
      toId,
      text,
      file,
      timestamp: Date.now(),
      type,
    };
    setMessages((prev) => [...prev.slice(-99), msg]);

    // Simulate reply after 1.5s for demo
    if (!file) {
      setTimeout(() => {
        const replies = ['Понятно! 👍', 'Хорошо 😊', 'Окей!', 'Отлично! 🎉', 'Договорились 🤝', 'Ладно, понял(а) ❤️'];
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          fromId: toId,
          toId: currentUserId,
          text: replies[Math.floor(Math.random() * replies.length)],
          timestamp: Date.now(),
          type: 'text',
        };
        setMessages((prev) => [...prev.slice(-99), reply]);
      }, 1500);
    }
  }, [currentUserId]);

  return { messages, contacts, getMessages, sendMessage };
}
