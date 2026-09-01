# Kamunungan Elementary School — Design Direction

## Three stylistic approaches considered

### Theme Name: Paper Garden
Very brief intro: A tactile school-notebook aesthetic with warm paper tones, ink-blue navigation, and playful hand-drawn accents. It makes school information feel welcoming, human, and easy for families to scan.
Probability: 0.07

### Theme Name: Signal House
Very brief intro: A crisp civic-portal direction with navy structure, bright saffron notices, and editorial typography. It prioritizes clarity, trust, and quick access to important school updates.
Probability: 0.04

### Theme Name: Sunlit Commons
Very brief intro: A soft, optimistic community-school interface using parchment, botanical green, and terracotta with generous editorial whitespace. It balances warmth with a grounded public-service tone.
Probability: 0.09

## Chosen Approach: Paper Garden

### Design Movement
Contemporary editorial skeuomorphism: a digital noticeboard interpreted through the material language of school stationery, risograph ink, index cards, and annotated field notes. The interface should feel crafted and familiar without becoming childish or decorative for its own sake.

### Core Principles
1. **Information feels posted, not dumped.** Content is arranged like a well-kept school noticeboard, with clear hierarchy, dates, categories, and an obvious next action.
2. **Warmth comes from material cues.** Use paper grain, imperfect ink-like borders, small registration marks, and restrained hand-drawn details rather than gradients, generic cards, or glossy SaaS patterns.
3. **Clarity outranks ornament.** Important notices use strong contrast, generous spacing, and editorial rhythm so teachers and families can find what they need quickly.
4. **Delight stays purposeful.** Small interactions should feel like turning a page or pinning a note: responsive, tactile, and brief.

### Color Philosophy
The base is warm parchment rather than white, creating the feeling of a clean bulletin sheet under daylight. Deep ink blue gives structure and dependable contrast. Marigold is reserved for announcements and actions that deserve attention; leaf green signals activity and positive progress; clay red marks urgency without using alarming digital red. The signature color is **Kamunungan Marigold** `#F4B942`, an optimistic, ownable school-notice accent.

### Layout Paradigm
Use an asymmetric editorial composition. The public home page opens with a wide split hero: school message and primary action on the left, a vertical stack of date-stamped notice slips on the right. Below, content flows into a staggered two-column noticeboard rather than a uniform card grid. The teacher dashboard uses a fixed ink-blue sidebar with a generous work canvas, prioritizing the content queue and a single prominent compose area.

### Signature Elements
1. **Margin notes:** Small uppercase labels, date tabs, and ink annotations that orient users without competing with headlines.
2. **Pinned paper slips:** Content panels use off-white paper surfaces, offset shadows, and selective rough-edged borders; not every section is boxed.
3. **Field-mark accents:** Tiny crosshair marks, underlines, and corner ticks appear as a recurring visual grammar.

### Interaction Philosophy
Interactions should be understandable on first use. Primary buttons respond with a brief pressed scale and a warm highlight. Notice slips lift slightly on hover, like a paper card being picked up. Filters should feel like sorting tabs. The teacher editor should keep the user’s focus on writing by revealing only the necessary controls and confirming saves with a concise status note.

### Animation
Use 160–220ms ease-out transitions for buttons, links, tabs, and notice slips. On page entry, stagger the hero label, headline, supporting copy, and notice slips by 45ms increments; animate only opacity and translateY. Compose panels may enter from `translateY(8px)` and `scale(0.98)` rather than from zero. Never use bounce or elastic easing. Respect `prefers-reduced-motion` by removing non-essential entrance motion.

### Typography System
Use **Fraunces** for display headlines and large editorial statements, with a slightly expressive but legible serif voice. Use **DM Sans** for body copy, navigation, form labels, and metadata. Headlines should be compact and confident, with sentence case; labels should be uppercase with generous tracking; body copy should stay at 16–18px with comfortable line-height. Avoid Inter, Arial, and default system typography.

### Brand Essence
**Kamunungan Elementary School is a warm, dependable information home for families and teachers—different because school updates feel clear, local, and cared for.**
Personality adjectives: **welcoming, dependable, bright**.

### Brand Voice
Headlines are direct and quietly optimistic. CTAs use clear verbs that describe the action. Microcopy is calm, helpful, and never corporate. Avoid filler like “Welcome to our website” or “Get started today.”

Example line 1: “The week ahead, in one clear place.”

Example line 2: “Post an update families can act on.”

### Wordmark & Logo
Use a bold abstract **open-book / sprouting leaf mark**: two navy page shapes create a shallow V, with a marigold seedling rising from the center seam. It should work as a standalone circular or square icon at header size and favicon size, with no text inside the mark. The wordmark is set separately in a restrained Fraunces treatment with a small uppercase school descriptor.

### Signature Brand Color
**Kamunungan Marigold `#F4B942`** — used sparingly for primary calls to action, notice highlights, and the seed in the logo mark.

### Impeccable working notes
The implementation follows the repository’s emphasis on avoiding generic centered layouts, overused fonts, nested cards, gray-on-color text, and excessive decoration. It will also use its recommended motion constraints, strong type hierarchy, asymmetric composition, and clear public-facing navigation. Firebase remains the data/auth layer; this design file only defines the front-end expression.

## Style Decisions

- Use a light, tactile paper surface with dark ink-blue structure; do not drift into a dark neon or purple-gradient aesthetic.
- Use asymmetric editorial layouts and a persistent sidebar for the teacher workspace.
- Keep paper surfaces selective; avoid wrapping every element in a card.
- Prefer Fraunces + DM Sans across the experience.
- Use Kamunungan Marigold as the ownable action color, not as a full-page background.
- Keep motion brief, physical, and reduced-motion aware.
