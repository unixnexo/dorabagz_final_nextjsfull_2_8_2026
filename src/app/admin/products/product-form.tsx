// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import { createProductAction, updateProductAction } from "@/server/product/actions";
// import { getCategoryTreeAction } from "@/server/category/actions";
// import { uploadProductMedia } from "@/lib/upload-client";
// import { generateVariantCombinations, combinationKey } from "./variant-utils";
// import type { ProductDetailDTO } from "@/types/product";

// type ImageItem = { url: string; isMain: boolean; sortOrder: number };
// type SpecItem = { key: string; value: string; sortOrder: number };
// type OptionItem = { name: string; values: string[] };
// type VariantItem = { price: number; stock: number; optionValues: Record<string, string> };

// export function ProductForm({ existing }: { existing?: ProductDetailDTO }) {
//   const router = useRouter();

//   const [title, setTitle] = useState(existing?.title ?? "");
//   const [description, setDescription] = useState(existing?.description ?? "");
//   const [categoryId, setCategoryId] = useState(existing?.categoryId ?? "");
//   const [videoUrl, setVideoUrl] = useState(existing?.videoUrl ?? "");
//   const [images, setImages] = useState<ImageItem[]>(
//     existing?.images.map((i) => ({ url: i.url, isMain: i.isMain, sortOrder: i.sortOrder })) ?? []
//   );
//   const [specs, setSpecs] = useState<SpecItem[]>(
//     existing?.specifications.map((s) => ({ key: s.key, value: s.value, sortOrder: s.sortOrder })) ?? []
//   );
//   const [options, setOptions] = useState<OptionItem[]>(
//     existing?.options.map((o) => ({ name: o.name, values: o.values.map((v) => v.value) })) ?? []
//   );
//   const [variants, setVariants] = useState<VariantItem[]>(
//     existing?.variants.map((v) => ({ price: v.price, stock: v.stock, optionValues: v.optionValues })) ?? [
//       { price: 0, stock: 0, optionValues: {} },
//     ]
//   );

//   const [isUploadingImage, setIsUploadingImage] = useState(false);
//   const [isUploadingVideo, setIsUploadingVideo] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { data: categories } = useQuery({
//     queryKey: ["category-tree"],
//     queryFn: async () => {
//       const result = await getCategoryTreeAction();
//       return result.success ? result.data : [];
//     },
//   });

//   // Whenever options change, regenerate the variant list to match every
//   // combination, but preserve price/stock for combinations that already
//   // existed (matched by their option-value key) so editing one option
//   // doesn't wipe prices the admin already entered.
//   useEffect(() => {
//     const combos = generateVariantCombinations(options);
//     setVariants((prevVariants) => {
//       const prevByKey = new Map(prevVariants.map((v) => [combinationKey(v.optionValues), v]));
//       return combos.map((combo) => {
//         const existingVariant = prevByKey.get(combinationKey(combo));
//         return {
//           price: existingVariant?.price ?? 0,
//           stock: existingVariant?.stock ?? 0,
//           optionValues: combo,
//         };
//       });
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [JSON.stringify(options)]);

//   async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
//     const files = Array.from(e.target.files ?? []);
//     if (files.length === 0) return;
//     if (images.length + files.length > 6) {
//       setError("حداکثر ۱ عکس اصلی + ۵ عکس اضافی مجاز است");
//       return;
//     }
//     setIsUploadingImage(true);
//     for (const file of files) {
//       const result = await uploadProductMedia(file);
//       if ("error" in result) {
//         setError(result.error);
//         continue;
//       }
//       setImages((prev) => [
//         ...prev,
//         { url: result.url, isMain: prev.length === 0, sortOrder: prev.length },
//       ]);
//     }
//     setIsUploadingImage(false);
//   }

//   async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setIsUploadingVideo(true);
//     const result = await uploadProductMedia(file);
//     setIsUploadingVideo(false);
//     if ("error" in result) {
//       setError(result.error);
//       return;
//     }
//     setVideoUrl(result.url);
//   }

//   function setMainImage(index: number) {
//     setImages((prev) => prev.map((img, i) => ({ ...img, isMain: i === index })));
//   }

//   function removeImage(index: number) {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//   }

//   function addSpec() {
//     setSpecs((prev) => [...prev, { key: "", value: "", sortOrder: prev.length }]);
//   }
//   function updateSpec(index: number, field: "key" | "value", value: string) {
//     setSpecs((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
//   }
//   function removeSpec(index: number) {
//     setSpecs((prev) => prev.filter((_, i) => i !== index));
//   }

