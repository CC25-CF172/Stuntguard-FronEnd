import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from "./api"; // Pastikan path sesuai
import { useNavigate } from "react-router-dom";

export default function StuntWatchLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const navigate = useNavigate();

  const GOOGLE_CLIENT_ID = "723159788689-tf0n4kpqjcn0k87hh29ufdbjjps79dkt.apps.googleusercontent.com";

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup script on component unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (
      googleLoaded &&
      window.google &&
      document.getElementById('google-signin-button')
    ) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            shape: 'rectangular',
            text: 'signin_with',
            logo_alignment: 'left',
            width: '100%',
            locale: 'id', // Bahasa Indonesia
          }
        );
      } catch (error) {
        console.error("Error rendering Google button:", error);
      }
    }
  }, [googleLoaded]); // Hanya depend ke googleLoaded, bukan window.google

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      console.error("Error parsing JWT:", e);
      return null;
    }
  };

  const handleCredentialResponse = async (response) => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const idToken = response.credential;
      const jwtPayload = parseJwt(idToken);
      const email = jwtPayload?.email;

      const apiResponse = await fetch(`${API_BASE_URL}/api/v1/auth/callback/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          provider: "google",
          user: { email: email },
        }),
      });

      const data = await apiResponse.json();

      if (apiResponse.ok && data.success) {
        setSuccessMsg(data.message || "Google login successful!");
        // Simpan token dan data user ke localStorage
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("isLoggedIn", "true");
        if (data.data.fullname) {
          localStorage.setItem("fullname", data.data.fullname);
        }
        if (data.data.email) {
          localStorage.setItem("email", data.data.email);
        }
        // Langsung redirect tanpa delay
        navigate("/");
      } else {
        setErrorMsg(data.message || "Google login failed.");
      }
    } catch (err) {
      setErrorMsg("Network error during Google login. Please try again.");
      console.error("Error during Google login:", err);
    }

    setLoading(false);
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          provider: "email",
          user: { email, password },
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccessMsg(data.message || "Login successful!");
        // Simpan token dan data user ke localStorage
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("fullname", data.data.fullname);
        if (data.data.email) {
          localStorage.setItem("email", data.data.email);
        }
        // Langsung redirect tanpa delay
        navigate("/");
      } else {
        setErrorMsg(data.message || "Login failed.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#0284c7] mb-2">StuntGuard</h1>
          <p className="text-gray-600 text-sm mb-8">Membantu memantau pertumbuhan anak dan mencegah stunting</p>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Selamat Datang</h2>
          <p className="text-gray-600 text-sm">Masuk Untuk Melakukan Pemeriksaan Stunting</p>
        </div>

        {/* Error and Success Messages */}
        <div>
          {errorMsg && <div className="text-red-500 text-sm mb-2">{errorMsg}</div>}
          {successMsg && <div className="text-green-600 text-sm mb-2">{successMsg}</div>}
        </div>

        {/* Login Form */}
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
                  <Link to="/forgotpwd" className="text-sm text-blue-600 hover:text-blue-500 mt-1 block">Forgot Password</Link>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Ingat Saya
            </label>
          </div>

          {/* Sign In Button */}
          <div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0284c7] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50"
            >
              <span className="mr-2">→</span>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Atau Masuk Dengan</span>
              </div>
            </div>
          </div>

          {/* Google Login Button, ONLY the rendered button */}
          <div>
            <div id="google-signin-button" className="w-full" style={{ minHeight: 50 }}></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Belum Punya Akun?{' '}
              <a href="#" className="font-medium text-[#0284c7] hover:text-blue-500"
                onClick={() => navigate("/register")}>
                Daftar
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
