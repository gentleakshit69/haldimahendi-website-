'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Search, Bell, Moon, Sun, Globe } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { useAppStore } from '@/store/useAppStore'

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useAppStore()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Browse', href: '/search' },
    { label: 'Matches', href: '/matches' },
    { label: 'Messages', href: '/messages' },
    { label: 'Success Stories', href: '/success-stories' },
    { label: 'About', href: '/about' },
    { label: 'Pricing', href: '/pricing' },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="hidden sm:inline font-bold text-lg text-foreground">Matrimonial</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search */}
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Search size={20} className="text-foreground" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell size={20} className="text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            {/* Language */}
            <button className="hidden sm:flex p-2 hover:bg-muted rounded-lg transition-colors">
              <Globe size={20} className="text-foreground" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {theme === 'light' ? (
                <Moon size={20} className="text-foreground" />
              ) : (
                <Sun size={20} className="text-foreground" />
              )}
            </button>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/my-profile">Profile</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link href="/auth/signup">Join Now</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 space-y-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="ghost" size="sm" asChild className="w-full">
                <Link href="/my-profile">Profile</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="w-full">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button variant="primary" size="sm" asChild className="w-full">
                <Link href="/auth/signup">Join Now</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
