import React, { useEffect, useState, useRef } from "react";
import Navbar from './pages/components/Navbar';
import Footer from './pages/components/Footer';
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function User() {
  const [profile, setProfile] = useState({ name: "", email: "", id: null });
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    lastDate: "-",
    currentStatus: "-",
  });

  const chartRef = useRef();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setProfile({ name: "Pengguna", email: "-", id: null });
      setLoading(false);
      return;
    }

    // Helper: cari nilai id dari object apapun, toleran terhadap variasi nama key
    const extractId = (obj) => {
      if (!obj || typeof obj !== "object") return null;
      const keys = ["id", "user_id", "userId", "uid", "ID", "Id"];
      for (const k of keys) {
        if (obj[k] !== undefined && obj[k] !== null) return obj[k];
      }
      return null;
    };

    // Helper Dekode JWT Token
    const getUserIdFromToken = (jwtToken) => {
      try {
        const base64Url = jwtToken.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decoded = JSON.parse(jsonPayload);
        console.log("Payload Decoded JWT Token:", decoded);
        return extractId(decoded) || decoded.sub || null;
      } catch (e) {
        console.error("Gagal decode token JWT:", e);
        return null;
      }
    };

    // 1. Fetch Profil User
    fetch(`${API_BASE_URL}/api/v1/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        console.log(">>> Full Response Profil dari Backend:", resData);

        // Cari ID di berbagai lapisan response JSON backend
        let rawId = null;
        let name = "Pengguna";
        let email = "-";

        if (resData) {
          if (resData.data) {
            rawId = extractId(resData.data);
            name = resData.data.name || name;
            email = resData.data.email || email;
          } else {
            rawId = extractId(resData);
            name = resData.name || name;
            email = resData.email || email;
          }
        }

        // Cadangan: Ambil dari token JWT jika profil tidak membawa ID
        if (!rawId) {
          rawId = getUserIdFromToken(token);
        }

        // PENTING: id user di backend ini berupa UUID (string), BUKAN integer.
        // Jangan di-convert pakai Number(), karena Number(UUID) akan menghasilkan NaN
        // dan bikin fetch history tidak pernah jalan.
        const userId = rawId || null;
        console.log(">>> Final ID User yang digunakan:", userId);

        setProfile({ name, email, id: userId });
        setLoading(false);

        // 2. Fetch History jika ID ditemukan
        if (userId) {
          fetch(`${API_BASE_URL}/api/v1/stunting/history/${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then(async (res) => {
              const result = await res.json();
              console.log(">>> Response Stunting History:", result);
              if (!res.ok) throw new Error(result.message || "Gagal mengambil history");
              return result;
            })
            .then((result) => {
              const historyData = Array.isArray(result.data)
                ? result.data
                : Array.isArray(result)
                ? result
                : [];

              if (historyData.length > 0) {
                setHistory(historyData);

                const sorted = [...historyData].sort(
                  (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
                const lastItem = sorted[0];

                setStats({
                  total: historyData.length,
                  lastDate: new Date(lastItem.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }),
                  currentStatus: lastItem.risk_type || lastItem.who_classification || "-",
                });
              } else {
                setHistory([]);
                setStats({ total: 0, lastDate: "-", currentStatus: "-" });
              }
            })
            .catch((err) => {
              // Catatan: backend akan balikin 404 "No stunting history found for this user."
              // kalau user belum pernah asesmen sama sekali. Ini normal, bukan error aplikasi.
              console.error("Error fetching stunting history:", err);
              setHistory([]);
              setStats({ total: 0, lastDate: "-", currentStatus: "-" });
            });
        } else {
          console.error("Gagal mendapatkan User ID dari Profil maupun JWT Token!");
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil profil:", err);
        setProfile({ name: "Pengguna", email: "-", id: null });
        setLoading(false);
      });
  }, []);

  const statusBadge = (status) => {
    if (!status) return <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs">-</span>;
    const s = String(status).toLowerCase();
    if (s === "normal") return <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">Normal</span>;
    if (s === "ringan" || s === "stunted") return <span className="bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-medium">Ringan</span>;
    if (s === "sedang") return <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-medium">Sedang</span>;
    if (s === "berat" || s === "severely stunted") return <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-medium">Berat</span>;
    return <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium">{status}</span>;
  };

  const getHeightValue = (item) => item.current_length_cm || item.height_cm || item.height || 0;
  const getAgeValue = (item) => item.age_months ?? item.age ?? 0;

  const sortedHistory = [...history].sort((a, b) => getAgeValue(a) - getAgeValue(b));

  const maleHistory = sortedHistory.filter(
    (item) =>
      (item.gender?.toLowerCase() === "male" ||
        item.gender?.toLowerCase() === "laki-laki" ||
        item.gender === "M") &&
      getHeightValue(item) > 0
  );

  const femaleHistory = sortedHistory.filter(
    (item) =>
      (item.gender?.toLowerCase() === "female" ||
        item.gender?.toLowerCase() === "perempuan" ||
        item.gender === "F") &&
      getHeightValue(item) > 0
  );

  const allAges = Array.from(
    new Set(sortedHistory.map((item) => getAgeValue(item)))
  ).sort((a, b) => a - b);

  const getDataByAge = (historyArr, ages) =>
    ages.map((age) => {
      const found = historyArr.find((item) => getAgeValue(item) === age);
      return found ? getHeightValue(found) : null;
    });

  const datasets = [];

  if (maleHistory.length > 0) {
    datasets.push({
      label: "Tinggi Badan (cm) - Laki-laki",
      data: getDataByAge(maleHistory, allAges),
      fill: false,
      borderColor: "#2563eb",
      backgroundColor: "#60a5fa",
      pointBackgroundColor: "#2563eb",
      pointBorderColor: "#fff",
      pointRadius: 6,
      borderWidth: 3,
      tension: 0.3,
      spanGaps: true,
    });
  }

  if (femaleHistory.length > 0) {
    datasets.push({
      label: "Tinggi Badan (cm) - Perempuan",
      data: getDataByAge(femaleHistory, allAges),
      fill: false,
      borderColor: "#22c55e",
      backgroundColor: "#4ade80",
      pointBackgroundColor: "#22c55e",
      pointBorderColor: "#fff",
      pointRadius: 6,
      borderWidth: 3,
      tension: 0.3,
      spanGaps: true,
    });
  }

  if (datasets.length === 0 && sortedHistory.length > 0) {
    datasets.push({
      label: "Tinggi Badan (cm)",
      data: sortedHistory.map((item) => getHeightValue(item)),
      fill: false,
      borderColor: "#0284c7",
      backgroundColor: "#38bdf8",
      pointBackgroundColor: "#0284c7",
      pointBorderColor: "#fff",
      pointRadius: 6,
      borderWidth: 3,
      tension: 0.3,
      spanGaps: true,
    });
  }

  const chartData = {
    labels: allAges.map((age) => `${age} bln`),
    datasets,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { title: { display: true, text: "Usia (bulan)" } },
      y: { title: { display: true, text: "Tinggi Badan (cm)" }, beginAtZero: false },
    },
  };

  const handleDownloadChart = () => {
    try {
      const chartInstance = chartRef.current;
      if (!chartInstance) return;
      const url = chartInstance.canvas.toDataURL("image/png", 1.0);

      const link = document.createElement("a");
      link.href = url;
      link.download = "grafik-pertumbuhan-anak.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Gagal mengunduh grafik.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header Profil */}
        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl mb-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-lg font-bold">👤</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">
                {loading ? "Memuat..." : profile.name}
              </h1>
              <p className="text-sm text-gray-500">
                {loading ? "Memuat..." : profile.email}
              </p>
            </div>
          </div>
          <button
            className="border border-blue-400 text-blue-500 px-4 py-1.5 rounded-md hover:bg-blue-100 text-sm font-medium transition"
            onClick={() => navigate("/editprofile")}
          >
            Edit Profil
          </button>
        </div>

        {/* Grid Konten Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grafik Pertumbuhan */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg text-gray-800">
                Grafik Pertumbuhan Anak
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="bg-gray-50 h-72 w-full p-2 flex flex-col items-center justify-center rounded-lg border text-sm text-gray-500 flex-1">
                {history.length === 0 ? (
                  <span>Belum ada data pertumbuhan.</span>
                ) : (
                  <Line
                    ref={chartRef}
                    data={chartData}
                    options={chartOptions}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2 mt-2 sm:mt-0">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3.5 h-3.5 rounded-full" style={{ background: "#2563eb" }}></span>
                  <span className="text-xs text-gray-700 font-medium">Laki-laki</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3.5 h-3.5 rounded-full" style={{ background: "#22c55e" }}></span>
                  <span className="text-xs text-gray-700 font-medium">Perempuan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistik Cepat & Tombol Aksi */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Statistik Cepat</h3>
              <p className="text-sm py-1.5 text-gray-600">Total Asesmen <span className="float-right font-semibold text-gray-900">{stats.total}</span></p>
              <p className="text-sm py-1.5 text-gray-600">Asesmen Terakhir <span className="float-right font-semibold text-gray-900">{stats.lastDate}</span></p>
              <p className="text-sm py-1.5 text-gray-600">Status Saat Ini <span className="float-right">{statusBadge(stats.currentStatus)}</span></p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow space-y-2.5">
              <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Aksi Cepat</h3>
              <button
                className="bg-[#0284c7] hover:bg-blue-600 text-white w-full py-2.5 rounded-lg text-sm font-medium transition"
                onClick={() => navigate("/prediction")}
              >
                Asesmen Baru
              </button>
              <button
                className="border border-blue-400 text-blue-500 hover:bg-blue-50 w-full py-2.5 rounded-lg text-sm font-medium transition"
                onClick={handleDownloadChart}
              >
                Unduh Grafik Pertumbuhan
              </button>
            </div>
          </div>
        </div>

        {/* Tabel Riwayat Asesmen */}
        <div className="mt-6 bg-white p-5 rounded-xl shadow overflow-x-auto">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">Riwayat Asesmen</h3>
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-3">TANGGAL</th>
                <th className="py-3 px-3">USIA (BULAN)</th>
                <th className="py-3 px-3">GENDER</th>
                <th className="py-3 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400">
                    Belum ada data asesmen.
                  </td>
                </tr>
              ) : (
                [...history]
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map((item, idx) => (
                    <tr className="border-b hover:bg-gray-50" key={item.id || idx}>
                      <td className="py-3 px-3 font-medium">
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-3">{getAgeValue(item)} bln</td>
                      <td className="py-3 px-3 capitalize">{item.gender || "-"}</td>
                      <td className="py-3 px-3">{statusBadge(item.risk_type || item.who_classification)}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <Footer />

      <BottomNavbar />
    </div>
  );
}