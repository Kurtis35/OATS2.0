import React from 'react';
import { ArrowRight, Clock, Shield, Users, Mail, Phone } from 'lucide-react';

const Hero = () => {
  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="home" 
      className="relative py-12 md:py-20 bg-cover bg-center bg-no-repeat min-h-screen flex items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)), url('/dark_blue_photographic_conference_event_website_(4).jpg')`
      }}
    >
      <div className="container mx-auto px-4 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Overberg Airport
              <span className="text-teal-400 block">Transfers</span>
              <span className="text-gray-200 text-xl sm:text-2xl md:text-3xl lg:text-4xl block mt-2">in the Overberg Area</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Professional, reliable, and comfortable transportation from Cape Town International Airport 
              to destinations across the beautiful Overberg region. Available 24/7.
            </p>

            {/* Contact Information */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 md:mb-8 justify-center lg:justify-start">
              <a
                href="tel:+27795036849"
                className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-3 rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                <Phone size={18} />
                <span className="text-sm md:text-base">+27 79 503 6849</span>
              </a>
              <a
                href="mailto:info@overbergtransfers.com"
                className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-3 rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                <Mail size={18} />
                <span className="text-sm md:text-base">info@overbergtransfers.com</span>
              </a>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8 md:mb-12 justify-center lg:justify-start">
              <button
                onClick={scrollToBooking}
                className="bg-teal-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base md:text-lg"
              >
                <span>Book Your Transfer</span>
                <ArrowRight size={20} />
              </button>
              <a
                href="tel:+27795036849"
                className="border-2 border-teal-400 text-teal-400 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-teal-400 hover:text-white transition-all duration-300 text-center text-base md:text-lg"
              >
                Call Now
              </a>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm p-3 md:p-4 rounded-lg shadow-md mb-2 md:mb-3">
                  <Clock className="text-teal-400 mx-auto" size={20} />
                </div>
                <p className="text-xs md:text-sm font-semibold text-gray-200">24/7 Service</p>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm p-3 md:p-4 rounded-lg shadow-md mb-2 md:mb-3">
                  <Shield className="text-teal-400 mx-auto" size={20} />
                </div>
                <p className="text-xs md:text-sm font-semibold text-gray-200">Fully Insured</p>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm p-3 md:p-4 rounded-lg shadow-md mb-2 md:mb-3">
                  <Users className="text-teal-400 mx-auto" size={20} />
                </div>
                <p className="text-xs md:text-sm font-semibold text-gray-200">Professional Drivers</p>
              </div>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="bg-white p-4 md:p-8 rounded-2xl shadow-2xl">
              <img
                src="/453884004_1034192472040145_1496321644556200388_n_(1) copy.jpg"
                alt="Luxury transfer vehicle"
                className="w-full h-48 md:h-64 object-cover rounded-lg mb-4 md:mb-6"
              />
              <div className="space-y-3 md:space-y-4 text-gray-800">
                <div className="flex items-center justify-between text-sm md:text-base">
                  <span className="text-gray-600">From Cape Town Airport</span>
                  <span className="font-semibold text-teal-600">45 mins to Grabouw</span>
                </div>
                <div className="flex items-center justify-between text-sm md:text-base">
                  <span className="text-gray-600">Service Coverage</span>
                  <span className="font-semibold text-teal-600">Entire Overberg Region</span>
                </div>
                <div className="flex items-center justify-between text-sm md:text-base">
                  <span className="text-gray-600">Vehicle Types</span>
                  <span className="font-semibold text-teal-600">Sedans to Minibuses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;