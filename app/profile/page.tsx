"use client"
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FaInstagram,
  FaTelegram,
  FaDownload,
  FaUpload,
  FaTrashAlt,
} from "react-icons/fa";
import Cookies from "js-cookie";
import Navigation from "../Navigation";
interface Video {
  id: number;
  link: string;
}
interface User {
  id: number;
  personalData: string;
  login: string;
  videos: Video[];
  avatar: string;
}
export default function Profile() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Проверка сессии при монтировании компонента
  useEffect(() => {
    checkSession();
  }, []);
  // Функция проверки сессии по токену
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
          // Токен недействителен или просрочен
          Cookies.remove("accessToken");
        }
      } catch (err) {
        console.error("Error checking session:", err);
        Cookies.remove("accessToken");
      }
    }
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
      // Сохраняем токен в cookies
      Cookies.set("accessToken", data.accessToken, { expires: 1 });
      // Получаем профиль пользователя
      const profileResponse = await fetch(
        "http://localhost:8080/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        }
      );
      if (!profileResponse.ok) {
        throw new Error("Ошибка получения профиля");
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
  // Функция обновления данных пользователя, например после изменения аватарки
  const updateUserAvatar = (avatarUrl: string | null) => {
    if (user) {
      setUser({ ...user, avatar: avatarUrl ? avatarUrl : "" });
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Левая колонка */}
          <div className="md:w-1/3">
            <h1 className="text-3xl md:text-2xl lg:text-3xl text-black font-bold tracking-widest mb-8">
              ALEX CHEREDNICHENKO
            </h1>
            <Navigation />
          </div>
          {/* Правая колонка - авторизация или данные профиля */}
          <div className="md:w-2/3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : isAuthenticated && user ? (
              <UserVideos
                user={user}
                onLogout={handleLogout}
                updateUserAvatar={updateUserAvatar}
              />
            ) : (
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
                    <label htmlFor="login" className="block text-black mb-2">
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
                    <label htmlFor="password" className="block text-black mb-2">
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
                <div className="mt-4 text-center text-black">
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
interface UserVideosProps {
  user: User;
  onLogout: () => void;
  updateUserAvatar: (avatarUrl: string | null) => void;
}
function UserVideos({ user, onLogout, updateUserAvatar }: UserVideosProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <AvatarUploader user={user} updateUserAvatar={updateUserAvatar} />
        <div className="flex-1">
        
          {user.personalData ? (
            <h2 className="text-2xl font-bold">
              Ваш логин: {user.login}
              <br />
              Личная информация: {user.personalData}
            </h2>
          ) : (
            <h2 className="text-2xl font-bold">
              Ваш логин: {user.login}
            </h2>
          )}
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-md transition-colors"
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
interface VideoCardProps {
  video: Video;
}
function VideoCard({ video }: VideoCardProps) {
  // Функция для извлечения ID файла из ссылки Google Drive
  const getFileId = (link: string) => {
    if (!link.includes("/")) {
      return link;
    }
    const fileIdMatch = link.match(/\/file\/d\/([^/]+)/);
    return fileIdMatch && fileIdMatch[1] ? fileIdMatch[1] : link;
  };
  const fileId = getFileId(video.link);
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative pt-[75%]">
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
          <span className="text-black">Видео #{video.id}</span>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-black hover:text-black transition-colors"
          >
            <FaDownload className="mr-1" /> Скачать
          </a>
        </div>
      </div>
    </div>
  );
}
interface AvatarUploaderProps {
  user: User;
  updateUserAvatar: (avatarUrl: string | null) => void;
}
function AvatarUploader({ user, updateUserAvatar }: AvatarUploaderProps) {
  const [isHover, setIsHover] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const token = Cookies.get("accessToken");
  // Функция загрузки файла аватарки на сервер
  const uploadAvatar = async (file: File) => {
    if (!token) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(
        "http://localhost:8080/api/users/avatar/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Ошибка загрузки аватарки");
      }
      const data = await response.json();
      // data.avatarUrl должен прийти от сервера
      updateUserAvatar(data.avatarUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };
  // Функция удаления аватарки
  const deleteAvatar = async () => {
    if (!token) return;
    setUploading(true);
    try {
      const response = await fetch("http://localhost:8080/api/users/avatar", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Ошибка удаления аватарки");
      }
      updateUserAvatar(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };
  // Обработчик выбора файла через input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadAvatar(e.target.files[0]);
    }
  };
  // Обработчики drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadAvatar(e.dataTransfer.files[0]);
    }
  };
  return (
    <div
      className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-300"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ cursor: "pointer" }}
    >
      <img
        src={
          user.avatar
            ? user.avatar
            : "/default-avatar.jpg"
        }
        alt="Avatar"
        className="w-full h-full object-cover"
      />
      {/* Оверлей с иконками при наведении */}
      {isHover && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-2">
          {/* Иконка загрузки. При клике открывается скрытый file input */}
          <label className="cursor-pointer">
            <FaUpload className="text-white" size={20} />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {/* Иконка удаления */}
          <button
            onClick={deleteAvatar}
            disabled={uploading}
            className="cursor-pointer"
          >
            <FaTrashAlt className="text-white" size={20} />
          </button>
        </div>
      )}
      {/* Если происходит drag & drop, можно отобразить индикацию */}
      {dragActive && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <span className="text-white">Отпустите для загрузки</span>
        </div>
      )}
      {/* При загрузке можно показать спиннер */}
      {uploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
}
