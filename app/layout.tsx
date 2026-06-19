import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#0d1117",
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:border focus:border-accent-cyan focus:bg-bg-secondary focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-text-primary"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
