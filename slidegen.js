/**
 * Convert slide deck JSON to HTML string with scoped CSS
 */
export default function html(deck) {
  if (!deck || !deck.slides) return "";

  const { slide_size, theme, masters, slides } = deck;

  // Create scoped CSS styles
  const css = generateScopedCSS(slide_size, theme);

  // Generate HTML for each slide
  const slidesHTML = slides.map((slide) => generateSlideHTML(slide, masters)).join("");

  return `<div class="slidegen-deck" data-deck-id="${deck.id || ""}">
  <style scoped>${css}</style>
  ${slidesHTML}
</div>`;
}

function generateScopedCSS(slideSize, theme) {
  const { w, h, unit = "px" } = slideSize || { w: 1280, h: 720, unit: "px" };
  const colors = theme?.colors || {};

  return `
    .slidegen-deck * { margin: 0; padding: 0; box-sizing: border-box; }
    .slidegen-deck { font-family: ${theme?.fonts?.body || "Arial"}, sans-serif; display: flex; flex-direction: column; }
    .slidegen-deck .slide {
      width: ${w}${unit};
      height: ${h}${unit};
      position: relative;
      overflow: hidden;
      background: ${colors.bg || "#ffffff"};
    }
    .slidegen-deck .shape { position: absolute; }
    .slidegen-deck .text-shape {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      word-wrap: break-word;
    }
    .slidegen-deck .image-shape img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .slidegen-deck .list-shape ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .slidegen-deck .list-shape li {
      margin-bottom: 0.5em;
    }
    .slidegen-deck .svg-shape {
      position: absolute;
    }
    .slidegen-deck .svg-shape svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .slidegen-deck .svg-shape .text-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      word-wrap: break-word;
      text-align: center;
      padding: 8px;
    }
  `;
}

function generateSlideHTML(slide, masters) {
  const master = masters?.find((m) => m.id === slide.master);
  if (!master) return "";

  const layout = master.layouts?.find((l) => l.id === slide.layout);
  if (!layout) return "";

  let slideHTML = `<div class="slide" data-slide-id="${slide.id}">`;

  // Add background
  slideHTML += generateBackground(layout.bg?.inherit ? master.bg : layout.bg);

  // Add master, then layout, then slide shapes
  for (let container of [master, layout, slide])
    if (container.shapes)
      slideHTML += container.shapes
        .map((shape) => generateShapeHTML(shape, slide.meta || {}, slide.overrides))
        .join("");

  slideHTML += "</div>";
  return slideHTML;
}

function generateBackground(bg) {
  if (!bg) return "";

  let style = "";
  if (bg.fill) style += `background-color: ${bg.fill};`;
  if (bg.image) {
    style += `background-image: url('${bg.image}');`;
    style += `background-size: ${bg.image_fit || "cover"};`;
    style += `background-position: center;`;
    style += `background-repeat: no-repeat;`;
  }

  return style
    ? `<div class="background" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; ${style} z-index: -1;"></div>`
    : "";
}

function generateShapeHTML(shape, meta = {}, overrides = []) {
  const override = overrides.find((o) => o.shape === shape.id);
  const finalShape = { ...shape, ...override };

  const { x = 0, y = 0, w = 100, h = 100, unit = "%" } = finalShape;
  const baseStyle = `left: ${x}${unit}; top: ${y}${unit}; width: ${w}${unit}; height: ${h}${unit};`;
  let additionalStyle = "";

  if (finalShape.z !== undefined) additionalStyle += `z-index: ${finalShape.z};`;
  if (finalShape.opacity !== undefined) additionalStyle += `opacity: ${finalShape.opacity};`;

  const style = `${baseStyle}${additionalStyle}`;

  switch (finalShape.type) {
    case "text":
      return generateTextShape(finalShape, style, meta);
    case "image":
      return generateImageShape(finalShape, style);
    case "list":
      return generateListShape(finalShape, style);
    default:
      return generateSVGShape(finalShape, style, meta);
  }
}

