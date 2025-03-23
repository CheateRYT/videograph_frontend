'use client'
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { FaEdit, FaTrash, FaSave } from "react-icons/fa";
import Navigation from "../Navigation";
interface Review {
  id: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    login: string;
    personalData: string;
    avatar: string | null;
  };
}
interface User {
  id: number;
  login: string;
  personalData: string;
  avatar: string | null;
  review?: Review | null;
}
export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reviewText, setReviewText] = useState("");
  // Если пользователь уже оставил отзыв – включаем режим редактирования
  const [editMode, setEditMode] = useState(false);
  // Получаем все отзывы от клиентов
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/review");
      if (!response.ok) {
        throw new Error("Ошибка при получении отзывов");
      }
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка при получении отзывов"
      );
    } finally {
      setLoading(false);
    }
  };
  // Проверяем сессию, если токен доступен – получаем профиль пользователя
  const fetchCurrentUser = async () => {
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
          setCurrentUser(userData);
          if (userData.review) {
            setReviewText(userData.review.text);
            setEditMode(true);
          }
        } else {
          Cookies.remove("accessToken");
        }
      } catch (err) {
        console.error("Ошибка при получении профиля:", err);
        Cookies.remove("accessToken");
      }
    }
  };
  useEffect(() => {
    fetchReviews();
    fetchCurrentUser();
  }, []);
  // Отправка формы для создания или обновления отзыва
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const token = Cookies.get("accessToken");
    if (!token) {
      setError("Необходимо авторизоваться для отправки отзыва");
      return;
    }
    try {
      // Если режим редактирования включён, используем метод PUT для обновления, иначе POST для создания
      const method = editMode ? "PUT" : "POST";
      const response = await fetch("http://localhost:8080/api/review", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: reviewText }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Ошибка при отправке отзыва");
      }
      const data = await response.json();
      // Обновляем список отзывов и информацию о текущем пользователе
      await fetchReviews();
      setCurrentUser((prev) => (prev ? { ...prev, review: data } : prev));
      setEditMode(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка при отправке отзыва"
      );
    }
  };
  // Удаление отзыва пользователя (если он сам оставил отзыв)
  const handleDeleteReview = async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      setError("Необходимо авторизоваться");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/api/review", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Ошибка при удалении отзыва");
      }
      // Обновляем данные текущего пользователя и список отзывов
      setCurrentUser((prev) => (prev ? { ...prev, review: null } : prev));
      setReviewText("");
      setEditMode(false);
      await fetchReviews();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка при удалении отзыва"
      );
    }
  };
  // Удаление отзыва администратором (для всех отзывов)
  const handleAdminDeleteReview = async (reviewId: number) => {
    const adminToken = Cookies.get("admin_token");
    if (!adminToken) {
      setError("Административная авторизация не обнаружена");
      return;
    }
    if (!confirm("Вы уверены, что хотите удалить этот отзыв?")) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/review/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Ошибка при удалении отзыва администратором"
        );
      }
      await fetchReviews();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ошибка при удалении отзыва администратором"
      );
    }
  };
  // Проверка наличия admin_token в куках
  const isAdmin = Boolean(Cookies.get("admin_token"));
  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-gray-200">
      <div className="container mx-auto px-4 py-8">
        {/* Основной контейнер с двумя колонками */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Левая колонка: Логотип и навигация */}
          <div className="md:w-1/3">
            <h1 className="text-3xl md:text-2xl lg:text-3xl text-black font-bold tracking-widest mb-8">
              ALEX CHEREDNICHENKO
            </h1>
            <Navigation />
          </div>
          {/* Правая колонка: Основной контент (отзывы и форма) */}
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-6 text-center">
              Отзывы клиентов
            </h1>
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-6">
                {error}
              </div>
            )}
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="grid gap-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row items-center"
                    >
                      <img
                        src={
                          review.user.avatar
                            ? review.user.avatar
                            : "/default-avatar.jpg"
                        }
                        alt="Avatar"
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          От: {review.user.personalData || review.user.login}
                        </p>
                        <p className="mt-2 text-gray-800">{review.text}</p>
                        <p className="mt-2 text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {/* Контейнер для кнопок с адаптивным расположением */}
                      <div className="mt-4 md:mt-0 md:ml-auto flex flex-wrap gap-2 justify-center">
                        {/* Кнопки для владельца отзыва */}
                        {currentUser && review.user.id === currentUser.id && (
                          <>
                            <button
                              onClick={() => setReviewText(review.text)}
                              className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center text-xs sm:text-sm"
                              title="Редактировать"
                            >
                              <FaEdit className="mr-1" /> Редактировать
                            </button>
                            <button
                              onClick={handleDeleteReview}
                              className="px-2 py-1 sm:px-3 sm:py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center text-xs sm:text-sm"
                              title="Удалить отзыв"
                            >
                              <FaTrash className="mr-1" /> Удалить
                            </button>
                          </>
                        )}
                        {/* Кнопка для администратора */}
                        {isAdmin && (
                          <button
                            onClick={() => handleAdminDeleteReview(review.id)}
                            className="px-2 py-1 sm:px-3 sm:py-1 bg-red-700 text-white rounded hover:bg-red-800 flex items-center text-xs sm:text-sm"
                            title="Удалить отзыв (админ)"
                          >
                            <FaTrash className="mr-1" /> Удалить (Админ)
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600">Отзывов пока нет</p>
                )}
              </div>
            )}
            {/* Форма для оставления/обновления отзыва (доступна только авторизованным пользователям) */}
            {currentUser ? (
              <div className="mt-8 bg-white shadow rounded-lg p-6 max-w-xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  {editMode ? "Обновить отзыв" : "Оставить отзыв"}
                </h2>
                <form onSubmit={handleReviewSubmit}>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Ваш отзыв..."
                    required
                  />
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    <FaSave className="mr-2" />
                    {editMode ? "Обновить отзыв" : "Оставить отзыв"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="mt-8 text-center">
                <p className="text-gray-700">
                  Чтобы оставить отзыв, пожалуйста,{" "}
                  <Link
                    href="/profile"
                    className="text-blue-600 hover:underline"
                  >
                    войдите в систему
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
