// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTelegram } from "react-icons/fa";

interface Photo {
  id: number;
  pageName: string;
  path: string;
  order: number;
}

async function getPhotos() {
  try {
    const response = await fetch("http://localhost:8080/api/photo/page/main", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch photos: ${response.status}`);
    }

    const allPhotos: Photo[] = await response.json();
    return allPhotos.filter((photo) => photo.pageName === "main");
  } catch (error) {
    console.error("Failed to fetch photos:", error);
    return [];
  }
}

export default async function Home() {
  const photos = await getPhotos();

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Section */}
          <div className="md:w-1/3">
            {/* Logo */}
            <h1 className="text-3xl md:text-2xl lg:text-3xl font-bold tracking-widest mb-8 ">
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

          {/* Right Section - Photo Grid */}
          <div className="md:w-2/3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="overflow-hidden rounded-lg shadow-md"
                >
                  <Image
                    src={photo.path}
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
