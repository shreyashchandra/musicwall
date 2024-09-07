import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";

import Appbar from "../components/Appbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MusicWall",
  description: "Build By Shreyash inspired by Harkirat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Appbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
