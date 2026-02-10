import type { Metadata } from 'next';
// FIX: Import React to bring the React namespace into scope for type annotations like React.ReactNode.
import React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'World Premiere XTV',
  description: 'A modern, production-ready YouTube clone.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
        <script src="https://unpkg.com/@mux/mux-player/dist/mux-player.js" defer></script>
      </head>
      <body className="bg-zinc-900 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
