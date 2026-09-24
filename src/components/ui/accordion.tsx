"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "cn"

function Accordion({
  className,
  ...props
}: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden transition-all data-[open]:border-zinc-700 data-[open]:bg-zinc-900/90",
        className
      )}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-center justify-between py-3.5 px-4 text-sm font-semibold text-zinc-200 transition-all hover:text-white cursor-pointer select-none group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500",
          className
        )}
        {...props}
      >
        <span className="flex items-center gap-2 text-left">{children}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 group-data-[open]:rotate-180 group-hover:text-red-400" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className={cn(
        "px-4 pb-4 pt-1 text-sm text-zinc-300 transition-all animate-in fade-in-50",
        className
      )}
      {...props}
    >
      {children}
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
