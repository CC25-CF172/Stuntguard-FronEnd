import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, MessageSquare, Scan, Bot, User, LogIn } from "lucide-react";

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sembunyikan Bottom Navbar di halaman auth
  const hiddenRoutes = ["/login", "/register", "/forgotpwd", "/reset-password"];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  // Cek status login dari localStorage
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(!!(token && loggedIn));
    };

    checkAuthStatus();

    // Listener agar UI langsung terbarui jika login/logout di tab lain atau proses app
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] block md:hidden pb-2 px-3 bg-transparent">
      {/* Container Bar */}
      <div className="relative bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.12)] rounded-2xl px-2 py-2 flex items-center justify-between border border-gray-100">
        
        {/* 1. Beranda */}
        <button
          onClick={() => navigate("/")}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            isActive("/") ? "text-[#0284c7]" : "text-gray-400"
          }`}
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-medium mt-1">Beranda</span>
        </button>

        {/* 2. Forum */}
        <button
          onClick={() => navigate("/forum")}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            isActive("/forum") ? "text-[#0284c7]" : "text-gray-400"
          }`}
        >
          <MessageSquare className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-medium mt-1">Forum</span>
        </button>

        {/* 3. Button Tengah Melayang (Asesmen) */}
        <div className="relative -top-6 px-1 flex items-center justify-center">
          <button
            onClick={() => navigate("/prediction")}
            className="w-14 h-14 bg-[#38bdf8] text-white rounded-full flex items-center justify-center shadow-lg shadow-sky-200 border-4 border-white active:scale-95 transition-all"
            aria-label="Mulai Asesmen"
          >
            <Scan className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* 4. AI Chat */}
        <button
          onClick={() => navigate("/chatbot")}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            isActive("/chatbot") ? "text-[#0284c7]" : "text-gray-400"
          }`}
        >
          <Bot className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-medium mt-1">AI Chat</span>
        </button>

        {/* 5. DUA KONDISI: TAMPILAN PROFIL (JIKA SUDAH LOGIN) vs TOMBOL LOGIN BIRU (BELUM LOGIN) */}
        {isLoggedIn ? (
          /* Tampilan Awal: Ikon Profil Biasa */
          <button
            onClick={() => navigate("/user")}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
              isActive("/user") || isActive("/editprofile")
                ? "text-[#0284c7]"
                : "text-gray-400"
            }`}
          >
            <User className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-medium mt-1">Profil</span>
          </button>
        ) : (
          /* Tampilan Belum Login: Tombol Login Biru Menonjol */
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={() => navigate("/login")}
              className="bg-[#0284c7] hover:bg-[#0369a1] text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BottomNavbar;