// import "@/app/globals.css";
// import type { Metadata } from "next";
// import { QueryProvider } from "@/components/query-provider";
// import { ImpersonationBanner } from "@/components/impersonation-banner";

// export const metadata: Metadata = {
//   title: "فروشگاه",
//   description: "فروشگاه اینترنتی",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="fa" dir="rtl">
//       <body>
//         <QueryProvider>
//           <ImpersonationBanner />
//           {children}
//         </QueryProvider>
//       </body>
//     </html>
//   );
// }




import type { Metadata, Viewport } from "next";
import { QueryProvider } from "@/components/query-provider";
import { ImpersonationBanner } from "@/components/impersonation-banner";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <QueryProvider>
          <ServiceWorkerRegistration />
          <ImpersonationBanner />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}

