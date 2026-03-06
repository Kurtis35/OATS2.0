import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Facebook, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <img 
                src="/oats_logos.jpg" 
                alt="Overberg Airport Transfers" 
                className="h-10 md:h-12 w-auto"
              />
              <div>
                <h3 className="text-lg md:text-xl font-bold">Overberg Airport Transfers</h3>
                <p className="text-gray-400 text-xs md:text-sm">Premium Transportation Services</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
              Professional, reliable, and comfortable transportation from Cape Town International Airport 
              to destinations across the beautiful Overberg region. Available 24/7 for all your travel needs.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:+27795036849"
                className="bg-teal-600 hover:bg-teal-700 p-2 md:p-3 rounded-lg transition-colors"
                title="Call us"
              >
                <Phone size={18} />
              </a>
              <a
                href="mailto:info@overbergtransfers.com"
                className="bg-teal-600 hover:bg-teal-700 p-2 md:p-3 rounded-lg transition-colors"
                title="Email us"
              >
                <Mail size={18} />
              </a>
              <a
                href="https://wa.me/27795036849"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 p-2 md:p-3 rounded-lg transition-colors"
                title="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href="https://www.facebook.com/overbergairporttransfers"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 p-2 md:p-3 rounded-lg transition-colors"
                title="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://x.com/overbergtransf1"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-600 hover:bg-gray-700 p-2 md:p-3 rounded-lg transition-colors"
                title="X (Twitter)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/overbergtransfers/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-600 hover:bg-pink-700 p-2 md:p-3 rounded-lg transition-colors"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/overberg-airport-tramsfers/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-700 hover:bg-blue-800 p-2 md:p-3 rounded-lg transition-colors"
                title="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Quick Links</h4>
            <ul className="space-y-2 md:space-y-3">
              <li><a href="#home" className="text-gray-300 hover:text-white transition-colors text-sm md:text-base">Home</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-white transition-colors text-sm md:text-base">Services</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors text-sm md:text-base">About</a></li>
              <li><a href="#booking" className="text-gray-300 hover:text-white transition-colors text-sm md:text-base">Book Now</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors text-sm md:text-base">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Contact Info</h4>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="text-teal-400 mt-1 flex-shrink-0" size={16} />
                <div>
                  <p className="text-gray-300 text-sm md:text-base">+27 79 503 6849</p>
                  <p className="text-gray-400 text-xs md:text-sm">24/7 Available</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="text-teal-400 mt-1 flex-shrink-0" size={16} />
                <div>
                  <p className="text-gray-300 text-sm md:text-base break-words">info@overbergtransfers.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="text-teal-400 mt-1 flex-shrink-0" size={16} />
                <div>
                  <p className="text-gray-300 text-sm md:text-base">22 Elberta Street</p>
                  <p className="text-gray-300 text-sm md:text-base">Grabouw, Western Cape</p>
                  <p className="text-gray-300 text-sm md:text-base">7160, South Africa</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Card Section */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-800">
          <div className="flex justify-center mb-6 md:mb-8">
            <img 
              src="/whatsapp_image_2025-06-29_at_10.49.04_6cceedf0.jpg" 
              alt="Grabouw Elgin Tours and Transfers Business Card" 
              className="max-w-xs md:max-w-md w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Company Registration Details */}
        <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-center">Company Information</h4>
          <div className="grid sm:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm text-gray-300">
            <div className="text-center">
              <p className="font-semibold text-white mb-2">GRABOUW ELGIN TOURS AND TRANSFERS (Pty) Ltd</p>
              <p>Company Registration Number: <span className="text-teal-400">2018/400230/07</span></p>
            </div>
            <div className="text-center">
              <p>Tax Reference Number: <span className="text-teal-400">9349188194</span></p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
              © {currentYear} Overberg Airport Transfers. All rights reserved.
            </p>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">
              Made with ❤️ in South Africa by <a href="https://evermoredigital.co.za" target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:text-teal-400 transition-colors">Evermore Digital Solutions</a>
            </p>
            <div className="flex space-x-4 md:space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;