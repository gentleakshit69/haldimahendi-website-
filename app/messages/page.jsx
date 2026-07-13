'use client'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Send, Search, MoreVertical } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

const mockConversations = [
  {
    id: 1,
    name: 'Priya',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    lastMessage: 'That sounds great! Looking forward to it',
    timestamp: '2m',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Anjali',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    lastMessage: 'How was your day?',
    timestamp: '1h',
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: 'Meera',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    lastMessage: 'Thanks for the invite!',
    timestamp: '3h',
    unread: 1,
    online: false,
  },
  {
    id: 4,
    name: 'Divya',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    lastMessage: 'That sounds interesting, tell me more',
    timestamp: '5h',
    unread: 0,
    online: true,
  },
]

const mockMessages = {
  1: [
    { id: 1, sender: 'other', text: 'Hi there!', timestamp: '10:30 AM' },
    { id: 2, sender: 'me', text: 'Hey! How are you?', timestamp: '10:31 AM' },
    { id: 3, sender: 'other', text: 'I\'m doing great! How about you?', timestamp: '10:32 AM' },
    { id: 4, sender: 'me', text: 'All good! Would you like to grab coffee sometime?', timestamp: '10:33 AM' },
    { id: 5, sender: 'other', text: 'That sounds great! Looking forward to it', timestamp: '10:34 AM' },
  ],
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(mockConversations[0])
  const [messages, setMessages] = useState(mockMessages[selectedChat.id] || [])
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'me',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Conversations List */}
          <div className="lg:col-span-1 flex flex-col h-full">
            <Card className="flex flex-col flex-1">
              <div className="p-4 border-b border-border">
                <h2 className="text-2xl font-bold text-foreground mb-4">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search conversations"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map(conversation => (
                  <button
                    key={conversation.id}
                    onClick={() => {
                      setSelectedChat(conversation)
                      setMessages(mockMessages[conversation.id] || [])
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition border-b border-border ${
                      selectedChat.id === conversation.id ? 'bg-secondary/10' : ''
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <Image
                        src={conversation.avatar}
                        alt={conversation.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      {conversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="font-semibold text-foreground truncate">
                        {conversation.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">
                        {conversation.timestamp}
                      </span>
                      {conversation.unread > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 flex flex-col h-full">
            <Card className="flex flex-col flex-1">
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src={selectedChat.avatar}
                      alt={selectedChat.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    {selectedChat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">{selectedChat.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {selectedChat.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-muted rounded-lg transition">
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender === 'me'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted text-foreground rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === 'me'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows="2"
                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-input text-foreground resize-none"
                  />
                  <Button
                    onClick={handleSendMessage}
                    variant="primary"
                    size="md"
                    className="self-end"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
