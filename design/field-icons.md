# Field icons (glass objects)

The seven field icons live in `public/img/f/<field>.webp` (192 x 192, transparent). They are minimal frosted-glass objects, one lime bead each, made with GPT Image 2.5 through Higgsfield on 2026-10-08, from 1024 px transparent PNGs.

| Field | Object | Lime part |
|---|---|---|
| Design | pen-tool nib | bead in the nib hole |
| Writing | thick diagonal pencil | the sharpened tip |
| Code | two chevrons `<` `>` | bead floating between them |
| Video | rounded play triangle | bead at its centre |
| Selling | price tag, one pointed end, tilted, no string (redrawn 2026-10-09: the old shopping bag read as a padlock in the pilot) | bead in the tag's hole |
| Music | single eighth note | bead inside the note head |
| Prompting | speech bubble | vertical text-cursor bar |
| Missions (tab, not a field), file `missions.webp` | signpost: one thick post, two chunky arrow signs pointing opposite ways, no writing | bead at the top of the post |
| yourKERN (profile tab, not a field) | minimal person: frosted shoulders, no neck | the lime bead is the head |
| KERN.AI (AI tab and cards, not a field), file `ai.webp` | a large frosted star with the lime bead (you) and a small glowing light-blue gem star overlapping its upper right point (the AI assisting you) | lime bead in the large star; the small star is light blue |

The blue (#7CC8FF) is used only for the AI, so lime keeps meaning "you" everywhere else. For the AI icon the large star follows the style block below; the small star is "luminous light-blue glass that glows from inside, like a small blue gem", about 45% of the large star, with no lime in it.

## Style block (same for all seven, then the object line)

Minimal 3D app icon, one single object, centered, filling about 62% of the frame, isolated on a fully transparent background, no floor, no shadow, no text. Material: thick, softly rounded, frosted translucent glass, pale bone-white with a faint green tint, soft rim light along the edges, real glass depth and subtle refraction. Exactly one glowing electric lime (#C8F04A) glass bead, about one fifth of the object's width, bright with a soft lime glow spilling into the frosted glass around it, embedded in the object. Nothing else.

Settings: model `gpt_image_2_5`, quality `high`, 1:1, `background: transparent`.

## Higgsfield job ids

design df208fb2-3ef6-49ab-bc91-44645676ff7f, writing 2e4e0606-a723-4fa7-9a1b-03e4a08de357, code 87e39ba6-61cf-473f-a2e5-6e7f777d4a9e, video b26a4e3c-54c8-4092-9c47-c01151a18ae2, selling 36fd097d-b9fe-466e-a15c-351a1765c59b (price tag; the old bag was 4b9f0668-edbc-4671-a5ce-6ed536f12763), music c5e2aceb-0206-4081-84eb-5d99ef862ba4, prompting 777025d9-daa4-41ed-be7c-54440b7c19f6, yourkern 02ab1699-78d5-4ffc-ba1c-426b99cb5a83, ai d9e35445-2132-4385-9fbb-3f4cd0ce09ff, missions ab53832d-0fec-4a07-a595-6862d04c1084.

## Using them

- Dark theme (default): the image as it is.
- Light theme: the glass is pale on a pale tile, so add `filter: drop-shadow(0 3px 3px rgba(35, 50, 38, .55)) contrast(1.25) brightness(.92)`. Checked in the app on 2026-10-08.
- Rendered size in the field tiles: 58 px. The images are cut to the same frame, so keep width and height equal.
- The three tabs are pictures too: `missions.webp`, `yourkern.webp` (also `yourkern-512.webp` for the Kern card and the share image) and `ai.webp`, same size and rules. Only the done mark and other small marks stay SVG in `src/scripts/icons.ts`.
- A raster icon has no `currentColor`, so the inactive tab needs its own dimmed state (for example `opacity: .55`), and the active one full colour.
