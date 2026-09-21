import "server-only";
import { prisma } from "@/lib/prisma";
import { generateProductCode, buildProductSlug } from "@/lib/slug";
import type { ProductFormInput } from "@/lib/validations/product";

/**
 * Creates a brand new product, including all nested options/variants/
 * images/specifications, in a single DB transaction.
 *
 * How option/variant linking works:
 *   The form sends `options: [{ name: "Size", values: ["SM", "M"] }, ...]`
 *   and `variants: [{ price, stock, optionValues: { "Size": "SM" } }, ...]`.
 *   We first create all ProductOption + ProductOptionValue rows, building a
 *   lookup map of "optionName|value" -> optionValueId, then create each
 *   variant and link it to the right option value rows via that map.
 */
export async function createProductWithRelations(input: ProductFormInput) {
  const productCode = generateProductCode();
  const slug = buildProductSlug(input.title, productCode);

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        title: input.title,
        description: input.description || null,
        slug,
        productCode,
        videoUrl: input.videoUrl || null,
        categoryId: input.categoryId || null,
        images: {
          create: input.images.map((img) => ({
            url: img.url,
            isMain: img.isMain,
            sortOrder: img.sortOrder,
          })),
        },
        specifications: {
          create: input.specifications.map((spec) => ({
            key: spec.key,
            value: spec.value,
            sortOrder: spec.sortOrder,
          })),
        },
      },
    });

    // optionName|value -> optionValueId, filled in as we create each row
    const optionValueMap = new Map<string, string>();

    for (let i = 0; i < input.options.length; i++) {
      const opt = input.options[i];
      const createdOption = await tx.productOption.create({
        data: { name: opt.name, sortOrder: i, productId: product.id },
      });
      for (let j = 0; j < opt.values.length; j++) {
        const val = opt.values[j];
        const createdValue = await tx.productOptionValue.create({
          data: { value: val, sortOrder: j, optionId: createdOption.id },
        });
        optionValueMap.set(`${opt.name}|${val}`, createdValue.id);
      }
    }

    for (const variant of input.variants) {
      const createdVariant = await tx.productVariant.create({
        data: { price: variant.price, stock: variant.stock, productId: product.id },
      });

      const optionValueIds = Object.entries(variant.optionValues)
        .map(([name, value]) => optionValueMap.get(`${name}|${value}`))
        .filter((id): id is string => !!id);

      if (optionValueIds.length > 0) {
        await tx.variantOptionValue.createMany({
          data: optionValueIds.map((optionValueId) => ({
            variantId: createdVariant.id,
            optionValueId,
          })),
        });
      }
    }

    return product.id;
  });
}

/**
 * Updates an existing product. Simplest correct approach: replace all
 * nested relations (images, specs, options, values, variants, links)
 * rather than trying to diff them — much less error-prone, and product
 * catalogs aren't edited so often that this is a performance concern.
 */
// export async function updateProductWithRelations(productId: string, input: ProductFormInput) {
//   return prisma.$transaction(async (tx) => {
//     // Delete old nested rows (cascade handles VariantOptionValue + option values)
//     await tx.productImage.deleteMany({ where: { productId } });
//     await tx.productSpecification.deleteMany({ where: { productId } });
//     await tx.productVariant.deleteMany({ where: { productId } }); // cascades VariantOptionValue
//     await tx.productOption.deleteMany({ where: { productId } }); // cascades ProductOptionValue

//     const product = await tx.product.update({
//       where: { id: productId },
//       data: {
//         title: input.title,
//         description: input.description || null,
//         categoryId: input.categoryId || null,
//         videoUrl: input.videoUrl || null,
//         images: {
//           create: input.images.map((img) => ({
//             url: img.url,
//             isMain: img.isMain,
//             sortOrder: img.sortOrder,
//           })),
//         },
//         specifications: {
//           create: input.specifications.map((spec) => ({
//             key: spec.key,
//             value: spec.value,
//             sortOrder: spec.sortOrder,
//           })),
//         },
//       },
//     });

//     const optionValueMap = new Map<string, string>();

