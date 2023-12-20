import { cn } from "@/lib/utils/utils";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/Toaster";
import { ReactNode } from "react";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Marmitas da Mônica",
  description: "Lugar perfeito para agendar suas refeições.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-Br"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        inter.className
      )}
    >
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        <Providers>
          <div className="container max-w-7xl mx-auto h-full pt-12">
            {/* @ts-expect-error Server Component */}
            <Navbar />
            {children}
            <SpeedInsights />
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
