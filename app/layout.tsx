import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Employee Review System",
  description: "Advanced admin dashboard for employee review management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
<head>
  <link href="https://fonts.googleapis.com/css?family=Roboto|Lato|Poppins|Montserrat|Open+Sans|Inter&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css?family=Inter|Roboto|Open+Sans|Lato|Poppins|Montserrat&display=swap" rel="stylesheet"></link>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Caveat&family=Merriweather&family=Orbitron&family=Playfair+Display&family=Space+Mono&display=swap" rel="stylesheet"/>

  </head>                

      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
