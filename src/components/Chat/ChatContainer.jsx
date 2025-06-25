import React, { useState, useRef, useEffect } from 'react';
import { Send, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';

const MessageBubble = ({ message, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div
      className={`max-w-[80%] rounded-lg p-4 ${
        isUser
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      <p className="text-sm">{message.content}</p>
      {!isUser && message.sources && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">Sources :</p>
          <ul className="text-xs text-gray-600 mt-1">
            {message.sources.map((source, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-green-600">{source.confidence}%</span>
                {source.reference}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!isUser && (
        <div className="flex gap-2 mt-2">
          <button className="p-1 hover:bg-gray-200 rounded">
            <Copy className="h-4 w-4" />
          </button>
          <button className="p-1 hover:bg-gray-200 rounded">
            <ThumbsUp className="h-4 w-4" />
          </button>
          <button className="p-1 hover:bg-gray-200 rounded">
            <ThumbsDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  </div>
);

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToWebhook = async (message) => {
    try {
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({question: message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error };
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      content: inputMessage,
      isUser: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Envoyer le message au webhook
    const { success, data, error } = await sendMessageToWebhook(inputMessage);
    
    if (!success) {
      // Ajouter un message d'erreur si l'envoi échoue
      const errorMessage = {
        id: Date.now() + 1,
        content: "Désolé, une erreur s'est produite lors de l'envoi de votre message.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
      return;
    }

    // Utiliser la réponse du webhook
    const aiResponse = {
      id: Date.now() + 1,
      content: data.answer || "Je n'ai pas pu générer une réponse appropriée.",
      isUser: false,
      sources: data.sources || [],
    };
    
    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Assistant Juridique IA</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} isUser={message.isUser} />
        ))}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <textarea
            className="flex-1 border rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Posez votre question juridique..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleSend}
          >
            <Send className="h-6 w-6" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Appuyez sur Ctrl + Entrée pour envoyer
        </p>
      </div>
    </div>
  );
};

export default ChatContainer; 