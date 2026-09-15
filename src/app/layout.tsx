import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { QueryProvider } from "@/components/query-provider";
import { ImpersonationBanner } from "@/components/impersonation-banner";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { cn } from "@/lib/utils";

import "./globals.css";
import { Toaster } from "react-hot-toast";
import { LiveNotificationListener } from "@/components/live-notification-listener";

const iranSans = localFont({
  src: "../fonts/iransans.woff2",
  variable: "--font-sans",
  display: "swap",
});


const SITE_URL = "https://dorabagz.ir";
const SITE_NAME = "DoraBagz";
const SITE_DESCRIPTION = "فروشگاه اینترنتی درا بگز — خرید آنلاین با ارسال سریع";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | فروشگاه اینترنتی`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | فروشگاه اینترنتی`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-default.webp",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | فروشگاه اینترنتی`,
    description: SITE_DESCRIPTION,
    images: ["/og-default.jpg"],
  },
  formatDetection: {
    telephone: false, // stops iOS auto-linking phone-number-looking strings (e.g. product codes)
  },
};

export const viewport: Viewport = {
  themeColor: "#ECE7D1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={cn(iranSans.variable, "bg-background")}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      </head>
      <body className="font-sans">
        <div className="mx-auto max-w-[500px] w-full" data-vaul-drawer-wrapper>
          <QueryProvider>

            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  fontFamily: "inherit",
                  direction: "rtl",
                },
              }}
            />
            <ServiceWorkerRegistration />
            <LiveNotificationListener />
            <ImpersonationBanner />

            {children}

            {modal}

          </QueryProvider>
        </div>
      </body>
    </html>
  );
}

