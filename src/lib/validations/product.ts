// import { z } from "zod";

// const productImageSchema = z.object({
//   url: z.string().min(1),
//   isMain: z.boolean(),
//   sortOrder: z.number().int().min(0),
// });

// const productSpecificationSchema = z.object({
//   key: z.string().min(1, "کلید مشخصات نمی‌تواند خالی باشد"),
//   value: z.string().min(1, "مقدار مشخصات نمی‌تواند خالی باشد"),
//   sortOrder: z.number().int().min(0),
// });

// const productOptionSchema = z.object({
//   name: z.string().min(1, "نام گزینه نمی‌تواند خالی باشد"), // e.g. "Size"
//   values: z.array(z.string().min(1)).min(1, "حداقل یک مقدار لازم است"),
// });

// const productVariantSchema = z.object({
//   price: z.number().int().min(0, "قیمت نمی‌تواند منفی باشد"),
//   stock: z.number().int().min(0, "موجودی نمی‌تواند منفی باشد"),
//   optionValues: z.record(z.string(), z.string()),
// });

// export const productFormSchema = z
//   .object({
//     title: z.string().min(1, "عنوان الزامی است").max(200),
//     description: z.string().max(5000).optional(),
//     categoryId: z.string().nullable().optional(),
//     videoUrl: z.string().nullable().optional(),
//     images: z.array(productImageSchema).max(6, "حداکثر ۱ عکس اصلی + ۵ عکس اضافی مجاز است"),
//     specifications: z.array(productSpecificationSchema),
//     options: z.array(productOptionSchema),
//     variants: z.array(productVariantSchema).min(1, "حداقل یک نوع (variant) لازم است"),
//   })
//   .refine((data) => data.images.filter((i) => i.isMain).length <= 1, {
//     message: "فقط یک عکس می‌تواند اصلی باشد",
//     path: ["images"],
//   });
// export type ProductFormInput = z.infer<typeof productFormSchema>;

// export const updateProductSchema = productFormSchema.and(z.object({ id: z.string().min(1) }));
// export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// export const productListQuerySchema = z.object({
//   page: z.coerce.number().int().min(1).default(1),
//   pageSize: z.coerce.number().int().min(1).max(100).default(20),
//   search: z.string().optional(), // matches title or productCode
//   categoryId: z.string().optional(), // includes children of this category
//   minPrice: z.coerce.number().int().min(0).optional(),
//   maxPrice: z.coerce.number().int().min(0).optional(),
// });
// export type ProductListQuery = z.infer<typeof productListQuerySchema>;







import { z } from "zod";

const productImageSchema = z.object({
  url: z.string().min(1),
  isMain: z.boolean(),
  sortOrder: z.number().int().min(0),
});

const productSpecificationSchema = z.object({
  key: z.string().min(1, "کلید مشخصات نمی‌تواند خالی باشد"),
  value: z.string().min(1, "مقدار مشخصات نمی‌تواند خالی باشد"),
  sortOrder: z.number().int().min(0),
});

const productOptionSchema = z.object({
  name: z.string().min(1, "نام گزینه نمی‌تواند خالی باشد"), // e.g. "Size"
  values: z.array(z.string().min(1)).min(1, "حداقل یک مقدار لازم است"),
});

const productVariantSchema = z.object({
  price: z.number().int().min(0, "قیمت نمی‌تواند منفی باشد"),
  stock: z.number().int().min(0, "موجودی نمی‌تواند منفی باشد"),
  optionValues: z.record(z.string(), z.string()),
});

export const productFormSchema = z
  .object({
    title: z.string().min(1, "عنوان الزامی است").max(200),
    description: z.string().max(5000).optional(),
    categoryId: z.string().nullable().optional(),
    videoUrl: z.string().nullable().optional(),
    images: z.array(productImageSchema).max(6, "حداکثر ۱ عکس اصلی + ۵ عکس اضافی مجاز است"),
    specifications: z.array(productSpecificationSchema),
    options: z.array(productOptionSchema),
    variants: z.array(productVariantSchema).min(1, "حداقل یک نوع (variant) لازم است"),
  })
  .refine((data) => data.images.filter((i) => i.isMain).length <= 1, {
    message: "فقط یک عکس می‌تواند اصلی باشد",
    path: ["images"],
  });
export type ProductFormInput = z.infer<typeof productFormSchema>;

export const updateProductSchema = productFormSchema.and(z.object({ id: z.string().min(1) }));
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// ---------------------------------------------------------------------------
// Product list query — used by both the public home page (search/filter/
// sort/pagination) and the admin product table.
//
// NOTE on inStock/hasDiscount: these are intentionally z.coerce.boolean()
// candidates but we DON'T use z.coerce.boolean() directly here — that
// coerces ANY non-empty string (including "false" or "0") to `true`,
// which breaks when values come from URL search params as raw strings.
// Callers (see src/app/page.tsx) are responsible for turning
// "1"/absent into real booleans BEFORE calling safeParse, so this schema
// only ever sees an actual boolean or undefined.
// ---------------------------------------------------------------------------
export const productListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(), // matches title or productCode
  categoryId: z.string().optional(), // includes children of this category
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  inStock: z.boolean().optional(), // true = only totalStock > 0
  hasDiscount: z.boolean().optional(), // true = only products with an active discount
  sort: z.enum(["newest", "oldest", "cheap", "expensive"]).default("newest"),
});
export type ProductListQuery = z.infer<typeof productListQuerySchema>;


