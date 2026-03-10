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
    specialRequests: '',
    shuttleTime: ''
  });

  const [step, setStep] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const submitToGoogleSheets = async (data: any) => {
    try {
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyKgq_pUO2wgYmsZxLDWE81v3MIaLg4exyGh_x7CNY/exec';
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'general_booking' })
      });
    } catch (error) {
      console.error('Google Sheets error:', error);
    }
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
${formData.shuttleTime ? `• Preferred Shuttle: ${formData.shuttleTime}` : ''}
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
${formData.shuttleTime ? `Preferred Shuttle: ${formData.shuttleTime}` : ''}
Number of Passengers: ${formData.passengers}
${formData.specialRequests ? `Special Requests: ${formData.specialRequests}` : ''}

Please confirm availability and provide a quote for this transfer.

Thank you for your time and I look forward to hearing from you soon.

Best regards,
${formData.name}`);

    return { subject, body };
  };

  const handleFinalBooking = async (method: 'whatsapp' | 'email') => {
    if (!formData.name || !formData.phone || !formData.pickupLocation || !formData.destination || !formData.date || !formData.time) {
      alert('Please fill in all required fields before booking.');
      return;
    }

    await submitToGoogleSheets(formData);

    if (method === 'whatsapp') {
      const whatsappMessage = generateWhatsAppMessage();
      const whatsappUrl = `https://wa.me/27795036849?text=${whatsappMessage}`;
      window.open(whatsappUrl, '_blank');
    } else {
      const { subject, body } = generateEmailBody();
      const emailUrl = `mailto:info@overbergtransfers.com?subject=${subject}&body=${body}`;
      window.location.href = emailUrl;
    }
  };

  const handlePhoneCall = () => {
    window.location.href = 'tel:+27795036849';
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const isStepValid = () => {
    if (step === 1) return formData.name && formData.phone && formData.email;
    if (step === 2) return formData.pickupLocation && formData.destination;
    if (step === 3) return formData.date && formData.time;
    return true;
  };

  return (
    <section id="booking" className="py-12 md:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-500 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <span className="inline-block px-6 py-2 bg-teal-500/10 text-teal-400 rounded-full text-xs font-black tracking-[0.3em] uppercase mb-6 border border-teal-500/20 shadow-lg shadow-teal-500/10">
              Elite Transport
            </span>
            <h2 className="text-5xl md:text-8xl font-black mb-8 bg-gradient-to-b from-white via-white to-slate-500 bg-clip-text text-transparent italic tracking-tight">
              Book Your Experience
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
              Bespoke travel solutions for the discerning guest. Seamless coordination, luxury fleet, and professional service.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Progress Bar */}
            <div className="flex h-1.5 bg-white/5">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={`flex-1 transition-all duration-1000 ease-out ${i <= step ? 'bg-gradient-to-r from-teal-500 via-blue-500 to-teal-500 bg-[length:200%_100%] animate-gradient' : ''}`}
                />
              ))}
            </div>

            <div className="p-8 md:p-12">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 border border-teal-500/30">1</div>
                    Personal Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none transition-all placeholder:text-white/20" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none transition-all placeholder:text-white/20" placeholder="+27 ..." />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none transition-all placeholder:text-white/20" placeholder="john@example.com" />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 border border-teal-500/30">2</div>
                    Route Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Service Type</label>
                      <select name="serviceType" value={formData.serviceType} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none transition-all appearance-none cursor-pointer">
                        <option value="airport-transfer">Airport Transfer</option>
                        <option value="private-tour">Private Tour</option>
                        <option value="wine-tour">Wine Tour</option>
                        <option value="group-transfer">Group Transfer</option>
                        <option value="chauffeur-service">Chauffeur Service</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Passengers</label>
                      <select name="passengers" value={formData.passengers} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none transition-all appearance-none cursor-pointer">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                        ))}
                        <option value="13+">13+ Passengers</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Pickup Location</label>
                      <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none transition-all placeholder:text-white/20" placeholder="e.g. Cape Town Airport" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Destination</label>
                      <input type="text" name="destination" value={formData.destination} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none transition-all placeholder:text-white/20" placeholder="e.g. Rockhaven Lodge" />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 border border-teal-500/30">3</div>
                    Schedule
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Date</label>
                      <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none transition-all [color-scheme:dark]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Time</label>
                      <input type="time" name="time" value={formData.time} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none transition-all [color-scheme:dark]" />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 border border-teal-500/30">4</div>
                    Final Options
                  </h3>
                  
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 block">Afternoon & Evening Shuttle Preference</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {['10:00 PM', '12:00 AM', '01:00 AM', 'Not Required'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setFormData({ ...formData, shuttleTime: t })}
                          className={`px-4 py-4 rounded-2xl border transition-all text-sm font-bold ${formData.shuttleTime === t ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-500/20' : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Special Requests</label>
                    <textarea name="specialRequests" value={formData.specialRequests} onChange={handleInputChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none transition-all placeholder:text-white/20 resize-none" placeholder="Any extra details..." />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <button onClick={() => handleFinalBooking('whatsapp')} className="group relative overflow-hidden bg-green-500 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-500/20">
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      <MessageCircle size={20} className="relative z-10" />
                      <span className="relative z-10">WhatsApp Booking</span>
                    </button>
                    <button onClick={() => handleFinalBooking('email')} className="group relative overflow-hidden bg-white text-slate-900 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-white/10">
                      <div className="absolute inset-0 bg-slate-900/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      <Mail size={20} className="relative z-10" />
                      <span className="relative z-10">Email Booking</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-12 flex items-center justify-between pt-8 border-t border-white/10">
                <button 
                  onClick={prevStep} 
                  disabled={step === 1}
                  className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0' : 'text-slate-400 hover:text-white'}`}
                >
                  Back
                </button>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-teal-500' : 'bg-white/20'}`} />
                  ))}
                </div>
                {step < 4 ? (
                  <button 
                    onClick={nextStep} 
                    disabled={!isStepValid()}
                    className={`bg-teal-500 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:hover:scale-100`}
                  >
                    Next Step
                  </button>
                ) : (
                  <button onClick={handlePhoneCall} className="text-teal-400 text-sm font-black uppercase tracking-widest hover:text-teal-300 transition-colors">
                    Need Help? Call Us
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;