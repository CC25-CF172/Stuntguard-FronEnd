import React, { useEffect, useState, useRef } from "react";
import Navbar from './pages/components/Navbar';
import Footer from './pages/components/Footer';
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./api";
// Tambahkan import untuk chart
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

  // Ref untuk chart export
  const chartRef = useRef();

  // Scroll ke atas saat halaman di-refresh/mount
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

    fetch(`${API_BASE_URL}/api/v1/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const user = data.data ? data.data : data;
        setProfile({
          name: user.name || "",
          email: user.email || "",
          id: user.id,
        });
        setLoading(false);

        if (user.id) {
          fetch(`${API_BASE_URL}/api/v1/stunting/history`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          })
            .then(res => res.json())
            .then(result => {
              if (result.success && Array.isArray(result.data)) {
                setHistory(result.data);
                if (result.data.length > 0) {
                  const sorted = [...result.data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                  setStats({
                    total: result.data.length,
                    lastDate: new Date(sorted[0].created_at).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" }),
                    currentStatus: sorted[0].risk_type || "-",
                  });
                } else {
                  setStats({ total: 0, lastDate: "-", currentStatus: "-" });
                }
              } else {
                setHistory([]);
                setStats({ total: 0, lastDate: "-", currentStatus: "-" });
              }
            });
        }
      })
      .catch(() => {
        setProfile({ name: "Pengguna", email: "-", id: null });
        setLoading(false);
      });
  }, []);

  const statusBadge = (status) => {
    if (!status) return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">-</span>;
    const s = status.toLowerCase();
    if (s === "normal") return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Normal</span>;
    if (s === "ringan") return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">Ringan</span>;
    if (s === "sedang") return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">Sedang</span>;
    if (s === "berat") return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">Berat</span>;
    return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">{status}</span>;
  };

  // Sort history sekali saja untuk chart
  const sortedHistory = [...history].sort((a, b) => a.age_months - b.age_months);

  // Pisahkan history berdasarkan gender
  const maleHistory = sortedHistory.filter(
    item => (item.gender === "Laki-laki" || item.gender === "M") && item.current_length_cm && item.current_length_cm > 0
  );
  const femaleHistory = sortedHistory.filter(
    item => (item.gender === "Perempuan" || item.gender === "F") && item.current_length_cm && item.current_length_cm > 0
  );

  // Gabungkan semua usia unik untuk label sumbu X
  const allAges = Array.from(
    new Set([...maleHistory, ...femaleHistory].map(item => item.age_months))
  ).sort((a, b) => a - b);

  // Fungsi untuk mapping tinggi badan berdasarkan usia
  const getDataByAge = (historyArr, ages) =>
    ages.map(age => {
      const found = historyArr.find(item => item.age_months === age);
      return found ? found.current_length_cm : null;
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
      pointHoverRadius: 8,
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
      pointHoverRadius: 8,
      borderWidth: 3,
      tension: 0.3,
      spanGaps: true,
    });
  }

  const chartData = {
    labels: allAges.map(age => `${age} bln`),
    datasets,
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { title: { display: true, text: "Usia (bulan)" } },
      y: { title: { display: true, text: "Tinggi Badan (cm)" }, beginAtZero: true },
    },
  };

  // Fungsi download chart as image
  const handleDownloadChart = () => {
    // Chart.js v4: gunakan chartRef.current.canvas
    // chartRef.current adalah instance Chart.js dari react-chartjs-2 v4+
    // chartRef.current.canvas = canvas element
    try {
      const chartInstance = chartRef.current;
      if (!chartInstance) return;
      // Untuk react-chartjs-2 v4, gunakan chartRef.current.canvas
      const url = chartInstance.canvas.toDataURL("image/png", 1.0);

      // Buat link download
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl mb-6">
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
            className="border border-blue-400 text-blue-500 px-4 py-1 rounded-md hover:bg-blue-100 text-sm"
            onClick={() => navigate("/editprofile")}>
            Edit Profil
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Growth Chart */}
          <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Grafik Pertumbuhan Anak</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div
                className="bg-gray-100 h-64 flex flex-col items-center justify-center rounded-md text-sm text-gray-500 flex-1 max-w-full sm:max-w-none"
              >
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
              <div className="flex flex-col gap-2 mt-4 sm:mt-0 order-1 sm:order-none">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full" style={{ background: "#2563eb" }}></span>
                  <span className="text-xs text-gray-700">Laki-laki</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full" style={{ background: "#22c55e" }}></span>
                  <span className="text-xs text-gray-700">Perempuan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-2">Statistik Cepat</h3>
              <p className="text-sm py-1">Total Asesmen <span className="float-right font-medium">{stats.total}</span></p>
              <p className="text-sm py-1">Asesmen Terakhir <span className="float-right font-medium">{stats.lastDate}</span></p>
              <p className="text-sm py-1">Status Saat Ini <span className="float-right">{statusBadge(stats.currentStatus)}</span></p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow space-y-2">
              <h3 className="font-semibold mb-2">Aksi Cepat</h3>
              <button
                className="bg-[#0284c7] hover:bg-blue-600 text-white w-full py-2 rounded-md text-sm font-medium"
                onClick={() => navigate("/prediction")}
              >
                Asesmen Baru
              </button>
              <button
                className="border border-blue-400 text-blue-500 w-full py-2 rounded-md text-sm"
                onClick={handleDownloadChart}
              >
                Unduh Grafik Pertumbuhan
              </button>
            </div>
          </div>
        </div>

        {/* Assessment History */}
        <div className="mt-6 bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-4">Riwayat Asesmen</h3>
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2">TANGGAL</th>
                <th className="py-2">USIA (BULAN)</th>
                <th className="py-2">GENDER</th>
                <th className="py-2">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-400">Belum ada data asesmen.</td>
                </tr>
              ) : (
                history
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map((item, idx) => (
                    <tr className="border-b" key={item.id || idx}>
                      <td className="py-2">{new Date(item.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}</td>
                      <td>{item.age_months}</td>
                      <td>{item.gender || "-"}</td>
                      <td>{statusBadge(item.risk_type)}</td>
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