// Item Name: Blueberry - eCommerce Next JS template.
// Author: Maraviya Infotech
// Version: 1
// Copyright 2024

import Layout from "@/components/layout";
import Providers from "@/store/Provider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Home - Authentic Organic Food Products | Zhen Natural Ltd | Dhaka",
  description:
    "Zhen Natural Ltd is an organic brand offering authentic imported organic food products, promoting a healthy lifestyle with wholesale and retail services across Bangladesh",

  icons: {
    icon: "/assets/img/favicon/favicon.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
