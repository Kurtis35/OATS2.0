import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, MessageCircle, Phone, Mail } from 'lucide-react';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupLocation: '',
    destination: '',
    date: '',
    time: '',
    passengers: '1',
    serviceType: 'airport-transfer',
    specialRequests: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateWhatsAppMessage = () => {
    const message = `Hello! I'd like to book a transfer with Overberg Airport Transfers.

*Booking Details:*
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Service: ${formData.serviceType.replace('-', ' ').toUpperCase()}
• Pickup: ${formData.pickupLocation}
• Destination: ${formData.destination}
• Date: ${formData.date}
• Time: ${formData.time}
• Passengers: ${formData.passengers}
${formData.specialRequests ? `• Special Requests: ${formData.specialRequests}` : ''}

Please confirm availability and provide a quote. Thank you!`;

    return encodeURIComponent(message);
  };

  const generateEmailBody = () => {
    const subject = encodeURIComponent('Transfer Booking Request - Overberg Airport Transfers');
    const body = encodeURIComponent(`Hello,

I would like to book a transfer with Overberg Airport Transfers.

BOOKING DETAILS:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Service Type: ${formData.serviceType.replace('-', ' ').toUpperCase()}
Pickup Location: ${formData.pickupLocation}
Destination: ${formData.destination}
Date: ${formData.date}
Time: ${formData.time}
Number of Passengers: ${formData.passengers}
${formData.specialRequests ? `Special Requests: ${formData.specialRequests}` : ''}

Please confirm availability and provide a quote for this transfer.

Thank you for your time and I look forward to hearing from you soon.

Best regards,
${formData.name}`);

    return { subject, body };
  };

  const handleWhatsAppBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.pickupLocation || !formData.destination || !formData.date || !formData.time) {
      alert('Please fill in all required fields before booking.');
      return;
    }

    submitToNetlify('whatsapp');
    const whatsappMessage = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/27795036849?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.pickupLocation || !formData.destination || !formData.date || !formData.time) {
      alert('Please fill in all required fields before booking.');
      return;
    }

    submitToNetlify('email');
    const { subject, body } = generateEmailBody();
    const emailUrl = `mailto:info@overbergtransfers.com?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
  };

  const submitToNetlify = (method: string) => {
    const netlifyData = new URLSearchParams();
    netlifyData.append('form-name', 'general-booking');
    netlifyData.append('booking-method', method);
    Object.entries(formData).forEach(([key, value]) => {
      netlifyData.append(key, value);
    });

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: netlifyData.toString(),
    })
      .then(() => console.log('General booking submitted to Netlify'))
      .catch((error) => console.error('Netlify submission error:', error));
  };

  const handlePhoneCall = () => {
    submitToNetlify('phone-call');
    window.location.href = 'tel:+27795036849';
  };

  return (
    <section id="booking" className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-teal-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Book Your Transfer</h2>
            <p className="text-lg md:text-xl text-gray-600 px-4">
              Fill out the form below and choose your preferred booking method
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
            <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                  placeholder="+27 XX XXX XXXX"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                >
                  <option value="airport-transfer">Airport Transfer</option>
                  <option value="private-tour">Private Tour</option>
                  <option value="wine-tour">Wine Tour</option>
                  <option value="group-transfer">Group Transfer</option>
                  <option value="chauffeur-service">Chauffeur Service</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline mr-1" size={16} />
                  Pickup Location *
                </label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                  placeholder="e.g., Cape Town International Airport"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline mr-1" size={16} />
                  Destination *
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                  placeholder="e.g., Hermanus, Grabouw, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline mr-1" size={16} />
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="inline mr-1" size={16} />
                  Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Users className="inline mr-1" size={16} />
                  Number of Passengers
                </label>
                <select
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                  <option value="13+">13+ Passengers</option>
                </select>
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Special Requests or Additional Information
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base resize-none"
                placeholder="Any special requirements, flight details, or additional information..."
              />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={handleWhatsAppBooking}
                className="w-full bg-green-600 text-white px-6 md:px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-base md:text-lg"
              >
                <MessageCircle size={20} />
                <span>Book via WhatsApp</span>
              </button>
              
              <button
                onClick={handleEmailBooking}
                className="w-full bg-blue-600 text-white px-6 md:px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-base md:text-lg"
              >
                <Mail size={20} />
                <span>Book via Email</span>
              </button>
              
              <button
                onClick={handlePhoneCall}
                className="w-full sm:col-span-2 lg:col-span-1 bg-teal-600 text-white px-6 md:px-8 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-base md:text-lg"
              >
                <Phone size={20} />
                <span>Call to Book</span>
              </button>
            </div>

            <div className="mt-6 p-4 bg-teal-50 rounded-lg">
              <p className="text-sm text-teal-800">
                <strong>Booking Options:</strong> Choose your preferred method above. WhatsApp provides instant messaging, 
                email allows detailed communication, or call us directly for immediate assistance. All methods will include 
                your booking details for quick processing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;