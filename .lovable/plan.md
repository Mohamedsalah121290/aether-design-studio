

## Personalized AI Tool Recommendations

### Overview
Add an AI-powered recommendation widget to the Store page that asks users about their needs and returns personalized tool suggestions from the catalog. Uses Lovable AI (Gemini) via an edge function.

### Architecture

```text
User clicks "Get Recommendations" → Preference quiz (3 quick questions)
    ↓
Frontend sends preferences to edge function
    ↓
Edge function: fetches tools from DB + calls Lovable AI Gateway
    ↓
AI returns ranked tool_ids with reasoning
    ↓
Frontend displays matched ToolCards with AI explanations
```

### Implementation

**1. Edge function: `supabase/functions/recommend-tools/index.ts`**
- Accepts user preferences (use case, budget range, experience level)
- Fetches all active tools + plans from DB via service role client
- Sends tool catalog + user preferences to Lovable AI Gateway (`google/gemini-3-flash-preview`)
- Uses tool calling to extract structured output: array of `{ tool_id, reason }` (max 4-6 recommendations)
- Returns recommendations to client
- Handles 429/402 errors gracefully

**2. New component: `src/components/AIRecommendations.tsx`**
- Renders a collapsible card in the Storefront, placed between the FeaturedCarousel and FiltersBar
- Three-step mini quiz:
  - "What do you need?" (Writing, Design, Video, Audio, Coding, Automation — multi-select)
  - "Monthly budget?" (Under €10, €10-25, €25-50, No limit)
  - "Experience level?" (Beginner, Intermediate, Advanced)
- Submit button calls the edge function
- Shows loading state with skeleton cards
- Displays recommended ToolCards with AI-generated reasoning beneath each
- Gold/premium styling consistent with "AI DEALS" brand

**3. Storefront integration (`src/components/Storefront.tsx`)**
- Import and render `<AIRecommendations tools={tools} />` between FeaturedCarousel and FiltersBar
- Pass the loaded tools array so matched tool_ids can resolve to full Tool objects client-side

**4. Config update (`supabase/config.toml`)**
- Add `[functions.recommend-tools]` with `verify_jwt = false`

### Technical Details

- **Model**: `google/gemini-3-flash-preview` (fast, cost-efficient for this use case)
- **Structured output via tool calling**: Define a `recommend_tools` function schema returning `{ recommendations: [{ tool_id: string, reason: string }] }`
- **System prompt**: Instructs AI to act as a software advisor for the AI DEALS platform, match user needs to available tools, and explain why each tool fits
- **No persistence needed** — recommendations are ephemeral per session
- **Rate limit handling**: Surface 429/402 errors as toast notifications

