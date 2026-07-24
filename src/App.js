import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './Home';
import PredictionPage from "./Prediction";
import EducationPage from "./Education";
import User from "./user";
import LoginPage from "./login";
import RegisterPage from "./Register";
import Navbar from "./pages/components/Navbar";
import ForumPage from "./Forum";
import ForgotPwdPage from "./ForgotPwd";
import ResetPasswordInput from "./ResetPwd"; 
import EditProfilePage from "./EditProfile";
import ProtectedRoute from "./pages/components/ProtectedRoute";
import EdukasiNutrisiPage from "./EducationNutrition";
import ChatBotPage from "./ChatBot";
import NewForumPage from "./NewForum";
import UpdateForumPage from "./UpdateForum";
import DetailForumPage from "./DetailForum";
import EducationCommunityPage from "./EducationCommunity";
import EducationRisetPage from "./EducationRiset";
import BottomNavbar from "./pages/components/BottomNavbar";

// =========================================================
// CUSTOM HOOK: LOGOUT OTOMATIS GLOBAL (TANPA REDIRECT)
// =========================================================
const useAutoLogout = () => {
  const TIMEOUT_IN_HOURS = 1;
  const TIMEOUT_IN_MS = TIMEOUT_IN_HOURS * 60 * 60 * 1000; // 1 jam dalam milidetik

  const updateLastActivity = () => {
    localStorage.setItem('lastActivity', Date.now().toString());
  };

  const handleLogout = () => {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('lastActivity');

      alert("Sesi Anda telah berakhir. Anda telah keluar dari akun secara otomatis.");
      window.location.reload(); // Refresh halaman agar state Navbar & UI sinkron terhapus
    }
  };

  useEffect(() => {
    // Jalankan fitur pelacakan HANYA jika pengguna sudah login
    const token = localStorage.getItem('token');
    if (!token) return;

    // Set waktu awal saat aplikasi pertama kali dimuat
    updateLastActivity();

    // Daftarkan event listener untuk mendeteksi interaksi pengguna secara global
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach((event) => {
      window.addEventListener(event, updateLastActivity);
    });

    // Jalankan pengecekan berkala (setiap 30 detik)
    const interval = setInterval(() => {
      const lastActivity = localStorage.getItem('lastActivity');

      if (lastActivity) {
        const timeElapsed = Date.now() - parseInt(lastActivity, 10);

        // Jika waktu tidak aktif melebihi batas, lakukan logout
        if (timeElapsed > TIMEOUT_IN_MS) {
          handleLogout();
        }
      }
    }, 30000);

    // Pembersihan event listener & interval saat aplikasi di-unmount
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateLastActivity);
      });
      clearInterval(interval);
    };
  }, []);
};

function App() {
  // Panggil hook auto-logout secara global di sini
  useAutoLogout();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/prediction"
          element={
            <ProtectedRoute>
              <PredictionPage />
            </ProtectedRoute>
          }
        />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/user" element={<User />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/forgotpwd" element={<ForgotPwdPage />} />
        <Route path="/reset-password" element={<ResetPasswordInput />} />
        <Route path="/editprofile" element={<EditProfilePage />} />
        <Route path="/educationnutrition" element={<EdukasiNutrisiPage />} />
        <Route path="/educationcommunity" element={<EducationCommunityPage />} />
        <Route path="/educationriset" element={<EducationRisetPage />} />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <ChatBotPage />
            </ProtectedRoute>
          }
        />
        <Route path="/newforum" element={<NewForumPage />} />
        <Route path="/updateforum/:id" element={<UpdateForumPage />} />
        <Route path="/detailforum/:id" element={<DetailForumPage />} />
      </Routes>

      <BottomNavbar />

    </Router>
  );
}

export default App;