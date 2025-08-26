# slideforge

[![npm version](https://img.shields.io/npm/v/slideforge.svg)](https://www.npmjs.com/package/slideforge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![bundle size](https://img.shields.io/bundlephobia/minzip/slideforge)](https://bundlephobia.com/package/slideforge)

Generates slides as HTML from JSON schema - a simple, flexible slide deck generator.

## Installation

To use locally, install via `npm`:

```bash
npm install slideforge
```

... and add this to your script:

```js
import html from "./node_modules/slideforge/dist/slideforge.min.js";
```

To use via CDN, add this to your script:

```js
import html from "https://cdn.jsdelivr.net/npm/slideforge@1";
```

## Usage

```js
import html from "slideforge";

const deck = {
  version: "1.0.0",
  id: "deck-id",
  name: "Example Deck",
  slide_size: { w: 1280, h: 720, unit: "px" },
  colors: {
    accent1: "#2563eb",
    accent2: "#16a34a",
    text: "#0f172a",
    muted: "#475569",
    bg: "#ffffff",
    surface: "#f8fafc",
  },
  fonts: { heading: "Arial", body: "Inter" },
  bg: { image: "https://cdn.example.com/bg.jpg", image_fit: "cover" },
  shapes: {
    logo: {
      id: "logo",
      type: "image",
      x: 90,
      y: 2,
      w: 8,
      h: 8,
      unit: "%",
      z: 100,
      image_src: "https://cdn.example.com/logo.svg",
      image_fit: "contain",
      opacity: 1,
    },
  },
  layouts: {
    "lyt-title": {
      name: "Title Only",
      bg: { fill: "#ffffff" },
      shapes: {
        title: {
          id: "title",
          type: "text",
          x: 8,
          y: 28,
          w: 84,
          h: 20,
          unit: "%",
          z: 10,
          text: "Slide Title",
          text_font: "Inter",
          text_size: 48,
          text_weight: 700,
          line_height: 1.1,
          text_color: "#0f172a",
          text_align: "left",
        },
      },
    },
  },
  slides: [
    {
      id: "s1",
      layout: "lyt-title",
      shapes: {
        title: { text: "LLM Strategy 2025" },
      },
      notes: "Open with impact metrics.",
      meta: { org_name: "Straive", date: "2025-08-12", status: "draft" },
    },
  ],
};

const slideHTML = html(deck);
document.body.innerHTML = slideHTML;
```

## Specification

### Deck Structure

A slide deck consists of:

- **version**: Schema version (must start with `1.`; if omitted, treated as compatible)
- **id**: Unique deck identifier (sets the `data-deck-id=` attribute)
- **name**: Human-readable deck name
- **slide_size**: Dimensions and units for all slides
- **colors**: Color palette used throughout
- **fonts**: Font definitions
- **bg**: Root background (optional)
- **shapes**: Root-level shapes (optional)
- **layouts**: Layout definitions keyed by ID
- **slides**: Individual slide instances

### Complete Schema Example

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
      "shapes": {
        "title": {
          "id": "title",
          "type": "text",
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
    }
  ]
}
```

### Shape Merging Rules

Shapes are merged with strict precedence (lowest → highest):

1. **Root shapes** (`deck.shapes`)
2. **Layout shapes** (`layout.shapes` for the slide's layout)
3. **Slide shapes** (`slide.shapes`)

Only shapes present in any source participate in merging. Deep merge by key with arrays (like `items`) replacing entirely.

### Background Precedence

Backgrounds resolve with precedence: `root.bg` < `layout.bg` < `slide.bg`. Missing levels inherit from lower levels.

Each `bg` may include:

- `fill`: Background color
- `image`: Background image URL
- `image_fit`: "cover", "contain", "fill", "none", or "scale-down"

### Layouts

Layouts are keyed by ID at the top level. No `id` field inside each layout entry.

### Shape Types

#### Text Properties

These properties control text rendering. They apply to `type: "text"` shapes directly, to list items (each list item is rendered via the text-shape generator), and to all SVG shapes via a text overlay. SVG and list items reuse the text-shape generator, so the same props apply.

```json
{
  "type": "text",
  "text": "Hello World",
  "text_font": "Inter", // or a font key from deck.fonts, e.g., "heading"
  "text_size": 24,
  "text_weight": 700, // number or CSS keyword (e.g., "bold")
  "text_color": "#000000", // or a color key from deck.colors, e.g., "accent1"
  "text_align": "left", // left | center | right | justify
  "text_valign": "middle", // top | middle | bottom
  "line_height": 1.2
}
```

Defaults by shape type: Text/List default to `text_align: "left"`, `text_valign: "middle"`; SVG text overlays default to `text_align: "center"`, `text_valign: "middle"`.
Note: `margin` is a shape-path inset for certain SVG shapes (rectangle, rounded-rectangle, etc.) and does not affect Text/List overlays.

#### Image Shapes

```json
{
  "type": "image",
  "image_src": "https://example.com/image.jpg",
  "image_fit": "cover",
  "alt": "Descriptive alt text" // optional; defaults to ""
}
```

#### List Shapes

```json
{
  "type": "list",
  "items": ["First item", "Second item", "Third item"],
  "bullet": "•" // optional; prefix added to each item
  // All Text Properties apply to list items (font, size, weight, color, align, line_height)
}
```

Note: `type: "list"` ignores a `text` field if present; only `items` render.

#### SVG Shapes

All SVG shapes support fill, stroke, and text overlays. Text overlays inherit all properties documented under “Text Properties” because SVG shapes use the same text-shape generator under the hood. The text overlay is simply a `.text-shape` inside `.svg-shape` and is positioned/centered via CSS:

```json
{
  "type": "rectangle",
  "fill": "#2563eb",
  "stroke": "#1d4ed8",
  "stroke_width": 2,
  "text": "Label",
  "text_font": "Inter",
  "text_size": 14,
  "text_weight": 600,
  "text_color": "#ffffff",
  "text_align": "center",
  "line_height": 1.2
}
```

Color and font resolution:

- Color fields (`text_color`, `fill`, `stroke`) accept CSS color values (e.g., `#2563eb`) or palette keys from `deck.colors` (e.g., `"accent1"`).
- Font field (`text_font`) accepts a CSS font family (e.g., `Inter`) or a font key from `deck.fonts` (e.g., `"heading"`, `"body"`).
  Both resolve automatically at render time.
  The deck container uses `fonts.body` globally; `fonts.heading` applies only where a shape sets `text_font: "heading"`.

**Available shapes:** rectangle, rounded-rectangle, ellipse, arrow-right, arrow-left, arrow-up, arrow-down, diamond, triangle, hexagon, speech-bubble, chevron-start, chevron

### Slides

Individual slides reference layouts and can override shape properties:

```json
{
  "slides": [
    {
      "id": "s1",
      "layout": "lyt-title",
      "bg": { "fill": "#f8fafc" },
      "shapes": {
        "title": { "text": "Custom Title" },
        "subtitle": { "text": "Custom subtitle" }
      },
      "notes": "Speaker notes here.",
      "meta": {
        "org_name": "ACME Corp",
        "date": "2025-08-13"
      }
    }
  ]
}
```

### Text Interpolation

Use `{variable}` syntax in text that gets replaced with values from slide metadata:

```json
{
  "text": "Presented by {org_name} on {date}",
  "meta": {
    "org_name": "ACME Corp",
    "date": "2025-08-13"
  }
}
```

Results in: "Presented by ACME Corp on 2025-08-13"

Scope: Only textual fields interpolate (`text` in text/list/SVG overlay). Non-text fields like `image_src` and `bg.image` do not interpolate.

### Shape Positioning

All shapes support positioning with:

- **x, y**: Position from top-left
- **w, h**: Width and height
- **unit**: "px", "%", "em", "rem", etc.
- **z**: Z-index for layering
- **opacity**: 0.0 to 1.0
  Defaults: Slides default to `px`; shapes default to `%`.

## API

### `html(deck)`

Converts a slide deck JSON object to HTML string with scoped CSS.

**Parameters:**

- `deck` (Object): Slide deck configuration object

**Returns:**

- String: HTML snippet with slides and scoped CSS

**Example:**

```js
const htmlOutput = html(deckConfig);
// Returns: <div class="slideforge-deck">...</div>
```

## Development

```bash
git clone https://github.com/sanand0/slideforge.git
cd slideforge

npm install
npm run lint && npm run build && npm test

npm publish
git commit . -m"$COMMIT_MSG"; git tag $VERSION; git push --follow-tags
```

## Release notes

[1.0.0](https://npmjs.com/package/slideforge/v/1.0.0): 26 Aug 2025: Initial release with JSON to HTML conversion

## License

[MIT](LICENSE)
