import { describe, it, beforeEach, expect } from "vitest";
import { Window } from "happy-dom";
import { readFileSync } from "fs";
import html from "./slidegen.js";

const loadTestDeck = (filename) => {
  const content = readFileSync(`./tests/${filename}`, "utf8");
  return JSON.parse(content);
};

describe("slidegen", () => {
  let window, document;

  beforeEach(() => {
    window = new Window();
    document = window.document;
    global.window = window;
    global.document = document;
  });

  const testDecks = {
    basic: loadTestDeck("basic-deck.json"),
    corporate: loadTestDeck("corporate-deck.json"),
    image: loadTestDeck("image-deck.json"),
    minimal: loadTestDeck("minimal-deck.json"),
    shapes: loadTestDeck("shapes-demo.json"),
  };

  it("returns empty string for invalid input", () => {
    expect(html(null)).toBe("");
    expect(html(undefined)).toBe("");
    expect(html({})).toBe("");
    expect(html({ slides: null })).toBe("");
  });

  describe("Basic HTML structure", () => {
    it("generates proper HTML structure with basic deck", () => {
      const result = html(testDecks.basic);
      document.body.innerHTML = result;

      const deckElement = document.querySelector(".slidegen-deck");
      expect(deckElement).toBeTruthy();
      expect(deckElement.getAttribute("data-deck-id")).toBe("basic-deck");

      const styleElement = document.querySelector("style[scoped]");
      expect(styleElement).toBeTruthy();

      const slideElements = document.querySelectorAll(".slide");
      expect(slideElements.length).toBe(1);
      expect(slideElements[0].getAttribute("data-slide-id")).toBe("slide1");
    });

    it("does not generate full HTML document", () => {
      const result = html(testDecks.basic);
      expect(result).not.toContain("<!DOCTYPE html>");
      expect(result).not.toContain("<html>");
      expect(result).not.toContain("<body>");
    });
  });

  describe("Slide dimensions and styling", () => {
    it("applies correct slide dimensions from basic deck", () => {
      const result = html(testDecks.basic);
      expect(result).toContain("width: 1280px");
      expect(result).toContain("height: 720px");
    });

    it("handles custom slide dimensions and units", () => {
      const customDeck = {
        ...testDecks.basic,
        slide_size: { w: 16, h: 9, unit: "rem" },
      };
      const result = html(customDeck);
      expect(result).toContain("width: 16rem");
      expect(result).toContain("height: 9rem");
    });

    it("applies fonts and colors from deck root", () => {
      const result = html(testDecks.corporate);
      expect(result).toContain("font-family: Inter");
      expect(result).toContain("background: #ffffff");
      expect(result).toContain("color: #0f172a");
    });
  });

  describe("Text shapes and content", () => {
    it("renders text shapes with proper content from basic deck", () => {
      const result = html(testDecks.basic);
      document.body.innerHTML = result;

      const textElement = document.querySelector(".text-shape");
      expect(textElement).toBeTruthy();
      expect(textElement.textContent).toBe("Welcome!");
    });

    it("applies text styling properties from corporate deck", () => {
      const result = html(testDecks.corporate);
      document.body.innerHTML = result;

      // Find the title text element by looking for the specific content
      const textElements = document.querySelectorAll(".text-shape");
      const titleElement = [...textElements].find((el) => el.textContent === "Q4 Business Review");
      expect(titleElement).toBeTruthy();
      expect(titleElement.textContent).toBe("Q4 Business Review");

      expect(result).toContain("font-weight: 700");
      expect(result).toContain("font-size: 52px");
      expect(result).toContain("text-align: center");
    });

    it("handles text alignment", () => {
      const result = html(testDecks.basic);
      expect(result).toContain("text-align: center");
    });

    it("escapes HTML in text content", () => {
      const maliciousDeck = {
        ...testDecks.basic,
        slides: [
          {
            ...testDecks.basic.slides[0],
            shapes: { title: { text: "<script>alert('xss')</script>" } },
          },
        ],
      };
      const result = html(maliciousDeck);
      document.body.innerHTML = result;

      expect(result).toContain("&lt;script&gt;");
      expect(result).not.toContain("<script>alert");
    });
  });

  describe("Image shapes", () => {
    it("renders image shapes with proper attributes from image deck", () => {
      const result = html(testDecks.image);
      document.body.innerHTML = result;

      const imageElements = document.querySelectorAll("img");
      expect(imageElements.length).toBeGreaterThan(0);

      const mainImage = imageElements[0];
      expect(mainImage).toBeTruthy();
      expect(mainImage.src).toBe("https://placehold.co/600x400/10b981/ffffff?text=Product+Photo");
    });

    it("applies image fit modes", () => {
      const result = html(testDecks.image);
      expect(result).toContain("object-fit: cover");
    });
  });

  describe("List shapes", () => {
    it("renders list shapes as HTML lists from corporate deck", () => {
      const result = html(testDecks.corporate);
      document.body.innerHTML = result;

      const listElement = document.querySelector("ul");
      expect(listElement).toBeTruthy();

      const listItems = document.querySelectorAll("li");
      expect(listItems.length).toBe(4);
      expect(listItems[0].textContent).toBe("Revenue growth of 23% YoY");
      expect(listItems[1].textContent).toBe("Expanded to 3 new markets");
    });

    it("applies list styling", () => {
      const result = html(testDecks.corporate);
      expect(result).toContain("font-size: 24px");
      expect(result).toContain("line-height: 1.6");
    });
  });

  describe("Text interpolation", () => {
    it("interpolates variables in text from corporate deck", () => {
      const result = html(testDecks.corporate);
      document.body.innerHTML = result;

      // Footer should be the root shape, so it should appear in the HTML
      const textElements = document.querySelectorAll(".text-shape");
      const footerText = [...textElements].find((el) => el.textContent.includes("ACME Corp"));
      expect(footerText).toBeTruthy();
      expect(footerText.textContent).toBe("ACME Corp | December 2024");
    });
  });

  describe("Background handling", () => {
    it("applies layout background fill", () => {
      const result = html(testDecks.basic);
      expect(result).toContain("background-color: #ffffff");
    });

    it("applies background images from image deck", () => {
      const result = html(testDecks.image);
      document.body.innerHTML = result;

      const slideElements = document.querySelectorAll(".slide");
      expect(slideElements.length).toBeGreaterThan(0);

      // Check that root background images are applied as background div elements
      const backgroundElements = document.querySelectorAll(".background");
      expect(backgroundElements.length).toBeGreaterThan(0);
      expect(result).toContain("background-image: url('https://placehold.co/1280x720/e2e8f0/64748b?text=Background')");
      expect(result).toContain("background-size: cover");
    });

    it("handles background inheritance", () => {
      const result = html(testDecks.corporate);
      document.body.innerHTML = result;

      const slideElements = document.querySelectorAll(".slide");
      expect(slideElements.length).toBeGreaterThan(0);
    });
  });

  describe("Shape positioning and z-ordering", () => {
    it("applies percentage-based positioning", () => {
      const result = html(testDecks.basic);
      expect(result).toContain("left: 10%");
      expect(result).toContain("top: 30%");
      expect(result).toContain("width: 80%");
      expect(result).toContain("height: 20%");
    });

    it("handles z-index and opacity from root shapes", () => {
      const result = html(testDecks.corporate);
      document.body.innerHTML = result;

      // Check for z-index in the output
      expect(result).toMatch(/z-index:\s*\d+/);
    });

    it("renders shapes in z-order", () => {
      const testDeckWithZIndex = {
        ...testDecks.basic,
        shapes: {
          overlay: {
            id: "overlay",
            type: "text",
            text: "Overlay",
            x: 0,
            y: 0,
            w: 100,
            h: 100,
            unit: "%",
            z: 999,
            opacity: 0.8,
          },
        },
      };
      const result = html(testDeckWithZIndex);
      expect(result).toContain("z-index: 999");
      expect(result).toContain("opacity: 0.8");
    });
  });

  describe("Shape merging", () => {
    it("merges shapes from root, layout, and slide levels", () => {
      const testDeck = {
        version: "1.0.0",
        shapes: {
          root_shape: { id: "root_shape", type: "text", text: "Root", x: 0, y: 0, w: 100, h: 10, unit: "%", z: 1 },
        },
        layouts: {
          test_layout: {
            name: "Test Layout",
            shapes: {
              layout_shape: {
                id: "layout_shape",
                type: "text",
                text: "Layout",
                x: 0,
                y: 20,
                w: 100,
                h: 10,
                unit: "%",
                z: 2,
              },
              root_shape: { text: "Root Override from Layout" },
            },
          },
        },
        slides: [
          {
            id: "test_slide",
            layout: "test_layout",
            shapes: {
              slide_shape: {
                id: "slide_shape",
                type: "text",
                text: "Slide",
                x: 0,
                y: 40,
                w: 100,
                h: 10,
                unit: "%",
                z: 3,
              },
              root_shape: { text: "Final Override from Slide" },
            },
          },
        ],
      };
      const result = html(testDeck);
      expect(result).toContain("Final Override from Slide");
      expect(result).toContain("Layout");
      expect(result).toContain("Slide");
    });
  });

  describe("Error handling", () => {
    it("handles missing layouts gracefully", () => {
      const deckWithBadLayout = {
        ...testDecks.basic,
        slides: [
          {
            ...testDecks.basic.slides[0],
            layout: "non-existent",
          },
        ],
      };
      const result = html(deckWithBadLayout);
      document.body.innerHTML = result;

      const slideElements = document.querySelectorAll(".slide");
      expect(slideElements.length).toBe(0);
    });
  });

  describe("Default values", () => {
    it("applies default dimensions when not specified", () => {
      const result = html(testDecks.minimal);
      expect(result).toContain("width: 1280px");
      expect(result).toContain("height: 720px");
    });

    it("applies default fonts and colors when minimal", () => {
      const result = html(testDecks.minimal);
      expect(result).toContain("font-family: Arial");
      expect(result).toContain("background: #ffffff");
    });
  });

  describe("Additional positioning features", () => {
    it("handles different units (em, rem)", () => {
      const customDeck = {
        ...testDecks.basic,
        layouts: {
          "title-only": {
            ...testDecks.basic.layouts["title-only"],
            shapes: {
              title: {
                ...testDecks.basic.layouts["title-only"].shapes.title,
                unit: "em",
                x: 2,
                y: 3,
                w: 10,
                h: 5,
              },
            },
          },
        },
      };
      const result = html(customDeck);
      expect(result).toContain("left: 2em");
      expect(result).toContain("top: 3em");
      expect(result).toContain("width: 10em");
      expect(result).toContain("height: 5em");
    });

    it("handles line-height styling", () => {
      const result = html(testDecks.corporate);
      expect(result).toContain("line-height: 1.6");
    });
  });

  describe("Multiple slides handling", () => {
    it("processes all slides in corporate deck", () => {
      const result = html(testDecks.corporate);
      document.body.innerHTML = result;

      const slideElements = document.querySelectorAll(".slide");
      expect(slideElements.length).toBe(2);
      expect(slideElements[0].getAttribute("data-slide-id")).toBe("title");
      expect(slideElements[1].getAttribute("data-slide-id")).toBe("content1");
    });

    it("processes all slides in image deck", () => {
      const result = html(testDecks.image);
      document.body.innerHTML = result;

      const slideElements = document.querySelectorAll(".slide");
      expect(slideElements.length).toBe(2);
      expect(slideElements[0].getAttribute("data-slide-id")).toBe("photo1");
      expect(slideElements[1].getAttribute("data-slide-id")).toBe("photo2");
    });
  });

  describe("SVG Shapes", () => {
    it("renders SVG shapes correctly", () => {
      const result = html(testDecks.shapes);
      document.body.innerHTML = result;

      const deckElement = document.querySelector(".slidegen-deck");
      expect(deckElement).toBeTruthy();

      const slideElements = document.querySelectorAll(".slide");
      expect(slideElements.length).toBe(4); // Now has 4 slides with different shape categories
    });

    it("generates proper SVG elements for basic shapes", () => {
      const result = html(testDecks.shapes);
      document.body.innerHTML = result;

      const svgElements = document.querySelectorAll("svg");
      expect(svgElements.length).toBeGreaterThan(0);

      const pathElements = document.querySelectorAll("svg path");
      expect(pathElements.length).toBeGreaterThan(0);
    });

    it("applies fill and stroke colors to SVG shapes", () => {
      const result = html(testDecks.shapes);
      expect(result).toContain('fill="#2563eb"');
      expect(result).toContain('fill="#16a34a"');
      expect(result).toContain('fill="#dc2626"');
      expect(result).toContain('stroke="#ca8a04"');
    });

    it("includes text labels in SVG shapes", () => {
      const result = html(testDecks.shapes);
      document.body.innerHTML = result;

      // Text is now in text overlay divs, not in SVG
      const textOverlays = document.querySelectorAll(".text-overlay");
      expect(textOverlays.length).toBeGreaterThan(0);

      const rectangleText = [...textOverlays].find((el) => el.textContent === "Rectangle");
      expect(rectangleText).toBeTruthy();
      expect(rectangleText.style.color).toBe("#ffffff");
    });

    it("generates different SVG paths for different shape types", () => {
      const result = html(testDecks.shapes);
      // Paths are now responsive, so check for different shape indicators
      expect(result).toContain('viewBox="0 0'); // responsive viewBox
      expect(result).toContain('<path d="M'); // paths start with M (move command)
      expect(result).toContain('fill="#2563eb"'); // rectangle fill
      expect(result).toContain('fill="#16a34a"'); // rounded rectangle fill
    });

    it("applies proper CSS classes to SVG shapes", () => {
      const result = html(testDecks.shapes);
      expect(result).toContain('class="shape svg-shape"');
    });

    it("handles SVG shapes without text", () => {
      const testShape = {
        version: "1.0.0",
        layouts: {
          "title-only": {
            name: "Title Only",
            shapes: {
              "simple-rect": {
                id: "simple-rect",
                type: "rectangle",
                x: 10,
                y: 10,
                w: 50,
                h: 30,
                unit: "%",
                fill: "#ff0000",
              },
            },
          },
        },
        slides: [
          {
            id: "test-slide",
            layout: "title-only",
          },
        ],
      };
      const result = html(testShape);
      document.body.innerHTML = result;

      const svgElement = document.querySelector("svg");
      expect(svgElement).toBeTruthy();

      // Text should not be in SVG (moved to text overlay)
      const textElement = document.querySelector("svg text");
      expect(textElement).toBeFalsy();

      // No text overlay should exist since no text was provided
      const textOverlay = document.querySelector(".text-overlay");
      expect(textOverlay).toBeFalsy();
    });

    it("handles stroke width for SVG shapes", () => {
      const result = html(testDecks.shapes);
      expect(result).toContain('stroke-width="0.2"');
    });

    it("supports enhanced border properties", () => {
      const result = html(testDecks.shapes);
      expect(result).toContain('stroke-dasharray="5,5"');
      expect(result).toContain('stroke-linecap="round"');
      expect(result).toContain('stroke-linejoin="round"');
      expect(result).toContain('stroke-opacity="0.7"');
    });

    it("supports all shape types", () => {
      const shapeTypes = [
        "rectangle",
        "rounded-rectangle",
        "ellipse",
        "arrow-right",
        "arrow-left",
        "arrow-up",
        "arrow-down",
        "diamond",
        "triangle",
        "hexagon",
        "pentagon",
        "speech-bubble",
        "chevron",
      ];

      shapeTypes.forEach((shapeType) => {
        const testDeck = {
          ...testDecks.basic,
          layouts: {
            "test-layout": {
              name: "Test Layout",
              shapes: {
                "test-shape": {
                  id: "test-shape",
                  type: shapeType,
                  x: 10,
                  y: 10,
                  w: 50,
                  h: 30,
                  unit: "%",
                  fill: "#2563eb",
                  text: "Test",
                },
              },
            },
          },
          slides: [
            {
              id: "test-slide",
              layout: "test-layout",
            },
          ],
        };

        const result = html(testDeck);
        expect(result).toContain("svg");
        expect(result).toContain("path");
        expect(result).toContain("Test");
      });
    });

    it("positions SVG shapes correctly with percentage units", () => {
      const result = html(testDecks.shapes);
      expect(result).toContain("left: 5%");
      expect(result).toContain("top: 15%");
      expect(result).toContain("width: 18%");
      expect(result).toContain("height: 12%");
    });

    it("handles text color and size in SVG shapes", () => {
      const result = html(testDecks.shapes);
      // Text styling is now in text overlay divs
      expect(result).toContain("font-size: 12px");
      expect(result).toContain("color: #ffffff");
    });

    it("supports slide-specific shapes", () => {
      const testDeckWithSlideShapes = {
        ...testDecks.basic,
        layouts: {
          "title-only": {
            name: "Title Only",
            shapes: {}, // No layout shapes
          },
        },
        slides: [
          {
            id: "slide-with-shapes",
            layout: "title-only",
            shapes: {
              "slide-rect": {
                id: "slide-rect",
                type: "rectangle",
                x: 10,
                y: 10,
                w: 50,
                h: 30,
                unit: "%",
                fill: "#2563eb",
                text: "Slide Shape",
                text_color: "#ffffff",
              },
              "slide-ellipse": {
                id: "slide-ellipse",
                type: "ellipse",
                x: 10,
                y: 50,
                w: 50,
                h: 30,
                unit: "%",
                fill: "#16a34a",
                text: "Another Slide Shape",
                text_color: "#ffffff",
              },
            },
          },
        ],
      };

      const result = html(testDeckWithSlideShapes);
      document.body.innerHTML = result;

      const svgElements = document.querySelectorAll("svg");
      expect(svgElements.length).toBe(2); // Two slide-specific shapes

      const textOverlays = document.querySelectorAll(".text-overlay");
      const slideShapeText = [...textOverlays].find((el) => el.textContent === "Slide Shape");
      const anotherSlideShapeText = [...textOverlays].find((el) => el.textContent === "Another Slide Shape");

      expect(slideShapeText).toBeTruthy();
      expect(anotherSlideShapeText).toBeTruthy();
    });
  });

  describe("Text wrapping and responsive shapes", () => {
    it("places text outside SVG in text overlay div", () => {
      const result = html(testDecks.shapes);
      document.body.innerHTML = result;

      const svgShapes = document.querySelectorAll(".svg-shape");
      expect(svgShapes.length).toBeGreaterThan(0);

      // Check that text is in text-overlay div, not in SVG
      const textOverlays = document.querySelectorAll(".text-overlay");
      expect(textOverlays.length).toBeGreaterThan(0);

      // Verify SVG doesn't contain text elements (moved outside)
      const svgTextElements = document.querySelectorAll("svg text");
      expect(svgTextElements.length).toBe(0);
    });

    it("applies proper positioning for text overlay", () => {
      const result = html(testDecks.shapes);
      expect(result).toContain('class="text-overlay"');
      expect(result).toContain("position: absolute");
      expect(result).toContain("width: 100%");
      expect(result).toContain("height: 100%");
    });

    it("handles long text that should wrap", () => {
      const result = html(testDecks.shapes);
      document.body.innerHTML = result;

      // Find the shape with long text
      const textOverlays = document.querySelectorAll(".text-overlay");
      const longTextOverlay = [...textOverlays].find((el) => el.textContent.includes("Long text that wraps nicely"));
      expect(longTextOverlay).toBeTruthy();
      expect(longTextOverlay.textContent).toContain("Long text that wraps nicely");
    });

    it("generates responsive SVG paths based on width and height", () => {
      const result = html(testDecks.shapes);
      document.body.innerHTML = result;

      const svgElements = document.querySelectorAll("svg");
      expect(svgElements.length).toBeGreaterThan(0);

      // Check that SVG uses preserveAspectRatio="none" for responsive behavior
      const svgElement = svgElements[0];
      expect(svgElement.getAttribute("preserveAspectRatio")).toBe("none");
    });

    it("uses shape-specific parameters in path generation", () => {
      // Create a test with specific shape parameters
      const testDeck = {
        ...testDecks.basic,
        layouts: {
          "param-test": {
            name: "Param Test",
            shapes: {
              "rounded-test": {
                id: "rounded-test",
                type: "rounded-rectangle",
                x: 10,
                y: 10,
                w: 50,
                h: 30,
                unit: "%",
                fill: "#2563eb",
                text: "Curved",
                curvature: 25,
              },
              "arrow-test": {
                id: "arrow-test",
                type: "arrow-right",
                x: 10,
                y: 50,
                w: 50,
                h: 20,
                unit: "%",
                fill: "#16a34a",
                text: "Arrow",
                tipSize: 30,
                stemSize: 50,
              },
            },
          },
        },
        slides: [
          {
            id: "param-slide",
            layout: "param-test",
          },
        ],
      };

      const result = html(testDeck);
      document.body.innerHTML = result;

      const svgElements = document.querySelectorAll("svg");
      expect(svgElements.length).toBe(2);

      // The SVG paths should use responsive dimensions rather than fixed 100x100
      const pathElements = document.querySelectorAll("svg path");
      expect(pathElements.length).toBe(2);
    });
  });
});
