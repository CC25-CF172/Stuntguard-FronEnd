import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, Scan, MessageSquare, Bot, User, LogIn } from "lucide-react";

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 1. Hook dijalankan paling atas
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(!!(token && loggedIn));
    };

    checkAuthStatus();

    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, [location.pathname]);

  // 2. Early return untuk halaman auth
  const hiddenRoutes = ["/login", "/register", "/forgotpwd", "/reset-password"];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] block md:hidden pb-3 px-2 bg-transparent">
      {/* Container Kaca Liquid Glass */}
      <div className="relative bg-white/60 backdrop-blur-xl backdrop-saturate-180 shadow-[0_8px_32px_0_rgba(31,38,135,0.12)] rounded-3xl px-1.5 py-2 flex items-center justify-between border border-white/80">
        
        {/* Highlight Refleksi Kaca Atas */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-t-3xl pointer-events-none" />

        {/* 1. Beranda */}
        <button
          onClick={() => navigate("/")}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-300 ${
            isActive("/") ? "text-[#0284c7] scale-105" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          <span className="text-[9px] font-semibold mt-0.5 tracking-tight">Beranda</span>
        </button>

        {/* 2. Edukasi (Halaman /education) */}
        <button
          onClick={() => navigate("/education")}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-300 ${
            isActive("/education") || isActive("/educationnutrition") || isActive("/educationcommunity") || isActive("/educationriset")
              ? "text-[#0284c7] scale-105"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          <span className="text-[9px] font-semibold mt-0.5 tracking-tight">Edukasi</span>
        </button>

        {/* 3. Forum */}
        <button
          onClick={() => navigate("/forum")}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-300 ${
            isActive("/forum") ? "text-[#0284c7] scale-105" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          <span className="text-[9px] font-semibold mt-0.5 tracking-tight">Forum</span>
        </button>

        {/* 4. Floating Button Utama (Asesmen / Prediction) */}
        <div className="relative -top-5 px-0.5 flex items-center justify-center">
          <button
            onClick={() => navigate("/prediction")}
            className="relative group w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#38bdf8] to-[#0284c7] text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(2,132,199,0.35)] border-[3px] border-white/90 backdrop-blur-md active:scale-90 transition-all duration-300"
            aria-label="Mulai Asesmen"
          >
            {/* Inner Glossy Glass Overlay */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/25 to-white/40 pointer-events-none" />
            <Scan className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5] relative z-10 drop-shadow-sm" />
          </button>
        </div>

        {/* 5. AI Chat */}
        <button
          onClick={() => navigate("/chatbot")}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-300 ${
            isActive("/chatbot") ? "text-[#0284c7] scale-105" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          <span className="text-[9px] font-semibold mt-0.5 tracking-tight">AI Chat</span>
        </button>

        {/* 6. Profil (Sudah Login) vs Tombol Login Glass Circle (Belum Login) */}
        {isLoggedIn ? (
          <button
            onClick={() => navigate("/user")}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-300 ${
              isActive("/user") || isActive("/editprofile")
                ? "text-[#0284c7] scale-105"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            <span className="text-[9px] font-semibold mt-0.5 tracking-tight">Profil</span>
          </button>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <button
              onClick={() => navigate("/login")}
              className="relative w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-[#0284c7]/90 to-[#38bdf8]/90 text-white rounded-full flex items-center justify-center shadow-md shadow-sky-500/20 border border-white/80 active:scale-90 transition-all duration-300 overflow-hidden"
              aria-label="Masuk ke Akun"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40 pointer-events-none" />
              <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5 stroke-[2.5] relative z-10" />
            </button>
            <span className="text-[9px] font-bold text-[#0284c7] mt-0.5 tracking-tight">Login</span>
          </div>
        )}

      </div>
    </div>
  );
};

export default BottomNavbar;