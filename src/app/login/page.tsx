// import type { Metadata } from "next";

// import BackButton from "@/components/BackButton";
// import LoginDrawer from "./LoginDrawer";
// import LoginImageMasonry from "./LoginImageMasonry";

// export const metadata: Metadata = {
//   title: "ورود و ثبت‌نام",
//   description:
//     "ورود یا ثبت‌نام در درا بگز برای خرید آنلاین، پیگیری سفارش‌ها و دسترسی به حساب کاربری.",
//   alternates: {
//     canonical: "/login",
//   },
//   robots: {
//     index: false,
//     follow: true,
//   },
// };

// export default function LoginPage() {
//   return (
//     <main
//       dir="rtl"
//       className="flex min-h-dvh flex-col overflow-hidden bg-[#f1f2f3]"
//     >
//       <LoginImageMasonry />

//       <LoginDrawer />

//       <BackButton href="/" />
//     </main>
//   );
// }










import type { Metadata } from "next";

import BackButton from "@/components/BackButton";
import LoginDrawer from "./LoginDrawer";

export const metadata: Metadata = {
  title: "ورود و ثبت‌نام",
  description:
    "ورود یا ثبت‌نام در درا بگز برای خرید آنلاین، پیگیری سفارش‌ها و دسترسی به حساب کاربری.",
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <main
      dir="rtl"
      className="relative flex min-h-dvh flex-col overflow-hidden bg-[#f1f2f3]"
    >
      {/* Login background */}
      {/* <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/site/login.webp')" }}
      /> */}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-[position:100%_center] sm:bg-[position:35%_center] md:bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/site/login.webp')" }}
      />

      {/* Optional subtle overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/[0.03]"
      />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <LoginDrawer />
      </div>

      <BackButton href="/" bgClass="bg-brand-primary text-muted" />
    </main>
  );
}