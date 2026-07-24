import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import Navbar from "./pages/components/Navbar";
import Footer from "./pages/components/Footer";
import { ArrowUpRight, Heart, Calendar, Users, Smile } from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import carosel1 from "./assets/carosel1.jpeg";
import carosel2 from "./assets/carosel2.png";
import carosel3 from "./assets/carosel3.png";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import BottomNavbar from "./pages/components/BottomNavbaar";

const carouselData = [
  {
    img: carosel1,
    title: "Deteksi Dini Itu Penting",
    desc: "Mengidentifikasi faktor risiko stunting sejak dini dapat membuat perbedaan besar."
  },
  {
    img: carosel2,
    title: "Dukung Pertumbuhan Sehat",
    desc: "Dukung perkembangan optimal anak Anda dengan nutrisi dan perawatan yang tepat."
  },
  {
    img: carosel3,
    title: "Asesmen Personal",
    desc: "Dapatkan rekomendasi yang disesuaikan dengan kebutuhan anak Anda."
  }
];

// Hero Section Responsive
const HeroSection = ({ accordionRef }) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (idx) => setCurrent(idx);

  // Scroll ke accordion section
  const handleScrollToAccordion = () => {
    if (accordionRef && accordionRef.current) {
      accordionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center bg-gradient-to-br from-[#e0f2fe] via-[#cffafe] to-[#e0f2fe] py-10 px-2 sm:py-16 sm:px-4 md:py-24 md:px-8">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-10 md:gap-20 px-2 sm:px-8">
        {/* Kiri: Teks */}
        <div className="w-full md:w-1/2 flex flex-col justify-center mt-8 md:mt-0">
          <h1 className="text-3xl sm:text-5xl md:text-5xl font-bold mb-4 text-[#0A192F] leading-tight text-center md:text-left">
            Cegah <span className="text-[#0284c7]">Stunting</span><br />
            Dukung Pertumbuhan<br />Sehat.
          </h1>
          <p className="mb-8 text-gray-700 text-base sm:text-lg max-w-xl text-center md:text-left mx-auto md:mx-0">
            Deteksi dan intervensi dini sangat penting untuk mencegah stunting dan memastikan tumbuh kembang anak yang optimal. Dapatkan asesmen dan rekomendasi yang dipersonalisasi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors text-base w-full sm:w-auto"
              onClick={() => navigate("/prediction")}
            >
              Mulai Asesmen &rarr;
            </button>
            <button
              className="border border-[#0284c7] text-[#0284c7] hover:bg-[#e0f2fe] font-semibold px-6 py-3 rounded-lg transition-colors text-base w-full sm:w-auto"
              onClick={handleScrollToAccordion}
            >
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
        {/* Kanan: Carousel */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-xs sm:max-w-md md:max-w-xl">
            <div className="rounded-2xl overflow-hidden shadow-lg bg-white min-h-[280px] sm:min-h-[340px] md:min-h-[380px] flex flex-col">
              <img
                src={carouselData[current].img}
                alt={carouselData[current].title}
                className="w-full h-48 sm:h-64 md:h-72 object-cover"
              />
              <div className="p-5 sm:p-7">
                <h2 className="text-lg sm:text-xl font-bold text-[#0A192F] mb-2">{carouselData[current].title}</h2>
                <p className="text-gray-600 text-base sm:text-lg">{carouselData[current].desc}</p>
              </div>
            </div>
            {/* Dot Indicator */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-2">
              {carouselData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`w-3 h-3 rounded-full border-2 ${current === idx ? "bg-[#0284c7] border-[#0284c7]" : "bg-white border-gray-300"}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Stats Section Responsive
const StatsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <section ref={ref} className="text-center py-8 sm:py-12 md:py-16 bg-white text-[#0A192F] px-2 sm:px-4">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Statistik Dampak Stunting</h2>
      <p className="text-gray-700 max-w-2xl mx-auto text-base sm:text-lg mb-8">
        Stunting memengaruhi jutaan anak di seluruh dunia dengan konsekuensi jangka panjang bagi perkembangan fisik dan kognitif.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-6xl mx-auto">
        <div className="bg-gray-100 px-6 py-8 rounded-2xl shadow w-full flex flex-col items-center">
          <span className="text-3xl sm:text-4xl font-bold text-[#0284c7] mb-2">
            {inView && <CountUp start={0} end={149} duration={2} />}Jt+
          </span>
          <span className="text-gray-700 text-base">Anak terdampak stunting secara global</span>
        </div>
        <div className="bg-gray-100 px-6 py-8 rounded-2xl shadow w-full flex flex-col items-center">
          <span className="text-3xl sm:text-4xl font-bold text-[#0284c7] mb-2">
            {inView && <CountUp start={0} end={24.4} duration={2} decimals={1} />}%
          </span>
          <span className="text-gray-700 text-base">Anak Indonesia mengalami stunting</span>
        </div>
        <div className="bg-gray-100 px-6 py-8 rounded-2xl shadow w-full flex flex-col items-center">
          <span className="text-3xl sm:text-4xl font-bold text-[#0284c7] mb-2">
            {inView && <CountUp start={0} end={11} duration={2} />} poin IQ
          </span>
          <span className="text-gray-700 text-base">Penurunan potensi kecerdasan kognitif</span>
        </div>
        <div className="bg-gray-100 px-6 py-8 rounded-2xl shadow w-full flex flex-col items-center">
          <span className="text-3xl sm:text-4xl font-bold text-[#0284c7] mb-2">
            {inView && <CountUp start={0} end={60} duration={2} />}%
          </span>
          <span className="text-gray-700 text-base">Kasus dapat dicegah dengan deteksi dini</span>
        </div>
      </div>
    </section>
  );
};

// StuntHelpSection Responsive
const StuntHelpSection = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) setVisible(true);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cards = [
    {
      icon: <ArrowUpRight className="text-[#0284c7] w-7 h-7" />,
      title: "Asesmen Pertumbuhan",
      desc: "Isi formulir asesmen untuk mengevaluasi pola pertumbuhan anak dan mengidentifikasi risiko stunting sejak dini.",
    },
    {
      icon: <Heart className="text-[#0284c7] w-7 h-7" />,
      title: "Saran Personal",
      desc: "Dapatkan rekomendasi nutrisi dan panduan perawatan anak yang dipersonalisasi berdasarkan hasil asesmen.",
    },
    {
      icon: <Calendar className="text-[#0284c7] w-7 h-7" />,
      title: "Pemantauan Perkembangan",
      desc: "Pantau pertumbuhan anak dari waktu ke waktu dengan grafik dan visualisasi untuk melihat pola perkembangan.",
    },
    {
      icon: <Users className="text-[#0284c7] w-7 h-7" />,
      title: "Dukungan Komunitas",
      desc: "Terhubung dengan orang tua dan tenaga kesehatan lain di forum diskusi untuk saling berbagi dukungan dan saran.",
    },
    {
      icon: <Smile className="text-[#0284c7] w-7 h-7" />,
      title: "Chatbot Kesehatan",
      desc: "Dapatkan jawaban cepat atas pertanyaan kesehatan anak melalui asisten percakapan berbasis AI kami.",
    },
  ];

  return (
    <section ref={sectionRef} className="bg-neutral-50 text-[#0A192F] py-10 sm:py-12 md:py-16 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3">
          Bagaimana StuntGuard Membantu
        </h2>
        <p className="text-gray-700 text-center max-w-2xl mx-auto mb-10 text-base sm:text-lg">
          Platform kami menyediakan alat dan sumber daya untuk membantu orang tua dan tenaga kesehatan memantau serta mencegah stunting.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`
                bg-white rounded-xl shadow p-6 flex flex-col items-start
                transition-all duration-700
                ${visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"}
                `}
              style={{ transitionDelay: `${idx * 120}ms` }}
            >
              <div className="bg-blue-50 rounded-full p-3 mb-4">
                {card.icon}
              </div>
              <h3 className="font-bold text-lg mb-1">{card.title}</h3>
              <p className="text-gray-600 text-base">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Accordion Responsive
const UnderstandingStuntingAccordion = React.forwardRef((props, ref) => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const accordionData = [
    {
      id: 'what-is-stunting',
      title: 'Apa itu stunting?',
      content: `Stunting adalah bentuk malnutrisi yang terjadi ketika anak memiliki tinggi badan yang jauh lebih pendek dari rata-rata tinggi untuk kelompok usianya. Ini didefinisikan sebagai skor-z tinggi badan menurut usia di bawah -2 standar deviasi dari median Standar Pertumbuhan Anak WHO.

Stunting bukan hanya soal tubuh pendek - kondisi ini mencerminkan malnutrisi kronis selama periode paling krusial dalam pertumbuhan dan perkembangan awal kehidupan. Stunting umumnya tidak dapat diperbaiki setelah anak berusia 2 tahun dan dapat berdampak jangka panjang pada perkembangan fisik dan kognitif anak.

Ciri utama stunting meliputi:
• Tinggi badan di bawah rentang yang diharapkan untuk usianya  
• Sering disertai keterlambatan perkembangan motorik dan kognitif  
• Lebih rentan terhadap infeksi dan penyakit  
• Kapasitas belajar dan prestasi sekolah yang menurun`,
    },
    {
      id: 'common-causes',
      title: 'Penyebab umum stunting',
      content: `Stunting disebabkan oleh berbagai faktor yang saling berkaitan dan memengaruhi pertumbuhan serta perkembangan anak:

**Faktor Gizi:**
• Asupan gizi ibu yang tidak memadai selama kehamilan  
• Praktik menyusui yang buruk dan penyapihan dini  
• Pemberian makanan pendamping yang kurang setelah usia 6 bulan  
• Kekurangan mikronutrien (zat besi, seng, vitamin A)  
• Ketahanan pangan rendah dan akses terbatas terhadap makanan bergizi  

**Faktor Kesehatan:**
• Infeksi yang sering (diare, infeksi saluran pernapasan)  
• Praktik sanitasi dan kebersihan yang buruk  
• Akses dan kualitas layanan kesehatan yang tidak memadai  
• Infeksi parasit  

**Faktor Sosial Ekonomi:**
• Kemiskinan dan keterbatasan sumber daya rumah tangga  
• Tingkat pendidikan ibu yang rendah  
• Infrastruktur air dan sanitasi yang buruk  
• Akses layanan kesehatan yang terbatas  

**Faktor Lingkungan:**
• Kondisi tempat tinggal yang tidak layak  
• Paparan terhadap racun lingkungan  
• Ketahanan pangan yang dipengaruhi oleh iklim`,
    },
    {
      id: 'prevention-strategies',
      title: 'Strategi pencegahan',
      content: `Pencegahan stunting memerlukan pendekatan menyeluruh yang mencakup berbagai faktor:

**Selama Kehamilan:**
• Pastikan ibu mendapat nutrisi dan kenaikan berat badan yang cukup  
• Berikan vitamin dan suplemen prenatal (asam folat, zat besi)  
• Kunjungan rutin ke pelayanan kesehatan selama kehamilan  
• Cegah dan obati infeksi pada ibu  

**Masa Bayi Awal (0-6 bulan):**
• Promosikan ASI eksklusif selama 6 bulan pertama  
• Pastikan teknik menyusui yang benar dan dukungan menyusui  
• Berikan perawatan pasca melahirkan bagi ibu dan bayi  
• Pantau pertumbuhan bayi secara rutin  

**Setelah 6 Bulan:**
• Perkenalkan makanan pendamping ASI yang sesuai sambil tetap menyusui  
• Pastikan pola makan yang beragam dan bergizi  
• Jaga kebersihan saat menyiapkan makanan  
• Pemantauan pertumbuhan dan imunisasi secara rutin  

**Tingkat Komunitas:**
• Tingkatkan infrastruktur air, sanitasi, dan kebersihan  
• Perkuat sistem layanan kesehatan dan aksesnya  
• Laksanakan program edukasi gizi  
• Atasi masalah kemiskinan dan ketahanan pangan  
• Berdayakan perempuan dan tingkatkan status mereka  

**Tingkat Kebijakan:**
• Laksanakan program gizi nasional  
• Perkuat makanan pokok dengan nutrisi penting  
• Berikan perlindungan sosial bagi keluarga rentan  
• Integrasikan layanan gizi lintas sektor`,
    },
    {
      id: 'impact-development',
      title: 'Dampak pada perkembangan anak',
      content: `Stunting memiliki dampak jangka panjang yang melampaui masa kanak-kanak:

**Perkembangan Fisik:**
• Tinggi badan dan ukuran tubuh dewasa yang lebih kecil  
• Risiko lebih tinggi terhadap obesitas dan penyakit kronis di masa depan  
• Fungsi sistem imun yang terganggu  
• Risiko kematian lebih tinggi di masa anak-anak  
• Kapasitas kerja fisik yang berkurang saat dewasa  

**Perkembangan Kognitif:**
• Keterlambatan perkembangan motorik dan bahasa  
• Kemampuan kognitif dan skor IQ yang lebih rendah  
• Prestasi akademik dan hasil sekolah yang buruk  
• Kapasitas belajar dan fungsi memori terbatas  
• Kesulitan dalam berpikir kritis dan memecahkan masalah  

**Dampak Ekonomi:**
• Potensi pendapatan saat dewasa lebih rendah (hingga 20%)  
• Produktivitas dan kontribusi ekonomi menurun  
• Biaya kesehatan meningkat sepanjang hidup  
• Kemiskinan yang berlanjut antar generasi  
• Pertumbuhan ekonomi nasional yang terhambat  

**Dampak Sosial:**
• Kesempatan pendidikan dan karier terbatas  
• Kualitas hidup dan kesejahteraan menurun  
• Stigma sosial dan diskriminasi  
• Dampak pada kesehatan mental dan harga diri  
• Partisipasi dalam kegiatan masyarakat berkurang  

**Dampak Jangka Panjang:**
• Risiko lebih tinggi terhadap penyakit tidak menular  
• Hasil kesehatan reproduksi yang buruk  
• Risiko komplikasi kehamilan yang lebih tinggi  
• Penularan malnutrisi ke generasi berikutnya`,
    },
    {
      id: 'global-indonesia-data',
      title: 'Data stunting global dan Indonesia',
      content: `Stunting masih menjadi tantangan kesehatan global yang signifikan dengan data yang mengkhawatirkan:

**Statistik Global:**
• Sekitar 149 juta anak di bawah usia 5 tahun mengalami stunting di seluruh dunia (2020)  
• 22% anak secara global terdampak stunting  
• 75% anak stunting hidup di Sub-Sahara Afrika dan Asia Selatan  
• Kemajuan penurunan stunting berjalan lambat namun stabil dalam satu dekade terakhir  

**Data Spesifik Indonesia:**
• Indonesia memiliki salah satu tingkat stunting tertinggi di Asia Tenggara  
• Prevalensi nasional stunting: sekitar 24,4% (2021)  
• Ini berdampak pada sekitar 5,3 juta anak di bawah usia 5 tahun  
• Daerah pedesaan cenderung memiliki tingkat stunting lebih tinggi dibandingkan perkotaan  
• Provinsi di wilayah timur umumnya menunjukkan prevalensi lebih tinggi  

**Variasi Regional di Indonesia:**
• Nusa Tenggara Timur: ~35-40% tingkat stunting  
• Sulawesi Barat: ~35% tingkat stunting  
• Aceh: ~30-35% tingkat stunting  
• Jakarta dan Bali: Tingkat lebih rendah sekitar 15-20%  

**Tren dan Perkembangan:**
• Indonesia menunjukkan perbaikan bertahap dalam satu dekade terakhir  
• Target pemerintah: Menurunkan stunting menjadi 14% pada 2024  
• Berbagai program nasional telah diterapkan termasuk intervensi gizi spesifik  
• Fokus ditingkatkan pada program 1.000 hari pertama kehidupan  
• Program gizi berbasis masyarakat diperkuat  

**Faktor Penyumbang di Indonesia:**
• Kesenjangan geografis dan akses layanan  
• Ketimpangan sosial ekonomi  
• Praktik pemberian makan yang dipengaruhi budaya  
• Tantangan infrastruktur di daerah terpencil`,
    },
  ];

  return (
    <section ref={ref} className="py-16 bg-white text-[#0A192F]">
      <div className="max-w-6xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Penjelasan Stunting</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Pelajari lebih lanjut tentang stunting, penyebabnya, strategi pencegahan, dan dampaknya terhadap tumbuh kembang anak.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {accordionData.map((section) => (
            <div
              key={section.id}
              className="bg-gray-100 rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:border-gray-300"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-[#0A192F] hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              >
                <span className="font-medium text-lg">{section.title}</span>
                <div className="ml-4 flex-shrink-0">
                  {openSections[section.id] ? (
                    <ChevronUp className="h-5 w-5 text-blue-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </button>

              {/* Accordion Content */}
              {openSections[section.id] && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-200 pt-4">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

// ReadyToMonitorSection Responsive
const ReadyToMonitorSection = () => {
  const navigate = useNavigate();
  return (
    <section className="text-center py-8 sm:py-12 md:py-16 bg-gradient-to-r from-[#05956b] to-[#0284c4] text-white px-2 sm:px-4">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Siap Memantau Pertumbuhan Anak Anda?</h2>
      <p className="text-white-700 max-w-2xl mx-auto mb-6 text-sm sm:text-base">
        Mulai asesmen sekarang dan ambil langkah pertama untuk masa depan sehat anak Anda.
      </p>
      <button
        className="bg-neutral-50 hover:bg-neutral-300 text-[#0284c7] font-semibold px-6 py-2 rounded-lg shadow w-full sm:w-auto"
        onClick={() => navigate("/prediction")}
      >
        Mulai Asesmen →
      </button>
    </section>
  );
};

export default function App() {
  const accordionRef = useRef(null);

  // Scroll ke atas setiap kali halaman di-refresh/mount
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 0);
  }, []);

  // accordionData harus didefinisikan di sini dan diteruskan ke Accordion
  const accordionData = [
    // ...isi data accordion seperti sebelumnya...
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <HeroSection accordionRef={accordionRef} />
      <StatsSection />
      <StuntHelpSection />
      <UnderstandingStuntingAccordion ref={accordionRef} accordionData={accordionData} />
      <ReadyToMonitorSection />
      <Footer />

      <BottomNavbar />
    </div>
  );
}