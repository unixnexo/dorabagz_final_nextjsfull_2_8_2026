import "@/app/globals.css";
import type { Metadata } from "next";
import { QueryProvider } from "@/components/query-provider";
import { ImpersonationBanner } from "@/components/impersonation-banner";

export const metadata: Metadata = {
  title: "فروشگاه",
  description: "فروشگاه اینترنتی",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <QueryProvider>
          <ImpersonationBanner />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
