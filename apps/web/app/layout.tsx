// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required

import { Chivo } from "next/font/google";
import { Rubik } from "next/font/google";
import "./globals.css";
import { Appbar } from "./components/Appbar";
import { cn } from "@/app/lib/utils";
// import { Footer } from "../components/Footer";
import { Providers, ThemeProvider } from "../providers";

const chivo = Chivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-chivo",
});
const rubik = Rubik({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rubik",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased", chivo.variable + " " + rubik.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <Appbar />
            {children}
            {/* <Footer /> */}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
