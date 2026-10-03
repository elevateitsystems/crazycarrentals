"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { navbarItems } from "@/lib/navbarItems"

type BookNowButtonProps = {
  className?: string
  href?: string
}

function BookNowButton({ className, href = "/book-now" }: BookNowButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-3 rounded-lg bg-primary py-2 pl-5 pr-2 text-base text-primary-foreground shadow-lg shadow-primary/30 transition-opacity hover:opacity-90",
        className
      )}
    >
      Book Now
      <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
        <ArrowUpRight className="size-5" />
      </span>
    </Link>
  )
}

function NavLinks() {
  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {navbarItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-secondary-foreground/90 transition-colors hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger
        aria-label="Open menu"
        className="flex size-10 items-center justify-center rounded-lg text-secondary-foreground transition-colors hover:bg-secondary-foreground/10 lg:hidden"
      >
        <Menu className="size-6" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-72 border-border bg-secondary text-secondary-foreground"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>

        <nav className="mt-12 flex flex-col px-4">
          {navbarItems.map((item) => (
            <SheetClose key={item.href} className='flex'>
              <Link
                href={item.href}
                className="rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-secondary-foreground/10 hover:text-primary"
              >
                {item.label}
              </Link>
            </SheetClose>
          ))}
        </nav>

        <div className="mt-6 px-4 sm:hidden">
          <BookNowButton className="w-full justify-between" />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function Navbar() {
  return (
    <header className="w-full bg-secondary text-secondary-foreground">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link href="/" className="justify-self-start">
          <Image
            src="/logo.avif"
            alt="TAS Drive Rentals"
            width={72}
            height={56}
            priority
            className="h-12 w-auto sm:h-16"
          />
        </Link>

        <NavLinks />

        <div className="flex items-center gap-3 justify-self-end">
          <BookNowButton className="hidden sm:inline-flex" />
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}