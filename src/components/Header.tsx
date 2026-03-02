import React, { useState } from 'react';
import { Menu, X, Phone, Mail, Heart } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 md:py-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <img 
              src="/oats_logos.jpg" 
              alt="Overberg Airport Transfers" 
              className="h-10 md:h-12 w-auto"
            />
            <div>
              <h1 className="text-lg md:text-xl font-bold text-teal-700">Overberg Airport</h1>
              <p className="text-xs md:text-sm text-gray-600">Transfers</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-teal-600 transition-colors">Home</a>
            <a href="#services" className="text-gray-700 hover:text-teal-600 transition-colors">Services</a>
            <a href="#about" className="text-gray-700 hover:text-teal-600 transition-colors">About</a>
            <a href="#contact" className="text-gray-700 hover:text-teal-600 transition-colors">Contact</a>
            <a 
              href="/rockhaven-wedding.html" 
              className="flex items-center space-x-1 text-pink-600 hover:text-pink-700 transition-colors bg-pink-50 px-3 py-2 rounded-lg hover:bg-pink-100"
              title="Wedding Transport Portal"
            >
              <Heart size={16} />
              <span className="text-sm font-medium">Wedding Portal</span>
            </a>
          </nav>

          {/* Contact Info - Hidden on mobile, shown on large screens */}
          <div className="hidden lg:flex items-center space-x-4">
            <a href="tel:+27795036849" className="flex items-center space-x-2 text-teal-600 hover:text-teal-700">
              <Phone size={16} />
              <span className="text-sm">+27 79 503 6849</span>
            </a>
            <a href="mailto:info@overbergtransfers.com" className="flex items-center space-x-2 text-teal-600 hover:text-teal-700">
              <Mail size={16} />
              <span className="text-sm">info@overbergtransfers.com</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t bg-white">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#home" 
                className="text-gray-700 hover:text-teal-600 transition-colors py-2 px-4 rounded-lg hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="#services" 
                className="text-gray-700 hover:text-teal-600 transition-colors py-2 px-4 rounded-lg hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </a>
              <a 
                href="#about" 
                className="text-gray-700 hover:text-teal-600 transition-colors py-2 px-4 rounded-lg hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="#contact" 
                className="text-gray-700 hover:text-teal-600 transition-colors py-2 px-4 rounded-lg hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              <a 
                href="/rockhaven-wedding.html" 
                className="flex items-center space-x-2 text-pink-600 py-2 px-4 rounded-lg hover:bg-pink-50 font-medium"
                onClick={() => setIsMenuOpen(false)}
                title="Wedding Transport Portal"
              >
                <Heart size={18} />
                <span>Wedding Portal</span>
              </a>
              <div className="pt-4 border-t space-y-3">
                <a href="tel:+27795036849" className="flex items-center space-x-2 text-teal-600 py-2 px-4 rounded-lg hover:bg-teal-50">
                  <Phone size={18} />
                  <span className="font-medium">+27 79 503 6849</span>
                </a>
                <a href="mailto:info@overbergtransfers.com" className="flex items-center space-x-2 text-teal-600 py-2 px-4 rounded-lg hover:bg-teal-50">
                  <Mail size={18} />
                  <span className="font-medium">info@overbergtransfers.com</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;