import type { Metadata } from "next";
import { Geist, Geist_Mono, Abhaya_Libre, Cormorant_Garamond, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartProvider } from "../lib/CartContext";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const abhayaLibre = Abhaya_Libre({
  variable: "--font-abhaya-libre",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const CormorantGaramond = Cormorant_Garamond({
  variable: "--font-Cormorant_Garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const NunitoSans = Nunito_Sans({
  variable: "--font-Nunito_Sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vela Services",
  description:
    "Vela Services is a platform for finding and booking home services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TJBDTX5H');
          `}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${abhayaLibre.variable} ${CormorantGaramond.variable} ${NunitoSans.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TJBDTX5H"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '14px',
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}