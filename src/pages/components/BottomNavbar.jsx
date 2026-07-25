import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, MessageSquare, Scan, Bot, User, LogIn } from "lucide-react";

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 1. Cek Status Login
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

  // 2. Sembunyikan Navbar di Halaman Auth
  const hiddenRoutes = ["/login", "/register", "/forgotpwd", "/reset-password"];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] block md:hidden pb-3 px-3 bg-transparent">
      {/* Container Navbar Liquid Glass Rapi & Sejajar */}
      <div className="relative bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] rounded-2xl px-2 py-2 border border-white/90">
        <div className="flex items-center justify-around w-full">

          {/* 1. Beranda */}
          <button
            onClick={() => navigate("/")}
            className={`flex flex-col items-center justify-center py-1 flex-1 transition-all duration-200 ${
              isActive("/") ? "text-[#0284c7] font-bold" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Home className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] mt-0.5">Beranda</span>
          </button>

          {/* 2. Edukasi */}
          <button
            onClick={() => navigate("/education")}
            className={`flex flex-col items-center justify-center py-1 flex-1 transition-all duration-200 ${
              isActive("/education") || isActive("/educationnutrition") || isActive("/educationcommunity") || isActive("/educationriset")
                ? "text-[#0284c7] font-bold"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <BookOpen className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] mt-0.5">Edukasi</span>
          </button>

          {/* 3. Forum */}
          <button
            onClick={() => navigate("/forum")}
            className={`flex flex-col items-center justify-center py-1 flex-1 transition-all duration-200 ${
              isActive("/forum") ? "text-[#0284c7] font-bold" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <MessageSquare className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] mt-0.5">Forum</span>
          </button>

          {/* 4. Asesmen / Prediksi (Sejajar di Dalam Bar) */}
          <button
            onClick={() => navigate("/prediction")}
            className={`flex flex-col items-center justify-center py-1 flex-1 transition-all duration-200 ${
              isActive("/prediction") ? "text-[#0284c7] font-bold" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Scan className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] mt-0.5">Asesmen</span>
          </button>

          {/* 5. AI Chat */}
          <button
            onClick={() => navigate("/chatbot")}
            className={`flex flex-col items-center justify-center py-1 flex-1 transition-all duration-200 ${
              isActive("/chatbot") ? "text-[#0284c7] font-bold" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Bot className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] mt-0.5">AI Chat</span>
          </button>

          {/* 6. Profil (Hanya muncul jika SUDAH login) */}
          {isLoggedIn && (
            <button
              onClick={() => navigate("/user")}
              className={`flex flex-col items-center justify-center py-1 flex-1 transition-all duration-200 ${
                isActive("/user") || isActive("/editprofile")
                  ? "text-[#0284c7] font-bold"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <User className="w-5 h-5 stroke-[2]" />
              <span className="text-[10px] mt-0.5">Profil</span>
            </button>
          )}

          {/* 7. Masuk (Hanya muncul jika BELUM login, otomatis hilang saat sudah login) */}
          {!isLoggedIn && (
            <button
              onClick={() => navigate("/login")}
              className={`flex flex-col items-center justify-center py-1 flex-1 transition-all duration-200 ${
                isActive("/login") ? "text-[#0284c7] font-bold" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <LogIn className="w-5 h-5 stroke-[2]" />
              <span className="text-[10px] mt-0.5">Masuk</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default BottomNavbar;