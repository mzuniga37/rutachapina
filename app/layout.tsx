import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ruta Chapina",
  description: "Rangos reales de tiempo de viaje en Ciudad de Guatemala, según el historial que vamos recolectando.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
