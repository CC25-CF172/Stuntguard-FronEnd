import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "./pages/components/Navbar";
import { API_BASE_URL } from "./api";
import { FaTrashAlt, FaEdit, FaCommentDots, FaSearch } from "react-icons/fa";
import Footer from "./pages/components/Footer";
import { useNavigate } from "react-router-dom";

const formatRelativeTime = (dateString) => {
  const now = new Date();
  const postedDate = new Date(dateString);
  const diff = Math.floor((now - postedDate) / 1000);

  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;

  return postedDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const ForumPage = () => {
  const [forums, setForums] = useState([]);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");

  const menuRefs = useRef({});
  const navigate = useNavigate();

  const getAllForum = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/forum`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const sortedForums = data.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setForums(sortedForums);
      } else {
        console.error("Gagal ambil forum:", data.message);
        setForums([]); // Set ke array kosong jika gagal
      }
    } catch (err) {
      console.error("Gagal ambil forum:", err);
      setForums([]); // Set ke array kosong jika ada error
    }
  }, [token]);

  const getAllReplies = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/forum-replies`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setReplies(data.data || []);
      
      } else if (data.message === "Belum ada Komentar") {
        setReplies([]); // Set ke array kosong jika belum ada komentar
      } else {
        console.error("Gagal ambil komentar:", data.message);
        setReplies([]); // Set ke array kosong jika gagal
      }
    } catch (err) {
      console.error("Gagal ambil komentar:", err);
      setReplies([]); // Set ke array kosong jika ada error
    }
  }, [token]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus forum ini?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/forum/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setForums((prev) => prev.filter((f) => f.id !== id));
      } else {
        console.error("Gagal menghapus forum");
      }
    } catch (err) {
      console.error("Error saat menghapus:", err);
    }
  };

  const fetchProfile = useCallback(async () => {
    if (token) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/profile`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setCurrentUserId(data.data.id);
        } else {
          console.error("Gagal memuat profil:", data.message);
          setCurrentUserId(null);
        }
      } catch (err) {
        console.error("Gagal memuat profil:", err);
        setCurrentUserId(null);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getAllForum(), getAllReplies(), fetchProfile()]);
      setLoading(false); // Set loading ke false setelah semua selesai
    };
    fetchData();
  }, [getAllForum, getAllReplies, fetchProfile]);

  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openMenuId &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId].contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openMenuId]);

  return (
    <>
      <Navbar />

      <section className="bg-gradient-to-r from-sky-500 via-sky-600 to-green-400 py-16 px-4 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full md:w-2/3 px-2 md:px-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
              Forum Komunitas
            </h1>
            <p className="text-sm md:text-md text-white mb-2">
              Terhubung dengan orang tua dan profesional kesehatan lainnya untuk
              berbagi <br />
              pengalaman dan mendapatkan saran.
            </p>
          </div>
          <div className="w-full md:w-auto px-2 md:px-14">
            <button
              onClick={() => navigate("/newforum")}
              className="w-full md:w-auto bg-white text-blue-600 font-semibold px-4 py-3 rounded-2xl shadow hover:bg-blue-100 transition"
            >
              Mulai Diskusi Baru
            </button>
          </div>
        </div>
      </section>

      <div className="bg-gray-50 py-4 shadow-md">
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <FaSearch className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Cari diskusi disini..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50">
        <div className="px-4 pb-10 max-w-3xl mx-auto">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="space-y-4">
              {forums
                .filter(
                  (forum) =>
                    forum.title.toLowerCase().includes(search.toLowerCase()) ||
                    forum.content.toLowerCase().includes(search.toLowerCase())
                )
                .map((forum) => {
                  const forumReplies = replies.filter(
                    (r) => r.forum_id === forum.id
                  );

                  return (
                    <div
                      key={forum.id}
                      onClick={() => navigate(`/detailforum/${forum.id}`)}
                      className="relative border rounded-2xl p-5 shadow-md hover:shadow-lg transition bg-white cursor-pointer"
                    >
                      {/* Forum Menu */}
                      <div
                        className="absolute top-3 right-4 text-right z-10"
                        ref={(el) => (menuRefs.current[forum.id] = el)}
                      >
                        {String(forum.user_id) === String(currentUserId) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMenu(forum.id);
                            }}
                            className="text-gray-500 hover:text-gray-800 text-xl"
                          >
                            ⋮
                          </button>
                        )}

                        {openMenuId === forum.id &&
                          String(forum.user_id) === String(currentUserId) && (
                            <div className="mt-2 bg-white border rounded shadow-md absolute right-0 w-32 text-base">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  localStorage.setItem(
                                    "forumToUpdate",
                                    JSON.stringify(forum)
                                  );
                                  navigate(`/updateforum/${forum.id}`);
                                }}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                              >
                                <FaEdit className="text-gray-600" /> Ubah
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(forum.id);
                                }}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                              >
                                <FaTrashAlt className="text-red-600" /> Hapus
                              </button>
                            </div>
                          )}
                      </div>

                      {/* Forum Content */}
                      <h3 className="text-xl font-semibold">{forum.title}</h3>
                      <p className="text-gray-700 mt-2">
                        {forum.content.length > 300 ? (
                          <>
                            {forum.content.slice(0, 300)}...
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/detailforum/${forum.id}`);
                              }}
                              className="text-blue-600 cursor-pointer underline ml-1"
                            >
                              Lihat Selengkapnya
                            </span>
                          </>
                        ) : (
                          forum.content
                        )}
                      </p>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                        <p className="text-sm text-gray-400 mt-2">
                          {forum.user_name || "Anonymous"} • Diposting{" "}
                          {formatRelativeTime(forum.created_at)}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/detailforum/${forum.id}`);
                          }}
                          className="flex items-center gap-2 text-blue-500 hover:underline"
                        >
                          <FaCommentDots />
                          <span className="text-sm">
                            {forumReplies.length} Komentar
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForumPage;