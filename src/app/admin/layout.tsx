import type { ReactNode } from "react";
import { AdminHeader } from "./admin-header";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div dir="rtl" className="min-h-dvh bg-[#F2F2F7]">
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
            <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col">
                <AdminHeader />
                <main className="flex-1 px-4 pb-10">{children}</main>
            </div>
        </div>
    );
}