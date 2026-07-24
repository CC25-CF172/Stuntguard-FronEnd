import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, MessageSquare, Scan, Bot, User } from "lucide-react";

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Daftar halaman di mana Bottom Navbar TIDAK perlu muncul (misal: Login, Register, Lupa Password)
  const hiddenRoutes = ["/login", "/register", "/forgotpwd", "/reset-password"];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  // Helper untuk mengecek menu aktif
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-3 px-4 bg-transparent pointer-events-none">
      {/* Bar Container */}
      <div className="relative bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] rounded-3xl px-3 py-2 flex items-center justify-between pointer-events-auto border border-gray-100">
        
        {/* Menu Kiri 1: Home */}
        <button
          onClick={() => navigate("/")}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            isActive("/") ? "text-[#0284c7]" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-medium mt-1">Beranda</span>
        </button>

        {/* Menu Kiri 2: Forum */}
        <button
          onClick={() => navigate("/forum")}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            isActive("/forum") ? "text-[#0284c7]" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <MessageSquare className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-medium mt-1">Forum</span>
        </button>

        {/* Floating Button Tengah: Prediction / Asesmen */}
        <div className="relative -top-6 px-2 flex items-center justify-center">
          <button
            onClick={() => navigate("/prediction")}
            className="w-14 h-14 bg-[#38bdf8] text-white rounded-full flex items-center justify-center shadow-lg shadow-sky-200 border-4 border-white active:scale-95 transition-all"
            aria-label="Mulai Asesmen"
          >
            <Scan className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* Menu Kanan 1: ChatBot */}
        <button
          onClick={() => navigate("/chatbot")}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            isActive("/chatbot") ? "text-[#0284c7]" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Bot className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-medium mt-1">AI Chat</span>
        </button>

        {/* Menu Kanan 2: User Profile */}
        <button
          onClick={() => navigate("/user")}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            isActive("/user") || isActive("/editprofile") ? "text-[#0284c7]" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <User className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-medium mt-1">Profil</span>
        </button>

      </div>
    </div>
  );
};

export default BottomNavbar;