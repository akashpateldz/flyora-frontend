import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plane, Shield, Wallet, List, User, PlusCircle, ArrowRightLeft, Calendar,
  LogOut, CheckCircle, AlertCircle, Trash2, ArrowRight, MapPin, Loader2,
  Sparkles, DollarSign, Lock, CreditCard, RefreshCw, Check, Search, Bell,
  MessageSquare, ChevronDown, Clock, Star, HelpCircle, Briefcase, Plus, Send,
  MoreHorizontal, Settings, Hourglass, Truck, ShieldCheck, ArrowUpRight
} from 'lucide-react';
import Button from '../components/ui/Button';
import { API_BASE_URL } from '../config';
import KycPage from './KycPage';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'shipments' | 'matches' | 'wallet' | 'profile' | 'reviews' | 'kyc'>('overview');
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  // View sub-states (no popups)
  const [tripSubView, setTripSubView] = useState<'list' | 'create' | 'edit' | 'dashboard'>('list');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const [shipmentSubView, setShipmentSubView] = useState<'list' | 'create' | 'edit' | 'dashboard'>('list');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const [modalLoading, setModalLoading] = useState(false);

  // New/Edit Trip Form State
  const [tripFrom, setTripFrom] = useState('');
  const [tripTo, setTripTo] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [tripWeight, setTripWeight] = useState('');
  const [tripPrice, setTripPrice] = useState('');
  const [tripDesc, setTripDesc] = useState('');

  // New/Edit Shipment Form State
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

  // Pre-fill Trip Form on Edit
  useEffect(() => {
    if (selectedTrip) {
      setTripFrom(selectedTrip.fromCity);
      setTripTo(selectedTrip.toCity);
      setTripDate(selectedTrip.travelDate ? selectedTrip.travelDate.split('T')[0] : '');
      setTripWeight(String(selectedTrip.availableWeight));
      setTripPrice(String(selectedTrip.pricePerKg));
      setTripDesc(selectedTrip.description || '');
    } else {
      setTripFrom('');
      setTripTo('');
      setTripDate('');
      setTripWeight('');
      setTripPrice('');
      setTripDesc('');
    }
  }, [selectedTrip]);

  // Pre-fill Shipment Form on Edit
  useEffect(() => {
    if (selectedShipment) {
      setShipTitle(selectedShipment.title);
      setShipCategory(selectedShipment.category);
      setShipFrom(selectedShipment.fromCity);
      setShipTo(selectedShipment.toCity);
      setShipWeight(String(selectedShipment.weight));
      setShipPrice(String(selectedShipment.pricePaid));
      setShipDeadline(selectedShipment.deliveryDeadline ? selectedShipment.deliveryDeadline.split('T')[0] : '');
      setShipDesc(selectedShipment.description);
    } else {
      setShipTitle('');
      setShipCategory('electronics');
      setShipFrom('');
      setShipTo('');
      setShipWeight('');
      setShipPrice('');
      setShipDeadline('');
      setShipDesc('');
    }
  }, [selectedShipment]);

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

  // Submit Trip (Create or Edit)
  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setModalLoading(true);

    const isEdit = tripSubView === 'edit' && selectedTrip;
    const url = isEdit
      ? `${API_BASE_URL}/api/dashboard/trips/${selectedTrip.id}`
      : `${API_BASE_URL}/api/dashboard/trips`;

    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
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
        // Clear state & view
        setTripSubView('list');
        setSelectedTrip(null);
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
        alert(err.message || 'Failed to save trip');
      }
    } catch (err: any) {
      console.error(err);
      alert('Network error saving trip');
    } finally {
      setModalLoading(false);
    }
  };

  // Delete Trip
  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/trips/${tripId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchData();
      } else {
        alert('Failed to delete trip');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting trip');
    }
  };

  // Submit Shipment (Create or Edit)
  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setModalLoading(true);

    const isEdit = shipmentSubView === 'edit' && selectedShipment;
    const url = isEdit
      ? `${API_BASE_URL}/api/dashboard/shipments/${selectedShipment.id}`
      : `${API_BASE_URL}/api/dashboard/shipments`;

    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
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
        // Clear state & view
        setShipmentSubView('list');
        setSelectedShipment(null);
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
        alert(err.message || 'Failed to save shipment');
      }
    } catch (err: any) {
      console.error(err);
      alert('Network error saving shipment');
    } finally {
      setModalLoading(false);
    }
  };

  // Delete Shipment
  const handleDeleteShipment = async (shipmentId: string) => {
    if (!confirm('Are you sure you want to delete this shipment request?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/shipments/${shipmentId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchData();
      } else {
        alert('Failed to delete shipment');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting shipment');
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
    <div className="min-h-screen bg-slate-50/50 flex font-sans text-slate-800">
      {/* ─── LEFT SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 sticky top-0 h-screen hidden lg:flex">
        {/* Brand Logo */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-flyora-teal to-flyora-teal-bright flex items-center justify-center shadow-teal">
              <Plane size={18} className="text-white transform -rotate-45 plane-icon" />
            </div>
            <span className="text-xl font-black text-flyora-navy">fly<span className="text-flyora-teal">orago</span></span>
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-slate-600">
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Scrollable Nav & Banner Container */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between">
          {/* Sidebar Nav Items */}
          <div className="px-4 py-6 space-y-6">
            {/* Main Dashboard item */}
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative ${activeTab === 'overview'
                    ? 'bg-slate-50 text-flyora-teal shadow-sm font-bold'
                    : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-800'
                  }`}
              >
                {activeTab === 'overview' && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-flyora-teal rounded-r" />
                )}
                <Sparkles size={18} className={activeTab === 'overview' ? 'text-flyora-teal' : 'text-slate-400'} />
                Dashboard
              </button>
            </div>

            {/* SHIP & TRAVEL Group */}
            <div className="space-y-1.5">
              <h4 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ship & Travel</h4>
              <button
                onClick={() => setActiveTab('matches')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'matches'
                    ? 'bg-slate-50 text-flyora-teal font-bold'
                    : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-800'
                  }`}
              >
                <Search size={17} className="text-slate-400" />
                Find Traveler
              </button>
              <button
                onClick={() => { setActiveTab('trips'); setTripSubView('dashboard'); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'trips' && tripSubView === 'dashboard'
                    ? 'bg-slate-50 text-flyora-teal font-bold'
                    : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-800'
                  }`}
              >
                <PlusCircle size={17} className={activeTab === 'trips' && tripSubView === 'dashboard' ? 'text-flyora-teal' : 'text-slate-400'} />
                Traveller
              </button>
              <button
                onClick={() => { setActiveTab('shipments'); setShipmentSubView('dashboard'); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'shipments' && shipmentSubView === 'dashboard'
                    ? 'bg-slate-50 text-flyora-teal font-bold'
                    : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-800'
                  }`}
              >
                <Send size={17} className={activeTab === 'shipments' && shipmentSubView === 'dashboard' ? 'text-flyora-teal' : 'text-slate-400'} />
                Sender
              </button>
              <button
                onClick={() => { setActiveTab('shipments'); setShipmentSubView('list'); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'shipments' && shipmentSubView !== 'dashboard'
                    ? 'bg-slate-50 text-flyora-teal font-bold'
                    : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-800'
                  }`}
              >
                <Briefcase size={17} className={activeTab === 'shipments' && shipmentSubView !== 'dashboard' ? 'text-flyora-teal' : 'text-slate-400'} />
                My Shipments
              </button>
              <button
                onClick={() => { setActiveTab('trips'); setTripSubView('list'); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'trips' && tripSubView !== 'dashboard'
                    ? 'bg-slate-50 text-flyora-teal font-bold'
                    : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-800'
                  }`}
              >
                <Briefcase size={17} className={activeTab === 'trips' && tripSubView !== 'dashboard' ? 'text-flyora-teal' : 'text-slate-400'} />
                My Trips
              </button>
            </div>

            {/* WALLET & PAYMENTS Group */}
            <div className="space-y-1.5">
              <h4 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wallet & Payments</h4>
              <button
                onClick={() => setActiveTab('wallet')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'wallet'
                    ? 'bg-slate-50 text-flyora-teal font-bold'
                    : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-800'
                  }`}
              >
                <Wallet size={17} className="text-slate-400" />
                Wallet
              </button>
              <button
                onClick={() => setActiveTab('wallet')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50/50 hover:text-slate-800 transition-all"
              >
                <List size={17} className="text-slate-400" />
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('wallet')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50/50 hover:text-slate-800 transition-all"
              >
                <Shield size={17} className="text-slate-400" />
                Escrow Payments
              </button>
            </div>

            {/* COMMUNITY Group */}
            <div className="space-y-1.5">
              <h4 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Community</h4>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'reviews'
                    ? 'bg-slate-50 text-flyora-teal font-bold'
                    : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-800'
                  }`}
              >
                <Star size={17} className={activeTab === 'reviews' ? 'text-flyora-teal' : 'text-slate-400'} />
                Reviews
              </button>
            </div>

            {/* ACCOUNT Group */}
            <div className="space-y-1.5">
              <h4 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account</h4>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'profile'
                    ? 'bg-slate-50 text-flyora-teal font-bold'
                    : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-800'
                  }`}
              >
                <User size={17} className="text-slate-400" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('kyc')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'kyc'
                    ? 'bg-slate-50 text-flyora-teal font-bold'
                    : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-800'
                  }`}
              >
                <ShieldCheck size={17} className={activeTab === 'kyc' ? 'text-flyora-teal' : 'text-slate-400'} />
                KYC Verification
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50/50 hover:text-slate-800 transition-all"
              >
                <Settings size={17} className="text-slate-400" />
                Settings
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50/50 hover:text-slate-800 transition-all"
              >
                <HelpCircle size={17} className="text-slate-400" />
                Support
              </button>
            </div>
          </div>

          {/* Sidebar Bottom Banner Card */}
          <div className="p-4 m-4 bg-teal-50/50 border border-teal-100/50 rounded-2xl relative overflow-hidden flex flex-col gap-3">
            <div className="flex flex-col gap-1 z-10">
              <h5 className="text-xs font-bold text-flyora-teal">Earn More</h5>
              <p className="text-[10px] text-slate-500 leading-relaxed">Post your trip and earn easy money sharing baggage capacity.</p>
            </div>
            <button
              onClick={() => { setActiveTab('trips'); setTripSubView('dashboard'); }}
              className="w-full bg-flyora-teal hover:bg-flyora-teal-dark text-white text-[10px] font-bold py-2 rounded-xl transition-all shadow-sm z-10"
            >
              Traveller
            </button>
            {/* Subtle luggage vector illustration backdrop */}
            <div className="absolute -right-2 -bottom-2 w-16 h-16 opacity-10 text-flyora-teal">
              <Plane size={64} className="transform -rotate-45" />
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Sleek Top Header */}
        <header className="h-20 bg-white border-b border-slate-100 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          {/* Left search bar */}
          <div className="relative w-full max-w-md hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              type="text"
              placeholder="Search travelers, trips, packages..."
              className="w-full pl-10 pr-12 py-2.5 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:bg-white transition-all focus:border-flyora-teal"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-200/50 border border-slate-300/30 px-1.5 py-0.5 rounded text-[9px] font-bold text-slate-500">
              ⌘ K
            </div>
          </div>

          {/* Mobile brand logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-flyora-teal to-flyora-teal-bright flex items-center justify-center">
              <Plane size={14} className="text-white transform -rotate-45" />
            </div>
            <span className="text-base font-black text-flyora-navy">flyorago</span>
          </Link>

          {/* Right utility items */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-flyora-teal rounded-full" />
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-100" />

            {/* Profile Dropdown Box */}
            <div className="flex items-center gap-3 pl-1 group cursor-pointer relative">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
                alt="Profile Avatar"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-flyora-teal/30 transition-all"
              />
              <div className="flex flex-col text-left hidden md:flex">
                <span className="text-xs font-bold text-slate-800">{profileName}</span>
                <span className="text-[10px] text-slate-400 font-medium">Sender</span>
              </div>
              <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-all" />

              {/* Hover logout popup */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40">
                <div className="px-4 py-2 border-b border-slate-50">
                  <p className="text-[10px] text-slate-400">Signed in as</p>
                  <p className="text-xs font-bold text-slate-800 truncate">{profileEmail}</p>
                </div>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-2"
                >
                  <User size={13} /> Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50/50 transition-all flex items-center gap-2"
                >
                  <LogOut size={13} /> Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Panels Scroll Container */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="text-flyora-teal animate-spin mb-4" size={32} />
              <span className="text-xs text-slate-400 font-bold">Securing dashboard session...</span>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-fade-in">

                  {/* Welcome Greeting Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Good Morning, {profileName.split(' ')[0]} 👋</span>
                      <h1 className="text-2xl font-black text-flyora-navy tracking-tight mt-1">Welcome back to Flyora!</h1>
                      <p className="text-xs text-slate-500 mt-1.5">Manage your shipments, track deliveries, and explore new opportunities.</p>
                    </div>

                    <button
                      onClick={fetchData}
                      className="flex items-center gap-1.5 px-3 py-2 border border-slate-200/80 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition-all shadow-sm self-start sm:self-auto"
                      title="Refresh Dashboard"
                    >
                      <RefreshCw size={12} className="text-slate-400" />
                      Reload Stats
                    </button>
                  </div>

                  {/* Redesigned 4 Quick Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Card 1: Total Shipments */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-32 relative overflow-hidden group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Shipments</span>
                        <div className="w-9 h-9 rounded-xl bg-teal-50 text-flyora-teal flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Briefcase size={16} />
                        </div>
                      </div>
                      <div>
                        <span className="text-2xl font-black text-slate-800">12</span>
                        <span className="text-[10px] font-bold text-emerald-500 ml-2">↑ 20% from last month</span>
                      </div>
                    </div>

                    {/* Card 2: Active Shipments */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-32 relative overflow-hidden group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Shipments</span>
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Plane size={16} className="transform -rotate-45" />
                        </div>
                      </div>
                      <div>
                        <span className="text-2xl font-black text-slate-800">{overview?.stats.activeShipmentsCount || 5}</span>
                        <span className="text-[10px] font-semibold text-blue-500 ml-2 bg-blue-50 px-2 py-0.5 rounded-full">In transit</span>
                      </div>
                    </div>

                    {/* Card 3: Completed */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-32 relative overflow-hidden group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <CheckCircle size={16} />
                        </div>
                      </div>
                      <div>
                        <span className="text-2xl font-black text-slate-800">7</span>
                        <span className="text-[10px] font-bold text-emerald-500 ml-2">↑ 14% from last month</span>
                      </div>
                    </div>

                    {/* Card 4: Total Spent */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-32 relative overflow-hidden group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Spent</span>
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Wallet size={16} />
                        </div>
                      </div>
                      <div>
                        <span className="text-2xl font-black text-slate-800">$320.50</span>
                        <span className="text-[10px] font-bold text-rose-500 ml-2">↓ 8% from last month</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Grid: Left Column (2/3) & Right Column (1/3) */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                    {/* Left Column (2/3) */}
                    <div className="xl:col-span-2 space-y-8">

                      {/* Shipment Status Overview Stepper */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-black text-flyora-navy uppercase tracking-wider">Shipment Status Overview</h3>
                          <button
                            onClick={() => setActiveTab('shipments')}
                            className="text-xs font-bold text-flyora-teal hover:underline"
                          >
                            View All
                          </button>
                        </div>

                        {/* Stepper Progress bar visual representation */}
                        <div className="grid grid-cols-4 gap-2 relative py-4">
                          {/* Horizontal connectors */}
                          <div className="absolute left-[12%] right-[12%] top-1/2 -translate-y-4 h-1 bg-slate-100 -z-0">
                            <div className="h-full bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500 w-[75%]" />
                          </div>

                          {/* Step 1: Pending */}
                          <div className="flex flex-col items-center text-center z-10">
                            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center border-2 border-white shadow">
                              <Hourglass size={16} />
                            </div>
                            <span className="text-xs font-black text-slate-800 mt-2">2</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Pending</span>
                          </div>

                          {/* Step 2: In Transit */}
                          <div className="flex flex-col items-center text-center z-10">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center border-2 border-white shadow">
                              <Plane size={16} className="transform -rotate-45" />
                            </div>
                            <span className="text-xs font-black text-slate-800 mt-2">5</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5">In Transit</span>
                          </div>

                          {/* Step 3: Out for Delivery */}
                          <div className="flex flex-col items-center text-center z-10">
                            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border-2 border-white shadow">
                              <Truck size={16} />
                            </div>
                            <span className="text-xs font-black text-slate-800 mt-2">1</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Out for Delivery</span>
                          </div>

                          {/* Step 4: Delivered */}
                          <div className="flex flex-col items-center text-center z-10">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border-2 border-white shadow">
                              <Check size={16} />
                            </div>
                            <span className="text-xs font-black text-slate-800 mt-2">4</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Delivered</span>
                          </div>
                        </div>
                      </div>

                      {/* Wallet Balance widget */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
                        <div className="space-y-3 z-10">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wallet Balance</span>
                          <div>
                            <span className="text-[10px] text-slate-400 font-medium">Available Balance</span>
                            <h2 className="text-3xl font-black text-flyora-navy mt-1">${overview?.stats.walletBalance?.toFixed(2) || '120.50'}</h2>
                          </div>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-extrabold text-emerald-600">
                            <ShieldCheck size={12} /> Escrow Protected
                          </span>
                        </div>

                        <div className="flex items-center gap-4 z-10 self-stretch sm:self-auto">
                          <button
                            onClick={() => {
                              const amtStr = prompt('Enter top up amount ($):', '100');
                              if (amtStr && !isNaN(Number(amtStr))) {
                                alert(`Top up of $${Number(amtStr).toFixed(2)} completed successfully!`);
                              }
                            }}
                            className="flex-1 sm:flex-none bg-flyora-teal hover:bg-flyora-teal-dark text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-sm text-center"
                          >
                            Top Up
                          </button>
                        </div>

                        {/* Subtle wallet vector background */}
                        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-slate-50/50 -z-0 clip-path-diagonal pointer-events-none hidden sm:block" />
                      </div>

                      {/* Recent Shipments Table Container */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-black text-flyora-navy uppercase tracking-wider">Recent Shipments</h3>
                          <button
                            onClick={() => setActiveTab('shipments')}
                            className="text-xs font-bold text-flyora-teal hover:underline"
                          >
                            View All Shipments
                          </button>
                        </div>

                        <div className="overflow-x-auto no-scrollbar">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                <th className="pb-3 font-semibold">Shipment</th>
                                <th className="pb-3 font-semibold">Route</th>
                                <th className="pb-3 font-semibold">Traveler</th>
                                <th className="pb-3 font-semibold text-center">Status</th>
                                <th className="pb-3 font-semibold">Delivery</th>
                                <th className="pb-3 font-semibold text-right">Amount</th>
                                <th className="pb-3 font-semibold text-center"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50/60">
                              {/* Entry 1 */}
                              <tr className="hover:bg-slate-50/40 transition-colors">
                                <td className="py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-100">
                                      <Briefcase size={15} />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold text-slate-800">FLY123456</span>
                                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Electronics</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                    <span>New York (USA)</span>
                                    <ArrowRight size={11} className="text-slate-400" />
                                    <span>London (UK)</span>
                                  </div>
                                </td>
                                <td className="py-4">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120"
                                      className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-100"
                                      alt="Traveler Avatar"
                                    />
                                    <span className="text-xs font-semibold text-slate-700">John D.</span>
                                  </div>
                                </td>
                                <td className="py-4 text-center">
                                  <span className="inline-block text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-50 text-flyora-teal border border-teal-100">
                                    In Transit
                                  </span>
                                </td>
                                <td className="py-4 text-xs font-semibold text-slate-500">24 May, 10:30 AM</td>
                                <td className="py-4 text-right text-xs font-extrabold text-slate-800">$45.60</td>
                                <td className="py-4 text-center text-slate-400 hover:text-slate-600 cursor-pointer">
                                  <MoreHorizontal size={14} />
                                </td>
                              </tr>

                              {/* Entry 2 */}
                              <tr className="hover:bg-slate-50/40 transition-colors">
                                <td className="py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-100">
                                      <List size={15} />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold text-slate-800">FLY123455</span>
                                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Documents</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                    <span>Dubai (UAE)</span>
                                    <ArrowRight size={11} className="text-slate-400" />
                                    <span>Mumbai (India)</span>
                                  </div>
                                </td>
                                <td className="py-4">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
                                      className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-100"
                                      alt="Traveler Avatar"
                                    />
                                    <span className="text-xs font-semibold text-slate-700">Ahmed K.</span>
                                  </div>
                                </td>
                                <td className="py-4 text-center">
                                  <span className="inline-block text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                                    Out for Delivery
                                  </span>
                                </td>
                                <td className="py-4 text-xs font-semibold text-slate-500">22 May, 02:15 PM</td>
                                <td className="py-4 text-right text-xs font-extrabold text-slate-800">$28.30</td>
                                <td className="py-4 text-center text-slate-400 hover:text-slate-600 cursor-pointer">
                                  <MoreHorizontal size={14} />
                                </td>
                              </tr>

                              {/* Entry 3 */}
                              <tr className="hover:bg-slate-50/40 transition-colors">
                                <td className="py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-100">
                                      <Briefcase size={15} />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold text-slate-800">FLY123454</span>
                                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Clothing</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                    <span>Toronto (Canada)</span>
                                    <ArrowRight size={11} className="text-slate-400" />
                                    <span>New York (USA)</span>
                                  </div>
                                </td>
                                <td className="py-4">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120"
                                      className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-100"
                                      alt="Traveler Avatar"
                                    />
                                    <span className="text-xs font-semibold text-slate-700">Sarah M.</span>
                                  </div>
                                </td>
                                <td className="py-4 text-center">
                                  <span className="inline-block text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                                    Delivered
                                  </span>
                                </td>
                                <td className="py-4 text-xs font-semibold text-slate-500">20 May, 11:20 AM</td>
                                <td className="py-4 text-right text-xs font-extrabold text-slate-800">$35.00</td>
                                <td className="py-4 text-center text-slate-400 hover:text-slate-600 cursor-pointer">
                                  <MoreHorizontal size={14} />
                                </td>
                              </tr>

                              {/* Entry 4 */}
                              <tr className="hover:bg-slate-50/40 transition-colors">
                                <td className="py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-100">
                                      <Briefcase size={15} />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold text-slate-800">FLY123453</span>
                                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Gifts</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                    <span>Sydney (Australia)</span>
                                    <ArrowRight size={11} className="text-slate-400" />
                                    <span>Auckland (NZ)</span>
                                  </div>
                                </td>
                                <td className="py-4">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120"
                                      className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-100"
                                      alt="Traveler Avatar"
                                    />
                                    <span className="text-xs font-semibold text-slate-700">Michael T.</span>
                                  </div>
                                </td>
                                <td className="py-4 text-center">
                                  <span className="inline-block text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                                    Pending
                                  </span>
                                </td>
                                <td className="py-4 text-xs font-semibold text-slate-500">—</td>
                                <td className="py-4 text-right text-xs font-extrabold text-slate-800">$52.10</td>
                                <td className="py-4 text-center text-slate-400 hover:text-slate-600 cursor-pointer">
                                  <MoreHorizontal size={14} />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>

                    {/* Right Column (1/3) */}
                    <div className="space-y-8">

                      {/* Find a Traveler Card */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between h-[190px]">
                        <div className="space-y-1.5 z-10">
                          <h4 className="text-sm font-black text-flyora-navy">Find a Traveler</h4>
                          <p className="text-xs text-slate-500 leading-relaxed max-w-[150px]">Find verified travelers on your route.</p>
                        </div>
                        <button
                          onClick={() => setActiveTab('matches')}
                          className="bg-flyora-teal hover:bg-flyora-teal-dark text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm z-10 w-fit"
                        >
                          Search Now
                        </button>
                        {/* Suitcase and luggage graphic elements */}
                        <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-end justify-end p-2 opacity-90">
                          <div className="w-24 h-24 bg-gradient-to-br from-flyora-teal/10 to-teal-50 rounded-3xl border border-teal-100/50 flex items-center justify-center transform rotate-6">
                            <Plane size={36} className="text-flyora-teal transform -rotate-45" />
                          </div>
                        </div>
                      </div>

                      {/* Popular Routes list */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-flyora-navy uppercase tracking-wider">Popular Routes</h4>
                          <button
                            onClick={() => alert('All routes are currently active.')}
                            className="text-xs font-bold text-flyora-teal hover:underline"
                          >
                            View All
                          </button>
                        </div>

                        <div className="space-y-3.5">
                          {/* Route 1 */}
                          <div className="flex items-center justify-between hover:bg-slate-50/50 p-1.5 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="text-sm">🇺🇸</span>
                              <ArrowRight size={11} className="text-slate-400" />
                              <span className="text-sm">🇬🇧</span>
                              <span className="text-xs font-bold text-slate-800">USA ↔ UK</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">128+ Trips</span>
                          </div>

                          {/* Route 2 */}
                          <div className="flex items-center justify-between hover:bg-slate-50/50 p-1.5 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="text-sm">🇮🇳</span>
                              <ArrowRight size={11} className="text-slate-400" />
                              <span className="text-sm">🇺🇸</span>
                              <span className="text-xs font-bold text-slate-800">India ↔ USA</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">96+ Trips</span>
                          </div>

                          {/* Route 3 */}
                          <div className="flex items-center justify-between hover:bg-slate-50/50 p-1.5 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="text-sm">🇦🇪</span>
                              <ArrowRight size={11} className="text-slate-400" />
                              <span className="text-sm">🇮🇳</span>
                              <span className="text-xs font-bold text-slate-800">UAE ↔ India</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">74+ Trips</span>
                          </div>

                          {/* Route 4 */}
                          <div className="flex items-center justify-between hover:bg-slate-50/50 p-1.5 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="text-sm">🇨🇦</span>
                              <ArrowRight size={11} className="text-slate-400" />
                              <span className="text-sm">🇬🇧</span>
                              <span className="text-xs font-bold text-slate-800">Canada ↔ UK</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">62+ Trips</span>
                          </div>
                        </div>
                      </div>

                      {/* Notifications feed widget */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-flyora-navy uppercase tracking-wider">Notifications</h4>
                          <button
                            onClick={() => alert('No older notifications.')}
                            className="text-xs font-bold text-flyora-teal hover:underline"
                          >
                            View All
                          </button>
                        </div>

                        <div className="space-y-4">
                          {/* Item 1 */}
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100/50">
                              <Check size={14} />
                            </div>
                            <div className="flex-1 space-y-0.5">
                              <p className="text-xs font-semibold text-slate-700 leading-normal">Your package has been picked up by John D.</p>
                              <span className="text-[10px] text-slate-400 font-medium">2m ago</span>
                            </div>
                          </div>

                          {/* Item 2 */}
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100/50">
                              <Plane size={14} className="transform -rotate-45" />
                            </div>
                            <div className="flex-1 space-y-0.5">
                              <p className="text-xs font-semibold text-slate-700 leading-normal">Package is in transit to London (UK).</p>
                              <span className="text-[10px] text-slate-400 font-medium">1h ago</span>
                            </div>
                          </div>

                          {/* Item 3 */}
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100/50">
                              <Lock size={14} />
                            </div>
                            <div className="flex-1 space-y-0.5">
                              <p className="text-xs font-semibold text-slate-700 leading-normal">Your payment of $45.60 is secure in escrow.</p>
                              <span className="text-[10px] text-slate-400 font-medium">2h ago</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Flyora for Travelers banner */}
                      <div className="bg-gradient-to-br from-flyora-navy to-flyora-navy-light text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between h-[180px]">
                        <div className="space-y-2 z-10">
                          <span className="text-[10px] font-black text-flyora-teal uppercase tracking-wider">Flyora for Travelers</span>
                          <h4 className="text-sm font-black leading-snug max-w-[160px]">Earn money by carrying packages on your trips.</h4>
                        </div>
                        <button
                          onClick={() => { setActiveTab('trips'); setTripSubView('dashboard'); }}
                          className="bg-flyora-teal hover:bg-flyora-teal-bright text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm z-10 w-fit"
                        >
                          Traveller
                        </button>
                        <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-10 flex items-center justify-center pointer-events-none">
                          <Plane size={96} className="transform -rotate-45" />
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* TAB 2: MY TRIPS */}
              {activeTab === 'trips' && (
                <div className="space-y-6 animate-fade-in">
                  {tripSubView === 'dashboard' ? (
                    <div className="space-y-8">
                      {/* Greeting Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h1 className="text-2xl font-black text-flyora-navy">Welcome back, {profileName}! 👋</h1>
                          <p className="text-xs text-slate-500 mt-1">Manage your travel plans, requests, and track your journey.</p>
                        </div>
                        <Button
                          variant="teal"
                          className="flex items-center gap-1.5 px-6 py-2.5 self-start sm:self-auto shadow-teal font-bold text-xs"
                          onClick={() => setTripSubView('create')}
                        >
                          <PlusCircle size={16} />
                          Create Trip
                        </Button>
                      </div>

                      {/* Top Stats Section: Green card + 4 stat cards */}
                      <div className="space-y-6">
                        {/* Green Card: TOTAL EARNINGS */}
                        <div className="w-full bg-gradient-to-br from-flyora-teal via-flyora-teal-bright to-emerald-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-44">
                          <div className="z-10">
                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider block">TOTAL EARNINGS</span>
                            <h2 className="text-3xl font-black mt-2">0 XOF</h2>
                            <p className="text-xs text-white/70 mt-1">≈ ₹0.00 INR</p>
                          </div>
                          <div className="flex justify-between items-end z-10">
                            <span className="text-[10px] bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-lg font-bold">Active Wallet</span>
                            <CreditCard size={28} className="opacity-90" />
                          </div>
                          {/* Decorative pattern */}
                          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 -z-0 clip-path-diagonal pointer-events-none" />
                        </div>

                        {/* 4 Stat Cards Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {/* Card 1: TOTAL TRIPS */}
                          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-36">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TOTAL TRIPS</span>
                            <div>
                              <span className="text-3xl font-black text-slate-800">0</span>
                              <span className="text-[10px] font-semibold text-slate-400 block mt-1">Completed</span>
                            </div>
                          </div>
                          {/* Card 2: PENDING REQUESTS */}
                          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-36">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PENDING REQUESTS</span>
                            <div>
                              <span className="text-3xl font-black text-slate-800">0</span>
                              <span className="text-[10px] font-semibold text-slate-400 block mt-1">Awaiting Response</span>
                            </div>
                          </div>
                          {/* Card 3: ACTIVE ROUTES */}
                          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-36">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ACTIVE ROUTES</span>
                            <div>
                              <span className="text-3xl font-black text-slate-800">{trips.filter(t => t.status === 'ACTIVE').length || 1}</span>
                              <span className="text-[10px] font-semibold text-flyora-teal block mt-1">In Progress</span>
                            </div>
                          </div>
                          {/* Card 4: POSITIVE REVIEWS */}
                          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-36">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">POSITIVE REVIEWS</span>
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-800">0</span>
                                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">0%</span>
                              </div>
                              <span className="text-[10px] font-semibold text-slate-400 block mt-1">From Senders</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Columns Layout: Active Trip & Recent Activity */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Column 1: My Active Trip */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-flyora-navy uppercase tracking-wider">My Active Trip</h3>
                            <button
                              onClick={() => setTripSubView('list')}
                              className="text-xs font-bold text-flyora-teal hover:underline bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100"
                            >
                              View All
                            </button>
                          </div>

                          {/* Render dynamic or mock active trip */}
                          {trips.length > 0 ? (
                            (() => {
                              const activeTrip = trips.find(t => t.status === 'ACTIVE') || trips[0];
                              return (
                                <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 space-y-4 relative overflow-hidden">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 bg-teal-50 text-flyora-teal rounded-lg flex items-center justify-center border border-teal-100">
                                        <Plane size={14} className="transform -rotate-45" />
                                      </div>
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                        • ACTIVE
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-bold">Trip ID: #{activeTrip.id.substring(0, 8).toUpperCase()}</span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-extrabold text-flyora-navy uppercase">{activeTrip.fromCity}</span>
                                    <ArrowRight size={14} className="text-slate-400" />
                                    <span className="text-sm font-extrabold text-flyora-navy uppercase">{activeTrip.toCity}</span>
                                  </div>

                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
                                    <div>
                                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Departure</span>
                                      <span className="text-[11px] font-bold text-slate-700 block mt-0.5">{new Date(activeTrip.travelDate).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Arrival</span>
                                      <span className="text-[11px] font-bold text-slate-700 block mt-0.5">{new Date(activeTrip.travelDate).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Baggage Allowance</span>
                                      <span className="text-[11px] font-bold text-slate-700 block mt-0.5">{activeTrip.availableWeight} kg</span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Rate per kg</span>
                                      <span className="text-[11px] font-bold text-slate-700 block mt-0.5">${activeTrip.pricePerKg}</span>
                                    </div>
                                  </div>

                                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-extrabold text-flyora-teal block">Flight UA904</span>
                                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5 italic">"{activeTrip.description || 'Accept documents, laptop, clothes. Safe cargo only.'}"</p>
                                  </div>

                                  <div className="flex gap-3 justify-end">
                                    <button
                                      onClick={() => { setSelectedTrip(activeTrip); setTripSubView('edit'); }}
                                      className="bg-flyora-teal hover:bg-flyora-teal-dark text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                                    >
                                      Edit Trip
                                    </button>
                                  </div>
                                </div>
                              );
                            })()
                          ) : (
                            <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 space-y-4 relative overflow-hidden">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-teal-50 text-flyora-teal rounded-lg flex items-center justify-center border border-teal-100">
                                    <Plane size={14} className="transform -rotate-45" />
                                  </div>
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    • ACTIVE
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold">Trip ID: #TRP-159</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-sm font-extrabold text-flyora-navy uppercase">Ahmedabad, Gujarat, India</span>
                                <ArrowRight size={14} className="text-slate-400" />
                                <span className="text-sm font-extrabold text-flyora-navy uppercase">Rajkot, Gujarat, India</span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
                                <div>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Departure</span>
                                  <span className="text-[11px] font-bold text-slate-700 block mt-0.5">24 May 2025, 10:00 AM</span>
                                </div>
                                <div>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Arrival</span>
                                  <span className="text-[11px] font-bold text-slate-700 block mt-0.5">24 May 2025, 01:00 PM</span>
                                </div>
                                <div>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Baggage Allowance</span>
                                  <span className="text-[11px] font-bold text-slate-700 block mt-0.5">15 kg</span>
                                </div>
                                <div>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Rate per kg</span>
                                  <span className="text-[11px] font-bold text-slate-700 block mt-0.5">$10</span>
                                </div>
                              </div>

                              <div className="bg-white p-3 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-extrabold text-flyora-teal block">Flight UA904</span>
                                <p className="text-[10px] text-slate-500 leading-normal mt-0.5 italic">"Accept documents, laptop, clothes. Safe cargo only."</p>
                              </div>

                              <div className="flex gap-3 justify-end">
                                <button
                                  onClick={() => setTripSubView('create')}
                                  className="bg-flyora-teal hover:bg-flyora-teal-dark text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                                >
                                  Edit Trip
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Column 2: Recent Activity */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-flyora-navy uppercase tracking-wider">Recent Activity</h3>
                            <button
                              onClick={() => alert('No older activity records.')}
                              className="text-xs font-bold text-flyora-teal hover:underline bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100"
                            >
                              View All
                            </button>
                          </div>

                          <div className="space-y-4">
                            {/* Item 1 */}
                            <div className="flex gap-3 items-center hover:bg-slate-50 p-2 rounded-xl transition-colors">
                              <div className="w-8 h-8 rounded-lg bg-teal-50 text-flyora-teal flex items-center justify-center shrink-0 border border-teal-100/50">
                                <Plane size={14} className="transform -rotate-45" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-700 truncate">Trip Created</p>
                                <span className="text-[10px] text-slate-400 font-semibold block">Ahmedabad ➔ Rajkot</span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[9px] text-slate-400 block font-semibold">2 hours ago</span>
                                <span className="text-[9px] font-extrabold text-emerald-500 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
                              </div>
                            </div>

                            {/* Item 2 */}
                            <div className="flex gap-3 items-center hover:bg-slate-50 p-2 rounded-xl transition-colors">
                              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100/50">
                                <CreditCard size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-700 truncate">Earnings Updated</p>
                                <span className="text-[10px] text-slate-400 font-semibold block">You earned 0 XOF</span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[9px] text-slate-400 block font-semibold">2 hours ago</span>
                              </div>
                            </div>

                            {/* Item 3 */}
                            <div className="flex gap-3 items-center hover:bg-slate-50 p-2 rounded-xl transition-colors">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100/50">
                                <MessageSquare size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-700 truncate">New Message</p>
                                <span className="text-[10px] text-slate-400 font-semibold block">You have a new message</span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[9px] text-slate-400 block font-semibold">5 hours ago</span>
                              </div>
                            </div>

                            {/* Item 4 */}
                            <div className="flex gap-3 items-center hover:bg-slate-50 p-2 rounded-xl transition-colors">
                              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100/50">
                                <User size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-700 truncate">Profile Updated</p>
                                <span className="text-[10px] text-slate-400 font-semibold block">Your profile information was updated</span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[9px] text-slate-400 block font-semibold">1 day ago</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  ) : tripSubView === 'list' ? (
                    <>
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                          <h1 className="text-xl font-black text-flyora-navy">Registered Trips</h1>
                          <p className="text-xs text-slate-500 mt-1">Add your upcoming flights to deposit luggage capacity and secure shipping rewards.</p>
                        </div>

                        <Button variant="teal" size="sm" className="flex items-center gap-1.5" onClick={() => setTripSubView('create')}>
                          <PlusCircle size={14} />
                          Register Trip
                        </Button>
                      </div>

                      {trips.length === 0 ? (
                        <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400 font-semibold space-y-2.5 bg-white">
                          <Plane size={32} className="mx-auto text-slate-300 transform -rotate-45" />
                          <p>You have no active travel records registered yet.</p>
                          <Button variant="secondary" size="sm" onClick={() => setTripSubView('create')}>Add your first trip</Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {trips.map(trip => (
                            <div key={trip.id} className="border border-slate-100 rounded-2xl p-5 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white shadow-sm">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-teal-50 text-flyora-teal rounded-xl flex items-center justify-center shrink-0 border border-teal-100">
                                  <Plane size={18} className="transform -rotate-45" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-sm text-flyora-navy uppercase">{trip.fromCity}</span>
                                    <span className="text-slate-400 text-xs">➔</span>
                                    <span className="font-extrabold text-sm text-flyora-navy uppercase">{trip.toCity}</span>
                                  </div>

                                  <div className="text-[10px] text-slate-500 font-bold flex flex-wrap items-center gap-x-4 gap-y-1">
                                    <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(trip.travelDate).toLocaleDateString()}</span>
                                    <span>Capacity: {trip.availableWeight} kg</span>
                                    <span>Rate: ${trip.pricePerKg}/kg</span>
                                  </div>

                                  {trip.description && <p className="text-[10px] text-slate-400 leading-normal italic">"{trip.description}"</p>}
                                </div>
                              </div>

                              <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
                                <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 mr-2">
                                  {trip.status}
                                </span>
                                <button
                                  onClick={() => { setSelectedTrip(trip); setTripSubView('edit'); }}
                                  className="text-xs font-bold text-flyora-teal hover:underline border border-teal-100 bg-white hover:bg-teal-50/30 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteTrip(trip.id)}
                                  className="text-xs font-bold text-rose-500 hover:underline border border-rose-100 bg-white hover:bg-rose-50/30 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                          <h1 className="text-lg font-black text-flyora-navy">
                            {tripSubView === 'edit' ? 'Edit Travel Flight Route' : 'Register Travel Flight Route'}
                          </h1>
                          <p className="text-xs text-slate-500 mt-1">Specify baggage capacity details for the route.</p>
                        </div>
                        <button
                          onClick={() => { setTripSubView('list'); setSelectedTrip(null); }}
                          className="text-xs font-bold text-slate-400 hover:text-slate-600"
                        >
                          ← Cancel
                        </button>
                      </div>

                      <form className="space-y-4 max-w-lg" onSubmit={handleCreateTrip}>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">From City</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. New York"
                              value={tripFrom}
                              onChange={(e) => setTripFrom(e.target.value)}
                              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">To City</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. London"
                              value={tripTo}
                              onChange={(e) => setTripTo(e.target.value)}
                              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Flight Travel Date</label>
                          <input
                            type="date"
                            required
                            value={tripDate}
                            onChange={(e) => setTripDate(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Available Baggage (kg)</label>
                            <input
                              type="number"
                              required
                              placeholder="e.g. 15"
                              min="1"
                              value={tripWeight}
                              onChange={(e) => setTripWeight(e.target.value)}
                              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Rate per kg (USD)</label>
                            <input
                              type="number"
                              required
                              placeholder="e.g. 10"
                              min="1"
                              value={tripPrice}
                              onChange={(e) => setTripPrice(e.target.value)}
                              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Flight/Baggage Description</label>
                          <textarea
                            placeholder="e.g. Flight UA904. Accept documents, laptop, clothes. Safe cargo only."
                            value={tripDesc}
                            onChange={(e) => setTripDesc(e.target.value)}
                            className="w-full h-24 px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 resize-none bg-white"
                          />
                        </div>

                        <div className="flex gap-3 justify-end pt-3">
                          <Button variant="secondary" type="button" onClick={() => { setTripSubView('list'); setSelectedTrip(null); }}>
                            Cancel
                          </Button>
                          <Button variant="teal" type="submit" disabled={modalLoading}>
                            {modalLoading ? 'Saving...' : tripSubView === 'edit' ? 'Update Trip' : 'Register Trip'}
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MY SHIPMENTS */}
              {activeTab === 'shipments' && (
                <div className="space-y-6 animate-fade-in">
                  {shipmentSubView === 'dashboard' ? (
                    <div className="space-y-8 animate-fade-in">
                      {/* Greeting Header */}
                      <div>
                        <h1 className="text-2xl font-black text-flyora-navy">Welcome back, {profileName}! 👋</h1>
                        <p className="text-xs text-slate-500 mt-1">Manage your shipments and connect with verified travelers worldwide.</p>
                      </div>

                      {/* Top Stats Section: Green card + 4 stat cards */}
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Green Card: SENDER - SEND A PACKAGE */}
                        <div className="xl:col-span-1 bg-gradient-to-br from-flyora-teal via-flyora-teal-bright to-emerald-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-44">
                          <div className="z-10">
                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider block">SENDER</span>
                            <h2 className="text-2xl font-black mt-2">SEND A PACKAGE</h2>
                            <p className="text-xs text-white/70 mt-1">Find trusted travelers worldwide</p>
                          </div>
                          <div className="flex justify-between items-end z-10">
                            <span className="text-[10px] bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-lg font-bold">Secure Delivery</span>
                            <Briefcase size={28} className="opacity-90" />
                          </div>
                          {/* Decorative pattern */}
                          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 -z-0 clip-path-diagonal pointer-events-none" />
                        </div>

                        {/* 4 Stat Cards Grid */}
                        <div className="xl:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {/* Card 1: TOTAL REQUESTS */}
                          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-44">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TOTAL REQUESTS</span>
                            <div>
                              <span className="text-3xl font-black text-slate-800">{shipments.length || '00'}</span>
                              <span className="text-[10px] font-semibold text-slate-400 block mt-1">All Time</span>
                            </div>
                          </div>
                          {/* Card 2: IN TRANSIT */}
                          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-44">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">IN TRANSIT</span>
                            <div>
                              <span className="text-3xl font-black text-slate-800">{shipments.filter(s => s.status === 'MATCHED').length || '00'}</span>
                              <span className="text-[10px] font-semibold text-slate-400 block mt-1">Currently Moving</span>
                            </div>
                          </div>
                          {/* Card 3: DELIVERED */}
                          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-44">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DELIVERED</span>
                            <div>
                              <span className="text-3xl font-black text-slate-800">{shipments.filter(s => s.status === 'DELIVERED').length || '00'}</span>
                              <span className="text-[10px] font-semibold text-slate-400 block mt-1">Successfully</span>
                            </div>
                          </div>
                          {/* Card 4: PENDING */}
                          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-44">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PENDING</span>
                            <div>
                              <span className="text-3xl font-black text-slate-800">{shipments.filter(s => s.status === 'PENDING').length || '00'}</span>
                              <span className="text-[10px] font-semibold text-slate-400 block mt-1">Awaiting Response</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Search Bar / Create Bar */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative flex-1 w-full">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            type="text"
                            placeholder="Search routes, travelers, or package requests..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 focus:bg-white transition-all"
                          />
                        </div>
                        <button
                          onClick={() => setShipmentSubView('create')}
                          className="w-full sm:w-auto bg-flyora-teal hover:bg-flyora-teal-dark text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0"
                        >
                          <Plus size={14} /> Create Request
                        </button>
                      </div>

                      {/* Package Requests List Box */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                          <div>
                            <h3 className="text-sm font-black text-flyora-navy uppercase tracking-wider">Package Requests</h3>
                            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Track your requests and their status</p>
                          </div>
                          <button
                            onClick={() => setShipmentSubView('list')}
                            className="text-xs font-bold text-slate-400 hover:text-slate-600 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1 bg-white hover:bg-slate-50 transition-all"
                          >
                            <span>Filter</span>
                            <ChevronDown size={12} />
                          </button>
                        </div>

                        {shipments.length === 0 ? (
                          <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400 font-semibold space-y-4 bg-slate-50/20 max-w-2xl mx-auto">
                            <div className="w-12 h-12 bg-white rounded-full border border-slate-200/80 flex items-center justify-center mx-auto text-slate-400">
                              <Briefcase size={20} />
                            </div>
                            <div className="space-y-1">
                              <p className="text-slate-800 font-bold">No Package Requests Found</p>
                              <p className="text-[10px] text-slate-400 font-medium">You haven't created any package requests yet. Click the button below to send your first package.</p>
                            </div>
                            <button
                              onClick={() => setShipmentSubView('create')}
                              className="bg-flyora-teal hover:bg-flyora-teal-dark text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm mx-auto"
                            >
                              + Create Your First Request
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {shipments.map(ship => (
                              <div key={ship.id} className="border border-slate-100 rounded-2xl p-5 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white shadow-sm">
                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0 border border-purple-100">
                                    <Briefcase size={18} />
                                  </div>
                                  <div className="space-y-1">
                                    <h4 className="font-extrabold text-sm text-flyora-navy">{ship.title}</h4>

                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                      <span className="uppercase">{ship.fromCity}</span>
                                      <span className="text-slate-400 text-[10px]">➔</span>
                                      <span className="uppercase">{ship.toCity}</span>
                                    </div>

                                    <div className="text-[10px] text-slate-500 font-bold flex flex-wrap items-center gap-x-4 gap-y-1">
                                      <span className="flex items-center gap-1"><Calendar size={11} /> Deadline: {new Date(ship.deliveryDeadline).toLocaleDateString()}</span>
                                      <span>Weight: {ship.weight} kg</span>
                                      <span className="text-purple-600">Category: {ship.category}</span>
                                    </div>

                                    <div className="text-[10px] font-black text-flyora-teal">Reward Offered: ${ship.pricePaid}</div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
                                  <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 mr-2">
                                    {ship.status}
                                  </span>

                                  {ship.status === 'PENDING' && (
                                    <button
                                      onClick={() => simulatePayout(ship.pricePaid, ship.title)}
                                      className="text-xs font-bold text-flyora-teal hover:underline border border-teal-100 bg-white hover:bg-teal-50/30 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                                    >
                                      Release Payout
                                    </button>
                                  )}
                                  <button
                                    onClick={() => { setSelectedShipment(ship); setShipmentSubView('edit'); }}
                                    className="text-xs font-bold text-slate-600 hover:underline border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteShipment(ship.id)}
                                    className="text-xs font-bold text-rose-500 hover:underline border border-rose-100 bg-white hover:bg-rose-50/30 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Four Bottom Micro Info Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
                          <div className="w-10 h-10 bg-teal-50 text-flyora-teal rounded-xl flex items-center justify-center shrink-0 border border-teal-100">
                            <Plane size={18} className="transform -rotate-45" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-800">Global Network</h4>
                            <p className="text-[10px] text-slate-400 leading-normal mt-1">Connect with verified travelers in 190+ countries.</p>
                          </div>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                            <ShieldCheck size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-800">Secure & Safe</h4>
                            <p className="text-[10px] text-slate-400 leading-normal mt-1">Your packages are insured and 100% protected.</p>
                          </div>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
                          <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0 border border-amber-100">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-800">Real-time Tracking</h4>
                            <p className="text-[10px] text-slate-400 leading-normal mt-1">Track your package in real-time from pickup to delivery.</p>
                          </div>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
                          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0 border border-purple-100">
                            <HelpCircle size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-800">24/7 Support</h4>
                            <p className="text-[10px] text-slate-400 leading-normal mt-1">Our support team is always here to help you.</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  ) : shipmentSubView === 'list' ? (
                    <>
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                          <h1 className="text-xl font-black text-flyora-navy">Shipment Requests</h1>
                          <p className="text-xs text-slate-500 mt-1">Post requests for parcels you want delivered. Rewards are locked in Escrow.</p>
                        </div>

                        <Button variant="teal" size="sm" className="flex items-center gap-1.5" onClick={() => setShipmentSubView('create')}>
                          <PlusCircle size={14} />
                          Post Request
                        </Button>
                      </div>

                      {shipments.length === 0 ? (
                        <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400 font-semibold space-y-2.5 bg-white">
                          <List size={32} className="mx-auto text-slate-300" />
                          <p>You have no shipment requests created yet.</p>
                          <Button variant="secondary" size="sm" onClick={() => setShipmentSubView('create')}>Post your first request</Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {shipments.map(ship => (
                            <div key={ship.id} className="border border-slate-100 rounded-2xl p-5 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white shadow-sm">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0 border border-purple-100">
                                  <List size={18} />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="font-extrabold text-sm text-flyora-navy">{ship.title}</h4>

                                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                    <span className="uppercase">{ship.fromCity}</span>
                                    <span className="text-slate-400 text-[10px]">➔</span>
                                    <span className="uppercase">{ship.toCity}</span>
                                  </div>

                                  <div className="text-[10px] text-slate-500 font-bold flex flex-wrap items-center gap-x-4 gap-y-1">
                                    <span className="flex items-center gap-1"><Calendar size={11} /> Deadline: {new Date(ship.deliveryDeadline).toLocaleDateString()}</span>
                                    <span>Weight: {ship.weight} kg</span>
                                    <span className="text-purple-600">Category: {ship.category}</span>
                                  </div>

                                  <div className="text-[10px] font-black text-flyora-teal">Reward Offered: ${ship.pricePaid}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
                                <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 mr-2">
                                  {ship.status}
                                </span>

                                {ship.status === 'PENDING' && (
                                  <button
                                    onClick={() => simulatePayout(ship.pricePaid, ship.title)}
                                    className="text-xs font-bold text-flyora-teal hover:underline border border-teal-100 bg-white hover:bg-teal-50/30 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                                  >
                                    Release Payout
                                  </button>
                                )}
                                <button
                                  onClick={() => { setSelectedShipment(ship); setShipmentSubView('edit'); }}
                                  className="text-xs font-bold text-slate-600 hover:underline border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteShipment(ship.id)}
                                  className="text-xs font-bold text-rose-500 hover:underline border border-rose-100 bg-white hover:bg-rose-50/30 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                          <h1 className="text-lg font-black text-flyora-navy">
                            {shipmentSubView === 'edit' ? 'Edit Parcel Shipment Request' : 'Post Parcel Shipment Request'}
                          </h1>
                          <p className="text-xs text-slate-500 mt-1">Specify package and delivery reward details.</p>
                        </div>
                        <button
                          onClick={() => { setShipmentSubView('list'); setSelectedShipment(null); }}
                          className="text-xs font-bold text-slate-400 hover:text-slate-600"
                        >
                          ← Cancel
                        </button>
                      </div>

                      <form className="space-y-4 max-w-lg" onSubmit={handleCreateShipment}>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Item Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Urgent Business Documents"
                            value={shipTitle}
                            onChange={(e) => setShipTitle(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                            <select
                              value={shipCategory}
                              onChange={(e) => setShipCategory(e.target.value as any)}
                              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                            >
                              <option value="documents">Documents</option>
                              <option value="electronics">Electronics</option>
                              <option value="clothing">Clothing</option>
                              <option value="food">Food</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Weight (kg)</label>
                            <input
                              type="number"
                              required
                              placeholder="e.g. 2"
                              min="1"
                              value={shipWeight}
                              onChange={(e) => setShipWeight(e.target.value)}
                              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">From City</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. New York"
                              value={shipFrom}
                              onChange={(e) => setShipFrom(e.target.value)}
                              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">To City</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. London"
                              value={shipTo}
                              onChange={(e) => setShipTo(e.target.value)}
                              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Reward Offered (USD)</label>
                            <input
                              type="number"
                              required
                              placeholder="e.g. 50"
                              min="1"
                              value={shipPrice}
                              onChange={(e) => setShipPrice(e.target.value)}
                              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Delivery Deadline</label>
                            <input
                              type="date"
                              required
                              value={shipDeadline}
                              onChange={(e) => setShipDeadline(e.target.value)}
                              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Item Description & Instructions</label>
                          <textarea
                            placeholder="e.g. 1 envelope containing legal paperwork. Original documents. Needs to be dropped at Heathrow T5."
                            required
                            value={shipDesc}
                            onChange={(e) => setShipDesc(e.target.value)}
                            className="w-full h-24 px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white resize-none"
                          />
                        </div>

                        <div className="flex gap-3 justify-end pt-3">
                          <Button variant="secondary" type="button" onClick={() => { setShipmentSubView('list'); setSelectedShipment(null); }}>
                            Cancel
                          </Button>
                          <Button variant="teal" type="submit" disabled={modalLoading}>
                            {modalLoading ? 'Saving...' : shipmentSubView === 'edit' ? 'Update Shipment' : 'Post Request'}
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SMART MATCHES */}
              {activeTab === 'matches' && overview && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h1 className="text-xl font-black text-flyora-navy">Smart Matchmaking</h1>
                      <p className="text-xs text-slate-500 mt-1">Cross-referencing traveler capacity and shipment requests on matching flight routes.</p>
                    </div>
                  </div>

                  {overview.matches.totalMatchesCount === 0 ? (
                    <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400 font-semibold space-y-2.5 bg-white shadow-sm">
                      <ArrowRightLeft size={32} className="mx-auto text-slate-300" />
                      <p>No matches available right now.</p>
                      <p className="text-[10px] text-slate-400 max-w-sm mx-auto leading-relaxed">
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
                              <div key={idx} className="border border-slate-100 rounded-2xl p-5 hover:bg-slate-50/20 transition-all flex flex-col sm:flex-row justify-between gap-4 bg-white shadow-sm">
                                <div className="space-y-2">
                                  <div className="text-[9px] font-black uppercase text-flyora-teal bg-teal-50 px-2 py-0.5 rounded-full w-fit">
                                    Matches Flight capacity: {match.tripDetails}
                                  </div>
                                  <h4 className="font-extrabold text-sm text-flyora-navy">{match.shipment?.title}</h4>
                                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">"{match.shipment?.description}"</p>

                                  <div className="text-[10px] text-slate-400 font-bold flex gap-4">
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
                              <div key={idx} className="border border-slate-100 rounded-2xl p-5 hover:bg-slate-50/20 transition-all flex flex-col sm:flex-row justify-between gap-4 bg-white shadow-sm">
                                <div className="space-y-2">
                                  <div className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                                    Matches Shipment parcel: {match.shipmentDetails}
                                  </div>
                                  <h4 className="font-extrabold text-sm text-flyora-navy uppercase">
                                    {match.trip?.fromCity} ➔ {match.trip?.toCity}
                                  </h4>
                                  <p className="text-[10px] text-slate-400 font-bold flex gap-4">
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
                <div className="space-y-8 animate-fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h1 className="text-xl font-black text-flyora-navy">Wallet & Escrow Status</h1>
                      <p className="text-xs text-slate-500 mt-1">Flyora Escrow locks payments securely until delivery is validated.</p>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-1 relative overflow-hidden shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wallet Balance</span>
                      <span className="text-2xl font-black text-slate-800 block">${overview.stats.walletBalance.toFixed(2)}</span>
                      <p className="text-[9px] text-slate-400 leading-normal pt-1">Withdrawable earnings available in your bank account.</p>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-1 relative overflow-hidden shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Baggage Escrow Balance</span>
                      <span className="text-2xl font-black text-slate-800 block">${overview.stats.escrowBalance.toFixed(2)}</span>
                      <p className="text-[9px] text-slate-400 leading-normal pt-1">Funds locked in Flyora Escrow awaiting traveler delivery completion.</p>
                    </div>
                    {/* Card 3 */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-1 relative overflow-hidden flex flex-col justify-between shadow-sm">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Compliance Level</span>
                        <span className="text-sm font-black text-flyora-teal flex items-center gap-1 mt-1"><Shield size={14} /> Level 1 (Verified)</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-normal pt-1">Identity checks passed. Payout releases processed instantly.</p>
                    </div>
                  </div>

                  {/* Transaction History */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-flyora-navy uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard size={14} className="text-flyora-teal" />
                      Transaction History
                    </h3>

                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
                      {walletHistory.map(tx => (
                        <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                          <div className="space-y-0.5 pr-4">
                            <p className="text-xs font-bold text-slate-800">{tx.description}</p>
                            <p className="text-[9px] text-slate-400">{tx.date}</p>
                          </div>
                          <span className={`text-xs font-black shrink-0 ${tx.type === 'credit' ? 'text-emerald-500' : 'text-rose-500'
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
                <div className="space-y-6 animate-fade-in">
                  <div className="pb-4 border-b border-slate-100">
                    <h1 className="text-xl font-black text-flyora-navy">Profile Settings</h1>
                    <p className="text-xs text-slate-500 mt-1">Manage user contact details, address records, and secure login details.</p>
                  </div>

                  <form className="max-w-md space-y-4" onSubmit={handleUpdateProfile}>
                    {profileMessage.text && (
                      <div className={`p-3 border rounded-xl text-xs font-bold ${profileMessage.type === 'success'
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          : 'bg-rose-50 border-rose-100 text-rose-700'
                        }`}>
                        {profileMessage.text}
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800">Full Name</label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800">Email Address</label>
                      <input
                        type="email"
                        required
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800">New Password (leave blank to keep unchanged)</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={profilePassword}
                        onChange={(e) => setProfilePassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                      />
                    </div>

                    <div className="pt-2">
                      <Button variant="teal" type="submit" disabled={profileLoading} className="px-8 py-2.5">
                        {profileLoading ? 'Saving changes...' : 'Save Profile Details'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 7: REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-6 animate-fade-in bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h1 className="text-xl font-black text-flyora-navy">Reviews & Feedback</h1>
                      <p className="text-xs text-slate-500 mt-1">Review feedback and ratings left by travellers and senders.</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full text-xs font-bold text-flyora-teal self-start sm:self-auto">
                      <Star size={14} className="fill-flyora-teal text-flyora-teal" />
                      <span>4.8 Rating (12 Reviews)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Summary Card */}
                    <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-4">
                      <h3 className="text-xs font-black text-flyora-navy uppercase tracking-wider">Rating Summary</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-slate-800">4.8</span>
                        <span className="text-xs font-bold text-slate-400">/ 5.0</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={16} className={s <= 4 ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">95% of users recommend doing business with you.</p>
                    </div>

                    {/* Breakdown Card */}
                    <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-3 md:col-span-2">
                      <h3 className="text-xs font-black text-flyora-navy uppercase tracking-wider">Rating Breakdown</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="w-12 font-bold text-slate-500">5 stars</span>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-flyora-teal w-[80%]" />
                          </div>
                          <span className="w-8 text-right text-slate-500 font-bold">10</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="w-12 font-bold text-slate-500">4 stars</span>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-flyora-teal w-[15%]" />
                          </div>
                          <span className="w-8 text-right text-slate-500 font-bold">2</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="w-12 font-bold text-slate-500">3 stars</span>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-flyora-teal w-0" />
                          </div>
                          <span className="w-8 text-right text-slate-500 font-bold">0</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-flyora-navy uppercase tracking-wider">All Reviews</h3>
                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
                      {/* Review 1 */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2.5">
                            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120" className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">John D.</span>
                              <span className="text-[10px] text-slate-400 font-semibold block">Sender • New York ➔ London</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold">2 days ago</span>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} className="text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">"Very reliable traveler! Package was handled carefully and reached ahead of schedule. Highly recommended!"</p>
                      </div>

                      {/* Review 2 */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2.5">
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120" className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Sarah M.</span>
                              <span className="text-[10px] text-slate-400 font-semibold block">Sender • Toronto ➔ New York</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold">1 week ago</span>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} className={s <= 4 ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">"Great communication and safe delivery of legal documents. Excellent escrow coordination."</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: KYC VERIFICATION */}
              {activeTab === 'kyc' && (
                <div className="space-y-6 animate-fade-in bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="pb-4 border-b border-slate-100">
                    <h1 className="text-xl font-black text-flyora-navy">KYC Identification Verification</h1>
                    <p className="text-xs text-slate-500 mt-1">Submit your identity verification documents directly from the dashboard.</p>
                  </div>
                  <KycPage isEmbedded={true} />
                </div>
              )}

            </>
          )}

        </main>

        {/* Unified footer */}
        <footer className="py-6 border-t border-slate-100 bg-white px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-medium gap-3">
            <span>© 2026 Flyora Luggage Protection. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-700 transition-colors">Safety Guidelines</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Escrow Terms</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardPage;