//   function addOption() {
//     setOptions((prev) => [...prev, { name: "", values: [""] }]);
//   }
//   function updateOptionName(index: number, name: string) {
//     setOptions((prev) => prev.map((o, i) => (i === index ? { ...o, name } : o)));
//   }
//   function updateOptionValue(optIndex: number, valIndex: number, value: string) {
//     setOptions((prev) =>
//       prev.map((o, i) =>
//         i === optIndex ? { ...o, values: o.values.map((v, j) => (j === valIndex ? value : v)) } : o
//       )
//     );
//   }
//   function addOptionValue(optIndex: number) {
//     setOptions((prev) => prev.map((o, i) => (i === optIndex ? { ...o, values: [...o.values, ""] } : o)));
//   }
//   function removeOption(index: number) {
//     setOptions((prev) => prev.filter((_, i) => i !== index));
//   }

//   function updateVariantField(index: number, field: "price" | "stock", value: number) {
//     setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
//   }

//   const flatCategories = useMemo(() => {
//     if (!categories) return [];
//     const flat: { id: string; label: string }[] = [];
//     for (const cat of categories) {
//       flat.push({ id: cat.id, label: cat.title });
//       for (const child of cat.children) {
//         flat.push({ id: child.id, label: `— ${child.title}` });
//       }
//     }
//     return flat;
//   }, [categories]);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);
//     setIsSubmitting(true);

//     const payload = {
//       title,
//       description: description || undefined,
//       categoryId: categoryId || null,
//       videoUrl: videoUrl || null,
//       images,
//       specifications: specs,
//       options,
//       variants,
//     };

//     const result = existing
//       ? await updateProductAction({ id: existing.id, ...payload })
//       : await createProductAction(payload);

//     setIsSubmitting(false);
//     if (!result.success) {
//       setError(result.error);
//       return;
//     }
//     router.push("/admin/products");
//     router.refresh();
//   }

//   return (
//     <form onSubmit={handleSubmit} style={{ maxWidth: 700 }}>
//       <label htmlFor="title">عنوان</label>
//       <input
//         id="title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
//       />

//       <label htmlFor="description">توضیحات</label>
//       <textarea
//         id="description"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         rows={4}
//         style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
//       />

//       <label htmlFor="category">دسته‌بندی</label>
//       <select
//         id="category"
//         value={categoryId}
//         onChange={(e) => setCategoryId(e.target.value)}
//         style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
//       >
//         <option value="">بدون دسته</option>
//         {flatCategories.map((c) => (
//           <option key={c.id} value={c.id}>
//             {c.label}
//           </option>
//         ))}
//       </select>

//       {/* --- Images --- */}
//       <fieldset style={{ margin: "16px 0", padding: 12 }}>
//         <legend>تصاویر (حداکثر ۱ اصلی + ۵ اضافی)</legend>
//         <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
//         {isUploadingImage && <p>در حال آپلود...</p>}
//         <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
//           {images.map((img, i) => (
//             <div key={img.url} style={{ textAlign: "center" }}>
//               {/* eslint-disable-next-line @next/next/no-img-element */}
//               <img
//                 src={img.url}
//                 alt=""
//                 style={{
//                   width: 80,
//                   height: 80,
//                   objectFit: "cover",
//                   border: img.isMain ? "2px solid blue" : "1px solid #ddd",
//                 }}
//               />
//               <div>
//                 <button type="button" onClick={() => setMainImage(i)}>
//                   {img.isMain ? "اصلی" : "انتخاب به عنوان اصلی"}
//                 </button>
//                 <button type="button" onClick={() => removeImage(i)}>
//                   حذف
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </fieldset>

//       {/* --- Video --- */}
//       <fieldset style={{ margin: "16px 0", padding: 12 }}>
//         <legend>ویدیو (اختیاری، حداکثر ۳۰ ثانیه، حداکثر ۲۰ مگابایت)</legend>
//         <input type="file" accept="video/*" onChange={handleVideoUpload} />
//         {isUploadingVideo && <p>در حال آپلود...</p>}
//         {videoUrl && (
//           <video controls style={{ width: 200, display: "block", marginTop: 8 }}>
//             <source src={videoUrl} />
//           </video>
//         )}
//       </fieldset>

//       {/* --- Specifications --- */}
//       <fieldset style={{ margin: "16px 0", padding: 12 }}>
//         <legend>مشخصات فنی (کلید/مقدار)</legend>
//         {specs.map((spec, i) => (
//           <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
//             <input
//               placeholder="کلید (مثلا جنس بدنه)"
//               value={spec.key}
//               onChange={(e) => updateSpec(i, "key", e.target.value)}
//             />
//             <input
//               placeholder="مقدار (مثلا آلومینیوم)"
//               value={spec.value}
//               onChange={(e) => updateSpec(i, "value", e.target.value)}
//             />
//             <button type="button" onClick={() => removeSpec(i)}>
//               حذف
//             </button>
//           </div>
//         ))}
//         <button type="button" onClick={addSpec}>
//           + افزودن مشخصه
//         </button>
//       </fieldset>

