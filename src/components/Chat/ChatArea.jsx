import React, { useRef, useState } from "react";
import useChat from "../../hooks/useChat";
import ChatMessage from "./ChatMessage";

const ChatArea = ({ folders, selectedFolder, onSelectFolder }) => {
  const { messages, addMessage } = useChat();
  const inputRef = useRef();
  const [isTyping, setIsTyping] = useState(false);

  const sendMessageToWebhook = async (message) => {
    try {
      const payload = {
        question: message,
        folder_id: selectedFolder || null,
      };
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const value = inputRef.current.value.trim();
    if (value) {
      addMessage({ text: value, sender: "user", date: new Date() });
      inputRef.current.value = "";
      setIsTyping(true);
      // Appel réel à l'API IA
      const { success, data, error } = await sendMessageToWebhook(value);
      if (!success) {
        addMessage({ text: "Désolé, une erreur s'est produite lors de l'envoi de votre message.", sender: "assistant", date: new Date() });
        setIsTyping(false);
        return;
      }
      addMessage({ text: data.answer || "Je n'ai pas pu générer une réponse appropriée.", sender: "assistant", date: new Date() });
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Assistant Juridique IA</h1>
        <select
          className="rounded-lg px-3 py-2 bg-white bg-opacity-80 shadow border-none focus:ring-2 focus:ring-blue-300"
          value={selectedFolder}
          onChange={e => onSelectFolder(e.target.value)}
        >
          {folders.map(folder => (
            <option key={folder.id} value={folder.id}>{folder.name}</option>
          ))}
        </select>
      </div>
      {/* Suggestion IA */}
      <div className="mb-4">
        <div className="bg-green-100 border border-green-300 text-green-800 rounded-lg px-4 py-2 text-sm">
          💡 Astuce : Vous pouvez me poser des questions sur vos documents juridiques, demander des analyses ou des clarifications sur des points de droit spécifiques.
        </div>
      </div>
      {/* Zone de messages */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto px-2 py-4 rounded-xl bg-white bg-opacity-60 shadow-inner mb-2">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center text-gray-400 italic text-lg">
            Posez votre question juridique pour commencer…
          </div>
        ) : (
          messages.map((msg, idx) => (
            <ChatMessage key={idx} text={msg.text} sender={msg.sender} date={msg.date} />
          ))
        )}
        {isTyping && (
          <div className="self-start text-gray-400 italic text-base">L'IA rédige une réponse...</div>
        )}
      </div>
      {/* Input arrondi + bouton envoi */}
      <form className="mt-4 flex items-center gap-2" onSubmit={handleSend}>
        <input
          type="text"
          ref={inputRef}
          className="flex-1 rounded-full px-4 py-3 bg-white bg-opacity-80 shadow border-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-400"
          placeholder="Posez votre question juridique..."
        />
        <button
          type="submit"
          className="rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-5 py-3 shadow-lg hover:-translate-y-1 transition transform"
        >
          <span className="text-xl">➤</span>
        </button>
      </form>
    </div>
  );
};

export default ChatArea; 