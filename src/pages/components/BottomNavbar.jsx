import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, MessageSquare, Scan, Bot, User, LogIn } from "lucide-react";

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
    <div className="fixed bottom-0 left-0 right-0 z-[9999] block md:hidden pb-3 px-4 bg-transparent">
      {/* Outer Liquid Glass Container */}
      <div className="relative bg-white/60 backdrop-blur-xl backdrop-saturate-180 shadow-[0_8px_32px_0_rgba(31,38,135,0.12)] rounded-3xl px-2 py-2 flex items-center justify-between border border-white/80">
        
        {/* Highlight Kaca Atas (Glass Refraction Effect) */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-t-3xl pointer-events-none" />

        {/* 1. Beranda */}
        <button
          onClick={() => navigate("/")}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all duration-300 ${
            isActive("/") ? "text-[#0284c7] scale-105" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Beranda</span>
        </button>

        {/* 2. Forum */}
        <button
          onClick={() => navigate("/forum")}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all duration-300 ${
            isActive("/forum") ? "text-[#0284c7] scale-105" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <MessageSquare className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Forum</span>
        </button>

        {/* 3. Floating Button Tengah - Liquid Glass Floating Orb */}
        <div className="relative -top-6 px-1 flex items-center justify-center">
          <button
            onClick={() => navigate("/prediction")}
            className="relative group w-14 h-14 bg-gradient-to-br from-[#38bdf8] to-[#0284c7] text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(2,132,199,0.35)] border-[3px] border-white/90 backdrop-blur-md active:scale-90 transition-all duration-300"
            aria-label="Mulai Asesmen"
          >
            {/* Inner Glow / Glossy Apple Overlay */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/25 to-white/40 pointer-events-none" />
            <Scan className="w-7 h-7 stroke-[2.5] relative z-10 drop-shadow-sm" />
          </button>
        </div>

        {/* 4. AI Chat */}
        <button
          onClick={() => navigate("/chatbot")}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all duration-300 ${
            isActive("/chatbot") ? "text-[#0284c7] scale-105" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Bot className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">AI Chat</span>
        </button>

        {/* 5. Profil (Sudah Login) vs Tombol Login Glass Circle (Belum Login) */}
        {isLoggedIn ? (
          <button
            onClick={() => navigate("/user")}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all duration-300 ${
              isActive("/user") || isActive("/editprofile")
                ? "text-[#0284c7] scale-105"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <User className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Profil</span>
          </button>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <button
              onClick={() => navigate("/login")}
              className="relative w-9 h-9 bg-gradient-to-br from-[#0284c7]/90 to-[#38bdf8]/90 text-white rounded-full flex items-center justify-center shadow-md shadow-sky-500/20 border border-white/80 active:scale-90 transition-all duration-300 overflow-hidden"
              aria-label="Masuk ke Akun"
            >
              {/* Refleksi Kilatan Kaca */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40 pointer-events-none" />
              <LogIn className="w-4 h-4 ml-0.5 stroke-[2.5] relative z-10" />
            </button>
            <span className="text-[10px] font-bold text-[#0284c7] mt-0.5 tracking-tight">Login</span>
          </div>
        )}

      </div>
    </div>
  );
};

export default BottomNavbar;