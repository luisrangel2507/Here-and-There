import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Here & There — Aquí & Allá',
    short_name: 'Here & There',
    description: 'Aquí & Allá — trip proposal',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF9EF',
    theme_color: '#FF6B5B',
    icons: [
      { src: '/images/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/images/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
