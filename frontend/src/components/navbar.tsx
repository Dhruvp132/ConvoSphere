'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#" className="text-xl md:text-2xl font-bold">
            ConnectChat
          </a>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
              Testimonials
            </a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost">Log In</Button>
            <Button>Sign Up</Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                <a href="#" className="py-2 text-foreground/80 hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#" className="py-2 text-foreground/80 hover:text-foreground transition-colors">
                  How It Works
                </a>
                <a href="#" className="py-2 text-foreground/80 hover:text-foreground transition-colors">
                  Testimonials
                </a>
                <a href="#" className="py-2 text-foreground/80 hover:text-foreground transition-colors">
                  Pricing
                </a>
                <div className="pt-4 flex flex-col space-y-2">
                  <Button variant="outline" className="w-full">Log In</Button>
                  <Button className="w-full">Sign Up</Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
