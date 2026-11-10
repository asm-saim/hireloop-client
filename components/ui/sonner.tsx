"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "!bg-surface !text-white !border !border-white/10 !rounded-2xl !font-sans",
          description: "!text-white/70",
        },
      }}
      {...props}
    />
  )
}