//       {/* --- Options (dynamic: Size, Color, etc.) --- */}
//       <fieldset style={{ margin: "16px 0", padding: 12 }}>
//         <legend>گزینه‌ها (مثلا سایز، رنگ) — اختیاری</legend>
//         {options.map((opt, optIndex) => (
//           <div key={optIndex} style={{ border: "1px solid #ddd", padding: 8, marginBottom: 8 }}>
//             <input
//               placeholder="نام گزینه (مثلا Size)"
//               value={opt.name}
//               onChange={(e) => updateOptionName(optIndex, e.target.value)}
//             />
//             <button type="button" onClick={() => removeOption(optIndex)} style={{ marginRight: 8 }}>
//               حذف گزینه
//             </button>
//             <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
//               {opt.values.map((val, valIndex) => (
//                 <input
//                   key={valIndex}
//                   placeholder="مقدار (مثلا SM)"
//                   value={val}
//                   onChange={(e) => updateOptionValue(optIndex, valIndex, e.target.value)}
//                 />
//               ))}
//               <button type="button" onClick={() => addOptionValue(optIndex)}>
//                 + مقدار
//               </button>
//             </div>
//           </div>
//         ))}
//         <button type="button" onClick={addOption}>
//           + افزودن گزینه جدید
//         </button>
//       </fieldset>

//       {/* --- Variants (auto-generated from options) --- */}
//       <fieldset style={{ margin: "16px 0", padding: 12 }}>
//         <legend>انواع محصول (قیمت و موجودی) — به صورت خودکار از گزینه‌ها ساخته می‌شود</legend>
//         <table border={1} cellPadding={6} style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               <th>ترکیب</th>
//               <th>قیمت (تومن)</th>
//               <th>موجودی</th>
//             </tr>
//           </thead>
//           <tbody>
//             {variants.map((v, i) => (
//               <tr key={i}>
//                 <td>
//                   {Object.keys(v.optionValues).length === 0
//                     ? "بدون گزینه (تک نوع)"
//                     : Object.entries(v.optionValues)
//                         .map(([k, val]) => `${k}: ${val}`)
//                         .join(" / ")}
//                 </td>
//                 <td>
//                   <input
//                     type="number"
//                     value={v.price}
//                     onChange={(e) => updateVariantField(i, "price", Number(e.target.value))}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="number"
//                     value={v.stock}
//                     onChange={(e) => updateVariantField(i, "stock", Number(e.target.value))}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </fieldset>

//       <button type="submit" disabled={isSubmitting}>
//         {isSubmitting ? "در حال ذخیره..." : existing ? "ذخیره تغییرات" : "ایجاد محصول"}
//       </button>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </form>
//   );
// }



















// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import { createProductAction, updateProductAction } from "@/server/product/actions";
// import { getCategoryTreeAction } from "@/server/category/actions";
// import { uploadProductMedia } from "@/lib/upload-client";
// import { generateVariantCombinations, combinationKey } from "./variant-utils";
// import type { ProductDetailDTO } from "@/types/product";
// import { FormStepIndicator } from "@/components/admin/products/form-step-indicator";
// import { FormStepFooter } from "@/components/admin/products/form-step-footer";
// import { BasicInfoStep } from "@/components/admin/products/basic-info-step";
// import { MediaStep } from "@/components/admin/products/media-step";
// import { SpecsStep } from "@/components/admin/products/specs-step";
// import { OptionsStep } from "@/components/admin/products/options-step";
// import { PricingStep } from "@/components/admin/products/pricing-step";
// import { FORM_STEPS, ImageItem, OptionItem, SpecItem, VariantItem } from "@/components/admin/products/product-form-types";

// export function ProductForm({ existing }: { existing?: ProductDetailDTO }) {
//   const router = useRouter();

//   const [stepIndex, setStepIndex] = useState(0);
//   const [furthestReachedIndex, setFurthestReachedIndex] = useState(0);

