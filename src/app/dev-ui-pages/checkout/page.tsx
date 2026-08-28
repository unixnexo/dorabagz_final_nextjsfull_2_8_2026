import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/user/get-current-user";
import { CheckoutForm } from "./checkout-form";

export default async function CheckoutPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return <CheckoutForm />;
}