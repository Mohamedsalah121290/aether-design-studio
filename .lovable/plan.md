

# Redesign Product Card (ToolCard)

## What changes
Simplify and modernize the ToolCard component to match a clean, dark card aesthetic with a vibrant blue "Buy Now" button.

## Visual Changes

### Card Container
- Background: Solid dark (`#121212`) instead of complex layered gradients
- Border: 1px subtle border (`rgba(255,255,255,0.08)`) with a faint inner glow via `inset` box-shadow
- Corner radius: `14px` (between the requested 12-16px)
- Padding: Uniform `24px`
- Shadow: Subtle outer shadow (`0 4px 24px rgba(0,0,0,0.5)`)
- Remove the bloom glow layer, gradient border wrapper, and inner highlight overlay -- simplify to a single card `div`

### Hover Effect
- Keep the subtle lift (`hover:-translate-y-1`) but remove `hover:scale-[1.02]` for a cleaner feel
- Border brightens slightly on hover (`rgba(255,255,255,0.14)`)

### Logo
- Keep the 56px logo capsule in the top-left, retain existing fallback logic
- Simplify the capsule background to a flat `rgba(255,255,255,0.06)` with border

### Typography
- Title: White (`#fff`), bold, `text-lg` -- keep as-is
- Subtitle ("Monthly Access"): `text-xs`, muted grey (`#888`) -- simplify from HSL
- Price: Bump to `text-xl font-bold text-white` for prominence

### Buy Now Button
- Solid vibrant blue background: `#007BFF`
- White bold text, centered with Sparkles icon
- Rounded corners: `rounded-xl` (matching card style)
- Hover: Lighter blue (`#339DFF`) + subtle glow shadow (`0 0 16px rgba(0,123,255,0.4)`)
- Remove the current transparent gradient background

### Tier Badge
- Keep existing badge styling (already clean and fits the new design)

## Technical Details

### File: `src/components/ToolCard.tsx`
- Flatten the card structure from 4 nested divs (outer wrapper > bloom > border wrapper > inner card) down to 2 (outer wrapper > card)
- Remove the bloom glow div and the gradient border wrapper div
- Remove the inner top highlight div
- Replace inline `style` objects with Tailwind classes where possible, falling back to `style` only for the card background/shadow
- Update the button from transparent gradient to solid `bg-[#007BFF] hover:bg-[#339DFF]` with a hover glow shadow
- Update price text to `text-xl font-bold text-white`
- Update subtitle color to `text-[#888]`

No other files need changes.

