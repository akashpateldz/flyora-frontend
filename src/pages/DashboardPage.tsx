import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plane, Shield, Wallet, List, User, PlusCircle, ArrowRightLeft, Calendar,
  LogOut, CheckCircle, AlertCircle, Trash2, ArrowRight, MapPin, Loader2,
  Sparkles, DollarSign, Lock, CreditCard, RefreshCw, Check
} from 'lucide-react';
import Button from '../components/ui/Button';
import { API_BASE_URL } from '../config';

interface Trip {
  id: string;
  userId: string;
  fullName: string;
  fromCity: string;
  toCity: string;
  travelDate: string;
  availableWeight: number;
  pricePerKg: number;
  description?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

interface Shipment {
  id: string;
  userId: string;
  fullName: string;
  title: string;
  fromCity: string;
  toCity: string;
  deliveryDeadline: string;
  weight: number;
  pricePaid: number;
  category: 'documents' | 'electronics' | 'clothing' | 'food' | 'other';
  description: string;
  status: 'PENDING' | 'MATCHED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}

interface Match {
  tripId?: string;
  shipmentId?: string;
  tripDetails?: string;
  shipmentDetails?: string;
  matchType: 'shipment_match' | 'traveler_match';
  shipment?: Shipment;
  trip?: Trip;
}

interface DashboardOverview {
  stats: {
    activeTripsCount: number;
    activeShipmentsCount: number;
    walletBalance: number;
    escrowBalance: number;
  };
  matches: {
    travelMatches: Match[];
    shipmentMatches: Match[];
    totalMatchesCount: number;
  };
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('flyora_user_id');
  const userName = localStorage.getItem('flyora_user_name') || 'Member';

  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'shipments' | 'matches' | 'wallet' | 'profile'>('overview');
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals / Drawers
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // New Trip Form State
  const [tripFrom, setTripFrom] = useState('');
  const [tripTo, setTripTo] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [tripWeight, setTripWeight] = useState('');
  const [tripPrice, setTripPrice] = useState('');
  const [tripDesc, setTripDesc] = useState('');

  // New Shipment Form State
  const [shipTitle, setShipTitle] = useState('');
  const [shipCategory, setShipCategory] = useState<'documents' | 'electronics' | 'clothing' | 'food' | 'other'>('electronics');
  const [shipFrom, setShipFrom] = useState('');
  const [shipTo, setShipTo] = useState('');
  const [shipWeight, setShipWeight] = useState('');
  const [shipPrice, setShipPrice] = useState('');
  const [shipDeadline, setShipDeadline] = useState('');
  const [shipDesc, setShipDesc] = useState('');

  // Profile Settings Form State
  const [profileName, setProfileName] = useState(userName);
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });

  // Wallet Simulation state
  const [walletHistory, setWalletHistory] = useState([
    { id: 1, type: 'credit', amount: 150, description: 'Payout for Mumbai ➔ Dubai Shipment flight', date: '2026-06-15' },
    { id: 2, type: 'debit', amount: 80, description: 'Escrow payment locked for Delhi flight parcel', date: '2026-06-19' },
    { id: 3, type: 'credit', amount: 310, description: 'Payout for London ➔ New York baggage sharing', date: '2026-06-21' }
  ]);

  // Auth Guard
  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  // Fetch Dashboard Data
  const fetchData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // Fetch overview stats & matches
      const overviewRes = await fetch(`${API_BASE_URL}/api/dashboard/overview/${userId}`);
      if (overviewRes.ok) {
        const oData = await oDataJSON(overviewRes);
        setOverview(oData.data);
      }

      // Fetch user trips
      const tripsRes = await fetch(`${API_BASE_URL}/api/dashboard/trips/${userId}`);
      if (tripsRes.ok) {
        const tData = await tripsRes.json();
        setTrips(tData.data);
      }

      // Fetch user shipments
      const shipmentsRes = await fetch(`${API_BASE_URL}/api/dashboard/shipments/${userId}`);
      if (shipmentsRes.ok) {
        const sData = await shipmentsRes.json();
        setShipments(sData.data);
      }

      // Fetch Profile Details (from waiting lists / backend storage if needed)
      // Since it's in-memory, we can query users details if needed. Let's retrieve user data.
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const oDataJSON = async (res: Response) => {
    return await res.json();
  };

