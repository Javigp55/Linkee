'use client'
import React ,{ useState }from 'react'
import { montserrat } from './components/fonts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "next-themes";



export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <html  suppressHydrationWarning>
      <body  className={`${montserrat.className} dark:text-neutral-300 antialiased w-full h-full overflow-x-hidden`}>
      <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
    </body>
    </html>
  )
};