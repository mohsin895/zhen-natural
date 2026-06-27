import Layout from "@/components/layout";
import Providers from "@/store/Provider";
import Script from "next/script";
import type { Metadata } from "next";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./globals.css";

export const metadata: Metadata = {
    title: "Home - Authentic Organic Food Products | Zhen Natural Ltd | Dhaka",
    description:
        "Zhen Natural Ltd is an organic brand offering authentic imported organic food products, promoting a healthy lifestyle with wholesale and retail services across Bangladesh",
    icons: {
        icon: "/assets/img/favicon/favicon.webp",
    },
    verification: {
        google: "YOUR_GOOGLE_VERIFICATION_CODE",
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body suppressHydrationWarning>

        {/* ================= GOOGLE ANALYTICS SCRIPT ================= */}
        <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-Q6KKB0F82X"
            strategy="afterInteractive"
        />

        <Script id="ga4" strategy="afterInteractive">
            {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){window.dataLayer.push(arguments);}
                        window.gtag = gtag;

                        gtag('js', new Date());
                        gtag('config', 'G-Q6KKB0F82X');
                    `}
        </Script>

        {/* ================= META PIXEL ================= */}
        <Script id="meta-pixel" strategy="afterInteractive">
            {`
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');

                        fbq('init', '4299495683647867');
                        fbq('track', 'PageView');
                    `}
        </Script>

        <noscript>
            <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src="https://www.facebook.com/tr?id=4299495683647867&ev=PageView&noscript=1"
                alt=""
            />
        </noscript>

        <Providers>
            <Layout>{children}</Layout>
        </Providers>
        </body>
        </html>
    );
}