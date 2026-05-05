import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "FridgeToFork - AI Meal Planner",
  description:
    "An AI-powered meal planner that generates recipes based on ingredients you already have.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FEFAE0] text-[#1B1B1B]">
        <SessionProvider>{children}</SessionProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#2D6A4F",
              color: "#FEFAE0",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        />
      </body>
    </html>
  );
}
