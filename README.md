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
  slide_size: { w: 1280, h: 720, unit: "px" },
  theme: {
    colors: {
      bg: "#ffffff",
      text: "#0f172a",
    },
    fonts: {
      body: "Inter",
    },
  },
  masters: [
    {
      id: "master-1",
      bg: { fill: "#ffffff" },
      layouts: [
        {
          id: "title-slide",
          shapes: [
            {
              id: "title",
              type: "text",
              x: 10,
              y: 30,
              w: 80,
              h: 20,
              unit: "%",
              text: "My Title",
              font_size: 48,
            },
          ],
        },
      ],
    },
  ],
  slides: [
    {
      id: "slide-1",
      master: "master-1",
      layout: "title-slide",
    },
  ],
};

const slideHTML = html(deck);
document.body.innerHTML = slideHTML;
```

## Specification

### Deck Structure

A slide deck consists of:

- **slide_size**: Dimensions and units for all slides
- **theme**: Colors and fonts used throughout
- **masters**: Reusable templates with backgrounds and layouts
- **slides**: Individual slide instances

### Slide Size

```json
{
  "slide_size": {
    "w": 1280,
    "h": 720,
    "unit": "px"
  }
}
```

### Theme

```json
{
  "theme": {
    "colors": {
      "accent1": "#2563eb",
      "accent2": "#16a34a",
      "text": "#0f172a",
      "muted": "#475569",
      "bg": "#ffffff",
      "surface": "#f8fafc"
    },
    "fonts": {
      "heading": "Inter",
      "body": "Inter"
    }
  }
}
```

### Masters and Layouts

Masters define reusable templates with backgrounds and multiple layout options:

```json
{
  "masters": [
    {
      "id": "master-default",
      "bg": {
        "fill": "#ffffff",
        "image": "https://example.com/bg.jpg",
        "image_fit": "cover"
      },
      "shapes": [
        {
          "id": "logo",
          "type": "image",
          "x": 90,
          "y": 5,
          "w": 8,
          "h": 8,
          "unit": "%",
          "image_src": "https://example.com/logo.svg"
        }
      ],
      "layouts": [
        {
          "id": "title-content",
          "bg": { "inherit": true },
          "shapes": [
            {
              "id": "title",
              "type": "text",
              "x": 5,
              "y": 10,
              "w": 90,
              "h": 15,
              "unit": "%",
              "text": "Title Here",
              "font_size": 36,
              "font_weight": 700
            }
          ]
        }
      ]
    }
  ]
}
```

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

Individual slides reference masters and layouts with optional overrides:

```json
{
  "slides": [
    {
      "id": "slide-1",
      "master": "master-default",
      "layout": "title-content",
      "overrides": [
        {
          "shape": "title",
          "text": "Custom Title"
        }
      ],
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
