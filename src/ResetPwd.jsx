import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./api";

const ResetPasswordInput = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Ambil token dari query string (?token=...)
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!password || !confirm) {
      setStatus({ type: "error", msg: "Silakan isi kedua kolom password." });
      return;
    }
    if (password.length < 6) {
      setStatus({ type: "error", msg: "Password minimal 6 karakter." });
      return;
    }
    if (password !== confirm) {
      setStatus({ type: "error", msg: "Password tidak cocok." });
      return;
    }
    if (!token) {
      setStatus({ type: "error", msg: "Token reset password tidak ditemukan." });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStatus({ type: "success", msg: "Password berhasil direset. Mengarahkan ke halaman login..." });
        setTimeout(() => {
          navigate("/login");
        }, 2000); // Arahkan ke login setelah 2 detik
      } else {
        setStatus({ type: "error", msg: data.message || "Gagal reset password." });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "Terjadi kesalahan. Silakan coba lagi." });
    }
    setLoading(false);
  };

  return (
    
    
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Reset Password Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Password baru"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Konfirmasi password baru"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition-colors w-full"
          >
            {loading ? "Mengirim..." : "Reset Password"}
          </button>
        </form>
        {status && (
          <div className={`mt-4 text-sm ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {status.msg}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordInput;