import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = { title: "500fps", description: "Редакционная лента" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru" className={`${inter.variable} ${mono.variable}`}>
        <body>{children}</body>
        </html>
    );
}
