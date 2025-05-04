import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rapid8 - Emergency Medical Services',
  description: 'Emergency medical services and hospital management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
