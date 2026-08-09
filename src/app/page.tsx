// /**
//  * ============================================================================
//  * PAGE: / (home — product listing)
//  * ============================================================================
//  * RENDERING: Server Component for the initial render (SEO — product pages
//  * need to be crawlable/indexable, this was explicitly your requirement).
//  * Search/filter/pagination is done via URL search params (plain GET form),
//  * so results stay linkable/shareable and the page stays server-rendered —
//  * no client JS required for the core browsing flow.
//  *
//  * DATA SOURCE: listProductsAction() (see src/server/product/actions.ts)
//  *   input:  { page?, pageSize?, search?, categoryId?, minPrice?, maxPrice? }
//  *   output: PaginatedResult<ProductListItemDTO> (see src/types/product.ts)
//  *     ProductListItemDTO = {
//  *       id, title, slug, productCode, mainImageUrl, categoryId, categoryTitle,
//  *       isDeleted, createdAt, minPrice, maxPrice, totalStock
//  *     }
//  *
//  * ALSO SHOWS: current login state + links into profile/admin (kept from
//  * Module 1 for easy manual testing — the design agent can drop this part).
//  *
//  * NOTE: the Instagram-style "stories" bar you mentioned for this page is
//  * its own future module — not built yet, will slot in above the product grid.
//  *
//  * UI NOTE FOR DESIGN AGENT: product grid/cards (image, title, price range if
//  * variants differ, stock badge), search box, category filter (2-level,
//  * see CategoryTreeDTO), price range filter, pagination. Each card links to
//  * /products/[slug].
//  * ============================================================================
//  */
// import Link from "next/link";
// import { listProductsAction } from "@/server/product/actions";
// import { getCategoryTreeAction } from "@/server/category/actions";
// import { getCurrentUser } from "@/server/user/get-current-user";

// export default async function HomePage({
//   searchParams,
// }: {
//   searchParams: Promise<{ [key: string]: string | undefined }>;
// }) {
//   const params = await searchParams;
//   const page = params.page ? Number(params.page) : 1;

//   const [productsResult, categoriesResult, user] = await Promise.all([
//     listProductsAction({
//       page,
//       search: params.search,
//       categoryId: params.categoryId,
//       minPrice: params.minPrice,
//       maxPrice: params.maxPrice,
//     }),
//     getCategoryTreeAction(),
//     getCurrentUser(),
//   ]);

//   const products = productsResult.success ? productsResult.data : null;
//   const categories = categoriesResult.success ? categoriesResult.data : [];

//   return (
//     <main dir="rtl" style={{ maxWidth: 900, margin: "40px auto", fontFamily: "sans-serif" }}>
//       <div style={{ marginBottom: 16, fontSize: 14 }}>
//         {user ? (
//           <>
//             وارد شده‌اید به عنوان: {user.phoneNumber} ({user.role}) |{" "}
//             <Link href="/dashboard/profile">پروفایل</Link>
//             {user.role === "ADMIN" && (
//               <>
//                 {" | "}
//                 <Link href="/admin/products">مدیریت محصولات</Link>
//                 {" | "}
//                 <Link href="/admin/categories">مدیریت دسته‌ها</Link>
//                 {" | "}
//                 <Link href="/admin/users">مدیریت کاربران</Link>
//               </>
//             )}
//           </>
//         ) : (
//           <Link href="/logic">ورود / ثبت‌نام</Link>
//         )}
//       </div>

//       <h1>محصولات</h1>

//       <form method="get" style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
//         <input type="text" name="search" placeholder="جستجو..." defaultValue={params.search} />
//         <select name="categoryId" defaultValue={params.categoryId ?? ""}>
//           <option value="">همه دسته‌ها</option>
//           {categories.map((cat) => (
//             <optgroup key={cat.id} label={cat.title}>
//               <option value={cat.id}>{cat.title}</option>
//               {cat.children.map((child) => (
//                 <option key={child.id} value={child.id}>
//                   &nbsp;&nbsp;{child.title}
//                 </option>
//               ))}
//             </optgroup>
//           ))}
//         </select>
//         <input type="number" name="minPrice" placeholder="حداقل قیمت" defaultValue={params.minPrice} />
//         <input type="number" name="maxPrice" placeholder="حداکثر قیمت" defaultValue={params.maxPrice} />
//         <button type="submit">اعمال فیلتر</button>
//       </form>

