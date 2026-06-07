import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AIChat from "@/components/AIChat";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kumbh Yatra AI",
  description: "Intelligent Transportation & Mobility Management for Mahakumbh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="app-container">
          <Providers>
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
            <AIChat />
          </Providers>
        </div>
      </body>
    </html>
  );
}
