import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sabores de Ibagué",
  description:
    "Descubre los mejores restaurantes, cafés y puestos de comida en Ibagué, Tolima.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white dark:bg-neutral-950">
        <header className="border-b border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto flex w-full max-w-4xl items-center px-4 py-4">
            <Link
              href="/"
              className="text-lg font-semibold text-neutral-900 dark:text-neutral-50"
            >
              🍽️ Sabores de Ibagué
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
