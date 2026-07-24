import React, { useState, useRef, useEffect } from "react";
import Navbar from "./pages/components/Navbar";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { API_BASE_URL } from "./api";
import Footer from "./pages/components/Footer";
import BottomNavbar from "./pages/components/BottomNavbar";

const suggestions = [
  "Apa itu stunting?",
  "Makanan terbaik untuk pertumbuhan bayi",
  "Pola pertumbuhan yang normal",
  "Upaya mencegah stunting",
];

const TypingIndicator = () => (
  <div className="flex items-center gap-1">
    <span className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
    <span className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
    <span className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
  </div>
);

// Komponen pesan
const ChatMessage = ({ sender, text, options, onOptionClick, isTyping }) => {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`max-w-md p-4 rounded-xl shadow-md ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-50 text-gray-800 border border-gray-200"
        }`}
      >
        {isTyping ? (
          <TypingIndicator />
        ) : (
          <>
            <p className="whitespace-pre-wrap">{text}</p>
            {options?.length > 0 && (
              <div className="mt-2 space-y-1">
                {options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onOptionClick(opt)}
                    className="block text-left text-sm text-blue-600 hover:underline"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Halo! Saya Asisten StuntGuard. Saya dapat membantu menjawab pertanyaan seputar pertumbuhan anak, nutrisi, dan pencegahan stunting. Apa yang ingin Anda ketahui?`,
      options: [
        "Apa itu stunting?",
        "Tips nutrisi untuk bayi",
        "Perkembangan anak",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { sender: "user", text: messageText };
    const loadingMessage = { sender: "bot", isTyping: true };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/v1/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: "bot",
          text: data.data?.reply || "Maaf, terjadi kesalahan.",
          options: [],
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: "bot",
          text: "Terjadi kesalahan. Silakan coba lagi nanti.",
        },
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageToSend = input;
    setInput("");
    await sendMessage(messageToSend);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput("");
    sendMessage(suggestion);
  };

  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sky-500 via-sky-600 to-green-400 py-10 font-sans">
        <div className="w-full flex justify-center items-center mb-6">
          <div className="max-w-4xl px-10 text-center">
            <h1 className="text-4xl font-bold mb-2 text-white">
              StuntGuard Asisten
            </h1>
            <p className="text-md text-white mb-2">
              Ajukan pertanyaan seputar pertumbuhan anak, nutrisi, dan
              pencegahan stunting. Dapatkan <br /> panduan dan sumber daya.
            </p>
          </div>
        </div>
      </section>

      {/* Chat Area */}
      <div className="bg-gray-50 py-4 px-2 sm:px-4">
        <div className="bg-white flex flex-col max-w-4xl mx-auto p-4 rounded-lg shadow-inner overflow-hidden mt-2 h-screen">
          <div
            className="flex-1 overflow-y-auto space-y-2 pr-1 sm:pr-2"
            ref={chatContainerRef}
          >
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                sender={msg.sender}
                text={msg.text}
                options={msg.options}
                onOptionClick={handleSuggestionClick}
                isTyping={msg.isTyping}
              />
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex mt-4 border-t pt-4 gap-2 bg-white"
          >
            <input
              type="text"
              placeholder="Tanyakan sesuatu..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="bg-sky-600 p-3 rounded-lg hover:bg-sky-700 text-white"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>

          {/* Suggestions */}
          <div className="mt-4 max-w-4xl text-left w-full">
            <p className="text-sm font-medium mb-2">
              Pertanyaan yang disarankan :
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1 rounded-full"
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-sm mt-4 text-gray-500 text-center">
              Catatan: Chatbot ini hanya menyediakan informasi umum dan bukan
              pengganti saran medis profesional.
            </p>
          </div>
        </div>
      </div>
      <Footer />

      <BottomNavbar />
    </>
  );
};

export default ChatbotPage;
