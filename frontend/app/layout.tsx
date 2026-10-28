import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ForgeWatch AI · Industrial Predictive Maintenance",
  description:
    "A Comparative Study of Machine Failure and Condition Classification Across Industrial Datasets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${outfit.variable}`}>
      <body className="font-outfit antialiased selection:bg-[#2ef2c0]/30 selection:text-[#2ef2c0]">
        {children}
      </body>
    </html>
  );
}
