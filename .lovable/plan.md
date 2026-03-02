
# Restructure AI DEALS into a Multi-Page Brand Platform

## Overview

Transform AI DEALS from a single-page marketplace into a structured brand website targeting parents and students. The homepage will become a trust-focused landing page, and all tools will move to a dedicated `/store` page.

## Page Structure

### 1. Home (`/` - Index.tsx) -- Major Rewrite

Replace the current marketplace homepage with a brand-focused landing page containing these sections:

- **Hero**: Clear headline ("AI Tools Made Safe for Students"), a CTA ("Browse Store"), and trust badge. Reuse the existing cinematic video background and floating icons.
- **Why AI for Students**: 3-column grid with icons explaining how AI helps with studying, creativity, and productivity.
- **Why AI DEALS is Safe**: Trust-focused section highlighting parental controls, no password sharing, curated tools, and 24/7 support.
- **Featured Tools**: Show max 6 featured tools from the database (reuse `FeaturedCarousel` or a static grid). Links to `/store`.
- **For Parents**: Dedicated section with trust messaging -- "We handle accounts so your child doesn't need credit cards," "Curated, safe tools only," etc.
- **Final CTA**: Reuse existing `CTA` component with updated copy pointing to `/store`.

Remove: `Storefront`, `TrustStrip`, `FiltersBar`, `TrustAndFAQ` from homepage.

### 2. Store (`/store` - new StorePage.tsx)

Move the full marketplace experience here:
- Reuse `Storefront` component as-is (it already has the hero, trust strip, filters, categories, FAQ)
- Add `Navbar` and `Footer` wrapping
- This becomes the only page listing all tools

### 3. Academy (`/academy` - existing)

Already exists with courses from the database. Keep as-is -- it already covers beginner guides, tutorials, and progress tracking.

### 4. Blog (`/blog` - new BlogPage.tsx)

Repurpose the existing `ContentHub` (`/content-hub`) into `/blog`:
- Same component, new route
- Update categories to: Students, Parents, AI Tools, Comparisons
- Keep the existing article listing and search functionality
- Remove the old `/content-hub` route (redirect to `/blog`)

### 5. About Us (`/about` - new AboutPage.tsx)

New page with:
- Brand story section ("Founded to make AI accessible and safe for students")
- Mission statement
- Trust statements with icons
- "Why We Focus on Students" section
- Dark premium style matching the rest of the site

### 6. Contact (`/contact` - new ContactPage.tsx)

New page with:
- Simple contact form (Name, Email, Subject, Message) -- client-side only, sends via mailto or stores in database
- Support info (email, response time)
- FAQ link
- Dark premium style

## Navigation Update

Update `Navbar.tsx` nav links from:
```
Store | Academy | Content Hub | Tutorials
```
to:
```
Home | Store | Academy | Blog | About | Contact
```

Update mobile menu to match. Remove the old `/#store` anchor link -- Store is now its own page.

## Footer Update

Replace placeholder links with real routes:
- Product section: Store, Academy, Blog, Dashboard
- Company section: About, Contact
- Legal section: Privacy, Terms (already working)
- Remove dead links (Careers, Press, Pricing, Changelog, etc.)

## Routing Changes in App.tsx

```
/              -> New Home (brand landing)
/store         -> StorePage (full marketplace)
/academy       -> Academy (unchanged)
/blog          -> BlogPage (repurposed ContentHub)
/about         -> AboutPage (new)
/contact       -> ContactPage (new)
/content-hub   -> Redirect to /blog
/resources     -> Remove or redirect to /blog
```

## Technical Details

**Files to create:**
- `src/pages/StorePage.tsx` -- Wrapper around existing `Storefront` component
- `src/pages/AboutPage.tsx` -- New brand story page
- `src/pages/ContactPage.tsx` -- New contact form page
- `src/pages/BlogPage.tsx` -- Wrapper/rename of ContentHub

**Files to modify:**
- `src/pages/Index.tsx` -- Complete rewrite as brand landing page
- `src/components/Navbar.tsx` -- Update nav links
- `src/components/Footer.tsx` -- Fix links to real routes
- `src/App.tsx` -- Add new routes, redirect old ones
- `src/components/Hero.tsx` -- Update copy for student/parent messaging

**Files unchanged:**
- `src/components/Storefront.tsx` -- Reused as-is in StorePage
- `src/components/CheckoutDialog.tsx` -- Checkout logic untouched
- `src/pages/Academy.tsx` -- Already functional
- All UI components, edge functions, database

**No database changes needed.**

## Design Approach

All new pages will follow the existing dark premium aesthetic:
- Deep midnight background with aurora gradients
- Glassmorphism cards with blur effects
- Framer Motion animations
- Inter font family
- Purple/cyan/violet accent palette
- Fully responsive with mobile-first approach
