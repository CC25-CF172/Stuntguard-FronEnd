import React from "react";
import { ChevronDown, ChevronUp, Facebook, Twitter, Instagram, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo3.png";

const Footer = () => {
  return (
    <footer className="bg-white py-12 px-8 border-t border-gray-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="md:col-span-1">
          <img
              src={logo}
              alt="Logo"
              className="h-12 w-auto inline-block mr-2"
              style={{ maxHeight: 48 }}
            />
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Membantu orang tua dan penyedia layanan kesehatan memantau dan mencegah stunting pada anak melalui pendidikan dan deteksi dini.
          </p>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 cursor-pointer transition-colors">
              <Facebook className="w-4 h-4 text-gray-600 hover:text-blue-500" />
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 cursor-pointer transition-colors">
              <Twitter className="w-4 h-4 text-gray-600 hover:text-blue-500" />
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 cursor-pointer transition-colors">
              <Instagram className="w-4 h-4 text-gray-600 hover:text-blue-500" />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">Aksi Cepat</h4>
          <ul className="space-y-3">
            <li>
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-500 text-sm transition-colors"
              >
                Beranda
              </Link>
            </li>
            <li>
              <Link
                to="/prediction"
                className="text-gray-600 hover:text-blue-500 text-sm transition-colors"
              >
                Prediksi
              </Link>
            </li>
            <li>
              <Link
                to="/education"
                className="text-gray-600 hover:text-blue-500 text-sm transition-colors"
              >
                Edukasi
              </Link>
            </li>
            <li>
              <Link
                to="/forum"
                className="text-gray-600 hover:text-blue-500 text-sm transition-colors"
              >
                Forum
              </Link>
            </li>
            <li>
              <Link
                to="/chatbot"
                className="text-gray-600 hover:text-blue-500 text-sm transition-colors"
              >
                Chatbot
              </Link>
            </li>
          </ul>
        </div>

        

        {/* Contact Us */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">CONTACT US</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600 text-sm">
                123 Health Street, Jakarta, Indonesia
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-600 text-sm">
                +62 857-0222-0093
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-600 text-sm">
                stuntguard@gmail.com
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 StuntGuard. All rights reserved.
          </p>
          
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;