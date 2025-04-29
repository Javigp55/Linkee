'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '../components/Navbar'
import Footer from "../components/Footer";
import { montserrat } from '../components/fonts'
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from "next-themes";
import { usePathname } from 'next/navigation'
import { GoogleOAuthProvider, useGoogleLogin  } from '@react-oauth/google';




export default function RootLayout({ children }) {
  return (

      <ThemeProvider attribute="class" enableSystem defaultTheme="dark">
       
        <div className=" flex flex-col min-h-screen w-screen bg-grid">
        <main className="flex-grow">
        
        <nav><Navbar /></nav>
 
        {children}
        <Toaster position="top-right" />
        </main>
        <Footer/>
        </div>

        </ThemeProvider>

    
  );
}
