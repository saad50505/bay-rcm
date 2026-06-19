import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://bayrcm.com";
const SITE_NAME = "Bay RCM";
const TITLE = "Bay RCM — Revenue Cycle Management for Medical Practices";
const DESCRIPTION =
  "Bay RCM delivers end-to-end revenue cycle management for clinics and health systems — certified billers, clean claims, denial management, and structured AR follow-up that keeps your practice financially healthy.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Bay RCM",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "revenue cycle management",
    "medical billing",
    "RCM services",
    "medical coding",
    "denial management",
    "accounts receivable follow-up",
    "eligibility verification",
    "prior authorization",
    "healthcare billing company",
    "clean claims",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "Healthcare",
};

export const viewport: Viewport = {
  themeColor: "#0B1628",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