//     for (let i = 0; i < input.options.length; i++) {
//       const opt = input.options[i];
//       const createdOption = await tx.productOption.create({
//         data: { name: opt.name, sortOrder: i, productId: product.id },
//       });
//       for (let j = 0; j < opt.values.length; j++) {
//         const val = opt.values[j];
//         const createdValue = await tx.productOptionValue.create({
//           data: { value: val, sortOrder: j, optionId: createdOption.id },
//         });
//         optionValueMap.set(`${opt.name}|${val}`, createdValue.id);
//       }
//     }

//     for (const variant of input.variants) {
//       const createdVariant = await tx.productVariant.create({
//         data: { price: variant.price, stock: variant.stock, productId: product.id },
//       });

//       const optionValueIds = Object.entries(variant.optionValues)
//         .map(([name, value]) => optionValueMap.get(`${name}|${value}`))
//         .filter((id): id is string => !!id);

//       if (optionValueIds.length > 0) {
//         await tx.variantOptionValue.createMany({
//           data: optionValueIds.map((optionValueId) => ({
//             variantId: createdVariant.id,
//             optionValueId,
//           })),
//         });
//       }
//     }

//     return product.id;
//   });
// }




export async function updateProductWithRelations(productId: string, input: ProductFormInput) {
  return prisma.$transaction(
    async (tx) => {
      const comboKey = (pairs: [string, string][]) =>
        pairs.map(([n, v]) => `${n}|${v}`).sort().join("§");

      const existing = await tx.productVariant.findMany({
        where: { productId },
        include: { optionValues: { include: { optionValue: { include: { option: true } } } } },
      });
      const existingByKey = new Map(
        existing.map((v) => [
          comboKey(v.optionValues.map((l) => [l.optionValue.option.name, l.optionValue.value] as [string, string])),
          v,
        ])
      );

      await tx.productImage.deleteMany({ where: { productId } });
      await tx.productSpecification.deleteMany({ where: { productId } });
      // cascades option values + variant links, but NOT the variants themselves
      await tx.productOption.deleteMany({ where: { productId } });

      const product = await tx.product.update({
        where: { id: productId },
        data: {
          title: input.title,
          description: input.description || null,
          categoryId: input.categoryId || null,
          videoUrl: input.videoUrl || null,
          images: { create: input.images.map((img) => ({ url: img.url, isMain: img.isMain, sortOrder: img.sortOrder })) },
          specifications: { create: input.specifications.map((s) => ({ key: s.key, value: s.value, sortOrder: s.sortOrder })) },
        },
      });

      const optionValueMap = new Map<string, string>();
      for (let i = 0; i < input.options.length; i++) {
        const opt = input.options[i];
        const createdOption = await tx.productOption.create({ data: { name: opt.name, sortOrder: i, productId: product.id } });
        for (let j = 0; j < opt.values.length; j++) {
          const val = opt.values[j];
          const createdValue = await tx.productOptionValue.create({ data: { value: val, sortOrder: j, optionId: createdOption.id } });
          optionValueMap.set(`${opt.name}|${val}`, createdValue.id);
        }
      }

      const keptIds = new Set<string>();
      for (const variant of input.variants) {
        const match = existingByKey.get(comboKey(Object.entries(variant.optionValues)));
        let variantId: string;
        if (match && !keptIds.has(match.id)) {
          await tx.productVariant.update({ where: { id: match.id }, data: { price: variant.price, stock: variant.stock } });
          variantId = match.id;
        } else {
          const created = await tx.productVariant.create({ data: { price: variant.price, stock: variant.stock, productId: product.id } });
          variantId = created.id;
        }
        keptIds.add(variantId);

        const optionValueIds = Object.entries(variant.optionValues)
          .map(([name, value]) => optionValueMap.get(`${name}|${value}`))
          .filter((id): id is string => !!id);
        if (optionValueIds.length > 0) {
          await tx.variantOptionValue.createMany({
            data: optionValueIds.map((optionValueId) => ({ variantId, optionValueId })),
          });
        }
      }

      const removed = existing.filter((v) => !keptIds.has(v.id)).map((v) => v.id);
      if (removed.length > 0) await tx.productVariant.deleteMany({ where: { id: { in: removed } } });

      return product.id;
    },
    { timeout: 30000, maxWait: 10000 }
  );
}
