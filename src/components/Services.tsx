import React from 'react';
import { Plane, MapPin, Users, Wine, Car, Clock } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Plane className="text-teal-600" size={32} />,
      title: "Airport Transfers",
      description: "Professional meet-and-greet service from Cape Town International Airport to any destination in the Overberg region.",
      features: ["Meet & Greet Service", "Flight Monitoring", "Comfortable Vehicles"]
    },
    {
      icon: <MapPin className="text-teal-600" size={32} />,
      title: "Private Tours",
      description: "Full-day and half-day private tours exploring the beautiful Overberg region and its attractions.",
      features: ["Customized Itineraries", "Local Knowledge", "Flexible Timing"]
    },
    {
      icon: <Users className="text-teal-600" size={32} />,
      title: "Group Transfers",
      description: "Wedding guest transfers, corporate events, and planned group outings with vehicles for all group sizes.",
      features: ["Wedding Transfers", "Corporate Events", "Group Bookings"]
    },
    {
      icon: <Wine className="text-teal-600" size={32} />,
      title: "Wine Tours",
      description: "Specialized wine tasting tours to nearby wine regions including Stellenbosch and Franschhoek.",
      features: ["Wine Estate Visits", "Tasting Experiences", "Safe Transportation"]
    },
    {
      icon: <Car className="text-teal-600" size={32} />,
      title: "Chauffeur Service",
      description: "Professional chauffeur driver services for business meetings, special occasions, or leisure travel.",
      features: ["Professional Drivers", "Luxury Vehicles", "Hourly Rates"]
    },
    {
      icon: <Clock className="text-teal-600" size={32} />,
      title: "24/7 Availability",
      description: "Round-the-clock service to accommodate early morning flights, late arrivals, and emergency transfers.",
      features: ["24/7 Operations", "Emergency Service", "Flexible Scheduling"]
    }
  ];

  return (
    <section id="services" className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Comprehensive transportation solutions for all your travel needs in the Overberg region
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 md:p-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 md:mb-6">{service.icon}</div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base leading-relaxed">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mr-3 flex-shrink-0"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-6 md:p-8 text-white text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-4">Service Coverage Area</h3>
          <p className="text-base md:text-lg mb-6">We serve the entire Overberg region including:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 text-xs md:text-sm">
            {[
              "Somerset West", "Strand", "Gordons Bay", "Grabouw", "Rooi-els", "Pringle Bay",
              "Betty's Bay", "Kleinmond", "Caledon", "Greyton", "Napier", "Hermanus",
              "Stanford", "Gansbaai", "Bredasdorp", "Struisbaai", "Arniston", "Swellendam",
              "Heidelberg", "Riversdal", "Mossel Bay", "George"
            ].map((location, index) => (
              <div key={index} className="bg-white/20 rounded-lg p-2 md:p-3">
                {location}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;