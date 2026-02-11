import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Aegis Protocol — AI-Powered DeFi Guardian",
  description:
    "Autonomous AI agent that monitors your DeFi positions on BNB Chain 24/7, detects risks in real-time, and executes protective on-chain transactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0e17] text-white antialiased min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1f2e",
              color: "#e2e8f0",
              border: "1px solid rgba(0, 224, 255, 0.2)",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
