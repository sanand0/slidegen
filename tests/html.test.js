import { describe, it, beforeEach, expect } from "vitest";
import html, { generateScopedCSS, generateSlideHTML } from "../slideforge.js";
import { setupDom, parseCss, ruleDecls } from "./test-utils.js";

describe("html + scoped CSS + slide HTML", () => {
  beforeEach(setupDom);

  it("html(deck): basic structure, defaults, and rendering", () => {
    const deck = {
      id: "demo",
      fonts: { body: "Inter" },
      colors: { bg: "#fafafa" },
      slide_size: { w: 800, h: 450, unit: "px" },
      layouts: {
        a: {
          name: "A",
          bg: { fill: "#ffffff" },
          shapes: {
            t: { id: "t", type: "text", x: 10, y: 10, w: 80, h: 10, unit: "%", text: "Hello", text_align: "left" },
          },
        },
      },
      slides: [
        { id: "s1", layout: "a", meta: { who: "World" } },
        { id: "s2", layout: "a", shapes: { t: { text: "Hi {who}" } }, meta: { who: "Viewer" } },
        { id: "bad", layout: "missing" },
      ],
    };

    const out = html(deck);
    document.body.innerHTML = out;

    // Container + attributes
    const deckEl = document.querySelector(".slideforge-deck");
    expect(deckEl.getAttribute("data-deck-id")).toBe("demo");

    // Scoped style present with right dimensions and font/background
    const styleEl = document.querySelector("style");
    const root = parseCss(styleEl.textContent);
    const deckDecl = ruleDecls(root, ".slideforge-deck");
    const slideDecl = ruleDecls(root, ".slideforge-deck .slide");
    expect(slideDecl.width).toBe("800px");
    expect(slideDecl.height).toBe("450px");
    expect(slideDecl.background).toBe("#fafafa");
    expect(deckDecl["font-family"]).toContain("Inter");

    // Slides rendered; bad layout skipped
    const slides = [...document.querySelectorAll(".slide")];
    expect(slides.map((s) => s.getAttribute("data-slide-id"))).toEqual(["s1", "s2"]);

    // Contains text content, alignment, and interpolation for s2
    const slide1Text = document.querySelector('.slide[data-slide-id="s1"] .text-shape');
    const slide2Text = document.querySelector('.slide[data-slide-id="s2"] .text-shape');
    expect(slide1Text.textContent).toBe("Hello");
    expect(slide1Text.getAttribute("style")).toContain("text-align: left");
    expect(slide2Text.textContent).toBe("Hi Viewer");
  });

  it("html(deck): default slide_size + minimal deck", () => {
    const deck = { layouts: { l: { name: "L", shapes: {} } }, slides: [{ id: "x", layout: "l" }] };
    const out = html(deck);
    document.body.innerHTML = out;
    const styleEl = document.querySelector("style");
    const root = parseCss(styleEl.textContent);
    const slideDecl = ruleDecls(root, ".slideforge-deck .slide");
    expect(slideDecl.width).toBe("1280px");
    expect(slideDecl.height).toBe("720px");
  });

  it("generateScopedCSS: uses defaults and provided values", () => {
    const css1 = generateScopedCSS(undefined, undefined, undefined);
    const root1 = parseCss(css1);
    const deckDecl1 = ruleDecls(root1, ".slideforge-deck");
    const slideDecl1 = ruleDecls(root1, ".slideforge-deck .slide");
    const imgDecl1 = ruleDecls(root1, ".slideforge-deck .image-shape img");
    const listDecl1 = ruleDecls(root1, ".slideforge-deck .list-shape ul");
    const overlayDecl1 = ruleDecls(root1, ".slideforge-deck .svg-shape .text-shape");
    expect(slideDecl1.width).toBe("1280px");
    expect(slideDecl1.height).toBe("720px");
    expect(deckDecl1["font-family"]).toContain("Arial");
    expect(slideDecl1.background).toBe("#ffffff");
    expect(imgDecl1["object-fit"]).toBe("contain");
    expect(listDecl1["list-style"]).toBe("none");
    expect(overlayDecl1["align-items"]).toBe("center");
    expect(overlayDecl1["justify-content"]).toBe("center");

    const css2 = generateScopedCSS({ w: 16, h: 9, unit: "rem" }, { bg: "#eee" }, { body: "System UI" });
    const root2 = parseCss(css2);
    const deckDecl2 = ruleDecls(root2, ".slideforge-deck");
    const slideDecl2 = ruleDecls(root2, ".slideforge-deck .slide");
    expect(slideDecl2.width).toBe("16rem");
    expect(slideDecl2.height).toBe("9rem");
    expect(deckDecl2["font-family"]).toContain("System UI");
    expect(slideDecl2.background).toBe("#eee");
  });

  it("generateSlideHTML: background precedence + shape merge + z-order", () => {
    const deck = {
      shapes: {
        a: { id: "a", type: "text", z: 1, x: 0, y: 0, w: 10, h: 10, unit: "%", text: "root" },
      },
      layouts: {
        L: {
          name: "L",
          bg: { fill: "#111" },
          shapes: {
            a: { text: "layout" },
            b: { id: "b", type: "text", z: 2, x: 0, y: 10, w: 10, h: 10, unit: "%", text: "layout-b" },
          },
        },
      },
    };
    const slide = {
      id: "s",
      layout: "L",
      bg: { image: "http://x/y.png", image_fit: "contain" },
      shapes: {
        a: { text: "slide" },
        c: { id: "c", type: "text", z: 0, x: 0, y: 20, w: 10, h: 10, unit: "%", text: "slide-c" },
      },
      meta: { who: "X" },
    };

    const wrap = document.createElement("div");
    wrap.innerHTML = generateSlideHTML(slide, deck);

    // Background div present with image and fit
    const slideEl = wrap.querySelector(".slide");
    expect(slideEl).toBeTruthy();
    const bgStyle = slideEl.getAttribute("style");
    expect(bgStyle).toContain("background-image: url('http://x/y.png')");
    expect(bgStyle).toContain("background-size: contain");

    // Merge precedence and z-order (c:0, a:1, b:2)
    const order = [...wrap.querySelectorAll(".shape")].map((el) => el.getAttribute("data-shape-id"));
    expect(order).toEqual(["c", "a", "b"]);
  });
});
