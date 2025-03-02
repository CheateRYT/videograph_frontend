// app/price-list/page.tsx
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTelegram } from "react-icons/fa";

export default function PriceList() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Section */}
          <div className="md:w-1/3">
            {/* Logo */}
            <h1 className="text-3xl md:text-2xl text-black  lg:text-3xl font-bold tracking-widest mb-8 ">
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
                    className="text-black text-xl border-b-2 border-black pb-1 inline-block"
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

          {/* Right Section - Price List */}
          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold mb-8 border-b-2 border-gray-300 pb-2">
              Прайс-лист
            </h2>

            <div className="space-y-8">
              {/* Individual Services */}
              <div className="space-y-6">
                {/* Service 1 */}
                <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold">
                      Видеосъемка с монтажом
                    </h3>
                    <span className="text-lg font-bold">от 2000 руб/ч</span>
                  </div>
                  <p className="text-black">
                    Съемки, монтаж и саундизайн, генерация идей и помощь в
                    момент съемки.
                  </p>
                </div>

                {/* Service 2 */}
                <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold">
                      Видеосъемка без монтажа
                    </h3>
                    <span className="text-lg font-bold">3000 руб</span>
                  </div>
                  <p className="text-black">
                    Отдаю исходники + цветокоррекция (по желанию).
                  </p>
                </div>

                {/* Service 3 */}
                <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold">
                      Монтаж по исходникам
                    </h3>
                    <span className="text-lg font-bold">1000 руб/ч</span>
                  </div>
                  <p className="text-black">
                    Обсуждаем монтаж под вашу идею из имеющегося материала.
                  </p>
                </div>
              </div>

              {/* Packages */}
              <div>
                <h3 className="text-2xl font-semibold mb-4">Пакеты услуг</h3>
                <div className="space-y-6">
                  {/* Package 1 */}
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-800 transition-transform hover:translate-y-[-5px]">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold">
                        5 роликов с монтажом
                      </h3>
                      <span className="text-lg font-bold">10000 руб</span>
                    </div>
                  </div>

                  {/* Package 2 */}
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-800 transition-transform hover:translate-y-[-5px]">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold">
                        Месячное сопровождение (15 дней)
                      </h3>
                      <span className="text-lg font-bold">20000 руб</span>
                    </div>
                    <p className="text-black">Съемка два раза в месяц.</p>
                  </div>

                  {/* Package 3 */}
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-800 transition-transform hover:translate-y-[-5px]">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold">
                        Месячное сопровождение (30 дней)
                      </h3>
                      <span className="text-lg font-bold">30000 руб</span>
                    </div>
                    <p className="text-black">Съемка два раза в месяц.</p>
                  </div>
                </div>
              </div>

              {/* Premium Service */}
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg shadow-md border border-gray-300">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">Ведение аккаунта</h3>
                  <span className="text-lg font-bold">40000 руб</span>
                </div>
                <p className="text-black">
                  Ведение вашего аккаунта в соцсетях под ключ в течении 2-х
                  недель: Концептуальные идеи, интервью, экспертный формат,
                  работа с блогерами от лица компании и т.д.
                </p>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="mt-10 bg-gray-800 text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">
                Нужна индивидуальная консультация?
              </h3>
              <p className="mb-4">
                Свяжитесь со мной для обсуждения деталей вашего проекта.
              </p>
              <a
                href="https://t.me/alexandr_ch"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors"
              >
                Связаться
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
