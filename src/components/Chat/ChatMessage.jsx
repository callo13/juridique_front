import React from "react";

const ChatMessage = ({ text, sender, date }) => (
  <div className={`self-${sender === "user" ? "end" : "start"} max-w-[70%] mb-1`}>
    <div className={`px-4 py-2 rounded-2xl shadow text-base ${sender === "user" ? "bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white" : "bg-gray-100 text-gray-800"}`}>
      {text}
    </div>
    <div className="text-xs text-gray-400 mt-1 ml-2">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
  </div>
);

export default ChatMessage; 