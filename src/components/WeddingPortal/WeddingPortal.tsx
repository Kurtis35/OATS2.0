import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bus, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Info, 
  Wine, 
  Coffee, 
  LogOut,
  Edit2,
  Plus,
  Trash2,
  Home,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  Users,
  Search,
  Download,
  RefreshCw,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Types ---
interface ScheduleItem {
  id: string;
  location: string;
  time: string;
  status: string;
}

interface WeddingDetails {
  date: string;
  venue: string;
  ceremonyTime: string;
  receptionDepartureTimes: { id: string; label: string; time: string }[];
  contactWhatsApp: string;
  contactEmail: string;
  shuttleStatus: string;
  webhookUrl: string;
  sheetJsonUrl: string;
}

interface Booking {
  timestamp: string;
  fullName: string;
  phone: string;
  email: string;
  accommodation: string;
  guestCount: string;
  airportTransfer: string;
  pickupWindow: string;
}

const WeddingPortal = () => {
  const navigate = useNavigate();
  
  // Auth State
  const [isGuestLoggedIn, setIsGuestLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // UI State
  const [selectedLodge, setSelectedLodge] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [rsvpStep, setRsvpStep] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLodge, setFilterLodge] = useState('All');

  // Data State
  const [details, setDetails] = useState<WeddingDetails>(() => {
    const saved = localStorage.getItem('wedding_details_v2');
    return saved ? JSON.parse(saved) : {
      date: 'Saturday, 4 April 2026',
      venue: 'Rockhaven, Elgin Valley',
      ceremonyTime: '3:00 PM',
      receptionDepartureTimes: [
        { id: '1', label: 'Early Bird Shuttle', time: '10:00 PM' },
        { id: '2', label: 'Party Shuttle', time: '12:00 AM' },
        { id: '3', label: 'Final Shuttle', time: '01:00 AM' }
      ],
      contactWhatsApp: '079 503 6849',
      contactEmail: 'Adam@overbergtransfers.com',
      shuttleStatus: 'All shuttles are currently on time. Pickup window is between 1:45 PM and 2:45 PM.',
      webhookUrl: '',
      sheetJsonUrl: ''
    };
  });

  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('wedding_schedule_v2');
    return saved ? JSON.parse(saved) : [
      { id: '1', location: 'Rockhaven Lodge', time: '1:45 PM', status: 'On Time' },
      { id: '2', location: 'Elgin Valley Inn', time: '2:15 PM', status: 'On Time' },
      { id: '3', location: 'Orchard Guest House', time: '2:30 PM', status: 'On Time' },
    ];
  });

  const [bookings, setBookings] = useState<Booking[]>([]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('wedding_details_v2', JSON.stringify(details));
  }, [details]);

  useEffect(() => {
    localStorage.setItem('wedding_schedule_v2', JSON.stringify(schedule));
  }, [schedule]);

  // Session check
  useEffect(() => {
    if (localStorage.getItem('weddingAccess') === 'granted') setIsGuestLoggedIn(true);
  }, []);

  // Admin Data Sync
  const fetchBookings = async () => {
    if (!details.sheetJsonUrl) return;
    setIsRefreshing(true);
    try {
      const response = await fetch(details.sheetJsonUrl);
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : (data.bookings || []));
    } catch (e) {
      console.error('Sync failed', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isAdminLoggedIn && details.sheetJsonUrl) {
      fetchBookings();
      interval = setInterval(fetchBookings, 30000);
    }
    return () => clearInterval(interval);
  }, [isAdminLoggedIn, details.sheetJsonUrl]);

  // Handlers
  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.toUpperCase() === 'OATS2026') {
      setIsGuestLoggedIn(true);
      localStorage.setItem('weddingAccess', 'granted');
      setLoginError('');
    } else {
      setLoginError('Incorrect access code.');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'ADMINGETT2026') {
      setIsAdminLoggedIn(true);
      setLoginError('');
    } else {
      alert('Incorrect admin password.');
    }
  };

  const handleLogout = () => {
    setIsGuestLoggedIn(false);
    setIsAdminLoggedIn(false);
    localStorage.removeItem('weddingAccess');
  };

  const handleRSVPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (details.webhookUrl) {
      try {
        await fetch(details.webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (e) { console.error(e); }
    }
    setFormSubmitted(true);
    setRsvpStep(3);
  };

  const downloadCSV = () => {
    if (bookings.length === 0) return;
    const headers = Object.keys(bookings[0]).join(',');
    const rows = bookings.map(b => Object.values(b).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "wedding_bookings.csv");
    document.body.appendChild(link);
    link.click();
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = b.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           b.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLodge = filterLodge === 'All' || b.accommodation === filterLodge;
      return matchesSearch && matchesLodge;
    });
  }, [bookings, searchTerm, filterLodge]);

  const stats = useMemo(() => {
    return {
      totalBookings: bookings.length,
      totalGuests: bookings.reduce((acc, b) => acc + (parseInt(b.guestCount) || 0), 0)
    };
  }, [bookings]);

  // Views
  if (!isGuestLoggedIn && !isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <section className="relative h-[50vh] flex items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img src="/dark_blue_photographic_conference_event_website_(4).jpg" alt="Elgin" className="absolute inset-0 w-full h-full object-cover animate-subtle-zoom" />
          <div className="relative z-20 container mx-auto px-4 text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Rockhaven Wedding Transport Portal</h1>
            <p className="text-xl md:text-2xl font-light">Transport coordination for the Rockhaven Wedding in Elgin Valley.</p>
            <div className="mt-8 flex items-center justify-center space-x-8 text-sm uppercase tracking-[0.2em] font-bold text-teal-400">
              <span className="flex items-center"><Calendar size={16} className="mr-2"/> Saturday 4 April 2026</span>
              <span className="flex items-center"><Clock size={16} className="mr-2"/> Ceremony at 3:00 PM</span>
            </div>
          </div>
        </section>

        <section className="flex-grow flex items-center justify-center -mt-16 relative z-30 p-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
            {/* Guest Login */}
            <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 border border-slate-100">
              <div className="flex justify-between items-start mb-8">
                <button onClick={() => navigate('/')} className="text-slate-400 hover:text-teal-600 transition-colors flex items-center group">
                  <Home size={18} className="mr-2" />
                  <span className="text-xs font-bold uppercase tracking-widest">Business Site</span>
                </button>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Guest Access</h2>
              <p className="text-slate-500 mb-8 font-light text-sm">Enter the code provided in your invitation</p>
              <form onSubmit={handleGuestLogin} className="space-y-4">
                <input
                  type="password"
                  placeholder="Enter Wedding Access Code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-center text-lg tracking-widest placeholder:tracking-normal"
                />
                {loginError && <p className="text-red-500 text-xs text-center">{loginError}</p>}
                <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-teal-600/20 active:scale-95">
                  Enter Portal
                </button>
              </form>
            </div>

            {/* Admin Login */}
            <div className="bg-slate-900 rounded-[2rem] shadow-2xl p-8 md:p-10 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-8">
                  <Lock size={24} className="text-teal-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Coordinator Dashboard</h2>
                <p className="text-slate-400 mb-8 font-light text-sm">Secure access for GETT staff only</p>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <input
                    type="password"
                    placeholder="Admin Password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-teal-500 outline-none transition-all text-center tracking-widest placeholder:tracking-normal text-white"
                  />
                  <button type="submit" className="w-full bg-white text-slate-900 font-bold py-4 rounded-2xl transition-all hover:bg-teal-400 active:scale-95">
                    Admin Login
                  </button>
                </form>
              </div>
              <div className="absolute -bottom-10 -right-10 text-white/5 pointer-events-none group-hover:scale-110 transition-transform">
                <Bus size={200} />
              </div>
            </div>
          </div>
        </section>
        <div className="py-8 text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">Code: OATS2026 | Admin: ADMINGETT2026</div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD VIEW ---
  if (isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-xl">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-teal-500 p-2 rounded-lg"><Bus size={20} /></div>
              <h1 className="font-bold text-lg tracking-tight">Coordinator Dashboard <span className="text-teal-400 ml-2 text-xs font-bold uppercase">Live</span></h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-teal-400' : ''} />
                <span>Auto-refreshing (30s)</span>
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors"><LogOut size={20}/></button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Bookings</p>
              <h3 className="text-3xl font-black text-slate-800">{stats.totalBookings}</h3>
            </div>
            <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Guests</p>
              <h3 className="text-3xl font-black text-teal-600">{stats.totalGuests}</h3>
            </div>
            <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 md:col-span-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Configuration</p>
              <div className="flex space-x-2">
                <input 
                  placeholder="Webhook URL" 
                  value={details.webhookUrl} 
                  onChange={(e) => setDetails({...details, webhookUrl: e.target.value})}
                  className="flex-grow bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-[10px] outline-none focus:border-teal-500"
                />
                <input 
                  placeholder="Sheet JSON URL" 
                  value={details.sheetJsonUrl} 
                  onChange={(e) => setDetails({...details, sheetJsonUrl: e.target.value})}
                  className="flex-grow bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-[10px] outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Table Control */}
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col md:row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  placeholder="Search guest name or email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-teal-500/10 outline-none transition-all"
                />
              </div>
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <select 
                  value={filterLodge}
                  onChange={(e) => setFilterLodge(e.target.value)}
                  className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none"
                >
                  <option value="All">All Accommodations</option>
                  {schedule.map(s => <option key={s.id} value={s.location}>{s.location}</option>)}
                </select>
                <button 
                  onClick={downloadCSV}
                  className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-all font-bold text-sm"
                >
                  <Download size={16} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-8 py-5">Guest Name</th>
                    <th className="px-8 py-5">Contact</th>
                    <th className="px-8 py-5">Accommodation</th>
                    <th className="px-8 py-5 text-center">Count</th>
                    <th className="px-8 py-5">Pickup</th>
                    <th className="px-8 py-5 text-center">Airport</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredBookings.length > 0 ? filteredBookings.map((b, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5 font-bold text-slate-800">{b.fullName}</td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-600">{b.email}</span>
                          <span className="text-xs text-slate-400">{b.phone}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-600 font-medium">{b.accommodation}</td>
                      <td className="px-8 py-5 text-center"><span className="bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-lg text-xs">{b.guestCount}</span></td>
                      <td className="px-8 py-5 text-sm text-slate-600">{b.pickupWindow}</td>
                      <td className="px-8 py-5 text-center">
                        {b.airportTransfer?.toLowerCase() === 'yes' ? <div className="inline-flex p-1 bg-amber-100 text-amber-700 rounded-md"><ExternalLink size={14}/></div> : <span className="text-slate-300">-</span>}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-light italic">No bookings found matching your filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- GUEST PORTAL VIEW ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button onClick={() => navigate('/')} className="text-slate-400 hover:text-teal-600 transition-colors" title="Home"><Home size={24} /></button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 tracking-tight text-lg">Rockhaven 2026</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Transport Portal</span>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><LogOut size={20} /></button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-fade-in">
        {/* Status Banner */}
        <div className="bg-teal-50 border border-teal-100 rounded-3xl p-6 flex items-center space-x-4 shadow-sm">
          <div className="bg-teal-500 p-3 rounded-2xl text-white shadow-lg shadow-teal-500/20"><Bus size={24} /></div>
          <p className="text-teal-900 font-medium">{details.shuttleStatus}</p>
        </div>

        {/* Interactive Pickup Finder */}
        <section className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden text-center p-10 md:p-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Lodge Pickup Finder</h2>
          <p className="text-slate-500 mb-10 font-light max-w-xl mx-auto text-lg leading-relaxed">Select your accommodation to find your exact shuttle time.</p>
          <div className="max-w-md mx-auto relative group">
            <select 
              value={selectedLodge}
              onChange={(e) => setSelectedLodge(e.target.value)}
              className="w-full px-8 py-5 rounded-3xl border-2 border-slate-100 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:border-teal-500 appearance-none cursor-pointer transition-all text-lg"
            >
              <option value="">Select your accommodation...</option>
              {schedule.map(s => <option key={s.id} value={s.id}>{s.location}</option>)}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={24} />
          </div>
          {selectedLodge && (
            <div className="mt-12 animate-fade-in-up">
              {(() => {
                const lodge = schedule.find(s => s.id === selectedLodge);
                return lodge ? (
                  <div className="bg-teal-50 rounded-[2rem] p-10 max-w-sm mx-auto border border-teal-100 shadow-inner">
                    <p className="text-teal-600 font-bold uppercase tracking-widest text-xs mb-4">Your Pickup Time</p>
                    <h4 className="text-5xl font-black text-teal-900 mb-2">{lodge.time}</h4>
                    <div className="flex items-center justify-center space-x-2 text-teal-700 font-medium"><CheckCircle size={18} /><span>{lodge.status}</span></div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </section>

        {/* RSVP FORM */}
        <section className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-10 md:p-16 bg-slate-900 text-white flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-bold mb-6 tracking-tight">Transport RSVP</h2>
                <p className="text-slate-400 text-lg font-light leading-relaxed mb-10">To ensure we have enough vehicles, please confirm your transport requirements using this secure RSVP form.</p>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all ${rsvpStep >= 1 ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-700 text-slate-500'}`}>1</div>
                    <span className={`font-bold tracking-wide ${rsvpStep === 1 ? 'text-white' : 'text-slate-500'}`}>Guest Details</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all ${rsvpStep >= 2 ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-700 text-slate-500'}`}>2</div>
                    <span className={`font-bold tracking-wide ${rsvpStep === 2 ? 'text-white' : 'text-slate-500'}`}>Requirements</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all ${rsvpStep >= 3 ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-700 text-slate-500'}`}>3</div>
                    <span className={`font-bold tracking-wide ${rsvpStep === 3 ? 'text-white' : 'text-slate-500'}`}>Confirmation</span>
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-12 border-t border-white/10">
                <div className="flex items-center space-x-3 text-teal-400">
                  <Info size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest">End-to-End Secure</span>
                </div>
              </div>
            </div>

            <div className="p-10 md:p-16">
              {rsvpStep === 3 ? (
                <div className="text-center py-10 animate-fade-in">
                  <div className="bg-teal-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="text-teal-600" size={48} />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-4">RSVP Received!</h3>
                  <p className="text-slate-500 font-light text-lg mb-8">Your transport booking has been received. Our team will contact you if needed.</p>
                  <button onClick={() => setRsvpStep(1)} className="text-teal-600 font-bold hover:underline">Submit another booking</button>
                </div>
              ) : (
                <form onSubmit={handleRSVPSubmit} className="space-y-6 animate-fade-in">
                  {rsvpStep === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                        <input name="fullName" required placeholder="John Doe" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                        <input name="phone" required placeholder="+27 XX XXX XXXX" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                        <input name="email" type="email" required placeholder="john@example.com" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none" />
                      </div>
                      <button type="button" onClick={() => setRsvpStep(2)} className="w-full bg-teal-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-teal-600/20 flex items-center justify-center space-x-2">
                        <span>Continue</span> <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                  {rsvpStep === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Accommodation</label>
                        <select name="accommodation" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none">
                          {schedule.map(s => <option key={s.id} value={s.location}>{s.location}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Guest Count</label>
                          <input name="guestCount" type="number" defaultValue={1} min={1} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Airport Transfer</label>
                          <select name="airportTransfer" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none">
                            <option value="No">No</option><option value="Yes">Yes</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Preferred Pickup Window</label>
                        <input name="pickupWindow" placeholder="e.g. 1:45 PM - 2:45 PM" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" />
                      </div>
                      <div className="flex space-x-4">
                        <button type="button" onClick={() => setRsvpStep(1)} className="flex-grow bg-slate-100 text-slate-600 font-bold py-5 rounded-2xl">Back</button>
                        <button type="submit" className="flex-[2] bg-teal-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-teal-600/20">Submit RSVP</button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Experience Elgin Gallery */}
        <section>
          <div className="text-center mb-12"><h2 className="text-3xl font-bold text-slate-800 mb-4">Experience Elgin</h2><p className="text-slate-500 font-light text-lg">Make the most of your wedding weekend with our premium tours</p></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { t: 'Wine Tours', i: '/oats_logos.jpg' },
              { t: 'Hermanus Coastal', i: '/dark_blue_photographic_conference_event_website_(4).jpg' },
              { t: 'Penguin Tour', i: '/6661c48f09e1d4261d646875488c7507.jpg' },
              { t: 'Table Mountain', i: '/453884004_1034192472040145_1496321644556200388_n_(1).jpg' },
              { t: 'V&A Waterfront', i: '/453884004_1034192472040145_1496321644556200388_n_(1) copy.jpg' }
            ].map((exp, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-[2rem] aspect-[4/5] shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
                <img src={exp.i} alt={exp.t} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white font-bold text-sm mb-4">{exp.t}</h3>
                  <a href={`mailto:${details.contactEmail}`} className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl text-center border border-white/30 hover:bg-white hover:text-teal-900 transition-colors">Enquire Now</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Return Schedule */}
        <section className="bg-white rounded-[2.5rem] p-10 md:p-16 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center"><Bus className="mr-3 text-teal-600" size={32} />Evening Return Shuttles</h2>
            <div className="grid gap-4">
              {details.receptionDepartureTimes.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-teal-50/50 transition-all">
                  <span className="text-slate-700 font-bold text-lg">{item.label}</span>
                  <span className="text-teal-600 font-black text-2xl tracking-tighter">{item.time}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start space-x-4">
              <Info className="text-amber-500 flex-shrink-0 mt-1" size={24} />
              <p className="text-amber-800 leading-relaxed font-medium">Please coordinate with the transport concierge desk at Rockhaven to confirm your preferred departure time.</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-20 text-slate-50 opacity-10 group-hover:scale-110 transition-transform pointer-events-none"><Bus size={400} /></div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-[2.5rem] p-10 md:p-16 border border-slate-100 shadow-sm">
          <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">Important Information</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'What should I wear in Elgin weather?', a: 'Elgin can become cold in the evening. We recommend bringing a light jacket for the journey home.' },
              { q: 'Is Uber available?', a: 'No Uber services operate in the region. Please ensure you do not miss your scheduled shuttle.' },
              { q: 'What happens if I miss my shuttle?', a: 'Please contact our transport coordinator immediately at the numbers listed below.' },
              { q: 'Punctuality', a: 'Please be ready 5 minutes before your scheduled pickup time. Shuttles must depart on schedule to ensure everyone arrives for the ceremony.' }
            ].map((faq, i) => (
              <div key={i} className="border border-slate-100 rounded-[1.5rem] overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                  <span className="font-bold text-slate-700">{faq.q}</span>
                  <ChevronDown className={`text-slate-400 transition-transform ${openFaq === i ? 'rotate-180 text-teal-500' : ''}`} />
                </button>
                {openFaq === i && <div className="px-8 pb-6 text-slate-500 font-light leading-relaxed border-t border-slate-50 pt-4 animate-fade-in-down">{faq.a}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Assistance */}
        <section className="bg-teal-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-8 tracking-tight">Need Assistance?</h2>
              <p className="text-teal-100/70 text-xl font-light mb-12 leading-relaxed">Our transport coordinator, Adam Jantjies, is available 24/7 to assist with any queries.</p>
              <div className="space-y-8">
                <div className="flex items-center space-x-8 group">
                  <div className="bg-white/10 p-5 rounded-[2rem] border border-white/10 group-hover:bg-teal-500 transition-all"><Phone size={28} /></div>
                  <div><p className="text-xs font-black text-teal-400 uppercase tracking-[0.2em] mb-1">Call / WhatsApp</p><p className="text-2xl font-bold">079 503 6849 / 066 233 4928</p></div>
                </div>
                <div className="flex items-center space-x-8 group">
                  <div className="bg-white/10 p-5 rounded-[2rem] border border-white/10 group-hover:bg-teal-500 transition-all"><Mail size={28} /></div>
                  <div><p className="text-xs font-black text-teal-400 uppercase tracking-[0.2em] mb-1">Email</p><p className="text-2xl font-bold">Adam@overbergtransfers.com</p></div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-[3rem] p-12 border border-white/10 backdrop-blur-xl">
              <div className="bg-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-teal-500/20"><Users size={32} /></div>
              <h3 className="font-bold text-3xl mb-6">Adam Jantjies</h3>
              <p className="text-teal-50/80 text-lg font-light leading-relaxed italic">"Looking forward to getting everyone safely to and from this special day!"</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-20 text-white/5 pointer-events-none translate-x-1/2 -translate-y-1/2"><Bus size={800} /></div>
        </section>
      </main>

      <footer className="py-16 text-center border-t border-slate-200">
        <div className="flex items-center justify-center space-x-3 mb-6 opacity-30">
          <Bus size={24} className="text-slate-800" /><span className="font-black text-slate-800 tracking-tighter text-lg">GETT OVERBERG TRANSFERS</span>
        </div>
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em]">© 2026 Premium Transport Logistics</p>
      </footer>

      <style>{`
        @keyframes subtle-zoom { from { transform: scale(1); } to { transform: scale(1.05); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-subtle-zoom { animation: subtle-zoom 20s infinite alternate ease-in-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default WeddingPortal;