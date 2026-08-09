"use server";

import { prisma } from "@/lib/prisma";
import { getEffectiveIdentity } from "@/server/auth/session";
import { addressFormSchema } from "@/lib/validations/address";
import { toAddressDTO } from "./address-mapper";
import type { ActionResult } from "@/server/auth/actions";
import type { AddressDTO } from "@/types/address";

// ---------------------------------------------------------------------------
// Get the current user's saved address, if any (used to prefill the
// checkout form — per your spec, "hit and prefill").
// ---------------------------------------------------------------------------
export async function getMyAddressAction(): Promise<ActionResult<AddressDTO | null>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const address = await prisma.address.findUnique({ where: { userId: identity.userId } });
  return { success: true, data: address ? toAddressDTO(address) : null };
}

// ---------------------------------------------------------------------------
// Create or overwrite the user's single saved address. Per your spec: only
// ONE address ever, always updated in place — enforced by the @@unique on
// userId in the schema + upsert here.
// ---------------------------------------------------------------------------
export async function saveMyAddressAction(input: unknown): Promise<ActionResult<AddressDTO>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const parsed = addressFormSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const address = await prisma.address.upsert({
    where: { userId: identity.userId },
    update: parsed.data,
    create: { ...parsed.data, userId: identity.userId },
  });

  return { success: true, data: toAddressDTO(address) };
}
