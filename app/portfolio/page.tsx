"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTelegram } from "react-icons/fa";
import Navigation from "../Navigation";
interface Photo {
  id: number;
  fileName: string;
}
export default function Portfolio() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch("http://localhost:8080/api/photos", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch photos: ${response.status}`);
        }
        const allPhotos: Photo[] = await response.json();
        setPhotos(allPhotos);
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      }
    }
    fetchPhotos();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Левый блок */}
          <div className="md:w-1/3">
            {/* Логотип */}
            <h1 className="text-3xl md:text-2xl text-black lg:text-3xl font-bold tracking-widest mb-8">
              ALEX CHEREDNICHENKO
            </h1>
            <Navigation />
          </div>
          {/* Правый блок - фото в "masonry" расположении */}
          <div className="md:w-2/3">
            <h2 className="text-2xl font-semibold mb-6">Портфолио</h2>
            <div className="columns-2 sm:columns-3 md:columns-2 lg:columns-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="mb-4 break-inside-avoid">
                  <img
                    src={`http://localhost:8080/${photo.fileName}`}
                    alt={`Photo ${photo.id}`}
                    width={300}
                    height={200}
                    className="w-full h-auto object-cover transition-transform hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
