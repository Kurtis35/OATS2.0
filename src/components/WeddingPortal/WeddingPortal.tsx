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
  ChevronRight,
  Shield,
  Star,
  Zap
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
    if (saved) return JSON.parse(saved);
    
    return LODGES.map((name, index) => ({
      id: String(index + 1),
      location: name,
      time: '1:45 PM',
      status: 'On Time'
    }));
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('wedding_local_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('wedding_details_v2', JSON.stringify(details));
  }, [details]);

  useEffect(() => {
    localStorage.setItem('wedding_schedule_v2', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('wedding_local_bookings', JSON.stringify(bookings));
  }, [bookings]);

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
      const remoteBookings = Array.isArray(data) ? data : (data.bookings || []);
      
      // Merge remote with local (using email as key)
      setBookings(prev => {
        const local = [...prev];
        remoteBookings.forEach((rb: any) => {
          if (!local.find(lb => lb.email === rb.email)) {
            local.push(rb);
          }
        });
        return local;
      });
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
    const data = Object.fromEntries(formData.entries()) as unknown as Booking;
    data.timestamp = new Date().toLocaleString();

    // Save locally for dashboard immediately (Frontend Only requirement)
    setBookings(prev => [...prev, data]);

    // Send to Webhook/Email service
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
    const rows = bookings.map(b => Object.values(b).map(v => `"${v}"`).join(','));
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
                <div className="flex-grow space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase w-20">Webhook:</span>
                    <input 
                      placeholder="Webhook URL (Zapier/Make)" 
                      value={details.webhookUrl} 
                      onChange={(e) => setDetails({...details, webhookUrl: e.target.value})}
                      className="flex-grow bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-[10px] outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase w-20">JSON URL:</span>
                    <input 
                      placeholder="Sheet JSON URL" 
                      value={details.sheetJsonUrl} 
                      onChange={(e) => setDetails({...details, sheetJsonUrl: e.target.value})}
                      className="flex-grow bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-[10px] outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Control */}
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
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
                  {LODGES.map((name, i) => <option key={i} value={name}>{name}</option>)}
                </select>
                <button 
                  onClick={downloadCSV}
                  className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-all font-bold text-sm"
                >
                  <Download size={16} />
                  <span>Export SPREADSHEET</span>
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
        {/* Marketing Banner */}
        <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                <Star size={14} />
                <span>Premium Guest Experience</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Travel in Style with Overberg Transfers</h2>
              <p className="text-slate-400 text-lg font-light leading-relaxed mb-8">
                We're more than just wedding transport. Discover our premium private tours, airport transfers, and VIP travel services across the Western Cape.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-bold hover:bg-teal-400 transition-all flex items-center space-x-2">
                  <span>Explore Services</span>
                  <ChevronRight size={18} />
                </button>
                <div className="flex items-center space-x-2 text-slate-400 text-sm font-medium">
                  <Shield size={16} className="text-teal-500" />
                  <span>5-Star Rated Service</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors group">
                <Zap size={24} className="text-teal-400 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-sm mb-1">Fast & Reliable</h4>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Always on time</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors group">
                <Users size={24} className="text-teal-400 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-sm mb-1">Group Travel</h4>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Up to 22 Seaters</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-20 -left-20 text-white/5 pointer-events-none rotate-12">
            <Bus size={300} />
          </div>
        </div>

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
              <div className="mt-20 pt-10 border-t border-white/10 hidden lg:block">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-teal-500/10 p-2 rounded-lg text-teal-400"><Shield size={20}/></div>
                  <span className="text-sm font-bold tracking-widest uppercase text-slate-400">Secure Submission</span>
                </div>
                <p className="text-xs text-slate-500">Your information is used only for wedding transport logistics and premium service offers.</p>
              </div>
            </div>

            <div className="p-10 md:p-16 relative">
              {formSubmitted ? (
                <div className="text-center py-20 animate-fade-in">
                  <div className="w-24 h-24 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-subtle shadow-xl shadow-teal-500/10">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-4">You're All Set!</h3>
                  <p className="text-slate-500 mb-10 max-w-xs mx-auto text-lg leading-relaxed">Thank you for confirming. We've sent your details to the coordination team.</p>
                  <button 
                    onClick={() => {setFormSubmitted(false); setRsvpStep(1);}}
                    className="text-teal-600 font-bold hover:text-teal-700 transition-colors flex items-center justify-center mx-auto"
                  >
                    <RefreshCw size={18} className="mr-2" />
                    <span>Submit another RSVP</span>
                  </button>
                  
                  {/* Marketing Call to Action */}
                  <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left">
                    <h4 className="font-bold text-slate-800 mb-2">Need an Airport Transfer?</h4>
                    <p className="text-sm text-slate-500 mb-4 leading-relaxed">Book a premium private shuttle for your arrival or departure from CPT at a special wedding rate.</p>
                    <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-teal-600 transition-all">Book Private Transfer</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRSVPSubmit} className="space-y-6 animate-fade-in">
                  {rsvpStep === 1 && (
                    <div className="space-y-6 animate-slide-right">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input required name="fullName" placeholder="John & Jane Doe" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none transition-all text-lg" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input required name="email" type="email" placeholder="jane@example.com" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none transition-all text-lg" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number (WhatsApp)</label>
                        <input required name="phone" placeholder="+27 79 000 0000" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none transition-all text-lg" />
                      </div>
                      <button type="button" onClick={() => setRsvpStep(2)} className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-teal-600 transition-all active:scale-95 flex items-center justify-center">
                        Next Step
                        <ChevronRight className="ml-2" size={20} />
                      </button>
                    </div>
                  )}

                  {rsvpStep === 2 && (
                    <div className="space-y-6 animate-slide-right">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Accommodation</label>
                        <select required name="accommodation" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none transition-all text-lg appearance-none">
                          <option value="">Select lodge...</option>
                          {LODGES.map((name, i) => <option key={i} value={name}>{name}</option>)}
                          <option value="Other">Other (Not listed)</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Guest Count</label>
                          <select required name="guestCount" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none transition-all text-lg">
                            {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Airport Transfer?</label>
                          <select required name="airportTransfer" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none transition-all text-lg">
                            <option value="no">No</option>
                            <option value="yes">Yes, please contact me</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Pickup Window</label>
                        <input name="pickupWindow" defaultValue="1:45 PM - 2:45 PM" readOnly className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 font-medium text-lg" />
                      </div>
                      <div className="flex gap-4">
                        <button type="button" onClick={() => setRsvpStep(1)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-5 rounded-2xl hover:bg-slate-200 transition-all">Back</button>
                        <button type="submit" className="flex-[2] bg-teal-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-teal-600/20 hover:bg-teal-700 transition-all active:scale-95">Complete RSVP</button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Info Grid */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100 group hover:shadow-2xl transition-all duration-500">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"><Clock size={32}/></div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Evening Shuttles</h3>
            <p className="text-slate-500 font-light leading-relaxed mb-6">Returns depart Rockhaven at the following times:</p>
            <div className="space-y-3">
              {details.receptionDepartureTimes.map(time => (
                <div key={time.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className="font-bold text-slate-700">{time.label}</span>
                  <span className="bg-white px-3 py-1 rounded-lg text-sm font-black text-slate-900 border border-slate-100">{time.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100 group hover:shadow-2xl transition-all duration-500">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"><Info size={32}/></div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Travel Tips</h3>
            <ul className="space-y-4 text-slate-500 font-light leading-relaxed">
              <li className="flex items-start"><ChevronRight size={18} className="mr-2 mt-1 text-teal-500 flex-shrink-0" /><span>Elgin Valley roads can be winding; please allow extra time if driving.</span></li>
              <li className="flex items-start"><ChevronRight size={18} className="mr-2 mt-1 text-teal-500 flex-shrink-0" /><span>The shuttle is free for all wedding guests.</span></li>
              <li className="flex items-start"><ChevronRight size={18} className="mr-2 mt-1 text-teal-500 flex-shrink-0" /><span>Need special assistance? Contact our team via the details below.</span></li>
            </ul>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100 group hover:shadow-2xl transition-all duration-500">
            <div className="w-16 h-16 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"><Phone size={32}/></div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Support</h3>
            <p className="text-slate-500 font-light leading-relaxed mb-8">For immediate assistance or to book a private transfer:</p>
            <div className="space-y-4">
              <a href={`https://wa.me/${details.contactWhatsApp.replace(/\s/g, '')}`} className="flex items-center p-5 bg-teal-50 text-teal-700 rounded-2xl font-bold hover:bg-teal-100 transition-all border border-teal-100">
                <div className="bg-white p-2 rounded-lg mr-4"><Phone size={18}/></div>
                {details.contactWhatsApp}
              </a>
              <a href={`mailto:${details.contactEmail}`} className="flex items-center p-5 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all border border-slate-100">
                <div className="bg-white p-2 rounded-lg mr-4"><Mail size={18}/></div>
                {details.contactEmail}
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white overflow-hidden relative">
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Is there parking at the venue?", a: "Yes, there is secure parking available at Rockhaven for those who wish to drive." },
                { q: "What if I miss my shuttle?", a: "Please contact our dispatcher immediately at the WhatsApp number provided. We will do our best to accommodate you on a later shuttle if possible." },
                { q: "Can I bring my children on the shuttle?", a: "Yes, children are welcome. Please ensure they are included in your guest count when RSVPing." }
              ].map((faq, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="font-bold text-lg">{faq.q}</span>
                    <ChevronDown className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-teal-400' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="p-6 pt-0 text-slate-400 font-light leading-relaxed border-t border-white/5 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 p-20 text-white/5 pointer-events-none">
            <Info size={400} />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-12 border-t border-slate-200">
          <div className="flex items-center justify-center space-x-2 text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-4">
            <Bus size={12}/>
            <span>Overberg Transfers & Tours</span>
          </div>
          <p className="text-slate-300 text-[10px] font-medium">&copy; 2026 Rockhaven Wedding Transport Coordination. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default WeddingPortal;
