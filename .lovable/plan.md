
# Tool Status Management System

## Overview
Add a `status` column to the `tools` table with three values (`active`, `coming_soon`, `paused`), then update the storefront cards and admin panel to reflect each status visually and functionally.

---

## 1. Database Migration

Add a `status` text column to the `tools` table:
- Default value: `'active'`
- NOT NULL
- No existing data breaks (all current tools default to `active`)

```sql
ALTER TABLE public.tools ADD COLUMN status text NOT NULL DEFAULT 'active';
```

## 2. Admin Panel Changes (`AdminPage.tsx`)

**Tool interface**: Add `status: string` field.

**Tool form**: Add a status dropdown with options: Active, Coming Soon, Paused. Wire it into `toolForm` state, `openToolForm`, and `saveTool`.

**Tools list**: Replace the simple green/red dot with a color-coded status indicator:
- `active` = green dot
- `coming_soon` = yellow dot + "Coming Soon" label
- `paused` = gray dot + "Paused" label

Replace the current "Activate/Deactivate" toggle button with a status dropdown selector so admins can switch between the three states inline without opening the edit form.

## 3. Storefront Changes (`Storefront.tsx`)

Update the `fetchTools` query to also fetch tools where `status = 'coming_soon'` (currently only fetches `is_active = true`). Paused tools remain hidden from the store.

Change the query from `.eq('is_active', true)` to filtering by status: fetch `active` and `coming_soon` tools.

Pass the `status` field through to the `Tool` interface and into `ToolCard`.

## 4. ToolCard Changes (`ToolCard.tsx`)

**Tool interface**: Add `status?: string` field.

**Coming Soon state** (`status === 'coming_soon'`):
- Show a yellow "Coming Soon" badge (replacing or alongside the tier badge)
- Add a subtle opacity reduction (`opacity-70`) and slight blur overlay on the card
- Replace "Buy Now" button with a "Notify Me" button styled with a yellow/amber gradient
- "Notify Me" button opens a small email input (inline or toast prompt) that inserts into the `subscribers` table with a note, or simply shows a toast confirming interest
- Disable the CheckoutDialog from opening

**Paused state** (`status === 'paused'`):
- Tools with this status are filtered out in Storefront, so no card rendering needed
- As a safety fallback, if rendered, show a gray "Unavailable" badge with full muted styling

**Active state** (`status === 'active'` or undefined):
- No changes, current behavior preserved

## 5. CheckoutDialog Guard

Add a guard at the top of `CheckoutDialog` -- if `tool?.status !== 'active'`, don't render / immediately close. This ensures no checkout can happen for non-active tools regardless of how the dialog is triggered.

## 6. Files Changed

| File | Change |
|------|--------|
| Database migration | Add `status` column |
| `src/pages/AdminPage.tsx` | Status dropdown in tool form + inline status selector in tool list |
| `src/components/Storefront.tsx` | Fetch `coming_soon` tools, pass status to cards |
| `src/components/ToolCard.tsx` | Coming Soon badge, Notify Me button, conditional rendering |
| `src/components/CheckoutDialog.tsx` | Guard against non-active tools |

## 7. What Will NOT Change
- Payment/checkout logic remains untouched
- Stripe integration unaffected
- Existing `is_active` field remains (status supersedes it for storefront display)
- Premium glass dark design maintained -- Coming Soon uses amber/gold tones, Paused uses muted grays
