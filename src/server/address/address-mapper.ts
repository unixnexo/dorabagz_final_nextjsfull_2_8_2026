import type { Address } from "@prisma/client";
import type { AddressDTO } from "@/types/address";

export function toAddressDTO(address: Address): AddressDTO {
  return {
    id: address.id,
    receiverFullName: address.receiverFullName,
    receiverPhone: address.receiverPhone,
    province: address.province,
    city: address.city,
    fullAddress: address.fullAddress,
    postalCode: address.postalCode,
    createdAt: address.createdAt.toISOString(),
    updatedAt: address.updatedAt.toISOString(),
  };
}
