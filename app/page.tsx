// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTelegram } from "react-icons/fa";
import Navigation from "./Navigation";

// interface Photo {
//   id: number;
//   fileName: string
// }

// async function getPhotos() {
//   try {
//   const response = await fetch("http://localhost:8080/api/photos")

//     console.log(response)
//     if (!response.ok) {
//       throw new Error(`Failed to fetch photos: ${response.status}`);
//     }

//     const allPhotos: Photo[] = await response.json();
//     return allPhotos
//   } catch (error) {
//     console.error("Failed to fetch photos:", error);
//     return [];
//   }
// }

export default async function Home() {
  //const photos = await getPhotos();

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Section */}
          <div className="md:w-1/3">
            {/* Logo */}
            <h1 className="text-3xl text-black md:text-2xl lg:text-3xl font-bold tracking-widest mb-8 ">
              ALEX CHEREDNICHENKO
            </h1>
            <Navigation />
          </div>

          {/* Right Section - Photo Grid
          <div className="md:w-2/3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="overflow-hidden rounded-lg "
                >
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
          </div> */}
        </div>
      </div>
    </div>
  );
}
