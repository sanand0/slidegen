# Prompts

## Create slideforge.html (Claude Code)

We are going to create a slideforge library. In slideforge.js, implement a function `slideforge.html(slides)` will convert a slide deck in the JSON format below and return a HTML string.

Write extensive unit test cases using vitest + happy-dom to cover every aspect of the JSON syntax below. Ensure that the tests pass.

```json
{
  "version": "1.0.0",
  "id": "deck-id",
  "name": "Example Deck",
  "slide_size": { "w": 1280, "h": 720, "unit": "px" },
  "theme": {
    "colors": {
      "accent1": "#2563eb",
      "accent2": "#16a34a",
      "text": "#0f172a",
      "muted": "#475569",
      "bg": "#ffffff",
      "surface": "#f8fafc"
    },
    "fonts": { "heading": "Inter", "body": "Inter" }
  },

  "masters": [
    {
      "id": "mst-default",
      "name": "Default Master",
      "bg": { "fill": "#ffffff", "image": "https://cdn.example.com/bg.jpg", "image_fit": "cover" },
      "shapes": [
        {
          "id": "mst-logo",
          "type": "image",
          "role": "logo",
          "x": 90,
          "y": 2,
          "w": 8,
          "h": 8,
          "unit": "%",
          "z": 100,
          "image_src": "https://cdn.example.com/logo.svg",
          "image_fit": "contain",
          "opacity": 1
        },
        {
          "id": "mst-footer",
          "type": "text",
          "role": "footer",
          "x": 4,
          "y": 92,
          "w": 92,
          "h": 6,
          "unit": "%",
          "text": "{org_name} • {date}",
          "text_align": "right",
          "text_font": "Inter",
          "text_size": 12,
          "text_color": "#475569"
        }
      ],
      "layouts": [
        {
          "id": "lyt-title",
          "name": "Title Only",
          "bg": { "inherit": true },
          "shapes": [
            {
              "id": "title",
              "type": "text",
              "role": "title",
              "x": 8,
              "y": 28,
              "w": 84,
              "h": 20,
              "unit": "%",
              "text": "Slide Title",
              "text_font": "Inter",
              "text_size": 48,
              "text_weight": 700,
              "line_height": 1.1,
              "text_color": "#0f172a",
              "text_align": "left",
              "placeholder": "text"
            },
            {
              "id": "subtitle",
              "type": "text",
              "role": "subtitle",
              "x": 8,
              "y": 50,
              "w": 84,
              "h": 10,
              "unit": "%",
              "text": "Subtitle or key message",
              "text_font": "Inter",
              "text_size": 22,
              "text_color": "#475569",
              "text_align": "left",
              "placeholder": "text"
            }
          ]
        },
        {
          "id": "lyt-title-content",
          "name": "Title + Content",
          "bg": { "inherit": true },
          "shapes": [
            {
              "id": "title",
              "type": "text",
              "role": "title",
              "x": 6,
              "y": 6,
              "w": 88,
              "h": 12,
              "unit": "%",
              "text": "Section Header",
              "text_font": "Inter",
              "text_size": 36,
              "text_weight": 700,
              "line_height": 1.15,
              "text_color": "#0f172a",
              "text_align": "left",
              "placeholder": "text"
            },
            {
              "id": "content",
              "type": "placeholder",
              "role": "content",
              "accept": "text|image|table|chart|list",
              "x": 6,
              "y": 22,
              "w": 88,
              "h": 68,
              "unit": "%"
            }
          ]
        }
      ],
      "meta": { "author": "Anand", "purpose": "Generic corporate deck", "tags": ["default"] }
    }
  ],

  "slides": [
    {
      "id": "s1",
      "master": "mst-default",
      "layout": "lyt-title",
      "overrides": [
        { "shape": "title", "text": "LLM Strategy 2025" },
        { "shape": "subtitle", "text": "From prototypes to platforms" }
      ],
      "notes": "Open with impact metrics.",
      "meta": { "org_name": "Straive", "date": "2025-08-12", "status": "draft" }
    },
    {
      "id": "s2",
      "master": "mst-default",
      "layout": "lyt-title-content",
      "overrides": [
        { "shape": "title", "text": "Adoption Metrics" },
        {
          "shape": "content",
          "type": "list",
          "items": [
            "8% org-wide usage; 35% in tech",
            "Top use-cases: summarization, RAG, reporting",
            "Roadblocks: access, training, workflow fit"
          ],
          "bullet": "•",
          "text_font": "Inter",
          "text_size": 20,
          "line_height": 1.35
        }
      ],
      "notes": "Call out 90-day targets.",
      "meta": { "org_name": "Straive", "date": "2025-08-12" }
    }
  ]
}
```

