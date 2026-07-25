import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, MessageSquare, Scan, Bot, User, LogIn } from "lucide-react";

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 1. Check Login Status
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

  // 2. Hide di Halaman Auth
  const hiddenRoutes = ["/login", "/register", "/forgotpwd", "/reset-password"];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] block md:hidden pb-2 px-3 bg-transparent">
      {/* Container Bar: Pakai Grid 5-Column agar Presisi Simetris */}
      <div className="relative bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full px-2 py-1.5 border border-white/90">
        
        <div className="flex items-center justify-between w-full">
          
          {/* GRUP KIRI (Beranda & Edukasi) */}
          <div className="flex items-center justify-around flex-1">
            {/* 1. Beranda */}
            <button
              onClick={() => navigate("/")}
              className={`flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 ${
                isActive("/") ? "text-[#0284c7] font-semibold" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Home className="w-5 h-5 stroke-[2]" />
              <span className="text-[10px] mt-0.5">Beranda</span>
            </button>

            {/* 2. Edukasi */}
            <button
              onClick={() => navigate("/education")}
              className={`flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 ${
                isActive("/education") || isActive("/educationnutrition") || isActive("/educationcommunity") || isActive("/educationriset")
                  ? "text-[#0284c7] font-semibold"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <BookOpen className="w-5 h-5 stroke-[2]" />
              <span className="text-[10px] mt-0.5">Edukasi</span>
            </button>

            {/* 3. Forum */}
            <button
              onClick={() => navigate("/forum")}
              className={`flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 ${
                isActive("/forum") ? "text-[#0284c7] font-semibold" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <MessageSquare className="w-5 h-5 stroke-[2]" />
              <span className="text-[10px] mt-0.5">Forum</span>
            </button>
          </div>

          {/* TOMBOL TENGAH MELAYANG (SIMETRIS PRESISI DI TENGAH) */}
          <div className="relative -top-5 px-1 flex items-center justify-center flex-shrink-0">
            <button
              onClick={() => navigate("/prediction")}
              className="w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] text-white rounded-full flex items-center justify-center shadow-lg shadow-sky-300/50 border-[3px] border-white active:scale-90 transition-all"
              aria-label="Mulai Asesmen"
            >
              <Scan className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* GRUP KANAN (AI Chat & Profil/Login) */}
          <div className="flex items-center justify-around flex-1">
            {/* 4. AI Chat */}
            <button
              onClick={() => navigate("/chatbot")}
              className={`flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 ${
                isActive("/chatbot") ? "text-[#0284c7] font-semibold" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Bot className="w-5 h-5 stroke-[2]" />
              <span className="text-[10px] mt-0.5">AI Chat</span>
            </button>

            {/* 5. Profil (jika login) / Login (jika belum login) */}
            {isLoggedIn ? (
              <button
                onClick={() => navigate("/user")}
                className={`flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 ${
                  isActive("/user") || isActive("/editprofile")
                    ? "text-[#0284c7] font-semibold"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <User className="w-5 h-5 stroke-[2]" />
                <span className="text-[10px] mt-0.5">Profil</span>
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className={`flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 ${
                  isActive("/login") ? "text-[#0284c7] font-semibold" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <LogIn className="w-5 h-5 stroke-[2]" />
                <span className="text-[10px] mt-0.5">Masuk</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default BottomNavbar;