function generateTextShape(shape, style, meta) {
  const text = interpolateText(shape.text || "", meta);

  let textStyle = "";
  if (shape.font_family) textStyle += `font-family: ${shape.font_family};`;
  if (shape.font_size) textStyle += `font-size: ${shape.font_size}px;`;
  if (shape.font_weight) textStyle += `font-weight: ${shape.font_weight};`;
  if (shape.color) textStyle += `color: ${shape.color};`;
  if (shape.text_align) textStyle += `text-align: ${shape.text_align};`;
  if (shape.line_height) textStyle += `line-height: ${shape.line_height};`;

  return `<div class="shape text-shape" style="${style}${textStyle}">${escapeHtml(text)}</div>`;
}

function generateImageShape(shape, style) {
  const fitStyle = shape.image_fit ? `object-fit: ${shape.image_fit};` : "";
  return `<div class="shape image-shape" style="${style}">
    <img src="${shape.image_src || ""}" alt="" style="${fitStyle}">
  </div>`;
}

function generateListShape(shape, style) {
  const items = shape.items || [];

  let listStyle = "";
  if (shape.font_family) listStyle += `font-family: ${shape.font_family};`;
  if (shape.font_size) listStyle += `font-size: ${shape.font_size}px;`;
  if (shape.line_height) listStyle += `line-height: ${shape.line_height};`;
  if (shape.color) listStyle += `color: ${shape.color};`;

  const itemsHTML = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  return `<div class="shape list-shape" style="${style}">
    <ul style="${listStyle}">${itemsHTML}</ul>
  </div>`;
}

function interpolateText(text, meta) {
  return text.replace(/\{([^}]+)\}/g, (match, key) => meta[key] || match);
}

