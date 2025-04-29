'use client'
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { Menu } from "lucide-react";
import Side from "./components/BarComponents";
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from "next-themes";



export default function RootLayout({ children }) {
  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system">
    <div className="bg-neutral-100 dark:bg-neutral-900 w-screen h-screen overflow-hidden">
  
      <main className="md:grid md:grid-cols-[240px_minmax(0,1fr)] w-full h-full ">
        <div className="">
          <Sidebar></Sidebar>
 
        </div>
        <div className="pt-2 h-full overflow-y-auto">{children}</div>
        <Toaster position="top-right" />

      </main>
      </div>
      </ThemeProvider>
  )
}