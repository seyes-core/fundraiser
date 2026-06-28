import type { Metadata } from "next";
import "../styles/globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://temitope.dev";

export const metadata: Metadata = {
  title: "Help Temitope Get a Laptop — ₦350,000 Campaign",
  description:
    "Temitope Ogungbuji is an aspiring software developer raising ₦350,000 to purchase a Dell Latitude 7400 laptop. Support his journey into data engineering and technology.",
  keywords: ["fundraising", "laptop", "developer", "Nigeria", "technology", "data engineering"],
  authors: [{ name: "Temitope Ogungbuji" }],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Help Temitope Get a Laptop — ₦350,000 Campaign",
    description:
      "An aspiring Nigerian software developer raising funds for a Dell Latitude 7400 to build data projects, earn certifications, and secure an internship.",
    url: SITE_URL,
    siteName: "Temitope's Fundraising Campaign",
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Temitope Get a Laptop",
    description:
      "Support an aspiring Nigerian developer in building tools that matter. Campaign goal: ₦350,000.",
    creator: "@temitope_dev",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Temitope Ogungbuji",
              description: "Aspiring software developer and data engineering student",
              url: SITE_URL,
              sameAs: [
                "https://github.com/Bambillion",
                "https://twitter.com/temitope_dev",
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
