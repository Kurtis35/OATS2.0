import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  LogOut,
  Home,
  CheckCircle,
  ChevronDown,
  Shield,
  Star,
  MessageCircle,
  Users,
  Plane,
  Wine,
  Sun
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Types ---
interface Booking {
  timestamp: string;
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  totalPax: number;
  accommodation: string;
  customAccommodation?: string;
  eveningShuttle: string;
  additionalServices: string[];
  airportTransferType?: string;
}

const LODGES = [
  "Elgin River Lodge",
  "33 Viljoenshoop Road",
  "Lavendar Cottages",
  "Cheverals Farm",
  "Oaklane Cottages",
  "Elgin Country Lodge",
  "Galileo",
  "Elgin Vintners",
  "Moortop Cottages",
  "Villa Eike",
  "Belfield Wines",
  "South Hill",
  "Villa Exner",
  "Apple Mountain Guest Farm",
  "Vredenhof",
  "Wildekrans Country House",
  "Endless Vinyards WWE",
  "Inn On Highlands",
  "Other Accommodation"
];

const SCHEDULE_LODGES = [
  { name: "Rockhaven Lodge", afternoon: "1:45 PM", evening: "6:00 PM" },
  { name: "Elgin Valley Inn", afternoon: "2:00 PM", evening: "6:15 PM" },
  { name: "Orchard Guest House", afternoon: "2:10 PM", evening: "6:25 PM" }
];

