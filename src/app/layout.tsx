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
  title: {
    default: "VÉLA Services - Trusted Home Services in Oslo",
    template: "%s | VÉLA Services"
  },
  description: "One trusted provider for your home, kids, and pets. VÉLA connects you with reliable service providers for babysitting, cleaning, and pet care in Oslo. Book now!",
  keywords: [
    "home services",
    "babysitting",
    "cleaning services",
    "pet care",
    "Oslo",
    "Norway",
    "trusted providers",
    "home maintenance",
    "childcare",
    "housekeeping"
  ],
  authors: [{ name: "VÉLA Services" }],
  creator: "VÉLA Services",
  publisher: "VÉLA Services",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vela-services.netlify.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "VÉLA Services - Trusted Home Services in Oslo",
    description: "One trusted provider for your home, kids, and pets. VÉLA connects you with reliable service providers for babysitting, cleaning, and pet care in Oslo.",
    url: 'https://vela-services.netlify.app',
    siteName: 'VÉLA Services',
    images: [
      {
        url: '/download.webp',
        width: 1200,
        height: 630,
        alt: 'VÉLA Services - Home Services Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "VÉLA Services - Trusted Home Services in Oslo",
    description: "One trusted provider for your home, kids, and pets. VÉLA connects you with reliable service providers for babysitting, cleaning, and pet care in Oslo.",
    images: ['/download.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
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