import React from "react";
import Navbar from "./pages/components/Navbar";
import Footer from "./pages/components/Footer";
import { useEffect } from "react";
import gambar1 from "./assets/gambarEducation1.jpg";

const EducationRiset = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
          <img
            src={gambar1}
            alt="Ilustrasi Riset Stunting"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <h1 className="text-3xl font-bold text-[#0A192F] mb-4">
            Riset dan Data: Fondasi Penanganan Stunting yang Efektif
          </h1>
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span>Oleh Tim StuntGuard</span>
            <span className="mx-2">•</span>
            <span>Juni 2025</span>
          </div>
          <div className="prose prose-lg prose-slate max-w-none text-justify">
            <p>
              Stunting merupakan salah satu masalah kesehatan masyarakat yang sangat kompleks, dan penanganannya memerlukan strategi yang berbasis bukti. Di sinilah peran riset dan data menjadi sangat penting dalam upaya menurunkan prevalensi stunting di Indonesia. Tanpa data yang akurat dan riset yang mendalam, intervensi yang dilakukan sering kali tidak tepat sasaran dan tidak berdampak maksimal.
            </p>
            <h2>Pentingnya Riset dalam Mengungkap Akar Masalah</h2>
            <p>
              Banyak penelitian telah menunjukkan bahwa penyebab stunting tidak hanya berkaitan dengan kurangnya asupan gizi, tetapi juga dipengaruhi oleh faktor sosial, ekonomi, sanitasi, pendidikan ibu, serta layanan kesehatan dasar. Riset-riset ini memberikan wawasan penting bahwa solusi stunting harus bersifat multisektoral dan tidak bisa ditangani hanya dari satu sisi saja.
            </p>
            <p>
              Sebagai contoh, data dari Riset Kesehatan Dasar (Riskesdas) dan Survei Status Gizi Balita Indonesia (SSGBI) telah memberikan gambaran menyeluruh tentang daerah-daerah dengan angka stunting tinggi. Dengan pemetaan ini, pemerintah dan lembaga terkait dapat mengarahkan program intervensi ke lokasi yang paling membutuhkan.
            </p>
            <h2>Inovasi Berbasis Data</h2>
            <p>
              Berkat riset, muncul berbagai inovasi pendekatan penanganan stunting, mulai dari pengembangan formula makanan tambahan lokal, intervensi edukatif berbasis aplikasi, hingga program pemantauan tumbuh kembang anak secara digital. Data juga memungkinkan evaluasi program secara periodik, agar setiap kebijakan dapat diperbaiki berdasarkan hasil implementasi di lapangan.
            </p>
            <p>
              Misalnya, studi longitudinal yang mengamati anak dari masa kandungan hingga usia 5 tahun dapat memberikan pemahaman mendalam tentang momen-momen kritis dalam tumbuh kembang anak. Informasi ini menjadi landasan dalam menyusun kebijakan 1000 Hari Pertama Kehidupan (HPK) sebagai periode emas untuk pencegahan stunting.
            </p>
            <h2>Keterlibatan Perguruan Tinggi dan Lembaga Penelitian</h2>
            <p>
              Lembaga riset dan perguruan tinggi memiliki peran strategis dalam mengembangkan ilmu pengetahuan terkait stunting. Melalui kolaborasi antara akademisi, praktisi, dan pemerintah, hasil-hasil penelitian dapat lebih mudah diimplementasikan menjadi program yang berkelanjutan dan tepat guna. Program Kampus Merdeka juga memberi ruang bagi mahasiswa dan dosen untuk turun langsung melakukan pengabdian masyarakat berbasis riset, termasuk di wilayah-wilayah rawan stunting.
            </p>
            <h2>Menuju Penanganan Stunting yang Presisi</h2>
            <p>
              Masa depan penanganan stunting akan sangat bergantung pada sejauh mana kita mampu memanfaatkan teknologi data. Pendekatan berbasis Artificial Intelligence dan Big Data mulai digunakan untuk memprediksi wilayah rawan, menentukan prioritas intervensi, dan mengukur efektivitas kebijakan. Pemerintah juga didorong untuk terus meningkatkan sistem pencatatan dan pelaporan yang terintegrasi antar sektor.
            </p>
            <p>
              Dalam konteks ini, riset tidak hanya dilihat sebagai bagian dari dunia akademis, tetapi juga sebagai alat untuk menyelamatkan masa depan generasi Indonesia. Dengan riset yang kuat, program yang tepat sasaran, dan pemanfaatan data yang cerdas, Indonesia memiliki peluang besar untuk menurunkan angka stunting secara signifikan menjelang 2045.
            </p>
            <p>
              Maka dari itu, mari terus mendukung penguatan ekosistem riset dan data sebagai fondasi utama dalam membangun kebijakan kesehatan yang lebih baik dan inklusif bagi seluruh anak Indonesia.
            </p>
          </div>
        </div>
      </div>
      <Footer />

      <BottomNavbar />
    </div>
  );
};

export default EducationRiset;
