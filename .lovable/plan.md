# Plan: Dynamic Tool Cards from Database with Logo Support

## Overview

Replace the hardcoded tool logos map with database-driven tools. Add a `logo_url` column to the `tools` table, insert all 85 tools from the provided JSON, and update `ToolCard` to use `logo_url` from the database. The existing fallback (first letter) already handles missing logos.

## Steps

### 1. Database Migration

- Add `logo_url` (text, nullable) column to the `tools` table
- Insert all 85 new tools (skipping duplicates by `tool_id`) with:
  - `tool_id`: derived from name (lowercase, clean)
  - `name`: from JSON
  - `category`: mapped appropriately (text, image, video, coding)
  - `price`: default placeholder (e.g. 9.99) -- you can update prices later from Admin
  - `delivery_type`: default `provide_account`
  - `logo_url`: set to `/logos/<clean-name>.svg`
  - `is_active`: true

### 2. Update ToolCard Component

- Remove the hardcoded `toolLogos` map and all local logo imports (perplexity, jasper, capcut, etc.)
- Add `logo_url?: string` to the `Tool` interface
- Use `tool.logo_url` instead of `toolLogos[tool.tool_id]` for the logo source
- Keep existing fallback behavior (shows first letter if logo fails to load)
- Keep all existing 3D tilt, glow, dark UI effects unchanged

### 3. Update Storefront Component

- Include `logo_url` in the select query from `tools` table (already uses `select('*')` so this works automatically)
- Add `logo_url` to the Tool interface mapping

### 4. Logo Files

Since I cannot programmatically download binary files from external websites, I will:

- Keep existing local logos in `src/assets/` working for tools that already have them by mapping old asset paths into the DB `logo_url` field
- For new tools without local logos, the card's built-in fallback (colored first-letter display) will render cleanly
- You can later manually add SVG/PNG files to `/public/logos/` and update the `logo_url` in the admin panel

### Technical Details

**New DB column:**

```sql
ALTER TABLE tools ADD COLUMN logo_url text;
```

**Batch insert** (~70 new tools) with ON CONFLICT DO NOTHING on tool_id to avoid duplicates.

**ToolCard changes:**

- Remove ~15 import lines for local logos
- Remove `toolLogos` record object
- Replace `const logoUrl = toolLogos[tool.tool_id]` with `const logoUrl = tool.logo_url`
- Everything else (colors, glow, 3D, CheckoutDialog) stays identical
- Good plan, but I need one key change: I want REAL logos (from official sites), not fallback letters.
  Update the plan with these constraints:
  1) Official logos source (mandatory)
  - For each tool, resolve officialUrl (official domain).
  - Extract the primary brand logo from the official site (navbar / header logo, or official press/brand kit page).
  - Save that extracted logo URL into tools.logo_url.
  - No third-party logo/icon sites (no simpleicons, svgrepo, wikipedia, etc).
  2) Storage strategy
  - If you cannot download binaries, store the official logo as a direct URL ([https://official-domain/.../logo.svg](https://official-domain/.../logo.svg) or png) in logo_url.
  - Add a safe fallback: if the URL is blocked by CORS/hotlinking, then fallback to local /public/logos/<tool_id>.svg if present, else first-letter.
  3) ToolCard behavior
  - Try tool.logo_url first.
  - If load fails, try `/logos/${tool.tool_id}.svg` automatically.
  - If both fail, use the existing first-letter fallback.
  - Keep all existing 3D tilt/glow UI unchanged.
  4) DB
  - Keep logo_url nullable.
  - Insert tools with tool_id derived from name.
  - Do NOT set placeholder prices unless required; set price = NULL (or 0) and hide price in UI if null.
  Deliverable:
  - Updated migration + seed script
  - Updated ToolCard logic (logo_url -> local fallback -> first letter)
  - tools table filled with ALL tools (deduped)