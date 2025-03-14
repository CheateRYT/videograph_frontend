import type { Metadata } from "next";
import { Great_Vibes } from "next/font/google";
import "./globals.css";
const greatVibes = Great_Vibes({
  variable: "--font-greatVibes-sans",
  subsets: ["latin"],
  weight: "400",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${greatVibes.variable} antialiased`}>{children}</body>
    </html>
  );
}