  useEffect(() => {
    if (userId) {
      fetchData();
      
      // Load user details for profile
      fetch(`${API_BASE_URL}/api/kyc/status/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setProfileEmail(data.data.email || 'tester@flyora.com');
            setProfilePhone(data.data.phone || '+919988776655');
          }
        })
        .catch(e => console.error(e));
    }
  }, [userId]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('flyora_user_id');
    localStorage.removeItem('flyora_user_name');
    navigate('/');
  };

  // Submit Trip
  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setModalLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          fromCity: tripFrom,
          toCity: tripTo,
          travelDate: tripDate,
          availableWeight: Number(tripWeight),
          pricePerKg: Number(tripPrice),
          description: tripDesc
        })
      });

      if (response.ok) {
        setIsTripModalOpen(false);
        // Clear states
        setTripFrom('');
        setTripTo('');
        setTripDate('');
        setTripWeight('');
        setTripPrice('');
        setTripDesc('');
        
        // Refresh
        await fetchData();
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to create trip');
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.message === 'Failed to fetch'
        ? 'Failed to connect to the backend server. Please verify if the API is running or try again later.'
        : 'Network error creating trip';
      alert(msg);
    } finally {
      setModalLoading(false);
    }
  };

  // Submit Shipment
  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setModalLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/shipments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: shipTitle,
          category: shipCategory,
          fromCity: shipFrom,
          toCity: shipTo,
          weight: Number(shipWeight),
          pricePaid: Number(shipPrice),
          deliveryDeadline: shipDeadline,
          description: shipDesc
        })
      });

      if (response.ok) {
        setIsShipmentModalOpen(false);
        // Clear states
        setShipTitle('');
        setShipFrom('');
        setShipTo('');
        setShipWeight('');
        setShipPrice('');
        setShipDeadline('');
        setShipDesc('');
        
        // Refresh
        await fetchData();
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to create shipment');
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.message === 'Failed to fetch'
        ? 'Failed to connect to the backend server. Please verify if the API is running or try again later.'
        : 'Network error creating shipment';
      alert(msg);
    } finally {
      setModalLoading(false);
    }
  };

  // Update Profile Settings
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setProfileLoading(true);
    setProfileMessage({ text: '', type: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: profileName,
          email: profileEmail,
          phone: profilePhone,
          password: profilePassword || undefined
        })
      });

      const resData = await response.json();
      if (response.ok) {
        setProfileMessage({ text: 'Profile updated successfully!', type: 'success' });
        localStorage.setItem('flyora_user_name', resData.data.fullName);
        setProfilePassword('');
        await fetchData();
      } else {
        setProfileMessage({ text: resData.message || 'Update failed', type: 'error' });
      }
    } catch (err: any) {
      const msg = err.message === 'Failed to fetch'
        ? 'Failed to connect to the backend. Please verify if the API is running.'
        : 'Connection failed';
      setProfileMessage({ text: msg, type: 'error' });
    } finally {
      setProfileLoading(false);
    }
  };

  // Simulated Escrow Action (Release simulated funds)
  const simulatePayout = (amount: number, detail: string) => {
    const newTx = {
      id: Date.now(),
      type: 'credit',
      amount,
      description: `Payout released: ${detail}`,
      date: new Date().toISOString().split('T')[0]
    };
    setWalletHistory([newTx, ...walletHistory]);
    alert(`Success! Payout of $${amount} released from escrow to your wallet balance.`);
  };

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      {/* Premium Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-flyora-teal to-flyora-teal-light flex items-center justify-center shadow-teal">
              <Plane size={18} className="text-white transform -rotate-45" />
            </div>
            <span className="text-xl font-black text-flyora-navy">fly<span className="text-flyora-teal">ora</span></span>
            <span className="bg-flyora-navy/5 text-flyora-navy text-[10px] font-black uppercase px-2.5 py-1 rounded-full ml-1 border border-flyora-navy/10">Portal</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-xs font-bold text-flyora-navy">Hello, {profileName}</span>
              <span className="text-[10px] text-flyora-teal font-black uppercase">Verified User</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 transition-colors border border-red-100 hover:bg-red-50/50 px-3 py-1.5 rounded-xl bg-white shadow-sm"
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 sm:py-6 md:py-8 flex flex-col md:flex-row gap-6">
             {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl md:rounded-3xl p-2 md:p-4 shadow-sm flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1.5 md:space-y-1 shrink-0 no-scrollbar">
            <div className="hidden md:block pb-3 mb-2 border-b border-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-wider px-2">
              Navigation
            </div>
            
            <button 
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 md:gap-3 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 w-auto md:w-full ${
                activeTab === 'overview' 
                  ? 'bg-flyora-teal text-white shadow-teal' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-flyora-navy'
              }`}
            >
              <Sparkles size={16} />
              Overview
            </button>

            <button 
              onClick={() => setActiveTab('trips')}
              className={`flex items-center gap-2 md:gap-3 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 w-auto md:w-full ${
                activeTab === 'trips' 
                  ? 'bg-flyora-teal text-white shadow-teal' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-flyora-navy'
              }`}
            >
              <Plane size={16} />
              My Trips (Traveler)
            </button>

            <button 
              onClick={() => setActiveTab('shipments')}
              className={`flex items-center gap-2 md:gap-3 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 w-auto md:w-full ${
                activeTab === 'shipments' 
                  ? 'bg-flyora-teal text-white shadow-teal' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-flyora-navy'
              }`}
            >
              <List size={16} />
              My Shipments (Sender)
            </button>

            <button 
              onClick={() => setActiveTab('matches')}
              className={`flex items-center gap-2 md:gap-3 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 w-auto md:w-full ${
                activeTab === 'matches' 
                  ? 'bg-flyora-teal text-white shadow-teal' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-flyora-navy'
              }`}
            >
              <ArrowRightLeft size={16} />
              <span>Smart Matches</span>
              {overview && overview.matches.totalMatchesCount > 0 && (
                <span className={`ml-1.5 md:ml-auto text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                  activeTab === 'matches' ? 'bg-white text-flyora-teal' : 'bg-flyora-teal text-white'
                }`}>
                  {overview.matches.totalMatchesCount} New
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('wallet')}
              className={`flex items-center gap-2 md:gap-3 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 w-auto md:w-full ${
                activeTab === 'wallet' 
                  ? 'bg-flyora-teal text-white shadow-teal' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-flyora-navy'
              }`}
            >
              <Wallet size={16} />
              Wallet & Escrow
            </button>

            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 md:gap-3 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 w-auto md:w-full ${
                activeTab === 'profile' 
                  ? 'bg-flyora-teal text-white shadow-teal' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-flyora-navy'
              }`}
            >
              <User size={16} />
              Profile Settings
            </button>
          </div>

          {/* Verification Badge */}
          <div className="hidden md:flex bg-gradient-to-br from-flyora-navy to-flyora-navy-light text-white rounded-3xl p-5 shadow-md flex-col gap-3 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-10">
              <Shield size={120} />
            </div>
            
            <div className="w-8 h-8 rounded-lg bg-flyora-teal/20 text-flyora-teal flex items-center justify-center border border-flyora-teal/30">
              <Shield size={16} />
            </div>

            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-flyora-teal">Trust Protection</span>
              <h4 className="font-bold text-xs text-white mt-0.5">KYC Identity Active</h4>
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">Your luggage capacity deposits and reward payouts are secured under Flyora Escrow Guarantee.</p>
            </div>
          </div>
        </aside>

        {/* Dashboard Panels */}
        <main className="flex-1 bg-white border border-gray-200 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm min-h-[500px]">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="text-flyora-teal animate-spin mb-3" size={32} />
              <span className="text-xs text-gray-400 font-bold">Securing dashboard session...</span>
            </div>
          ) : (
            <>
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && overview && (
                <div className="space-y-8">
                  {/* Title */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                    <div>
                      <h1 className="text-xl font-bold text-flyora-navy">Account Overview</h1>
                      <p className="text-xs text-gray-400 mt-1">Real-time stats and capacities matching your destinations.</p>
                    </div>
                    
                    <button 
                      onClick={fetchData}
                      className="p-2 border border-gray-100 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-flyora-navy transition-colors shadow-sm"
                      title="Reload Stats"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Wallet */}
                    <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-5 flex items-center gap-4 hover:border-gray-200 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-flyora-teal border border-teal-100 flex items-center justify-center shrink-0">
                        <Wallet size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Wallet Balance</span>
                        <span className="text-xl font-extrabold text-flyora-navy mt-0.5 block">${overview.stats.walletBalance.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Escrow */}
                    <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-5 flex items-center gap-4 hover:border-gray-200 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center shrink-0">
                        <Lock size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Locked in Escrow</span>
                        <span className="text-xl font-extrabold text-flyora-navy mt-0.5 block">${overview.stats.escrowBalance.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Active Trips */}
                    <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-5 flex items-center gap-4 hover:border-gray-200 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shrink-0">
                        <Plane size={20} className="transform -rotate-45" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active Flights</span>
                        <span className="text-xl font-extrabold text-flyora-navy mt-0.5 block">{overview.stats.activeTripsCount} Trips</span>
                      </div>
                    </div>

                    {/* Active Shipments */}
                    <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-5 flex items-center gap-4 hover:border-gray-200 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 border border-purple-100 flex items-center justify-center shrink-0">
                        <List size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Shipment Offers</span>
                        <span className="text-xl font-extrabold text-flyora-navy mt-0.5 block">{overview.stats.activeShipmentsCount} Requests</span>
                      </div>
                    </div>
                  </div>

                  {/* Call to actions */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button 
                      onClick={() => setIsTripModalOpen(true)}
                      className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:border-flyora-teal bg-white hover:bg-flyora-teal/5 p-4 rounded-2xl text-xs font-bold text-flyora-navy transition-all shadow-sm group"
                    >
                      <PlusCircle size={16} className="text-flyora-teal group-hover:scale-110 transition-transform" />
                      Register New Flight capacity
                    </button>

                    <button 
                      onClick={() => setIsShipmentModalOpen(true)}
                      className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:border-flyora-teal bg-white hover:bg-flyora-teal/5 p-4 rounded-2xl text-xs font-bold text-flyora-navy transition-all shadow-sm group"
                    >
                      <PlusCircle size={16} className="text-flyora-teal group-hover:scale-110 transition-transform" />
                      Post Parcel Shipment request
                    </button>
                  </div>

                  {/* Smart Matches Preview */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-flyora-navy uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={16} className="text-flyora-teal" />
                      Instant Shipping Matches
                    </h3>
                    
                    {overview.matches.totalMatchesCount === 0 ? (
                      <div className="border border-dashed border-gray-200 rounded-2xl p-8 text-center text-xs text-gray-400 font-semibold leading-relaxed">
                        No matches found. Create new trips or shipment requests between similar cities (e.g. New York, Dubai, Delhi) to compute routes matching traveler baggage capacity.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {overview.matches.travelMatches.slice(0, 2).map((match, idx) => (
                          <div key={idx} className="border border-gray-100 rounded-2xl p-4 bg-gradient-to-r from-flyora-teal/5 to-transparent space-y-3 shadow-sm hover:border-flyora-teal/30 transition-colors">
                            <div className="flex items-center justify-between text-[9px] font-black uppercase text-flyora-teal">
                              <span>Traveler Match</span>
                              <span className="bg-flyora-teal/10 px-2 py-0.5 rounded-full">Save Reward</span>
                            </div>
                            
                            <div>
                              <p className="text-[10px] text-gray-400">Match for trip:</p>
                              <p className="text-xs font-extrabold text-flyora-navy">{match.tripDetails}</p>
                            </div>
                            
                            <div className="p-2.5 bg-white border border-gray-50 rounded-xl space-y-1">
                              <h4 className="font-bold text-xs text-flyora-navy">{match.shipment?.title}</h4>
                              <p className="text-[10px] text-gray-400">Sender: {match.shipment?.fullName} • Weight: {match.shipment?.weight}kg</p>
                              <div className="text-[10px] font-black text-flyora-teal mt-1">Reward offered: ${match.shipment?.pricePaid}</div>
                            </div>
                            
                            <Button variant="teal" size="sm" fullWidth className="text-[10px]" onClick={() => setActiveTab('matches')}>
                              Connect & Secure Reward
                            </Button>
                          </div>
                        ))}

                        {overview.matches.shipmentMatches.slice(0, 2).map((match, idx) => (
                          <div key={idx} className="border border-gray-100 rounded-2xl p-4 bg-gradient-to-r from-blue-50/30 to-transparent space-y-3 shadow-sm hover:border-flyora-teal/30 transition-colors">
                            <div className="flex items-center justify-between text-[9px] font-black uppercase text-blue-600">
                              <span>Sender Match</span>
                              <span className="bg-blue-50 px-2 py-0.5 rounded-full">Baggage Capacity</span>
                            </div>

                            <div>
                              <p className="text-[10px] text-gray-400">Match for parcel:</p>
                              <p className="text-xs font-extrabold text-flyora-navy">{match.shipmentDetails}</p>
                            </div>

                            <div className="p-2.5 bg-white border border-gray-50 rounded-xl space-y-1">
                              <h4 className="font-bold text-xs text-flyora-navy">Traveler Flight Route</h4>
                              <p className="text-[10px] text-gray-400">Traveler: {match.trip?.fullName} • Available Weight: {match.trip?.availableWeight}kg</p>
                              <div className="text-[10px] font-black text-blue-600 mt-1">Rate: ${match.trip?.pricePerKg}/kg</div>
                            </div>

                            <Button variant="secondary" size="sm" fullWidth className="text-[10px] border-blue-200 text-blue-600 hover:bg-blue-50/50" onClick={() => setActiveTab('matches')}>
                              Request Booking Capacity
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: MY TRIPS */}
              {activeTab === 'trips' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                    <div>
                      <h1 className="text-xl font-bold text-flyora-navy">Registered Trips</h1>
                      <p className="text-xs text-gray-400 mt-1">Add your upcoming flights to deposit luggage capacity and secure shipping rewards.</p>
                    </div>

                    <Button variant="teal" size="sm" className="flex items-center gap-1" onClick={() => setIsTripModalOpen(true)}>
                      <PlusCircle size={14} />
                      Register Trip
                    </Button>
                  </div>

                  {trips.length === 0 ? (
                    <div className="border border-dashed border-gray-200 rounded-3xl p-12 text-center text-xs text-gray-400 font-semibold space-y-2">
                      <Plane size={32} className="mx-auto text-gray-300 transform -rotate-45" />
                      <p>You have no active travel records registered yet.</p>
                      <Button variant="secondary" size="sm" onClick={() => setIsTripModalOpen(true)}>Add your first trip</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {trips.map(trip => (
                        <div key={trip.id} className="border border-gray-100 rounded-2xl p-5 hover:bg-gray-50/30 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-flyora-teal/10 text-flyora-teal rounded-xl flex items-center justify-center shrink-0 border border-flyora-teal/20">
                              <Plane size={18} className="transform -rotate-45" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-flyora-navy uppercase">{trip.fromCity}</span>
                                <span className="text-gray-400 text-xs">➔</span>
                                <span className="font-extrabold text-sm text-flyora-navy uppercase">{trip.toCity}</span>
                              </div>
                              
                              <div className="text-[10px] text-gray-500 font-bold flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(trip.travelDate).toLocaleDateString()}</span>
                                <span>Capacity: {trip.availableWeight} kg</span>
                                <span>Rate: ${trip.pricePerKg}/kg</span>
                              </div>

                              {trip.description && <p className="text-[10px] text-gray-400 leading-normal italic">"{trip.description}"</p>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                              {trip.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MY SHIPMENTS */}
              {activeTab === 'shipments' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                    <div>
                      <h1 className="text-xl font-bold text-flyora-navy">Shipment Requests</h1>
                      <p className="text-xs text-gray-400 mt-1">Post requests for parcels you want delivered. Rewards are locked in Escrow.</p>
                    </div>

                    <Button variant="teal" size="sm" className="flex items-center gap-1" onClick={() => setIsShipmentModalOpen(true)}>
                      <PlusCircle size={14} />
                      Post Request
                    </Button>
                  </div>

                  {shipments.length === 0 ? (
                    <div className="border border-dashed border-gray-200 rounded-3xl p-12 text-center text-xs text-gray-400 font-semibold space-y-2">
                      <List size={32} className="mx-auto text-gray-300" />
                      <p>You have no shipment requests created yet.</p>
                      <Button variant="secondary" size="sm" onClick={() => setIsShipmentModalOpen(true)}>Post your first request</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {shipments.map(ship => (
                        <div key={ship.id} className="border border-gray-100 rounded-2xl p-5 hover:bg-gray-50/30 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0 border border-purple-100">
                              <List size={18} />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-extrabold text-sm text-flyora-navy">{ship.title}</h4>
                              
                              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                                <span className="uppercase">{ship.fromCity}</span>
                                <span className="text-gray-400 text-[10px]">➔</span>
                                <span className="uppercase">{ship.toCity}</span>
                              </div>

                              <div className="text-[10px] text-gray-500 font-bold flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span className="flex items-center gap-1"><Calendar size={11} /> Deadline: {new Date(ship.deliveryDeadline).toLocaleDateString()}</span>
                                <span>Weight: {ship.weight} kg</span>
                                <span className="text-purple-600">Category: {ship.category}</span>
                              </div>

                              <div className="text-[10px] font-black text-flyora-teal">Reward Offered: ${ship.pricePaid}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                              {ship.status}
                            </span>
                            
                            {ship.status === 'PENDING' && (
                              <button 
                                onClick={() => simulatePayout(ship.pricePaid, ship.title)}
                                className="text-[10px] font-bold text-flyora-teal hover:underline flex items-center gap-1 border border-flyora-teal/20 hover:bg-flyora-teal/5 px-2.5 py-1 rounded-xl bg-white transition-all shadow-sm"
                              >
                                Release Escrow Payout
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SMART MATCHES */}
              {activeTab === 'matches' && overview && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                    <div>
                      <h1 className="text-xl font-bold text-flyora-navy">Smart Matchmaking</h1>
                      <p className="text-xs text-gray-400 mt-1">Cross-referencing traveler capacity and shipment requests on matching flight routes.</p>
                    </div>
                  </div>

                  {overview.matches.totalMatchesCount === 0 ? (
                    <div className="border border-dashed border-gray-200 rounded-3xl p-12 text-center text-xs text-gray-400 font-semibold space-y-2">
                      <ArrowRightLeft size={32} className="mx-auto text-gray-300" />
                      <p>No matches available right now.</p>
                      <p className="text-[10px] text-gray-400 max-w-sm mx-auto leading-relaxed">
                        To compute active matches, ensure you have registered trips or shipments sharing routes with other compliance verified users. Try matching Cities (e.g. London ➔ New York).
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Sub-Section: Match for Traveler Capacity */}
                      {overview.matches.travelMatches.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-xs font-black text-flyora-teal uppercase tracking-wider flex items-center gap-1.5">
                            <Plane size={14} className="transform -rotate-45" />
                            Senders Requesting Your Active Capacity
                          </h3>
                          
                          <div className="grid grid-cols-1 gap-4">
                            {overview.matches.travelMatches.map((match, idx) => (
                              <div key={idx} className="border border-gray-100 rounded-2xl p-5 hover:bg-gray-50/20 transition-all flex flex-col sm:flex-row justify-between gap-4">
                                <div className="space-y-2">
                                  <div className="text-[9px] font-black uppercase text-flyora-teal bg-teal-50 px-2 py-0.5 rounded-full w-fit">
                                    Matches Flight capacity: {match.tripDetails}
                                  </div>
                                  <h4 className="font-extrabold text-sm text-flyora-navy">{match.shipment?.title}</h4>
                                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">"{match.shipment?.description}"</p>
                                  
                                  <div className="text-[10px] text-gray-400 font-bold flex gap-4">
                                    <span>Sender: {match.shipment?.fullName}</span>
                                    <span>Weight: {match.shipment?.weight}kg</span>
                                    <span className="text-flyora-teal">Reward reward: ${match.shipment?.pricePaid}</span>
                                  </div>
                                </div>

                                <div className="shrink-0 flex items-center justify-end">
                                  <Button 
                                    variant="teal" 
                                    size="sm" 
                                    onClick={() => alert(`Connection request sent to ${match.shipment?.fullName}. Once they accept, Flyora Escrow will lock $${match.shipment?.pricePaid} contract balance.`)}
                                  >
                                    Accept Shipping Request
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sub-Section: Match for Sender Shipments */}
                      {overview.matches.shipmentMatches.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-xs font-black text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                            <List size={14} />
                            Travelers Traveling on your Shipping Route
                          </h3>

                          <div className="grid grid-cols-1 gap-4">
                            {overview.matches.shipmentMatches.map((match, idx) => (
                              <div key={idx} className="border border-gray-100 rounded-2xl p-5 hover:bg-gray-50/20 transition-all flex flex-col sm:flex-row justify-between gap-4">
                                <div className="space-y-2">
                                  <div className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                                    Matches Shipment parcel: {match.shipmentDetails}
                                  </div>
                                  <h4 className="font-extrabold text-sm text-flyora-navy uppercase">
                                    {match.trip?.fromCity} ➔ {match.trip?.toCity}
                                  </h4>
                                  <p className="text-[10px] text-gray-500 font-bold flex gap-4">
                                    <span>Traveler: {match.trip?.fullName}</span>
                                    <span>Flight Date: {match.trip?.travelDate ? new Date(match.trip.travelDate).toLocaleDateString() : ''}</span>
                                    <span>Available Capacity: {match.trip?.availableWeight}kg</span>
                                    <span className="text-blue-600">Rate: ${match.trip?.pricePerKg}/kg</span>
                                  </p>
                                </div>

                                <div className="shrink-0 flex items-center justify-end">
                                  <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className="border-blue-200 text-blue-600 hover:bg-blue-50/50"
                                    onClick={() => alert(`Booking request capacity sent to ${match.trip?.fullName}.`)}
                                  >
                                    Book Baggage Capacity
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: ESCROW & WALLET */}
              {activeTab === 'wallet' && overview && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                    <div>
                      <h1 className="text-xl font-bold text-flyora-navy">Wallet & Escrow Status</h1>
                      <p className="text-xs text-gray-400 mt-1">Flyora Escrow locks payments securely until delivery is validated.</p>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-5 space-y-1 relative overflow-hidden">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Wallet Balance</span>
                      <span className="text-2xl font-extrabold text-flyora-navy block">${overview.stats.walletBalance.toFixed(2)}</span>
                      <p className="text-[9px] text-gray-400 leading-normal pt-1">Withdrawable earnings available in your bank account.</p>
                    </div>
                    {/* Card 2 */}
                    <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-5 space-y-1 relative overflow-hidden">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Baggage Escrow Balance</span>
                      <span className="text-2xl font-extrabold text-flyora-navy block">${overview.stats.escrowBalance.toFixed(2)}</span>
                      <p className="text-[9px] text-gray-400 leading-normal pt-1">Funds locked in Flyora Escrow awaiting traveler delivery completion.</p>
                    </div>
                    {/* Card 3 */}
                    <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-5 space-y-1 relative overflow-hidden flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Compliance Level</span>
                        <span className="text-base font-extrabold text-flyora-teal flex items-center gap-1 mt-0.5"><Shield size={14} /> Level 1 (Verified)</span>
                      </div>
                      <p className="text-[9px] text-gray-400 leading-normal pt-1">Identity checks passed. Payout releases processed instantly.</p>
                    </div>
                  </div>

                  {/* Transaction History */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-flyora-navy uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard size={14} className="text-flyora-teal" />
                      Transaction History
                    </h3>

                    <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
                      {walletHistory.map(tx => (
                        <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                          <div className="space-y-0.5 pr-4">
                            <p className="text-xs font-bold text-flyora-navy">{tx.description}</p>
                            <p className="text-[9px] text-gray-400">{tx.date}</p>
                          </div>
                          <span className={`text-xs font-extrabold shrink-0 ${
                            tx.type === 'credit' ? 'text-green-600' : 'text-red-500'
                          }`}>
                            {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: PROFILE SETTINGS */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-gray-50">
                    <h1 className="text-xl font-bold text-flyora-navy">Profile Settings</h1>
                    <p className="text-xs text-gray-400 mt-1">Manage user contact details, address records, and secure login details.</p>
                  </div>

                  <form className="max-w-md space-y-4" onSubmit={handleUpdateProfile}>
                    {profileMessage.text && (
                      <div className={`p-3 border rounded-xl text-xs font-bold ${
                        profileMessage.type === 'success' 
                          ? 'bg-green-50 border-green-100 text-green-700' 
                          : 'bg-red-50 border-red-100 text-red-700'
                      }`}>
                        {profileMessage.text}
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-flyora-navy">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-flyora-teal focus:ring-1 focus:ring-flyora-teal/20 transition-all text-flyora-navy"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-flyora-navy">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-flyora-teal focus:ring-1 focus:ring-flyora-teal/20 transition-all text-flyora-navy"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-flyora-navy">Phone Number</label>
                      <input 
                        type="text" 
                        required
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-flyora-teal focus:ring-1 focus:ring-flyora-teal/20 transition-all text-flyora-navy"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-flyora-navy">New Password (leave blank to keep unchanged)</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        value={profilePassword}
                        onChange={(e) => setProfilePassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-flyora-teal focus:ring-1 focus:ring-flyora-teal/20 transition-all text-flyora-navy"
                      />
                    </div>

                    <div className="pt-2">
                      <Button variant="teal" type="submit" disabled={profileLoading} className="px-8">
                        {profileLoading ? 'Saving changes...' : 'Save Profile Details'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

            </>
          )}

        </main>
      </div>

      {/* ─── MODAL: REGISTER TRIP ─── */}
      {isTripModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <h3 className="font-extrabold text-base text-flyora-navy flex items-center gap-1.5">
              <Plane size={18} className="text-flyora-teal transform -rotate-45" />
              Register Travel Flight Route
            </h3>
            
            <form className="space-y-3" onSubmit={handleCreateTrip}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">From City</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. New York"
                    value={tripFrom}
                    onChange={(e) => setTripFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-flyora-teal text-flyora-navy"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">To City</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. London"
                    value={tripTo}
                    onChange={(e) => setTripTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-flyora-teal text-flyora-navy"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Flight Travel Date</label>
                <input 
                  type="date" 
                  required 
                  value={tripDate}
                  onChange={(e) => setTripDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-flyora-teal text-flyora-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Available Baggage (kg)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="e.g. 15"
                    min="1"
                    value={tripWeight}
                    onChange={(e) => setTripWeight(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-flyora-teal text-flyora-navy"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Rate per kg (USD)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="e.g. 10"
                    min="1"
                    value={tripPrice}
                    onChange={(e) => setTripPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-flyora-teal text-flyora-navy"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Flight/Baggage Description</label>
                <textarea 
                  placeholder="e.g. Flight UA904. Accept documents, laptop, clothes. Safe cargo only."
                  value={tripDesc}
                  onChange={(e) => setTripDesc(e.target.value)}
                  className="w-full h-20 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-flyora-teal text-flyora-navy resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <Button variant="secondary" size="sm" type="button" onClick={() => setIsTripModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="teal" size="sm" type="submit" disabled={modalLoading}>
                  {modalLoading ? 'Creating...' : 'Register Trip'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: POST SHIPMENT ─── */}
      {isShipmentModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <h3 className="font-extrabold text-base text-flyora-navy flex items-center gap-1.5">
              <PlusCircle size={18} className="text-flyora-teal" />
              Post Parcel Shipment Request
            </h3>

            <form className="space-y-3" onSubmit={handleCreateShipment}>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Item Title</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Urgent Business Documents"
                  value={shipTitle}
                  onChange={(e) => setShipTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-flyora-teal text-flyora-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Category</label>
                  <select 
                    value={shipCategory}
                    onChange={(e) => setShipCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-flyora-teal text-flyora-navy bg-white"
                  >
                    <option value="documents">Documents</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="food">Food</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Weight (kg)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="e.g. 2"
                    min="1"
                    value={shipWeight}
                    onChange={(e) => setShipWeight(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-flyora-teal text-flyora-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">From City</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. New York"
                    value={shipFrom}
                    onChange={(e) => setShipFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-flyora-teal text-flyora-navy"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">To City</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. London"
                    value={shipTo}
                    onChange={(e) => setShipTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-flyora-teal text-flyora-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Reward Offered (USD)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="e.g. 50"
                    min="1"
                    value={shipPrice}
                    onChange={(e) => setShipPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-flyora-teal text-flyora-navy"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Delivery Deadline</label>
                  <input 
                    type="date" 
                    required 
                    value={shipDeadline}
                    onChange={(e) => setShipDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-flyora-teal text-flyora-navy"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Item Description & Instructions</label>
                <textarea 
                  placeholder="e.g. 1 envelope containing legal paperwork. Original documents. Needs to be dropped at Heathrow T5."
                  required
                  value={shipDesc}
                  onChange={(e) => setShipDesc(e.target.value)}
                  className="w-full h-16 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-flyora-teal text-flyora-navy resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <Button variant="secondary" size="sm" type="button" onClick={() => setIsShipmentModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="teal" size="sm" type="submit" disabled={modalLoading}>
                  {modalLoading ? 'Creating...' : 'Post Request'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 border-t border-gray-100 bg-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
          <span>© 2025 Flyora Luggage Protection. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-flyora-navy transition-colors">Safety Guidelines</a>
            <a href="#" className="hover:text-flyora-navy transition-colors">Escrow Terms</a>
            <a href="#" className="hover:text-flyora-navy transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
