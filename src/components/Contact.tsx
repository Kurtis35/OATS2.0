import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: <Phone className="text-teal-600" size={24} />,
      title: "Phone",
      details: "+27 79 503 6849",
      action: "tel:+27795036849"
    },
    {
      icon: <Mail className="text-teal-600" size={24} />,
      title: "Email",
      details: "info@overbergtransfers.com",
      action: "mailto:info@overbergtransfers.com"
    },
    {
      icon: <MapPin className="text-teal-600" size={24} />,
      title: "Address",
      details: "22 Elberta Street, Grabouw, Western Cape, 7160",
      action: "https://maps.google.com/?q=22+Elberta+Street,+Grabouw,+7160"
    },
    {
      icon: <Clock className="text-teal-600" size={24} />,
      title: "Operating Hours",
      details: "24 hours a day, 7 days a week",
      action: null
    }
  ];

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hello! I'd like to inquire about your transfer services. Please provide more information.");
    window.open(`https://wa.me/27795036849?text=${message}`, '_blank');
  };

  return (
    <section id="contact" className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Ready to book your transfer or have questions? We're here to help 24/7
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 md:mb-8">Contact Information</h3>
            <div className="space-y-4 md:space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 md:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0">{info.icon}</div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-2">{info.title}</h4>
                    {info.action ? (
                      <a
                        href={info.action}
                        target={info.action.startsWith('http') ? '_blank' : '_self'}
                        rel={info.action.startsWith('http') ? 'noopener noreferrer' : ''}
                        className="text-gray-600 hover:text-teal-600 transition-colors text-sm md:text-base break-words"
                      >
                        {info.details}
                      </a>
                    ) : (
                      <p className="text-gray-600 text-sm md:text-base">{info.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white">
              <h4 className="text-lg font-semibold mb-3">Quick Contact via WhatsApp</h4>
              <p className="mb-4 text-sm md:text-base">Get instant responses to your queries and book directly through WhatsApp</p>
              <button
                onClick={handleWhatsApp}
                className="bg-white text-green-600 px-4 md:px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 text-sm md:text-base"
              >
                <MessageCircle size={20} />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 md:mb-8">Service Areas</h3>
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Primary Service Route</h4>
                <p className="text-gray-600 mb-4 text-sm md:text-base">
                  Cape Town International Airport → Overberg Region
                </p>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-sm text-teal-800">
                    <strong>Travel Time:</strong> Approximately 45 minutes from Cape Town Airport to Grabouw, 
                    2 hours to Bredasdorp
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Destinations We Serve</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-2 text-xs md:text-sm text-gray-600">
                  <div>• Somerset West</div>
                  <div>• Strand</div>
                  <div>• Gordons Bay</div>
                  <div>• Grabouw</div>
                  <div>• Rooi-els</div>
                  <div>• Pringle Bay</div>
                  <div>• Betty's Bay</div>
                  <div>• Kleinmond</div>
                  <div>• Caledon</div>
                  <div>• Greyton</div>
                  <div>• Napier</div>
                  <div>• Hermanus</div>
                  <div>• Stanford</div>
                  <div>• Gansbaai</div>
                  <div>• Bredasdorp</div>
                  <div>• Struisbaai</div>
                  <div>• Arniston</div>
                  <div>• Swellendam</div>
                  <div>• Heidelberg</div>
                  <div>• Riversdal</div>
                  <div>• Mossel Bay</div>
                  <div>• George</div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-md p-4 md:p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Emergency Contact</h4>
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                For urgent bookings or emergency transfers, call us directly at any time:
              </p>
              <a
                href="tel:+27795036849"
                className="bg-red-600 text-white px-4 md:px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-flex items-center space-x-2 text-sm md:text-base"
              >
                <Phone size={20} />
                <span>Emergency Line</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;