//       {!products && <p style={{ color: "red" }}>خطا در دریافت محصولات</p>}

//       {products && (
//         <>
//           {products.items.length === 0 && <p>محصولی یافت نشد.</p>}

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
//               gap: 16,
//             }}
//           >
//             {products.items.map((p) => (
//               <Link
//                 key={p.id}
//                 href={`/products/${p.slug}`}
//                 style={{ border: "1px solid #ddd", padding: 12, display: "block", color: "inherit" }}
//               >
//                 {p.mainImageUrl && (
//                   // eslint-disable-next-line @next/next/no-img-element
//                   <img
//                     src={p.mainImageUrl}
//                     alt={p.title}
//                     style={{ width: "100%", height: 140, objectFit: "cover" }}
//                   />
//                 )}
//                 <p>{p.title}</p>
//                 <p>
//                   {p.minPrice === p.maxPrice
//                     ? `${p.minPrice.toLocaleString("fa-IR")} تومان`
//                     : `${p.minPrice.toLocaleString("fa-IR")} - ${p.maxPrice.toLocaleString("fa-IR")} تومان`}
//                 </p>
//                 <p>{p.totalStock > 0 ? `موجودی: ${p.totalStock}` : "ناموجود"}</p>
//               </Link>
//             ))}
//           </div>

//           <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
//             {page > 1 && (
//               <Link href={`/?${new URLSearchParams({ ...params, page: String(page - 1) })}`}>
//                 صفحه قبل
//               </Link>
//             )}
//             <span>
//               صفحه {products.page} از {products.totalPages}
//             </span>
//             {page < products.totalPages && (
//               <Link href={`/?${new URLSearchParams({ ...params, page: String(page + 1) })}`}>
//                 صفحه بعد
//               </Link>
//             )}
//           </div>
//         </>
//       )}
//     </main>
//   );
// }













/**
 * ============================================================================
 * PAGE: / (home — product listing)
 * ============================================================================
 * RENDERING: Server Component for the initial render (SEO — product pages
 * need to be crawlable/indexable, this was explicitly your requirement).
 * Search/filter/pagination is done via URL search params (plain GET form),
 * so results stay linkable/shareable and the page stays server-rendered —
 * no client JS required for the core browsing flow.
 *
 * DATA SOURCE: listProductsAction() (see src/server/product/actions.ts)
 *   input:  { page?, pageSize?, search?, categoryId?, minPrice?, maxPrice? }
 *   output: PaginatedResult<ProductListItemDTO> (see src/types/product.ts)
 *     ProductListItemDTO = {
 *       id, title, slug, productCode, mainImageUrl, categoryId, categoryTitle,
 *       isDeleted, createdAt, minPrice, maxPrice, totalStock
 *     }
 *
 * ALSO SHOWS: current login state + links into profile/admin (kept from
 * Module 1 for easy manual testing — the design agent can drop this part).
 *
 * NOTE: the Instagram-style "stories" bar you mentioned for this page is
 * its own future module — not built yet, will slot in above the product grid.
 *
 * UI NOTE FOR DESIGN AGENT: product grid/cards (image, title, price range if
 * variants differ, stock badge), search box, category filter (2-level,
 * see CategoryTreeDTO), price range filter, pagination. Each card links to
 * /products/[slug].
 * ============================================================================
 */