//   const [title, setTitle] = useState(existing?.title ?? "");
//   const [description, setDescription] = useState(existing?.description ?? "");
//   const [categoryId, setCategoryId] = useState(existing?.categoryId ?? "");
//   const [videoUrl, setVideoUrl] = useState(existing?.videoUrl ?? "");
//   const [images, setImages] = useState<ImageItem[]>(
//     existing?.images.map((i) => ({ url: i.url, isMain: i.isMain, sortOrder: i.sortOrder })) ?? []
//   );
//   const [specs, setSpecs] = useState<SpecItem[]>(
//     existing?.specifications.map((s) => ({ key: s.key, value: s.value, sortOrder: s.sortOrder })) ?? []
//   );
//   const [options, setOptions] = useState<OptionItem[]>(
//     existing?.options.map((o) => ({ name: o.name, values: o.values.map((v) => v.value) })) ?? []
//   );
//   const [variants, setVariants] = useState<VariantItem[]>(
//     existing?.variants.map((v) => ({ price: v.price, stock: v.stock, optionValues: v.optionValues })) ?? [
//       { price: 0, stock: 0, optionValues: {} },
//     ]
//   );

//   const [isUploadingImage, setIsUploadingImage] = useState(false);
//   const [isUploadingVideo, setIsUploadingVideo] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { data: categories } = useQuery({
//     queryKey: ["category-tree"],
//     queryFn: async () => {
//       const result = await getCategoryTreeAction();
//       return result.success ? result.data : [];
//     },
//   });

//   // Whenever options change, regenerate the variant list to match every
//   // combination, but preserve price/stock for combinations that already
//   // existed (matched by their option-value key) so editing one option
//   // doesn't wipe prices the admin already entered.
//   useEffect(() => {
//     const combos = generateVariantCombinations(options);
//     setVariants((prevVariants) => {
//       const prevByKey = new Map(prevVariants.map((v) => [combinationKey(v.optionValues), v]));
//       return combos.map((combo) => {
//         const existingVariant = prevByKey.get(combinationKey(combo));
//         return {
//           price: existingVariant?.price ?? 0,
//           stock: existingVariant?.stock ?? 0,
//           optionValues: combo,
//         };
//       });
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [JSON.stringify(options)]);

//   // Options that currently have at least one non-empty value — this is
//   // what a variant must supply one value for, and what the picker sheet
//   // renders sections for. Options left blank by the admin (empty name or
//   // no values yet) are ignored everywhere variants are concerned.
//   const definedOptions = useMemo(
//     () => options.filter((o) => o.name.trim() && o.values.some((v) => v.trim())),
//     [options]
//   );

//   const existingVariantKeys = useMemo(
//     () => new Set(variants.map((v) => combinationKey(v.optionValues))),
//     [variants]
//   );

//   function addVariant(optionValues: Record<string, string>) {
//     setVariants((prev) => [...prev, { price: 0, stock: 0, optionValues }]);
//   }

//   function removeVariant(index: number) {
//     setVariants((prev) => prev.filter((_, i) => i !== index));
//   }

//   // If an option is renamed/removed after variants already reference it,
//   // those variants would silently point at a stale option name. Strip any
//   // variant option-values whose key no longer matches a defined option,
//   // and drop variants that end up with zero option values as a result
//   // (unless there are no defined options at all, i.e. a single-variant
//   // product with no options).
//   useEffect(() => {
//     const definedNames = new Set(definedOptions.map((o) => o.name));
//     setVariants((prev) => {
//       if (definedNames.size === 0) return prev;
//       return prev
//         .map((v) => ({
//           ...v,
//           optionValues: Object.fromEntries(
//             Object.entries(v.optionValues).filter(([k]) => definedNames.has(k))
//           ),
//         }))
//         .filter((v) => Object.keys(v.optionValues).length > 0);
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [definedOptions.map((o) => o.name).join("|")]);



//   async function handleImageFilesSelected(files: File[]) {
//     if (images.length + files.length > 6) {
//       setError("حداکثر ۱ عکس اصلی + ۵ عکس اضافی مجاز است");
//       return;
//     }
//     setIsUploadingImage(true);
//     for (const file of files) {
//       const result = await uploadProductMedia(file);
//       if ("error" in result) {
//         setError(result.error);
//         continue;
//       }
//       setImages((prev) => [
//         ...prev,
//         { url: result.url, isMain: prev.length === 0, sortOrder: prev.length },
//       ]);
//     }
//     setIsUploadingImage(false);
//   }

//   async function handleVideoFileSelected(file: File) {
//     setIsUploadingVideo(true);
//     const result = await uploadProductMedia(file);
//     setIsUploadingVideo(false);
//     if ("error" in result) {
//       setError(result.error);
//       return;
//     }
//     setVideoUrl(result.url);
//   }

//   function setMainImage(index: number) {
//     setImages((prev) => prev.map((img, i) => ({ ...img, isMain: i === index })));
//   }

//   function removeImage(index: number) {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//   }

//   function addSpec() {
//     setSpecs((prev) => [...prev, { key: "", value: "", sortOrder: prev.length }]);
//   }
//   function updateSpec(index: number, field: "key" | "value", value: string) {
//     setSpecs((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
//   }
//   function removeSpec(index: number) {
//     setSpecs((prev) => prev.filter((_, i) => i !== index));
//   }

