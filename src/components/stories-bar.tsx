"use client";

/**
 * ============================================================================
 * COMPONENT: StoriesBar
 * ============================================================================
 * Instagram-style stories bar, per your original spec — shown above the
 * product grid on the home page. Fetches via listActiveStoriesAction()
 * (see src/server/story/actions.ts), which returns stories ALREADY in the
 * correct order (unviewed-first-newest, then viewed-newest) — no client-
 * side sorting needed.
 *
 * DATA SHAPE per story (StoryDTO, src/types/story.ts):
 *   { id, mediaType: "IMAGE"|"VIDEO", mediaUrl, description,
 *     linkedProducts: [{id, title, slug, mainImageUrl}], isViewed,
 *     expiresAt, createdAt }
 *
 * This is a MINIMAL implementation (a horizontal row of circles + a basic
 * full-screen viewer on click) — you said you'd handle exactly how these
 * look/behave in the real frontend, so this just proves the data flow and
 * marks-as-viewed wiring work. Replace freely.
 *
 * markStoryViewedAction(storyId) is called the moment a story opens —
 * upsert-based, safe to call every time, never double-counts (see schema's
 * @@unique([storyId, userId]) on StoryView).
 * ============================================================================
 */
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { listActiveStoriesAction, markStoryViewedAction } from "@/server/story/actions";
import type { StoryDTO } from "@/types/story";

export function StoriesBar() {
  const queryClient = useQueryClient();
  const [openStory, setOpenStory] = useState<StoryDTO | null>(null);

  const { data: stories } = useQuery({
    queryKey: ["active-stories"],
    queryFn: async () => {
      const result = await listActiveStoriesAction();
      return result.success ? result.data : [];
    },
  });

  async function handleOpen(story: StoryDTO) {
    setOpenStory(story);
    if (!story.isViewed) {
      await markStoryViewedAction(story.id);
      queryClient.invalidateQueries({ queryKey: ["active-stories"] });
    }
  }

  if (!stories || stories.length === 0) return null;

  return (
    <div dir="rtl" style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => handleOpen(story)}
            style={{
              flexShrink: 0,
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: story.isViewed ? "2px solid #ccc" : "2px solid #1976d2",
              overflow: "hidden",
              padding: 0,
              background: "#eee",
            }}
          >
            {story.mediaType === "IMAGE" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={story.mediaUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <video src={story.mediaUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </button>
        ))}
      </div>

      {openStory && <StoryViewer story={openStory} onClose={() => setOpenStory(null)} />}
    </div>
  );
}

function StoryViewer({ story, onClose }: { story: StoryDTO; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400, width: "90%" }}>
        {story.mediaType === "IMAGE" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={story.mediaUrl} alt="" style={{ width: "100%" }} />
        ) : (
          <video src={story.mediaUrl} controls autoPlay style={{ width: "100%" }} />
        )}

        {story.description && (
          <p dir="rtl" style={{ color: "#fff", marginTop: 8 }}>
            {story.description}
          </p>
        )}

        {story.linkedProducts.length > 0 && (
          <div dir="rtl" style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {story.linkedProducts.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                style={{ color: "#fff", background: "#1976d2", padding: "4px 8px", borderRadius: 4 }}
              >
                {p.title}
              </Link>
            ))}
          </div>
        )}

        <button onClick={onClose} style={{ marginTop: 16 }}>
          بستن
        </button>
      </div>
    </div>
  );
}
