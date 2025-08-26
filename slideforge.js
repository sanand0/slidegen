/**
 * Convert slide deck JSON to HTML string with scoped CSS
 */
export default function html(deck) {
  if (!deck || !deck.slides) return "";
  if (deck.version && !deck.version.startsWith("1.")) return "";

  const { slide_size, colors, fonts, slides } = deck;

  // Create scoped CSS styles
  const css = generateScopedCSS(slide_size, colors, fonts);

  // Generate HTML for each slide
  const slidesHTML = slides.map((slide) => generateSlideHTML(slide, deck)).join("");

  return /* html */ `<div class="slideforge-deck" data-deck-id="${deck.id || ""}">
  <style>${css}</style>
  ${slidesHTML}
</div>`;
}

export function generateScopedCSS(slideSize, colors, fonts) {
  const { w, h, unit = "px" } = slideSize || { w: 1280, h: 720, unit: "px" };
  const deckFonts = fonts || {};

  return /* css */ `
    .slideforge-deck * { margin: 0; padding: 0; box-sizing: border-box; }
    .slideforge-deck { font-family: ${deckFonts.body || "Arial"}, sans-serif; }
    .slideforge-deck .slide {
      width: ${w}${unit};
      height: ${h}${unit};
      position: relative;
      overflow: hidden;
      background: ${(colors && colors.bg) || "#ffffff"};
    }
    .slideforge-deck .shape { position: absolute; }
    .slideforge-deck .text-shape {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      overflow-wrap: break-word;
    }
    .slideforge-deck .image-shape img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .slideforge-deck .list-shape ul { list-style: none; }
    .slideforge-deck .list-shape li {
      margin-bottom: 0.5em;
    }
    .slideforge-deck .svg-shape svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .slideforge-deck .svg-shape .text-shape {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      padding: 8px;
    }
  `;
}

export function generateSlideHTML(slide, deck) {
  const layout = deck.layouts?.[slide.layout];
  if (!layout) return "";

  // Background styles applied directly to the slide element
  const bgStyle = generateBackground(resolve("bg", deck, layout, slide));
  let slideHTML = `<div class="slide" data-slide-id="${slide.id}" style="${bgStyle}">`;

  // Merge shapes with precedence: root.shapes < layout.shapes < slide.shapes
  const mergedShapes = mergeShapes(deck.shapes, layout.shapes, slide.shapes);

  // Sort by z-index and render (preserve keys)
  const sortedEntries = Object.entries(mergedShapes).sort(([, a], [, b]) => (a.z || 0) - (b.z || 0));
  slideHTML += sortedEntries
    .map(([key, shape]) => generateShapeHTML(shape, key, slide.meta || {}, deck.colors || {}, deck.fonts || {}))
    .join("");

  slideHTML += "</div>";
  return slideHTML;
}

export function generateBackground(bg) {
  if (!bg) return "";
  let style = "";
  if (bg.fill) style += `background-color: ${bg.fill};`;
  if (bg.image) {
    style += `background-image: url('${bg.image}');`;
    style += `background-size: ${bg.image_fit || "cover"};`;
    style += `background-position: center; background-repeat: no-repeat;`;
  }
  return style;
}

export function resolve(attr, root, layout, slide) {
  return { ...root[attr], ...layout[attr], ...slide[attr] };
}

export function mergeShapes(rootShapes, layoutShapes, slideShapes) {
  const merged = {};

  if (rootShapes) for (const [id, shape] of Object.entries(rootShapes)) merged[id] = { ...shape };

  if (layoutShapes)
    for (const [id, shape] of Object.entries(layoutShapes))
      merged[id] = merged[id] ? { ...merged[id], ...shape } : { ...shape };

  if (slideShapes)
    for (const [id, shape] of Object.entries(slideShapes))
      merged[id] = merged[id] ? { ...merged[id], ...shape } : { ...shape };

  return merged;
}

export function generateShapeHTML(shape, shapeKey = "", meta = {}, colors = {}, fonts = {}) {
  const { x = 0, y = 0, w = 100, h = 100, unit = "%" } = shape;
  const baseStyle = `left: ${x}${unit}; top: ${y}${unit}; width: ${w}${unit}; height: ${h}${unit};`;
  let additionalStyle = "";

  if (shape.z !== undefined) additionalStyle += `z-index: ${shape.z};`;
  if (shape.opacity !== undefined) additionalStyle += `opacity: ${shape.opacity};`;

  const style = `${baseStyle}${additionalStyle}`;

  // Add data attributes for testing
  const dataAttributes = `data-shape-id="${shapeKey || ""}" data-shape-type="${shape.type || ""}"`;

  switch (shape.type) {
    case "text":
      return generateTextShape(shape, style, meta, dataAttributes, colors, fonts);
    case "image":
      return generateImageShape(shape, style, dataAttributes);
    case "list":
      return generateListShape(shape, style, dataAttributes, colors, fonts, meta);
    default:
      return generateSVGShape(shape, style, meta, dataAttributes, colors, fonts);
  }
}

function resolveToken(val, map) {
  if (!val) return val;
  return typeof val === "string" && map[val] ? map[val] : val;
}