//   function addOption() {
//     setOptions((prev) => [...prev, { name: "", values: [""] }]);
//   }
//   function updateOptionName(index: number, name: string) {
//     setOptions((prev) => prev.map((o, i) => (i === index ? { ...o, name } : o)));
//   }
//   function updateOptionValue(optIndex: number, valIndex: number, value: string) {
//     setOptions((prev) =>
//       prev.map((o, i) =>
//         i === optIndex ? { ...o, values: o.values.map((v, j) => (j === valIndex ? value : v)) } : o
//       )
//     );
//   }
//   function addOptionValue(optIndex: number) {
//     setOptions((prev) => prev.map((o, i) => (i === optIndex ? { ...o, values: [...o.values, ""] } : o)));
//   }
//   function removeOptionValue(optIndex: number, valIndex: number) {
//     setOptions((prev) =>
//       prev.map((o, i) =>
//         i === optIndex ? { ...o, values: o.values.filter((_, j) => j !== valIndex) } : o
//       )
//     );
//   }
//   function removeOption(index: number) {
//     setOptions((prev) => prev.filter((_, i) => i !== index));
//   }

//   function updateVariantField(index: number, field: "price" | "stock", value: number) {
//     setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
//   }

//   const flatCategories = useMemo(() => {
//     if (!categories) return [];
//     const flat: { id: string; label: string }[] = [];
//     for (const cat of categories) {
//       flat.push({ id: cat.id, label: cat.title });
//       for (const child of cat.children) {
//         flat.push({ id: child.id, label: `— ${child.title}` });
//       }
//     }
//     return flat;
//   }, [categories]);

//   // Per-step validation: what blocks moving forward from the current step.
//   const currentStepKey = FORM_STEPS[stepIndex].key;
//   const nextDisabled = useMemo(() => {
//     if (currentStepKey === "basic") return title.trim().length === 0;
//     // if (currentStepKey === "pricing") return variants.some((v) => v.price <= 0);
//     if (currentStepKey === "pricing")
//       return variants.length === 0 || variants.some((v) => v.price <= 0);
//     return false;
//   }, [currentStepKey, title, variants]);

//   const isFirstStep = stepIndex === 0;
//   const isLastStep = stepIndex === FORM_STEPS.length - 1;

//   function goToStep(index: number) {
//     if (index > furthestReachedIndex) return;
//     setError(null);
//     setStepIndex(index);
//   }

//   function handleBack() {
//     if (isFirstStep) return;
//     setError(null);
//     setStepIndex((i) => i - 1);
//   }

//   async function handleNext() {
//     if (nextDisabled) return;

//     if (!isLastStep) {
//       const next = stepIndex + 1;
//       setStepIndex(next);
//       setFurthestReachedIndex((f) => Math.max(f, next));
//       setError(null);
//       return;
//     }

//     await handleSubmit();
//   }

//   async function handleSubmit() {
//     setError(null);
//     setIsSubmitting(true);

//     const payload = {
//       title,
//       description: description || undefined,
//       categoryId: categoryId || null,
//       videoUrl: videoUrl || null,
//       images,
//       specifications: specs,
//       options,
//       variants,
//     };

//     const result = existing
//       ? await updateProductAction({ id: existing.id, ...payload })
//       : await createProductAction(payload);

//     setIsSubmitting(false);
//     if (!result.success) {
//       setError(result.error);
//       return;
//     }
//     router.push("/admin/products");
//     router.refresh();
//   }

//   return (
//     <div className="pb-4">
//       <FormStepIndicator
//         currentIndex={stepIndex}
//         furthestReachedIndex={furthestReachedIndex}
//         onStepClick={goToStep}
//       />

//       {currentStepKey === "basic" && (
//         <BasicInfoStep
//           title={title}
//           description={description}
//           categoryId={categoryId}
//           flatCategories={flatCategories}
//           onTitleChange={setTitle}
//           onDescriptionChange={setDescription}
//           onCategoryChange={setCategoryId}
//         />
//       )}

//       {currentStepKey === "media" && (
//         <MediaStep
//           images={images}
//           videoUrl={videoUrl}
//           isUploadingImage={isUploadingImage}
//           isUploadingVideo={isUploadingVideo}
//           onImageFilesSelected={handleImageFilesSelected}
//           onSetMainImage={setMainImage}
//           onRemoveImage={removeImage}
//           onVideoFileSelected={handleVideoFileSelected}
//           onRemoveVideo={() => setVideoUrl("")}
//         />
//       )}

