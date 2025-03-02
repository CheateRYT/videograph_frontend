// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaInstagram, FaTelegram, FaDownload } from "react-icons/fa";
import Cookies from "js-cookie";

interface Video {
  id: number;
  link: string;
}

interface User {
  id: number;
  login: string;
  videos: Video[];
}

export default function Profile() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Start with loading true
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check session on component mount
  useEffect(() => {
    checkSession();
  }, []);

  // Function to check existing session from cookies
  const checkSession = async () => {
    const token = Cookies.get("accessToken");

    if (token) {
      try {
        const response = await fetch(
          "http://localhost:8080/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token is invalid or expired
          Cookies.remove("accessToken");
        }
      } catch (err) {
        console.error("Error checking session:", err);
        Cookies.remove("accessToken");
      }
    }

    // Set loading to false after checking session
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка при входе");
      }

      // Store token in cookies
      Cookies.set("accessToken", data.accessToken, { expires: 1 }); // 1 day expiration

      // Fetch user profile with the new token
      const profileResponse = await fetch(
        "http://localhost:8080/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        }
      );

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const userData = await profileResponse.json();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Произошла ошибка при входе"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("accessToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Section */}
          <div className="md:w-1/3">
            {/* Logo */}
            <h1 className="text-3xl md:text-2xl lg:text-3xl text-black font-bold tracking-widest mb-8">
              ALEX CHEREDNICHENKO
            </h1>

            {/* Navigation */}
            <nav className="mb-12">
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/"
                    className="text-black text-xl hover:border-b-2 border-black pb-1 inline-block"
                  >
                    Главная
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="text-black text-xl hover:border-b-2 border-black pb-1 inline-block"
                  >
                    Галерея
                  </Link>
                </li>
                <li>
                  <Link
                    href="/price-list"
                    className="text-black text-xl hover:border-b-2 border-black pb-1 inline-block"
                  >
                    Прайс-лист
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-black text-xl hover:border-b-2 border-black pb-1 inline-block"
                  >
                    Обо мне
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="text-black text-xl border-b-2 border-black pb-1 inline-block"
                  >
                    Личный кабинет
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/alexandr.cherednichenko?igsh=eXlvMTR5Nm96Ympj&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-700"
              >
                <FaInstagram size={28} />
              </a>
              <a
                href="https://t.me/alexandr_ch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-700"
              >
                <FaTelegram size={28} />
              </a>
            </div>
          </div>

          {/* Right Section - Login Form or User Videos */}
          <div className="md:w-2/3">
            {loading ? (
              // Loading state
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : isAuthenticated && user ? (
              // User is authenticated - show videos
              <UserVideos user={user} onLogout={handleLogout} />
            ) : (
              // User is not authenticated - show login form
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Вход в личный кабинет
                </h2>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="login" className="block text-gray-700 mb-2">
                      Логин
                    </label>
                    <input
                      type="text"
                      id="login"
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="password"
                      className="block text-gray-700 mb-2"
                    >
                      Пароль
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Вход..." : "Войти"}
                  </button>
                </form>

                <div className="mt-4 text-center text-gray-600">
                  <p>
                    Доступ предоставляется только зарегистрированным
                    пользователям
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserVideos({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Личный кабинет: {user.login}</h2>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
        >
          Выйти
        </button>
      </div>

      {user.videos && user.videos.length > 0 ? (
        <div>
          <h3 className="text-xl mb-4">Ваши видео</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-lg mb-4">У вас пока нет видео.</p>
          <p>Свяжитесь с администратором для добавления видео в ваш аккаунт.</p>
        </div>
      )}
    </div>
  );
}

// Video Card Component with Google Drive Video Player
function VideoCard({ video }: { video: Video }) {
  // Extract file ID from the link if it's a full Google Drive URL
  const getFileId = (link: string) => {
    // If it's already just a file ID, return it as is
    if (!link.includes("/")) {
      return link;
    }

    // Try to extract file ID from Google Drive URL
    const fileIdMatch = link.match(/\/file\/d\/([^/]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return fileIdMatch[1];
    }

    // Fallback to the original link
    return link;
  };

  const fileId = getFileId(video.link);
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative pt-[75%]">
        {" "}
        {/* 4:3 Aspect Ratio for Google Drive player */}
        <iframe
          src={embedUrl}
          allow="autoplay"
          frameBorder="0"
          className="absolute top-0 left-0 w-full h-full"
          loading="lazy"
        ></iframe>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Видео #{video.id}</span>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-800 hover:text-gray-600 transition-colors"
          >
            <FaDownload className="mr-1" /> Скачать
          </a>
        </div>
      </div>
    </div>
  );
}
