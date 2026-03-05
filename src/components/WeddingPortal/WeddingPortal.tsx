import React, { useState, useEffect } from 'react';
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
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Types ---
interface ScheduleItem {
  id: string;
  location: string;
  time: string;
  status: 'On Time' | 'Delayed' | 'Departed';
}

interface WeddingDetails {
  date: string;
  venue: string;
  ceremonyTime: string;
  receptionDepartureTimes: { id: string; label: string; time: string }[];
  contactWhatsApp: string;
  contactEmail: string;
  festivities: FestivityItem[];
  shuttleStatus: string;
}

interface FestivityItem {
  id: string;
  title: string;
  time: string;
  description: string;
  icon: 'wine' | 'coffee' | 'info';
  location: string;
}

const WeddingPortal = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [selectedLodge, setSelectedLodge] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Data State
  const [details, setDetails] = useState<WeddingDetails>(() => {
    const saved = localStorage.getItem('wedding_details');
    return saved ? JSON.parse(saved) : {
      date: 'Saturday, 04 April 2026',
      venue: 'Rockhaven, Elgin Valley',
      ceremonyTime: '3:00 PM',
      receptionDepartureTimes: [
        { id: '1', label: 'Early Bird Shuttle', time: '10:00 PM' },
        { id: '2', label: 'Party Shuttle', time: '12:00 AM' },
        { id: '3', label: 'Final Shuttle', time: '01:00 AM' }
      ],
      contactWhatsApp: '079 503 6849',
      contactEmail: 'Adam@overbergtransfers.com',
      shuttleStatus: 'All shuttles are currently on time. Afternoon pickups begin between 1:45 PM and 2:45 PM.',
      festivities: [
        { id: '1', title: 'Meet & Greet', time: 'Friday 3 April - 5:00 PM', description: 'Light supper to buy, drinks for sale at the bar.', location: 'Elgin Railway Market / Elgin Grabouw Country Club', icon: 'wine' },
        { id: '2', title: 'Recovery Breakfast', time: 'Sunday 5 April - 9:00 AM', description: 'Hard-earned breakfast options available.', location: 'Peregrine / Orchard / South Hill / Houwhoek', icon: 'coffee' }
      ]
    };
  });

  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('wedding_schedule');
    return saved ? JSON.parse(saved) : [
      { id: '1', location: 'Rockhaven Lodge', time: '1:45 PM', status: 'On Time' },
      { id: '2', location: 'Elgin Valley Inn', time: '2:15 PM', status: 'On Time' },
      { id: '3', location: 'Orchard Guest House', time: '2:30 PM', status: 'On Time' },
    ];
  });

  useEffect(() => {
    const access = localStorage.getItem('weddingAccess');
    if (access === 'granted') {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wedding_details', JSON.stringify(details));
  }, [details]);

  useEffect(() => {
    localStorage.setItem('wedding_schedule', JSON.stringify(schedule));
  }, [schedule]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const code = accessCode.toUpperCase();
    if (code === 'OATS2026') {
      setIsLoggedIn(true);
      setIsAdmin(false);
      setLoginError('');
      localStorage.setItem('weddingAccess', 'granted');
    } else if (code === 'ADMIN123') {
      setIsLoggedIn(true);
      setIsAdmin(true);
      setLoginError('');
      localStorage.setItem('weddingAccess', 'granted');
    } else {
      setLoginError('Incorrect access code.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setAccessCode('');
    localStorage.removeItem('weddingAccess');
  };

  const updateDetail = (key: keyof WeddingDetails, value: any) => {
    setDetails(prev => ({ ...prev, [key]: value }));
  };

  const updateSchedule = (id: string, field: keyof ScheduleItem, value: string) => {
    setSchedule(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addScheduleItem = () => {
    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      location: 'New Accommodation',
      time: '2:00 PM',
      status: 'On Time'
    };
    setSchedule(prev => [...prev, newItem]);
  };

  const removeScheduleItem = (id: string) => {
    setSchedule(prev => prev.filter(item => item.id !== id));
  };

  const updateFestivity = (id: string, field: keyof FestivityItem, value: string) => {
    setDetails(prev => ({
      ...prev,
      festivities: prev.festivities.map(f => f.id === id ? { ...f, [field]: value } : f)
    }));
  };

  const addFestivity = () => {
    const newItem: FestivityItem = {
      id: Date.now().toString(),
      title: 'New Event',
      time: 'Event Date/Time',
      description: 'Details',
      location: 'Venue',
      icon: 'info'
    };
    setDetails(prev => ({ ...prev, festivities: [...prev.festivities, newItem] }));
  };

  const removeFestivity = (id: string) => {
    setDetails(prev => ({ ...prev, festivities: prev.festivities.filter(f => f.id !== id) }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const faqs = [
    { q: "What should I wear in Elgin weather?", a: "Elgin can become cold in the evening. We recommend bringing a light jacket." },
    { q: "Is Uber available?", a: "No Uber services operate in the region. Please make sure you do not miss your scheduled shuttle." },
    { q: "What happens if I miss my shuttle?", a: "Please contact the transport coordinator immediately." }
  ];

  const experiences = [
    { title: "Wine Tasting Tours", img: "/oats_logos.jpg" },
    { title: "Hermanus Coastal Tour", img: "/dark_blue_photographic_conference_event_website_(4).jpg" },
    { title: "Penguin Tour at Betty’s Bay", img: "/6661c48f09e1d4261d646875488c7507.jpg" },
    { title: "Table Mountain Sightseeing", img: "/453884004_1034192472040145_1496321644556200388_n_(1).jpg" },
    { title: "V&A Waterfront Visit", img: "/453884004_1034192472040145_1496321644556200388_n_(1) copy.jpg" }
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <section className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img src="/dark_blue_photographic_conference_event_website_(4).jpg" alt="Elgin Valley" className="absolute inset-0 w-full h-full object-cover animate-subtle-zoom" />
          <div className="relative z-20 container mx-auto px-4 text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Rockhaven Wedding Transport Portal</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
              Your official source for shuttle schedules and guest transport information for the Rockhaven Wedding in Elgin Valley.
            </p>
          </div>
        </section>

        <section className="flex-grow flex items-center justify-center -mt-20 relative z-30 p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-100 transform transition-all hover:scale-[1.01]">
            <div className="flex justify-between items-start mb-8">
              <button onClick={() => navigate('/')} className="text-slate-400 hover:text-teal-600 transition-colors flex items-center group">
                <Home size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium tracking-wide">Business Site</span>
              </button>
            </div>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-800">Welcome, Guest</h2>
              <p className="text-slate-500 mt-2 font-light">Enter your secure access code</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="Enter Wedding Access Code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-center text-lg tracking-widest placeholder:tracking-normal placeholder:text-slate-300"
                />
                {loginError && <p className="text-red-500 text-sm text-center animate-shake">{loginError}</p>}
              </div>
              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 rounded-2xl transition-all shadow-xl shadow-teal-600/20 active:scale-95 text-lg">
                Enter Portal
              </button>
            </form>
            <p className="mt-8 text-center text-xs text-slate-400 font-light italic">
              Code: OATS2026 | Admin: ADMIN123
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-100 selection:text-teal-900">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button onClick={() => navigate('/')} className="text-slate-400 hover:text-teal-600 transition-colors" title="Home">
              <Home size={24} />
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 tracking-tight text-lg">Rockhaven 2026</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Transport Portal</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAdmin && <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm border border-amber-200">Admin Mode</span>}
            <button onClick={handleLogout} className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-fade-in">
        <div className="bg-teal-50 border border-teal-100 rounded-3xl p-6 flex items-center space-x-4 shadow-sm">
          <div className="bg-teal-500 p-3 rounded-2xl text-white shadow-lg shadow-teal-500/20">
            <Bus size={24} />
          </div>
          <div className="flex-grow">
            {isAdmin ? (
              <input value={details.shuttleStatus} onChange={(e) => updateDetail('shuttleStatus', e.target.value)} className="w-full bg-white border border-teal-200 rounded-xl px-4 py-2 text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            ) : (
              <p className="text-teal-900 font-medium">{details.shuttleStatus}</p>
            )}
          </div>
        </div>

        <section className="grid lg:grid-cols-3 gap-6">
          {[
            { label: 'Wedding Date', value: details.date, icon: Calendar, key: 'date' },
            { label: 'Ceremony Start', value: details.ceremonyTime, icon: Clock, key: 'ceremonyTime' },
            { label: 'Location', value: details.venue, icon: MapPin, key: 'venue' }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-50 transition-colors">
                <item.icon className="text-slate-400 group-hover:text-teal-600 transition-colors" size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{item.label}</p>
              {isAdmin ? (
                <input value={item.value} onChange={(e) => updateDetail(item.key as any, e.target.value)} className="w-full text-xl font-bold text-slate-800 border-b border-slate-100 focus:border-teal-500 focus:outline-none bg-transparent" />
              ) : (
                <h3 className="text-xl font-bold text-slate-800">{item.value}</h3>
              )}
            </div>
          ))}
        </section>

        <section className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-10 md:p-14 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Find Your Shuttle Pickup Time</h2>
            <p className="text-slate-500 mb-10 font-light max-w-xl mx-auto text-lg leading-relaxed">Select your accommodation from the list below to see your scheduled transport time.</p>
            <div className="max-w-md mx-auto relative group">
              <select value={selectedLodge} onChange={(e) => setSelectedLodge(e.target.value)} className="w-full px-8 py-5 rounded-3xl border-2 border-slate-100 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 appearance-none cursor-pointer transition-all text-lg">
                <option value="">Select your Lodge...</option>
                {schedule.map(s => <option key={s.id} value={s.id}>{s.location}</option>)}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-teal-500 transition-colors" size={24} />
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
          </div>
          {isAdmin && (
            <div className="bg-slate-50 border-t border-slate-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-700 uppercase tracking-wider text-sm">Manage Shuttle Times</h3>
                <button onClick={addScheduleItem} className="bg-teal-600 hover:bg-teal-700 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-teal-600/20"><Plus size={20} /></button>
              </div>
              <div className="space-y-3">
                {schedule.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl flex items-center space-x-4 shadow-sm">
                    <input value={item.location} onChange={(e) => updateSchedule(item.id, 'location', e.target.value)} className="flex-grow bg-transparent border-b border-slate-100 focus:border-teal-500 outline-none text-sm" />
                    <input value={item.time} onChange={(e) => updateSchedule(item.id, 'time', e.target.value)} className="w-24 text-right bg-transparent border-b border-slate-100 focus:border-teal-500 outline-none text-sm" />
                    <button onClick={() => removeScheduleItem(item.id)} className="text-red-300 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center"><Bus className="mr-3 text-teal-600" size={24} />Evening Return Shuttles</h2>
              <div className="space-y-4">
                {details.receptionDepartureTimes.map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-teal-50/50 hover:border-teal-100 transition-all group/item">
                    <span className="text-slate-700 font-bold">{item.label}</span>
                    {isAdmin ? (
                      <input value={item.time} onChange={(e) => {
                        const newTimes = [...details.receptionDepartureTimes];
                        newTimes[idx].time = e.target.value;
                        updateDetail('receptionDepartureTimes', newTimes);
                      }} className="w-24 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm text-right font-black text-teal-600 focus:ring-2 focus:ring-teal-500 outline-none" />
                    ) : (
                      <span className="text-teal-600 font-black text-lg">{item.time}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-start space-x-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <Info size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed font-medium">Please coordinate with the transport concierge desk at Rockhaven to confirm your departure.</p>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 text-slate-50 opacity-10 group-hover:scale-110 transition-transform pointer-events-none"><Bus size={200} /></div>
          </section>

          <section className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center"><Wine className="mr-3 text-teal-600" size={24} />Weekend Festivities</h2>
              {isAdmin && <button onClick={addFestivity} className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-xl"><Plus size={20} /></button>}
            </div>
            <div className="space-y-6">
              {details.festivities.map(event => (
                <div key={event.id} className="flex items-start space-x-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 relative group">
                  <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                    {event.icon === 'wine' ? <Wine className="text-teal-500" size={28} /> : event.icon === 'coffee' ? <Coffee className="text-amber-500" size={28} /> : <Info className="text-blue-500" size={28} />}
                  </div>
                  <div className="flex-grow">
                    {isAdmin ? (
                      <div className="space-y-2">
                        <input value={event.title} onChange={e => updateFestivity(event.id, 'title', e.target.value)} className="w-full font-bold text-slate-800 bg-transparent border-b border-slate-200" />
                        <input value={event.time} onChange={e => updateFestivity(event.id, 'time', e.target.value)} className="w-full text-xs font-bold text-teal-600 uppercase bg-transparent" />
                        <textarea value={event.description} onChange={e => updateFestivity(event.id, 'description', e.target.value)} className="w-full text-sm text-slate-500 bg-transparent resize-none" rows={2} />
                        <div className="flex justify-between items-center mt-2">
                          <select value={event.icon} onChange={e => updateFestivity(event.id, 'icon', e.target.value as any)} className="text-[10px] bg-white border rounded px-1">
                            <option value="wine">Wine</option><option value="coffee">Coffee</option><option value="info">Info</option>
                          </select>
                          <button onClick={() => removeFestivity(event.id)} className="text-red-400"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mb-1">{event.time}</p>
                        <h3 className="font-bold text-slate-800 text-lg mb-1">{event.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-light">{event.description}</p>
                        <p className="text-xs text-slate-400 mt-2 font-medium italic">@{event.location}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Airport Transfer Request</h2>
            <p className="text-slate-500 mb-12 font-light text-lg max-w-2xl mx-auto">Need premium transport to or from Cape Town International Airport? Submit your request below.</p>
            <form onSubmit={handleFormSubmit} className="grid md:grid-cols-2 gap-6 text-left">
              <input type="text" placeholder="Full Name" required className="px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all" />
              <input type="email" placeholder="Email Address" required className="px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all" />
              <input type="text" placeholder="Flight Number" className="px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all" />
              <input type="text" placeholder="Arrival Time" className="px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all" />
              <input type="number" placeholder="Number of Guests" className="px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all md:col-span-2" />
              <button type="submit" className="md:col-span-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-5 rounded-3xl transition-all shadow-xl shadow-teal-600/20 text-lg">Submit Request</button>
            </form>
            {formSubmitted && (
              <div className="mt-8 p-6 bg-green-50 border border-green-100 rounded-[2rem] text-center animate-fade-in-up">
                <CheckCircle className="text-green-500 mx-auto mb-3" size={40} /><h4 className="text-green-800 font-bold text-xl mb-1">Request Received</h4><p className="text-green-700 font-light">Thank you. Your transfer request has been received. Our team will contact you shortly.</p>
              </div>
            )}
          </div>
          <div className="absolute top-0 right-0 p-20 text-teal-50 opacity-20 pointer-events-none"><ExternalLink size={300} /></div>
        </section>

        <section>
          <div className="text-center mb-12"><h2 className="text-3xl font-bold text-slate-800 mb-4">Experience Elgin</h2><p className="text-slate-500 font-light text-lg">Make the most of your stay with our curated premium tours</p></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {experiences.map((exp, i) => (
              <div key={i} className="group cursor-pointer relative overflow-hidden rounded-[2rem] aspect-[4/5] shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
                <img src={exp.img} alt={exp.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white font-bold text-sm leading-tight mb-4">{exp.title}</h3>
                  <a href={`mailto:${details.contactEmail}`} className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl text-center border border-white/30 hover:bg-white hover:text-teal-900 transition-colors">Enquire</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-100 shadow-sm">
          <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-100 rounded-3xl overflow-hidden group">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                  <span className="font-bold text-slate-700 group-hover:text-teal-600 transition-colors">{faq.q}</span>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-teal-500' : ''}`} />
                </button>
                {openFaq === i && <div className="px-8 pb-6 text-slate-500 font-light leading-relaxed border-t border-slate-50 pt-4 animate-fade-in-down">{faq.a}</div>}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-teal-900 rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center text-left">
            <div>
              <h2 className="text-4xl font-bold mb-6 tracking-tight">Need Assistance?</h2>
              <p className="text-teal-100/70 text-lg font-light mb-10 leading-relaxed">Our transport coordinator, Adam Jantjies, is available 24/7 to assist with any queries or urgent travel needs.</p>
              <div className="space-y-6">
                <div className="flex items-center space-x-6 group">
                  <div className="bg-white/10 p-4 rounded-3xl border border-white/10 group-hover:bg-teal-500 transition-colors"><Phone size={24} /></div>
                  <div><p className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] mb-1">Call / WhatsApp</p><p className="text-xl font-bold">{details.contactWhatsApp}</p></div>
                </div>
                <div className="flex items-center space-x-6 group">
                  <div className="bg-white/10 p-4 rounded-3xl border border-white/10 group-hover:bg-teal-500 transition-colors"><Mail size={24} /></div>
                  <div><p className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] mb-1">Email</p><p className="text-xl font-bold">{details.contactEmail}</p></div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-[2.5rem] p-10 border border-white/10 backdrop-blur-lg"><h3 className="font-bold text-2xl mb-6">Transport Tip</h3><p className="text-teal-50/80 font-light leading-relaxed italic">"Elgin can get chilly once the sun goes down! We recommend bringing a light jacket for the evening shuttle."</p></div>
          </div>
          <div className="absolute top-0 right-0 p-20 text-white/5 pointer-events-none translate-x-1/2 -translate-y-1/2"><Bus size={600} /></div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6 opacity-40"><Bus size={20} className="text-slate-800" /><span className="font-bold text-slate-800 tracking-tighter">GETT OVERBERG TRANSFERS</span></div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.25em]">© 2026 Premium Wedding Transport Logistics</p>
        </div>
      </footer>

      {isAdmin && (
        <div className="fixed bottom-8 left-8 bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xl rounded-[2rem] p-6 max-w-xs animate-in fade-in slide-in-from-bottom-8 z-50">
          <div className="flex items-center space-x-3 mb-3 text-teal-600"><div className="bg-teal-100 p-2 rounded-xl"><Edit2 size={16} /></div><span className="text-sm font-black uppercase tracking-widest">Admin Control</span></div>
          <p className="text-xs text-slate-500 leading-relaxed font-light">All updates are saved locally to your browser. Your changes will persist permanently for your session.</p>
        </div>
      )}

      <style>{`
        @keyframes subtle-zoom { from { transform: scale(1); } to { transform: scale(1.05); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-subtle-zoom { animation: subtle-zoom 20s infinite alternate ease-in-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default WeddingPortal;