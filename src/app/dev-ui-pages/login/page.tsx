import BackButton from "@/components/BackButton";
import LoginDrawer from "./LoginDrawer";
import LoginImageMasonry from "./LoginImageMasonry";

export default function LoginPage() {
    return (
        <main
            dir="rtl"
            className="flex min-h-dvh flex-col overflow-hidden bg-[#f1f2f3]"
        >
            <LoginImageMasonry />

            <LoginDrawer />

            <BackButton />
        </main>
    );
}