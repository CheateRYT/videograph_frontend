"use client";
import Link from "next/link";
import { useState } from "react";
import { FaInstagram, FaTelegram } from "react-icons/fa";
export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <div className="md:hidden flex justify-between items-center mb-4">
        <button onClick={toggleMenu} className="focus:outline-none">
          <div
            className={`w-8 h-1 bg-black mb-1 transition-all ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></div>
          <div
            className={`w-8 h-1 bg-black mb-1 transition-all ${
              isOpen ? "opacity-0" : ""
            }`}
          ></div>
          <div
            className={`w-8 h-1 bg-black mb-1 transition-all ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></div>
        </button>
      </div>
      {isOpen && (
        <nav className="md:hidden mb-12">
          <ul className="space-y-4">
            <li>
              <Link
                href="/"
                className="text-black text-xl hover:border-b-2 border-black pb-1 inline-block"
              >
                Обо мне
              </Link>
            </li>
            <li>
              <Link
                href="/portfolio"
                className="text-black text-xl hover:border-b-2 border-black pb-1 inline-block"
              >
                Портфолио
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
                href="/reviews"
                className="text-black text-xl hover:border-b-2 border-black pb-1 inline-block"
              >
                Отзывы
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
      )}
      {/* Полное меню для больших экранов */}
      <nav className="hidden md:block mb-12">
        <ul className="space-y-4">
          <li>
            <Link
              href="/"
              className="text-black text-xl hover:border-b-2 border-black pb-1 inline-block"
            >
              Обо мне
            </Link>
          </li>
          <li>
            <Link
              href="/portfolio"
              className="text-black text-xl hover:border-b-2 border-black pb-1 inline-block"
            >
              Портфолио
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
              href="/reviews"
              className="text-black text-xl hover:border-b-2 border-black pb-1 inline-block"
            >
              Отзывы
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
      {/* Социальные сети */}
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
          href="https://t.me/chered_ad"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-black"
        >
          <FaTelegram size={28} />
        </a>
      </div>
    </div>
  );
}
