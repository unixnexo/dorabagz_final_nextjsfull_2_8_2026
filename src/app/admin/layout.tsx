import type { ReactNode } from "react";
import { AdminHeader } from "./admin-header";
import { Toaster } from "react-hot-toast";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div dir="rtl" className="min-h-dvh bg-[#F2F2F7]">
            {/* <Toaster
                position="bottom-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        fontFamily: "inherit",
                        direction: "rtl",
                    },
                }}
            /> */}
            <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col">
                <AdminHeader />
                <main className="flex-1 px-4 pb-10">{children}</main>
            </div>
        </div>
    );
}