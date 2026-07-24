import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./api";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEdit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setStatus({ type: "error", msg: "Anda belum login." });
      setLoading(false);
      return;
    }

    // Hanya kirim field yang diisi
    const body = {};
    if (name) body.name = name;
    if (email) body.email = email;
    if (newPassword) body.new_password = newPassword;

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/edit-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({
          type: "success",
          msg: "Profil berhasil diperbarui. Mengarahkan ke halaman profil...",
        });
        setTimeout(() => {
          navigate("/user");
        }, 1500);
      } else {
        setStatus({
          type: "error",
          msg: data.message || "Gagal memperbarui profil.",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        msg: "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      {/* Tambahkan 'relative' agar posisi ikon panah pas di pojok kartu */}
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full relative">
        
        {/* Tombol Back ke Home */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 text-gray-500 hover:text-[#0284c7] hover:bg-blue-50 p-1.5 rounded-full transition-colors duration-200"
          title="Kembali ke Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-[#0284c7] text-center">
          Edit Profil
        </h2>

        <form onSubmit={handleEdit} className="space-y-4">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
            placeholder="Nama baru"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
            placeholder="Email baru"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
            placeholder="Password baru (min 6 karakter)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#0284c7] hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold w-full transition-colors"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>

        {status && (
          <div
            className={`mt-4 text-center text-sm ${
              status.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status.msg}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;