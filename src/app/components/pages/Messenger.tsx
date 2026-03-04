import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Phone, Video, Info, Smile, Image, ThumbsUp, MoreHorizontal } from "lucide-react";
import { useState } from "react";

const mockConversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    lastMessage: "That sounds great! Let's do it 😊",
    time: "2m",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    lastMessage: "Thanks for sharing!",
    time: "1h",
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: "Emma Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    lastMessage: "See you tomorrow!",
    time: "3h",
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    lastMessage: "Did you watch the game?",
    time: "5h",
    unread: 1,
    online: true,
  },
  {
    id: 5,
    name: "Lisa Anderson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    lastMessage: "Perfect! Talk soon.",
    time: "1d",
    unread: 0,
    online: false,
  },
];

const mockMessages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    text: "Hey! How are you doing?",
    time: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "You",
    text: "I'm doing great! How about you?",
    time: "10:32 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "Sarah Johnson",
    text: "I'm good too! Want to grab coffee this weekend?",
    time: "10:33 AM",
    isOwn: false,
  },
  {
    id: 4,
    sender: "You",
    text: "That sounds amazing! Saturday at 2pm?",
    time: "10:35 AM",
    isOwn: true,
  },
  {
    id: 5,
    sender: "Sarah Johnson",
    text: "That sounds great! Let's do it 😊",
    time: "10:36 AM",
    isOwn: false,
  },
];

export function Messenger() {
  const [selectedChat, setSelectedChat] = useState(mockConversations[0]);
  const [messageText, setMessageText] = useState("");

  return (
    <div className="h-[calc(100vh-3.5rem)] flex bg-white">
      {/* Conversations Sidebar */}
      <div className="w-full md:w-96 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold mb-4">Chats</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search Messenger"
              className="pl-10 bg-gray-100 border-none rounded-full"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedChat(conv)}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 ${
                selectedChat.id === conv.id ? "bg-gray-100" : ""
              }`}
            >
              <div className="relative">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={conv.avatar} />
                  <AvatarFallback>{conv.name[0]}</AvatarFallback>
                </Avatar>
                {conv.online && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium truncate">{conv.name}</p>
                  <span className="text-xs text-gray-500">{conv.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                      {conv.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-col flex-1">
        {/* Chat Header */}
        <div className="h-16 border-b px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={selectedChat.avatar} />
              <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{selectedChat.name}</p>
              <p className="text-xs text-gray-500">
                {selectedChat.online ? "Active now" : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5 text-blue-600" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="w-5 h-5 text-blue-600" />
            </Button>
            <Button variant="ghost" size="icon">
              <Info className="w-5 h-5 text-blue-600" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
            >
              {!message.isOwn && (
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-md ${message.isOwn ? "items-end" : "items-start"} flex flex-col`}>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.isOwn ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">{message.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-blue-600">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-blue-600">
              <Image className="w-5 h-5" />
            </Button>
            <Input
              type="text"
              placeholder="Aa"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 rounded-full border-gray-300"
            />
            <Button variant="ghost" size="icon" className="text-blue-600">
              <Smile className="w-5 h-5" />
            </Button>
            {messageText ? (
              <Button size="icon" className="bg-blue-600 text-white rounded-full">
                →
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="text-blue-600">
                <ThumbsUp className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
