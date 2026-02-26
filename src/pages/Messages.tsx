import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
}

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>('u2');
  const [messageText, setMessageText] = useState('');
  
  const contacts = [
    { id: 'u2', name: 'Alice Smith', avatar: 'https://picsum.photos/seed/u5/100/100', lastMessage: 'Sure, I can do that.', time: '2m ago', online: true },
    { id: 'u3', name: 'Bob Jones', avatar: 'https://picsum.photos/seed/u6/100/100', lastMessage: 'When is the deadline?', time: '1h ago', online: false },
    { id: 'u4', name: 'Charlie Brown', avatar: 'https://picsum.photos/seed/u7/100/100', lastMessage: 'Thanks for the offer!', time: '1d ago', online: true },
  ];

  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', senderId: 'u2', text: 'Hi there! I saw your job post about the React Native app.', timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
    { id: 'm2', senderId: 'me', text: 'Hi Alice! Yes, are you interested?', timestamp: new Date(Date.now() - 1000 * 60 * 55), isMe: true },
    { id: 'm3', senderId: 'u2', text: 'Absolutely. I have built similar apps before. Can we discuss the requirements?', timestamp: new Date(Date.now() - 1000 * 60 * 50), isMe: false },
    { id: 'm4', senderId: 'me', text: 'Sure, I can send you the spec document.', timestamp: new Date(Date.now() - 1000 * 60 * 45), isMe: true },
    { id: 'm5', senderId: 'u2', text: 'Sure, I can do that.', timestamp: new Date(Date.now() - 1000 * 60 * 2), isMe: false },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: `m${messages.length + 1}`,
      senderId: 'me',
      text: messageText,
      timestamp: new Date(),
      isMe: true,
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const activeContact = contacts.find(c => c.id === activeChat);

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-1 md:grid-cols-4 h-full bg-card border rounded-xl overflow-hidden shadow-sm">
        {/* Sidebar */}
        <div className="md:col-span-1 border-r flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="font-bold text-xl">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
              <div 
                key={contact.id}
                onClick={() => setActiveChat(contact.id)}
                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors ${activeChat === contact.id ? 'bg-muted' : ''}`}
              >
                <div className="relative">
                  <img 
                    src={contact.avatar} 
                    alt={contact.name} 
                    className="w-10 h-10 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-medium truncate">{contact.name}</span>
                    <span className="text-xs text-muted-foreground">{contact.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-3 flex flex-col h-full">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex justify-between items-center bg-background/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <img 
                    src={activeContact?.avatar} 
                    alt={activeContact?.name} 
                    className="w-10 h-10 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-bold">{activeContact?.name}</h3>
                    <span className="text-xs text-muted-foreground">{activeContact?.online ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon"><Phone className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon"><Video className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.isMe ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                      <p>{msg.text}</p>
                      <span className={`text-[10px] block text-right mt-1 opacity-70`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t bg-background">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 rounded-full border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <Button type="submit" size="icon" disabled={!messageText.trim()}>
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
