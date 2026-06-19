import type { Metadata } from "next";

const TITLE = "Book a Free Demo";
const DESCRIPTION =
  "Book a free 30-minute Bay RCM demo and a complimentary claims audit. We review your last 90 days of claims and show you exactly where revenue is slipping — no pressure, no obligation.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/demo",
  },
  openGraph: {
    type: "website",
    url: "https://bayrcm.com/demo",
    siteName: "Bay RCM",
    title: `${TITLE} | Bay RCM`,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | Bay RCM`,
    description: DESCRIPTION,
  },
};

export default function DemoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
