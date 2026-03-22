```markdown
# Design System Specification: High-End Editorial Spiritual Marketplace

## 1. Overview & Creative North Star
**The Creative North Star: "The Modern Sanctuary"**

This design system moves away from the cluttered, "temple-flyer" aesthetic common in spiritual apps. Instead, it adopts an **Editorial High-Energy** approach—combining the rapid-response urgency of quick-commerce (Blinkit/Zomato) with the serene, intentional atmosphere of a modern sanctuary. 

We break the "standard app template" by utilizing **intentional asymmetry** and **overlapping depth**. Rather than rigid grids, we use spiritual motifs (mandalas and diyas) as functional background anchors that guide the eye. The interface should feel like a premium concierge service: vibrant, energetic, yet deeply respectful and accessible.

---

## 2. Colors & Surface Philosophy
The palette is rooted in tradition but rendered with modern saturation. We use the Material Design 3 token logic to ensure a systematic application of color.

### Core Palette
- **Brand Accent (Yellow):** `primary` (#7c6100) / `primary_container` (#facc47). Used to highlight the "glow" of the brand.
- **Success & Trust (Green):** `secondary` (#007518). Used strictly for verification, completed bookings, and "Pundit Arrived" states.
- **Action & Urgency (Red):** `tertiary` (#c31e31). Reserved for primary CTAs (Book Now) and urgent alerts.
- **The Sanctuary Base:** `surface` (#fffbff) and `surface_container_low` (#fdf9ef). A warm, cream-tinted white that prevents eye strain and feels more "organic" than pure digital white.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. 
- Boundaries must be defined solely through background color shifts. 
- Use `surface_container_low` for the page background and `surface_container_highest` or `surface` for cards to create natural separation.

### Glass & Gradient Rule
To move beyond a "flat" look, use **Glassmorphism** for floating headers or sticky booking bars.
- **Token:** `surface` at 80% opacity with a 12px-16px Backdrop Blur.
- **Gradients:** Use a subtle linear gradient from `primary_fixed` (#facc47) to `primary_fixed_dim` (#eabf3a) for high-energy hero sections to provide "soul" and depth.

---

## 3. Typography: The Editorial Voice
We pair the geometric friendliness of **Plus Jakarta Sans** (a premium alternative to Poppins for a more modern "editorial" feel) with the high-legibility of **Inter**.

- **Display & Headlines (Plus Jakarta Sans):** These are our "vocal" elements. Use `display-lg` and `headline-lg` for service categories (e.g., "Maha Shivratri Puja"). The wide apertures of Jakarta Sans provide a premium, open feel.
- **Body & Labels (Inter):** Inter is used for all functional data. Its tall x-height ensures that elderly users can read Pundit bios and ritual descriptions even at smaller scales.
- **The Hierarchy Rule:** Headlines should use `on_surface` (#393832), while secondary metadata uses `on_surface_variant` (#66645e) to create clear visual importance without using lines.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often messy. In this system, we achieve depth through **Tonal Stacking**.

- **The Layering Principle:** Place a `surface_container_lowest` (#ffffff) card on top of a `surface_container_low` (#fdf9ef) background. The subtle 1-2% shift in brightness creates a sophisticated "lift" that feels like high-end stationery.
- **Ambient Shadows:** For floating elements (like a "Book Now" floating action button), use a shadow tinted with the brand's primary color:
    - `Blur: 24px`, `Spread: -4px`, `Color: primary @ 8% opacity`.
- **The Ghost Border:** If a divider is mandatory for accessibility, use `outline_variant` (#bcb9b1) at **15% opacity**. Never use a 100% opaque line.

---

## 5. Components & Interaction

### Buttons (High-Energy CTAs)
- **Primary Action:** Use `tertiary` (#c31e31). This Zomato-inspired red drives conversion. 
    - *Shape:* Rounded `md` (1.5rem) to `lg` (2rem).
    - *Size:* Minimum height 56dp to accommodate elderly tap targets.
- **Secondary Action:** Use `primary_container` (#facc47) with `on_primary_container` text.

### Cards & Service Lists
- **The Rule:** No dividers. Use `spacing.6` (2rem) of vertical white space to separate items.
- **Styling:** Soft rounded corners (`md`: 1.5rem). 
- **Spiritual Motif:** Incorporate a subtle, 5% opacity Mandala pattern in the corner of cards using `on_surface_variant`.

### Input Fields
- **Surface:** Use `surface_container_highest`. 
- **Interaction:** On focus, the background shifts to `surface` and a 2px "Ghost Border" of `primary` appears at 40% opacity.

### Selection Chips
- **Spiritual Context:** Used for selecting "Puja Duration" or "Number of Priests." 
- **Style:** Pill-shaped (`full` roundedness). Unselected: `surface_container_high`. Selected: `secondary` (#007518) with `on_secondary` text.

---

## 6. Do’s and Don’ts

### Do:
- **Do** use large, high-quality photography of rituals that overlap the card boundaries slightly for a "3D" editorial effect.
- **Do** use `secondary` (Green) for "Verified Pundit" badges to build instant trust.
- **Do** maximize white space. If you think there is enough space, add 20% more. This is key for elderly accessibility.

### Don't:
- **Don't** use black text. Always use `on_surface` (#393832) for a softer, more premium contrast.
- **Don't** use standard Material icons. Use "Duotone" or "Rounded" icon sets that match the soft corner radius of the cards.
- **Don't** use harsh shadows. If the element doesn't feel like it's "breathing," the shadow is too dark.

---

## 7. Spacing & Rhythm
This system uses a **base-7 scale** to create a non-standard, custom rhythm.
- **Layout Margins:** Use `spacing.6` (2rem) for outer page margins.
- **Internal Card Padding:** Use `spacing.4` (1.4rem).
- **Section Gaps:** Use `spacing.10` (3.5rem) to signify a major change in content (e.g., from "Trending Pujas" to "Our Pundits").

By following this tonal-first, border-free approach, the design system will feel like a cohesive, premium ecosystem that respects both the spiritual nature of the service and the modern expectations of a high-energy marketplace.```