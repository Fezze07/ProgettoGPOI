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
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}