function textStyle(shape, colors = {}, fonts = {}) {
  let textStyle = "";
  if (shape.text_font) textStyle += `font-family: ${resolveToken(shape.text_font, fonts)};`;
  if (shape.text_size) textStyle += `font-size: ${shape.text_size}px;`;
  if (shape.text_weight) textStyle += `font-weight: ${shape.text_weight};`;
  if (shape.text_color) textStyle += `color: ${resolveToken(shape.text_color, colors)};`;
  if (shape.text_align) textStyle += `text-align: ${shape.text_align};`;
  if (shape.line_height) textStyle += `line-height: ${shape.line_height};`;
  return textStyle;
}

function alignmentStyle(shape, defaults = { h: "left", v: "top" }) {
  const h = shape.text_align || defaults.h;
  const v = shape.text_valign || defaults.v;
  const hMap = { left: "flex-start", center: "center", right: "flex-end", justify: "space-between" };
  const vMap = { top: "flex-start", middle: "center", bottom: "flex-end" };
  return `justify-content: ${hMap[h] || hMap.left}; align-items: ${vMap[v] || vMap.top};`;
}

export function generateTextShape(shape, style, meta, dataAttributes = "", colors = {}, fonts = {}) {
  const text = interpolateText(shape.text || "", meta);
  style += alignmentStyle(shape, { h: "left", v: "top" });
  style += textStyle(shape, colors, fonts);
  return `<div class="shape text-shape" ${dataAttributes} style="${style}">${escapeHtml(text)}</div>`;
}

export function generateImageShape(shape, style, dataAttributes = "") {
  const fitStyle = shape.image_fit ? `object-fit: ${shape.image_fit};` : "";
  return `<div class="shape image-shape" ${dataAttributes} style="${style}">
    <img src="${shape.image_src || ""}" alt="${escapeHtml(shape.alt || "")}" style="${fitStyle}">
  </div>`;
}

export function generateListShape(shape, style, dataAttributes = "", colors = {}, fonts = {}, meta = {}) {
  const items = shape.items || [];
  const prefix = shape.bullet ? `${shape.bullet} ` : "";
  style += alignmentStyle(shape, { h: "left", v: "middle" });
  const itemShapes = items
    .map((item) => {
      const content = escapeHtml(interpolateText(`${prefix}${item}`, meta));
      const itemStyle = textStyle(shape, colors, fonts);
      return `<li style="${itemStyle}">${content}</li>`;
    })
    .join("");

  return /* html */ `<div class="shape list-shape" ${dataAttributes} style="${style}"><ul>${itemShapes}</ul></div>`;
}

function interpolateText(text, meta) {
  return text.replace(/\{([^}]+)\}/g, (match, key) => meta[key] || match);
}

export function generateSVGShape(shape, style, meta, dataAttributes = "", colors = {}, fonts = {}) {
  const text = shape.text ? interpolateText(shape.text, meta) : "";
  const fill = resolveToken(shape.fill || "#2563eb", colors);
  const stroke = resolveToken(shape.stroke || "none", colors);
  const strokeWidth = shape.stroke_width || 0;
  const strokeDasharray = shape.stroke_dasharray || "";
  const strokeLinecap = shape.stroke_linecap || "butt";
  const strokeLinejoin = shape.stroke_linejoin || "miter";
  const strokeOpacity = shape.stroke_opacity || 1;

  // Extract width and height from style for responsive path calculation
  const { w = 100, h = 100 } = shape;
  const svgPath = getSVGPath(shape.type, w, h, shape);
  if (!svgPath) return "";

  let strokeAttributes = `stroke="${stroke}" stroke-width="${strokeWidth}"`;
  if (stroke !== "none" && strokeWidth > 0) {
    strokeAttributes += ` stroke-opacity="${strokeOpacity}" stroke-linecap="${strokeLinecap}" stroke-linejoin="${strokeLinejoin}"`;
    if (strokeDasharray) strokeAttributes += ` stroke-dasharray="${strokeDasharray}"`;
  }

  const svgContent = /* html */ `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <path d="${svgPath}" fill="${fill}" ${strokeAttributes}/>
  </svg>`;

  let textOverlay = "";
  if (text) {
    const content = escapeHtml(text);
    let itemStyle = alignmentStyle(shape, { h: "center", v: "middle" });
    itemStyle += textStyle(shape, colors, fonts) || "text-align: center;";
    textOverlay = `<div class="shape text-shape" style="${itemStyle}">${content}</div>`;
  }
  return /* html */ `<div class="shape svg-shape" ${dataAttributes} style="${style}">${svgContent}${textOverlay}</div>`;
}

function createChevronPath(w, h, margin, tipSize) {
  const m = margin;
  const midY = h / 2;

  // Adjust tip size to prevent self-intersection
  const adjustedTip = Math.min(tipSize, w - 2 * m - 1);

  // Create symmetric chevron with centered notch
  const outerPath = [
    `M${m} ${m}`,
    `L${w - adjustedTip - m} ${m}`,
    `L${w - m} ${midY}`,
    `L${w - adjustedTip - m} ${h - m}`,
    `L${m} ${h - m}`,
    `L${m + adjustedTip} ${midY}`,
    `Z`,
  ];

  return outerPath.join(" ");
}

