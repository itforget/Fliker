import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./utils/provider";

const roboto = Roboto({
  weight: ["400", "100", "300", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "W",
  description: "W é a plataforma social onde as conversas ganham vida. Aqui, você pode compartilhar suas ideias, acompanhar o que está acontecendo no mundo em tempo real e conectar-se com pessoas de todas as partes do planeta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${roboto.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
