/**
 * Allow-list HTML sanitiser for article bodies.
 *
 * Runs on the server for everything the editor saves. It keeps formatting the
 * editor can produce (headings, fonts, colours, lists, links, images with
 * captions) and drops everything else — scripts, event handlers, iframes,
 * javascript: links, unknown tags and unsafe CSS.
 */

const TAGS = new Set([
  "p", "br", "h1", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s",
  "strike", "blockquote", "ul", "ol", "li", "a", "img", "figure",
  "figcaption", "span", "div", "font", "hr", "sub", "sup",
]);
const VOID = new Set(["br", "img", "hr"]);

const ATTRS: Record<string, string[]> = {
  a: ["href", "target", "rel", "title"],
  img: ["src", "alt", "width", "height"],
  font: ["face", "size", "color"],
  figure: ["data-align"],
};
const GLOBAL_ATTRS = ["style"];

const STYLE_PROPS = new Set([
  "font-family", "font-size", "color", "background-color", "text-align",
  "font-weight", "font-style", "text-decoration", "line-height",
  "letter-spacing", "margin-left", "text-indent",
]);

const ALIGNS = new Set(["left", "center", "right", "full"]);

function decode(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function cleanStyle(raw: string): string {
  return decode(raw)
    .split(";")
    .map((decl) => {
      const i = decl.indexOf(":");
      if (i < 0) return "";
      const prop = decl.slice(0, i).trim().toLowerCase();
      const value = decl.slice(i + 1).trim();
      if (!STYLE_PROPS.has(prop) || !value) return "";
      if (/url\s*\(|expression|javascript|@import|[<>\\]/i.test(value)) return "";
      return `${prop}: ${value}`;
    })
    .filter(Boolean)
    .join("; ");
}

function safeUrl(raw: string, kind: "link" | "image"): string {
  const url = decode(raw).trim();
  if (kind === "image") {
    return /^https:\/\//i.test(url) || url.startsWith("/") ? url : "";
  }
  return /^(https?:|mailto:|tel:|\/|#)/i.test(url) ? url : "";
}

const ATTR_RE = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

function buildTag(name: string, rawAttrs: string): string {
  const allowed = new Set([...(ATTRS[name] || []), ...GLOBAL_ATTRS]);
  const out: string[] = [];
  let hasTargetBlank = false;

  let m: RegExpExecArray | null;
  ATTR_RE.lastIndex = 0;
  while ((m = ATTR_RE.exec(rawAttrs))) {
    const attr = m[1].toLowerCase();
    const value = m[2] ?? m[3] ?? m[4] ?? "";
    if (!allowed.has(attr)) continue;

    if (attr === "style") {
      const s = cleanStyle(value);
      if (s) out.push(`style="${escapeAttr(s)}"`);
    } else if (attr === "href") {
      const u = safeUrl(value, "link");
      if (u) out.push(`href="${escapeAttr(u)}"`);
    } else if (attr === "src") {
      const u = safeUrl(value, "image");
      if (u) out.push(`src="${escapeAttr(u)}"`);
    } else if (attr === "target") {
      if (value === "_blank") {
        hasTargetBlank = true;
        out.push('target="_blank"');
      }
    } else if (attr === "rel") {
      /* set automatically below */
    } else if (attr === "data-align") {
      if (ALIGNS.has(value)) out.push(`data-align="${value}"`);
    } else if (attr === "width" || attr === "height" || attr === "size") {
      if (/^\d{1,4}$/.test(value)) out.push(`${attr}="${value}"`);
    } else if (attr === "color") {
      if (/^#[0-9a-f]{3,8}$/i.test(value)) out.push(`color="${value}"`);
    } else if (attr === "face") {
      if (!/[<>"\\]/.test(value)) out.push(`face="${escapeAttr(decode(value))}"`);
    } else {
      out.push(`${attr}="${escapeAttr(decode(value))}"`);
    }
  }

  if (name === "a" && hasTargetBlank) out.push('rel="noopener noreferrer"');
  if (name === "img" && !out.some((a) => a.startsWith("src="))) return "";

  const attrs = out.length ? " " + out.join(" ") : "";
  return `<${name}${attrs}${VOID.has(name) ? " /" : ""}>`;
}

const TOKEN_RE =
  /<!--[\s\S]*?-->|<\/?([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;

export function sanitizeHtml(input: string): string {
  let out = "";
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;

  const text = (s: string) => s.replace(/</g, "&lt;");

  while ((m = TOKEN_RE.exec(input))) {
    out += text(input.slice(last, m.index));
    last = m.index + m[0].length;

    const name = (m[1] || "").toLowerCase();
    if (!name) continue; // comment
    if (!TAGS.has(name)) continue; // drop tag, keep inner text

    if (m[0].startsWith("</")) {
      if (!VOID.has(name)) out += `</${name}>`;
    } else {
      out += buildTag(name, m[2] || "");
    }
  }
  out += text(input.slice(last));
  return out.trim();
}

export function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ");
}