function createChevronStartPath(w, h, margin, tipSize) {
  const m = margin;
  const adjustedTip = Math.min(tipSize, w - 2 * m - 1);

  return [
    `M${m} ${m}`,
    `L${w - adjustedTip - m} ${m}`,
    `L${w - m} ${h / 2}`,
    `L${w - adjustedTip - m} ${h - m}`,
    `L${m} ${h - m}`,
    `Z`,
  ].join(" ");
}

function getSVGPath(type, width = 100, height = 100, shape = {}) {
  const w = width;
  const h = height;

  // Shape-specific parameters with defaults
  const margin = shape.margin || 0;
  const curvature = shape.curvature || 10;
  const tipSize = shape.tipSize || 20;
  const stemSize = shape.stemSize || 40;

  const paths = {
    rectangle: `M${margin} ${margin} L${w - margin} ${margin} L${w - margin} ${h - margin} L${margin} ${h - margin} Z`,
    "rounded-rectangle": `
      M${margin + curvature} ${margin}
      L${w - margin - curvature} ${margin}
      Q${w - margin} ${margin} ${w - margin} ${margin + curvature}
      L${w - margin} ${h - margin - curvature}
      Q${w - margin} ${h - margin} ${w - margin - curvature} ${h - margin}
      L${margin + curvature} ${h - margin}
      Q${margin} ${h - margin} ${margin} ${h - margin - curvature}
      L${margin} ${margin + curvature}
      Q${margin} ${margin} ${margin + curvature} ${margin} Z`,
    ellipse: `M${w / 2} ${margin} A${w / 2 - margin} ${h / 2 - margin} 0 1 1 ${w / 2 - 0.1} ${margin} Z`,
    "arrow-right": `
      M${margin} ${h / 2 - stemSize / 2}
      L${w - tipSize} ${h / 2 - stemSize / 2}
      L${w - tipSize} ${margin}
      L${w - margin} ${h / 2}
      L${w - tipSize} ${h - margin}
      L${w - tipSize} ${h / 2 + stemSize / 2}
      L${margin} ${h / 2 + stemSize / 2} Z`,
    "arrow-left": `
      M${w - margin} ${h / 2 - stemSize / 2}
      L${tipSize} ${h / 2 - stemSize / 2}
      L${tipSize} ${margin}
      L${margin} ${h / 2}
      L${tipSize} ${h - margin}
      L${tipSize} ${h / 2 + stemSize / 2}
      L${w - margin} ${h / 2 + stemSize / 2} Z`,
    "arrow-up": `M${w / 2 - stemSize / 2} ${margin}
      L${w / 2 + stemSize / 2} ${margin}
      L${w / 2 + stemSize / 2} ${h - tipSize}
      L${w - margin} ${h - tipSize}
      L${w / 2} ${h - margin}
      L${margin} ${h - tipSize}
      L${w / 2 - stemSize / 2} ${h - tipSize} Z`,
    "arrow-down": `M${w / 2 - stemSize / 2} ${h - margin}
      L${w / 2 + stemSize / 2} ${h - margin}
      L${w / 2 + stemSize / 2} ${tipSize}
      L${w - margin} ${tipSize}
      L${w / 2} ${margin}
      L${margin} ${tipSize} L${w / 2 - stemSize / 2} ${tipSize} Z`,
    diamond: `M${w / 2} ${margin} L${w - margin} ${h / 2} L${w / 2} ${h - margin} L${margin} ${h / 2} Z`,
    triangle: `M${w / 2} ${margin} L${w - margin} ${h - margin} L${margin} ${h - margin} Z`,
    hexagon: `
      M${margin + (w - 2 * margin) * 0.25} ${margin}
      L${w - margin - (w - 2 * margin) * 0.25} ${margin}
      L${w - margin} ${h / 2}
      L${w - margin - (w - 2 * margin) * 0.25} ${h - margin}
      L${margin + (w - 2 * margin) * 0.25} ${h - margin}
      L${margin} ${h / 2} Z`,
    "chevron-start": createChevronStartPath(w, h, margin, tipSize),
    "speech-bubble": `
      M${margin + curvature} ${margin}
      L${w - margin - curvature} ${margin}
      Q${w - margin} ${margin} ${w - margin} ${margin + curvature}
      L${w - margin} ${h - margin - curvature}
      Q${w - margin} ${h - margin} ${w - margin - curvature} ${h - margin}
      L${w * 0.3 + tipSize} ${h - margin}
      L${w * 0.25} ${h + tipSize}
      L${w * 0.2 + tipSize} ${h - margin}
      L${margin + curvature} ${h - margin}
      Q${margin} ${h - margin} ${margin} ${h - margin - curvature}
      L${margin} ${margin + curvature}
      Q${margin} ${margin} ${margin + curvature} ${margin} Z`,
    chevron: createChevronPath(w, h, margin, tipSize),
  };

  return paths[type];
}

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
