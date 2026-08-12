"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/server/auth/session";
import { discountGroupFormSchema, updateDiscountGroupSchema } from "@/lib/validations/discount";
import { toDiscountGroupDTO, fullDiscountGroupInclude } from "./discount-mapper";
import type { ActionResult } from "@/server/auth/actions";
import type { DiscountGroupDTO } from "@/types/discount";

async function requireAdmin(): Promise<boolean> {
  const session = await getSession();
  return !!session && session.role === "ADMIN";
}

export async function listDiscountGroupsAction(): Promise<ActionResult<DiscountGroupDTO[]>> {
  if (!(await requireAdmin())) return { success: false, error: "دسترسی غیرمجاز." };

  const groups = await prisma.discountGroup.findMany({
    where: { isDeleted: false },
    include: fullDiscountGroupInclude,
    orderBy: { createdAt: "desc" },
  });

  return { success: true, data: groups.map(toDiscountGroupDTO) };
}

export async function createDiscountGroupAction(input: unknown): Promise<ActionResult<DiscountGroupDTO>> {
  if (!(await requireAdmin())) return { success: false, error: "دسترسی غیرمجاز." };

  const parsed = discountGroupFormSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  const group = await prisma.discountGroup.create({
    data: {
      title: data.title,
      type: data.type,
      value: data.value,
      startAt: data.startAt ? new Date(data.startAt) : null,
      endAt: data.endAt ? new Date(data.endAt) : null,
      products: { create: data.productIds.map((productId) => ({ productId })) },
      categories: { create: data.categoryIds.map((categoryId) => ({ categoryId })) },
    },
    include: fullDiscountGroupInclude,
  });

  return { success: true, data: toDiscountGroupDTO(group) };
}

// Update the WHOLE group (title, type, value, dates, and full membership
// replacement) — per your spec, admin edits a group as a unit. Removing
// just one member without touching the rest is a separate, more
// surgical action below.
export async function updateDiscountGroupAction(input: unknown): Promise<ActionResult<DiscountGroupDTO>> {
  if (!(await requireAdmin())) return { success: false, error: "دسترسی غیرمجاز." };

  const parsed = updateDiscountGroupSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  await prisma.discountGroupProduct.deleteMany({ where: { groupId: data.id } });
  await prisma.discountGroupCategory.deleteMany({ where: { groupId: data.id } });

  const group = await prisma.discountGroup.update({
    where: { id: data.id },
    data: {
      title: data.title,
      type: data.type,
      value: data.value,
      startAt: data.startAt ? new Date(data.startAt) : null,
      endAt: data.endAt ? new Date(data.endAt) : null,
      products: { create: data.productIds.map((productId) => ({ productId })) },
      categories: { create: data.categoryIds.map((categoryId) => ({ categoryId })) },
    },
    include: fullDiscountGroupInclude,
  });

  return { success: true, data: toDiscountGroupDTO(group) };
}

// Remove ONE product from a group, leaving everything else untouched —
// per your spec: admin can remove one item without editing the group's terms.
export async function removeProductFromGroupAction(
  groupId: string,
  productId: string
): Promise<ActionResult<{ removed: true }>> {
  if (!(await requireAdmin())) return { success: false, error: "دسترسی غیرمجاز." };

  await prisma.discountGroupProduct.deleteMany({ where: { groupId, productId } });
  return { success: true, data: { removed: true } };
}

// Remove ONE category from a group, same idea as above.
export async function removeCategoryFromGroupAction(
  groupId: string,
  categoryId: string
): Promise<ActionResult<{ removed: true }>> {
  if (!(await requireAdmin())) return { success: false, error: "دسترسی غیرمجاز." };

  await prisma.discountGroupCategory.deleteMany({ where: { groupId, categoryId } });
  return { success: true, data: { removed: true } };
}

// Delete the WHOLE group — removes the discount from every member at
// once, per your spec.
export async function deleteDiscountGroupAction(id: string): Promise<ActionResult<{ deleted: true }>> {
  if (!(await requireAdmin())) return { success: false, error: "دسترسی غیرمجاز." };

  await prisma.discountGroup.update({ where: { id }, data: { isDeleted: true } });
  return { success: true, data: { deleted: true } };
}
