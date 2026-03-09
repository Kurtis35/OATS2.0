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
  Zap,
  UserPlus,
  ArrowRight,
  Plane,
  Camera,
  Map,
  Sun
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Types ---
interface Passenger {
  firstName: string;
  lastName: string;
}

interface Booking {
  timestamp: string;
  fullName: string;
  surname: string;
  email: string;
  phone: string;
  guestCount: number;
  passengers: Passenger[];
  accommodation: string;
  customAccommodation?: string;
  shuttleChoice: 'Afternoon' | 'Evening';
  additionalServices: string[];
}

interface WeddingDetails {
  contactWhatsApp: string;
  contactEmail: string;
  shuttleStatus: string;
  lodgeTimes: Record<string, { afternoon: string; evening: string }>;
}

const ACCOMMODATIONS = [
  "Rockhaven Lodge",
  "Elgin Valley Inn",
  "Orchard Guest House"
];

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
  "Elgin River Lodge": { afternoon: "1:45 PM", evening: "6:00 PM" },
  "33 Viljoenshoop Road": { afternoon: "2:00 PM", evening: "6:15 PM" },
  "Lavendar Cottages": { afternoon: "2:10 PM", evening: "6:25 PM" },
  "Cheverals Farm": { afternoon: "2:20 PM", evening: "6:35 PM" },
  "Oaklane Cottages": { afternoon: "2:30 PM", evening: "6:45 PM" },
  "Elgin Country Lodge": { afternoon: "2:40 PM", evening: "6:55 PM" },
  "Galileo": { afternoon: "2:50 PM", evening: "7:05 PM" },
  "Elgin Vintners": { afternoon: "1:55 PM", evening: "6:10 PM" },
  "Moortop Cottages": { afternoon: "2:05 PM", evening: "6:20 PM" },
  "Villa Eike": { afternoon: "2:15 PM", evening: "6:30 PM" },
  "Belfield Wines": { afternoon: "2:25 PM", evening: "6:40 PM" },
  "South Hill": { afternoon: "2:35 PM", evening: "6:50 PM" },
  "Villa Exner": { afternoon: "2:45 PM", evening: "7:00 PM" },
  "Apple Mountain Guest Farm": { afternoon: "1:40 PM", evening: "5:55 PM" },
  "Vredenhof": { afternoon: "1:50 PM", evening: "6:05 PM" },
  "Wildekrans Country House": { afternoon: "2:00 PM", evening: "6:15 PM" },
  "Endless Vinyards WWE": { afternoon: "2:10 PM", evening: "6:25 PM" },
  "Inn On Highlands": { afternoon: "2:20 PM", evening: "6:35 PM" }
};