## Refactor, spec, and preview (Claude Code)

Modify slideforge.js and slideforge.test.js as follows:

- slideforge.html() should generate only the deck snippet currently in slidesHTML, with scoped CSS. Modify other code accordingly.
- Remove the "type": "placeholder". We no longer need it.
- Render type: list as unordered lists.

Document the specification in README.md.

Create a series of sample deck JSON files in tests/ for use in slideforge.test.js.

Create a MINIMAL tests/index.html with a simple CDN-based Bootstrap UI that lets the user enter a JSON config into a textarea and render it as HTML side-by-side on input/change. Add a select that lets the user pick from the sample deck JSONs in tests/ and fetch them into the textarea.

---

- Total cost: $1.41
- Total duration (API): 7m 36.7s
- Total duration (wall): 25m 12.4s
- Total code changes: 1269 lines added, 90 lines removed
- Usage by model:
  - claude-sonnet: 178 input, 28.0k output, 1.7m cache read, 125.9k cache write
  - claude-3-5-haiku: 5.4k input, 1.2k output, 0 cache read, 0 cache write

## Refactor tests (Claude Code)

Rewrite the tests to

- Use the decks in tests/ rather than using its own.
- Use happy-dom to parse the HTML DOM and test accordingly.
- Ensure every feature in the README.md is tested. Update decks as required.

---

- Total cost: $1.34
- Total duration (API): 5m 54.5s
- Total duration (wall): 6m 36.7s
- Total code changes: 369 lines added, 446 lines removed
- Usage by model:
  - claude-3-5-haiku: 12.7k input, 478 output, 0 cache read, 0 cache write
  - claude-sonnet: 157 input, 19.6k output, 2.5m cache read, 75.2k cache write

## More templates (Claude Code)

Add support for the 20 most common shapes seen in corporate presentations.
Update specs minimally for this.
Use SVG for the shapes but HTML for text in shapes.

Add tests with diverse, rich, realistic examples. Include those in tests/index.html.

---

- Total cost: $0.63
- Total duration (API): 3m 9.1s
- Total duration (wall): 32m 58.3s
- Total code changes: 480 lines added, 1 line removed
- Usage by model:
  - claude-3-5-haiku: 3.1k input, 188 output, 0 cache read, 0 cache write
  - claude-sonnet: 39 input, 11.4k output, 912.9k cache read, 47.3k cache write

## Fix text implementation, update shapes (Claude Code)

Currently, shapes add a `<text>` inside the element.
Instead, they should be outside the SVG inside a <div> with the same dimensions as the SVG.
The SVG and the text div should be absolutely positioned inside the div.shape which should use position:relative.
This allows text wrapping. Add a test for this.

The shapes are all currently square. They should use up the full width and height of the rectangle as best as possible.
Therefore, the path should be a function of the width and height, and ensure that the shape's aspect ratio matches.
Some shapes may use additional parameters to shape the SVG path. Incorporate these:

- rounded-rectangle: curvature
- arrow-\*: tipSize, stemSize
- pentagon, chevron-start: tipSize
- speech: tipSize

Update shapes-demo.json to have one row per shape, with each row featuring 4 different size, color, text_size, text, and shape parameter variations.
Include at least one with longer text.

---

- Total cost: $0.87
- Total duration (API): 13m 16.2s
- Total duration (wall): 19m 39.0s
- Total code changes: 233 lines added, 170 lines removed
- Usage by model:
  - claude-3-5-haiku: 3.2k input, 193 output, 0 cache read, 0 cache write
  - claude-sonnet: 53 input, 15.5k output, 1.3m cache read, 66.3k cache write

## Slide shapes, borders, shape fixes

Slides should be allowed to have their own shapes. Modify the spec, code, and tests accordingly.

Shapes should be allowed a border, with color, width, and any other parameters that can be easily implemented / exists in PowerPoint AND SVG.

In shapes-demo.json, add more slides and ensure that all shapes and variations are displayed.

