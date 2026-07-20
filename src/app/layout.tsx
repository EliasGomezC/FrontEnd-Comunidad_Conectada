import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/features/authentication/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "Comunidad Conectada",
    template: "%s | Comunidad Conectada",
  },
  description: "Sistema de Gestión de Privadas Residenciales",
  icons: {
    icon: "/assets/img/iconCC.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