function generateSVGShape(shape, style, meta) {
  const text = shape.text ? interpolateText(shape.text, meta) : "";
  const fill = shape.fill || "#2563eb";
  const stroke = shape.stroke || "none";
  const strokeWidth = shape.stroke_width || 0;
  const strokeDasharray = shape.stroke_dasharray || "";
  const strokeLinecap = shape.stroke_linecap || "butt";
  const strokeLinejoin = shape.stroke_linejoin || "miter";
  const strokeOpacity = shape.stroke_opacity || 1;
  const textColor = shape.text_color || "#ffffff";
  const textSize = shape.text_size || 14;

  // Extract width and height from style for responsive path calculation
  const { w = 100, h = 100 } = shape;
  const svgPath = getSVGPath(shape.type, w, h, shape);

  let strokeAttributes = `stroke="${stroke}" stroke-width="${strokeWidth}"`;
  if (stroke !== "none" && strokeWidth > 0) {
    strokeAttributes += ` stroke-opacity="${strokeOpacity}" stroke-linecap="${strokeLinecap}" stroke-linejoin="${strokeLinejoin}"`;
    if (strokeDasharray) strokeAttributes += ` stroke-dasharray="${strokeDasharray}"`;
  }

  const svgContent = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <path d="${svgPath}" fill="${fill}" ${strokeAttributes}/>
  </svg>`;

  let textOverlay = "";
  if (text) {
    const textStyle = `color: ${textColor}; font-size: ${textSize}px; font-family: Arial, sans-serif;`;
    textOverlay = `<div class="text-overlay" style="${textStyle}">${escapeHtml(text)}</div>`;
  }

  return `<div class="shape svg-shape" style="${style}">${svgContent}${textOverlay}</div>`;
}

function getSVGPath(type, width = 100, height = 100, shape = {}) {
  const w = width;
  const h = height;
  const margin = Math.min(w, h) * 0.1; // 10% margin

  // Shape-specific parameters with defaults
  const curvature = shape.curvature || 10;
  const tipSize = shape.tipSize || 20;
  const stemSize = shape.stemSize || 40;

  const paths = {
    rectangle: `M${margin} ${margin} L${w - margin} ${margin} L${w - margin} ${h - margin} L${margin} ${h - margin} Z`,
    "rounded-rectangle": `M${margin + curvature} ${margin} L${w - margin - curvature} ${margin} Q${w - margin} ${margin} ${w - margin} ${margin + curvature} L${w - margin} ${h - margin - curvature} Q${w - margin} ${h - margin} ${w - margin - curvature} ${h - margin} L${margin + curvature} ${h - margin} Q${margin} ${h - margin} ${margin} ${h - margin - curvature} L${margin} ${margin + curvature} Q${margin} ${margin} ${margin + curvature} ${margin} Z`,
    ellipse: `M${w / 2} ${margin} A${w / 2 - margin} ${h / 2 - margin} 0 1 1 ${w / 2 - 0.1} ${margin} Z`,
    "arrow-right": `M${margin} ${h / 2 - stemSize / 2} L${w - tipSize} ${h / 2 - stemSize / 2} L${w - tipSize} ${margin} L${w - margin} ${h / 2} L${w - tipSize} ${h - margin} L${w - tipSize} ${h / 2 + stemSize / 2} L${margin} ${h / 2 + stemSize / 2} Z`,
    "arrow-left": `M${w - margin} ${h / 2 - stemSize / 2} L${tipSize} ${h / 2 - stemSize / 2} L${tipSize} ${margin} L${margin} ${h / 2} L${tipSize} ${h - margin} L${tipSize} ${h / 2 + stemSize / 2} L${w - margin} ${h / 2 + stemSize / 2} Z`,
    "arrow-up": `M${w / 2 - stemSize / 2} ${margin} L${w / 2 + stemSize / 2} ${margin} L${w / 2 + stemSize / 2} ${h - tipSize} L${w - margin} ${h - tipSize} L${w / 2} ${h - margin} L${margin} ${h - tipSize} L${w / 2 - stemSize / 2} ${h - tipSize} Z`,
    "arrow-down": `M${w / 2 - stemSize / 2} ${h - margin} L${w / 2 + stemSize / 2} ${h - margin} L${w / 2 + stemSize / 2} ${tipSize} L${w - margin} ${tipSize} L${w / 2} ${margin} L${margin} ${tipSize} L${w / 2 - stemSize / 2} ${tipSize} Z`,
    diamond: `M${w / 2} ${margin} L${w - margin} ${h / 2} L${w / 2} ${h - margin} L${margin} ${h / 2} Z`,
    triangle: `M${w / 2} ${margin} L${w - margin} ${h - margin} L${margin} ${h - margin} Z`,
    hexagon: `M${margin + (w - 2 * margin) * 0.25} ${margin} L${w - margin - (w - 2 * margin) * 0.25} ${margin} L${w - margin} ${h / 2} L${w - margin - (w - 2 * margin) * 0.25} ${h - margin} L${margin + (w - 2 * margin) * 0.25} ${h - margin} L${margin} ${h / 2} Z`,
    pentagon: `M${w / 2} ${margin} L${w - margin} ${h * 0.38} L${w - margin * 2} ${h - margin} L${margin * 2} ${h - margin} L${margin} ${h * 0.38} Z`,
    "speech-bubble": `M${margin + curvature} ${margin} L${w - margin - curvature} ${margin} Q${w - margin} ${margin} ${w - margin} ${margin + curvature} L${w - margin} ${h * 0.7 - curvature} Q${w - margin} ${h * 0.7} ${w - margin - curvature} ${h * 0.7} L${w * 0.3 + tipSize} ${h * 0.7} L${w * 0.25} ${h - margin} L${w * 0.2 + tipSize} ${h * 0.7} L${margin + curvature} ${h * 0.7} Q${margin} ${h * 0.7} ${margin} ${h * 0.7 - curvature} L${margin} ${margin + curvature} Q${margin} ${margin} ${margin + curvature} ${margin} Z`,
    chevron: `M${margin} ${margin} L${w - tipSize - margin} ${margin} L${w - margin} ${h / 2} L${w - tipSize - margin} ${h - margin} L${margin} ${h - margin} L${tipSize + margin} ${h / 2} Z`,
  };

  return paths[type] || paths.rectangle;
}

function escapeHtml(text) {
  // Browser
  const div = typeof document !== "undefined" ? document.createElement("div") : null;
  if (div) {
    div.textContent = text;
    return div.innerHTML;
  }
  // Server
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