The following shapes were not implemented correctly: rounded-rectangle, arrow-\*, pentagon, chevron, speech. Think about how they SHOULD look, examine the code carefully, and fix them.

---

- Total cost: $1.04
- Total duration (API): 4m 52.2s
- Total duration (wall): 11m 30.6s
- Total code changes: 190 lines added, 56 lines removed
- Usage by model:
  - claude-3-5-haiku: 2.9k input, 185 output, 0 cache read, 0 cache write
  - claude-sonnet: 181 input, 18.3k output, 1.6m cache read, 76.5k cache write

## Improve schema (Claude Code)

Implement the schema refactor below precisely. Do not introduce compatibility layers or migrations.

What to change

- Remove `masters` entirely. Keep a single top-level `layouts` object map keyed by layout id. Move existing layouts from masters up one level. Do not keep an `id` field inside each layout entry; the key is the id.
- Make `.shapes` an object map keyed by `id` at every level (root, each layout, each slide). No arrays for shapes. Rendering order is by `z` only (ascending); if `z` ties, preserve insertion order.
- Backgrounds: allow `bg` at root, at each layout, and at each slide. Each `bg` may include { "fill": string, "image": string, "image_fit": "cover|contain|fill|none|scale-down" }. Precedence is root.bg < layout.bg < slide.bg; absence means inherit.
- Replace slide overrides: delete `slides[].overrides` entirely. Use `slides[].shapes` for overrides.
- Flatten theme: remove `theme` entirely. Move `theme.colors` -> root `colors`; `theme.fonts` -> root `fonts`. Do not keep aliases.
- Keep `version` as-is (no bump). Do not add JSON Schema. Do not support the old schema.

New schema (authoritative example)

```json
{
  "version": "1.0.0",
  "id": "deck-id",
  "name": "Example Deck",
  "slide_size": { "w": 1280, "h": 720, "unit": "px" },
  "colors": {
    "accent1": "#2563eb",
    "accent2": "#16a34a",
    "text": "#0f172a",
    "muted": "#475569",
    "bg": "#ffffff",
    "surface": "#f8fafc"
  },
  "fonts": { "heading": "Inter", "body": "Inter" },

  "bg": { "image": "https://cdn.example.com/bg.jpg", "image_fit": "cover" },

  "shapes": {
    "logo": {
      "id": "logo",
      "type": "image",
      "role": "logo",
      "x": 90,
      "y": 2,
      "w": 8,
      "h": 8,
      "unit": "%",
      "z": 100,
      "image_src": "https://cdn.example.com/logo.svg",
      "image_fit": "contain",
      "opacity": 1
    },
    "footer": {
      "id": "footer",
      "type": "text",
      "role": "footer",
      "x": 4,
      "y": 92,
      "w": 92,
      "h": 6,
      "unit": "%",
      "z": 101,
      "text": "{org_name} • {date}",
      "text_align": "right",
      "text_font": "Inter",
      "text_size": 12,
      "text_color": "#475569"
    }
  },

  "layouts": {
    "lyt-title": {
      "name": "Title Only",
      "bg": { "fill": "#ffffff" },
      "fonts": { "body": "monospace" },
      "shapes": {
        "title": {
          "id": "title",
          "type": "text",
          "role": "title",
          "x": 8,
          "y": 28,
          "w": 84,
          "h": 20,
          "unit": "%",
          "z": 10,
          "text": "Slide Title",
          "text_font": "Inter",
          "text_size": 48,
          "text_weight": 700,
          "line_height": 1.1,
          "text_color": "#0f172a",
          "text_align": "left"
        },
        "subtitle": {
          "id": "subtitle",
          "type": "text",
          "role": "subtitle",
          "x": 8,
          "y": 50,
          "w": 84,
          "h": 10,
          "unit": "%",
          "z": 11,
          "text": "Subtitle or key message",
          "text_font": "Inter",
          "text_size": 22,
          "text_color": "#475569",
          "text_align": "left"
        }
      }
    },
    "lyt-title-content": {
      "name": "Title + Content",
      "shapes": {
        "title": {
          "id": "title",
          "type": "text",
          "role": "title",
          "x": 6,
          "y": 6,
          "w": 88,
          "h": 12,
          "unit": "%",
          "z": 10,
          "text": "Section Header",
          "text_font": "Inter",
          "text_size": 36,
          "text_weight": 700,
          "line_height": 1.15,
          "text_color": "#0f172a",
          "text_align": "left"
        },
        "content": {
          "id": "content",
          "type": "list",
          "role": "content",
          "x": 6,
          "y": 22,
          "w": 88,
          "h": 68,
          "unit": "%",
          "z": 11,
          "items": ["Item A", "Item B"],
          "bullet": "•",
          "text_font": "Inter",
          "text_size": 20,
          "line_height": 1.35
        }
      }
    }
  },

  "slides": [
    {
      "id": "s1",
      "layout": "lyt-title",
      "shapes": {
        "title": { "text": "LLM Strategy 2025" },
        "subtitle": { "text": "From prototypes to platforms" }
      },
      "notes": "Open with impact metrics.",
      "meta": { "org_name": "Straive", "date": "2025-08-12", "status": "draft" }
    },
    {
      "id": "s2",
      "layout": "lyt-title-content",
      "bg": { "fill": "#f8fafc" },
      "shapes": {
        "title": { "text": "Adoption Metrics" },
        "content": {
          "items": [
            "8% org-wide usage; 35% in tech",
            "Top use-cases: summarization, RAG, reporting",
            "Roadblocks: access, training, workflow fit"
          ]
        }
      },
      "notes": "Call out 90-day targets.",
      "meta": { "org_name": "Straive", "date": "2025-08-12" }
    }
  ]
}
```

