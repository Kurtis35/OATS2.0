import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  LogOut,
  Trash2,
  Home,
  CheckCircle,
  ChevronDown,
  Search,
  Download,
  Lock,
  Shield,
  ArrowRight,
  Plane,
  Wine,
  Map,
  Sun,
  AlertCircle,
  Star,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Booking {
  timestamp: string;
  fullName: string;
  surname: string;
  email: string;
  phone: string;
  guestCount: number;
  accommodation: string;
  customAccommodation?: string;
  shuttleChoice: 'Afternoon' | 'Evening';
  eveningShuttleTime?: '10 PM' | '12 AM' | '1 AM';
  additionalServices: string[];
}

interface WeddingDetails {
  contactWhatsApp: string;
  contactEmail: string;
  shuttleStatus: string;
  lodgeTimes: Record<string, { afternoon: string; evening: string }>;
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
  "Inn On Highlands"
];

const DEFAULT_LODGE_TIMES: Record<string, { afternoon: string; evening: string }> = {
  "Elgin River Lodge": { afternoon: "1:45 PM", evening: "10 PM, 12 AM, 1 AM" },
  "33 Viljoenshoop Road": { afternoon: "2:00 PM", evening: "10 PM, 12 AM, 1 AM" },
  "Lavendar Cottages": { afternoon: "2:10 PM", evening: "10 PM, 12 AM, 1 AM" },
  "Cheverals Farm": { afternoon: "2:20 PM", evening: "10 PM, 12 AM, 1 AM" },
  "Oaklane Cottages": { afternoon: "2:30 PM", evening: "10 PM, 12 AM, 1 AM" },
  "Elgin Country Lodge": { afternoon: "2:40 PM", evening: "10 PM, 12 AM, 1 AM" },
  "Galileo": { afternoon: "2:50 PM", evening: "10 PM, 12 AM, 1 AM" },
  "Elgin Vintners": { afternoon: "1:55 PM", evening: "10 PM, 12 AM, 1 AM" },
  "Moortop Cottages": { afternoon: "2:05 PM", evening: "10 PM, 12 AM, 1 AM" },
  "Villa Eike": { afternoon: "2:15 PM", evening: "10 PM, 12 AM, 1 AM" },
  "Belfield Wines": { afternoon: "2:25 PM", evening: "10 PM, 12 AM, 1 AM" },
  "South Hill": { afternoon: "2:35 PM", evening: "10 PM, 12 AM, 1 AM" },
  "Villa Exner": { afternoon: "2:45 PM", evening: "10 PM, 12 AM, 1 AM" },
  "Apple Mountain Guest Farm": { afternoon: "1:40 PM", evening: "10 PM, 12 AM, 1 AM" },
  "Vredenhof": { afternoon: "1:50 PM", evening: "10 PM, 12 AM, 1 AM" },
  "Wildekrans Country House": { afternoon: "2:00 PM", evening: "10 PM, 12 AM, 1 AM" },
  "Endless Vinyards WWE": { afternoon: "2:10 PM", evening: "10 PM, 12 AM, 1 AM" },
  "Inn On Highlands": { afternoon: "2:20 PM", evening: "10 PM, 12 AM, 1 AM" }
};