//       {currentStepKey === "specs" && (
//         <SpecsStep
//           specs={specs}
//           onAdd={addSpec}
//           onUpdate={updateSpec}
//           onRemove={removeSpec}
//         />
//       )}

//       {currentStepKey === "options" && (
//         <OptionsStep
//           options={options}
//           onAddOption={addOption}
//           onUpdateOptionName={updateOptionName}
//           onUpdateOptionValue={updateOptionValue}
//           onAddOptionValue={addOptionValue}
//           onRemoveOptionValue={removeOptionValue}
//           onRemoveOption={removeOption}
//         />
//       )}

//       {/* {currentStepKey === "pricing" && (
//         <PricingStep variants={variants} onFieldChange={updateVariantField} />
//       )} */}

//       {currentStepKey === "pricing" && (
//         <PricingStep
//           variants={variants}
//           definedOptions={definedOptions}
//           existingVariantKeys={existingVariantKeys}
//           onFieldChange={updateVariantField}
//           onAddVariant={addVariant}
//           onRemoveVariant={removeVariant}
//         />
//       )}

//       {error && (
//         <p className="mt-4 rounded-2xl bg-[#FF3B30]/10 px-3.5 py-2.5 text-[12.5px] font-medium text-[#FF3B30]">
//           {error}
//         </p>
//       )}

//       <FormStepFooter
//         isFirstStep={isFirstStep}
//         isLastStep={isLastStep}
//         isSubmitting={isSubmitting}
//         nextDisabled={nextDisabled}
//         onBack={handleBack}
//         onNext={handleNext}
//       />
//     </div>
//   );
// }











"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { createProductAction, updateProductAction } from "@/server/product/actions";
import { getCategoryTreeAction } from "@/server/category/actions";
import { uploadProductMedia } from "@/lib/upload-client";
import { combinationKey } from "./variant-utils";
import type { ProductDetailDTO } from "@/types/product";
import { FormStepIndicator } from "@/components/admin/products/form-step-indicator";
import { FormStepFooter } from "@/components/admin/products/form-step-footer";
import { BasicInfoStep } from "@/components/admin/products/basic-info-step";
import { MediaStep } from "@/components/admin/products/media-step";
import { SpecsStep } from "@/components/admin/products/specs-step";
import { OptionsStep } from "@/components/admin/products/options-step";
import { PricingStep } from "@/components/admin/products/pricing-step";
import { FORM_STEPS, ImageItem, OptionItem, SpecItem, VariantItem } from "@/components/admin/products/product-form-types";
import toast from "react-hot-toast";

