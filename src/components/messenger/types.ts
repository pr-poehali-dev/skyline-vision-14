export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastTime?: string;
  online?: boolean;
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  text?: string;
  file?: FileAttachment;
  timestamp: number;
  type: 'text' | 'image' | 'video' | 'document';
}

export interface FileAttachment {
  name: string;
  url: string;
  size: number;
  mimeType: string;
}

export type CallState = 'idle' | 'calling' | 'incoming' | 'active';
