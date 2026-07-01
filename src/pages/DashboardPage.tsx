import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plane, Shield, Wallet, List, User, PlusCircle, ArrowRightLeft, Calendar,
  LogOut, CheckCircle, AlertCircle, Trash2, ArrowRight, MapPin, Loader2,
  Sparkles, DollarSign, Lock, CreditCard, RefreshCw, Check, Search, Bell,
  MessageSquare, ChevronDown, Clock, Star, HelpCircle, Briefcase, Plus, Send,
  MoreHorizontal, Settings, Hourglass, Truck, ShieldCheck, ArrowUpRight, Moon, TrendingUp, TrendingDown, ArrowLeft
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
    totalShipmentsCount: number;
    totalTripsCount: number;
    completedShipmentsCount: number;
    totalSpend: number;
    walletBalance: number;
    escrowBalance: number;
    pendingCount: number;
    inTransitCount: number;
    outForDeliveryCount: number;
    deliveredCount: number;
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
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'shipments' | 'matches' | 'wallet' | 'profile' | 'reviews' | 'kyc' | 'profile_settings'>('overview');
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
  const [showFabModal, setShowFabModal] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

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

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Wallet transaction history — derived from real shipments (live data)
  const [walletHistory, setWalletHistory] = useState<{ id: number; type: string; amount: number; description: string; date: string }[]>([]);

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
      let dbTransactions: any[] = [];
      if (overviewRes.ok) {
        const oData = await overviewRes.json();
        setOverview(oData.data);
        if (oData.data?.transactions) {
          dbTransactions = oData.data.transactions;
        }
      }

      // Fetch user trips
      const tripsRes = await fetch(`${API_BASE_URL}/api/dashboard/trips/${userId}`);
      if (tripsRes.ok) {
        const tData = await tripsRes.json();
        setTrips(tData.data);
      }

      // Fetch user shipments — also used for wallet transaction history
      const shipmentsRes = await fetch(`${API_BASE_URL}/api/dashboard/shipments/${userId}`);
      if (shipmentsRes.ok) {
        const sData = await shipmentsRes.json();
        const fetchedShipments: Shipment[] = sData.data ?? [];
        setShipments(fetchedShipments);

        if (dbTransactions && dbTransactions.length > 0) {
          setWalletHistory(dbTransactions);
        } else {
          // Build live wallet transaction history from real shipments
          const liveTxns = fetchedShipments.map((s, idx) => ({
            id: idx + 1,
            type: s.status === 'DELIVERED' ? 'credit' : 'debit',
            amount: Number(s.pricePaid),
            description: s.status === 'DELIVERED'
              ? `Delivered: ${s.title} (${s.fromCity} ➔ ${s.toCity})`
              : s.status === 'CANCELLED'
                ? `Cancelled: ${s.title}`
                : `Escrow locked: ${s.title} (${s.fromCity} ➔ ${s.toCity})`,
            date: s.createdAt ? s.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
          }));
          setWalletHistory(liveTxns);
        }
      }
      await fetchNotifications();
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
            setProfileImageUrl(data.data.profileImageUrl || '');
          }
        })
        .catch(e => console.error(e));

      // Load initial notifications
      fetchNotifications();
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

  // Real Top up Action (persisted in database)
  const handleTopup = async (amount: number) => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/wallet/topup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount,
          description: 'Direct Wallet Payout Top-up'
        })
      });
      if (response.ok) {
        await fetchData();
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to top up wallet');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend');
    }
  };

  // Image Upload Action (persisted in database)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Str = reader.result as string;
      setProfileImageUrl(base64Str);

      if (!userId) return;
      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/profile/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileImageUrl: base64Str
          })
        });
        if (!response.ok) {
          alert('Failed to save profile picture to database');
        }
      } catch (err) {
        console.error(err);
        alert('Error connecting to backend');
      }
    };
    reader.readAsDataURL(file);
  };

  // Load user notifications
  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/notifications/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  // Mark single notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/notifications/mark-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    try {
      const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
      await Promise.all(unreadIds.map(id =>
        fetch(`${API_BASE_URL}/api/dashboard/notifications/mark-read`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationId: id })
        })
      ));
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 flex font-sans text-slate-800 flex-col lg:flex-row">
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
                onClick={() => { setActiveTab('trips'); setTripSubView('dashboard'); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'trips'
                  ? 'bg-slate-50 text-flyora-teal font-bold'
                  : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-800'
                  }`}
              >
                <PlusCircle size={17} className={activeTab === 'trips' ? 'text-flyora-teal' : 'text-slate-400'} />
                Traveller Hub
              </button>
              <button
                onClick={() => { setActiveTab('shipments'); setShipmentSubView('dashboard'); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'shipments'
                  ? 'bg-slate-50 text-flyora-teal font-bold'
                  : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-800'
                  }`}
              >
                <Send size={17} className={activeTab === 'shipments' ? 'text-flyora-teal' : 'text-slate-400'} />
                Sender Hub
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

          {/* Light Mode Only - no dark mode toggle */}

          {/* Need Help? Box */}
          <div className="p-4 m-4 bg-slate-50 border border-slate-200/30 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/40 flex items-center justify-center text-slate-500 shadow-sm shrink-0">
              <HelpCircle size={15} />
            </div>
            <div className="text-left">
              <h5 className="text-[11px] font-black text-slate-700">Need Help?</h5>
              <p className="text-[9px] text-slate-400 font-semibold leading-normal mt-0.5">Visit our Help Center</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ─── MOBILE TOP HEADER (only on mobile) ─── */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-100 px-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          {/* Brand Logo & Text aligned to the left */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-flyora-teal to-emerald-500 flex items-center justify-center shadow-sm">
              <Plane size={14} className="text-white transform -rotate-45" />
            </div>
            <span className="text-lg font-black text-flyora-navy">fly<span className="text-flyora-teal">orago</span></span>
          </Link>

          {/* Right: Bell + Avatar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-black text-white flex items-center justify-center border border-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="group cursor-pointer relative">
              <img
                src={profileImageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"}
                alt="Profile Avatar"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
              />
              {/* Hover dropdown on mobile */}
              <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button onClick={() => setActiveTab('profile')} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                  <User size={13} /> Profile
                </button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50/50 flex items-center gap-2">
                  <LogOut size={13} /> Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ─── DESKTOP TOP HEADER (only on lg+) ─── */}
        <header className="hidden lg:flex h-20 bg-white border-b border-slate-100 px-6 sm:px-8 items-center justify-between sticky top-0 z-30">
          {/* Left search bar */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              type="text"
              placeholder="Search travelers, trips, packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-2.5 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:bg-white transition-all focus:border-flyora-teal"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-200/50 border border-slate-300/30 px-1.5 py-0.5 rounded text-[9px] font-bold text-slate-500">
              ⌘ K
            </div>
          </div>

          {/* Right utility items */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-xl transition-all relative"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-black text-white flex items-center justify-center border border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl py-4 z-50 text-left animate-scale-up">
                  <div className="px-4 pb-2 border-b border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-[10px] font-bold text-flyora-teal hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-50 mt-1">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-[11px] text-slate-400 font-semibold">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => handleMarkAsRead(n.id)}
                          className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${!n.isRead ? 'bg-teal-50/20' : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${n.type === 'wallet' ? 'bg-amber-50 text-amber-500' :
                              n.type === 'kyc' ? 'bg-emerald-50 text-emerald-500' :
                                n.type === 'match' ? 'bg-blue-50 text-blue-500' : 'bg-slate-50 text-slate-500'
                            }`}>
                            {n.type === 'wallet' ? <Wallet size={14} /> :
                              n.type === 'kyc' ? <ShieldCheck size={14} /> :
                                n.type === 'match' ? <ArrowRightLeft size={14} /> : <Bell size={14} />}
                          </div>
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[11px] font-bold text-slate-800 truncate">{n.title}</p>
                              {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-flyora-teal shrink-0" />}
                            </div>
                            <p className="text-[10px] text-slate-450 leading-relaxed font-semibold break-words">{n.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="h-6 w-px bg-slate-100" />
            <div className="flex items-center gap-3 pl-1 group cursor-pointer relative">
              <img
                src={profileImageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"}
                alt="Profile Avatar"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-flyora-teal/30 transition-all"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800">{profileName}</span>
                <span className="text-[10px] text-slate-400 font-medium">Sender</span>
              </div>
              <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-all" />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40">
                <div className="px-4 py-2 border-b border-slate-50">
                  <p className="text-[10px] text-slate-400">Signed in as</p>
                  <p className="text-xs font-bold text-slate-800 truncate">{profileEmail}</p>
                </div>
                <button onClick={() => setActiveTab('profile')} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-2">
                  <User size={13} /> Profile Settings
                </button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50/50 transition-all flex items-center gap-2">
                  <LogOut size={13} /> Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Panels Scroll Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 pb-24 lg:pb-8">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="text-flyora-teal animate-spin mb-4" size={32} />
              <span className="text-xs text-slate-400 font-bold">Securing dashboard session...</span>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="animate-fade-in text-slate-800">

                  {/* ═══════════════════════════════════════════════ */}
                  {/* MOBILE LAYOUT (hidden on lg+) */}
                  {/* ═══════════════════════════════════════════════ */}
                  <div className="lg:hidden space-y-4">

                    {/* ─── MOBILE: Greeting ─── */}
                    <div>
                      <span className="text-xs font-semibold text-slate-500 block">Good morning, Mr {profileName.split(' ')[0]}! 👏</span>
                      <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">Welcome back!</h1>
                      <p className="text-xs text-slate-400 mt-0.5">Here's what's happening with your shipments today.</p>
                    </div>

                    {/* ─── MOBILE: Stats Chart Icon Top-right ─── */}
                    <div className="flex items-start justify-between -mt-2">
                      <div />
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                        <TrendingUp size={22} className="text-emerald-500" />
                      </div>
                    </div>

                    {/* ─── 4 Stats Cards Grid ─── */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Card 1: Total Trips */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Trips</span>
                          <div className="w-7 h-7 rounded-xl bg-teal-50 text-flyora-teal flex items-center justify-center border border-teal-100/50">
                            <Plane size={13} className="transform -rotate-45" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-2xl font-black text-slate-900">{overview?.stats?.totalTripsCount ?? 0}</span>
                          <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-teal-500">
                            <TrendingUp size={10} />
                            <span>↑ 20% from last month</span>
                          </div>
                        </div>
                        <div className="h-7 mt-2 opacity-70">
                          <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0,18 Q15,10 30,15 T60,5 T90,15 T100,10" fill="none" stroke="#0d9488" strokeWidth="1.5" />
                          </svg>
                        </div>
                      </div>

                      {/* Card 2: Total Parcels */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Parcels</span>
                          <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100/50">
                            <Briefcase size={13} />
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-2xl font-black text-slate-900">{overview?.stats?.totalShipmentsCount ?? 0}</span>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100/50 ml-1">Live</span>
                        </div>
                        <div className="h-7 mt-2 opacity-70">
                          <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0,15 Q20,18 40,8 T70,12 T100,5" fill="none" stroke="#10b981" strokeWidth="1.5" />
                          </svg>
                        </div>
                      </div>

                      {/* Card 3: Completed */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
                          <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center border border-purple-100/50">
                            <CheckCircle size={13} />
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-2xl font-black text-slate-900">{overview?.stats?.completedShipmentsCount ?? 0}</span>
                          <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-emerald-500">
                            <TrendingUp size={10} />
                            <span>↑ 14% from last month</span>
                          </div>
                        </div>
                        <div className="h-7 mt-2 opacity-70">
                          <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0,18 Q25,8 50,15 T75,5 T100,10" fill="none" stroke="#10b981" strokeWidth="1.5" />
                          </svg>
                        </div>
                      </div>

                      {/* Card 4: Total Spent */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Spent</span>
                          <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100/50">
                            <Wallet size={13} />
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-2xl font-black text-slate-900">
                            ${overview?.stats?.totalSpend !== undefined ? overview.stats.totalSpend.toFixed(2) : '0.00'}
                          </span>
                          <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-rose-500">
                            <TrendingDown size={10} />
                            <span>↓ 8% from last month</span>
                          </div>
                        </div>
                        <div className="h-7 mt-2 opacity-70">
                          <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0,15 Q20,18 40,10 T80,15 T100,5" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* ─── Shipment Status Overview ─── */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-black text-slate-900">Shipment Status Overview</h2>
                        <button onClick={() => { setActiveTab('shipments'); setShipmentSubView('list'); }} className="text-xs font-bold text-flyora-teal">
                          View All
                        </button>
                      </div>

                      {/* Status Checkpoint Pipeline */}
                      <div className="relative flex items-center justify-between w-full mb-4">
                        <div className="absolute left-5 right-5 top-5 h-0.5 bg-slate-100 z-0" />
                        {/* Pending */}
                        <div className="flex flex-col items-center gap-1.5 z-10">
                          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 border-2 border-amber-300 flex items-center justify-center shadow-sm">
                            <Hourglass size={14} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">Pending</span>
                          <span className="text-xs font-black text-slate-800">{overview?.stats?.pendingCount ?? 0}</span>
                        </div>
                        {/* In Transit */}
                        <div className="flex flex-col items-center gap-1.5 z-10">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 border-2 border-blue-300 flex items-center justify-center shadow-sm">
                            <Plane size={14} className="transform -rotate-45" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">In Transit</span>
                          <span className="text-xs font-black text-slate-800">{overview?.stats?.inTransitCount ?? 0}</span>
                        </div>
                        {/* Out for Delivery */}
                        <div className="flex flex-col items-center gap-1.5 z-10">
                          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 border-2 border-purple-300 flex items-center justify-center shadow-sm">
                            <Truck size={14} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">Out for Delivery</span>
                          <span className="text-xs font-black text-slate-800">{overview?.stats?.outForDeliveryCount ?? 0}</span>
                        </div>
                        {/* Delivered */}
                        <div className="flex flex-col items-center gap-1.5 z-10">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 border-2 border-emerald-300 flex items-center justify-center shadow-sm">
                            <Check size={14} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">Delivered</span>
                          <span className="text-xs font-black text-slate-800">{overview?.stats?.deliveredCount ?? 0}</span>
                        </div>
                      </div>

                      {/* Map Visual */}
                      <div className="relative w-full h-40 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-40 dotted-world-map select-none pointer-events-none" />
                        <div className="absolute top-[28%] left-[20%] z-20">
                          <span className="absolute inline-flex h-4 w-4 rounded-full bg-amber-400 opacity-75 animate-ping" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                        </div>
                        <div className="absolute top-[22%] left-[45%] z-20">
                          <span className="absolute inline-flex h-4 w-4 rounded-full bg-blue-400 opacity-75 animate-ping" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                        </div>
                        <div className="absolute top-[44%] left-[68%] z-20">
                          <span className="absolute inline-flex h-4 w-4 rounded-full bg-purple-400 opacity-75 animate-ping" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                        </div>

                        <div className="absolute top-[70%] left-[82%] z-20">
                          <span className="absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </div>
                      </div>
                    </div>

                    {/* ─── Find a Verified Traveler ─── */}
                    <div className="bg-gradient-to-br from-[#0c1b2f] via-[#0f2a4a] to-[#1a385c] text-white rounded-2xl p-5 shadow-md relative overflow-hidden flex items-center gap-4">
                      <div className="flex-1 z-10">
                        <div className="flex items-center gap-2 mb-1">
                          <Plane size={16} className="transform -rotate-45" />
                          <h4 className="text-sm font-black tracking-tight">Find a Verified Traveler</h4>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-normal font-medium mb-3">Connect with trusted travelers worldwide.</p>
                        <button
                          onClick={() => setActiveTab('matches')}
                          className="bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 w-fit"
                        >
                          <Search size={12} />
                          Search Now
                        </button>
                      </div>
                      {/* Globe decoration */}
                      <div className="shrink-0 w-20 h-20 rounded-full border border-teal-500/30 flex items-center justify-center relative">
                        <div className="w-16 h-16 rounded-full border border-teal-400/20 border-dashed flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-teal-600/20 border border-teal-500/30 flex items-center justify-center">
                            <MapPin size={14} className="text-teal-400" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-teal-500/5 pointer-events-none" />
                    </div>

                    {/* ─── Recent Activity ─── */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-black text-slate-900">Recent Activity</h3>
                        <button onClick={() => setActiveTab('wallet')} className="text-xs font-bold text-flyora-teal">View All</button>
                      </div>
                      <div className="space-y-3">
                        {walletHistory.map((tx, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${tx.type === 'credit'
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-500'
                                : tx.description.toLowerCase().includes('wallet')
                                  ? 'bg-blue-50 border-blue-100 text-blue-500'
                                  : 'bg-amber-50 border-amber-100 text-amber-500'
                              }`}>
                              {tx.type === 'credit' ? <ArrowUpRight size={15} /> : <ArrowRightLeft size={15} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-slate-800 block truncate">{tx.description.length > 28 ? tx.description.slice(0, 28) + '...' : tx.description}</span>
                              <span className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <span className={`text-xs font-black shrink-0 ${tx.type === 'credit' ? 'text-emerald-500' : 'text-rose-500'
                              }`}>
                              {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ─── Wallet Balance ─── */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wallet Balance</span>
                        <span className="text-[10px] font-bold text-slate-400">Available Balance</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-3xl font-black text-slate-900">${(overview?.stats?.walletBalance ?? 0).toFixed(2)}</span>
                          <div className="mt-2">
                            <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                              <ShieldCheck size={10} /> Escrow Protected
                            </span>
                          </div>
                        </div>
                        <div className="h-12 w-24 opacity-70">
                          <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                            <path d="M0,25 Q20,18 40,22 T70,10 T100,18" fill="none" stroke="#10b981" strokeWidth="2" />
                          </svg>
                        </div>
                      </div>
                    </div>

                  </div>{/* END MOBILE LAYOUT */}

                  {/* ═══════════════════════════════════════════════ */}
                  {/* DESKTOP LAYOUT (hidden on mobile, shown on lg+) */}
                  {/* ═══════════════════════════════════════════════ */}
                  <div className="hidden lg:block space-y-8">

                    {/* Welcome Greeting Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Good Morning, Mr {profileName.split(' ')[0]}! 👏</span>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Welcome back to Flyora!</h1>
                        <p className="text-xs text-slate-500 mt-1">Manage your shipments, track deliveries, and explore new opportunities.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={fetchData} className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition-all shadow-sm">
                          <RefreshCw size={12} className="text-slate-400" />
                          Reload Stats
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200/50">
                          <Settings size={13} />
                          Customize
                        </button>
                      </div>
                    </div>

                    {/* 4 Stats Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Card 1: Total Trips */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-36 relative overflow-hidden group">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Trips</span>
                          <div className="w-8 h-8 rounded-xl bg-teal-50 text-flyora-teal flex items-center justify-center border border-teal-100/50">
                            <Plane size={15} className="transform -rotate-45" />
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-2xl font-black text-slate-900">{overview?.stats?.totalTripsCount ?? 0}</span>
                          <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-teal-500">
                            <TrendingUp size={11} />
                            <span>+ 20% from last month</span>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-8 opacity-70">
                          <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0,18 Q15,10 30,15 T60,5 T90,15 T100,10" fill="none" stroke="#0d9488" strokeWidth="1.5" />
                          </svg>
                        </div>
                      </div>

                      {/* Card 2: Total Parcels */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-36 relative overflow-hidden group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Parcels</span>
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100/50">Live</span>
                          </div>
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100/50">
                            <Briefcase size={15} />
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-2xl font-black text-slate-900">{overview?.stats?.totalShipmentsCount ?? 0}</span>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">Real-time parcel requests</p>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-8 opacity-70">
                          <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0,15 Q20,18 40,8 T70,12 T100,5" fill="none" stroke="#10b981" strokeWidth="1.5" />
                          </svg>
                        </div>
                      </div>

                      {/* Card 3: Completed */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-36 relative overflow-hidden group">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
                          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center border border-purple-100/50">
                            <CheckCircle size={15} />
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-2xl font-black text-slate-900">{overview?.stats?.completedShipmentsCount ?? 0}</span>
                          <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-500">
                            <TrendingUp size={11} />
                            <span>+ 14% from last month</span>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-8 opacity-70">
                          <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0,18 Q25,8 50,15 T75,5 T100,10" fill="none" stroke="#10b981" strokeWidth="1.5" />
                          </svg>
                        </div>
                      </div>

                      {/* Card 4: Total Spent */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-36 relative overflow-hidden group">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Spent</span>
                          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100/50">
                            <Wallet size={15} />
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-2xl font-black text-slate-900">
                            ${overview?.stats?.totalSpend !== undefined ? overview.stats.totalSpend.toFixed(2) : '0.00'}
                          </span>
                          <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-rose-500">
                            <TrendingDown size={11} />
                            <span>- 8% from last month</span>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-8 opacity-70">
                          <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0,15 Q20,18 40,10 T80,15 T100,5" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Main Grid: Status overview & Finder Sidebar */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                      {/* Left 2/3 Column: Shipment Status Overview & Map */}
                      <div className="xl:col-span-2 bg-white border border-slate-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden min-h-[440px]">
                        <div className="flex items-center justify-between">
                          <h2 className="text-base font-black text-slate-900 tracking-tight">Shipment Status Overview</h2>
                          <button onClick={() => { setActiveTab('shipments'); setShipmentSubView('list'); }} className="text-xs font-bold text-flyora-teal hover:underline">
                            View All
                          </button>
                        </div>

                        {/* Status Checkpoint Pipeline */}
                        <div className="relative flex items-center justify-between w-full max-w-xl mx-auto my-8">
                          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 z-0" />
                          <div className="flex flex-col items-center gap-2 z-10">
                            <span className="text-sm font-black text-slate-800">{overview?.stats?.pendingCount ?? 0}</span>
                            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 border-2 border-amber-300 flex items-center justify-center shadow-sm">
                              <Hourglass size={15} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">Pending</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 z-10">
                            <span className="text-sm font-black text-slate-800">{overview?.stats?.inTransitCount ?? 0}</span>
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 border-2 border-blue-300 flex items-center justify-center shadow-sm">
                              <Plane size={15} className="transform -rotate-45" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">In Transit</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 z-10">
                            <span className="text-sm font-black text-slate-800">{overview?.stats?.outForDeliveryCount ?? 0}</span>
                            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 border-2 border-purple-300 flex items-center justify-center shadow-sm">
                              <Truck size={15} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">Out for Delivery</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 z-10">
                            <span className="text-sm font-black text-slate-800">{overview?.stats?.deliveredCount ?? 0}</span>
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 border-2 border-emerald-300 flex items-center justify-center shadow-sm">
                              <Check size={15} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">Delivered</span>
                          </div>
                        </div>

                        {/* Map Container */}
                        <div className="relative w-full h-56 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                          <div className="absolute inset-0 opacity-40 dotted-world-map select-none pointer-events-none" />
                          <div className="absolute top-[28%] left-[20%] group cursor-pointer z-20">
                            <span className="absolute inline-flex h-4 w-4 rounded-full bg-amber-400 opacity-75 animate-ping" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                            <div className="absolute left-1/2 -translate-x-1/2 top-4 bg-slate-900 text-white text-[9px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                              New York (Pending: {overview?.stats?.pendingCount ?? 0})
                            </div>
                          </div>
                          <div className="absolute top-[22%] left-[45%] group cursor-pointer z-20">
                            <span className="absolute inline-flex h-4 w-4 rounded-full bg-blue-400 opacity-75 animate-ping" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                            <div className="absolute left-1/2 -translate-x-1/2 top-4 bg-slate-900 text-white text-[9px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                              London (In Transit: {overview?.stats?.inTransitCount ?? 0})
                            </div>
                          </div>
                          <div className="absolute top-[44%] left-[68%] group cursor-pointer z-20">
                            <span className="absolute inline-flex h-4 w-4 rounded-full bg-purple-400 opacity-75 animate-ping" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                            <div className="absolute left-1/2 -translate-x-1/2 top-4 bg-slate-900 text-white text-[9px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                              India (Out for Delivery: {overview?.stats?.outForDeliveryCount ?? 0})
                            </div>
                          </div>
                          <div className="absolute top-[70%] left-[82%] group cursor-pointer z-20">
                            <span className="absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            <div className="absolute left-1/2 -translate-x-1/2 top-4 bg-slate-900 text-white text-[9px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                              Sydney (Delivered: {overview?.stats?.deliveredCount ?? 0})
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest absolute bottom-3 z-10">Dynamic Baggage Protection Nodes</span>
                        </div>
                      </div>

                      {/* Right Column: Find Traveler promo card, Popular routes, AI Insights */}
                      <div className="space-y-6">
                        {/* Find a Verified Traveler Card */}
                        <div className="bg-gradient-to-br from-[#0c1b2f] to-[#1a385c] text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between h-[180px] group">
                          <div className="z-10 space-y-2">
                            <h4 className="text-base font-black tracking-tight leading-snug">Find a Verified Traveler</h4>
                            <p className="text-[11px] text-slate-300 leading-normal font-semibold max-w-[180px]">Connect with trusted travelers worldwide.</p>
                          </div>
                          <button onClick={() => setActiveTab('matches')} className="w-fit bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md z-10 mt-4 flex items-center gap-1.5">
                            <Search size={13} />
                            Search Now
                          </button>
                          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full border border-teal-500/20 opacity-30 pointer-events-none flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full border border-teal-500/20 border-dashed animate-spin-slow" />
                          </div>
                        </div>

                        {/* Popular Routes */}
                        <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Popular Routes</h3>
                            <button onClick={() => setActiveTab('matches')} className="text-[10px] font-bold text-flyora-teal hover:underline">View All</button>
                          </div>
                          <div className="space-y-3.5">
                            {[
                              { name: 'USA ➔ UK', count: '128+ Trips' },
                              { name: 'India ➔ USA', count: '96+ Trips' },
                              { name: 'UAE ➔ India', count: '74+ Trips' },
                              { name: 'Canada ➔ USA', count: '62+ Trips' },
                              { name: 'Australia ➔ UK', count: '51+ Trips' },
                            ].map((route, i) => (
                              <div key={i} className="flex items-center justify-between text-xs font-bold text-slate-700">
                                <span>{route.name}</span>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">{route.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* AI Insights */}
                        <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-sm space-y-3">
                          <div className="flex items-center gap-2 text-purple-600">
                            <Sparkles size={16} />
                            <h4 className="text-xs font-black uppercase tracking-wider">AI Insights</h4>
                          </div>
                          <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                            You have saved <span className="text-purple-600 font-extrabold">$45.30</span> compared to last month.
                          </p>
                          <button className="text-[10px] font-bold text-purple-600 hover:underline block pt-1">
                            View Full Report
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Wallet Balance & Recent Transactions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Wallet Balance widget */}
                      <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[180px]">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Wallet Balance</span>
                          <div className="mt-3">
                            <span className="text-3xl font-black text-slate-900">${(overview?.stats?.walletBalance ?? 0).toFixed(2)}</span>
                            <span className="inline-block text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg ml-2 align-middle uppercase tracking-wider">
                              Escrow Protected
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 font-semibold">Available for instant release</p>
                        </div>
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => {
                              const amtStr = prompt('Enter top up amount ($):', '500');
                              if (amtStr && !isNaN(Number(amtStr)) && Number(amtStr) > 0) {
                                handleTopup(Number(amtStr));
                              }
                            }}
                            className="flex-1 bg-flyora-teal hover:bg-flyora-teal-dark text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <Plus size={13} />
                            Top Up Wallet
                          </button>
                        </div>
                      </div>

                      {/* Recent Transactions */}
                      <div className="lg:col-span-2 bg-white border border-slate-150 rounded-3xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Recent Transactions</h3>
                          <button onClick={() => setActiveTab('wallet')} className="text-xs font-bold text-flyora-teal hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-slate-100 max-h-[140px] overflow-y-auto no-scrollbar">
                          {walletHistory.map((tx, idx) => (
                            <div key={idx} className="py-3 flex items-center justify-between text-xs first:pt-0 last:pb-0">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${tx.type === 'credit' ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-rose-50 border-rose-100 text-rose-500'}`}>
                                  {tx.type === 'credit' ? <ArrowUpRight size={14} /> : <ArrowRightLeft size={14} />}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-800 block leading-tight">{tx.description}</span>
                                  <span className="text-[9px] text-slate-400 font-semibold">{new Date(tx.date).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <span className={`font-black ${tx.type === 'credit' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {tx.type === 'credit' ? '+' : '-'} ${tx.amount.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>{/* END DESKTOP LAYOUT */}

                </div>
              )}

              {/* TAB 2: MY TRIPS */}
              {activeTab === 'trips' && (
                <div className="space-y-6 animate-fade-in text-slate-800">
                  {/* Inner Navigation Tabs */}
                  <div className="flex border-b border-slate-100/80 gap-6">
                    <button
                      onClick={() => setTripSubView('dashboard')}
                      className={`pb-3 text-xs font-bold transition-all relative ${tripSubView === 'dashboard'
                        ? 'text-flyora-teal font-extrabold'
                        : 'text-slate-400 hover:text-slate-700'
                        }`}
                    >
                      Overview
                      {tripSubView === 'dashboard' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-flyora-teal rounded-full" />
                      )}
                    </button>
                    <button
                      onClick={() => setTripSubView('list')}
                      className={`pb-3 text-xs font-bold transition-all relative ${tripSubView === 'list'
                        ? 'text-flyora-teal font-extrabold'
                        : 'text-slate-400 hover:text-slate-700'
                        }`}
                    >
                      My Trips
                      {tripSubView === 'list' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-flyora-teal rounded-full" />
                      )}
                    </button>
                    <button
                      onClick={() => { setSelectedTrip(null); setTripSubView('create'); }}
                      className={`pb-3 text-xs font-bold transition-all relative ${tripSubView === 'create' || tripSubView === 'edit'
                        ? 'text-flyora-teal font-extrabold'
                        : 'text-slate-400 hover:text-slate-700'
                        }`}
                    >
                      Register Capacity
                      {(tripSubView === 'create' || tripSubView === 'edit') && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-flyora-teal rounded-full" />
                      )}
                    </button>
                  </div>

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
                <div className="space-y-6 animate-fade-in text-slate-800">
                  {/* Inner Navigation Tabs */}
                  <div className="flex border-b border-slate-100/80 gap-6">
                    <button
                      onClick={() => setShipmentSubView('dashboard')}
                      className={`pb-3 text-xs font-bold transition-all relative ${shipmentSubView === 'dashboard'
                        ? 'text-flyora-teal font-extrabold'
                        : 'text-slate-400 hover:text-slate-700'
                        }`}
                    >
                      Overview
                      {shipmentSubView === 'dashboard' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-flyora-teal rounded-full" />
                      )}
                    </button>
                    <button
                      onClick={() => setShipmentSubView('list')}
                      className={`pb-3 text-xs font-bold transition-all relative ${shipmentSubView === 'list'
                        ? 'text-flyora-teal font-extrabold'
                        : 'text-slate-400 hover:text-slate-700'
                        }`}
                    >
                      My Shipments
                      {shipmentSubView === 'list' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-flyora-teal rounded-full" />
                      )}
                    </button>
                    <button
                      onClick={() => { setSelectedShipment(null); setShipmentSubView('create'); }}
                      className={`pb-3 text-xs font-bold transition-all relative ${shipmentSubView === 'create' || shipmentSubView === 'edit'
                        ? 'text-flyora-teal font-extrabold'
                        : 'text-slate-400 hover:text-slate-700'
                        }`}
                    >
                      Post Package
                      {(shipmentSubView === 'create' || shipmentSubView === 'edit') && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-flyora-teal rounded-full" />
                      )}
                    </button>
                  </div>

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
                              <div key={ship.id} className="border border-slate-100 rounded-2xl p-5 hover:bg-slate-50/50 transition-all flex flex-col gap-4 bg-white shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                                {ship.status === 'PENDING' && (
                                  <div className="border-t border-slate-100/60 pt-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                    <span className="text-[10px] text-slate-400 font-bold">Ready to match with upcoming travelers</span>
                                    <button
                                      onClick={() => {
                                        setSearchQuery(`${ship.fromCity} ${ship.toCity}`);
                                        setActiveTab('matches');
                                      }}
                                      className="bg-flyora-teal hover:bg-flyora-teal-dark text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 w-fit"
                                    >
                                      <Search size={12} />
                                      Find Traveler Matches
                                    </button>
                                  </div>
                                )}
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
                            <div key={ship.id} className="border border-slate-100 rounded-2xl p-5 hover:bg-slate-50/50 transition-all flex flex-col gap-4 bg-white shadow-sm">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                              {ship.status === 'PENDING' && (
                                <div className="border-t border-slate-100/60 pt-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                  <span className="text-[10px] text-slate-400 font-bold">Ready to match with upcoming travelers</span>
                                  <button
                                    onClick={() => {
                                      setSearchQuery(`${ship.fromCity} ${ship.toCity}`);
                                      setActiveTab('matches');
                                    }}
                                    className="bg-flyora-teal hover:bg-flyora-teal-dark text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 w-fit"
                                  >
                                    <Search size={12} />
                                    Find Traveler Matches
                                  </button>
                                </div>
                              )}
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
              {activeTab === 'matches' && (() => {
                const filteredTravelMatches = overview?.matches?.travelMatches?.filter(match => {
                  if (!searchQuery) return true;
                  const query = searchQuery.toLowerCase();
                  return (
                    match.shipment?.title.toLowerCase().includes(query) ||
                    match.shipment?.description?.toLowerCase().includes(query) ||
                    match.shipment?.fullName.toLowerCase().includes(query) ||
                    match.tripDetails?.toLowerCase().includes(query)
                  );
                }) ?? [];

                const filteredShipmentMatches = overview?.matches?.shipmentMatches?.filter(match => {
                  if (!searchQuery) return true;
                  const query = searchQuery.toLowerCase();
                  return (
                    match.trip?.fullName.toLowerCase().includes(query) ||
                    match.trip?.fromCity.toLowerCase().includes(query) ||
                    match.trip?.toCity.toLowerCase().includes(query) ||
                    match.shipmentDetails?.toLowerCase().includes(query)
                  );
                }) ?? [];

                const totalFilteredMatches = filteredTravelMatches.length + filteredShipmentMatches.length;

                return (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <h1 className="text-xl font-black text-flyora-navy">Smart Matchmaking</h1>
                        <p className="text-xs text-slate-500 mt-1">Cross-referencing traveler capacity and shipment requests on matching flight routes.</p>
                      </div>
                    </div>

                    {totalFilteredMatches === 0 ? (
                      <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400 font-semibold space-y-2.5 bg-white shadow-sm">
                        <ArrowRightLeft size={32} className="mx-auto text-slate-300" />
                        <p>{searchQuery ? 'No matching connections found for your search query.' : 'No matches available right now.'}</p>
                        <p className="text-[10px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                          To compute active matches, ensure you have registered trips or shipments sharing routes with other compliance verified users. Try matching Cities (e.g. London ➔ New York).
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Sub-Section: Match for Traveler Capacity */}
                        {filteredTravelMatches.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-xs font-black text-flyora-teal uppercase tracking-wider flex items-center gap-1.5">
                              <Plane size={14} className="transform -rotate-45" />
                              Senders Requesting Your Active Capacity
                            </h3>

                            <div className="grid grid-cols-1 gap-4">
                              {filteredTravelMatches.map((match, idx) => (
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
                                      <span className="text-flyora-teal">Reward: ${match.shipment?.pricePaid}</span>
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
                        {filteredShipmentMatches.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-xs font-black text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                              <List size={14} />
                              Travelers Traveling on your Shipping Route
                            </h3>

                            <div className="grid grid-cols-1 gap-4">
                              {filteredShipmentMatches.map((match, idx) => (
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
                );
              })()}

              {/* TAB 5: ESCROW & WALLET */}
              {activeTab === 'wallet' && (
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
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-1 relative overflow-hidden shadow-sm flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wallet Balance</span>
                        <span className="text-2xl font-black text-slate-800 block">${(overview?.stats?.walletBalance ?? 0).toFixed(2)}</span>
                        <p className="text-[9px] text-slate-400 leading-normal pt-1">Withdrawable earnings available in your bank account.</p>
                      </div>
                      <button
                        onClick={() => {
                          const amtStr = prompt('Enter top up amount ($):', '500');
                          if (amtStr && !isNaN(Number(amtStr)) && Number(amtStr) > 0) {
                            handleTopup(Number(amtStr));
                          }
                        }}
                        className="mt-3 w-full bg-flyora-teal hover:bg-flyora-teal-dark text-white text-xs font-bold py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Plus size={13} />
                        Add Money
                      </button>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-1 relative overflow-hidden shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Baggage Escrow Balance</span>
                      <span className="text-2xl font-black text-slate-800 block">${(overview?.stats?.escrowBalance ?? 0).toFixed(2)}</span>
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

              {/* TAB 6: PROFILE OR MOBILE MENU */}
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-fade-in text-slate-800">
                  {/* MOBILE MENU VIEW (only visible on mobile) */}
                  <div className="lg:hidden space-y-6">
                    <div>
                      <h1 className="text-xl font-black text-slate-900">More Options</h1>
                      <p className="text-xs text-slate-500 mt-1">Access all pages and settings on Flyora.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3.5">
                      {/* Traveler Hub */}
                      <button
                        onClick={() => { setActiveTab('trips'); setTripSubView('dashboard'); }}
                        className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm active:scale-95 transition-all text-left"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100/50 flex items-center justify-center text-flyora-teal shrink-0">
                            <Plane size={18} className="transform -rotate-45" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">Traveller Hub</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Register weight capacity & view matches</span>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-slate-405" />
                      </button>

                      {/* Sender Hub */}
                      <button
                        onClick={() => { setActiveTab('shipments'); setShipmentSubView('dashboard'); }}
                        className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm active:scale-95 transition-all text-left"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/50 flex items-center justify-center text-blue-500 shrink-0">
                            <Send size={18} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">Sender Hub</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Post shipment requests & view status</span>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-slate-405" />
                      </button>

                      {/* KYC Verification */}
                      <button
                        onClick={() => setActiveTab('kyc')}
                        className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm active:scale-95 transition-all text-left"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-500 shrink-0">
                            <ShieldCheck size={18} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">KYC Verification</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Verify ID documents & compliance status</span>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-slate-405" />
                      </button>

                      {/* Reviews */}
                      <button
                        onClick={() => setActiveTab('reviews')}
                        className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm active:scale-95 transition-all text-left"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100/50 flex items-center justify-center text-amber-500 shrink-0">
                            <Star size={18} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">Reviews & Ratings</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Check feedback left by other users</span>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-slate-405" />
                      </button>

                      {/* Profile Settings */}
                      <button
                        onClick={() => setActiveTab('profile_settings')}
                        className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm active:scale-95 transition-all text-left"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/40 flex items-center justify-center text-slate-500 shrink-0">
                            <Settings size={18} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">Profile Settings</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Edit your email, phone, and secure password</span>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-slate-405" />
                      </button>

                      {/* Log Out */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between p-4 bg-rose-50/30 border border-rose-100/40 rounded-2xl shadow-sm active:scale-95 transition-all text-left"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100/50 flex items-center justify-center text-rose-500 shrink-0">
                            <LogOut size={18} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-rose-600 block">Log Out</span>
                            <span className="text-[10px] text-rose-450 font-semibold mt-0.5 block">Sign out of this session securely</span>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-rose-405" />
                      </button>
                    </div>
                  </div>

                  {/* DESKTOP VIEW (always renders profile settings directly) */}
                  <div className="hidden lg:block space-y-6">
                    <div className="pb-4 border-b border-slate-100">
                      <h1 className="text-xl font-black text-flyora-navy">Profile Settings</h1>
                      <p className="text-xs text-slate-500 mt-1">Manage user contact details, address records, and secure login details.</p>
                    </div>

                    <form className="max-w-md space-y-4" onSubmit={handleUpdateProfile}>
                      {/* Avatar Upload Container */}
                      <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                        <div className="relative group shrink-0">
                          <img
                            src={profileImageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"}
                            alt="Profile Avatar"
                            className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-100 group-hover:ring-flyora-teal/30 transition-all"
                          />
                          <label className="absolute inset-0 rounded-full bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                            <Settings size={16} className="text-white animate-pulse" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Profile Picture</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Click photo to upload new image (JPEG/PNG)</p>
                        </div>
                      </div>
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
                </div>
              )}

              {/* TAB 6.5: MOBILE PROFILE SETTINGS FORM */}
              {activeTab === 'profile_settings' && (
                <div className="space-y-6 animate-fade-in text-slate-800 lg:hidden">
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="p-1.5 hover:bg-slate-100 rounded-xl transition-all"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <div>
                      <h1 className="text-lg font-black text-slate-900">Profile Settings</h1>
                      <p className="text-[10px] text-slate-400">Edit contact details and security credentials</p>
                    </div>
                  </div>

                  <form className="space-y-4" onSubmit={handleUpdateProfile}>
                    {/* Avatar Upload Container */}
                    <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                      <div className="relative group shrink-0">
                        <img
                          src={profileImageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"}
                          alt="Profile Avatar"
                          className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-100 group-hover:ring-flyora-teal/30 transition-all"
                        />
                        <label className="absolute inset-0 rounded-full bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                          <Settings size={16} className="text-white animate-pulse" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">Profile Picture</h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Click photo to upload new image (JPEG/PNG)</p>
                      </div>
                    </div>
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
                      <label className="text-xs font-bold text-slate-800">New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={profilePassword}
                        onChange={(e) => setProfilePassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                      />
                    </div>

                    <div className="pt-2">
                      <Button variant="teal" type="submit" disabled={profileLoading} className="w-full py-2.5">
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

        {/* Unified footer (desktop only) */}
        <footer className="hidden lg:block py-6 border-t border-slate-100 bg-white px-8">
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

      {/* ─── MOBILE BOTTOM NAVIGATION BAR — Meta / Instagram style ─── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        {/*
          Strategy: one solid pill bar with overflow:visible.
          The center FAB sits in the flex row using self-start + -translate-y-4
          so it pokes above the bar by ~16px — exactly how Meta does it.
        */}
        <div
          className="mx-4 mb-3 flex items-center justify-around px-1 rounded-[20px]"
          style={{
            height: '62px',
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            boxShadow: '0 -1px 0 rgba(0,0,0,0.03), 0 10px 36px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07)',
            border: '1px solid rgba(203,213,225,0.85)',
            overflow: 'visible',
          }}
        >
          {/* ── Tab: Home ── */}
          <button
            onClick={() => setActiveTab('overview')}
            className="flex flex-col items-center justify-center gap-[3px] flex-1 h-full rounded-xl transition-all duration-200 active:scale-90 relative group"
          >
            {activeTab === 'overview' && (
              <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-flyora-teal" />
            )}
            <div className={`transition-all duration-200 mt-1 ${activeTab === 'overview' ? 'text-flyora-teal scale-110' : 'text-slate-400'}`}>
              <Sparkles size={20} strokeWidth={activeTab === 'overview' ? 2.5 : 2} />
            </div>
            <span className={`text-[9px] font-bold tracking-tight leading-none transition-colors duration-200 ${activeTab === 'overview' ? 'text-flyora-teal' : 'text-slate-400'}`}>
              Home
            </span>
          </button>

          {/* ── Tab: Shipments ── */}
          <button
            onClick={() => { setActiveTab('shipments'); setShipmentSubView('dashboard'); }}
            className="flex flex-col items-center justify-center gap-[3px] flex-1 h-full rounded-xl transition-all duration-200 active:scale-90 relative group"
          >
            {activeTab === 'shipments' && (
              <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-flyora-teal" />
            )}
            <div className={`transition-all duration-200 mt-1 ${activeTab === 'shipments' ? 'text-flyora-teal scale-110' : 'text-slate-400'}`}>
              <Briefcase size={20} strokeWidth={activeTab === 'shipments' ? 2.5 : 2} />
            </div>
            <span className={`text-[9px] font-bold tracking-tight leading-none transition-colors duration-200 ${activeTab === 'shipments' ? 'text-flyora-teal' : 'text-slate-400'}`}>
              Shipments
            </span>
          </button>

          {/* ── Center FAB — IN the flex row, lifted via -translate-y ── */}
          <div className="flex-1 flex flex-col items-center justify-center self-start" style={{ marginTop: '-18px' }}>
            <button
              onClick={() => setShowFabModal(true)}
              className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-white transition-all duration-200 active:scale-90"
              style={{
                background: 'linear-gradient(145deg, #14b8a6 0%, #0d9488 40%, #059669 100%)',
                boxShadow: '0 6px 18px rgba(13,148,136,0.45), 0 2px 6px rgba(13,148,136,0.2)',
              }}
            >
              <Plus size={24} strokeWidth={2.5} />
            </button>
            <span className="text-[9px] font-bold text-slate-400 mt-1 leading-none">New</span>
          </div>

          {/* ── Tab: Wallet ── */}
          <button
            onClick={() => setActiveTab('wallet')}
            className="flex flex-col items-center justify-center gap-[3px] flex-1 h-full rounded-xl transition-all duration-200 active:scale-90 relative group"
          >
            {activeTab === 'wallet' && (
              <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-flyora-teal" />
            )}
            <div className={`transition-all duration-200 mt-1 ${activeTab === 'wallet' ? 'text-flyora-teal scale-110' : 'text-slate-400'}`}>
              <Wallet size={20} strokeWidth={activeTab === 'wallet' ? 2.5 : 2} />
            </div>
            <span className={`text-[9px] font-bold tracking-tight leading-none transition-colors duration-200 ${activeTab === 'wallet' ? 'text-flyora-teal' : 'text-slate-400'}`}>
              Wallet
            </span>
          </button>

          {/* ── Tab: More ── */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex flex-col items-center justify-center gap-[3px] flex-1 h-full rounded-xl transition-all duration-200 active:scale-90 relative group"
          >
            {(() => {
              const isMore = activeTab === 'profile' || activeTab === 'kyc' || activeTab === 'reviews' || activeTab === 'matches' || activeTab === 'trips';
              return (
                <>
                  {isMore && (
                    <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-flyora-teal" />
                  )}
                  <div className={`transition-all duration-200 mt-1 ${isMore ? 'text-flyora-teal scale-110' : 'text-slate-400'}`}>
                    {isMore ? <User size={20} strokeWidth={2.5} /> : <MoreHorizontal size={20} strokeWidth={2} />}
                  </div>
                  <span className={`text-[9px] font-bold tracking-tight leading-none transition-colors duration-200 ${isMore ? 'text-flyora-teal' : 'text-slate-400'}`}>
                    More
                  </span>
                </>
              );
            })()}
          </button>

        </div>
      </nav>

      {/* Center FAB Option Modal (Mobile overlay - Google & Microsoft inspired center popup) */}
      {showFabModal && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
          onClick={() => setShowFabModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-[28px] p-6 space-y-6 shadow-2xl border border-slate-100/80 transition-all transform scale-100 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header section with clean design */}
            <div className="flex flex-col items-center text-center space-y-1.5 pb-2">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-flyora-teal to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/10">
                <PlusCircle size={22} />
              </div>
              <h3 className="text-base font-black text-slate-900 mt-2">Create New Request</h3>
              <p className="text-xs text-slate-450 font-semibold max-w-[240px] leading-relaxed">
                Select request type you would like to publish on Flyora.
              </p>
            </div>

            {/* Grid of Choices - Fluent Google/Microsoft card design */}
            <div className="grid grid-cols-1 gap-3">
              {/* Traveler Capacity */}
              <button
                onClick={() => {
                  setActiveTab('trips');
                  setTripSubView('create');
                  setShowFabModal(false);
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all group active:scale-98 text-left bg-white shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-flyora-teal flex items-center justify-center border border-teal-100/50 group-hover:scale-105 transition-transform shrink-0">
                  <Plane size={18} className="transform -rotate-45" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-800 block group-hover:text-flyora-teal transition-colors">Traveler Request</span>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Register flight weight capacity</span>
                </div>
                <ArrowRight size={13} className="text-slate-300 group-hover:text-flyora-teal group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Sender Shipment */}
              <button
                onClick={() => {
                  setActiveTab('shipments');
                  setShipmentSubView('create');
                  setShowFabModal(false);
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all group active:scale-98 text-left bg-white shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100/50 group-hover:scale-105 transition-transform shrink-0">
                  <Briefcase size={18} />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-800 block group-hover:text-emerald-500 transition-colors">Sender Request</span>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Post a parcel to send</span>
                </div>
                <ArrowRight size={13} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* Cancel Button - Microsoft Fluent bottom bar style */}
            <div className="pt-2">
              <button
                onClick={() => setShowFabModal(false)}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/40 text-xs font-bold text-slate-600 rounded-xl transition-all active:scale-95 shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Notification Modal (Google & Microsoft Center Design) */}
      {showNotifications && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
          onClick={() => setShowNotifications(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-[28px] p-6 space-y-4 shadow-2xl border border-slate-100/80 transition-all transform scale-100 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-flyora-teal" />
                <h3 className="text-base font-black text-slate-900">Notifications</h3>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs font-bold text-flyora-teal hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 font-semibold">
                  No notifications yet
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      handleMarkAsRead(n.id);
                    }}
                    className={`py-3.5 flex items-start gap-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${!n.isRead ? 'bg-teal-50/10' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'wallet' ? 'bg-amber-50 text-amber-500' :
                        n.type === 'kyc' ? 'bg-emerald-50 text-emerald-500' :
                          n.type === 'match' ? 'bg-blue-50 text-blue-500' : 'bg-slate-50 text-slate-500'
                      }`}>
                      {n.type === 'wallet' ? <Wallet size={16} /> :
                        n.type === 'kyc' ? <ShieldCheck size={16} /> :
                          n.type === 'match' ? <ArrowRightLeft size={16} /> : <Bell size={16} />}
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-slate-800 truncate">{n.title}</p>
                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-flyora-teal shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-450 leading-relaxed font-semibold break-words">{n.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowNotifications(false)}
              className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/40 text-xs font-bold text-slate-650 rounded-xl transition-all active:scale-95"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
