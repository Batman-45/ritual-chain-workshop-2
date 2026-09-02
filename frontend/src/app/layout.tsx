import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RitualPredict | Autonomous Prediction Markets on Ritual Chain",
  description:
    "Self-resolving binary prediction markets powered by Ritual Chain HTTP (0x0801), jq (0x0803) precompiles and the on-chain Scheduler.",
  keywords: ["Ritual Chain", "Prediction Market", "AI Oracle", "Precompiles", "Web3", "Solidity"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-ritual-bg text-slate-100 antialiased selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
