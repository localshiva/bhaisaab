import { APP_DESCRIPTION, APP_NAME } from "@bhaisaab/shared/constants/app";
import type { MetadataRoute } from "next";

type AppManifest = MetadataRoute.Manifest & {
  screenshots?: {
    src: string;
    sizes: string;
    type?: string;
    form_factor?: "wide" | "narrow";
  }[];
};

export default function manifest(): AppManifest {
  return {
    name: `${APP_NAME}: Bhai + Hisaab`,
    short_name: APP_NAME,
    description: APP_DESCRIPTION,
    id: "/",
    start_url: "/",
    display: "standalone",
    background_color: "#18181b",
    theme_color: "#18181b",
    icons: [
      {
        src: "logo/android/android-launchericon-512-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/android/android-launchericon-192-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/android/android-launchericon-144-144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "logo/android/android-launchericon-96-96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/android/android-launchericon-72-72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/android/android-launchericon-48-48.png",
        sizes: "48x48",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/16.png",
        sizes: "16x16",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/20.png",
        sizes: "20x20",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/29.png",
        sizes: "29x29",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/32.png",
        sizes: "32x32",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/40.png",
        sizes: "40x40",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/50.png",
        sizes: "50x50",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/57.png",
        sizes: "57x57",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/58.png",
        sizes: "58x58",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/60.png",
        sizes: "60x60",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/64.png",
        sizes: "64x64",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/76.png",
        sizes: "76x76",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/80.png",
        sizes: "80x80",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/87.png",
        sizes: "87x87",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/100.png",
        sizes: "100x100",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/114.png",
        sizes: "114x114",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/120.png",
        sizes: "120x120",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "logo/ios/152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/167.png",
        sizes: "167x167",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/180.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/256.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "logo/ios/1024.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [],
  };
}
