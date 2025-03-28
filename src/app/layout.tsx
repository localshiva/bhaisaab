import "./globals.css";

import { APP_DESCRIPTION, APP_NAME } from "@bhaisaab/shared/constants/app";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Mulish, Nunito_Sans, Varela } from "next/font/google";

const varela = Varela({
  weight: "400", // This line was missing in your implementation
  subsets: ["latin"],
  display: "swap",
  variable: "--font-varela",
});

const mulish = Mulish({
  weight: ["600"], // Semibold weight
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mulish", // Optional: for CSS variable usage
});

const nunitoSans = Nunito_Sans({
  weight: ["600"], // Semibold weight
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito-sans", // Optional: for CSS variable usage
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${varela.variable} ${mulish.variable} ${nunitoSans.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
