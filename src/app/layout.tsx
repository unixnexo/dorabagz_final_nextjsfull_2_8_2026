// import type { Metadata, Viewport } from "next";
// import { QueryProvider } from "@/components/query-provider";
// import { ImpersonationBanner } from "@/components/impersonation-banner";
// import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
// import { Geist } from "next/font/google";
// import { cn } from "@/lib/utils";
// import './globals.css'

// const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

// export const metadata: Metadata = {
//   title: "فروشگاه",
//   description: "فروشگاه اینترنتی",
//   manifest: "/manifest.json",
//   icons: {
//     icon: "/icons/icon-192.png",
//     apple: "/icons/icon-192.png",
//   },
// };

// export const viewport: Viewport = {
//   themeColor: "#111111",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="fa" dir="rtl" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
//       <body>
//         <div className="w-[500px] mx-auto">
//           <QueryProvider>
//             <ServiceWorkerRegistration />
//             <ImpersonationBanner />
//             {children}
//           </QueryProvider>
//         </div>
//       </body>
//     </html>
//   );
// }







import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { QueryProvider } from "@/components/query-provider";
import { ImpersonationBanner } from "@/components/impersonation-banner";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { cn } from "@/lib/utils";

import "./globals.css";

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
      className={cn(iranSans.variable)}
    >
      <body className="font-sans">
        <div className="mx-auto max-w-[500px] w-full">
          <QueryProvider>
            <ServiceWorkerRegistration />
            <ImpersonationBanner />
            {children}
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}

