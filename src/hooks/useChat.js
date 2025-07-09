import { useState } from "react";

export default function useChat() {
  const [messages, setMessages] = useState([]);

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const resetChat = () => setMessages([]);

  return {
    messages,
    addMessage,
    resetChat,
  };
} 