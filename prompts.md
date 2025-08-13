# Prompts

## Create slidegen.html (Claude Code)

We are going to create a slidegen library. In slidegen.js, implement a function `slidegen.html(slides)` will convert a slide deck in the JSON format below and return a HTML string.

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
          "font_family": "Inter",
          "font_size": 12,
          "color": "#475569"
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
              "font_family": "Inter",
              "font_size": 48,
              "font_weight": 700,
              "line_height": 1.1,
              "color": "#0f172a",
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
              "font_family": "Inter",
              "font_size": 22,
              "color": "#475569",
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
              "font_family": "Inter",
              "font_size": 36,
              "font_weight": 700,
              "line_height": 1.15,
              "color": "#0f172a",
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
          "font_family": "Inter",
          "font_size": 20,
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

Modify slidegen.js and slidegen.test.js as follows:

- slidegen.html() should generate only the deck snippet currently in slidesHTML, with scoped CSS. Modify other code accordingly.
- Remove the "type": "placeholder". We no longer need it.
- Render type: list as unordered lists.

Document the specification in README.md.

Create a series of sample deck JSON files in tests/ for use in slidegen.test.js.

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
- pentagon, chevron: tipSize
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

## TODO

Tests need improvement. More specificity. Target specific IDs.
