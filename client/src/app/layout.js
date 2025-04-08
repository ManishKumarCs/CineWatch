// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "CineWatch 🎬 | Discover & Track Movies",
  description: "Search movies, add to your watchlist, and never miss a favorite again!",
  themeColor: "#3B82F6", // Tailwind blue-500
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "CineWatch 🎬",
    description: "Search movies, add to your watchlist, and never miss a favorite again!",
    url: "https://your-domain.com",
    siteName: "CineWatch",
    images: [
      {
        url: "/og-image.png", // Add this image in /public folder
        width: 1200,
        height: 630,
        alt: "CineWatch Open Graph Banner",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CineWatch 🎬",
    description: "Search movies, add to your watchlist, and never miss a favorite again!",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-100 text-gray-900`}
      >
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
