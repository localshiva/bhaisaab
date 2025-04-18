import "./globals.css";

import { Toaster } from "@bhaisaab/shared/components/core/sonner";
import { APP_DESCRIPTION, APP_NAME } from "@bhaisaab/shared/constants/app";
import { PublicClientProviders } from "@bhaisaab/shared/providers/public-client-providers";
import type { Metadata, Viewport } from "next";
import { Mulish, Nunito_Sans, Varela } from "next/font/google";
import { headers } from "next/headers";

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

const APP_TITLE_TEMPLATE = "%s | Bhaisaab";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    template: APP_TITLE_TEMPLATE,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_NAME,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_NAME,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  icons: {
    icon: [
      {
        url: "/logo/ios/16.png",
        sizes: "16x16",
        type: "image/png",
        rel: "icon",
      },
      {
        url: "/logo/ios/32.png",
        sizes: "32x32",
        type: "image/png",
        rel: "icon",
      },
      {
        url: "/logo/ios/64.png",
        sizes: "64x64",
        type: "image/png",
        rel: "icon",
      },
      {
        url: "/logo/ios/96.png",
        sizes: "128x128",
        type: "image/png",
        rel: "icon",
      },
      {
        url: "/logo/android/android-launchericon-192-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/logo/android/android-launchericon-512-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [{ url: "/logo/ios/180.png", rel: "apple-touch-icon" }],
    other: [
      {
        rel: "mask-icon",
        url: "/logo/android/android-launchericon-192-192.png",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nextHeaders = await headers();
  const nonce = nextHeaders.get("x-nonce");

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${varela.variable} ${mulish.variable} ${nunitoSans.variable} antialiased bg-background`}
        suppressHydrationWarning
      >
        <PublicClientProviders nonce={nonce}>{children}</PublicClientProviders>
        <Toaster />
      </body>
    </html>
  );
}
