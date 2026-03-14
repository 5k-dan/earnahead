import "./globals.css";
import React from "react";
import { DM_Serif_Display, Inter } from "next/font/google";

const dmSerifDisplay = DM_Serif_Display({ weight: "400", subsets: ["latin"], variable: "--font-dm-serif" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: "EarnAhead",
  description: "Earn from regulated opportunities near you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSerifDisplay.variable} ${inter.variable}`}>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}