const WeddingPortal = () => {
  const navigate = useNavigate();
  
  // Auth State
  const [isGuestLoggedIn, setIsGuestLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // RSVP Form State
  const [rsvpStep, setRsvpStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [passengers, setPassengers] = useState<Passenger[]>([{ firstName: '', lastName: '' }]);
  const [selectedLodgeRSVP, setSelectedLodgeRSVP] = useState('');
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);

  // UI State
  const [selectedFinderLodge, setSelectedFinderLodge] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('wedding_local_bookings_v3_persistent');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing bookings", e);
      }
    }
    return [];
  });

  const [details, setDetails] = useState<WeddingDetails>(() => {
    const saved = localStorage.getItem('wedding_details_v3_persistent');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing details", e);
      }
    }
    return {
      contactWhatsApp: '079 503 6849',
      contactEmail: 'Adam@overbergtransfers.com',
      shuttleStatus: 'All shuttles are currently on time. Please be ready 10 minutes before your pickup.',
      lodgeTimes: DEFAULT_LODGE_TIMES
    };
  });

  // Fetch shuttle schedule from Google Sheets
  useEffect(() => {
    const fetchShuttleSchedule = async () => {
      try {
        const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRFzcrY2ndpK7obT-msMbYhg35T7k08g-1JHpF0Ciz1B8QqKfhL19u8cMbtjDGF2fQ05KwBy9mimHRc/pubhtml?gid=573437974&single=true';
        const response = await fetch(csvUrl);
        const html = await response.text();
        // Extract table data from HTML - Google Sheets pubhtml returns HTML table
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const rows = doc.querySelectorAll('tr');
        
        const newLodgeTimes: Record<string, { afternoon: string; evening: string }> = {};
        rows.forEach((row, idx) => {
          if (idx === 0) return; // Skip header
          const cells = row.querySelectorAll('td');
          if (cells.length >= 3) {
            const lodge = cells[0]?.textContent?.trim();
            const afternoon = cells[1]?.textContent?.trim();
            const evening = cells[2]?.textContent?.trim();
            if (lodge && afternoon && evening) {
              newLodgeTimes[lodge] = { afternoon, evening };
            }
          }
        });
        
        if (Object.keys(newLodgeTimes).length > 0) {
          setDetails(prev => ({ ...prev, lodgeTimes: newLodgeTimes }));
        }
      } catch (error) {
        console.warn('Could not fetch shuttle schedule, using defaults', error);
      }
    };
    fetchShuttleSchedule();
  }, []);

  // Persistence logic - use a single source of truth and broadcast changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wedding_local_bookings_v3_persistent' && e.newValue) {
        setBookings(JSON.parse(e.newValue));
      }
      if (e.key === 'wedding_details_v3_persistent' && e.newValue) {
        setDetails(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('wedding_local_bookings_v3_persistent', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('wedding_details_v3_persistent', JSON.stringify(details));
  }, [details]);

  useEffect(() => {
    if (localStorage.getItem('weddingAccess') === 'granted') setIsGuestLoggedIn(true);
  }, []);

  // Handlers
  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.toUpperCase() === 'OATS2026') {
      setIsGuestLoggedIn(true);
      localStorage.setItem('weddingAccess', 'granted');
    } else {
      setLoginError('Incorrect access code.');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'ADMINGETT2026') {
      setIsAdminLoggedIn(true);
    } else {
      alert('Incorrect admin password.');
    }
  };

  const handleLogout = () => {
    setIsGuestLoggedIn(false);
    setIsAdminLoggedIn(false);
    localStorage.removeItem('weddingAccess');
  };

  const updateGuestCount = (count: number) => {
    setGuestCount(count);
    const newPassengers = [...passengers];
    if (count > passengers.length) {
      for (let i = passengers.length; i < count; i++) {
        newPassengers.push({ firstName: '', lastName: '' });
      }
    } else {
      newPassengers.splice(count);
    }
    setPassengers(newPassengers);
  };

  const handleRSVPSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Booking = {
      timestamp: new Date().toLocaleString(),
      fullName: formData.get('fullName') as string,
      surname: formData.get('surname') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      guestCount,
      passengers,
      accommodation: selectedLodgeRSVP,
      customAccommodation: formData.get('customAccommodation') as string,
      shuttleChoice: formData.get('shuttleChoice') as 'Afternoon' | 'Evening',
      additionalServices
    };

    setBookings(prev => [...prev, data]);
    setFormSubmitted(true);

    // Send data to Google Sheets via Apps Script
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyKgq_pUO2wgYmsZxLDWE81v3MIaLg4exyGh_x7CNY/dev';
    fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(data)
    }).catch(err => {
      console.warn('Could not reach Google Sheets, data stored locally', err);
    });

    // Reset form after 2 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setRsvpStep(1);
      setSelectedLodgeRSVP('');
      setAdditionalServices([]);
      setPassengers([{ firstName: '', lastName: '' }]);
      setGuestCount(1);
    }, 2000);
  };

  const downloadCSV = () => {
    if (bookings.length === 0) return;
    const headers = ["Timestamp", "Name", "Surname", "Email", "Phone", "Count", "Passengers", "Accommodation", "Shuttle", "Services"].join(',');
    const rows = bookings.map(b => [
      b.timestamp,
      b.fullName,
      b.surname,
      b.email,
      b.phone,
      b.guestCount,
      `"${b.passengers.map(p => `${p.firstName} ${p.lastName}`).join('; ')}"`,
      b.accommodation === 'Other' ? b.customAccommodation : b.accommodation,
      b.shuttleChoice,
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
        [lodge]: {
          ...prev.lodgeTimes[lodge],
          [type]: time
        }
      }
    }));
  };

  const clearData = () => {
    if (window.confirm("Are you sure you want to clear all booking data?")) {
      setBookings([]);
      localStorage.removeItem('wedding_local_bookings_v3');
    }
  };

  if (!isGuestLoggedIn && !isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80" alt="Wedding" className="absolute inset-0 w-full h-full object-cover animate-subtle-zoom" />
          <div className="relative z-20 container mx-auto px-4 text-center">
            <div className="inline-block mb-6 px-4 py-1 border border-white/30 rounded-full backdrop-blur-md text-xs font-bold uppercase tracking-widest">Premium Transport Portal</div>
            <h1 className="text-5xl md:text-7xl font-serif italic mb-6">Rockhaven Wedding</h1>
            <p className="text-xl md:text-2xl font-light mb-12 tracking-wide text-slate-200">Elgin Valley | Saturday 4 April 2026</p>
            
            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 shadow-2xl">
              <form onSubmit={handleGuestLogin} className="space-y-4">
                <input
                  type="password"
                  placeholder="Enter Wedding Code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-gold-400 outline-none transition-all text-center tracking-widest"
                />
                {loginError && <p className="text-red-400 text-xs">{loginError}</p>}
                <button type="submit" className="w-full bg-white text-slate-900 font-bold py-4 rounded-2xl hover:bg-teal-500 hover:text-white transition-all transform active:scale-95 shadow-lg">
                  Access Portal
                </button>
              </form>
            <div className="mt-6 flex flex-col items-center gap-4 text-[10px] text-white/40 font-bold uppercase tracking-widest">
              <div className="flex items-center justify-between w-full">
                <span>Business Portal</span>
                <button 
                  onClick={() => {
                    const pw = prompt("Admin Password:");
                    if (pw === 'ADMINGETT2026') setIsAdminLoggedIn(true);
                  }} 
                  className="hover:text-white transition-colors bg-white/5 px-3 py-1 rounded-full border border-white/10"
                >
                  Staff Login
                </button>
              </div>
              <button 
                onClick={() => {
                  const pw = prompt("Admin Password:");
                  if (pw === 'ADMINGETT2026') setIsAdminLoggedIn(true);
                }}
                className="md:hidden w-full py-3 bg-teal-500/20 hover:bg-teal-500/40 text-teal-200 rounded-xl border border-teal-500/30 transition-all"
              >
                Access Admin Panel
              </button>
            </div>
            </div>
          </div>
        </section>
        
        {/* Hidden Admin Trigger */}
        <div className="fixed bottom-4 right-4 z-50 opacity-0 hover:opacity-100 transition-opacity">
           <button onClick={() => {
             const pw = prompt("Admin Password:");
             if (pw === 'ADMINGETT2026') setIsAdminLoggedIn(true);
           }} className="w-8 h-8 rounded-full bg-slate-900/10" />
        </div>
      </div>
    );
  }

  if (isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-20">
        <header className="bg-slate-900 text-white p-4 sticky top-0 z-[100] shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold flex items-center">
                <Shield className="mr-2 text-teal-400" size={18} /> Admin Panel
              </h1>
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white"><LogOut size={20} /></button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => navigate('/')} 
                className="bg-slate-800 px-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center hover:bg-slate-700"
              >
                <Home size={12} className="mr-1"/> Home
              </button>
              <button onClick={downloadCSV} className="bg-teal-600 px-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center hover:bg-teal-500"><Download size={12} className="mr-1"/> Export</button>
              <button onClick={clearData} className="bg-red-600 px-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center hover:bg-red-500"><Trash2 size={12} className="mr-1"/> Clear</button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
          {/* Lodge Times Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="p-6 bg-slate-50/50 border-b border-slate-100">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center">
                <Clock className="mr-2 text-teal-500" size={16} /> Lodge Pickup Times
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="p-4 md:p-6">Lodge</th>
                    <th className="p-4 md:p-6">Afternoon Pickup</th>
                    <th className="p-4 md:p-6">Evening Pickup</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {LODGES.map(l => (
                    <tr key={l} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-4 md:p-6 font-bold text-slate-800 text-sm">{l}</td>
                      <td className="p-4 md:p-6">
                        <input 
                          type="text" 
                          value={details.lodgeTimes[l]?.afternoon || ''} 
                          onChange={e => handleTimeChange(l, 'afternoon', e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 outline-none w-full max-w-[140px]"
                          placeholder="e.g. 2:00 PM"
                        />
                      </td>
                      <td className="p-4 md:p-6">
                        <input 
                          type="text" 
                          value={details.lodgeTimes[l]?.evening || ''} 
                          onChange={e => handleTimeChange(l, 'evening', e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 outline-none w-full max-w-[140px]"
                          placeholder="e.g. 6:00 PM"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Guest Bookings Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  placeholder="Search guests or lodges..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white" 
                />
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-100">
                {bookings.length} Total Bookings
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="p-4 md:p-6">Guest Details</th>
                    <th className="p-4 md:p-6">Contact Info</th>
                    <th className="p-4 md:p-6">Accommodation</th>
                    <th className="p-4 md:p-6 text-center">Qty</th>
                    <th className="p-4 md:p-6">Shuttle</th>
                    <th className="p-4 md:p-6">Add-ons</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.filter(b => 
                    b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    b.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    b.accommodation.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((b, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 md:p-6">
                        <div className="font-bold text-slate-800">{b.fullName} {b.surname}</div>
                        <div className="text-[10px] text-slate-400 mt-1 font-medium">{b.passengers.map(p => `${p.firstName} ${p.lastName}`).join(', ')}</div>
                      </td>
                      <td className="p-4 md:p-6">
                        <div className="text-sm text-slate-600 flex items-center gap-1"><Mail size={12} /> {b.email}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-1"><Phone size={12} /> {b.phone}</div>
                      </td>
                      <td className="p-4 md:p-6">
                        <span className="text-sm font-semibold text-slate-700">
                          {b.accommodation === 'Other' ? b.customAccommodation : b.accommodation}
                        </span>
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-black border border-teal-100">
                          {b.guestCount}
                        </span>
                      </td>
                      <td className="p-4 md:p-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                          {b.shuttleChoice}
                        </span>
                      </td>
                      <td className="p-4 md:p-6">
                        <div className="flex flex-wrap gap-1">
                          {b.additionalServices.map((s, si) => (
                            <span key={si} className="text-[8px] font-black uppercase bg-teal-500/10 px-2 py-0.5 rounded text-teal-700 border border-teal-500/10">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-slate-400 font-medium italic">
                        No bookings found.
                      </td>
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

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-teal-100">
      {/* 1. GUEST TRANSPORT BOOKING FORM */}
      <section className="relative py-20 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-teal-500/5 -skew-x-12 transform translate-x-1/2" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif italic text-slate-900 mb-4">Transport RSVP</h2>
            <p className="text-slate-500 font-light tracking-wide">Please confirm your shuttle requirements below.</p>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex border-b border-slate-50">
              {[1, 2, 3, 4, 5].map(step => (
                <div key={step} className={`flex-1 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${rsvpStep === step ? 'text-teal-600 bg-teal-50' : 'text-slate-300'}`}>Step {step}</div>
              ))}
            </div>

            <div className="p-8 md:p-12">
              {formSubmitted ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-600/10"><CheckCircle size={40}/></div>
                  <h3 className="text-3xl font-serif italic mb-4">Reservation Confirmed</h3>
                  <p className="text-slate-500 mb-8 max-w-xs mx-auto">Thank you for confirming your transport. We've sent your details to the coordination team.</p>
                  <button onClick={() => {setFormSubmitted(false); setRsvpStep(1);}} className="text-teal-600 font-bold hover:underline">Submit another RSVP</button>
                </div>
              ) : (
                <form onSubmit={handleRSVPSubmit} className="space-y-8">
                  {rsvpStep === 1 && (
                    <div className="space-y-6 animate-fade-in">
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
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                        <input required name="phone" placeholder="+27" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none transition-all" />
                      </div>
                      <button type="button" onClick={() => setRsvpStep(2)} className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-teal-600 transition-all flex items-center justify-center group">
                        Next Step <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}

                  {rsvpStep === 2 && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Total Passengers</label>
                        <select value={guestCount} onChange={e => updateGuestCount(parseInt(e.target.value))} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none">
                          {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>)}
                        </select>
                      </div>
                      <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                        {passengers.map((p, i) => (
                          <div key={i} className="grid grid-cols-2 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">P{i+1} First Name</label>
                              <input required value={p.firstName} onChange={e => {
                                const newP = [...passengers];
                                newP[i].firstName = e.target.value;
                                setPassengers(newP);
                              }} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-100 outline-none focus:border-teal-500" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">P{i+1} Surname</label>
                              <input required value={p.lastName} onChange={e => {
                                const newP = [...passengers];
                                newP[i].lastName = e.target.value;
                                setPassengers(newP);
                              }} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-100 outline-none focus:border-teal-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        <button type="button" onClick={() => setRsvpStep(1)} className="flex-1 bg-slate-100 py-5 rounded-2xl font-bold text-slate-500">Back</button>
                        <button type="button" onClick={() => setRsvpStep(3)} className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center group">
                          Next Step <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  )}

                  {rsvpStep === 3 && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Select Accommodation</label>
                        <select required value={selectedLodgeRSVP} onChange={e => setSelectedLodgeRSVP(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none">
                          <option value="">Select accommodation...</option>
                          {ACCOMMODATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                          <option value="Other">Other Accommodation</option>
                        </select>
                      </div>
                      {selectedLodgeRSVP === 'Other' && (
                        <div className="space-y-2 animate-slide-down">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Enter Accommodation Name</label>
                          <input required name="customAccommodation" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-teal-500 outline-none" />
                        </div>
                      )}
                      <div className="flex gap-4">
                        <button type="button" onClick={() => setRsvpStep(2)} className="flex-1 bg-slate-100 py-5 rounded-2xl font-bold text-slate-500">Back</button>
                        <button type="button" onClick={() => setRsvpStep(4)} className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center group">
                          Next Step <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  )}

                  {rsvpStep === 4 && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="space-y-2 text-center mb-8">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 block">Preferred Pickup Shuttle</label>
                        <div className="grid grid-cols-2 gap-4">
                          {['Afternoon', 'Evening'].map(type => (
                            <label key={type} className="relative cursor-pointer">
                              <input required type="radio" name="shuttleChoice" value={type} className="peer sr-only" />
                              <div className="p-8 rounded-3xl border-2 border-slate-100 bg-slate-50 text-slate-400 font-bold peer-checked:border-teal-500 peer-checked:text-teal-600 peer-checked:bg-teal-50 transition-all">
                                {type === 'Afternoon' ? <Sun className="mx-auto mb-2" /> : <Clock className="mx-auto mb-2" />}
                                {type} Shuttle
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button type="button" onClick={() => setRsvpStep(3)} className="flex-1 bg-slate-100 py-5 rounded-2xl font-bold text-slate-500">Back</button>
                        <button type="button" onClick={() => setRsvpStep(5)} className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center group">
                          Next Step <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  )}

                  {rsvpStep === 5 && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">Additional Services</label>
                        <div className="grid md:grid-cols-2 gap-4">
                          {[
                            { id: 'airport', label: 'Airport Transfer', icon: <Plane size={18}/> },
                            { id: 'wedding', label: 'Exclusive Rockhaven Wedding Experiences', icon: <Wine size={18}/> }
                          ].map(service => (
                            <label key={service.id} className="flex items-center p-6 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-white hover:shadow-lg transition-all group">
                              <input 
                                type="checkbox" 
                                className="w-5 h-5 rounded-md border-slate-300 text-teal-600 focus:ring-teal-500"
                                checked={additionalServices.includes(service.label)}
                                onChange={e => {
                                  if (e.target.checked) setAdditionalServices([...additionalServices, service.label]);
                                  else setAdditionalServices(additionalServices.filter(s => s !== service.label));
                                }}
                              />
                              <div className="ml-4 flex items-center text-slate-600 group-hover:text-teal-600 font-bold">
                                <span className="mr-3">{service.icon}</span>
                                {service.label}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button type="button" onClick={() => setRsvpStep(4)} className="flex-1 bg-slate-100 py-5 rounded-2xl font-bold text-slate-500">Back</button>
                        <button type="submit" className="flex-[2] bg-teal-600 text-white py-5 rounded-2xl font-bold shadow-xl shadow-teal-600/20 hover:bg-teal-700 transition-all active:scale-95">Complete Reservation</button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. LODGE PICKUP FINDER */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-block mb-4 px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-[10px] font-black uppercase tracking-widest">Interactive Tool</div>
          <h2 className="text-4xl md:text-5xl font-serif italic text-slate-900 mb-6">Lodge Pickup Finder</h2>
          <p className="text-slate-500 font-light mb-12 max-w-xl mx-auto">Select your accommodation below to find your specific shuttle departure times for the big day.</p>
          
          <div className="max-w-md mx-auto relative mb-12">
            <select 
              value={selectedFinderLodge}
              onChange={e => setSelectedFinderLodge(e.target.value)}
              className="w-full px-8 py-5 rounded-[2rem] border-2 border-slate-100 bg-slate-50 text-slate-800 font-bold focus:outline-none focus:border-teal-500 appearance-none cursor-pointer transition-all text-center shadow-inner"
            >
              <option value="">Choose your lodge...</option>
              {LODGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-teal-500 pointer-events-none" />
          </div>

          {selectedFinderLodge && details.lodgeTimes[selectedFinderLodge] && (
            <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up">
              <div className="bg-teal-50 p-10 rounded-[2.5rem] border border-teal-100 group hover:shadow-2xl transition-all duration-500">
                <Sun className="mx-auto text-teal-500 mb-4" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest text-teal-600 mb-2">Afternoon Shuttle</p>
                <h4 className="text-5xl font-black text-teal-900 mb-2">{details.lodgeTimes[selectedFinderLodge].afternoon}</h4>
                <div className="flex items-center justify-center text-teal-700 font-bold text-sm"><CheckCircle size={14} className="mr-2"/> On Time</div>
              </div>
              <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white group hover:shadow-2xl transition-all duration-500">
                <Clock className="mx-auto text-teal-400 mb-4" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-2">Evening Shuttle</p>
                <h4 className="text-5xl font-black text-white mb-2">{details.lodgeTimes[selectedFinderLodge].evening}</h4>
                <div className="flex items-center justify-center text-slate-400 font-bold text-sm"><CheckCircle size={14} className="mr-2"/> Live Status</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. SHUTTLE SCHEDULE */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,_var(--tw-gradient-stops))] from-teal-500 to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif italic mb-6">Master Schedule</h2>
            <p className="text-slate-400 font-light max-w-xl mx-auto">A comprehensive overview of all shuttle operations across Elgin Valley.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 border-b border-white/10">
                  <tr>
                    <th className="p-8">Lodge Location</th>
                    <th className="p-8">Afternoon Pickup</th>
                    <th className="p-8 text-right">Evening Pickup</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {LODGES.map(l => (
                    <tr key={l} className="hover:bg-white/5 transition-colors group">
                      <td className="p-8 font-bold text-slate-200 group-hover:text-white">{l}</td>
                      <td className="p-8"><span className="bg-teal-500/10 text-teal-400 px-4 py-1 rounded-full text-xs font-bold">{details.lodgeTimes[l]?.afternoon || 'TBC'}</span></td>
                      <td className="p-8 text-right"><span className="bg-white/10 text-white px-4 py-1 rounded-full text-xs font-bold">{details.lodgeTimes[l]?.evening || 'TBC'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRAVEL TIPS & SUPPORT */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-8"><Sun size={32}/></div>
              <h4 className="text-xl font-bold mb-4">Elgin Weather</h4>
              <p className="text-sm text-slate-500 font-light leading-relaxed">Elgin is known for its cool mist and micro-climates. Please bring a warm jacket for the evening.</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-8"><MapPin size={32}/></div>
              <h4 className="text-xl font-bold mb-4">Rural Roads</h4>
              <p className="text-sm text-slate-500 font-light leading-relaxed">Roads can be winding and dark. We highly recommend using our shuttles for safety and convenience.</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center mb-8"><Clock size={32}/></div>
              <h4 className="text-xl font-bold mb-4">Prompt Arrival</h4>
              <p className="text-sm text-slate-500 font-light leading-relaxed">Shuttles operate on a strict schedule. Please be ready at your lodge 10 minutes prior to pickup.</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8"><Phone size={32}/></div>
              <h4 className="text-xl font-bold mb-4">Emergency Support</h4>
              <p className="text-sm text-slate-500 font-light leading-relaxed">Running late or lost? WhatsApp Adam at {details.contactWhatsApp} for immediate logistics support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif italic mb-4">Guest FAQs</h2>
            <p className="text-slate-400">Everything you need to know about wedding travel.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "When should I be ready for my shuttle?", a: "Please be waiting in the main reception or driveway area of your lodge at least 10 minutes before the scheduled pickup time." },
              { q: "Who do I contact if I need help?", a: "For transport issues, contact Adam via WhatsApp. For general wedding queries, please refer to the main invitation." },
              { q: "Are the roads safe at night?", a: "While the main roads are fine, farm roads are narrow and dark. Our professional drivers are experienced with the local terrain." },
              { q: "What happens if I miss my shuttle?", a: "Latecomers will need to arrange their own private transport to the venue. Shuttles cannot wait as it impacts all other guest pickups." }
            ].map((faq, i) => (
              <div key={i} className="border border-slate-100 rounded-[2rem] overflow-hidden transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full p-8 text-left flex items-center justify-between transition-colors ${openFaq === i ? 'bg-teal-50' : 'bg-white hover:bg-slate-50'}`}
                >
                  <span className={`font-bold text-lg ${openFaq === i ? 'text-teal-900' : 'text-slate-800'}`}>{faq.q}</span>
                  <ChevronDown className={`transition-transform duration-500 ${openFaq === i ? 'rotate-180 text-teal-600' : 'text-slate-300'}`} />
                </button>
                {openFaq === i && (
                  <div className="p-8 pt-0 bg-teal-50 text-slate-600 font-light leading-relaxed animate-slide-down">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TRAVEL IN STYLE BANNER */}
      <section className="relative py-32 bg-slate-900 overflow-hidden text-center text-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80" alt="Experience" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-20 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-8">
            <Star size={14} className="text-teal-400" />
            <span>Experience Elgin with Overberg Transfers</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-serif italic mb-8">Travel in Style</h2>
          <p className="text-xl md:text-2xl font-light text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Elevate your stay in Elgin Valley. From luxury airport transfers to exclusive private wine tours, our premium fleet is at your service.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={() => navigate('/#booking')}
              className="bg-white text-slate-900 px-10 py-5 rounded-[2rem] font-bold text-lg hover:bg-teal-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl"
            >
              Book Private Transfer
            </button>
            <button 
              onClick={() => navigate('/#services')}
              className="bg-transparent border-2 border-white/30 backdrop-blur-md text-white px-10 py-5 rounded-[2rem] font-bold text-lg hover:bg-white/10 transition-all"
            >
              Explore Wine Tours
            </button>
          </div>
          
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
            <div className="flex flex-col items-center"><Plane className="mb-2" /> <span className="text-[10px] font-bold uppercase tracking-widest">CPT Airport</span></div>
            <div className="flex flex-col items-center"><Wine className="mb-2" /> <span className="text-[10px] font-bold uppercase tracking-widest">Wine Estates</span></div>
            <div className="flex flex-col items-center"><Shield className="mb-2" /> <span className="text-[10px] font-bold uppercase tracking-widest">VIP Chauffeur</span></div>
            <div className="flex flex-col items-center"><Star className="mb-2" /> <span className="text-[10px] font-bold uppercase tracking-widest">5-Star Service</span></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 text-center bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8 flex items-center justify-center space-x-4">
             <div className="h-px w-12 bg-slate-200" />
             <div className="flex flex-col">
               <span className="font-serif italic text-2xl text-slate-900">Overberg Transfers & Tours</span>
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-teal-600 mt-1">Premium Logistics</span>
             </div>
             <div className="h-px w-12 bg-slate-200" />
          </div>
          <p className="text-xs text-slate-400 font-medium mb-12">&copy; 2026 Rockhaven Wedding. Coordination by GETT Staff.</p>
          <div className="flex items-center justify-center space-x-8 text-slate-300">
             <a href="#" className="hover:text-teal-600 transition-colors"><Mail size={20}/></a>
             <a href="#" className="hover:text-teal-600 transition-colors"><Phone size={20}/></a>
             <a href="#" className="hover:text-teal-600 transition-colors"><MapPin size={20}/></a>
          </div>

          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-serif italic text-slate-900">Wedding Gallery</h3>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/')} 
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-all text-sm font-bold text-slate-600"
                >
                  <Home size={16} />
                  <span>Home</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 transition-all text-sm font-bold text-red-600"
                >
                  <LogOut size={16} />
                  <span>Exit</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8,9,10,11].map(i => (
                <div 
                  key={i} 
                  className="group relative aspect-[2/3] overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                  onClick={() => setSelectedImage(`/assets/img${i}.jpg`)}
                >
                  <img 
                    src={`/assets/img${i}.jpg`} 
                    alt={`Briefing ${i}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-teal-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-white/90 p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Search className="text-teal-600" size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Image Modal */}
          {selectedImage && (
            <div 
              className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 animate-fade-in"
              onClick={() => setSelectedImage(null)}
            >
              <button 
                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors bg-white/10 p-3 rounded-full hover:bg-white/20"
                onClick={() => setSelectedImage(null)}
              >
                <LogOut size={24} className="rotate-90" />
              </button>
              <img 
                src={selectedImage} 
                alt="Full size" 
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default WeddingPortal;
