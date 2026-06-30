import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SITE_NAME, createPageMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: `${SITE_NAME} | Real Kart Racing at Sir Colin Giltrap Raceway`,
    description:
      "Start karting, practice, race and get involved with KartSport Auckland Mt Wellington at Sir Colin Giltrap Raceway, Colin Dale Park.",
  }),
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kartsportauckland.org.nz"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NZ">
      <body className="min-h-screen bg-surface text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
