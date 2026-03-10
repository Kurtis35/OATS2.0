import React from 'react';
import { Award, Shield, Clock, Users, MapPin, Star } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: <Users className="text-teal-600" size={24} />, number: "1000+", label: "Happy Customers" },
    { icon: <Clock className="text-teal-600" size={24} />, number: "24/7", label: "Service Available" },
    { icon: <MapPin className="text-teal-600" size={24} />, number: "22+", label: "Destinations Covered" },
    { icon: <Star className="text-teal-600" size={24} />, number: "5★", label: "Customer Rating" }
  ];

  const features = [
    {
      icon: <Award className="text-teal-600" size={32} />,
      title: "Professional Excellence",
      description: "Our experienced drivers are professionally trained, licensed, and committed to providing exceptional service."
    },
    {
      icon: <Shield className="text-teal-600" size={32} />,
      title: "Safety & Insurance",
      description: "All our vehicles are fully insured and regularly maintained to ensure your safety and comfort."
    },
    {
      icon: <Clock className="text-teal-600" size={32} />,
      title: "Reliable Service",
      description: "We monitor flights and traffic conditions to ensure timely pickups and arrivals, 24 hours a day."
    }
  ];

  return (
    <section id="about" className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16 md:mb-20">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">About Overberg Airport Transfers</h2>
            <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6 leading-relaxed">
              Based in Grabouw, Western Cape, Overberg Airport Transfers has been providing premium 
              transportation services throughout the beautiful Overberg region. We specialize in 
              comfortable, reliable transfers from Cape Town International Airport to destinations 
              across the Overberg district.
            </p>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
              Our commitment to excellence, combined with local knowledge and professional service, 
              makes us the preferred choice for tourists, business travelers, and locals alike. 
              Whether you need a simple airport transfer or a full-day tour, we're here to serve you.
            </p>
            
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-3 md:p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <div className="text-xl md:text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative order-first lg:order-last">
            <img
              src="/6661c48f09e1d4261d646875488c7507.jpg"
              alt="Overberg landscape"
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute -bottom-4 md:-bottom-6 -left-4 md:-left-6 bg-white p-4 md:p-6 rounded-xl shadow-lg max-w-xs">
              <div className="flex items-center space-x-3">
                <MapPin className="text-teal-600 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">Located in Grabouw</p>
                  <p className="text-xs md:text-sm text-gray-600">22 Elberta Street, 7160</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 md:p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="flex justify-center mb-4 md:mb-6">{feature.icon}</div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-6 md:p-8 text-white">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Why Choose Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-sm md:text-base">Local expertise and knowledge of the Overberg region</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-sm md:text-base">Professional, courteous, and experienced drivers</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-sm md:text-base">Modern, comfortable, and well-maintained vehicles</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-sm md:text-base">Competitive pricing with transparent quotes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-sm md:text-base">24/7 availability for all your transportation needs</span>
                </li>
              </ul>
            </div>
            <div className="text-center">
              <img
                src="/453884004_1034192472040145_1496321644556200388_n_(1).jpg"
                alt="Professional service vehicle"
                className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-full mx-auto border-4 border-white"
              />
              <p className="mt-4 text-base md:text-lg font-semibold">Professional Service</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;