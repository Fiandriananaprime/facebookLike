import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  API_BASE_URL,
  SOCKET_PATH,
  SOCKET_URL,
  getApiHeaders,
} from "../network";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Phone,
  Video,
  Info,
  Smile,
  Image,
  ThumbsUp,
  MoreHorizontal,
} from "lucide-react";
import { io } from "socket.io-client";

const toPositiveInt = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const socket = io(SOCKET_URL, {
  path: SOCKET_PATH,
  withCredentials: true,
  transports: ["websocket", "polling"],
});
const defaultAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
];

function Messenger() {
  const [selectedChat, setSelectedChat] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem("userData") || "null");
  const currentUserId = toPositiveInt(storedUser?.id);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const messagesEndRef = useRef(null);
  const receiverIdRef = useRef(null);
  const conversations = useMemo(
    () =>
      users.map((user, index) => {
        const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
        return {
          id: Number(user.id),
          name: fullName || user.email || `User ${Number(user.id)}`,
          avatar: user.avatar || defaultAvatars[index % defaultAvatars.length],
          online: Boolean(user.online),
          lastMessage: "",
          time: "",
          unread: 0,
        };
      }),
    [users],
  );

  const loadHistory = useCallback((targetUserId) => {
    const parsedReceiverId = toPositiveInt(targetUserId);
    if (!currentUserId || !parsedReceiverId) return;
    socket.emit("get_messages", { withUserId: parsedReceiverId });
  }, [currentUserId]);

  const selectConversation = useCallback((conversation) => {
    const parsedConversationId = toPositiveInt(conversation?.id);
    if (!parsedConversationId) return;

    receiverIdRef.current = parsedConversationId;
    setSelectedChat(conversation);
    setReceiverId(parsedConversationId);
    loadHistory(parsedConversationId);
  }, [loadHistory]);

  const deleteMessage = (messageId) => {
    const parsedMessageId = toPositiveInt(messageId);
    if (!parsedMessageId) return;
    socket.emit("delete_message", { messageId: parsedMessageId });
  };
  const sendMessage = () => {
    const content = message.trim();
    const parsedReceiverId = toPositiveInt(
      receiverIdRef.current ?? receiverId ?? selectedChat?.id,
    );
    if (!content) return;
    if (!currentUserId || !parsedReceiverId) return;

    socket.emit("send_message", {
      senderId: currentUserId,
      receiverId: parsedReceiverId,
      content,
    });
    setMessage("");
  };

  useEffect(() => {
    receiverIdRef.current = receiverId;
  }, [receiverId]);

  useEffect(() => {
    if (!currentUserId) {
      setUsersError(
        "Session invalide: reconnecte-toi pour charger les contacts.",
      );
      return;
    }

    const fetchUsers = async () => {
      setUsersLoading(true);
      setUsersError("");
      try {
        const res = await fetch(
          `${API_BASE_URL}/users?excludeUserId=${currentUserId}`,
          {
            headers: getApiHeaders({ Accept: "application/json" }),
          },
        );
        const bodyText = await res.text();
        const data = bodyText ? JSON.parse(bodyText) : {};
        if (res.ok) {
          setUsers(data.users || []);
        } else {
          setUsersError(data.message || "Impossible de charger les contacts.");
        }
      } catch (error) {
        console.error("Fetch users error:", error);
        setUsersError(
          "Erreur reseau lors du chargement des contacts. Verifie l'adresse du serveur local.",
        );
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    socket.emit("join", { userId: currentUserId });

    socket.on("messages_history", (data) => {
      setMessages(data);
    });

    socket.on("receive_message", (data) => {
      const parsedReceiverId = toPositiveInt(receiverIdRef.current);
      if (!parsedReceiverId) return;
      const isCurrentConversation =
        (Number(data.senderId) === currentUserId &&
          Number(data.receiverId) === parsedReceiverId) ||
        (Number(data.senderId) === parsedReceiverId &&
          Number(data.receiverId) === currentUserId);

      if (isCurrentConversation) {
        setMessages((prev) => [...prev, data]);
      }
    });

    socket.on("message_deleted", ({ messageId }) => {
      setMessages((prev) =>
        prev.filter((msg) => Number(msg.id) !== Number(messageId)),
      );
    });

    socket.on("socket_error", (err) => {
      console.error(
        "Socket error:",
        err?.message || "unknown",
        err?.code || "",
        err?.detail || "",
        err,
      );
    });

    return () => {
      socket.off("messages_history");
      socket.off("receive_message");
      socket.off("message_deleted");
      socket.off("socket_error");
    };
  }, [currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (usersLoading) return;

    if (conversations.length === 0) {
      if (selectedChat !== null) {
        setSelectedChat(null);
      }
      if (receiverId !== null) {
        setReceiverId(null);
      }
      if (messages.length > 0) {
        setMessages([]);
      }
      return;
    }

    const selectedId = Number(selectedChat?.id);
    const hasSelected =
      Number.isInteger(selectedId) &&
      conversations.some((conv) => conv.id === selectedId);

    if (!hasSelected) {
      const firstConversation = conversations[0];
      if (toPositiveInt(receiverId) !== toPositiveInt(firstConversation.id)) {
        selectConversation(firstConversation);
      }
    }
  }, [
    usersLoading,
    conversations,
    selectedChat,
    receiverId,
    messages.length,
    selectConversation,
  ]);

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
          {usersLoading && (
            <p className="p-3 text-sm text-gray-500">Chargement des contacts...</p>
          )}
          {!usersLoading && usersError && (
            <p className="p-3 text-sm text-red-500">{usersError}</p>
          )}
          {!usersLoading && !usersError && conversations.length === 0 && (
            <p className="p-3 text-sm text-gray-500">Aucun contact trouve.</p>
          )}
          {!usersLoading &&
            !usersError &&
            conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => {
                selectConversation(conv);
              }}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 ${selectedChat?.id === conv.id ? "bg-gray-100" : ""}`}
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
                  <span className="text-xs text-gray-500">{conv.time || ""}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 truncate">
                    {conv.lastMessage || (conv.online ? "En ligne" : "Hors ligne")}
                  </p>
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
              <AvatarImage src={selectedChat?.avatar} />
              <AvatarFallback>{selectedChat?.name?.[0] || "?"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{selectedChat?.name || "Selectionne un contact"}</p>
              <p className="text-xs text-gray-500">
                {selectedChat?.online ? "Active now" : "Offline"}
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

        {
          /* Messages */
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={msg.id ?? index}
                className={`p-3 rounded-xl shadow w-fit max-w-xs ${
                  Number(msg.senderId) === currentUserId
                    ? "bg-blue-100 ml-auto"
                    : "bg-white"
                }`}
              >
                {Number(msg.senderId) === currentUserId && (
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="text-xs text-red-600 hover:underline mb-1"
                  >
                    Supprimer
                  </button>
                )}
                <p>{msg.content}</p>
                <span className="text-xs text-gray-400">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString()
                    : ""}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        }

        {
          /* Message Input */
          <div className="flex p-4 bg-white border-t">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Écrire un message..."
              className="flex-1 border rounded-l-lg px-4 py-2 outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!toPositiveInt(receiverId)}
              className="bg-blue-600 text-white px-6 rounded-r-lg hover:bg-blue-700 transition"
            >
              Envoyer
            </button>
          </div>
        }
      </div>
    </div>
  );
}
export { Messenger };
