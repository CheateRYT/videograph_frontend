"use client";
import React, { useState, useEffect, DragEvent } from "react";
import Cookies from "js-cookie";
interface Photo {
  id: number;
  // URL фотографии, который возвращает сервер (например, http://localhost:3000/имя_файла)
  fileName: string;
}
const PhotoManager: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  // При загрузке компонента получаем список фото
  useEffect(() => {
    fetchPhotos();
  }, []);
  // Запрос на получение всех фото с сервера (используется GET /photos)
  const fetchPhotos = async () => {
    try {
      const token = Cookies.get("admin_token");
      const response = await fetch("http://localhost:8080/api/photos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Ожидается, что каждая запись содержит хотя бы id и url
        setPhotos(data);
        console.log(data)
      } else {
        setError("Ошибка при получении списка фото");
      }
    } catch (err) {
      console.error("Ошибка запроса фотографий:", err);
      setError("Ошибка запроса фотографий");
    }
  };
  // Обработчик события drag over – предотвращает стандартное поведение
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  // Обработчик события drop – выбирает первый файл из списка
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
    e.dataTransfer.clearData();
  };
  // Функция для загрузки фото через метод POST /photos/upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError("");
    try {
      const token = Cookies.get("admin_token");
      const formData = new FormData();
      formData.append("file", selectedFile);
      // Фиксированное значение isAvatar, так как загружаем обычную фотографию
      formData.append("isAvatar", "false");
      const response = await fetch("http://localhost:8080/api/photos/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        // После успешной загрузки обновляем список фотографий
        await fetchPhotos();
        setSelectedFile(null);
      } else {
        setError("Ошибка при загрузке фото");
      }
    } catch (err) {
      console.error("Ошибка при загрузке:", err);
      setError("Ошибка при загрузке");
    } finally {
      setUploading(false);
    }
  };
  // Функция удаления фото (DELETE /photos/:id)
  const handleDelete = async (photoId: number) => {
    try {
      const token = Cookies.get("admin_token");
      const response = await fetch(
        `http://localhost:8080/api/photos/${photoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        await fetchPhotos();
      } else {
        setError("Ошибка при удалении фото");
      }
    } catch (err) {
      console.error("Ошибка удаления:", err);
      setError("Ошибка при удалении фото");
    }
  };
  return (
    <div className="container mx-auto p-4">
      {error && <div className="mb-4 text-red-600">{error}</div>}

      {/* Область drag & drop для загрузки фото */}
      <div
        className="border-4 border-dashed border-gray-400 p-8 text-center mb-4 cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <p>Выбран файл: {selectedFile.name}</p>
        ) : (
          <p>Перетащите файл сюда для загрузки</p>
        )}
      </div>
      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-blue-500 text-white px-4 py-2 mb-6 rounded hover:bg-blue-600 transition-colors"
        >
          {uploading ? "Загрузка..." : "Загрузить фото"}
        </button>
      )}
      {/* Список загруженных фото */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative border p-2 rounded shadow">
            <img
              src={`http://localhost:8080/${photo.fileName}`}
              alt={`Фото ${photo.id}`}
              className="w-full h-auto object-cover"
            />
            <button
              onClick={() => handleDelete(photo.id)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PhotoManager;
