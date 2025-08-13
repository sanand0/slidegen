# slidegen

[![npm version](https://img.shields.io/npm/v/slidegen.svg)](https://www.npmjs.com/package/slidegen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![bundle size](https://img.shields.io/bundlephobia/minzip/slidegen)](https://bundlephobia.com/package/slidegen)

Generates slides as HTML from JSON schema - a simple, flexible slide deck generator.

## Installation

To use locally, install via `npm`:

```bash
npm install slidegen
```

... and add this to your script:

```js
import html from "./node_modules/slidegen/dist/slidegen.min.js";
```

To use via CDN, add this to your script:

```js
import html from "https://cdn.jsdelivr.net/npm/slidegen@1";
```

## Usage

```js
import html from "slidegen";

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
  fonts: { heading: "Inter", body: "Inter" },
  bg: { image: "https://cdn.example.com/bg.jpg", image_fit: "cover" },
  shapes: {
    logo: {
      id: "logo",
      type: "image",
      role: "logo",
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
          role: "title",
          x: 8,
          y: 28,
          w: 84,
          h: 20,
          unit: "%",
          z: 10,
          text: "Slide Title",
          font_family: "Inter",
          font_size: 48,
          font_weight: 700,
          line_height: 1.1,
          color: "#0f172a",
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

- **version**: Schema version (always "1.0.0")
- **id**: Unique deck identifier
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
      "font_family": "Inter",
      "font_size": 12,
      "color": "#475569"
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
          "role": "title",
          "x": 8,
          "y": 28,
          "w": 84,
          "h": 20,
          "unit": "%",
          "z": 10,
          "text": "Slide Title",
          "font_family": "Inter",
          "font_size": 48,
          "font_weight": 700,
          "line_height": 1.1,
          "color": "#0f172a",
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
          "font_family": "Inter",
          "font_size": 22,
          "color": "#475569",
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
          "font_family": "Inter",
          "font_size": 36,
          "font_weight": 700,
          "line_height": 1.15,
          "color": "#0f172a",
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
          "font_family": "Inter",
          "font_size": 20,
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

#### Text Shapes

```json
{
  "type": "text",
  "text": "Hello World",
  "font_family": "Inter",
  "font_size": 24,
  "font_weight": 700,
  "color": "#000000",
  "text_align": "left",
  "line_height": 1.2
}
```

#### Image Shapes

```json
{
  "type": "image",
  "image_src": "https://example.com/image.jpg",
  "image_fit": "cover"
}
```

#### List Shapes

```json
{
  "type": "list",
  "items": ["First item", "Second item", "Third item"],
  "font_family": "Inter",
  "font_size": 18,
  "line_height": 1.4
}
```

#### SVG Shapes

All SVG shapes support fill, stroke, and text overlays:

```json
{
  "type": "rectangle",
  "fill": "#2563eb",
  "stroke": "#1d4ed8",
  "stroke_width": 2,
  "text": "Label",
  "text_color": "#ffffff",
  "text_size": 16
}
```

**Available shapes:** rectangle, rounded-rectangle, ellipse, arrow-right, arrow-left, arrow-up, arrow-down, diamond, triangle, hexagon, pentagon, speech-bubble, chevron

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

### Shape Positioning

All shapes support positioning with:

- **x, y**: Position from top-left
- **w, h**: Width and height
- **unit**: "px", "%", "em", "rem", etc.
- **z**: Z-index for layering
- **opacity**: 0.0 to 1.0

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
// Returns: <div class="slidegen-deck">...</div>
```

## Development

```bash
git clone https://github.com/sanand0/slidegen.git
cd slidegen

npm install
npm run lint && npm run build && npm test

npm publish
git commit . -m"$COMMIT_MSG"; git tag $VERSION; git push --follow-tags
```

## Release notes

[1.0.0](https://npmjs.com/package/slidegen/v/1.0.0): 13 Aug 2025: Initial release with JSON to HTML conversion

## License

[MIT](LICENSE)
