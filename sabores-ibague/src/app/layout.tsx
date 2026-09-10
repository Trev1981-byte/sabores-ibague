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
  title: "Colcocina",
  description:
    "Colcocina — descubre los mejores restaurantes, cafés y puestos de comida en Ibagué, Tolima.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${baloo.variable} ${karla.variable}`}>
      <body>
        <div className="topbar">
          <div className="wrap topbar-inner">
            <Link className="brand" href="/">
              <svg className="brand-mark-icon" viewBox="0 0 54 54" aria-hidden="true">
                <circle cx="27" cy="27" r="25" fill="#FFC72C" />
                <path d="M14 34 L28 16" stroke="#DFA300" strokeWidth="5" strokeLinecap="round" />
                <path d="M22 38 L38 18" stroke="#DFA300" strokeWidth="5" strokeLinecap="round" />
                <path d="M30 40 L44 24" stroke="#DFA300" strokeWidth="5" strokeLinecap="round" />
              </svg>
              <span className="brand-name">Colcocina</span>
            </Link>
            <div className="topbar-right">
              <span className="brand-loc">Ibagué · Tolima</span>
              <Link className="vendor-link" href="/agregar">
                Añade tu restaurante
              </Link>
            </div>
          </div>
        </div>

        {children}

        <footer>
          <div className="wrap foot-inner">
            <span className="foot-brand">
              <svg className="brand-mark-icon" viewBox="0 0 54 54" aria-hidden="true">
                <circle cx="27" cy="27" r="25" fill="#FFC72C" />
                <path d="M14 34 L28 16" stroke="#DFA300" strokeWidth="5" strokeLinecap="round" />
                <path d="M22 38 L38 18" stroke="#DFA300" strokeWidth="5" strokeLinecap="round" />
                <path d="M30 40 L44 24" stroke="#DFA300" strokeWidth="5" strokeLinecap="round" />
              </svg>
              <span className="brand-name">Colcocina</span>
            </span>
            <Link className="foot-link" href="/seguridad">
              Consejos de seguridad
            </Link>
            <Link className="foot-link" href="/terminos">
              Términos de uso
            </Link>
            <Link className="foot-link" href="/privacidad">
              Privacidad
            </Link>
            <span>Hecho para Ibagué, Tolima</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
