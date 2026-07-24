import React, { useState, useEffect, useRef } from "react";
import Navbar from "./pages/components/Navbar";
import Footer from "./pages/components/Footer";
import { API_BASE_URL } from "./api";
import html2pdf from "html2pdf.js"; // Impor statis

// Main Prediction Component
const PredictionPage = () => {
  // Scroll ke atas saat halaman di-refresh/mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const [formData, setFormData] = useState({
    childGender: "",
    ageMonths: "",
    birthWeight: "",
    birthLength: "",
    currentWeight: "",
    currentLength: "",
    exclusiveBreastfeeding: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [recommendation, setRecommendation] = useState(null); // Tambahkan state untuk rekomendasi
  const [error, setError] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Tambahan untuk PDF
  const resultRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setRecommendation(null);

    const payload = {
      gender: formData.childGender === "male" ? "M" : "F",
      age_months: Number(formData.ageMonths),
      birth_weight_kg: Number(formData.birthWeight),
      birth_length_cm: Number(formData.birthLength),
      current_weight_kg: Number(formData.currentWeight),
      current_length_cm: Number(formData.currentLength),
      exclusive_breastfeeding:
        formData.exclusiveBreastfeeding === "yes" ? "Yes" : "No",
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/v1/stunting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setResult(data.data);

        // Ambil rekomendasi detail dari response (data.data.recommendation_notes)
        setRecommendation(data.data.recommendation_notes || null);
      } else {
        setError(data.message || "Prediction failed.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  // Helper untuk render rekomendasi dinamis
  const renderRecommendationNotes = (notes) => {
    if (!notes) return null;
    const labelMap = {
      RekomendasiUtama: "Rekomendasi Utama",
      RekomendasiGizi: "Rekomendasi Gizi",
      RekomendasiGiziKhusus: "Rekomendasi Gizi Khusus",
      RekomendasiPerawatan: "Rekomendasi Perawatan",
      JadwalKontrol: "Jadwal Kontrol",
      TindakanSegera: "Tindakan Segera",
      ProgramIntensif: "Program Intensif",
      ProgramKhusus: "Program Khusus",
      MakananYangDirekomendasikan: "Makanan yang Direkomendasikan",
    };
    const colorMap = {
      RekomendasiUtama: "green-400",
      RekomendasiGizi: "blue-400",
      RekomendasiGiziKhusus: "blue-600",
      RekomendasiPerawatan: "purple-400",
      JadwalKontrol: "yellow-400",
      TindakanSegera: "red-400",
      ProgramIntensif: "pink-400",
      ProgramKhusus: "indigo-400",
      MakananYangDirekomendasikan: "teal-400",
    };

    const sections = Object.keys(notes).map((key) => ({
      key,
      title: labelMap[key] || key,
      color: colorMap[key] || "gray-400",
      items: notes[key],
    }));

    return (
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div
            key={section.key}
            className={`pl-4 border-l-4 border-${section.color}`}
          >
            <h4 className="font-semibold mb-2">{idx + 1}. {section.title}</h4>
            <ul className="space-y-2 text-gray-700">
              {section.items.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  // Fungsi unduh PDF
  const handleDownloadPDF = () => {
    const element = resultRef.current;
    if (!element) return;

    // Sembunyikan tombol PDF saat export
    const btnPDFs = element.querySelectorAll(".btn-hide-pdf");
    btnPDFs.forEach((btn) => (btn.style.display = "none"));

    const opt = {
      margin: 0.5,
      filename: `hasil-asesmen-stunting.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save().then(() => {
      // Kembalikan tampilan tombol setelah export
      btnPDFs.forEach((btn) => (btn.style.display = ""));
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Alat Prediksi Stunting
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Masukkan data pengukuran dan informasi anak Anda untuk mendapatkan
            asesmen risiko stunting secara personal. Alat ini menggunakan standar
            pertumbuhan WHO untuk mengevaluasi tinggi badan menurut usia dan
            parameter penting lainnya.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Asesmen Pertumbuhan Anak
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jenis Kelamin Anak <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="childGender"
                        value={formData.childGender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="male">Laki-laki</option>
                        <option value="female">Perempuan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Usia (bulan) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="ageMonths"
                        value={formData.ageMonths}
                        onChange={handleInputChange}
                        placeholder="misal: 24"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        max="60"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Masukkan usia antara 0-60 bulan
                      </p>
                    </div>
                  </div>
                  {/* Birth Measurements */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      PENGUKURAN SAAT LAHIR
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Berat Lahir (kg) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="birthWeight"
                          value={formData.birthWeight}
                          onChange={handleInputChange}
                          placeholder="misal: 3.2"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          step="0.1"
                          min="0.5"
                          max="6"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Panjang Lahir (cm) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="birthLength"
                          value={formData.birthLength}
                          onChange={handleInputChange}
                          placeholder="misal: 50"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="30"
                          max="70"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  {/* Current Measurements */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      PENGUKURAN SAAT INI
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Berat Saat Ini (kg) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="currentWeight"
                          value={formData.currentWeight}
                          onChange={handleInputChange}
                          placeholder="misal: 12.5"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          step="0.1"
                          min="1"
                          max="50"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tinggi/Panjang Saat Ini (cm) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="currentLength"
                          value={formData.currentLength}
                          onChange={handleInputChange}
                          placeholder="misal: 85"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="40"
                          max="150"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  {/* Nutrition History */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      RIWAYAT NUTRISI
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        ASI Eksklusif selama 6 bulan pertama{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="exclusiveBreastfeeding"
                            value="yes"
                            checked={formData.exclusiveBreastfeeding === "yes"}
                            onChange={handleInputChange}
                            className="mr-2 text-blue-600"
                            required
                          />
                          Ya
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="exclusiveBreastfeeding"
                            value="no"
                            checked={formData.exclusiveBreastfeeding === "no"}
                            onChange={handleInputChange}
                            className="mr-2 text-blue-600"
                            required
                          />
                          Tidak
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                    disabled={loading}
                  >
                    {loading ? "Memproses..." : "Dapatkan Hasil Asesmen"}
                  </button>
                </div>
              </form>
              {/* Hasil Prediksi */}
              {error && <div className="mt-6 text-red-600">{error}</div>}
              {result && (
                <div
                  className="mt-8 bg-white rounded-lg shadow-lg border p-6"
                  ref={resultRef}
                >
                  {/* Assessment Result Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-green-100 p-2 rounded-full">
                        <svg
                          className="w-6 h-6 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Hasil Asesmen</h2>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-medium ${
                              result.height_for_age_z_score > -1.0
                                ? "text-green-600"
                                : result.height_for_age_z_score > -2.0
                                ? "text-yellow-700"
                                : result.height_for_age_z_score > -3.0
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {result.height_for_age_z_score > -1.0
                              ? "Normal"
                              : result.height_for_age_z_score > -2.0
                              ? "Ringan"
                              : result.height_for_age_z_score > -3.0
                              ? "Sedang"
                              : "Berat"}
                          </span>
                          <span className="text-gray-600">•</span>
                          <span className="text-gray-600">
                            Z-score: {result.height_for_age_z_score.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Tombol Unduh PDF */}
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      className="btn-hide-pdf bg-blue-50 text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center mt-2 sm:mt-0"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Unduh PDF
                    </button>
                  </div>
                  {/* Status Bar */}
                  <div className="mb-10">
                    {/* Desktop/tablet */}
                    <div className="relative h-2 bg-gray-200 rounded-full mb-10 hidden sm:block">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                        style={{ width: "100%" }}
                      />
                      <div className="absolute -bottom-8 left-0 text-xs">
                        <span className="text-red-600 block">Berat</span>
                        <span className="text-gray-500 text-[10px]">
                          Z-score: &lt; -3.0
                        </span>
                      </div>
                      <div className="absolute -bottom-8 left-1/3 text-xs">
                        <span className="text-yellow-600 block">Sedang</span>
                        <span className="text-gray-500 text-[10px]">
                          Z-score: -3.0 s/d -2.0
                        </span>
                      </div>
                      <div className="absolute -bottom-8 left-2/3 text-xs">
                        <span className="text-yellow-700 block">Ringan</span>
                        <span className="text-gray-500 text-[10px]">
                          Z-score: -2.0 s/d -1.0
                        </span>
                      </div>
                      <div className="absolute -bottom-8 right-0 text-xs text-right">
                        <span className="text-green-600 block">Normal</span>
                        <span className="text-gray-500 text-[10px]">
                          Z-score: {">"} -1.0
                        </span>
                      </div>
                    </div>
                    {/* Mobile: tampilkan list warna */}
                    <div className="sm:hidden flex flex-col gap-2 mt-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-4 h-4 rounded bg-red-500"></span>
                        <span className="text-sm font-medium text-red-600">
                          Berat
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          Z-score: &lt; -3.0
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-4 h-4 rounded bg-yellow-500"></span>
                        <span className="text-sm font-medium text-yellow-600">
                          Sedang
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          Z-score: -3.0 s/d -2.0
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-4 h-4 rounded bg-yellow-700"></span>
                        <span className="text-sm font-medium text-yellow-700">
                          Ringan
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          Z-score: -2.0 s/d -1.0
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-4 h-4 rounded bg-green-500"></span>
                        <span className="text-sm font-medium text-green-600">
                          Normal
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          Z-score: {">"} -1.0
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Key Observations */}
                  <div className="mt-8">
                    <h3 className="font-semibold text-lg mb-2">Catatan Penting</h3>
                    <p className="text-gray-700 mb-4">
                      Parameter pertumbuhan anak Anda berada dalam rentang normal
                      untuk usia dan jenis kelaminnya. Pengukuran tinggi badan
                      menurut usia menunjukkan perkembangan yang sehat.
                    </p>
                  </div>
                  {/* Detailed Recommendations */}
                  <div className="mt-6">
                    <button
                      className="flex items-center justify-between w-full text-left font-semibold mb-4"
                      onClick={() => setShowRecommendations(!showRecommendations)}
                    >
                      {showRecommendations ? "Sembunyikan" : "Tampilkan"}{" "}
                      rekomendasi detail
                      <svg
                        className="w-5 h-5 transform transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{
                          transform: showRecommendations
                            ? "rotate(180deg)"
                            : "",
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {/* Recommendations Sections */}
                    {showRecommendations && (
                      recommendation ? (
                        renderRecommendationNotes(recommendation)
                      ) : (
                        <div className="text-gray-500">
                          Tidak ada rekomendasi detail untuk hasil ini.
                        </div>
                      )
                    )}
                  </div>
                  {/* Disclaimer */}
                  <div className="mt-8 text-xs text-gray-500 italic">
                    <strong>Disclaimer:</strong> Alat ini memberikan simulasi
                    asesmen berdasarkan perhitungan sederhana dan hanya untuk
                    edukasi. Selalu konsultasikan dengan tenaga kesehatan untuk
                    saran medis yang akurat.
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* End of Form Section */}
          <div className="space-y-6">
            {/* About This Tool */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tentang Alat Ini
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Alat prediksi ini memberikan asesmen edukatif berdasarkan standar
                pertumbuhan anak dari Organisasi Kesehatan Dunia (WHO). Alat ini
                mengevaluasi pola pertumbuhan anak Anda untuk mengidentifikasi
                potensi risiko stunting.
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Untuk anak usia di bawah 5 tahun, stunting didefinisikan sebagai
                tinggi badan menurut usia lebih dari dua standar deviasi di bawah
                median standar pertumbuhan WHO.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>Catatan:</strong> Alat ini hanya untuk edukasi dan
                  tidak menggantikan saran medis profesional. Selalu
                  konsultasikan dengan tenaga kesehatan untuk diagnosis dan
                  penanganan yang tepat.
                </p>
              </div>
            </div>
            {/* Measurement Tips */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tips Pengukuran
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </span>
                  <p className="text-gray-600 text-sm">
                    Ukur tinggi/panjang badan dengan anak berbaring (di bawah 2
                    tahun) atau berdiri (di atas 2 tahun)
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </span>
                  <p className="text-gray-600 text-sm">
                    Gunakan timbangan digital untuk pengukuran berat badan agar
                    lebih akurat
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </span>
                  <p className="text-gray-600 text-sm">
                    Lakukan pengukuran pada waktu yang sama setiap hari untuk
                    hasil yang konsisten
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <BottomNavbar />
    </div>
  );
};

export default PredictionPage;