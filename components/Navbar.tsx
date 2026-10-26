"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
import AccountMenu from "@/components/AccountMenu"

/** Home matches exactly; every other item also owns its sub-routes (e.g. /fleet/[id]). */
function useIsActive() {
  const pathname = usePathname()
  return (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`))
}

type BookNowButtonProps = {
  className?: string
  href: string
}

function BookNowButton({ className, href}: BookNowButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-lg bg-primary py-1.5 pl-4 pr-1.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-105",
        className
      )}
    >
      Book Now
      <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-primary transition-transform group-hover:-translate-y-px group-hover:translate-x-px">
        <ArrowUpRight className="size-4" />
      </span>
    </Link>
  )
}

function NavLinks() {
  const isActive = useIsActive()
  return (
    <nav aria-label="Main" className="hidden items-center gap-5 xl:gap-7 lg:flex">
      {navbarItems.map((item) => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative whitespace-nowrap py-2 text-sm font-medium tracking-wide transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-primary after:transition-transform after:duration-200",
              active
                ? "text-primary after:scale-x-100"
                : "text-secondary-foreground/80 after:scale-x-0 hover:text-secondary-foreground hover:after:scale-x-100"
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function MobileMenu() {
  const isActive = useIsActive()
  return (
    <Sheet>
      <SheetTrigger
        aria-label="Open menu"
        className="flex size-10 items-center justify-center rounded-lg border border-secondary-foreground/20 text-secondary-foreground transition-colors hover:border-primary hover:text-primary lg:hidden"
      >
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[min(20rem,85vw)] border-border bg-secondary text-secondary-foreground"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>

        <nav aria-label="Mobile" className="mt-14 flex flex-col gap-1 px-4">
          {navbarItems.map((item) => {
            const active = isActive(item.href)
            return (
              <SheetClose key={item.href} className="flex">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "w-full rounded-lg border-l-2 px-3 py-3 text-left text-base font-medium transition-colors",
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-transparent text-secondary-foreground/85 hover:bg-secondary-foreground/10 hover:text-primary"
                  )}
                >
                  {item.label}
                </Link>
              </SheetClose>
            )
          })}
        </nav>

        <div className="mt-4 border-t border-secondary-foreground/15 px-4 pt-5">
          <AccountMenu variant="menu" />
        </div>

        <div className="mt-4 px-4 sm:hidden">
          <BookNowButton href="/rent-a-car" className="w-full justify-between" />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-secondary-foreground/10 bg-secondary/95 text-secondary-foreground backdrop-blur supports-[backdrop-filter]:bg-secondary/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-6 lg:px-6 xl:px-8">
        <Link href="/" className="shrink-0 justify-self-start" aria-label="TAS Drive Rentals home">
          <Image
            src="/logo.avif"
            alt="TAS Drive Rentals"
            width={200}
            height={300}
            priority
            className="h-14 w-auto sm:h-[4.5rem]"
          />
        </Link>

        <div className="hidden justify-self-center lg:block">
          <NavLinks />
        </div>

        <div className="flex items-center gap-3 justify-self-end">
          <AccountMenu className="hidden lg:flex" />
          <BookNowButton href="/rent-a-car" className="hidden sm:inline-flex" />
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
