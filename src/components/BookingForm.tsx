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
    <section id="booking" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-teal-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Book Your Transfer</h2>
            <p className="text-lg md:text-xl text-gray-600 px-4 leading-relaxed">
              Complete the form below to request your transfer. Choose WhatsApp for instant messaging, email for detailed communication, or call for immediate assistance.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100">
            <div className="grid md:grid-cols-2 gap-5 md:gap-8 mb-8 md:mb-10">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-base transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-base transition-all"
                  placeholder="+27 XX XXX XXXX"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-base transition-all"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Service Type
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-base transition-all"
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
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  <MapPin className="inline mr-1" size={16} />
                  Pickup Location *
                </label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-base transition-all"
                  placeholder="e.g., Cape Town International Airport"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  <MapPin className="inline mr-1" size={16} />
                  Destination *
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-base transition-all"
                  placeholder="e.g., Hermanus, Grabouw, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  <Calendar className="inline mr-1" size={16} />
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-base transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  <Clock className="inline mr-1" size={16} />
                  Time *
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-base transition-all"
                  required
                >
                  <option value="">Select a time</option>
                  <option value="10:00">10:00 PM</option>
                  <option value="12:00">12:00 AM (Midnight)</option>
                  <option value="01:00">1:00 AM</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  <Users className="inline mr-1" size={16} />
                  Number of Passengers
                </label>
                <select
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-base transition-all"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                  <option value="13+">13+ Passengers</option>
                </select>
              </div>
            </div>

            <div className="mb-8 md:mb-10">
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Special Requests or Additional Information
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-base resize-none transition-all"
                placeholder="Any special requirements, flight details, or additional information..."
              />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <button
                onClick={handleWhatsAppBooking}
                className="w-full bg-green-600 text-white px-6 md:px-8 py-5 md:py-6 rounded-xl font-bold text-base md:text-lg hover:bg-green-700 hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105 active:scale-95"
              >
                <MessageCircle size={22} />
                <span>Book via WhatsApp</span>
              </button>
              
              <button
                onClick={handleEmailBooking}
                className="w-full bg-blue-600 text-white px-6 md:px-8 py-5 md:py-6 rounded-xl font-bold text-base md:text-lg hover:bg-blue-700 hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105 active:scale-95"
              >
                <Mail size={22} />
                <span>Book via Email</span>
              </button>
              
              <button
                onClick={handlePhoneCall}
                className="w-full sm:col-span-2 lg:col-span-1 bg-teal-600 text-white px-6 md:px-8 py-5 md:py-6 rounded-xl font-bold text-base md:text-lg hover:bg-teal-700 hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105 active:scale-95"
              >
                <Phone size={22} />
                <span>Call to Book</span>
              </button>
            </div>

            <div className="mt-8 p-5 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border-l-4 border-teal-600">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-gray-900">Quick Tip:</strong> All booking methods include your complete details for fast processing. WhatsApp is fastest for instant communication, email is perfect for detailed queries, or call us anytime for immediate assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;