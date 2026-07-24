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

export default function ChildGrowthDashboard() {
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

    // 1. Fetch Profil User
    fetch(`${API_BASE_URL}/api/v1/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        // Ekstrak data profil dengan aman (mendukung respons berstruktur tunggal/nested)
        const user = resData.data?.user || resData.data || resData;
        const userId = user.id || user.user_id;

        setProfile({
          name: user.name || "Pengguna",
          email: user.email || "-",
          id: userId,
        });
        setLoading(false);

        // 2. Fetch Riwayat Stunting Menggunakan userId yang tervalidasi
        if (userId) {
          fetch(`${API_BASE_URL}/api/v1/stunting/history/${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          })
            .then((res) => res.json())
            .then((result) => {
              // Ambil array riwayat dari result.data atau result
              const historyData = Array.isArray(result.data)
                ? result.data
                : Array.isArray(result)
                ? result
                : [];

              if (historyData.length > 0) {
                setHistory(historyData);
                const sorted = [...historyData].sort(
                  (a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt)
                );
                
                const lastItem = sorted[0];
                const statusVal = lastItem.risk_type || lastItem.who_classification || lastItem.status || lastItem.result || "-";
                
                setStats({
                  total: historyData.length,
                  lastDate: new Date(lastItem.created_at || lastItem.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }),
                  currentStatus: statusVal,
                });
              } else {
                setHistory([]);
                setStats({ total: 0, lastDate: "-", currentStatus: "-" });
              }
            })
            .catch((err) => {
              console.error("Gagal mengambil riwayat:", err);
              setHistory([]);
              setStats({ total: 0, lastDate: "-", currentStatus: "-" });
            });
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
    if (s.includes("normal") || s.includes("rendah") || s.includes("low")) 
      return <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">Normal</span>;
    if (s.includes("ringan") || s.includes("stunted")) 
      return <span className="bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-medium">Ringan</span>;
    if (s.includes("sedang")) 
      return <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-medium">Sedang</span>;
    if (s.includes("berat") || s.includes("severely")) 
      return <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-medium">Berat</span>;
    return <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium">{status}</span>;
  };

  // Helper fleksibel untuk membaca Usia & Tinggi
  const getAgeValue = (item) => item.age_months ?? item.age ?? item.usia ?? 0;
  const getHeightValue = (item) => item.current_length_cm || item.height_cm || item.height || item.tinggi || 0;

  // Sort history berdasarkan usia
  const sortedHistory = [...history].sort((a, b) => getAgeValue(a) - getAgeValue(b));

  // Filter Gender
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

  // Gabungkan semua usia unik
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

  // Jika tidak terpisah berdasarkan gender (general)
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
                  .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt))
                  .map((item, idx) => (
                    <tr className="border-b hover:bg-gray-50" key={item.id || idx}>
                      <td className="py-3 px-3 font-medium">
                        {new Date(item.created_at || item.createdAt || Date.now()).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-3">{getAgeValue(item)} bln</td>
                      <td className="py-3 px-3 capitalize">{item.gender || "-"}</td>
                      <td className="py-3 px-3">{statusBadge(item.risk_type || item.who_classification || item.status || item.result)}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <Footer />
    </div>
  );
}