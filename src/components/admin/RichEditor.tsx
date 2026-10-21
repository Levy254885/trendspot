"use client";

import { useEffect, useRef, useState } from "react";
import { EDITOR_FONTS, EDITOR_FONT_SIZES } from "@/lib/editor-fonts";
import { cn } from "@/lib/utils";

type Props = {
  /** HTML to start with. The editor owns its content after mount. */
  initialHtml: string;
  onChange: (html: string) => void;
  /** Upload an image and return its public URL (Cloudinary). */
  onUploadImage: (file: File) => Promise<{ url: string }>;
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeAttr = (s: string) => escapeHtml(s).replace(/"/g, "&quot;");
const countWords = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

function Tb({
  title,
  onClick,
  children,
  className,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      // keep the text selection while clicking toolbar buttons
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "grid h-8 min-w-8 place-items-center rounded px-1.5 text-[13px] text-ink transition-colors hover:bg-black/5",
        className
      )}
    >
      {children}
    </button>
  );
}

const Sep = () => <span className="mx-1 h-5 w-px bg-border2" aria-hidden="true" />;

const selectClass =
  "h-8 rounded border border-border2 bg-white px-2 text-[12.5px] text-ink outline-none hover:border-border focus:border-ink";

export function RichEditor({ initialHtml, onChange, onUploadImage }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const saved = useRef<Range | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<"visual" | "source">("visual");
  const [source, setSource] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [figure, setFigure] = useState<HTMLElement | null>(null);
  const [words, setWords] = useState(0);

  /* ── load the initial content once ── */
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = initialHtml;
      setWords(countWords(ref.current.innerText));
    }
    try {
      document.execCommand("defaultParagraphSeparator", false, "p");
    } catch {
      /* not supported — harmless */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── remember the caret/selection so toolbar controls can restore it ── */
  useEffect(() => {
    const onSel = () => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount && ref.current?.contains(sel.anchorNode)) {
        saved.current = sel.getRangeAt(0).cloneRange();
      }
    };
    document.addEventListener("selectionchange", onSel);
    return () => document.removeEventListener("selectionchange", onSel);
  }, []);

  function currentHtml(): string {
    const el = ref.current;
    if (!el) return "";
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("[data-selected]").forEach((n) => n.removeAttribute("data-selected"));
    return clone.innerHTML;
  }

  function emit() {
    onChange(currentHtml());
    if (ref.current) setWords(countWords(ref.current.innerText));
  }

  function restore() {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (!sel) return;
    if (saved.current) {
      sel.removeAllRanges();
      sel.addRange(saved.current);
    } else {
      const r = document.createRange();
      r.selectNodeContents(el);
      r.collapse(false);
      sel.removeAllRanges();
      sel.addRange(r);
    }
  }

  function exec(cmd: string, value?: string) {
    restore();
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand(cmd, false, value);
    emit();
  }

  function applySize(px: number) {
    restore();
    // Browsers only know sizes 1–7, so apply the biggest and swap in exact px.
    document.execCommand("styleWithCSS", false, "false");
    document.execCommand("fontSize", false, "7");
    ref.current?.querySelectorAll('font[size="7"]').forEach((f) => {
      const span = document.createElement("span");
      span.style.fontSize = `${px}px`;
      while (f.firstChild) span.appendChild(f.firstChild);
      f.replaceWith(span);
    });
    document.execCommand("styleWithCSS", false, "true");
    emit();
  }

  function addLink() {
    const url = window.prompt("Link address (https://…)");
    if (!url) return;
    const href = /^(https?:|mailto:|tel:|\/|#)/i.test(url) ? url : `https://${url}`;
    exec("createLink", href);
    ref.current?.querySelectorAll<HTMLAnchorElement>('a[href^="http"]').forEach((a) => {
      if (!a.getAttribute("target")) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }
    });
    emit();
  }

  function insertFigure(url: string, caption: string) {
    restore();
    const html =
      `<figure data-align="center"><img src="${escapeAttr(url)}" alt="${escapeAttr(caption)}" />` +
      (caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "") +
      `</figure><p><br></p>`;
    document.execCommand("insertHTML", false, html);
    emit();
  }

  async function addImages(files: File[]) {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (!images.length) return;
    setError("");
    setBusy(true);
    try {
      for (const file of images) {
        const { url } = await onUploadImage(file);
        const caption = window.prompt("Caption for this image (optional)") || "";
        insertFigure(url, caption);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  /* ── images already in the text ── */
  function onEditorClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    ref.current?.querySelectorAll("[data-selected]").forEach((n) => n.removeAttribute("data-selected"));
    const fig = target.tagName === "IMG" ? target.closest("figure") : null;
    if (fig) {
      fig.setAttribute("data-selected", "true");
      setFigure(fig as HTMLElement);
    } else {
      setFigure(null);
    }
  }

  function alignFigure(value: string) {
    if (!figure) return;
    figure.setAttribute("data-align", value);
    emit();
  }

  function editCaption() {
    if (!figure) return;
    const current = figure.querySelector("figcaption")?.textContent || "";
    const next = window.prompt("Caption", current);
    if (next === null) return;
    let cap = figure.querySelector("figcaption");
    if (!next.trim()) {
      cap?.remove();
    } else {
      if (!cap) {
        cap = document.createElement("figcaption");
        figure.appendChild(cap);
      }
      cap.textContent = next;
    }
    figure.querySelector("img")?.setAttribute("alt", next);
    emit();
  }

  function removeFigure() {
    if (!figure) return;
    figure.remove();
    setFigure(null);
    emit();
  }

  /* ── paste & drop ── */
  function onPaste(e: React.ClipboardEvent<HTMLDivElement>) {
    const files = Array.from(e.clipboardData.files || []);
    if (files.some((f) => f.type.startsWith("image/"))) {
      e.preventDefault();
      void addImages(files);
      return;
    }
    // Paste as clean text so Word / web formatting doesn't leak in.
    const text = e.clipboardData.getData("text/plain");
    if (!text) return;
    e.preventDefault();
    const html = text
      .split(/\n{2,}/)
      .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
      .join("");
    document.execCommand("insertHTML", false, html);
    emit();
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    const files = Array.from(e.dataTransfer.files || []);
    if (files.some((f) => f.type.startsWith("image/"))) {
      e.preventDefault();
      void addImages(files);
    }
  }

  /* ── HTML source mode ── */
  function toggleSource() {
    if (mode === "visual") {
      setSource(currentHtml());
      setFigure(null);
      setMode("source");
    } else {
      if (ref.current) ref.current.innerHTML = source;
      saved.current = null;
      emit();
      setMode("visual");
    }
  }

  return (
    <div className="rounded-lg border border-border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {/* ── Toolbar ── */}
      <div className="sticky top-14 z-20 flex flex-wrap items-center gap-1 rounded-t-lg border-b border-border2 bg-[#fafafa] px-2 py-1.5 lg:top-0">
        {mode === "visual" && (
          <>
            <select
              aria-label="Text style"
              className={selectClass}
              value=""
              onChange={(e) => e.target.value && exec("formatBlock", e.target.value)}
            >
              <option value="">Style</option>
              <option value="p">Paragraph</option>
              <option value="h2">Heading 1</option>
              <option value="h3">Heading 2</option>
              <option value="h4">Heading 3</option>
              <option value="blockquote">Quote</option>
            </select>

            <select
              aria-label="Font"
              className={cn(selectClass, "w-[140px]")}
              value=""
              onChange={(e) => e.target.value && exec("fontName", e.target.value)}
            >
              <option value="">Font</option>
              {EDITOR_FONTS.map((f) => (
                <option key={f.label} value={f.value} style={{ fontFamily: f.value }}>
                  {f.label}
                </option>
              ))}
            </select>

            <select
              aria-label="Font size"
              className={cn(selectClass, "w-[72px]")}
              value=""
              onChange={(e) => e.target.value && applySize(Number(e.target.value))}
            >
              <option value="">Size</option>
              {EDITOR_FONT_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <Sep />
            <Tb title="Bold (Ctrl+B)" onClick={() => exec("bold")} className="font-bold">
              B
            </Tb>
            <Tb title="Italic (Ctrl+I)" onClick={() => exec("italic")} className="italic">
              I
            </Tb>
            <Tb title="Underline (Ctrl+U)" onClick={() => exec("underline")} className="underline">
              U
            </Tb>
            <Tb title="Strikethrough" onClick={() => exec("strikeThrough")} className="line-through">
              S
            </Tb>

            <label
              title="Text colour"
              className="relative grid h-8 w-8 cursor-pointer place-items-center rounded hover:bg-black/5"
            >
              <span className="text-[13px] font-bold leading-none">A</span>
              <span className="absolute bottom-1.5 left-1.5 right-1.5 h-[3px] rounded bg-red" />
              <input
                type="color"
                defaultValue="#cc0000"
                onChange={(e) => exec("foreColor", e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="Text colour"
              />
            </label>
            <label
              title="Highlight colour"
              className="relative grid h-8 w-8 cursor-pointer place-items-center rounded hover:bg-black/5"
            >
              <i className="ti ti-highlight text-[16px]" aria-hidden="true" />
              <span className="absolute bottom-1.5 left-1.5 right-1.5 h-[3px] rounded bg-[#ffe066]" />
              <input
                type="color"
                defaultValue="#ffe066"
                onChange={(e) => exec("hiliteColor", e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="Highlight colour"
              />
            </label>

            <Sep />
            <Tb title="Align left" onClick={() => exec("justifyLeft")}>
              <i className="ti ti-align-left text-[16px]" aria-hidden="true" />
            </Tb>
            <Tb title="Align centre" onClick={() => exec("justifyCenter")}>
              <i className="ti ti-align-center text-[16px]" aria-hidden="true" />
            </Tb>
            <Tb title="Align right" onClick={() => exec("justifyRight")}>
              <i className="ti ti-align-right text-[16px]" aria-hidden="true" />
            </Tb>
            <Tb title="Justify" onClick={() => exec("justifyFull")}>
              <i className="ti ti-align-justified text-[16px]" aria-hidden="true" />
            </Tb>

            <Sep />
            <Tb title="Bulleted list" onClick={() => exec("insertUnorderedList")}>
              <i className="ti ti-list text-[16px]" aria-hidden="true" />
            </Tb>
            <Tb title="Numbered list" onClick={() => exec("insertOrderedList")}>
              <i className="ti ti-list-numbers text-[16px]" aria-hidden="true" />
            </Tb>
            <Tb title="Add link" onClick={addLink}>
              <i className="ti ti-link text-[16px]" aria-hidden="true" />
            </Tb>
            <Tb title="Remove link" onClick={() => exec("unlink")}>
              <i className="ti ti-link-off text-[16px]" aria-hidden="true" />
            </Tb>
            <Tb title="Divider line" onClick={() => exec("insertHorizontalRule")}>
              <i className="ti ti-minus text-[16px]" aria-hidden="true" />
            </Tb>

            <Sep />
            <Tb
              title="Insert image"
              onClick={() => {
                restore();
                fileInput.current?.click();
              }}
              className="gap-1.5 px-2.5 font-semibold"
            >
              <span className="flex items-center gap-1.5">
                <i className="ti ti-photo-plus text-[16px]" aria-hidden="true" />
                {busy ? "Uploading…" : "Image"}
              </span>
            </Tb>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                void addImages(Array.from(e.target.files || []));
                e.target.value = "";
              }}
            />

            <Sep />
            <Tb title="Clear formatting" onClick={() => exec("removeFormat")}>
              <i className="ti ti-clear-formatting text-[16px]" aria-hidden="true" />
            </Tb>
            <Tb title="Undo" onClick={() => exec("undo")}>
              <i className="ti ti-arrow-back-up text-[16px]" aria-hidden="true" />
            </Tb>
            <Tb title="Redo" onClick={() => exec("redo")}>
              <i className="ti ti-arrow-forward-up text-[16px]" aria-hidden="true" />
            </Tb>
          </>
        )}

        <button
          type="button"
          onClick={toggleSource}
          className={cn(
            "ml-auto h-8 rounded border px-2.5 text-[12px] font-semibold",
            mode === "source"
              ? "border-black bg-black text-white"
              : "border-border2 bg-white text-gray hover:border-border"
          )}
        >
          {mode === "source" ? "← Visual editor" : "</> HTML"}
        </button>
      </div>

      {/* ── Selected-image controls ── */}
      {figure && mode === "visual" && (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-border2 bg-[#fff8e6] px-3 py-2 text-[12.5px]">
          <span className="mr-1 font-semibold text-ink">Image</span>
          {[
            ["left", "Left"],
            ["center", "Centre"],
            ["right", "Right"],
            ["full", "Full width"],
          ].map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => alignFigure(v)}
              className={cn(
                "rounded border px-2.5 py-1 font-semibold",
                figure.getAttribute("data-align") === v
                  ? "border-black bg-black text-white"
                  : "border-border bg-white text-ink hover:border-ink"
              )}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={editCaption}
            className="rounded border border-border bg-white px-2.5 py-1 font-semibold hover:border-ink"
          >
            Caption
          </button>
          <button
            type="button"
            onClick={removeFigure}
            className="rounded border border-border bg-white px-2.5 py-1 font-semibold text-red hover:border-red"
          >
            Remove
          </button>
        </div>
      )}

      {error && (
        <div role="alert" className="border-b border-[#f3c4c4] bg-[#fff5f5] px-4 py-2 text-[13px] text-red">
          {error}
        </div>
      )}

      {/* ── Writing area ── */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        spellCheck
        data-placeholder="Start writing your story…"
        onInput={emit}
        onClick={onEditorClick}
        onPaste={onPaste}
        onDrop={onDrop}
        className={cn(
          "rt-editor article-prose mx-auto min-h-[480px] px-6 py-8 outline-none sm:px-10",
          mode === "source" && "hidden"
        )}
        style={{ maxWidth: 780 }}
      />

      {mode === "source" && (
        <textarea
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            onChange(e.target.value);
          }}
          spellCheck={false}
          className="block min-h-[480px] w-full resize-y border-0 bg-[#fafafa] p-5 font-mono text-[13px] leading-relaxed text-ink outline-none"
          aria-label="Article HTML"
        />
      )}

      <div className="flex items-center justify-between rounded-b-lg border-t border-border2 bg-[#fafafa] px-4 py-2 text-[12px] text-mid">
        <span>
          {words} words · ~{Math.max(1, Math.ceil(words / 220))} min read
        </span>
        <span className="hidden sm:inline">
          Tip: drag or paste images straight into the text. Click an image to align it.
        </span>
      </div>
    </div>
  );
}
