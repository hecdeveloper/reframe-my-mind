import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  weight: ['300', '400', '500'],
  subsets: ["latin"],
  variable: '--font-dm-sans'
});

const dmSerif = DM_Serif_Display({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ["latin"],
  variable: '--font-dm-serif'
});

export const metadata: Metadata = {
  title: "re·frame — CBT coaching for unhelpful thoughts",
  description: "A brief conversation with a CBT coach to reframe unhelpful thoughts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
