import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "./pages/components/Navbar";
import { API_BASE_URL } from "./api";
import Footer from "./pages/components/Footer";

const UpdateForumPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const forum = JSON.parse(localStorage.getItem("forumToUpdate"));
    if (forum) {
      setTitle(forum.title);
      setContent(forum.content);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/forum/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal memperbarui forum");
      }

      alert("Forum berhasil diperbarui!");
      navigate("/forum");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengUpdate forum.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="body bg-gray-50">
        <div className="max-w-3xl mx-auto bg-gray-50 pt-2 text-left px-6">
          <Link
            to="/forum"
            className="text-blue-600 hover:underline text-base md:text-lg inline-block mb-2"
          >
            ← Kembali ke Forum
          </Link>
        </div>
        <div className="wrapper mx-auto max-w-3xl p-6 py-10">
          <form
            onSubmit={handleSubmit}
            className="mb-6 bg-white p-4 rounded-2xl shadow"
          >
            <h3 className="text-2xl font-bold mb-2 p-2 opacity-90">
              Update Discussion
            </h3>

            <label htmlFor="title" className="font-semibold mb-2 p-2 text-sm">
              Discussion Title
            </label>
            <input
              type="text"
              className="bg-slate-50 w-full p-2 border rounded-xl mb-4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label htmlFor="content" className="font-semibold mb-2 p-2 text-sm">
              Content
            </label>
            <textarea
              rows={10}
              className="bg-slate-50 w-full p-2 border rounded-xl mb-4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>
      </div>
      <Footer />

      <BottomNavbar />
    </>
  );
};

export default UpdateForumPage;