export function ProductForm({ existing }: { existing?: ProductDetailDTO }) {
  const router = useRouter();

  const [stepIndex, setStepIndex] = useState(0);
  const [furthestReachedIndex, setFurthestReachedIndex] = useState(0);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [categoryId, setCategoryId] = useState(existing?.categoryId ?? "");
  const [videoUrl, setVideoUrl] = useState(existing?.videoUrl ?? "");
  const [images, setImages] = useState<ImageItem[]>(
    existing?.images.map((i) => ({ url: i.url, isMain: i.isMain, sortOrder: i.sortOrder })) ?? []
  );
  const [specs, setSpecs] = useState<SpecItem[]>(
    existing?.specifications.map((s) => ({ key: s.key, value: s.value, sortOrder: s.sortOrder })) ?? []
  );
  const [options, setOptions] = useState<OptionItem[]>(
    existing?.options.map((o) => ({ name: o.name, values: o.values.map((v) => v.value) })) ?? []
  );
  // Starts empty on purpose — variants are only ever added manually via
  // the "add combination" sheet (or the no-options "add price" button in
  // PricingStep). Nothing auto-generates them anymore.
  const [variants, setVariants] = useState<VariantItem[]>(
    existing?.variants.map((v) => ({ price: v.price, stock: v.stock, optionValues: v.optionValues })) ?? []
  );

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const { data: categories } = useQuery({
  const {
    data: categories,
    isError: categoriesError,
    error: categoriesQueryError,
  } = useQuery({
    queryKey: ["category-tree"],
    // queryFn: async () => {
    //   const result = await getCategoryTreeAction();
    //   return result.success ? result.data : [];
    // },
    queryFn: async () => {
      const result = await getCategoryTreeAction();

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });

  useEffect(() => {
    if (categoriesError) {
      toast.error(
        categoriesQueryError?.message ||
        "گرفتن دسته‌بندی‌ها با مشکل روبه‌رو شد."
      );
    }
  }, [categoriesError, categoriesQueryError]);

  // Options that currently have at least one non-empty value — this is
  // what a variant must supply one value for, and what the picker sheet
  // renders sections for. Options left blank by the admin (empty name or
  // no values yet) are ignored everywhere variants are concerned.
  const definedOptions = useMemo(
    () => options.filter((o) => o.name.trim() && o.values.some((v) => v.trim())),
    [options]
  );

  const existingVariantKeys = useMemo(
    () => new Set(variants.map((v) => combinationKey(v.optionValues))),
    [variants]
  );

  function addVariant(optionValues: Record<string, string>) {
    setVariants((prev) => [...prev, { price: 0, stock: 0, optionValues }]);
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  // If an option is renamed/removed after variants already reference it,
  // those variants would silently point at a stale option name. Strip any
  // variant option-values whose key no longer matches a defined option,
  // and drop variants that end up with zero option values as a result
  // (unless there are no defined options at all, i.e. a single-variant
  // product with no options).
  useEffect(() => {
    const definedNames = new Set(definedOptions.map((o) => o.name));
    setVariants((prev) => {
      if (definedNames.size === 0) return prev;
      return prev
        .map((v) => ({
          ...v,
          optionValues: Object.fromEntries(
            Object.entries(v.optionValues).filter(([k]) => definedNames.has(k))
          ),
        }))
        .filter((v) => Object.keys(v.optionValues).length > 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [definedOptions.map((o) => o.name).join("|")]);

  // async function handleImageFilesSelected(files: File[]) {
  //   if (images.length + files.length > 6) {
  //     setError("حداکثر ۱ عکس اصلی + ۵ عکس اضافی مجاز است");
  //     return;
  //   }
  //   setIsUploadingImage(true);
  //   for (const file of files) {
  //     const result = await uploadProductMedia(file);
  //     if ("error" in result) {
  //       setError(result.error);
  //       continue;
  //     }
  //     setImages((prev) => [
  //       ...prev,
  //       { url: result.url, isMain: prev.length === 0, sortOrder: prev.length },
  //     ]);
  //   }
  //   setIsUploadingImage(false);
  // }

  async function handleImageFilesSelected(files: File[]) {
    if (images.length + files.length > 6) {
      const message = "حداکثر ۱ عکس اصلی و ۵ عکس اضافی می‌تونی اضافه کنی.";
      setError(message);
      toast.error(message);
      return;
    }

    setIsUploadingImage(true);

    try {
      for (const file of files) {
        const result = await uploadProductMedia(file);

        if ("error" in result) {
          setError(result.error);
          toast.error(result.error || "آپلود عکس انجام نشد.");
          continue;
        }

        setImages((prev) => [
          ...prev,
          {
            url: result.url,
            isMain: prev.length === 0,
            sortOrder: prev.length,
          },
        ]);
      }
    } catch {
      setError("آپلود عکس با مشکل روبه‌رو شد.");
      toast.error("آپلود عکس با مشکل روبه‌رو شد.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  // async function handleVideoFileSelected(file: File) {
  //   setIsUploadingVideo(true);
  //   const result = await uploadProductMedia(file);
  //   setIsUploadingVideo(false);
  //   if ("error" in result) {
  //     setError(result.error);
  //     return;
  //   }
  //   setVideoUrl(result.url);
  // }

  async function handleVideoFileSelected(file: File) {
    setIsUploadingVideo(true);
    setError(null);

    try {
      const result = await uploadProductMedia(file);

      if ("error" in result) {
        setError(result.error);
        toast.error(result.error || "آپلود ویدیو انجام نشد.");
        return;
      }

      setVideoUrl(result.url);
    } catch {
      setError("آپلود ویدیو با مشکل روبه‌رو شد.");
      toast.error("آپلود ویدیو با مشکل روبه‌رو شد.");
    } finally {
      setIsUploadingVideo(false);
    }
  }

  function setMainImage(index: number) {
    setImages((prev) => prev.map((img, i) => ({ ...img, isMain: i === index })));
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function addSpec() {
    setSpecs((prev) => [...prev, { key: "", value: "", sortOrder: prev.length }]);
  }
  function updateSpec(index: number, field: "key" | "value", value: string) {
    setSpecs((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }
  function removeSpec(index: number) {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  }

  function addOption() {
    setOptions((prev) => [...prev, { name: "", values: [""] }]);
  }
  function updateOptionName(index: number, name: string) {
    setOptions((prev) => prev.map((o, i) => (i === index ? { ...o, name } : o)));
  }
  function updateOptionValue(optIndex: number, valIndex: number, value: string) {
    setOptions((prev) =>
      prev.map((o, i) =>
        i === optIndex ? { ...o, values: o.values.map((v, j) => (j === valIndex ? value : v)) } : o
      )
    );
  }
  function addOptionValue(optIndex: number) {
    setOptions((prev) => prev.map((o, i) => (i === optIndex ? { ...o, values: [...o.values, ""] } : o)));
  }
  function removeOptionValue(optIndex: number, valIndex: number) {
    setOptions((prev) =>
      prev.map((o, i) =>
        i === optIndex ? { ...o, values: o.values.filter((_, j) => j !== valIndex) } : o
      )
    );
  }
  function removeOption(index: number) {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  }

  function updateVariantField(index: number, field: "price" | "stock", value: number) {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  }

  const flatCategories = useMemo(() => {
    if (!categories) return [];
    const flat: { id: string; label: string }[] = [];
    for (const cat of categories) {
      flat.push({ id: cat.id, label: cat.title });
      for (const child of cat.children) {
        flat.push({ id: child.id, label: `— ${child.title}` });
      }
    }
    return flat;
  }, [categories]);

  // Per-step validation: what blocks moving forward from the current step.
  const currentStepKey = FORM_STEPS[stepIndex].key;
  const nextDisabled = useMemo(() => {
    if (currentStepKey === "basic") return title.trim().length === 0;
    if (currentStepKey === "pricing")
      return variants.length === 0 || variants.some((v) => v.price <= 0);
    return false;
  }, [currentStepKey, title, variants]);

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === FORM_STEPS.length - 1;

  function goToStep(index: number) {
    if (index > furthestReachedIndex) return;
    setError(null);
    setStepIndex(index);
  }

  function handleBack() {
    if (isFirstStep) return;
    setError(null);
    setStepIndex((i) => i - 1);
  }

  async function handleNext() {
    if (nextDisabled) return;

    if (!isLastStep) {
      const next = stepIndex + 1;
      setStepIndex(next);
      setFurthestReachedIndex((f) => Math.max(f, next));
      setError(null);
      return;
    }

    await handleSubmit();
  }

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);

    const payload = {
      title,
      description: description || undefined,
      categoryId: categoryId || null,
      videoUrl: videoUrl || null,
      images,
      specifications: specs,
      options,
      variants,
    };

    const result = existing
      ? await updateProductAction({ id: existing.id, ...payload })
      : await createProductAction(payload);

    // setIsSubmitting(false);
    // if (!result.success) {
    //   setError(result.error);
    //   return;
    // }
    // router.push("/admin/products");
    // router.refresh();

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      toast.error(result.error || "ذخیره محصول انجام نشد.");
      return;
    }

    toast.success(
      existing
        ? "محصول با موفقیت ویرایش شد."
        : "محصول با موفقیت ساخته شد."
    );

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="pb-4">
      <FormStepIndicator
        currentIndex={stepIndex}
        furthestReachedIndex={furthestReachedIndex}
        onStepClick={goToStep}
      />

      {currentStepKey === "basic" && (
        <BasicInfoStep
          title={title}
          description={description}
          categoryId={categoryId}
          flatCategories={flatCategories}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onCategoryChange={setCategoryId}
        />
      )}

      {currentStepKey === "media" && (
        <MediaStep
          images={images}
          videoUrl={videoUrl}
          isUploadingImage={isUploadingImage}
          isUploadingVideo={isUploadingVideo}
          onImageFilesSelected={handleImageFilesSelected}
          onSetMainImage={setMainImage}
          onRemoveImage={removeImage}
          onVideoFileSelected={handleVideoFileSelected}
          onRemoveVideo={() => setVideoUrl("")}
        />
      )}

      {currentStepKey === "specs" && (
        <SpecsStep
          specs={specs}
          onAdd={addSpec}
          onUpdate={updateSpec}
          onRemove={removeSpec}
        />
      )}

      {currentStepKey === "options" && (
        <OptionsStep
          options={options}
          onAddOption={addOption}
          onUpdateOptionName={updateOptionName}
          onUpdateOptionValue={updateOptionValue}
          onAddOptionValue={addOptionValue}
          onRemoveOptionValue={removeOptionValue}
          onRemoveOption={removeOption}
        />
      )}

      {currentStepKey === "pricing" && (
        <PricingStep
          variants={variants}
          definedOptions={definedOptions}
          existingVariantKeys={existingVariantKeys}
          onFieldChange={updateVariantField}
          onAddVariant={addVariant}
          onRemoveVariant={removeVariant}
        />
      )}

      {error && (
        <p className="mt-4 rounded-2xl bg-[#FF3B30]/10 px-3.5 py-2.5 text-[12.5px] font-medium text-[#FF3B30]">
          {error}
        </p>
      )}

      <FormStepFooter
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        isSubmitting={isSubmitting}
        nextDisabled={nextDisabled}
        onBack={handleBack}
        onNext={handleNext}
      />
    </div>
  );
}