import Link from "next/link";
import { listProductsAction } from "@/server/product/actions";
import { getCategoryTreeAction } from "@/server/category/actions";
import { getCurrentUser } from "@/server/user/get-current-user";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;

  const [productsResult, categoriesResult, user] = await Promise.all([
    listProductsAction({
      page,
      search: params.search,
      categoryId: params.categoryId,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
    }),
    getCategoryTreeAction(),
    getCurrentUser(),
  ]);

  const products = productsResult.success ? productsResult.data : null;
  const categories = categoriesResult.success ? categoriesResult.data : [];

  return (
    <main dir="rtl" style={{ maxWidth: 900, margin: "40px auto", fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: 16, fontSize: 14 }}>
        {user ? (
          <>
            وارد شده‌اید به عنوان: {user.phoneNumber} ({user.role}) |{" "}
            <Link href="/dashboard/profile">پروفایل</Link>
            {" | "}
            <Link href="/cart">سبد خرید</Link>
            {" | "}
            <Link href="/favorite">علاقه‌مندی‌ها</Link>
            {" | "}
            <Link href="/dashboard/orders">سفارش‌های من</Link>
            {" | "}
            <Link href="/notifications">اعلان‌ها</Link>
            {user.role === "ADMIN" && (
              <>
                {" | "}
                <Link href="/admin/products">مدیریت محصولات</Link>
                {" | "}
                <Link href="/admin/categories">مدیریت دسته‌ها</Link>
                {" | "}
                <Link href="/admin/users">مدیریت کاربران</Link>
                {" | "}
                <Link href="/admin/coupons">مدیریت تخفیف‌ها</Link>
                {" | "}
                <Link href="/admin/orders">مدیریت سفارش‌ها</Link>
              </>
            )}
          </>
        ) : (
          <Link href="/logic">ورود / ثبت‌نام</Link>
        )}
      </div>


      <h1>محصولات</h1>

      <form method="get" style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <input type="text" name="search" placeholder="جستجو..." defaultValue={params.search} />
        <select name="categoryId" defaultValue={params.categoryId ?? ""}>
          <option value="">همه دسته‌ها</option>
          {categories.map((cat) => (
            <optgroup key={cat.id} label={cat.title}>
              <option value={cat.id}>{cat.title}</option>
              {cat.children.map((child) => (
                <option key={child.id} value={child.id}>
                  &nbsp;&nbsp;{child.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <input type="number" name="minPrice" placeholder="حداقل قیمت" defaultValue={params.minPrice} />
        <input type="number" name="maxPrice" placeholder="حداکثر قیمت" defaultValue={params.maxPrice} />
        <button type="submit">اعمال فیلتر</button>
      </form>

      {!products && <p style={{ color: "red" }}>خطا در دریافت محصولات</p>}

      {products && (
        <>
          {products.items.length === 0 && <p>محصولی یافت نشد.</p>}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            {products.items.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                style={{ border: "1px solid #ddd", padding: 12, display: "block", color: "inherit" }}
              >
                {p.mainImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.mainImageUrl}
                    alt={p.title}
                    style={{ width: "100%", height: 140, objectFit: "cover" }}
                  />
                )}
                <p>{p.title}</p>
                <p>
                  {p.minPrice === p.maxPrice
                    ? `${p.minPrice.toLocaleString("fa-IR")} تومان`
                    : `${p.minPrice.toLocaleString("fa-IR")} - ${p.maxPrice.toLocaleString("fa-IR")} تومان`}
                </p>
                <p>{p.totalStock > 0 ? `موجودی: ${p.totalStock}` : "ناموجود"}</p>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
            {page > 1 && (
              <Link href={`/?${new URLSearchParams({ ...params, page: String(page - 1) })}`}>
                صفحه قبل
              </Link>
            )}
            <span>
              صفحه {products.page} از {products.totalPages}
            </span>
            {page < products.totalPages && (
              <Link href={`/?${new URLSearchParams({ ...params, page: String(page + 1) })}`}>
                صفحه بعد
              </Link>
            )}
          </div>
        </>
      )}
    </main>
  );
}


