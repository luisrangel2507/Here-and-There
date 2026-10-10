import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '¿De aquí a dónde? ☀️',
  description: 'Propuesta de viaje',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    title: '¿De aquí a dónde?',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/images/logo.png?v=2',
    apple: '/images/apple-touch-icon.png?v=2',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,600;1,9..144,700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="preload" as="image" href="/images/splash.jpg?v=2" />
        <link rel="preload" as="image" href="/images/intro-hero.jpg?v=2" />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
