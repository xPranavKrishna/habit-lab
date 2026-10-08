import './globals.css'
import { Inter, Space_Grotesk } from 'next/font/google'

const inter = Inter({subsets:['latin'], variable:'--font-inter'})
const space = Space_Grotesk({subsets:['latin'], variable:'--font-space'})

import { AppProvider } from '@/context/AppContext';

export const metadata = { 
  title:'Habit Lab 🧪 — Make consistency feel like a game', 
  description:'A playful personal learning cockpit and habit tracker.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🧪</text></svg>'
  }
}

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="en">
      <body className={`${inter.variable} ${space.variable}`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
