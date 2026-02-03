import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BloodEx - Connect. Donate. Save Lives.",
  description: "Blood donation platform to connect donors and recipients",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body 
        className="font-sans antialiased bg-sky-300 min-h-screen"
        suppressHydrationWarning={true} // This fixes the red console error
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}