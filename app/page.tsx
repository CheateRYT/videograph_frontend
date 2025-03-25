"use client"
import Image from "next/image";
import Navigation from "./Navigation";
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-gray-200">
      <div className="container mx-auto px-4 py-8">
        {/* Флекс-контейнер: по умолчанию колонки, а начиная с 1300px – ряд */}
        <div className="flex flex-col gap-8 customRow">
          {/* Левая часть: логотип и навигация */}
          <div className="left w-full">
            <h1 className="text-3xl text-black font-bold tracking-widest mb-8">
              ALEX CHEREDNICHENKO
            </h1>
            <Navigation />
          </div>
          {/* Правая часть: блок "Обо мне / Философия" со шрифтом Great Vibes */}
          <div
            className="right w-full flex flex-col gap-8"
            style={{ fontFamily: '"Great Vibes", cursive' }}
          >
            {/* Заголовок "Философия" */}
            <div className="bg-[#EEE3CD] rounded-[33px] px-5 py-5 text-center max-w-full mx-auto">
              <h2 className="text-4xl font-bold GreatVibes">Философия</h2>
            </div>
            {/* Блок с двумя колонками: текст и изображение */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Левая колонка – увеличенный текст */}
              <div className="flex-1 bg-[#EEE3CD] rounded-[33px] p-5 flex items-center">
                <p className="text-3xl text-center GreatVibes">
                  Философия видеографа — это стремление запечатлеть моменты так,
                  чтобы они не просто рассказывали историю, а вызывали эмоции,
                  передавали атмосферу и оставались ценными воспоминаниями.
                  Каждый кадр — это не просто изображение, а часть живого
                  повествования, где свет, композиция и движение объединяются,
                  создавая уникальный визуальный почерк. Видеограф не просто
                  снимает — он интерпретирует, наполняя видео смыслом и
                  настроением, чтобы оно оставалось актуальным и вдохновляющим
                  даже спустя годы.
                </p>
              </div>
              {/* Правая колонка – изображение */}
              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-[400px] h-[500px] rounded-[20px] overflow-hidden border border-[rgba(225,197,197,0.39)] drop-shadow-lg">
                  <Image
                    src="/about_photo.png"
                    alt="Фотография"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            {/* Заголовок "Простота и гармония" */}
            <div className="bg-[#EEE3CD] rounded-[33px] px-5 py-4 text-center max-w-[80%] mx-auto">
              <h2 className="text-4xl font-bold GreatVibes">
                Простота и гармония
              </h2>
            </div>
            {/* Текстовый блок */}
            <div className="bg-[#EEE3CD] rounded-[33px] p-5 flex flex-col gap-4">
              <p className="text-3xl text-center GreatVibes">
                Главная задача — сделать каждое видео уникальным, вложив в него
                огромный труд, результатом которого станет ваш фильм.
              </p>
              <p className="text-3xl text-center GreatVibes">
                Весь мой опыт - это результат исследований и наблюдений,
                вдохновляющих меня на душевное видео.
              </p>
              <p className="text-3xl text-center GreatVibes">
                Всегда приятно осознавать, что мои фильмы могут быть частичкой
                вашей жизни.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Подключение стилей: класс GreatVibes и кастомный медиа-запрос */}
      <style jsx>{`
        .GreatVibes {
          font-family: "Great Vibes", cursive;
        }
        @media (min-width: 1300px) {
          .customRow {
            flex-direction: row;
          }
          .left {
            width: 33.3333%;
          }
          .right {
            width: 66.6667%;
          }
        }
      `}</style>
    </div>
  );
}