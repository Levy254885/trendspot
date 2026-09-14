import type { Metadata } from "next";
import { Inter, Libre_Baskerville, Source_Serif_4 } from "next/font/google";
import { SITE_DESCRIPTION, SITE_DOMAIN, SITE_NAME, SITE_URL } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_DOMAIN} | Latest Kenyan Entertainment & Trending News`,
    template: `%s | ${SITE_DOMAIN}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_DOMAIN} | Latest Kenyan Entertainment & Trending News`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_DOMAIN,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${libreBaskerville.variable} ${sourceSerif.variable}`}
    >
      <body className="min-h-screen bg-white text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
