import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Engagement RSVP",
  description: "A navy gingham engagement RSVP website."
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
