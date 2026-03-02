

## Plan: Update AI DEALS Platform (Using Existing Routes)

Most of the requested features already exist. This plan covers the actual gaps.

### 1. Update Index Page Copy & CTAs
**File:** `src/pages/Index.tsx`
- Change hero headline from "Powerful AI. Made Safe." to "AI Tools Made Simple — For Students & Creators"
- Update hero subtext to emphasize safe + affordable + guided
- Change CTAs to "Explore Store" → `/store` and "Enter Academy" → `/academy`
- Update trust strip labels to: "No Password Sharing", "Secure Checkout", "Monthly Only", "Privacy-first"
- Newsletter copy update: "Weekly AI tips for students & creators" with CTA "Join the list"

### 2. Add "Learn This Tool" CTA to ToolCard
**File:** `src/components/ToolCard.tsx`
- Add a secondary text link/button below the Buy CTA: "Learn This Tool" → `/academy?tool_id={tool.tool_id}`
- Only show for active tools (not coming soon/paused)

### 3. Academy Deep Linking via Query Param
**File:** `src/pages/Academy.tsx`
- Read `tool_id` from `useSearchParams`
- On load, if `tool_id` is present, filter courses to that tool or auto-select the matching course
- Scroll to the course or open its detail modal automatically

### 4. Dashboard Summary Bar Enhancement
**File:** `src/pages/Dashboard.tsx`
- Add academy courses count to the existing summary bar (currently shows delivered + pending counts)
- Show "Academy Courses: Z" alongside existing stats
- If pending > 0, show inline message: "Activation in progress — you'll see login details here once ready."

### No Database Changes Required
All tables, RLS policies, and edge functions are already in place.

### No New Routes
All changes use existing `/`, `/store`, `/dashboard`, `/academy` routes.

