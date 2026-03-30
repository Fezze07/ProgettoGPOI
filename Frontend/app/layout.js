// Layout globale dell'app Next.js applicato a tutte le pagine (root layout).
// Importa i font globali (es. Google Fonts), globals.css e variables.css.
// Definisce la struttura HTML base (<html lang>, <body>) e i metadati SEO dell'applicazione.
export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
