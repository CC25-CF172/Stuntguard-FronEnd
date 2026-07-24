import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './pages/components/Navbar';
import Footer from './pages/components/Footer';
import { Calendar, Clock, Search } from 'lucide-react';
import carosel1 from "./assets/carosel1.jpeg";
import carosel2 from "./assets/stunting2.png";
import carosel3 from "./assets/stunting3.jpeg";
import BottomNavbar from "./pages/components/BottomNavbar";

const EducationalResources = () => {
  // Scroll ke atas saat halaman di-refresh/mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  
  const tabs = ['All','Riset', 'Nutrisi', 'Komunitas'];

  
  const articles = [
    {
      id: 1,
      category: 'Riset',
      image: carosel1,
      date: '10 Mei 2025',
      readTime: '5 menit baca',
      title: 'Pencegahan dan Penanganan Stunting pada Anak di Indonesia',
      description: 'Peneliti menemukan hubungan penting antara kesehatan mikrobioma usus dan pertumbuhan anak yang dapat membuka strategi pencegahan baru.',
      categoryColor: 'bg-blue-500',
      link: '/educationriset'
    },
    {
      id: 2,
      category: 'Komunitas',
      image: carosel2,
      date: '7 Mei 2025',
      readTime: '4 menit baca',
      title: 'Peran Komunitas dalam Mencegah Stunting: Kunci Masa Depan Anak yang Lebih Sehat',
      description: 'Program edukasi nutrisi berbasis komunitas memberikan dampak signifikan dalam menurunkan angka stunting di desa-desa Indonesia.',
      categoryColor: 'bg-teal-500',
      link: '/educationcommunity'
    },
    {
      id: 3,
      category: 'Nutrisi',
      image: carosel3,
      date: '5 Mei 2025',
      readTime: '6 menit baca',
      title: 'Peran Ibu dalam Mencegah Stunting Sejak Masa Sekarang',
      description: 'Mengapa periode dari kehamilan hingga anak berusia dua tahun sangat penting untuk mencegah stunting dan memastikan tumbuh kembang optimal.',
      categoryColor: 'bg-green-500',
      link: '/educationnutrition'
    }
  ];

  const filteredArticles = articles.filter(article =>
    (activeTab === 'All' || article.category === activeTab) &&
    (article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-br from-blue-500 via-teal-500 to-green-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Sumber Edukasi
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-50 max-w-3xl mx-auto">
            Jelajahi kumpulan artikel, video, dan sumber belajar untuk memahami lebih dalam tentang pertumbuhan anak, nutrisi, dan pencegahan stunting.
          </p>
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-[#0284c7] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(article.link)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') navigate(article.link); }}
            >
              {/* Article Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`${article.categoryColor} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6">
                {/* Date and Read Time */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {article.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {article.readTime}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.description}
                </p>

                {/* Read More Link */}
                <span className="text-blue-500 hover:text-blue-600 font-medium text-sm transition-colors">
                  Baca selengkapnya
                </span>
              </div>
            </div>
          ))}
        </div>

        
      </div>
      <Footer />

      <BottomNavbar />
    </div>
  );
};

export default EducationalResources;