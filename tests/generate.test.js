import { describe, it, beforeEach, expect } from "vitest";
import { setupDom, toContainer, styleDecls } from "./test-utils.js";
import {
  generateBackground,
  generateShapeHTML,
  generateTextShape,
  generateImageShape,
  generateListShape,
  generateSVGShape,
} from "../slideforge.js";

describe("generate*: background + shapes", () => {
  beforeEach(setupDom);

  it("generateBackground: returns inline style for fill/image", () => {
    expect(generateBackground(undefined)).toBe("");

    let style = generateBackground({ fill: "#abc" });
    let div = toContainer(`<div class="slide" style="${style}"></div>`);
    const fillDecl = styleDecls(div.querySelector(".slide"));
    expect(fillDecl["background-color"]).toBe("#abc");

    style = generateBackground({ image: "https://img/x.png" });
    div = toContainer(`<div class="slide" style="${style}"></div>`);
    const imgDecl = styleDecls(div.querySelector(".slide"));
    expect(imgDecl["background-image"]).toBe("url('https://img/x.png')");
    expect(imgDecl["background-size"]).toBe("cover");
    expect(imgDecl["background-position"]).toBe("center");
    expect(imgDecl["background-repeat"]).toBe("no-repeat");

    style = generateBackground({ image: "https://img/x.png", image_fit: "contain" });
    div = toContainer(`<div class="slide" style="${style}"></div>`);
    const containDecl = styleDecls(div.querySelector(".slide"));
    expect(containDecl["background-size"]).toBe("contain");
  });

  it("generateShapeHTML: dispatches by type + positioning + data attrs + alignment", () => {
    const meta = { who: "World" };
    const base = { x: 1, y: 2, w: 3, h: 4, unit: "em", z: 5, opacity: 0.7 };

    const textWrap = toContainer(
      generateShapeHTML({ ...base, type: "text", text: "Hello {who}", text_align: "center" }, "t", meta),
    );
    const textEl = textWrap.querySelector(".text-shape");
    expect(textEl.textContent).toBe("Hello World");
    const textDecl = styleDecls(textEl);
    expect(textDecl["text-align"]).toBe("center");

    const imgWrap = toContainer(
      generateShapeHTML({ ...base, type: "image", image_src: "/a.png", image_fit: "fill" }, "i", meta),
    );
    const imgEl = imgWrap.querySelector(".image-shape img");
    expect(imgEl.getAttribute("src")).toBe("/a.png");
    const imgDecl2 = styleDecls(imgEl);
    expect(imgDecl2["object-fit"]).toBe("fill");

    const listWrap = toContainer(generateShapeHTML({ ...base, type: "list", items: ["A", "B"] }, "l", meta));
    const lis = listWrap.querySelectorAll(".list-shape li");
    expect(lis[0].textContent).toBe("A");
    expect(lis[1].textContent).toBe("B");

    const svgWrap = toContainer(generateShapeHTML({ ...base, type: "rectangle", fill: "#000", text: "x" }, "r", meta));
    svgWrap.querySelector(".svg-shape svg");
    const pathFromWrap = svgWrap.querySelector(".svg-shape path");
    expect(pathFromWrap.getAttribute("d")).toMatch(/^\s*M/);

    // Positioning/z/opacity/data attrs
    [textWrap, imgWrap, listWrap, svgWrap].forEach((wrap) => {
      const el = wrap.querySelector(".shape");
      const dec = styleDecls(el);
      expect(dec.left).toBe("1em");
      expect(dec.top).toBe("2em");
      expect(dec.width).toBe("3em");
      expect(dec.height).toBe("4em");
      expect(dec["z-index"]).toBe("5");
      expect(dec.opacity).toBe("0.7");
      expect(el.getAttribute("data-shape-id")).toMatch(/^[tilr]$/);
      expect(el.getAttribute("data-shape-type")).toMatch(/^(text|image|list|rectangle)$/);
    });

    // Alignment checks
    const textWrapDecl = styleDecls(textWrap.querySelector(".text-shape"));
    expect(textWrapDecl["justify-content"]).toBe("center");
    expect(textWrapDecl["align-items"]).toBe("flex-start");

    const listWrapDecl = styleDecls(listWrap.querySelector(".list-shape"));
    expect(listWrapDecl["justify-content"]).toBe("flex-start");
    expect(listWrapDecl["align-items"]).toBe("center");

    const svgOverlayDecl = styleDecls(svgWrap.querySelector(".svg-shape .text-shape"));
    expect(svgOverlayDecl["justify-content"]).toBe("center");
    expect(svgOverlayDecl["align-items"]).toBe("center");
  });

  it("generateShapeHTML: unknown/rect types are not rendered", () => {
    const base = { x: 0, y: 0, w: 10, h: 10, unit: "%" };
    const bad1 = generateShapeHTML({ ...base, type: "rect" }, "x", {});
    const bad2 = generateShapeHTML({ ...base, type: "not-a-shape" }, "y", {});
    expect(bad1).toBe("");
    expect(bad2).toBe("");
  });

  it("default alignment: text left+top; list left+middle; svg overlay center+middle", () => {
    const base = { x: 0, y: 0, w: 10, h: 10, unit: "%" };
    const textWrap = toContainer(generateShapeHTML({ ...base, type: "text", text: "X" }, "t0", {}));
    const listWrap = toContainer(generateShapeHTML({ ...base, type: "list", items: ["A"] }, "l0", {}));
    const svgWrap = toContainer(generateShapeHTML({ ...base, type: "rectangle", text: "S" }, "r0", {}));
    const textDec = styleDecls(textWrap.querySelector(".text-shape"));
    expect(textDec["justify-content"]).toBe("flex-start");
    expect(textDec["align-items"]).toBe("flex-start");
    const listDec = styleDecls(listWrap.querySelector(".list-shape"));
    expect(listDec["justify-content"]).toBe("flex-start");
    expect(listDec["align-items"]).toBe("center");
    const svgDec = styleDecls(svgWrap.querySelector(".svg-shape .text-shape"));
    expect(svgDec["justify-content"]).toBe("center");
    expect(svgDec["align-items"]).toBe("center");
  });

  it("generateTextShape: styling, interpolation, and escaping", () => {
    const style = "left:0;top:0;width:10%;height:10%;";
    const meta = { org: "ACME" };
    const shape = {
      id: "t",
      type: "text",
      text: "<b>{org}</b>",
      text_font: "Inter",
      text_size: 20,
      text_weight: 700,
      text_color: "#123",
      text_align: "right",
      line_height: 1.4,
    };
    const wrap = toContainer(generateTextShape(shape, style, meta, 'data-x="1"'));
    const el = wrap.querySelector(".text-shape");
    const dec = styleDecls(el);
    expect(dec["font-family"]).toContain("Inter");
    expect(dec["font-size"]).toBe("20px");
    expect(dec["font-weight"]).toBe("700");
    expect(dec.color).toBe("#123");
    expect(dec["text-align"]).toBe("right");
    expect(dec["line-height"]).toBe("1.4");
    expect(el.textContent).toBe("<b>ACME</b>");
  });

  it("generateImageShape: renders img with optional fit and empty alt", () => {
    const style = "left:0;top:0;width:10%;height:10%;";
    const wrap1 = toContainer(generateImageShape({ id: "i1", type: "image", image_src: "/x.png" }, style));
    const img1 = wrap1.querySelector("img");
    expect(img1.getAttribute("src")).toBe("/x.png");
    expect(img1.getAttribute("alt")).toBe("");
    const wrap2 = toContainer(
      generateImageShape({ id: "i2", type: "image", image_src: "/y.png", image_fit: "cover" }, style),
    );
    const img2 = wrap2.querySelector("img");
    const img2Dec = styleDecls(img2);
    expect(img2Dec["object-fit"]).toBe("cover");
  });

  it("generateListShape: renders items via text-shape and bullet prefix", () => {
    const style = "left:0;top:0;width:10%;height:10%;";
    const shape = {
      id: "l",
      type: "list",
      items: ["<i>A</i>", "B"],
      text_font: "Inter",
      text_size: 14,
      line_height: 1.6,
      text_color: "#333",
      bullet: "•",
    };
    const wrap = toContainer(generateListShape(shape, style));
    const lis = wrap.querySelectorAll(".list-shape li");
    expect(lis[0].textContent).toBe("• <i>A</i>");
    expect(lis[1].textContent).toBe("• B");
    const item = lis[0];
    const idec = styleDecls(item);
    expect(idec["font-family"]).toContain("Inter");
    expect(idec["font-size"]).toBe("14px");
    expect(idec["line-height"]).toBe("1.6");
    expect(idec.color).toBe("#333");
    expect(lis[0].textContent.startsWith("• ")).toBe(true);
  });

  it("palette color + font resolution for text, list, and svg shapes", () => {
    const colors = { accent1: "#112233", accent2: "#445566", accent3: "#778899" };
    const fonts = { heading: "Inter", body: "System UI" };

    // Text color via palette
    const textShape = { id: "t", type: "text", text: "X", text_color: "accent1", text_size: 10, text_font: "heading" };
    const textWrap = toContainer(generateTextShape(textShape, "", {}, "", colors, fonts));
    const textDecl = styleDecls(textWrap.querySelector(".text-shape"));
    expect(textDecl.color).toBe("#112233");
    expect(textDecl["font-family"]).toContain("Inter");

    // List color via palette
    const listShape = { id: "l", type: "list", items: ["A"], text_color: "accent2", text_font: "body" };
    const listWrap = toContainer(generateListShape(listShape, "", "", colors, fonts));
    const listItemDecl = styleDecls(listWrap.querySelector(".list-shape li"));
    expect(listItemDecl.color).toBe("#445566");
    expect(listItemDecl["font-family"]).toContain("System UI");

    // SVG fill/stroke/text via palette
    const svgShape = {
      id: "s",
      type: "rectangle",
      w: 10,
      h: 5,
      unit: "%",
      fill: "accent1",
      stroke: "accent2",
      stroke_width: 0.5,
      text: "Lbl",
      text_color: "accent3",
      text_size: 10,
    };
    const svgWrap = toContainer(generateSVGShape(svgShape, "left:0;top:0;width:10%;height:5%;", {}, "", colors, fonts));
    const path = svgWrap.querySelector("path");
    expect(path.getAttribute("fill")).toBe("#112233");
    expect(path.getAttribute("stroke")).toBe("#445566");
    const overlayDecl = styleDecls(svgWrap.querySelector(".svg-shape .text-shape"));
    expect(overlayDecl.color).toBe("#778899");
    // overlay should inherit font resolution if text_font is provided
    // (not provided above, but ensure passing text_font works)
    const svgWrap2 = toContainer(
      generateSVGShape(
        { ...svgShape, text_font: "heading" },
        "left:0;top:0;width:10%;height:5%;",
        {},
        "",
        colors,
        fonts,
      ),
    );
    const overlayDecl2 = styleDecls(svgWrap2.querySelector(".svg-shape .text-shape"));
    expect(overlayDecl2["font-family"]).toContain("Inter");
  });

  it("generateSVGShape: fill/stroke, overlay text, and all shape types", () => {
    const style = "left:0;top:0;width:18%;height:12%;";
    const meta = { label: "LBL" };

    const base = {
      id: "s",
      x: 5,
      y: 5,
      w: 18,
      h: 12,
      unit: "%",
      fill: "#2563eb",
      text: "{label}",
      text_color: "#fff",
      text_size: 12,
      text_font: "Inter",
      text_weight: 700,
      text_align: "right",
      line_height: 1.3,
    };
    const types = [
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
      "speech-bubble",
      "chevron-start",
      "chevron",
    ];

    types.forEach((t) => {
      const wrap = toContainer(
        generateSVGShape(
          {
            ...base,
            type: t,
            stroke: "#111",
            stroke_width: 0.2,
            stroke_dasharray: "5,5",
            stroke_linecap: "round",
            stroke_linejoin: "round",
            stroke_opacity: 0.7,
            margin: 2,
            curvature: 4,
            tipSize: 8,
            stemSize: 3,
          },
          style,
          meta,
        ),
      );
      const svg = wrap.querySelector("svg");
      const path = wrap.querySelector("path");
      expect(svg.getAttribute("viewBox")).toBe("0 0 18 12");
      expect(svg.getAttribute("preserveAspectRatio")).toBe("none");
      expect(path.getAttribute("d")).toMatch(/^\s*M/);
      expect(path.getAttribute("fill")).toBe("#2563eb");
      expect(path.getAttribute("stroke")).toBe("#111");
      expect(path.getAttribute("stroke-width")).toBe("0.2");
      expect(path.getAttribute("stroke-dasharray")).toBe("5,5");
      expect(path.getAttribute("stroke-linecap")).toBe("round");
      expect(path.getAttribute("stroke-linejoin")).toBe("round");
      expect(path.getAttribute("stroke-opacity")).toBe("0.7");
      const overlay = wrap.querySelector(".svg-shape .text-shape");
      expect(overlay.textContent).toBe("LBL");
      const odecl = styleDecls(overlay);
      expect(odecl["font-family"]).toContain("Inter");
      expect(odecl["font-size"]).toBe("12px");
      expect(odecl["font-weight"]).toBe("700");
      expect(odecl.color).toBe("#fff");
      expect(odecl["text-align"]).toBe("right");
      expect(odecl["line-height"]).toBe("1.3");
    });

    // When stroke is none or width 0, stroke extras are omitted
    const wrapNoStroke = toContainer(
      generateSVGShape({ ...base, type: "rectangle", stroke: "none", stroke_width: 0 }, style, meta),
    );
    const pathNoStroke = wrapNoStroke.querySelector("path");
    expect(pathNoStroke.getAttribute("stroke")).toBe("none");
    expect(pathNoStroke.getAttribute("stroke-width")).toBe("0");
    expect(pathNoStroke.getAttribute("stroke-opacity")).toBe(null);

    // Rectangle path should reflect margin (starts at M{m} {m})
    const rectWrap = toContainer(generateSVGShape({ ...base, type: "rectangle", margin: 3 }, style, meta));
    expect(rectWrap.querySelector("path").getAttribute("d")).toContain("M3 3");

    // Rounded rectangle contains Q commands (quadratic curves)
    const roundedWrap = toContainer(
      generateSVGShape({ ...base, type: "rounded-rectangle", curvature: 6 }, style, meta),
    );
    expect(roundedWrap.querySelector("path").getAttribute("d")).toContain(" Q");

    // No overlay text when text missing
    const noTextWrap = document.createElement("div");
    noTextWrap.innerHTML = generateSVGShape({ ...base, type: "triangle", text: "" }, style, meta);
    expect(noTextWrap.querySelector(".svg-shape .text-shape")).toBeFalsy();
  });
});
