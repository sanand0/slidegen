import { describe, it, expect } from "vitest";
import { resolve, mergeShapes, escapeHtml } from "../slideforge.js";

describe("utils: resolve, mergeShapes, escapeHtml", () => {
  it("resolve(attr): root < layout < slide (shallow merge)", () => {
    const root = { bg: { fill: "#111", image_fit: "cover" } };
    const layout = { bg: { fill: "#222" } };
    const slide = { bg: { image: "https://x/y.png" } };
    const res = resolve("bg", root, layout, slide);
    expect(res.fill).toBe("#222");
    expect(res.image_fit).toBe("cover");
    expect(res.image).toBe("https://x/y.png");
  });

  it("mergeShapes: precedence root < layout < slide; arrays replace", () => {
    const root = {
      t: { id: "t", type: "list", items: ["a", "b"], x: 0, y: 0, w: 10, h: 10, unit: "%" },
    };
    const layout = {
      t: { items: ["c"] },
      u: { id: "u", type: "text", text: "layout" },
    };
    const slide = {
      t: { items: ["d", "e"], text: "ignored for list" },
      v: { id: "v", type: "text", text: "slide" },
    };
    const merged = mergeShapes(root, layout, slide);
    expect(merged.t.items).toEqual(["d", "e"]);
    expect(merged.u.text).toBe("layout");
    expect(merged.v.text).toBe("slide");
  });

  it("escapeHtml", () => {
    delete global.window;
    delete global.document;
    const s = `<b>Bob & "Alice" 'Eve'</b>`;
    const e = escapeHtml(s);
    expect(e).toBe("&lt;b&gt;Bob &amp; &quot;Alice&quot; &#39;Eve&#39;&lt;/b&gt;");
  });
});
