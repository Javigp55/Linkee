'use client'
import React from 'react'
import { Github } from "lucide-react";

export default function Footer() {
  return (
    <div className='bg-white dark:bg-neutral-900'>
        <div className='p-4'>
        <a href="https://google.com">
        <Github className='w-6 h-6 ml-3'></Github></a>
        </div>
    </div>
  )
}