const WeddingPortal = () => {
  const navigate = useNavigate();
  
  const [isGuestLoggedIn, setIsGuestLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [rsvpStep, setRsvpStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [selectedLodgeRSVP, setSelectedLodgeRSVP] = useState('');
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [shuttleChoice, setShuttleChoice] = useState<'Afternoon' | 'Evening' | ''>('');
  const [eveningShuttleTime, setEveningShuttleTime] = useState<'10 PM' | '12 AM' | '1 AM' | ''>('');

  const [selectedFinderLodge, setSelectedFinderLodge] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [details, setDetails] = useState<WeddingDetails>(() => {
    const saved = localStorage.getItem('wedding_details_v3_persistent');
    return saved ? JSON.parse(saved) : {
      contactWhatsApp: '079 503 6849',
      contactEmail: 'Adam@overbergtransfers.com',
      shuttleStatus: 'All shuttles are currently on time. Please be ready 10 minutes before your pickup.',
      lodgeTimes: DEFAULT_LODGE_TIMES
    };
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('wedding_local_bookings_v3_persistent');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wedding_local_bookings_v3_persistent', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('wedding_details_v3_persistent', JSON.stringify(details));
  }, [details]);

  useEffect(() => {
    if (localStorage.getItem('weddingAccess') === 'granted') setIsGuestLoggedIn(true);
  }, []);

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.toUpperCase() === 'OATS2026') {
      setIsGuestLoggedIn(true);
      localStorage.setItem('weddingAccess', 'granted');
    } else {
      setLoginError('Incorrect access code. Please check your invitation.');
    }
  };

  const handleLogout = () => {
    setIsGuestLoggedIn(false);
    setIsAdminLoggedIn(false);
    localStorage.removeItem('weddingAccess');
  };

  const handleRSVPSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const chosenShuttle = shuttleChoice as 'Afternoon' | 'Evening';
    const data: Booking = {
      timestamp: new Date().toLocaleString(),
      fullName: formData.get('fullName') as string,
      surname: formData.get('surname') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      guestCount,
      accommodation: selectedLodgeRSVP,
      customAccommodation: formData.get('customAccommodation') as string,
      shuttleChoice: chosenShuttle,
      eveningShuttleTime: chosenShuttle === 'Evening' ? eveningShuttleTime as '10 PM' | '12 AM' | '1 AM' : undefined,
      additionalServices
    };

    setBookings(prev => [...prev, data]);
    
    const netlifyData = new URLSearchParams();
    netlifyData.append('form-name', 'wedding-rsvp');
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        netlifyData.append(key, value.join(', '));
      } else {
        netlifyData.append(key, String(value ?? ''));
      }
    });

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: netlifyData.toString(),
    })
      .then(() => console.log('Form successfully submitted to Netlify'))
      .catch((error) => console.error('Netlify form submission error:', error));

    setFormSubmitted(true);
  };

  const downloadCSV = () => {
    if (bookings.length === 0) return;
    const headers = ["Timestamp", "Name", "Surname", "Email", "Phone", "Total Pax", "Accommodation", "Shuttle", "Evening Time", "Additional Services"].join(',');
    const rows = bookings.map(b => [
      b.timestamp,
      b.fullName,
      b.surname,
      b.email,
      b.phone,
      b.guestCount,
      b.accommodation === 'Other' ? b.customAccommodation : b.accommodation,
      b.shuttleChoice,
      b.eveningShuttleTime || '',
      `"${b.additionalServices.join('; ')}"`
    ].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "wedding_bookings.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleTimeChange = (lodge: string, type: 'afternoon' | 'evening', time: string) => {
    setDetails(prev => ({
      ...prev,
      lodgeTimes: {
        ...prev.lodgeTimes,
        [lodge]: { ...prev.lodgeTimes[lodge], [type]: time }
      }
    }));
  };

  const clearData = () => {
    if (window.confirm("Are you sure you want to clear all booking data?")) {
      setBookings([]);
      localStorage.removeItem('wedding_local_bookings_v3_persistent');
    }
  };

  // ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
  if (!isGuestLoggedIn && !isAdminLoggedIn) {
    return (
      <div className="min-h-screen font-sans">
        <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/55 z-10" />
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80"
            alt="Wedding"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 w-full max-w-lg mx-auto px-4 text-center">
            <img
              src="/oats_logos.jpg"
              alt="Overberg Airport Transfers"
              className="h-20 w-auto mx-auto mb-6 drop-shadow-xl"
            />
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/70 mb-2">Overberg Airport Transfers</p>
            <div className="inline-block mb-5 px-4 py-1 border border-white/30 rounded-full backdrop-blur-md text-[11px] font-bold uppercase tracking-widest text-white/80">
              Premium Transport Portal
            </div>
            <h1 className="text-5xl md:text-6xl font-serif italic mb-3">Rockhaven Wedding</h1>
            <p className="text-lg font-light mb-2 text-slate-200">Elgin Valley | Saturday 4 April 2026</p>

            <div className="mt-8 mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-left border border-white/20 text-sm text-white/90 leading-relaxed space-y-2">
              <p className="font-bold text-white text-center mb-3 text-base">How This Portal Works</p>
              <p>✦ <strong>RSVP your shuttle</strong> — confirm your afternoon or evening ride to Rockhaven in 4 easy steps.</p>
              <p>✦ <strong>Find your pickup time</strong> — use the lodge finder to see your exact departure time.</p>
              <p>✦ <strong>Book extras</strong> — arrange airport transfers, wine tours, or day tours directly from here.</p>
              <p>✦ <strong>Stay informed</strong> — all updates and emergency contacts are in this portal.</p>
              <p className="text-center text-white/60 text-xs mt-3 pt-3 border-t border-white/20">Your access code was provided on your wedding invitation.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 shadow-2xl">
              <form onSubmit={handleGuestLogin} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type="password"
                    placeholder="Enter Wedding Code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 outline-none transition-all text-center tracking-widest"
                  />
                </div>
                {loginError && <p className="text-red-400 text-xs text-center">{loginError}</p>}
                <button
                  type="submit"
                  className="w-full bg-white text-slate-900 font-bold py-4 rounded-2xl hover:bg-teal-500 hover:text-white transition-all transform active:scale-95 shadow-lg"
                >
                  Access Portal
                </button>
              </form>
              <div className="mt-6 flex items-center justify-between text-[10px] text-white/40 font-bold uppercase tracking-widest">
                <span>Business Portal</span>
                <button
                  onClick={() => {
                    const pw = prompt("Staff Password:");
                    if (pw === 'ADMINGETT2026') setIsAdminLoggedIn(true);
                    else if (pw) alert('Incorrect password.');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Staff Login
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
  if (isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <header className="bg-slate-900 text-white p-6 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold flex items-center">
              <Shield className="mr-2 text-teal-400" /> Admin Dashboard
            </h1>
            <div className="flex space-x-4">
              <button onClick={() => navigate('/')} className="bg-slate-800 px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-slate-700 transition-colors">
                <Home size={16} className="mr-2" /> Home
              </button>
              <button onClick={downloadCSV} className="bg-teal-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center"><Download size={16} className="mr-2" /> Export CSV</button>
              <button onClick={clearData} className="bg-red-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center"><Trash2 size={16} className="mr-2" /> Clear All</button>
              <button onClick={handleLogout} className="text-slate-400 hover:text-white"><LogOut /></button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto p-8">
          <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 mb-8">
            <div className="p-6 bg-slate-50 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Lodge Pickup Times (Editable)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="p-6">Lodge</th>
                    <th className="p-6">Afternoon Pickup</th>
                    <th className="p-6">Evening Pickup</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {LODGES.map(l => (
                    <tr key={l}>
                      <td className="p-6 font-bold text-slate-800">{l}</td>
                      <td className="p-6">
                        <input type="text" value={details.lodgeTimes[l]?.afternoon || ''} onChange={e => handleTimeChange(l, 'afternoon', e.target.value)} className="bg-white border border-slate-200 rounded px-3 py-1 text-sm focus:border-teal-500 outline-none w-32" />
                      </td>
                      <td className="p-6">
                        <input type="text" value={details.lodgeTimes[l]?.evening || ''} onChange={e => handleTimeChange(l, 'evening', e.target.value)} className="bg-white border border-slate-200 rounded px-3 py-1 text-sm focus:border-teal-500 outline-none w-32" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div className="relative w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input placeholder="Search guests..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20" />
              </div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{bookings.length} Total Bookings</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="p-6">Guest</th>
                    <th className="p-6">Contact</th>
                    <th className="p-6">Accommodation</th>
                    <th className="p-6 text-center">Total Pax</th>
                    <th className="p-6">Shuttle</th>
                    <th className="p-6">Evening Time</th>
                    <th className="p-6">Additional Services</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.filter(b => b.fullName.toLowerCase().includes(searchTerm.toLowerCase())).map((b, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6">
                        <div className="font-bold text-slate-800">{b.fullName} {b.surname}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{b.timestamp}</div>
                      </td>
                      <td className="p-6">
                        <div className="text-sm text-slate-600">{b.email}</div>
                        <div className="text-xs text-slate-400">{b.phone}</div>
                      </td>
                      <td className="p-6 text-sm font-medium text-slate-700">{b.accommodation === 'Other' ? b.customAccommodation : b.accommodation}</td>
                      <td className="p-6 text-center"><span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-lg text-sm font-bold">{b.guestCount}</span></td>
                      <td className="p-6"><span className="text-xs font-bold uppercase tracking-widest text-slate-500">{b.shuttleChoice}</span></td>
                      <td className="p-6"><span className="text-xs text-slate-500">{b.eveningShuttleTime || '—'}</span></td>
                      <td className="p-6">
                        <div className="flex flex-wrap gap-1">
                          {b.additionalServices.map((s, si) => <span key={si} className="text-[8px] font-bold uppercase bg-teal-50 text-teal-600 px-2 py-0.5 rounded border border-teal-100">{s}</span>)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── GUEST PORTAL ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-teal-100">

      {/* ── TRANSPORT RSVP (4 Steps) ── */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-slate-50 via-teal-50 to-blue-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-teal-500/10 -skew-x-12 transform translate-x-1/2" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-5xl md:text-6xl font-serif italic text-slate-900 mb-4 leading-tight">Transport RSVP</h2>
            <p className="text-lg md:text-xl text-slate-600 font-medium">Confirm your shuttle preferences in 4 easy steps.</p>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-2xl border-2 border-slate-100 overflow-hidden">
            {/* Step indicators */}
            <div className="flex border-b-2 border-slate-100 bg-slate-50/50">
              {[1, 2, 3, 4].map(step => (
                <div
                  key={step}
                  className={`flex-1 py-5 text-center text-[11px] font-black uppercase tracking-[0.2em] transition-all ${rsvpStep === step ? 'text-teal-600 bg-teal-100/50 border-b-4 border-teal-600' : rsvpStep > step ? 'text-teal-400' : 'text-slate-400'}`}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs mr-1 ${rsvpStep > step ? 'bg-teal-500 text-white' : rsvpStep === step ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-400'}`}>{step}</span>
                  <span className="hidden sm:inline">{['Details', 'Passengers', 'Lodge', 'Shuttle'][step - 1]}</span>
                </div>
              ))}
            </div>

            <div className="p-8 md:p-12">
              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-600/10">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-3xl font-serif italic mb-4">Reservation Confirmed!</h3>
                  <p className="text-slate-500 mb-4 max-w-sm mx-auto">Thank you! Your shuttle is booked. The GETT team will be in touch with final details.</p>
                  <p className="text-sm text-slate-400 mb-8">Questions? WhatsApp Adam on {details.contactWhatsApp}</p>
                  <button
                    onClick={() => { setFormSubmitted(false); setRsvpStep(1); setShuttleChoice(''); setEveningShuttleTime(''); setAdditionalServices([]); setSelectedLodgeRSVP(''); setGuestCount(1); }}
                    className="text-teal-600 font-bold hover:underline"
                  >
                    Submit another RSVP
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleRSVPSubmit}
                  className="space-y-8"
                  name="wedding-rsvp"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                >
                  <input type="hidden" name="form-name" value="wedding-rsvp" />
                  <p className="hidden"><label>Don't fill this out if you're human: <input name="bot-field" /></label></p>

                  {/* STEP 1 — Contact Details */}
                  {rsvpStep === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-slate-700 mb-2">Your Contact Details</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400">First Name</label>
                          <input required name="fullName" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Surname</label>
                          <input required name="surname" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none transition-all" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                        <input required name="email" type="email" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Phone / WhatsApp Number</label>
                        <input required name="phone" placeholder="+27" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none transition-all" />
                      </div>
                      <button type="button" onClick={() => setRsvpStep(2)} className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-teal-600 transition-all flex items-center justify-center group">
                        Next Step <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}

                  {/* STEP 2 — Total Pax */}
                  {rsvpStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-slate-700 mb-2">Passenger Count</h3>
                      <p className="text-slate-500 text-sm">How many people will be travelling in your group, including yourself?</p>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Total Pax You Are Booking For</label>
                        <select
                          value={guestCount}
                          onChange={e => setGuestCount(parseInt(e.target.value))}
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none text-lg font-bold text-slate-700"
                        >
                          {[1,2,3,4,5,6,7,8].map(n => (
                            <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                          ))}
                        </select>
                      </div>
                      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 text-sm text-teal-700 flex items-start gap-3">
                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                        <span>Please ensure your count includes all members of your group. This helps us allocate the right vehicle size.</span>
                      </div>
                      <div className="flex gap-4">
                        <button type="button" onClick={() => setRsvpStep(1)} className="flex-1 bg-slate-100 py-5 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-all">Back</button>
                        <button type="button" onClick={() => setRsvpStep(3)} className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center group hover:bg-teal-600 transition-all">
                          Next Step <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3 — Accommodation */}
                  {rsvpStep === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-slate-700 mb-2">Your Accommodation</h3>
                      <p className="text-slate-500 text-sm">Select your lodge so we can assign your correct pickup time.</p>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Select Accommodation</label>
                        <div className="relative">
                          <select
                            required
                            value={selectedLodgeRSVP}
                            onChange={e => setSelectedLodgeRSVP(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none appearance-none font-medium text-slate-700"
                          >
                            <option value="">Choose your lodge...</option>
                            {LODGES.map(l => <option key={l} value={l}>{l}</option>)}
                            <option value="Other">Other Accommodation</option>
                          </select>
                          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none" size={20} />
                        </div>
                      </div>
                      {selectedLodgeRSVP === 'Other' && (
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Enter Accommodation Name</label>
                          <input required name="customAccommodation" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none" />
                        </div>
                      )}
                      {selectedLodgeRSVP && selectedLodgeRSVP !== 'Other' && details.lodgeTimes[selectedLodgeRSVP] && (
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100 text-center">
                            <Sun className="mx-auto mb-1 text-teal-500" size={20} />
                            <p className="text-[10px] font-black uppercase tracking-widest text-teal-600 mb-1">Afternoon Pickup</p>
                            <p className="text-xl font-black text-teal-900">{details.lodgeTimes[selectedLodgeRSVP].afternoon}</p>
                          </div>
                          <div className="bg-slate-900 p-4 rounded-2xl text-white text-center">
                            <Clock className="mx-auto mb-1 text-teal-400" size={20} />
                            <p className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-1">Evening Options</p>
                            <p className="text-base font-black">10 PM · 12 AM · 1 AM</p>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-4">
                        <button type="button" onClick={() => setRsvpStep(2)} className="flex-1 bg-slate-100 py-5 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-all">Back</button>
                        <button
                          type="button"
                          onClick={() => { if (!selectedLodgeRSVP) { alert('Please select your accommodation.'); return; } setRsvpStep(4); }}
                          className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center group hover:bg-teal-600 transition-all"
                        >
                          Next Step <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4 — Shuttle + Evening Time + Additional Services */}
                  {rsvpStep === 4 && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-bold text-slate-700 mb-1">Choose Your Shuttle</h3>
                        <p className="text-slate-500 text-sm mb-5">Select when you'd like to travel. If choosing Evening, you must select a specific departure time.</p>
                        <div className="grid grid-cols-2 gap-4">
                          <label className="relative cursor-pointer group">
                            <input required type="radio" name="shuttleChoice" value="Afternoon" checked={shuttleChoice === 'Afternoon'} onChange={() => { setShuttleChoice('Afternoon'); setEveningShuttleTime(''); }} className="peer sr-only" />
                            <div className="p-7 rounded-3xl border-2 border-slate-200 bg-white text-slate-600 font-bold peer-checked:border-teal-600 peer-checked:text-teal-700 peer-checked:bg-teal-50 peer-checked:shadow-lg transition-all group-hover:border-teal-300 text-center">
                              <Sun className="mx-auto mb-3 text-amber-400" size={30} />
                              <div className="text-lg">Afternoon</div>
                              <div className="text-xs text-slate-400 mt-1 font-normal">Arrive in style before 3 PM</div>
                            </div>
                          </label>
                          <label className="relative cursor-pointer group">
                            <input required type="radio" name="shuttleChoice" value="Evening" checked={shuttleChoice === 'Evening'} onChange={() => setShuttleChoice('Evening')} className="peer sr-only" />
                            <div className="p-7 rounded-3xl border-2 border-slate-200 bg-white text-slate-600 font-bold peer-checked:border-teal-600 peer-checked:text-teal-700 peer-checked:bg-teal-50 peer-checked:shadow-lg transition-all group-hover:border-teal-300 text-center">
                              <Clock className="mx-auto mb-3 text-indigo-400" size={30} />
                              <div className="text-lg">Evening Return</div>
                              <div className="text-xs text-slate-400 mt-1 font-normal">Dance the night away</div>
                            </div>
                          </label>
                        </div>
                      </div>

                      {shuttleChoice === 'Evening' && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <AlertCircle size={16} className="text-amber-500" />
                            <label className="text-sm font-black uppercase tracking-widest text-slate-800">Select Your Evening Departure Time <span className="text-red-500">*</span></label>
                          </div>
                          <p className="text-xs text-slate-500">Please choose one — shuttles depart promptly at these times.</p>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { time: '10 PM', label: 'The Early Bird', desc: 'First departure' },
                              { time: '12 AM', label: 'Party Shuttle', desc: 'Midnight run' },
                              { time: '1 AM', label: 'Final Send-off', desc: 'Last departure' }
                            ].map(({ time, label, desc }) => (
                              <label key={time} className="relative cursor-pointer group">
                                <input
                                  type="radio"
                                  name="eveningTime"
                                  value={time}
                                  checked={eveningShuttleTime === time}
                                  onChange={() => setEveningShuttleTime(time as '10 PM' | '12 AM' | '1 AM')}
                                  className="peer sr-only"
                                />
                                <div className="p-4 rounded-2xl border-2 border-slate-200 bg-white text-center peer-checked:border-teal-600 peer-checked:bg-teal-50 peer-checked:shadow-lg transition-all group-hover:border-teal-300">
                                  <div className="text-xl font-black text-slate-800 peer-checked:text-teal-700">{time}</div>
                                  <div className="text-[11px] font-bold text-teal-600 mt-0.5">{label}</div>
                                  <div className="text-[10px] text-slate-400">{desc}</div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t border-slate-100 pt-6">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-4">Additional Services (Optional)</label>
                        <div className="grid md:grid-cols-3 gap-4">
                          {[
                            { id: 'airport', label: 'Airport Transfer', icon: <Plane size={18} />, desc: 'CPT ↔ Elgin' },
                            { id: 'wine', label: 'Wine Tour', icon: <Wine size={18} />, desc: 'Elgin Valley estates' },
                            { id: 'day', label: 'Day Tour', icon: <Map size={18} />, desc: 'Explore the region' }
                          ].map(service => (
                            <label key={service.id} className="flex items-start p-5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-white hover:shadow-lg transition-all group">
                              <input
                                type="checkbox"
                                className="w-5 h-5 rounded-md border-slate-300 text-teal-600 focus:ring-teal-500 mt-0.5"
                                checked={additionalServices.includes(service.label)}
                                onChange={e => {
                                  if (e.target.checked) setAdditionalServices([...additionalServices, service.label]);
                                  else setAdditionalServices(additionalServices.filter(s => s !== service.label));
                                }}
                              />
                              <div className="ml-3">
                                <div className="flex items-center text-slate-700 group-hover:text-teal-600 font-bold text-sm">
                                  <span className="mr-2 text-teal-500">{service.icon}</span>{service.label}
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5">{service.desc}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4 pt-2">
                        <button type="button" onClick={() => setRsvpStep(3)} className="flex-1 bg-slate-100 py-5 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-all">Back</button>
                        <button
                          type="submit"
                          onClick={() => {
                            if (!shuttleChoice) { alert('Please select a shuttle option.'); return; }
                            if (shuttleChoice === 'Evening' && !eveningShuttleTime) { alert('Please select your evening departure time.'); return; }
                          }}
                          className="flex-[2] bg-gradient-to-r from-teal-600 to-teal-700 text-white py-5 rounded-2xl font-bold shadow-xl shadow-teal-600/20 hover:from-teal-700 hover:to-teal-800 transition-all active:scale-95"
                        >
                          Complete Reservation
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── LODGE PICKUP FINDER ── */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent)]" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-6 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-[11px] font-black uppercase tracking-widest">Interactive Tool</div>
              <h2 className="text-5xl md:text-6xl font-serif italic text-slate-900 mb-6 leading-tight">Lodge Pickup Finder</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">Select your accommodation to discover your exact shuttle times for the big day.</p>
              <div className="relative mb-8">
                <select
                  value={selectedFinderLodge}
                  onChange={e => setSelectedFinderLodge(e.target.value)}
                  className="w-full px-8 py-5 rounded-[2rem] border-2 border-slate-200 bg-white text-slate-800 font-bold focus:outline-none focus:border-teal-600 appearance-none cursor-pointer transition-all shadow-md"
                >
                  <option value="">Choose your lodge...</option>
                  {LODGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none" size={22} />
              </div>
              {selectedFinderLodge && details.lodgeTimes[selectedFinderLodge] && (
                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-teal-50 p-7 rounded-[2rem] border border-teal-100">
                    <Sun className="mb-3 text-teal-500" size={28} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-teal-600 mb-1">Afternoon Pickup</p>
                    <h4 className="text-3xl font-black text-teal-900">{details.lodgeTimes[selectedFinderLodge].afternoon}</h4>
                  </div>
                  <div className="bg-slate-900 p-7 rounded-[2rem] text-white">
                    <Clock className="mb-3 text-teal-400" size={28} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-1">Evening Options</p>
                    <h4 className="text-2xl font-black text-white">10 PM<br/>12 AM · 1 AM</h4>
                  </div>
                </div>
              )}
            </div>
            <div className="rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src="/flyer-passenger-briefing.jpeg"
                alt="Passenger Briefing Card"
                className="w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => setSelectedImage('/flyer-passenger-briefing.jpeg')}
              />
              <p className="text-center text-xs text-slate-400 py-2 bg-slate-50">Click to view full size</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── AIRPORT TRANSFERS ── */}
      <section className="py-24 md:py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-900/80 z-10" />
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80" alt="Airport" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative z-20 max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-teal-500/20 text-teal-300 rounded-full text-[11px] font-black uppercase tracking-widest border border-teal-500/30">
                <Plane size={14} /> Airport Transfers
              </div>
              <h2 className="text-4xl md:text-5xl font-serif italic mb-6 leading-tight">Cape Town International<br/>↔ Elgin Valley</h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                Elgin is approximately a 60-minute drive from Cape Town International Airport (CPT) through a stunning mountain pass. For a seamless, safe arrival, we strongly recommend a private GETT transfer.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star size={18} className="text-teal-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">GETT Private Transfer</p>
                    <p className="text-slate-400 text-sm">Your driver meets you at Arrivals with a name board. Door-to-door comfort from CPT to your lodge.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-teal-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">Book at Least 96 Hours in Advance</p>
                    <p className="text-slate-400 text-sm">Submit your flight details so we can guarantee a driver is waiting. Please provide your arrival and departure times.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">Uber & Bolt Warning</p>
                    <p className="text-slate-400 text-sm">Uber and Bolt do not operate reliably in the Grabouw/Elgin Valley — especially late at night. Do not rely on them.</p>
                  </div>
                </div>
              </div>
              <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-6">
                <p className="text-white font-bold mb-3">How to Book Your Airport Transfer</p>
                <div className="space-y-2 text-sm text-slate-300">
                  <p className="flex items-center gap-2"><ChevronRight size={14} className="text-teal-400" /> Tick <strong className="text-white">Airport Transfer</strong> in your RSVP above, or contact GETT directly.</p>
                  <p className="flex items-center gap-2"><ChevronRight size={14} className="text-teal-400" /> WhatsApp / Call: <strong className="text-white">079 503 6849 | 082 441 6999</strong></p>
                  <p className="flex items-center gap-2"><ChevronRight size={14} className="text-teal-400" /> Email: <strong className="text-white">Adam@overbergtransfers.com</strong></p>
                  <p className="flex items-center gap-2"><ChevronRight size={14} className="text-teal-400" /> Emergency line: <strong className="text-white">066 233 4928</strong></p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div
                className="rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer hover:scale-[1.01] transition-transform border border-white/10"
                onClick={() => setSelectedImage('/flyer-travel-guide.jpeg')}
              >
                <img src="/flyer-travel-guide.jpeg" alt="Elgin Travel & Event Guide" className="w-full object-cover" />
                <p className="text-center text-xs text-white/40 py-2 bg-white/5">Click to view full size</p>
              </div>
              <div
                className="rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer hover:scale-[1.01] transition-transform border border-white/10"
                onClick={() => setSelectedImage('/flyer-emergency-card.jpeg')}
              >
                <img src="/flyer-emergency-card.jpeg" alt="Emergency Contact Card" className="w-full object-cover" />
                <p className="text-center text-xs text-white/40 py-2 bg-white/5">Click to view full size</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXCLUSIVE ROCKHAVEN WEDDING EXPERIENCES ── */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-amber-50 via-white to-teal-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-[11px] font-black uppercase tracking-widest">Curated for Sara & Will's Guests</div>
            <h2 className="text-4xl md:text-5xl font-serif italic text-slate-900 mb-4 leading-tight">Exclusive Rockhaven<br/>Wedding Experiences</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Don't just stay in your room! The Elgin Valley is world-renowned for its cool-climate wines, orchards, and natural beauty. GETT has curated these private experiences just for wedding guests.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start mb-14">
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                    <Wine size={24} className="text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Wine Tour</h3>
                    <p className="text-sm text-slate-500">Elgin Valley Estates</p>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Explore the world-class wine estates of the Elgin Valley. Your private GETT tour takes you through the Apple & Vine trail — including South Hill, Oak Valley, and the iconic Paul Cluver Estate — for exclusive tastings and spectacular vineyard views.
                </p>
                <ul className="space-y-2 text-sm text-slate-500 mb-5">
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal-500" /> Private or small-group format</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal-500" /> Thursday & Friday departures (Wed–Fri)</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal-500" /> Includes tastings & scenic stops</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal-500" /> Duration: 3–4 hours</li>
                </ul>
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-sm text-purple-700">
                  <strong>Highlight:</strong> Oude Molen Brandy Distillery — a historic gem. Highly recommended!
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                    <Map size={24} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Day Tour</h3>
                    <p className="text-sm text-slate-500">Explore the Overberg</p>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Make the most of your time in the Overberg. GETT's day tours take you off the beaten path to discover whale watching in Hermanus, the Franschhoek Pass, Peregrine Farm Stall, Cape Canopy Tours, and the stunning Grabouw landscapes.
                </p>
                <ul className="space-y-2 text-sm text-slate-500 mb-5">
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal-500" /> Coastal & inland options available</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal-500" /> Private driver — your schedule, your pace</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal-500" /> Family & group friendly</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal-500" /> Duration: 3–6 hours</li>
                </ul>
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-700">
                  <strong>Quick escape:</strong> Hermanus coastal drive — 30 mins, whale watching in season!
                </div>
              </div>

              <div className="bg-slate-900 p-7 rounded-[2rem] text-white">
                <p className="font-bold text-lg mb-3">How to Book an Experience</p>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>Tick <strong className="text-white">Wine Tour</strong> or <strong className="text-white">Day Tour</strong> in your RSVP, or contact GETT directly.</p>
                  <p className="mt-3"><strong className="text-white">WhatsApp / Call:</strong> 079 503 6849 | 082 441 6999</p>
                  <p><strong className="text-white">Email:</strong> Adam@overbergtransfers.com</p>
                  <p className="text-amber-400 text-xs mt-3">⚠ Space is limited — book at least 14 days in advance.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div
                className="rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer hover:scale-[1.01] transition-transform"
                onClick={() => setSelectedImage('/flyer-experiences.jpeg')}
              >
                <img src="/flyer-experiences.jpeg" alt="Exclusive Rockhaven Wedding Experiences" className="w-full object-cover" />
                <p className="text-center text-xs text-slate-400 py-2 bg-slate-50">Click to view full size</p>
              </div>
              <div
                className="rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer hover:scale-[1.01] transition-transform"
                onClick={() => setSelectedImage('/flyer-concierge-faq.jpeg')}
              >
                <img src="/flyer-concierge-faq.jpeg" alt="Wedding Concierge FAQ" className="w-full object-cover" />
                <p className="text-center text-xs text-slate-400 py-2 bg-slate-50">Click to view full size</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WEDDING TRANSPORT FLYERS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif italic text-slate-800 mb-3">Your Complete Transport Guide</h2>
            <p className="text-slate-500">Everything you need to know for a seamless Rockhaven wedding experience.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { src: '/flyer-wedding-transport.jpeg', title: 'Wedding Transport Overview' },
              { src: '/flyer-faq.jpeg', title: 'FAQs & Transport Info' },
              { src: '/flyer-welcome.jpeg', title: 'Guest Welcome Guide' }
            ].map(({ src, title }) => (
              <div
                key={src}
                className="rounded-[2rem] overflow-hidden shadow-xl cursor-pointer hover:scale-[1.02] transition-transform border border-slate-100"
                onClick={() => setSelectedImage(src)}
              >
                <img src={src} alt={title} className="w-full object-cover" />
                <p className="text-center text-xs text-slate-400 py-2 bg-slate-50">{title} — click to enlarge</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMERGENCY & SUPPORT ── */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Phone size={28} className="text-red-400" />
          </div>
          <h2 className="text-3xl font-serif italic mb-4">Emergency & Support</h2>
          <p className="text-slate-400 mb-10 max-w-lg mx-auto">Running late? Missed your shuttle? Our team is on call throughout the wedding weekend.</p>
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-2">Primary Line</p>
              <p className="text-xl font-black">079 503 6849</p>
              <p className="text-xs text-slate-500 mt-1">Adam Jantjies — GETT</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-2">Secondary Line</p>
              <p className="text-xl font-black">082 441 6999</p>
              <p className="text-xs text-slate-500 mt-1">WhatsApp Support</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-2">Emergency</p>
              <p className="text-xl font-black">066 233 4928</p>
              <p className="text-xs text-slate-500 mt-1">24-hour dispatch</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm">Medical Emergency: <strong className="text-white">10177</strong> | Police: <strong className="text-white">10111</strong> | Ambulance (ER24): <strong className="text-white">084 124</strong></p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 border-t border-slate-100 text-center bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <img src="/oats_logos.jpg" alt="Overberg Airport Transfers" className="h-14 w-auto mx-auto mb-6 opacity-80" />
          <p className="font-serif italic text-2xl text-slate-800 mb-1">Overberg Airport Transfers</p>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-teal-600 mb-6">Premium Logistics | Rockhaven 2026</p>
          <p className="text-xs text-slate-400 mb-8">&copy; 2026 Rockhaven Wedding. Coordination by GETT Staff.</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate('/')} className="flex items-center space-x-2 px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-all text-sm font-bold text-slate-600">
              <Home size={15} /><span>Home</span>
            </button>
            <button onClick={handleLogout} className="flex items-center space-x-2 px-5 py-2 rounded-full bg-red-50 hover:bg-red-100 transition-all text-sm font-bold text-red-600">
              <LogOut size={15} /><span>Exit Portal</span>
            </button>
          </div>
        </div>
      </footer>

      {/* ── IMAGE LIGHTBOX ── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/10 p-3 rounded-full hover:bg-white/20 z-10"
            onClick={() => setSelectedImage(null)}
          >
            <LogOut size={22} className="rotate-90" />
          </button>
          <img
            src={selectedImage}
            alt="Full size flyer"
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default WeddingPortal;
