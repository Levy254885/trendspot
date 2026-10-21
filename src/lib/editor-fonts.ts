/** Fonts offered in the article editor. */
export const EDITOR_FONTS: { label: string; value: string }[] = [
  { label: "Source Serif (default)", value: "'Source Serif 4', Georgia, serif" },
  { label: "Libre Baskerville", value: "'Libre Baskerville', Georgia, serif" },
  { label: "Playfair Display", value: "'Playfair Display', Georgia, serif" },
  { label: "Merriweather", value: "'Merriweather', Georgia, serif" },
  { label: "Lora", value: "'Lora', Georgia, serif" },
  { label: "Roboto Slab", value: "'Roboto Slab', Georgia, serif" },
  { label: "Inter", value: "'Inter', system-ui, sans-serif" },
  { label: "Montserrat", value: "'Montserrat', system-ui, sans-serif" },
  { label: "Oswald", value: "'Oswald', Impact, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Courier New", value: "'Courier New', Courier, monospace" },
];

export const EDITOR_FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 40, 48];

/** Extra Google Fonts beyond the three the site already loads. */
export const EXTRA_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,700;1,400&family=Roboto+Slab:wght@400;700&family=Montserrat:wght@400;600;700&family=Oswald:wght@400;600&display=swap";
