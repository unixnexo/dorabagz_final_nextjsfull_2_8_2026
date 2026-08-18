import { redirect } from "next/navigation";

import { getCurrentUser } from "@/server/user/get-current-user";
import { ProfilePageClient } from "./profile-page-client";

export default async function ProfilePage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return <ProfilePageClient user={user} />;
}