Merge semantics (strict)

- Sources and order (lowest → highest precedence): `root.shapes` → `layout.shapes` (by slide `layout`) → `slide.shapes`.
- Backgrounds, fonts, and colors: resolve `bg`, `fonts` and `colors` by precedence root < layout < slide. If a level omits any, inherit from the lower level. No `inherit` flag.
- Merge key: shape `id`. Only shapes present in any source (root or layout) participate. Absent shapes are not created.
- Strategy: deep merge objects by key; non-objects replace scalars; arrays (e.g., `items`) replace entirely (no concat).
- Ordering: render by `z` ascending after merge. If no `z`, ignore it (i.e. treat as `0`).

Code changes

- Update `slideforge.js` to: (a) accept the new schema, (b) implement the merge exactly as above, (c) drop all `masters` and `overrides` handling, (d) read `bg`, `colors` and `fonts` from the hierarchy only, (e) resolve background using root/layout/slide precedence and support `fill`, `image`, `image_fit`, (f) preserve all previously supported shape rendering behaviors (list renders to `<ul>`, shapes text div outside SVG, borders, slide-level shapes, etc.).
- Keep functions small and reusable; avoid classes; validate early with if-return.

Docs and tests

- Update `README.md` spec to describe the new schema and merge rules with the JSON example above, including background precedence and allowed fields.
- Replace all test decks in `tests/` (incl. `shapes-demo.json`) to the new schema. Remove any `masters`/`overrides` remnants.
- Update `slideforge.test.js` to cover: (1) shapes object maps at all levels, (2) deep-merge precedence and array replacement, (3) z-order rendering, (4) list rendering, (5) colors/fonts from root only, (6) no support for old schema.
- Update `tests/index.html` to load and render the updated sample decks; ensure the UI and loading indicator still work.

Acceptance criteria

- All tests pass locally with `vitest` and `happy-dom`.
- No references to `masters`, `overrides`, or `theme` remain in code, docs, or tests.
- Samples and demo render correctly using merged shapes and z-ordering.
- Background precedence works across root/layout/slide levels; no `inherit` flags remain.

---

- Total cost: $1.83
- Total duration (API): 9m 18.1s
- Total duration (wall): 11m 48.1s
- Total code changes: 625 lines added, 607 lines removed
- Usage by model:
  - claude-3-5-haiku: 6.7k input, 332 output, 0 cache read, 0 cache write
  - claude-sonnet: 66 input, 37.9k output, 2.7m cache read, 122.0k cache write

## Improve shapes and tests

Goal: fix chevron geometry, replace the current `pentagon` with a right-tag shape, add precise DOM hooks for testing, and make the test page render slides full-width while preserving aspect ratio. Keep changes minimal, functional, and deduplicated.

Implementation

