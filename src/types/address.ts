export type AddressDTO = {
  id: string;
  receiverFullName: string;
  receiverPhone: string;
  province: string;
  city: string;
  fullAddress: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
};

/** Shape sent by the address form on checkout. See
 *  src/lib/validations/address.ts for the exact Zod schema. */
export type AddressFormInput = {
  receiverFullName: string;
  receiverPhone: string;
  province: string;
  city: string;
  fullAddress: string;
  postalCode: string;
};
