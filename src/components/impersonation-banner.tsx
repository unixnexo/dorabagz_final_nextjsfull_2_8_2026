import { getImpersonation } from "@/server/auth/session";
import { ImpersonationBannerClient } from "./impersonation-banner-client";

export async function ImpersonationBanner() {
  const impersonation = await getImpersonation();

  if (!impersonation) return null;

  return <ImpersonationBannerClient />;
}
