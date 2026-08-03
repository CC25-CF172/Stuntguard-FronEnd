import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import logo from "../../assets/logo3.png";
import { API_BASE_URL } from "../../api";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullname, setFullname] = useState(null);
  const [email, setEmail] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProfile = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.success) {
        const { name, email } = result.data;
        setFullname(name);
        setEmail(email);
        localStorage.setItem("fullname", name);
        localStorage.setItem("email", email);
      } else {
        console.error("Failed to fetch profile:", result.message);
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      handleLogout();
    }
  };

  // Check login status
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";

      if (token && loggedIn) {
        setIsLoggedIn(true);
        const storedFullname = localStorage.getItem("fullname");
        const storedEmail = localStorage.getItem("email");
        if (storedFullname && storedEmail) {
          setFullname(storedFullname);
          setEmail(storedEmail);
        } else {
          await fetchProfile(token);
        }
      } else {
        setIsLoggedIn(false);
        setFullname(null);
        setEmail(null);
      }
    };

    checkLoginStatus();

    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "isLoggedIn" || e.key === "fullname") {
        checkLoginStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Menutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { to: "/", label: "Beranda" },
    { to: "/prediction", label: "Prediksi" },
    { to: "/education", label: "Edukasi" },
    { to: "/forum", label: "Forum" },
    { to: "/chatbot", label: "Chatbot" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullname");
    localStorage.removeItem("email");
    localStorage.removeItem("isLoggedIn");

    setIsLoggedIn(false);
    setFullname(null);
    setEmail(null);
    setIsDropdownOpen(false);

    navigate("/login");
  };

  const getDisplayName = () => {
    if (fullname) return fullname;
    if (email) return email.split("@")[0];
    return "Profile";
  };

  return (
    /* `hidden md:block` ditambahkan di sini: Sembunyi total di HP, hanya muncul di Desktop (≥768px) */
    <nav className="hidden md:block bg-[#FAFCFE] text-[#222F3E] shadow sticky top-0 z-50 border-t-4 border-[#222F3E]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 py-0 min-h-[56px]">
        {/* Logo */}
        <div className="text-xl font-bold text-blue-600">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-auto inline-block mr-2"
              style={{ maxHeight: 48 }}
            />
          </Link>
        </div>

        {/* Navigation Menu Desktop */}
        <ul className="flex gap-6 text-sm">
          {navLinks.map((nav) => {
            const isActive = location.pathname === nav.to;
            return (
              <li key={nav.to} className="relative">
                <Link
                  to={nav.to}
                  className={`hover:text-blue-500 transition-colors duration-300 ${
                    isActive ? "text-blue-600 font-bold" : ""
                  }`}
                >
                  {nav.label}
                  <span
                    className={`absolute left-0 -bottom-1 h-[3px] rounded transition-all duration-300 ${
                      isActive ? "w-full bg-blue-500" : "w-0 bg-blue-500"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop Auth/Profile */}
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-full text-sm hover:bg-blue-50 transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors"
              >
                Daftar
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-[#0284c7] text-white px-3 py-2 rounded-full text-sm hover:bg-[#0369a1] transition-colors"
              >
                <FaUserCircle
                  className="text-lg text-[#0284c7] bg-white rounded-full"
                  style={{ background: "#fff" }}
                />
                <span className="max-w-32 truncate">{getDisplayName()}</span>
                <IoIosArrowDown
                  className={`text-base transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 text-sm z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-900 truncate">
                      {getDisplayName()}
                    </p>
                    {email && (
                      <p className="text-xs text-gray-500 truncate">{email}</p>
                    )}
                  </div>

                  <Link
                    to="/user"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaUserCircle className="text-[#0284c7]" />
                    Profil Kamu
                  </Link>

                  <Link
                    to="/editprofile"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="2"
                      className="text-[#0284c7]"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    Pengaturan
                  </Link>

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition-colors"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16,17 21,12 16,7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;