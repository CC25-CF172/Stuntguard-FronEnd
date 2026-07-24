import React from "react";
import Navbar from "./pages/components/Navbar";
import Footer from "./pages/components/Footer";
import { useEffect } from "react";
import gambar1 from "./assets/stunting2.png";
import BottomNavbar from "./pages/components/BottomNavbar";

const EducationCommunity = () => {
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
            alt="Ilustrasi Komunitas Cegah Stunting"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <h1 className="text-3xl font-bold text-[#0A192F] mb-4">
            Peran Komunitas dalam Mencegah Stunting: Kunci Masa Depan Anak yang Lebih Sehat
          </h1>
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span>Oleh Tim StuntGuard</span>
            <span className="mx-2">•</span>
            <span>Juni 2025</span>
          </div>
          <div className="prose prose-lg prose-slate max-w-none text-justify">
            <p>
              Stunting masih menjadi permasalahan serius di Indonesia. Ini merupakan kondisi gagal tumbuh akibat kekurangan gizi kronis, yang berdampak pada pertumbuhan fisik dan perkembangan otak anak. Pencegahan stunting tidak bisa diserahkan hanya kepada pemerintah atau tenaga medis, tetapi perlu melibatkan semua pihak, termasuk komunitas lokal.
            </p>
            <h2>Mengapa Komunitas Penting?</h2>
            <p>
              Anak yang mengalami stunting berisiko lebih tinggi mengalami hambatan belajar, rentan penyakit, dan memiliki produktivitas lebih rendah saat dewasa. Komunitas memiliki posisi strategis untuk mencegah kondisi ini melalui pendekatan berbasis lokal dan gotong royong.
            </p>
            <h2>5 Peran Penting Komunitas dalam Pencegahan Stunting</h2>
            <ul>
              <li>
                <strong>Edukasi Gizi:</strong> Komunitas dapat menyelenggarakan penyuluhan tentang pentingnya gizi seimbang, ASI eksklusif, dan MPASI sehat melalui Posyandu, kelompok ibu, atau kegiatan sosial.
              </li>
              <li>
                <strong>Pemantauan Tumbuh Kembang:</strong> Kader kesehatan dan relawan lokal bisa dilatih untuk memantau pertumbuhan anak dan mendeteksi risiko stunting sejak dini.
              </li>
              <li>
                <strong>Dapur Sehat Komunitas:</strong> Program dapur sehat menyediakan makanan bergizi untuk ibu hamil, menyusui, dan balita secara gotong royong atau melalui dana CSR.
              </li>
              <li>
                <strong>Sanitasi dan Kebersihan:</strong> Komunitas dapat bergotong royong memperbaiki sanitasi, membangun jamban sehat, dan menjaga kebersihan lingkungan.
              </li>
              <li>
                <strong>Dukungan Psikososial:</strong> Ibu hamil dan orang tua memerlukan dukungan emosional agar tidak stres dalam menjalani peran pengasuhan. Komunitas yang suportif akan memperkuat ketahanan keluarga.
              </li>
            </ul>
            <h2>Kolaborasi Menuju Generasi Emas 2045</h2>
            <p>
              Untuk menciptakan generasi sehat dan cerdas, setiap elemen masyarakat perlu berkolaborasi. Komunitas bisa menjadi motor penggerak yang menjembatani antara kebijakan pemerintah dan kebutuhan nyata di lapangan. Melalui aksi kolektif, seperti pendampingan keluarga, kegiatan gotong royong, serta penyediaan layanan berbasis lokal, kita bisa menurunkan angka stunting secara signifikan.
            </p>
            <p>
              Mari jadikan komunitas sebagai garda terdepan dalam membangun masa depan yang lebih baik bagi anak-anak Indonesia. Karena mencegah stunting bukan hanya soal nutrisi, tetapi juga soal kepedulian dan solidaritas sosial. Dari komunitas, untuk anak-anak bangsa.
            </p>
          </div>
        </div>
      </div>
      <Footer />

      <BottomNavbar />
    </div>
  );
};

export default EducationCommunity;