- tests/index.html: render the deck scaled to the panel width, preserving aspect ratio, centered horizontally.
  - Compute scale from container width and deck slide_size.w; apply `transform: scale()` to a wrapper and set `transform-origin: top left`.
  - Keep UI minimal; no spinner. Display errors using a Bootstrap alert with the full error message.

- slideforge.js: improve shape geometry and testability.
  - Add `data-shape-id` and `data-shape-type` on every `.shape` wrapper.
  - Chevron: implement a symmetric chevron with consistent band thickness and centered notch depth.
    - Keep `tipSize` to control the notch depth (distance from the right tip back into the body along the x-axis).
    - Use default thickness ratio `thickness = 0.3` of height; allow optional `thickness` on the shape to override.
  - Deduplicate by extracting path helpers.
  - Replace the current `pentagon` visual with a `chevron-start` shape: flat left edge, triangular right tip (same band thickness concept as chevron but no left notch).
    - New type name: `chevron-start`.
    - No backward compatibility required for `pentagon`
  - Keep existing behavior for all other shapes. Preserve text overlay outside SVG as is.

- slideforge.test.js: make assertions specific and element-targeted.
  - Prefer DOM queries with `data-shape-id` and `data-shape-type` over broad string includes; only use string checks when DOM attributes aren’t available.
  - For `chevron` in `shapes-demo.json`, assert the presence of a single `<path>` under the shape, and verify `d` reflects a centered notch and consistent band thickness via expected coordinates for the given `(w, h, tipSize)`.
  - For `chevron-start` (formerly pentagon), assert the polygon has a flat left edge and a triangular right tip (no inner notch), again via expected coordinates in `d` for the test cases.
  - Keep existing coverage for fills, strokes, text overlays, z-order, and responsive viewBox.

- tests/shapes-demo.json: rename `type: "pentagon"` to `type: "chevron-start"` for all samples in the polygon slide; keep ids unchanged.

Shape geometry details

- Coordinate system: use the current responsive coordinate space with `viewBox="0 0 w h"` and the existing `margin = min(w, h) * 0.1` (unchanged) unless that margin would cause self-intersection; clamp as needed.
- Chevron (symmetric band): build the outline from two parallel limbs with uniform band thickness `t = thickness * h`.
  - Outer polygon (reference): `(m, m) → (w - tip - m, m) → (w - m, h/2) → (w - tip - m, h - m) → (m, h - m) → (m + tip, h/2)`.
  - Adjust the inner notch so the two limbs have uniform width `t`. Use vector offset from the midline to place the inner notch point at `(m + tip, h/2)` and keep limb widths ≈ `t` across. If needed, slightly tweak `tip` by ≤ 1 unit to maintain continuity and avoid self-intersections.
- chevron-start (flat-left, triangular-right): polygon points `(m, m) → (w - tip - m, m) → (w - m, h/2) → (w - tip - m, h - m) → (m, h - m) → Z`.

Acceptance criteria

- tests/index.html
  - Deck scales to fill the right panel width, preserves aspect ratio, and is horizontally centered.
  - Errors render as a visible Bootstrap alert with the full message.

- slideforge.js
  - `.shape` wrappers include `data-shape-id` and `data-shape-type` attributes.
  - Chevron renders with a centered notch and visually uniform band thickness; `tipSize` controls depth; optional `thickness` is respected.
  - `type: "chevron-start"` renders as specified; `type: "pentagon"` remains as an alias, implemented via `chevron-start` code path.

- slideforge.test.js
  - Update tests to query shapes by `data-shape-id` and assert exact attributes/styles/text where applicable.
  - Add targeted assertions for chevron and chevron-start path `d` based on known test dimensions and parameters.
  - Keep other tests intact but replace broad string checks where feasible with targeted DOM assertions.

- tests/shapes-demo.json
  - All `pentagon*` shapes use `type: "chevron-start"`.

- Visual parity
  - The chevron and right-tag shapes resemble `correct-shapes.webp` rather than `current-shapes.webp`.

Notes

- If exact numeric checks for path `d` are brittle across environments, assert key anchor coordinates (e.g., tip x, mid y, left/top/bottom x/y) within a small epsilon rather than full-string equality.

## Manual Corrections

- Drop all "pentagon" in favor of "chevron-start"
- Use stemSize instead of thickness in the chevron shapes, reducing the number of parameters.
- Allow shape.margin
