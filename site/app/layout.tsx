import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAMO — кафе в центре Воронежа",
  description:
    "QR-меню, доставка, бронь и банкеты в кафе RAMO. Уютная атмосфера, авторская кухня, современный интерьер.",
  keywords: ["кафе Воронеж", "Ramo", "QR меню", "банкет Воронеж", "ресторан Воронеж"],
  openGraph: {
    title: "RAMO — кафе в центре Воронежа",
    description: "QR-меню, авторская кухня, банкеты",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
