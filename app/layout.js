import { Analytics } from "@vercel/analytics/next";
import "../styles/globals.css";

export const metadata = {
  title: "Progetto GPO - Finance Dashboard",
  description: "Monitoraggio mercati azionari in tempo reale con Supabase e Vercel",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body text-on-surface antialiased bg-background">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
