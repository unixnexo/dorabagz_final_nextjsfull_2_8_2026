import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { QueryProvider } from "@/components/query-provider";
import { ImpersonationBanner } from "@/components/impersonation-banner";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { cn } from "@/lib/utils";

import "./globals.css";
import { Toaster } from "react-hot-toast";

const iranSans = localFont({
  src: "../fonts/iransans.woff2",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "فروشگاه",
  description: "فروشگاه اینترنتی",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={cn(iranSans.variable, "bg-background")}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="DoraBagz" />
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
            <ImpersonationBanner />
            {children}
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}

