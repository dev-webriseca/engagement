import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Ibrahim & Maryam's Engagement",
  description: "Join us in celebrating the engagement of Ibrahim Daoud and Maryam Jawad.",
  openGraph: {
    title: "Ibrahim & Maryam's Engagement",
    description: "We're Engaged · Friday, August 21, 2026",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bismillah al-Rahman al-Rahim — Ibrahim & Maryam's Engagement"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Ibrahim & Maryam's Engagement",
    description: "We're Engaged · Friday, August 21, 2026",
    images: ["/images/og-image.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
