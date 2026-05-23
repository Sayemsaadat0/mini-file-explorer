import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import PrimaryLayout from "@/components/core/PrimaryLayout/PrimaryLayout";
import FileContextProvider from "@/context/FileContextProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mini File Explorer",
  description: "A web-based miniature file explorer built with Next.js and Tailwind CSS",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="font-sans">
        <FileContextProvider>
          <PrimaryLayout>{children}</PrimaryLayout>
        </FileContextProvider>
      </body>
    </html>
  );
};

export default RootLayout;
