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
  ChevronRight,
  LogOut,
  Edit2,
  Save,
  Plus,
  Trash2
} from 'lucide-react';

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
  receptionDepartureTimes: string[];
  contactWhatsApp: string;
  contactEmail: string;
}

const WeddingPortal = () => {
  // --- State ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Data State (Initial data from PDF/Assets)
  const [details, setDetails] = useState<WeddingDetails>(() => {
    const saved = localStorage.getItem('wedding_details');
    return saved ? JSON.parse(saved) : {
      date: 'Saturday, 04 April 2026',
      venue: 'Rockhaven Lodge',
      ceremonyTime: '3:00 PM',
      receptionDepartureTimes: ['10:00 PM', '12:00 AM', '01:00 AM'],
      contactWhatsApp: '+27 79 503 6849',
      contactEmail: 'Adam@overbergtransfers.com'
    };
  });

  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('wedding_schedule');
    return saved ? JSON.parse(saved) : [
      { id: '1', location: 'Elgin Valley Inn', time: '1:45 PM', status: 'On Time' },
      { id: '2', location: 'Orchard Guest House', time: '2:15 PM', status: 'On Time' },
      { id: '3', location: 'Rockhaven Reception', time: '2:45 PM', status: 'On Time' },
    ];
  });

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('wedding_details', JSON.stringify(details));
  }, [details]);

  useEffect(() => {
    localStorage.setItem('wedding_schedule', JSON.stringify(schedule));
  }, [schedule]);

  // --- Auth Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === 'GUEST2026') {
      setIsLoggedIn(true);
      setIsAdmin(false);
      setLoginError('');
    } else if (accessCode === 'ADMIN123') {
      setIsLoggedIn(true);
      setIsAdmin(true);
      setLoginError('');
    } else {
      setLoginError('Invalid access code. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setAccessCode('');
  };

  // --- Admin Handlers ---
  const updateDetail = (key: keyof WeddingDetails, value: any) => {
    setDetails(prev => ({ ...prev, [key]: value }));
  };

  const updateSchedule = (id: string, field: keyof ScheduleItem, value: string) => {
    setSchedule(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addScheduleItem = () => {
    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      location: 'New Location',
      time: '12:00 PM',
      status: 'On Time'
    };
    setSchedule(prev => [...prev, newItem]);
  };

  const removeScheduleItem = (id: string) => {
    setSchedule(prev => prev.filter(item => item.id !== id));
  };

  // --- Render Components ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bus className="text-teal-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Wedding Portal</h1>
            <p className="text-slate-500 mt-2">Enter your access code to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                placeholder="Access Code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              />
              {loginError && <p className="text-red-500 text-sm mt-2 ml-1">{loginError}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-teal-100"
            >
              Enter Portal
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Codes: GUEST2026 (Guest) | ADMIN123 (Admin)
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bus className="text-teal-600" size={24} />
            <span className="font-bold text-slate-800">Rockhaven 2026</span>
            {isAdmin && <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>}
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-slate-500 hover:text-red-600 transition-colors"
          >
            <span className="text-sm font-medium">Exit</span>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Wedding Info Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <Calendar className="mr-2 text-teal-600" size={20} />
              Wedding Details
            </h2>
            {isAdmin && <Info className="text-slate-300" size={20} />}
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</label>
                {isAdmin ? (
                  <input 
                    value={details.date} 
                    onChange={(e) => updateDetail('date', e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                ) : (
                  <p className="text-lg font-semibold text-slate-800">{details.date}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Venue</label>
                {isAdmin ? (
                  <input 
                    value={details.venue} 
                    onChange={(e) => updateDetail('venue', e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                ) : (
                  <p className="text-lg font-semibold text-slate-800">{details.venue}</p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ceremony Starts</label>
                {isAdmin ? (
                  <input 
                    value={details.ceremonyTime} 
                    onChange={(e) => updateDetail('ceremonyTime', e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                ) : (
                  <p className="text-lg font-semibold text-slate-800">{details.ceremonyTime}</p>
                )}
              </div>
              <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
                <p className="text-sm text-teal-800 font-medium leading-relaxed">
                  "Your transfer to and from the wedding is already covered by the bride and groom."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Shuttle Schedule */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <Clock className="mr-2 text-teal-600" size={20} />
                Afternoon Shuttle (To Venue)
              </h2>
              <p className="text-sm text-slate-500 mt-1">Pickups for prompt 3:00 PM start</p>
            </div>
            {isAdmin && (
              <button 
                onClick={addScheduleItem}
                className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-lg transition-colors"
              >
                <Plus size={20} />
              </button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Pickup Time</th>
                  <th className="px-6 py-4">Status</th>
                  {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schedule.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {isAdmin ? (
                        <input 
                          value={item.location} 
                          onChange={(e) => updateSchedule(item.id, 'location', e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-sm text-slate-800"
                        />
                      ) : (
                        <div className="flex items-center text-slate-800 font-medium">
                          <MapPin size={14} className="mr-2 text-slate-300" />
                          {item.location}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isAdmin ? (
                        <input 
                          value={item.time} 
                          onChange={(e) => updateSchedule(item.id, 'time', e.target.value)}
                          className="w-24 px-2 py-1 bg-white border border-slate-200 rounded text-sm text-slate-800"
                        />
                      ) : (
                        <span className="text-slate-600 text-sm">{item.time}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isAdmin ? (
                        <select 
                          value={item.status}
                          onChange={(e) => updateSchedule(item.id, 'status', e.target.value as any)}
                          className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800"
                        >
                          <option>On Time</option>
                          <option>Delayed</option>
                          <option>Departed</option>
                        </select>
                      ) : (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
                          item.status === 'On Time' ? 'bg-green-100 text-green-700' : 
                          item.status === 'Delayed' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => removeScheduleItem(item.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Departure Intervals */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Bus className="mr-2 text-teal-600" size={18} />
              Return Shuttles
            </h2>
            <div className="space-y-3">
              {details.receptionDepartureTimes.map((time, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-700 font-medium">
                    {idx === 0 ? 'The Early Bird' : idx === 1 ? 'The Party Shuttle' : 'The Final Send-off'}
                  </span>
                  {isAdmin ? (
                    <input 
                      value={time}
                      onChange={(e) => {
                        const newTimes = [...details.receptionDepartureTimes];
                        newTimes[idx] = e.target.value;
                        updateDetail('receptionDepartureTimes', newTimes);
                      }}
                      className="w-24 px-2 py-1 bg-white border border-slate-200 rounded text-sm text-right"
                    />
                  ) : (
                    <span className="text-teal-600 font-bold">{time}</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-4 italic uppercase tracking-wider">
              Note: Venue closes at midnight. Coordinate with GETT on-site coordinator.
            </p>
          </div>

          <div className="bg-teal-600 rounded-2xl shadow-sm p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <Phone className="mr-2 text-teal-200" size={18} />
                Need Assistance?
              </h2>
              <div className="space-y-4">
                <a 
                  href={`https://wa.me/${details.contactWhatsApp.replace(/\s+/g, '')}`} 
                  className="flex items-center p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10"
                >
                  <div className="bg-white/20 p-2 rounded-lg mr-3">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-teal-100 font-bold uppercase tracking-widest">WhatsApp / Call</p>
                    <p className="font-semibold">{details.contactWhatsApp}</p>
                  </div>
                </a>
                <a 
                  href={`mailto:${details.contactEmail}`}
                  className="flex items-center p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10"
                >
                  <div className="bg-white/20 p-2 rounded-lg mr-3">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-teal-100 font-bold uppercase tracking-widest">Email</p>
                    <p className="font-semibold text-sm truncate">{details.contactEmail}</p>
                  </div>
                </a>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
              <Info size={120} />
            </div>
          </div>
        </section>

        {/* Additional Activities */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Wine className="mr-2 text-teal-600" size={20} />
            Wedding Week Festivities
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center text-teal-600 mb-2">
                <Wine size={16} className="mr-1" />
                <span className="text-xs font-bold uppercase tracking-wider">Friday 5 PM</span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Meet & Greet</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Grabouw Country Club on Eikenhof Dam. Light supper & drinks for sale.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center text-teal-600 mb-2">
                <Coffee size={16} className="mr-1" />
                <span className="text-xs font-bold uppercase tracking-wider">Sunday 9 AM</span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Recovery Breakfast</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Elgin Railway Market / Peregrine / South Hill / Hickory Shack.</p>
            </div>
            <div className="p-4 bg-teal-50 rounded-xl border border-teal-100 sm:col-span-2 lg:col-span-1">
              <h3 className="font-bold text-teal-900 text-sm">Additional Tours</h3>
              <p className="text-xs text-teal-700 mt-1 leading-relaxed">Wine Tours, Table Mountain, Betty's Bay Penguins. Contact us for private bookings.</p>
              <button className="mt-3 text-[10px] font-bold text-teal-600 uppercase tracking-widest flex items-center">
                Book Private <ChevronRight size={12} className="ml-1" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Admin Quick Help */}
      {isAdmin && (
        <div className="fixed bottom-6 right-6 bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 max-w-xs animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-2 mb-2 text-teal-600">
            <Edit2 size={16} />
            <span className="text-sm font-bold">Admin Mode Active</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            All changes are saved to your browser's local storage. They will persist even if you refresh the page or close the browser.
          </p>
        </div>
      )}
    </div>
  );
};

export default WeddingPortal;