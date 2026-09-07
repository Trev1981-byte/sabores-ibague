import type { Metadata } from "next";
import { Baloo_2, Karla } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Sabores de Ibagué",
  description:
    "Descubre los mejores restaurantes, cafés y puestos de comida en Ibagué, Tolima.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${baloo.variable} ${karla.variable}`}>
      <body>
        <div className="topbar">
          <div className="wrap topbar-inner">
            <Link className="brand" href="/">
              <span className="brand-mark" aria-hidden="true">
                🍽️
              </span>
              Sabores de Ibagué
            </Link>
            <span className="brand-loc">Ibagué · Tolima</span>
          </div>
        </div>

        {children}

        <footer>
          <div className="wrap foot-inner">
            <span>
              <span className="brand-mark" aria-hidden="true">
                🍽️
              </span>{" "}
              Sabores de Ibagué
            </span>
            <span>Hecho para Ibagué, Tolima</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
