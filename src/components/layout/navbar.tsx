import Link from "next/link";
import { ThemeSwitcher } from "../theme-switcher";
import { Button } from "../ui/button";

export function Navbar() {
  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="w-full flex items-center ">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">YardCard Elite</span>
          </Link>
          <nav className="hidden md:flex mx-auto justify-center gap-6">
            <Link
              href="/features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium hover:text-primary"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-primary"
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <div className="hidden md:flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="min-w-[96px]">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="min-w-[96px]">Sign up</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
