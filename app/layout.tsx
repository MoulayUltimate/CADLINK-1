import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CADLINK V11 - Professional Sign Making Software",
  description:
    "Industry-leading CAD software for vinyl cutting, sign making, and digital printing. Precision tools for professionals.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

import { CartProvider } from "@/contexts/cart-context"
import { CartDrawer } from "@/components/cart-drawer"
import { LiveChatWidget } from "@/components/live-chat-widget"

import { AnalyticsProvider } from "@/components/analytics-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <AnalyticsProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <LiveChatWidget />
          </CartProvider>
        </AnalyticsProvider>
        <Analytics />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VRHZJ0QQNL"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-VRHZJ0QQNL');
          `}
        </Script>
      </body>
    </html>
  )
}
