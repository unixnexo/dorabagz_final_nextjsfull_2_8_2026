/**
 * ============================================================================
 * PAGE: /favorite
 * ============================================================================
 * RENDERING: Server Component shell (auth check + redirect), the list
 * itself is a client component so remove/clear buttons can update instantly
 * without a full page reload.
 *
 * ACCESS: any logged-in user. Favorites require login (no guest favorites).
 *
 * DATA SOURCE: listFavoritesAction() (see src/server/favorite/actions.ts)
 *   output: FavoriteItemDTO[] (see src/types/favorite.ts)
 *     { id, productId, productTitle, productSlug, mainImageUrl,
 *       minPrice, maxPrice, totalStock, createdAt }
 *
 * ACTIONS:
 *   removeFavoriteAction(favoriteId) -> removes one
 *   clearFavoritesAction()           -> removes all
 *
 * UI NOTE FOR DESIGN AGENT: grid/list of product cards (image, title,
 * price range), each with a remove (heart/trash) button, plus a
 * "clear all" button. Each card links to /products/[slug].
 * ============================================================================
 */
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/user/get-current-user";
import { FavoritesList } from "./favorites-list";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "علاقه‌مندی‌ها",
    description: "محصولات مورد علاقه شما در درا بگز.",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function FavoritePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main dir="rtl" style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>علاقه‌مندی‌ها</h1>
      <FavoritesList />
    </main>
  );
}
