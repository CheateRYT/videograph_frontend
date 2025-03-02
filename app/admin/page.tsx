// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaInstagram,
  FaTelegram,
  FaEdit,
  FaTrash,
  FaPlus,
  FaVideo,
  FaTimes,
  FaUserPlus,
  FaSignOutAlt,
  FaImage,
} from "react-icons/fa";
import Cookies from "js-cookie";

interface Video {
  id: number;
  link: string;
}

interface User {
  id: number;
  login: string;
  password: string;
  videos: Video[];
}

interface Photo {
  id: number;
  pageName: string;
  path: string;
  order?: number;
}

export default function AdminPanel() {
  // Authentication state
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Admin data state
  const [users, setUsers] = useState<User[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [videoActionLoading, setVideoActionLoading] = useState(false);
  const [photoActionLoading, setPhotoActionLoading] = useState(false);
  const [selectedPageFilter, setSelectedPageFilter] = useState<string>("all");

  // Form state for adding/editing
  const [newUserLogin, setNewUserLogin] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newVideoLink, setNewVideoLink] = useState("");
  const [editingVideoId, setEditingVideoId] = useState<number | null>(null);

  // Form state for photos
  const [newPhotoPath, setNewPhotoPath] = useState("");
  const [newPhotoPageName, setNewPhotoPageName] = useState("");
  const [newPhotoOrder, setNewPhotoOrder] = useState<number | undefined>(
    undefined
  );
  const [editingPhotoId, setEditingPhotoId] = useState<number | null>(null);

  // Check session on component mount
  useEffect(() => {
    checkSession();
  }, []);

  // Function to check existing session from cookies
  const checkSession = async () => {
    const token = Cookies.get("admin_token");

    if (token) {
      try {
        const response = await fetch("http://localhost:8080/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUsers(userData);
          setIsAuthenticated(true);

          // Also fetch photos if authenticated
          fetchPhotos();
        } else {
          // Token is invalid or expired
          Cookies.remove("admin_token");
        }
      } catch (err) {
        console.error("Error checking session:", err);
        Cookies.remove("admin_token");
      }
    }

    setLoading(false);
  };

  const fetchPhotos = async () => {
    try {
      const token = Cookies.get("admin_token");
      const response = await fetch("http://localhost:8080/api/photo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const photosData = await response.json();
        setPhotos(photosData);
      }
    } catch (err) {
      console.error("Error fetching photos:", err);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/login/admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ login, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка при входе");
      }

      // Store token in cookies
      Cookies.set("admin_token", data.accessToken, { expires: 1 }); // 1 day expiration

      // Fetch users with the new token
      const usersResponse = await fetch(
        "http://localhost:8080/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        }
      );

      if (!usersResponse.ok) {
        throw new Error("Failed to fetch users");
      }

      const usersData = await usersResponse.json();
      setUsers(usersData);
      setIsAuthenticated(true);

      // Also fetch photos
      fetchPhotos();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Произошла ошибка при входе"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("admin_token");
    setIsAuthenticated(false);
    setUsers([]);
    setPhotos([]);
  };

  // User management functions
  const addUser = async () => {
    if (!newUserLogin || !newUserPassword) {
      setError("Логин и пароль обязательны");
      return;
    }

    try {
      const token = Cookies.get("admin_token");
      const response = await fetch(
        "http://localhost:8080/api/admin/register/user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            login: newUserLogin,
            password: newUserPassword,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Ошибка при создании пользователя");
      }

      // Refresh user list
      const usersResponse = await fetch(
        "http://localhost:8080/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
      }

      // Reset form
      setNewUserLogin("");
      setNewUserPassword("");
      setIsUserModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      return;
    }

    try {
      const token = Cookies.get("admin_token");
      const response = await fetch(
        `http://localhost:8080/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при удалении пользователя");
      }

      // Update users list
      setUsers(users.filter((user) => user.id !== userId));

      // Close video modal if the deleted user was selected
      if (selectedUser && selectedUser.id === userId) {
        setIsVideoModalOpen(false);
        setSelectedUser(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    }
  };

  // Function to refresh user data with videos
  const refreshUserData = async (userId: number) => {
    try {
      const token = Cookies.get("admin_token");
      const userResponse = await fetch(
        `http://localhost:8080/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();

        // Update selected user and users array
        setSelectedUser(userData);
        setUsers(users.map((user) => (user.id === userId ? userData : user)));
        return userData;
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
    }
    return null;
  };

  // Video management functions
  const addVideo = async () => {
    if (!selectedUser || !newVideoLink) {
      setError("Выберите пользователя и введите ссылку на видео");
      return;
    }

    setVideoActionLoading(true);
    setError("");

    try {
      const token = Cookies.get("admin_token");
      const response = await fetch(
        `http://localhost:8080/api/admin/add/video/${selectedUser.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            link: newVideoLink,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при добавлении видео");
      }

      // Refresh user data to get updated videos
      const updatedUser = await refreshUserData(selectedUser.id);

      if (updatedUser) {
        // Success message could be added here
        setNewVideoLink("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setVideoActionLoading(false);
    }
  };

  const updateVideo = async () => {
    if (!selectedUser || !editingVideoId || !newVideoLink) {
      setError("Необходимо выбрать видео и ввести новую ссылку");
      return;
    }

    setVideoActionLoading(true);
    setError("");

    try {
      // First delete the old video
      const token = Cookies.get("admin_token");
      const deleteResponse = await fetch(
        `http://localhost:8080/api/admin/users/${selectedUser.id}/videos/${editingVideoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!deleteResponse.ok) {
        throw new Error("Ошибка при удалении старого видео");
      }

      // Then add a new one
      const addResponse = await fetch(
        `http://localhost:8080/api/admin/add/video/${selectedUser.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            link: newVideoLink,
          }),
        }
      );

      if (!addResponse.ok) {
        throw new Error("Ошибка при обновлении видео");
      }

      // Refresh user data to get updated videos
      const updatedUser = await refreshUserData(selectedUser.id);

      if (updatedUser) {
        // Reset form
        setNewVideoLink("");
        setEditingVideoId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setVideoActionLoading(false);
    }
  };

  const deleteVideo = async (userId: number, videoId: number) => {
    setVideoActionLoading(true);
    setError("");

    try {
      const token = Cookies.get("admin_token");
      const response = await fetch(
        `http://localhost:8080/api/admin/users/${userId}/videos/${videoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при удалении видео");
      }

      // Refresh user data instead of manually updating state
      await refreshUserData(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setVideoActionLoading(false);
    }
  };

  const openVideoModal = async (user: User) => {
    setSelectedUser(user);
    setIsVideoModalOpen(true);
    setEditingVideoId(null);
    setNewVideoLink("");

    // Refresh user data to ensure we have the latest videos
    await refreshUserData(user.id);
  };

  const startEditingVideo = (video: Video) => {
    setEditingVideoId(video.id);
    setNewVideoLink(video.link);
  };

  // Photo management functions
  const openPhotoModal = async () => {
    setIsPhotoModalOpen(true);
    setEditingPhotoId(null);
    setNewPhotoPath("");
    setNewPhotoPageName("");
    setNewPhotoOrder(undefined);
    setSelectedPageFilter("all");

    // Refresh photos
    await fetchPhotos();
  };

  const addPhoto = async () => {
    if (!newPhotoPath || !newPhotoPageName) {
      setError("Путь к фото и название страницы обязательны");
      return;
    }

    setPhotoActionLoading(true);
    setError("");

    try {
      const token = Cookies.get("admin_token");
      const response = await fetch("http://localhost:8080/api/photo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          path: newPhotoPath,
          pageName: newPhotoPageName,
          order: newPhotoOrder || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при добавлении фото");
      }

      // Refresh photos
      await fetchPhotos();

      // Reset form
      setNewPhotoPath("");
      setNewPhotoPageName("");
      setNewPhotoOrder(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setPhotoActionLoading(false);
    }
  };

  const updatePhoto = async () => {
    if (!editingPhotoId || !newPhotoPath || !newPhotoPageName) {
      setError("Необходимо выбрать фото и заполнить все поля");
      return;
    }

    setPhotoActionLoading(true);
    setError("");

    try {
      const token = Cookies.get("admin_token");
      const response = await fetch(
        `http://localhost:8080/api/photo/${editingPhotoId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            path: newPhotoPath,
            pageName: newPhotoPageName,
            order: newPhotoOrder || undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при обновлении фото");
      }

      // Refresh photos
      await fetchPhotos();

      // Reset form
      setNewPhotoPath("");
      setNewPhotoPageName("");
      setNewPhotoOrder(undefined);
      setEditingPhotoId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setPhotoActionLoading(false);
    }
  };

  const deletePhoto = async (photoId: number) => {
    if (!confirm("Вы уверены, что хотите удалить это фото?")) {
      return;
    }

    setPhotoActionLoading(true);
    setError("");

    try {
      const token = Cookies.get("admin_token");
      const response = await fetch(
        `http://localhost:8080/api/photo/${photoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при удалении фото");
      }

      // Refresh photos
      await fetchPhotos();

      // If we were editing this photo, reset the form
      if (editingPhotoId === photoId) {
        setNewPhotoPath("");
        setNewPhotoPageName("");
        setNewPhotoOrder(undefined);
        setEditingPhotoId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setPhotoActionLoading(false);
    }
  };

  const startEditingPhoto = (photo: Photo) => {
    setEditingPhotoId(photo.id);
    setNewPhotoPath(photo.path);
    setNewPhotoPageName(photo.pageName);
    setNewPhotoOrder(photo.order);
  };

  // Get unique page names for filter
  const pageNames = Array.from(new Set(photos.map((photo) => photo.pageName)));

  // Filter photos based on selected page
  const filteredPhotos =
    selectedPageFilter === "all"
      ? photos
      : photos.filter((photo) => photo.pageName === selectedPageFilter);

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
                    className="text-black text-xl hover:border-b-2 border-black pb-1 inline-block"
                  >
                    Личный кабинет
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin"
                    className="text-black text-xl border-b-2 border-black pb-1 inline-block"
                  >
                    Админ-панель
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
                className="text-black hover:text-black"
              >
                <FaInstagram size={28} />
              </a>
              <a
                href="https://t.me/alexandr_ch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-black"
              >
                <FaTelegram size={28} />
              </a>
            </div>
          </div>

          {/* Right Section - Admin Panel */}
          <div className="md:w-2/3">
            {loading ? (
              // Loading state
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : isAuthenticated ? (
              // Admin Panel
              <div>
                <div className="flex justify-between text-black items-center mb-6">
                  <h2 className="text-2xl font-bold">Панель администратора</h2>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    <FaSignOutAlt className="mr-2" /> Выйти
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                {/* Admin Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setIsUserModalOpen(true)}
                    className="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    <FaUserPlus className="mr-2" /> Добавить пользователя
                  </button>
                  <button
                    onClick={openPhotoModal}
                    className="flex items-center justify-center px-4 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                  >
                    <FaImage className="mr-2" /> Управление фотографиями
                  </button>
                </div>

                <div className="mb-4 text-black">
                  <h3 className="text-xl font-semibold mb-4">Пользователи</h3>

                  {/* Users Grid */}
                  <div className="grid text-black grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="bg-white text-black rounded-lg shadow-md p-4 border-l-4 border-blue-500"
                      >
                        <div className="flex text-black justify-between items-start mb-2">
                          <h4 className="font-semibold">ID: {user.id}</h4>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Удалить пользователя"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <div className="mb-2">
                          <p>
                            <strong>Логин:</strong> {user.login}
                          </p>
                          <p>
                            <strong>Пароль:</strong> {user.password}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm text-black">
                            {user.videos?.length || 0} видео
                          </span>
                          <button
                            onClick={() => openVideoModal(user)}
                            className="flex items-center hover px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                          >
                            <FaVideo className="mr-2" /> Видеоролики
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Admin Login Form
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                <h2 className="text-2xl text-black font-bold mb-6 text-center">
                  Вход в панель администратора
                </h2>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <form onSubmit={handleAdminLogin}>
                  <div className="mb-4">
                    <label htmlFor="login" className="block text-black mb-2">
                      Логин
                    </label>
                    <input
                      type="text"
                      id="login"
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
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
                      className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Management Modal */}
      {isVideoModalOpen && selectedUser && (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">
                Видеоролики пользователя {selectedUser.login} (ID:{" "}
                {selectedUser.id})
              </h3>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-black hover:text-black"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-4">
              {/* Add/Edit Video Form */}
              <div className="mb-6 p-4 text-black bg-gray-50 rounded-md">
                <h4 className="font-semibold mb-3">
                  {editingVideoId ? "Редактировать видео" : "Добавить видео"}
                </h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={newVideoLink}
                    onChange={(e) => setNewVideoLink(e.target.value)}
                    placeholder="Ссылка на видео (ID для Google Drive)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                    disabled={videoActionLoading}
                  />
                  <button
                    onClick={editingVideoId ? updateVideo : addVideo}
                    className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap ${
                      videoActionLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={videoActionLoading}
                  >
                    {videoActionLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                        {editingVideoId ? "Обновление..." : "Добавление..."}
                      </span>
                    ) : editingVideoId ? (
                      "Обновить"
                    ) : (
                      "Добавить"
                    )}
                  </button>
                  {editingVideoId && !videoActionLoading && (
                    <button
                      onClick={() => {
                        setEditingVideoId(null);
                        setNewVideoLink("");
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Отмена
                    </button>
                  )}
                </div>
              </div>
              {/* Video List */}
              {selectedUser.videos && selectedUser.videos.length > 0 ? (
                <div className="grid text-black grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedUser.videos.map((video) => (
                    <div
                      key={video.id}
                      className="bg-gray-50 rounded-md p-3 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold">ID: {video.id}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditingVideo(video)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Редактировать"
                            disabled={videoActionLoading}
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() =>
                              deleteVideo(selectedUser.id, video.id)
                            }
                            className="text-red-500 hover:text-red-700"
                            title="Удалить"
                            disabled={videoActionLoading}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-black break-all">
                        {video.link}
                      </p>

                      {/* Preview (for Google Drive) */}
                      <div className="mt-2 relative pt-[56.25%]">
                        <iframe
                          src={`https://drive.google.com/file/d/${video.link}/preview`}
                          allow="autoplay"
                          className="absolute top-0 left-0 w-full h-full rounded"
                          frameBorder="0"
                        ></iframe>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-black my-4">
                  {videoActionLoading
                    ? "Загрузка..."
                    : "У пользователя нет видеороликов"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">Добавить пользователя</h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="text-black hover:text-black"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <label htmlFor="newUserLogin" className="block text-black mb-2">
                  Логин
                </label>
                <input
                  type="text"
                  id="newUserLogin"
                  value={newUserLogin}
                  onChange={(e) => setNewUserLogin(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="newUserPassword"
                  className="block text-black mb-2"
                >
                  Пароль
                </label>
                <input
                  type="text"
                  id="newUserPassword"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={addUser}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Management Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">Управление фотографиями</h3>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="text-black hover:text-black"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-4">
              {/* Add/Edit Photo Form */}
              <div className="mb-6 p-4 text-black bg-gray-50 rounded-md">
                <h4 className="font-semibold mb-3">
                  {editingPhotoId ? "Редактировать фото" : "Добавить фото"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="photoPath"
                      className="block text-black mb-2"
                    >
                      Путь к фото
                    </label>
                    <input
                      type="text"
                      id="photoPath"
                      value={newPhotoPath}
                      onChange={(e) => setNewPhotoPath(e.target.value)}
                      placeholder="/images/example.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      disabled={photoActionLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="photoPage"
                      className="block text-black mb-2"
                    >
                      Название страницы
                    </label>
                    <input
                      type="text"
                      id="photoPage"
                      value={newPhotoPageName}
                      onChange={(e) => setNewPhotoPageName(e.target.value)}
                      placeholder="gallery, about, home"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      disabled={photoActionLoading}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="photoOrder" className="block text-black mb-2">
                    Порядок (необязательно)
                  </label>
                  <input
                    type="number"
                    id="photoOrder"
                    value={newPhotoOrder || ""}
                    onChange={(e) =>
                      setNewPhotoOrder(
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    placeholder="1, 2, 3..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    disabled={photoActionLoading}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    onClick={editingPhotoId ? updatePhoto : addPhoto}
                    className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap ${
                      photoActionLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={photoActionLoading}
                  >
                    {photoActionLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                        {editingPhotoId ? "Обновление..." : "Добавление..."}
                      </span>
                    ) : editingPhotoId ? (
                      "Обновить фото"
                    ) : (
                      "Добавить фото"
                    )}
                  </button>
                  {editingPhotoId && !photoActionLoading && (
                    <button
                      onClick={() => {
                        setEditingPhotoId(null);
                        setNewPhotoPath("");
                        setNewPhotoPageName("");
                        setNewPhotoOrder(undefined);
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Отмена
                    </button>
                  )}
                </div>
              </div>

              {/* Photo filters */}
              <div className="mb-4">
                <label
                  htmlFor="pageFilter"
                  className="block text-black mb-2 font-medium"
                >
                  Фильтр по странице:
                </label>
                <select
                  id="pageFilter"
                  value={selectedPageFilter}
                  onChange={(e) => setSelectedPageFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="all">Все страницы</option>
                  {pageNames.map((page) => (
                    <option key={page} value={page}>
                      {page}
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo List */}
              {filteredPhotos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-gray-50 rounded-md p-3 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold">ID: {photo.id}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditingPhoto(photo)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Редактировать"
                            disabled={photoActionLoading}
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deletePhoto(photo.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Удалить"
                            disabled={photoActionLoading}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      {/* Photo preview */}
                      <div className="aspect-square relative mb-2 overflow-hidden bg-gray-100 rounded">
                        <img
                          src={photo.path}
                          alt={`Photo ${photo.id}`}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            // Show placeholder on error
                            e.currentTarget.src = "/placeholder-image.jpg";
                          }}
                        />
                      </div>

                      <div className="text-sm text-black">
                        <p>
                          <strong>Страница:</strong> {photo.pageName}
                        </p>
                        {photo.order !== undefined && (
                          <p>
                            <strong>Порядок:</strong> {photo.order}
                          </p>
                        )}
                        <p className="truncate mt-1" title={photo.path}>
                          <strong>Путь:</strong> {photo.path}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-black my-4">
                  {photoActionLoading
                    ? "Загрузка..."
                    : selectedPageFilter === "all"
                    ? "Нет фотографий"
                    : `Нет фотографий для страницы "${selectedPageFilter}"`}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
