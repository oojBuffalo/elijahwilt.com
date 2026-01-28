import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elijah Wilt | ML/AI Engineer",
  description:
    "Machine Learning Engineer with expertise in computer vision, NLP, and full-stack development. OSU graduate student, Cornell CS graduate.",
  keywords: [
    "Machine Learning",
    "AI Engineer",
    "Computer Vision",
    "NLP",
    "PyTorch",
    "Data Science",
    "MLOps",
  ],
  authors: [{ name: "Elijah Wayne Wilt" }],
  openGraph: {
    title: "Elijah Wilt | ML/AI Engineer",
    description:
      "Machine Learning Engineer with expertise in computer vision, NLP, and full-stack development.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
