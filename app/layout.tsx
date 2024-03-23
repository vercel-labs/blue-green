import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./blue-green.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blue-Green deployments on Vercel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
