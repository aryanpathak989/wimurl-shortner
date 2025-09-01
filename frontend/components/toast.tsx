"use client"
import React from 'react'
import { ToastContainer } from 'react-toastify';

export default function toast({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
        {children}
        <ToastContainer/>
    </>
  )
}
