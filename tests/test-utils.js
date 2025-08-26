import { Window } from "happy-dom";
import postcss from "postcss";

export function setupDom() {
  const window = new Window();
  const document = window.document;
  global.window = window;
  global.document = document;
  return { window, document };
}

export function withDom(run) {
  const prevWindow = global.window;
  const prevDocument = global.document;
  const ctx = setupDom();
  try {
    return run(ctx);
  } finally {
    global.window = prevWindow;
    global.document = prevDocument;
  }
}

export const parseCss = (css) => postcss.parse(css || "");
export const getRule = (root, selector) => root.nodes.find((n) => n.type === "rule" && n.selector.trim() === selector);
export const getDecls = (rule) =>
  Object.fromEntries((rule?.nodes || []).filter((n) => n.type === "decl").map((d) => [d.prop, d.value]));
export const ruleDecls = (root, selector) => getDecls(getRule(root, selector));

export function parseInlineStyle(style = "") {
  const root = postcss.parse(`a{${style}}`);
  const rule = root.nodes.find((n) => n.type === "rule");
  return getDecls(rule);
}

export const styleDecls = (el) => parseInlineStyle(el?.getAttribute("style") || "");

export function toContainer(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div;
}
