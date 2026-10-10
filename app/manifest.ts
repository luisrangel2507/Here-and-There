import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '¿De aquí a dónde?',
    short_name: '¿Dónde?',
    description: 'Propuesta de viaje',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF9EF',
    theme_color: '#FF6B5B',
    icons: [
      { src: '/images/icon-192.png?v=2', sizes: '192x192', type: 'image/png' },
      { src: '/images/icon-512.png?v=2', sizes: '512x512', type: 'image/png' },
    ],
  };
}