const WeddingPortal = () => {
  const navigate = useNavigate();
  
  // Auth State
  const [isGuestLoggedIn, setIsGuestLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // RSVP Form State
  const [rsvpStep, setRsvpStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    phone: '',
    totalPax: 1,
    accommodation: '',
    customAccommodation: '',
    eveningShuttle: '',
    additionalServices: [] as string[],
    airportTransferType: ''
  });

  // UI State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (localStorage.getItem('weddingAccess') === 'granted') setIsGuestLoggedIn(true);
  }, []);

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.toUpperCase() === 'OATS2026') {
      setIsGuestLoggedIn(true);
      localStorage.setItem('weddingAccess', 'granted');
    } else {
      setLoginError('Incorrect access code.');
    }
  };

  const handleLogout = () => {
    setIsGuestLoggedIn(false);
    setIsAdminLoggedIn(false);
    localStorage.removeItem('weddingAccess');
  };

  const handleRSVPSubmit = async () => {
    const data: Booking = {
      timestamp: new Date().toLocaleString(),
      ...formData
    };

    setFormSubmitted(true);

    // Send to Google Sheets
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyKgq_pUO2wgYmsZxLDWE81v3MIaLg4exyGh_x7CNY/exec';
    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    // Email Notification
    const subject = encodeURIComponent(`Wedding RSVP: ${formData.firstName} ${formData.surname}`);
    const body = encodeURIComponent(`
New Wedding Transport RSVP:
Name: ${formData.firstName} ${formData.surname}
Email: ${formData.email}
Phone: ${formData.phone}
Total Pax: ${formData.totalPax}
Accommodation: ${formData.accommodation === 'Other Accommodation' ? formData.customAccommodation : formData.accommodation}
Evening Shuttle: ${formData.eveningShuttle}
Additional Services: ${formData.additionalServices.join(', ')}
${formData.airportTransferType ? `Airport Transfer: ${formData.airportTransferType}` : ''}
    `);
    window.location.href = `mailto:Adam@overbergtransfers.com?subject=${subject}&body=${body}`;

    // WhatsApp Notification
    const whatsappMsg = encodeURIComponent(`*New Wedding RSVP*\n*Name:* ${formData.firstName} ${formData.surname}\n*Pax:* ${formData.totalPax}\n*Shuttle:* ${formData.eveningShuttle}\n*Stay:* ${formData.accommodation}`);
    window.open(`https://wa.me/27795036849?text=${whatsappMsg}`, '_blank');

    setTimeout(() => {
      setFormSubmitted(false);
      setRsvpStep(1);
      setFormData({
        firstName: '',
        surname: '',
        email: '',
        phone: '',
        totalPax: 1,
        accommodation: '',
        customAccommodation: '',
        eveningShuttle: '',
        additionalServices: [],
        airportTransferType: ''
      });
    }, 3000);
  };

  if (!isGuestLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
          <img src="/OATS LOGO.jpg" alt="OATS Logo" className="h-24 mx-auto rounded-2xl shadow-2xl" />
          <div className="space-y-2">
            <h1 className="text-4xl font-serif italic text-white">Rockhaven Wedding</h1>
            <p className="text-slate-400">Guest Transport Portal</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <form onSubmit={handleGuestLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Enter Wedding Code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:border-teal-500 outline-none transition-all text-center tracking-widest"
              />
              {loginError && <p className="text-red-400 text-xs">{loginError}</p>}
              <button type="submit" className="w-full bg-teal-500 text-white font-bold py-4 rounded-2xl hover:bg-teal-600 transition-all transform active:scale-95 shadow-lg">
                Access Portal
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <img src="/OATS LOGO.jpg" alt="Logo" className="h-12 rounded-lg" />
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Hero / Booking Form */}
      <section className="pt-32 pb-24 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-teal-600 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Transport RSVP</span>
          <h2 className="text-5xl md:text-7xl font-serif italic mb-12">Confirm Your Journey</h2>
          
          <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden text-left">
            {/* Progress */}
            <div className="flex h-1.5 bg-slate-100">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`flex-1 transition-all duration-700 ${i <= rsvpStep ? 'bg-teal-500' : ''}`} />
              ))}
            </div>

            <div className="p-8 md:p-16">
              {rsvpStep === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-3xl font-bold italic font-serif">Guest Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <input 
                      type="text" placeholder="First Name" 
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all" 
                    />
                    <input 
                      type="text" placeholder="Surname" 
                      value={formData.surname}
                      onChange={e => setFormData({...formData, surname: e.target.value})}
                      className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all" 
                    />
                    <input 
                      type="email" placeholder="Email Address" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all" 
                    />
                    <input 
                      type="tel" placeholder="Phone Number" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all" 
                    />
                  </div>
                </div>
              )}

              {rsvpStep === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-3xl font-bold italic font-serif">Accommodation</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <select 
                      value={formData.accommodation}
                      onChange={e => setFormData({...formData, accommodation: e.target.value})}
                      className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Accommodation...</option>
                      {LODGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <div className="relative">
                      <input 
                        type="number" min="1" placeholder="Total Pax" 
                        value={formData.totalPax}
                        onChange={e => setFormData({...formData, totalPax: parseInt(e.target.value)})}
                        className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all" 
                      />
                      <Users className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    </div>
                  </div>
                  {formData.accommodation === 'Other Accommodation' && (
                    <input 
                      type="text" placeholder="Specify Accommodation" 
                      value={formData.customAccommodation}
                      onChange={e => setFormData({...formData, customAccommodation: e.target.value})}
                      className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all animate-in zoom-in-95" 
                    />
                  )}
                </div>
              )}

              {rsvpStep === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-3xl font-bold italic font-serif">Evening Shuttle</h3>
                  <div className="grid gap-4">
                    {['10:00 PM', '12:00 AM', '01:00 AM'].map(time => (
                      <button
                        key={time}
                        onClick={() => setFormData({...formData, eveningShuttle: time})}
                        className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center justify-between font-bold ${formData.eveningShuttle === time ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-lg' : 'bg-slate-50 border-transparent hover:border-slate-200 text-slate-600'}`}
                      >
                        <span>{time} Departure</span>
                        {formData.eveningShuttle === time && <CheckCircle className="text-teal-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {rsvpStep === 4 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-3xl font-bold italic font-serif">Additional Services</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {['Airport Transfer', 'Wine Tour', 'Day Tour'].map(service => (
                      <button
                        key={service}
                        onClick={() => {
                          const services = formData.additionalServices.includes(service)
                            ? formData.additionalServices.filter(s => s !== service)
                            : [...formData.additionalServices, service];
                          setFormData({...formData, additionalServices: services});
                        }}
                        className={`p-6 rounded-2xl border-2 transition-all text-center font-bold ${formData.additionalServices.includes(service) ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-lg' : 'bg-slate-50 border-transparent hover:border-slate-200 text-slate-600'}`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                  {formData.additionalServices.includes('Airport Transfer') && (
                    <select 
                      value={formData.airportTransferType}
                      onChange={e => setFormData({...formData, airportTransferType: e.target.value})}
                      className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all animate-in zoom-in-95"
                    >
                      <option value="">Select Transfer Type...</option>
                      <option value="One Way Transfer">One Way Transfer</option>
                      <option value="Return Transfer">Return Transfer</option>
                    </select>
                  )}
                </div>
              )}

              <div className="mt-16 flex items-center justify-between">
                <button 
                  onClick={() => setRsvpStep(s => s - 1)}
                  className={`text-slate-400 font-bold hover:text-slate-900 transition-colors ${rsvpStep === 1 ? 'invisible' : ''}`}
                >
                  Back
                </button>
                {rsvpStep < 4 ? (
                  <button 
                    onClick={() => setRsvpStep(s => s + 1)}
                    className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold hover:bg-teal-600 transition-all shadow-xl"
                  >
                    Next Step
                  </button>
                ) : (
                  <button 
                    onClick={handleRSVPSubmit}
                    className="bg-teal-500 text-white px-12 py-5 rounded-2xl font-bold hover:bg-teal-600 transition-all shadow-xl"
                  >
                    {formSubmitted ? 'Submitting...' : 'Confirm RSVP'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pickup Schedule */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif italic mb-4">Pickup Schedule</h2>
            <p className="text-slate-400">Shuttle departure times for our main partner lodges.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {SCHEDULE_LODGES.map(lodge => (
              <div key={lodge.name} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 group hover:scale-[1.02] transition-all duration-500">
                <h4 className="text-2xl font-bold mb-8 text-slate-900">{lodge.name}</h4>
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <div className="flex items-center text-slate-400 text-xs font-black uppercase tracking-widest">
                      <Sun size={14} className="mr-2" /> Afternoon
                    </div>
                    <span className="font-bold text-teal-600">{lodge.afternoon}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-slate-400 text-xs font-black uppercase tracking-widest">
                      <Clock size={14} className="mr-2" /> Evening
                    </div>
                    <span className="font-bold text-slate-900">{lodge.evening}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guest FAQs */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif italic mb-4">Guest FAQs</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "When should I be ready for my shuttle?", a: "Please be waiting in the main reception or driveway area of your lodge at least 10 minutes before the scheduled pickup time." },
              { q: "Who do I contact if I need help?", a: "For transport issues, contact Adam via WhatsApp. For general wedding queries, please refer to the main invitation." },
              { q: "Are the roads safe at night?", a: "While the main roads are fine, farm roads are narrow and dark. Our professional drivers are experienced with the local terrain." },
              { q: "What happens if I miss my shuttle?", a: "Latecomers will need to arrange their own private transport to the venue. Shuttles cannot wait as it impacts all other guest pickups." }
            ].map((faq, i) => (
              <div key={i} className="border border-slate-100 rounded-[2rem] overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full p-8 text-left flex items-center justify-between transition-colors ${openFaq === i ? 'bg-teal-50' : 'bg-white'}`}
                >
                  <span className="font-bold text-lg">{faq.q}</span>
                  <ChevronDown className={`transition-transform duration-500 ${openFaq === i ? 'rotate-180 text-teal-600' : 'text-slate-300'}`} />
                </button>
                {openFaq === i && (
                  <div className="p-8 pt-0 bg-teal-50 text-slate-600 leading-relaxed animate-in slide-in-from-top-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel in Style Banner */}
      <section className="relative py-32 bg-slate-900 overflow-hidden text-center text-white">
        <div className="absolute inset-0 z-0 opacity-40">
          <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80" alt="Experience" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <Star className="text-teal-400 mx-auto mb-8" size={32} />
          <h2 className="text-5xl md:text-7xl font-serif italic mb-8">Travel in Style</h2>
          <p className="text-xl font-light text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Elevate your stay in Elgin Valley. From luxury airport transfers to exclusive private wine tours, our premium fleet is at your service.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-bold text-lg hover:bg-teal-500 hover:text-white transition-all shadow-2xl"
          >
            Explore More Services
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <img src="/OATS LOGO.jpg" alt="Logo" className="h-16 mx-auto mb-8 rounded-xl" />
          <p className="font-serif italic text-2xl mb-2">Overberg Transfers & Tours</p>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-teal-600 mb-12">Premium Logistics</p>
          <div className="flex justify-center space-x-8 text-slate-300 mb-12">
            <Mail size={20} className="hover:text-teal-600 cursor-pointer transition-colors" />
            <Phone size={20} className="hover:text-teal-600 cursor-pointer transition-colors" />
            <MapPin size={20} className="hover:text-teal-600 cursor-pointer transition-colors" />
          </div>
          <p className="text-xs text-slate-400 font-medium">&copy; 2026 Rockhaven Wedding. Coordination by GETT Staff.</p>
        </div>
      </footer>
    </div>
  );
};

export default WeddingPortal;