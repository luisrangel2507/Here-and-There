import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Here & There ☀️',
  description: 'Aquí & Allá — trip proposal',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    title: 'Here & There',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/apple-touch-icon.png',
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
        <link rel="preload" as="image" href="/images/splash.jpg" />
        <link rel="preload" as="image" href="/images/bg-photo.jpg" />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
