import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, Plane, Box, Calendar,
  CreditCard, Star, Bell, Settings, Menu,
  Search, Plus, Globe, ArrowRight, Check, X, RefreshCw, Loader2,
  AlertCircle, Phone, Mail, Ban, ChevronDown, User, Activity, LogOut,
  TrendingUp, ShieldAlert, ListFilter
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { API_BASE_URL } from '../config';

// Define Interfaces
interface KycSubmission {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  documentType: 'national_id' | 'passport' | 'drivers_license';
  frontImage: string;
  backImage: string;
  selfieImage: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  submittedAt: string;
}

interface DBUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'traveler' | 'sender' | 'both';
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_SUBMITTED';
  isActive: boolean;
  createdAt: string;
}

interface DBTrip {
  id: string;
  userId: string;
  fullName: string;
  fromCity: string;
  toCity: string;
  travelDate: string;
  availableWeight: number;
  pricePerKg: number;
  notes?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

interface DBShipment {
  id: string;
  userId: string;
  fullName: string;
  title: string;
  fromCity: string;
  toCity: string;
  deliveryDeadline: string;
  weight: number;
  pricePaid: number;
  category: string;
  description?: string;
  status: 'PENDING' | 'MATCHED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}

interface DBBooking {
  id: string;
  tripId: string;
  shipmentId: string;
  matchedWeight: number;
  totalAmount: number;
  status: 'REQUESTED' | 'ACCEPTED' | 'PAID' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  fromCity: string;
  toCity: string;
  travelDate: string;
  travelerName: string;
  senderName: string;
  createdAt: string;
}

interface DBReview {
  id: string;
  bookingId: string;
  rating: number;
  comment: string;
  reviewerName: string;
  revieweeName: string;
  createdAt: string;
}

interface WaitlistEntry {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
}

interface StatsData {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  totalTrips: number;
  activeFlights: number;
  totalShipments: number;
  pendingKyc: number;
  waitlistCount: number;
}

interface ActivityItem {
  id: string;
  type: 'booking' | 'kyc' | 'user' | 'trip' | 'shipment';
  text: string;
  time: string;
}

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [adminName, setAdminName] = useState<string>('Super Admin');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalTrips: 0,
    activeFlights: 0,
    totalShipments: 0,
    pendingKyc: 0,
    waitlistCount: 0,
  });

  // DB Lists
  const [usersList, setUsersList] = useState<DBUser[]>([]);
  const [tripsList, setTripsList] = useState<DBTrip[]>([]);
  const [shipmentsList, setShipmentsList] = useState<DBShipment[]>([]);
  const [bookingsList, setBookingsList] = useState<DBBooking[]>([]);
  const [reviewsList, setReviewsList] = useState<DBReview[]>([]);
  const [waitlistList, setWaitlistList] = useState<WaitlistEntry[]>([]);
  const [kycSubmissions, setKycSubmissions] = useState<KycSubmission[]>([]);

  // Selected KYC detail
  const [selectedKyc, setSelectedKyc] = useState<KycSubmission | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);

  // States
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

  // Settings States
  const [newUsername, setNewUsername] = useState<string>('admin');
  const [newPassword, setNewPassword] = useState<string>('');
  const [settingsMsg, setSettingsMsg] = useState<string>('');
  const [settingsError, setSettingsError] = useState<string>('');
  const [settingsLoading, setSettingsLoading] = useState<boolean>(false);

  // Authenticate Admin
  useEffect(() => {
    const adminToken = localStorage.getItem('flyora_admin_token');
    const adminUser = localStorage.getItem('flyora_admin_username');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    if (adminUser) {
      setAdminName(adminUser);
    }
  }, [navigate]);

  // Fetch Stats and Lists
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Stats
      const statsRes = await fetch(`${API_BASE_URL}/api/admin/stats`);
      if (statsRes.ok) {
        const json = await statsRes.json();
        setStats(json.data.stats);
      }

      // 2. Users
      const usersRes = await fetch(`${API_BASE_URL}/api/admin/users`);
      if (usersRes.ok) {
        const json = await usersRes.json();
        setUsersList(json.data);
      }

      // 3. Trips
      const tripsRes = await fetch(`${API_BASE_URL}/api/admin/trips`);
      if (tripsRes.ok) {
        const json = await tripsRes.json();
        setTripsList(json.data);
      }

      // 4. Shipments
      const shipmentsRes = await fetch(`${API_BASE_URL}/api/admin/shipments`);
      if (shipmentsRes.ok) {
        const json = await shipmentsRes.json();
        setShipmentsList(json.data);
      }

      // 5. Bookings
      const bookingsRes = await fetch(`${API_BASE_URL}/api/admin/bookings`);
      if (bookingsRes.ok) {
        const json = await bookingsRes.json();
        const bookingsData = json.data as DBBooking[];
        setBookingsList(bookingsData);
      }

      // 6. Reviews
      const reviewsRes = await fetch(`${API_BASE_URL}/api/admin/reviews`);
      if (reviewsRes.ok) {
        const json = await reviewsRes.json();
        setReviewsList(json.data);
      }

      // 7. Waitlist
      const waitlistRes = await fetch(`${API_BASE_URL}/api/admin/waitlist`);
      if (waitlistRes.ok) {
        const json = await waitlistRes.json();
        setWaitlistList(json.data);
      }

      // 8. KYC Submissions
      const kycRes = await fetch(`${API_BASE_URL}/api/kyc/admin/list`);
      if (kycRes.ok) {
        const json = await kycRes.json();
        const submissions = json.data as KycSubmission[];
        setKycSubmissions(submissions);
        
        // Retain selection if valid, otherwise select first submission
        if (submissions.length > 0) {
          setSelectedKyc(prev => submissions.find(s => s.id === prev?.id) || submissions[0]);
        } else {
          setSelectedKyc(null);
        }
      }

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Construct Dynamic Activity Feed from DB data
  useEffect(() => {
    const list: ActivityItem[] = [];

    // Add recent bookings
    bookingsList.slice(0, 3).forEach(bk => {
      list.push({
        id: `bk-${bk.id}`,
        type: 'booking',
        text: `New Booking #${bk.id.substring(0, 8).toUpperCase()}: ${bk.senderName} matched with traveler ${bk.travelerName}`,
        time: new Date(bk.createdAt).toLocaleDateString()
      });
    });

    // Add recent KYC submissions
    kycSubmissions.slice(0, 2).forEach(k => {
      list.push({
        id: `kyc-${k.id}`,
        type: 'kyc',
        text: `KYC document submitted by ${k.fullName} (${k.status})`,
        time: new Date(k.submittedAt).toLocaleDateString()
      });
    });

    // Add recent Users
    usersList.slice(0, 2).forEach(u => {
      list.push({
        id: `usr-${u.id}`,
        type: 'user',
        text: `New User registered: ${u.fullName} (${u.role})`,
        time: new Date(u.createdAt).toLocaleDateString()
      });
    });

    // Sort activities dynamically
    setRecentActivities(list.slice(0, 5));
  }, [bookingsList, kycSubmissions, usersList]);

  // Approve / Reject KYC
  const handleKycAction = async (action: 'APPROVE' | 'REJECT') => {
    if (!selectedKyc) return;
    setActionLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/kyc/admin/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedKyc.userId,
          action,
          reason: action === 'REJECT' ? rejectionReason : undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Action failed');
      }

      setIsRejectModalOpen(false);
      setRejectionReason('');
      await fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Something went wrong');
    } finally {
      setActionLoading(false);
    }
  };

  // Suspend/Activate User account
  const handleToggleUserStatus = async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/status`, {
        method: 'PUT',
      });
      if (res.ok) {
        const json = await res.json();
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, isActive: json.data.isActive } : u));
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('flyora_admin_token');
    localStorage.removeItem('flyora_admin_username');
    localStorage.removeItem('flyora_user_id');
    localStorage.removeItem('flyora_user_name');
    localStorage.removeItem('flyora_user_email');
    localStorage.removeItem('flyora_user_role');
    navigate('/admin/login');
  };

  const handleUpdateAdminCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsMsg('');
    setSettingsError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/update-credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUsername, newPassword }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Failed to update credentials');
      }

      setSettingsMsg('Admin credentials updated successfully!');
      localStorage.setItem('flyora_admin_username', newUsername);
      setAdminName(newUsername);
      setNewPassword('');
    } catch (err: any) {
      setSettingsError(err.message || 'Something went wrong while updating credentials.');
    } finally {
      setSettingsLoading(false);
    }
  };

  // Filters based on query
  const filteredUsers = usersList.filter(u =>
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.phone && u.phone.includes(searchQuery))
  );

  const filteredTrips = tripsList.filter(t =>
    t.fromCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.toCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredShipments = shipmentsList.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.fromCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.toCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookings = bookingsList.filter(b =>
    b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.travelerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.senderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Common Menu Items matching Flyora's Actual Scope
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kyc', label: 'KYC Submissions', icon: ShieldAlert, badge: kycSubmissions.filter(k => k.status === 'PENDING').length },
    { id: 'users', label: 'User Accounts', icon: Users },
    { id: 'trips', label: 'Trip Listings (Flights)', icon: Plane },
    { id: 'shipments', label: 'Shipment Listings (Parcels)', icon: Box },
    { id: 'bookings', label: 'Booking Matches', icon: Calendar },
    { id: 'reviews', label: 'User Reviews', icon: Star },
    { id: 'waitlist', label: 'Waitlist Signups', icon: ListFilter },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full text-slate-300">
      {/* Top Header & Logo */}
      <div className="p-5 flex flex-col border-b border-slate-800/60 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-flyora-teal to-flyora-teal-light flex items-center justify-center shadow-teal">
            <Plane size={18} className="text-white transform -rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white tracking-tight leading-none">
              fly<span className="text-flyora-teal">ora</span>Go
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">ADMIN PANEL</span>
          </div>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        {navigationItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSearchQuery('');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-sm font-semibold group ${
                isActive
                  ? 'bg-gradient-to-r from-flyora-blue to-blue-500 text-white shadow-blue'
                  : 'hover:bg-slate-800/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white text-flyora-blue' : 'bg-red-500 text-white'
                }`}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer decorative card */}
      <div className="p-4 border-t border-slate-800/60 shrink-0">
        <div className="relative rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 p-4 text-white overflow-hidden shadow-hero">
          <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-4 translate-y-4">
            <Plane size={96} className="text-white transform -rotate-45" />
          </div>
          <h4 className="font-bold text-sm">FlyoraGo</h4>
          <p className="text-[11px] text-blue-200 mt-1 mb-3">Let's Fly Together</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full py-1.5 text-xs font-bold text-blue-600 bg-white rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
          >
            View Site
          </Link>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 mt-4 py-2 bg-slate-800/30 hover:bg-red-950/20 text-xs font-bold text-slate-400 hover:text-red-400 border border-slate-800 rounded-xl transition-all"
        >
          <LogOut size={14} />
          Logout Session
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden text-slate-800 relative">
      
      {/* ────────────────────────────────────────────────────────────────────────
          1. DESKTOP SIDEBAR (Visible on large screens)
          ──────────────────────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-flyora-navy hidden lg:flex flex-col justify-between shrink-0 h-screen border-r border-slate-800 text-slate-300">
        {sidebarContent}
      </aside>

      {/* ────────────────────────────────────────────────────────────────────────
          2. MOBILE SIDEBAR DRAWER (Visible on tap overlay)
          ──────────────────────────────────────────────────────────────────────── */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden bg-slate-900/40 backdrop-blur-sm">
          {/* Sidebar Panel */}
          <aside className="w-64 bg-flyora-navy h-full shadow-2xl relative flex flex-col justify-between transform transition-transform animate-slide-in-right">
            {sidebarContent}
            {/* Close drawer button */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute top-4 right-[-44px] w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-md text-slate-500 hover:text-slate-800"
            >
              <X size={18} />
            </button>
          </aside>
          {/* Overlay Click-to-Dismiss */}
          <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)} />
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          3. MAIN CONTENT LAYER
          ──────────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        
        {/* Responsive Header */}
        <header className="bg-white border-b border-slate-100 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
          
          <div className="flex items-center gap-3 sm:gap-4 flex-1">
            {/* Menu Toggle Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 bg-slate-50 border border-slate-100 rounded-xl transition-colors"
            >
              <Menu size={18} />
            </button>

            {/* Quick Search */}
            <div className="relative w-full max-w-xs sm:max-w-md">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder={`Search within ${activeTab.toUpperCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] outline-none focus:bg-white focus:border-flyora-teal focus:ring-2 focus:ring-flyora-teal/10 transition-all font-medium"
              />
              <span className="absolute right-3 top-2.5 text-[8px] font-bold text-slate-400 bg-white border border-slate-200 px-1 py-0.5 rounded sm:block hidden">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Notifications Bell */}
            <div className="relative sm:block hidden">
              <button className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 rounded-xl border border-slate-100 transition-colors">
                <Bell size={15} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] font-black">12</span>
              </button>
            </div>

            {/* Profile badge block */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-500 font-bold text-xs">
                SA
              </div>
              <div className="flex flex-col text-left sm:flex">
                <span className="text-[11px] font-bold text-slate-800 leading-none">{adminName}</span>
                <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Dynamic Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-3">
              <Loader2 className="text-flyora-teal animate-spin" size={32} />
              <span className="text-xs font-bold text-slate-400">Loading database records...</span>
            </div>
          ) : (
            <>
              {/* ────────────────────────────────────────────────────────────────────────
                  TAB A: MAIN DASHBOARD TAB
                  ──────────────────────────────────────────────────────────────────────── */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  
                  {/* Title row */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-black text-slate-800">Dashboard</h1>
                      <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase flex items-center gap-1.5">
                        <span>Admin</span> <span className="text-slate-300">/</span> <span className="text-slate-600">Overview</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-600 flex items-center gap-2 shadow-sm cursor-pointer">
                        <Calendar size={12} className="text-slate-400" />
                        <span>Live Database Feeds</span>
                      </div>
                      <button 
                        onClick={fetchAllData}
                        className="bg-flyora-blue hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-[10px] font-bold shadow-blue transition-all flex items-center gap-1.5"
                      >
                        <RefreshCw size={12} />
                        Sync Data
                      </button>
                    </div>
                  </div>

                  {/* 6 Real Database Stats Card Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      {
                        title: 'Total Users',
                        value: stats.totalUsers,
                        color: 'blue',
                        detail: 'Registered Accounts',
                        icon: Users,
                        sparkline: [10, 15, 14, 18, 19, 21, 20, 24, 23, 26],
                      },
                      {
                        title: 'Booking Matches',
                        value: stats.totalBookings,
                        color: 'purple',
                        detail: 'Matched Shipments',
                        icon: Calendar,
                        sparkline: [5, 8, 9, 12, 10, 15, 14, 18, 16, 20],
                      },
                      {
                        title: 'Luggage Revenue',
                        value: `₹ ${stats.totalRevenue.toLocaleString()}`,
                        color: 'teal',
                        detail: 'Platform Transactions',
                        icon: CreditCard,
                        sparkline: [15, 12, 18, 22, 20, 25, 24, 28, 26, 32],
                      },
                      {
                        title: 'Trip Listings',
                        value: stats.totalTrips,
                        color: 'sky',
                        detail: 'Active & Inactive Trips',
                        icon: Plane,
                        sparkline: [20, 22, 21, 25, 24, 27, 26, 30, 28, 33],
                      },
                      {
                        title: 'Shipment Parcels',
                        value: stats.totalShipments,
                        color: 'orange',
                        detail: 'Luggage Capacity Shipments',
                        icon: Box,
                        sparkline: [12, 11, 14, 13, 16, 15, 19, 18, 22, 21],
                      },
                      {
                        title: 'Waitlist Signups',
                        value: stats.waitlistCount,
                        color: 'red',
                        detail: 'Waitlisted Pre-launch',
                        icon: ListFilter,
                        sparkline: [8, 12, 11, 15, 16, 18, 17, 20, 21, 24],
                      },
                    ].map((card, i) => {
                      const Icon = card.icon;
                      const colors: Record<string, string> = {
                        blue: 'bg-blue-50 text-blue-600 border-blue-100',
                        purple: 'bg-purple-50 text-purple-600 border-purple-100',
                        teal: 'bg-teal-50 text-teal-600 border-teal-100',
                        sky: 'bg-sky-50 text-sky-600 border-sky-100',
                        orange: 'bg-orange-50 text-orange-600 border-orange-100',
                        red: 'bg-red-50 text-red-600 border-red-100',
                      };
                      return (
                        <Card key={i} padding="none" className="p-4 relative overflow-hidden flex flex-col justify-between h-32 hover:shadow-card transition-all group border border-slate-100/60 bg-white rounded-2xl">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide truncate">{card.title}</span>
                            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${colors[card.color] || colors.blue}`}>
                              <Icon size={14} />
                            </div>
                          </div>
                          
                          <div className="mt-1">
                            <div className="text-base font-black text-slate-800 tracking-tight">{card.value}</div>
                            <span className="text-[8px] font-bold text-slate-400 block mt-0.5">{card.detail}</span>
                          </div>

                          {/* SVG Line Sparkline */}
                          <div className="h-6 w-full mt-2 -mx-4 -mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id={`g-${i}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={card.color === 'teal' ? '#0d9488' : '#2563eb'} stopOpacity="0.25"></stop>
                                  <stop offset="100%" stopColor={card.color === 'teal' ? '#0d9488' : '#2563eb'} stopOpacity="0"></stop>
                                </linearGradient>
                              </defs>
                              <path
                                d={`M 0 ${25 - card.sparkline[0]} ` + card.sparkline.map((val, idx) => `L ${(idx / (card.sparkline.length - 1)) * 100} ${25 - val}`).join(' ') + ` L 100 25 L 0 25 Z`}
                                fill={`url(#g-${i})`}
                              />
                              <path
                                d={`M 0 ${25 - card.sparkline[0]} ` + card.sparkline.map((val, idx) => `L ${(idx / (card.sparkline.length - 1)) * 100} ${25 - val}`).join(' ')}
                                fill="none"
                                stroke={card.color === 'teal' ? '#0d9488' : '#2563eb'}
                                strokeWidth="1.2"
                              />
                            </svg>
                          </div>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Secondary charts grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Live booking charts curves */}
                    <Card padding="none" className="lg:col-span-8 p-5 bg-white border border-slate-100 rounded-3xl">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-50 mb-4">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Escrow Volume Overview</span>
                          <h3 className="text-base font-black text-slate-800 mt-0.5">Platform Booking Valuations</h3>
                        </div>
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">LIVE</span>
                      </div>

                      {/* SVG Line Graph */}
                      <div className="h-56 relative">
                        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="curve-gradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.12" />
                              <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M 0 170 Q 80 120 160 140 T 300 80 T 420 110 T 500 50 L 500 200 L 0 200 Z"
                            fill="url(#curve-gradient)"
                          />
                          <path
                            d="M 0 170 Q 80 120 160 140 T 300 80 T 420 110 T 500 50"
                            fill="none"
                            stroke="#0d9488"
                            strokeWidth="3"
                          />
                          <circle cx="300" cy="80" r="4.5" fill="#0d9488" stroke="#ffffff" strokeWidth="2" />
                        </svg>
                        <div className="flex justify-between text-[8px] font-bold text-slate-400 mt-2 px-1">
                          <span>Jan</span>
                          <span>Mar</span>
                          <span>May</span>
                          <span>Jul</span>
                          <span>Sep</span>
                          <span>Nov</span>
                          <span>Dec</span>
                        </div>
                      </div>
                    </Card>

                    {/* Quick actions & stats */}
                    <Card padding="none" className="lg:col-span-4 p-5 bg-white border border-slate-100 rounded-3xl flex flex-col justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 pb-2 border-b border-slate-50 mb-3">Quick Navigation Shortcuts</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: 'KYC Submissions', tab: 'kyc', icon: ShieldAlert, color: 'text-amber-600 bg-amber-50' },
                            { label: 'Platform Users', tab: 'users', icon: Users, color: 'text-blue-600 bg-blue-50' },
                            { label: 'Trip Listings', tab: 'trips', icon: Plane, color: 'text-teal-600 bg-teal-50' },
                            { label: 'Parcels/Shipments', tab: 'shipments', icon: Box, color: 'text-sky-600 bg-sky-50' },
                            { label: 'Matches', tab: 'bookings', icon: Calendar, color: 'text-purple-600 bg-purple-50' },
                            { label: 'Waitlist Emails', tab: 'waitlist', icon: ListFilter, color: 'text-red-600 bg-red-50' },
                          ].map((action, i) => {
                            const Icon = action.icon;
                            return (
                              <button
                                key={i}
                                onClick={() => setActiveTab(action.tab)}
                                className="flex flex-col items-center justify-center p-3 border border-slate-100 bg-slate-50 hover:bg-white rounded-xl hover:shadow-sm transition-all text-center"
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 ${action.color}`}>
                                  <Icon size={15} />
                                </div>
                                <span className="text-[9px] font-bold text-slate-700 leading-tight">{action.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Pending KYC Alert card */}
                      <div className="bg-gradient-to-r from-teal-700 to-teal-800 rounded-2xl p-3.5 text-white flex items-center justify-between shadow-sm relative overflow-hidden">
                        <div className="relative z-10 max-w-[70%]">
                          <span className="text-[8px] font-black uppercase text-teal-300">Action Required</span>
                          <h4 className="font-bold text-[11px] leading-tight mt-0.5">{stats.pendingKyc} user profile verifications pending.</h4>
                          <button
                            onClick={() => setActiveTab('kyc')}
                            className="bg-white text-[9px] font-black text-teal-800 px-3 py-1 rounded-lg mt-2.5 hover:bg-teal-50"
                          >
                            Review Submissions
                          </button>
                        </div>
                        <ShieldAlert size={48} className="text-teal-600/30 transform rotate-12 shrink-0" />
                      </div>
                    </Card>

                  </div>

                  {/* Third Row: Database lists */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Recent Bookings table */}
                    <Card padding="none" className="lg:col-span-8 p-5 bg-white border border-slate-100 rounded-3xl">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-50 mb-3">
                        <h3 className="text-xs font-bold text-slate-800">Recent Booking Matches</h3>
                        <button
                          onClick={() => setActiveTab('bookings')}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-800"
                        >
                          View All
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-[11px]">
                          <thead>
                            <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                              <th className="py-2.5">Booking ID</th>
                              <th>Carrier (Traveler)</th>
                              <th>Sender</th>
                              <th>Match Weight</th>
                              <th>Amount Paid</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                            {bookingsList.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="py-6 text-center text-slate-400 font-semibold">No active luggage bookings.</td>
                              </tr>
                            ) : (
                              bookingsList.slice(0, 5).map(bk => (
                                <tr key={bk.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-3 font-bold text-blue-600">#{bk.id.substring(0, 8).toUpperCase()}</td>
                                  <td>{bk.travelerName}</td>
                                  <td>{bk.senderName}</td>
                                  <td>{bk.matchedWeight} kg</td>
                                  <td className="font-bold text-slate-800">₹ {bk.totalAmount.toLocaleString()}</td>
                                  <td>
                                    <Badge
                                      variant={bk.status === 'PAID' || bk.status === 'DELIVERED' ? 'success' : 'warning'}
                                      className="text-[9px] font-bold uppercase rounded-full"
                                    >
                                      {bk.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </Card>

                    {/* Timeline Activity list */}
                    <Card padding="none" className="lg:col-span-4 p-5 bg-white border border-slate-100 rounded-3xl">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-50 mb-4">
                        <h3 className="text-xs font-bold text-slate-800">Database Activity logs</h3>
                      </div>

                      <div className="space-y-4">
                        {recentActivities.length === 0 ? (
                          <div className="py-12 text-center text-xs text-slate-400 font-semibold">No recent operations.</div>
                        ) : (
                          recentActivities.map((act, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                act.type === 'booking' ? 'bg-blue-600' : act.type === 'kyc' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`} />
                              <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-bold text-slate-700 leading-snug break-words">{act.text}</p>
                                <span className="text-[8px] font-semibold text-slate-400 mt-0.5 block">{act.time}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </Card>

                  </div>

                  {/* System Status cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Platform Users', value: stats.totalUsers, detail: 'Traveler & Sender accounts', icon: Users, color: 'text-blue-600 bg-blue-50' },
                      { label: 'Active Trips', value: stats.activeFlights, detail: 'Available luggage capacities', icon: Plane, color: 'text-teal-600 bg-teal-50' },
                      { label: 'Waitlist pre-launch', value: stats.waitlistCount, detail: 'Emails list size', icon: ListFilter, color: 'text-purple-600 bg-purple-50' },
                      { label: 'System status', value: 'Operational', detail: 'All systems online', icon: Activity, color: 'text-emerald-600 bg-emerald-50' }
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <Card key={i} padding="none" className="p-3.5 bg-white border border-slate-100 rounded-2xl flex items-center gap-3.5 hover:shadow-sm transition-shadow">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">{item.label}</span>
                            <div className="text-sm font-black text-slate-800 mt-0.5 leading-none">{item.value}</div>
                            <span className="text-[8px] font-bold text-slate-400 mt-1 block leading-none">{item.detail}</span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <footer className="py-4 border-t border-slate-100 flex justify-between items-center text-[9px] font-bold text-slate-400">
                    <span>© 2025 FlyoraGo Admin Panel. All rights reserved.</span>
                    <span>Made with ❤️ by FlyoraGo Team</span>
                  </footer>

                </div>
              )}

              {/* ────────────────────────────────────────────────────────────────────────
                  TAB B: KYC SUBMISSIONS (Unified reviewer pane)
                  ──────────────────────────────────────────────────────────────────────── */}
              {activeTab === 'kyc' && (
                <div className="space-y-6">
                  
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-800">KYC Verification Manager</h1>
                    <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase flex items-center gap-1.5">
                      <span>Admin</span> <span className="text-slate-300">/</span> <span className="text-slate-600">KYC</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Pane list */}
                    <Card padding="none" className="lg:col-span-4 p-4 bg-white border border-slate-100 rounded-3xl h-[calc(100vh-220px)] flex flex-col">
                      <div className="relative mb-3 shrink-0">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={12} />
                        <input
                          type="text"
                          placeholder="Search profile name..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] outline-none"
                        />
                      </div>

                      <div className="flex-1 overflow-y-auto divide-y divide-slate-50 space-y-1 scrollbar-thin">
                        {kycSubmissions.length === 0 ? (
                          <div className="py-12 text-center text-xs text-slate-400 font-semibold">No submissions found.</div>
                        ) : (
                          kycSubmissions
                            .filter(k => k.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(kyc => (
                              <div
                                key={kyc.id}
                                onClick={() => setSelectedKyc(kyc)}
                                className={`p-3 cursor-pointer rounded-2xl border transition-all flex items-center justify-between ${
                                  selectedKyc?.id === kyc.id
                                    ? 'bg-teal-50/60 border-teal-200'
                                    : 'border-transparent hover:bg-slate-50'
                                }`}
                              >
                                <div className="truncate max-w-[65%] text-left">
                                  <h4 className="font-bold text-xs text-slate-800 truncate leading-snug">{kyc.fullName}</h4>
                                  <p className="text-[9px] text-slate-400 truncate mt-0.5">{kyc.email}</p>
                                </div>
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase border ${
                                  kyc.status === 'PENDING'
                                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                                    : kyc.status === 'APPROVED'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    : 'bg-red-50 text-red-700 border-red-100'
                                }`}>
                                  {kyc.status}
                                </span>
                              </div>
                            ))
                        )}
                      </div>
                    </Card>

                    {/* Right Reviewer Pane */}
                    <Card padding="none" className="lg:col-span-8 p-5 bg-white border border-slate-100 rounded-3xl min-h-[calc(100vh-220px)] flex flex-col justify-between">
                      {selectedKyc ? (
                        <div className="space-y-5 flex-1 flex flex-col justify-between">
                          
                          {/* User Header */}
                          <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 text-left">
                            <div>
                              <h2 className="text-base font-black text-slate-800">{selectedKyc.fullName}</h2>
                              <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2 text-[10px] font-bold text-slate-500">
                                <span className="flex items-center gap-1"><Mail size={11} className="text-teal-600" /> {selectedKyc.email}</span>
                                <span className="flex items-center gap-1"><Phone size={11} className="text-teal-600" /> {selectedKyc.phone}</span>
                                <span className="uppercase text-slate-600 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-[9px]">ID: {selectedKyc.documentType}</span>
                              </div>
                            </div>

                            <span className={`text-[9px] font-black px-2.5 py-1.5 rounded-full uppercase border ${
                              selectedKyc.status === 'PENDING'
                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                : selectedKyc.status === 'APPROVED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : 'bg-red-50 text-red-700 border-red-100'
                            }`}>
                              {selectedKyc.status}
                            </span>
                          </div>

                          {/* Rejection notice */}
                          {selectedKyc.status === 'REJECTED' && (
                            <div className="p-3 bg-red-50 border border-red-100 text-red-800 text-[10px] font-bold rounded-2xl flex items-start gap-2 text-left">
                              <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                              <div>
                                <span className="block font-black uppercase text-[8px] text-red-600 mb-0.5">REJECTION REASON:</span>
                                "{selectedKyc.rejectionReason || 'No reason specified.'}"
                              </div>
                            </div>
                          )}

                          {/* Live images grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 py-2">
                            
                            <div className="space-y-1.5 flex flex-col text-left">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Document Front Side</span>
                              <div className="border border-slate-200 bg-slate-50 rounded-2xl overflow-hidden flex-1 min-h-[160px] flex items-center justify-center">
                                {selectedKyc.frontImage ? (
                                  <img src={selectedKyc.frontImage} alt="Document Front" className="w-full h-full object-contain" />
                                ) : (
                                  <span className="text-[10px] text-slate-400 font-bold">Image Missing</span>
                                )}
                              </div>
                            </div>

                            <div className="space-y-1.5 flex flex-col text-left">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Document Back Side</span>
                              <div className="border border-slate-200 bg-slate-50 rounded-2xl overflow-hidden flex-1 min-h-[160px] flex items-center justify-center">
                                {selectedKyc.backImage ? (
                                  <img src={selectedKyc.backImage} alt="Document Back" className="w-full h-full object-contain" />
                                ) : (
                                  <span className="text-[10px] text-slate-400 font-bold">Not Uploaded / Optional</span>
                                )}
                              </div>
                            </div>

                            <div className="space-y-1.5 flex flex-col text-left">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Verification Selfie</span>
                              <div className="border border-slate-200 bg-slate-50 rounded-2xl overflow-hidden flex-1 min-h-[160px] flex items-center justify-center">
                                {selectedKyc.selfieImage ? (
                                  <img src={selectedKyc.selfieImage} alt="Selfie" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-[10px] text-slate-400 font-bold">Selfie Missing</span>
                                )}
                              </div>
                            </div>

                          </div>

                          {/* Review buttons */}
                          {selectedKyc.status === 'PENDING' && (
                            <div className="pt-3 border-t border-slate-100 flex gap-2 justify-end shrink-0">
                              <button
                                onClick={() => setIsRejectModalOpen(true)}
                                disabled={actionLoading}
                                className="flex items-center gap-1 px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 font-bold text-[10px] rounded-xl"
                              >
                                <X size={13} />
                                Reject
                              </button>
                              <button
                                onClick={() => handleKycAction('APPROVE')}
                                disabled={actionLoading}
                                className="flex items-center gap-1 px-6 py-2 bg-flyora-teal text-white hover:bg-teal-700 font-bold text-[10px] rounded-xl"
                              >
                                <Check size={13} />
                                Approve Profile
                              </button>
                            </div>
                          )}

                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-20 space-y-2">
                          <ShieldAlert size={32} className="text-slate-300 animate-pulse" />
                          <h4 className="font-bold text-slate-800 text-xs">No Submission Selected</h4>
                          <p className="text-[10px] text-slate-400 max-w-xs mx-auto">Select a KYC submission record from the list on the left to begin audit.</p>
                        </div>
                      )}
                    </Card>

                  </div>

                </div>
              )}

              {/* ────────────────────────────────────────────────────────────────────────
                  TAB C: USER ACCOUNTS TABLE
                  ──────────────────────────────────────────────────────────────────────── */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-800">User Accounts</h1>
                    <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase flex items-center gap-1.5">
                      <span>Admin</span> <span className="text-slate-300">/</span> <span className="text-slate-600">Users</span>
                    </div>
                  </div>

                  <Card padding="none" className="p-4 bg-white border border-slate-100 rounded-3xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider py-3">
                            <th className="py-2.5">Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>App Role</th>
                            <th>KYC Status</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                          {filteredUsers.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-6 text-center text-slate-400 font-semibold">No matching profiles found.</td>
                            </tr>
                          ) : (
                            filteredUsers.map(usr => (
                              <tr key={usr.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 font-bold text-slate-800">{usr.fullName}</td>
                                <td>{usr.email}</td>
                                <td>{usr.phone || 'N/A'}</td>
                                <td>
                                  <span className="capitalize font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[9px]">
                                    {usr.role}
                                  </span>
                                </td>
                                <td>
                                  <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase border ${
                                    usr.kycStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                                  }`}>
                                    {usr.kycStatus}
                                  </span>
                                </td>
                                <td>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                    usr.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {usr.isActive ? 'Active' : 'Suspended'}
                                  </span>
                                </td>
                                <td className="text-right">
                                  <button
                                    onClick={() => handleToggleUserStatus(usr.id)}
                                    className={`px-3 py-1 border text-[9px] font-bold rounded-lg ${
                                      usr.isActive ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                                    }`}
                                  >
                                    {usr.isActive ? 'Suspend' : 'Activate'}
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────────────────────
                  TAB D: TRIP LISTINGS
                  ──────────────────────────────────────────────────────────────────────── */}
              {activeTab === 'trips' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-800">Trip Listings (Flights)</h1>
                    <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase flex items-center gap-1.5">
                      <span>Admin</span> <span className="text-slate-300">/</span> <span className="text-slate-600">Trips</span>
                    </div>
                  </div>

                  <Card padding="none" className="p-4 bg-white border border-slate-100 rounded-3xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider py-3">
                            <th className="py-2.5">Carrier</th>
                            <th>Route</th>
                            <th>Travel Date</th>
                            <th>Available Weight</th>
                            <th>Pricing / KG</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                          {filteredTrips.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-6 text-center text-slate-400 font-semibold">No trip routes listed.</td>
                            </tr>
                          ) : (
                            filteredTrips.map(tr => (
                              <tr key={tr.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 font-bold text-slate-800">{tr.fullName}</td>
                                <td className="font-bold text-blue-600">{tr.fromCity} ➔ {tr.toCity}</td>
                                <td>{new Date(tr.travelDate).toLocaleDateString()}</td>
                                <td>{tr.availableWeight} kg</td>
                                <td className="font-bold text-slate-800">₹ {tr.pricePerKg}</td>
                                <td>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                    tr.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {tr.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────────────────────
                  TAB E: SHIPMENT LISTINGS
                  ──────────────────────────────────────────────────────────────────────── */}
              {activeTab === 'shipments' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-800">Shipment Listings (Parcels)</h1>
                    <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase flex items-center gap-1.5">
                      <span>Admin</span> <span className="text-slate-300">/</span> <span className="text-slate-600">Shipments</span>
                    </div>
                  </div>

                  <Card padding="none" className="p-4 bg-white border border-slate-100 rounded-3xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider py-3">
                            <th className="py-2.5">Sender</th>
                            <th>Parcel Title</th>
                            <th>Route</th>
                            <th>Deadline</th>
                            <th>Weight</th>
                            <th>Category</th>
                            <th>Amount Offer</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                          {filteredShipments.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="py-6 text-center text-slate-400 font-semibold">No parcel shipments found.</td>
                            </tr>
                          ) : (
                            filteredShipments.map(sh => (
                              <tr key={sh.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 font-bold text-slate-800">{sh.fullName}</td>
                                <td className="font-bold text-slate-800">{sh.title}</td>
                                <td className="font-bold text-blue-600">{sh.fromCity} ➔ {sh.toCity}</td>
                                <td>{new Date(sh.deliveryDeadline).toLocaleDateString()}</td>
                                <td>{sh.weight} kg</td>
                                <td className="capitalize font-semibold text-slate-500">{sh.category}</td>
                                <td className="font-bold text-slate-800">₹ {sh.pricePaid.toLocaleString()}</td>
                                <td>
                                  <Badge
                                    variant={sh.status === 'PENDING' ? 'warning' : sh.status === 'MATCHED' ? 'blue' : 'success'}
                                    className="text-[9px] font-bold uppercase rounded-full"
                                  >
                                    {sh.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────────────────────
                  TAB F: BOOKING MATCHES
                  ──────────────────────────────────────────────────────────────────────── */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-800">Booking Matches</h1>
                    <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase flex items-center gap-1.5">
                      <span>Admin</span> <span className="text-slate-300">/</span> <span className="text-slate-600">Bookings</span>
                    </div>
                  </div>

                  <Card padding="none" className="p-4 bg-white border border-slate-100 rounded-3xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider py-3">
                            <th className="py-2.5">Booking ID</th>
                            <th>Carrier (Traveler)</th>
                            <th>Sender</th>
                            <th>Route & Date</th>
                            <th>Matched Weight</th>
                            <th>Escrow Payment</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                          {filteredBookings.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-6 text-center text-slate-400 font-semibold">No bookings matched yet.</td>
                            </tr>
                          ) : (
                            filteredBookings.map(bk => (
                              <tr key={bk.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 font-bold text-blue-600">#{bk.id.substring(0, 8).toUpperCase()}</td>
                                <td>{bk.travelerName}</td>
                                <td>{bk.senderName}</td>
                                <td>
                                  <div className="font-bold text-slate-800">{bk.fromCity} ➔ {bk.toCity}</div>
                                  <span className="text-[9px] text-slate-400">{new Date(bk.travelDate).toLocaleDateString()}</span>
                                </td>
                                <td>{bk.matchedWeight} kg</td>
                                <td className="font-bold text-slate-800">₹ {bk.totalAmount.toLocaleString()}</td>
                                <td>
                                  <Badge
                                    variant={bk.status === 'PAID' || bk.status === 'DELIVERED' ? 'success' : 'warning'}
                                    className="text-[9px] font-bold uppercase rounded-full"
                                  >
                                    {bk.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────────────────────
                  TAB G: USER REVIEWS
                  ──────────────────────────────────────────────────────────────────────── */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-800">User Reviews</h1>
                    <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase flex items-center gap-1.5">
                      <span>Admin</span> <span className="text-slate-300">/</span> <span className="text-slate-600">Reviews</span>
                    </div>
                  </div>

                  <Card padding="none" className="p-4 bg-white border border-slate-100 rounded-3xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider py-3">
                            <th className="py-2.5">From</th>
                            <th>To</th>
                            <th>Rating</th>
                            <th>Comment</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                          {reviewsList.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-6 text-center text-slate-400 font-semibold">No feedback reviews registered.</td>
                            </tr>
                          ) : (
                            reviewsList.map(rv => (
                              <tr key={rv.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 font-bold text-slate-800">{rv.reviewerName}</td>
                                <td className="font-bold text-slate-800">{rv.revieweeName}</td>
                                <td>
                                  <div className="flex gap-0.5 text-amber-400">
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                      <Star key={idx} size={11} fill={idx < rv.rating ? 'currentColor' : 'none'} className="shrink-0" />
                                    ))}
                                  </div>
                                </td>
                                <td className="italic text-slate-500">"{rv.comment || 'No text'}"</td>
                                <td className="text-slate-400">{new Date(rv.createdAt).toLocaleDateString()}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────────────────────
                  TAB H: WAITLIST SIGNUPS
                  ──────────────────────────────────────────────────────────────────────── */}
              {activeTab === 'waitlist' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-800">Waitlist Registrations</h1>
                    <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase flex items-center gap-1.5">
                      <span>Admin</span> <span className="text-slate-300">/</span> <span className="text-slate-600">Waitlist</span>
                    </div>
                  </div>

                  <Card padding="none" className="p-4 bg-white border border-slate-100 rounded-3xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider py-3">
                            <th className="py-2.5">Email Address</th>
                            <th>Name</th>
                            <th>Intended Role</th>
                            <th>Registration Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                          {waitlistList.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="py-6 text-center text-slate-400 font-semibold">No waitlist entries.</td>
                            </tr>
                          ) : (
                            waitlistList.map(entry => (
                              <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 font-bold text-slate-800">{entry.email}</td>
                                <td>{entry.name || 'Anonymous'}</td>
                                <td>
                                  <span className="capitalize font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[9px]">
                                    {entry.role || 'Not specified'}
                                  </span>
                                </td>
                                <td className="text-slate-400">{new Date(entry.createdAt).toLocaleDateString()}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────────────────────
                  TAB I: SYSTEM SETTINGS
                  ──────────────────────────────────────────────────────────────────────── */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-xl animate-slide-up">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-800">System Settings</h1>
                    <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase flex items-center gap-1.5">
                      <span>Admin</span> <span className="text-slate-300">/</span> <span className="text-slate-600">Settings</span>
                    </div>
                  </div>

                  <Card className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-flyora-teal flex items-center justify-center border border-teal-100">
                        <Settings size={18} className="animate-spin-slow" />
                      </div>
                      <div>
                        <h2 className="text-sm font-black text-slate-900">Security Credentials</h2>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Manage administrative log-in attributes</p>
                      </div>
                    </div>

                    {settingsMsg && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2 animate-fade-in">
                        <Check size={16} className="shrink-0" />
                        <span>{settingsMsg}</span>
                      </div>
                    )}

                    {settingsError && (
                      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2 animate-shake">
                        <ShieldAlert size={16} className="shrink-0" />
                        <span>{settingsError}</span>
                      </div>
                    )}

                    <form className="space-y-5" onSubmit={handleUpdateAdminCredentials}>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">New Admin Username</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. admin"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">New Secret Passkey</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold focus:border-flyora-teal text-slate-700 bg-white"
                        />
                      </div>

                      <Button variant="teal" type="submit" disabled={settingsLoading} className="w-full py-3.5 shadow-teal font-black text-xs">
                        {settingsLoading ? 'Saving credentials...' : 'Update Admin Credentials'}
                      </Button>
                    </form>
                  </Card>
                </div>
              )}

            </>
          )}

        </main>
      </div>

      {/* KYC REJECTION MODAL */}
      {isRejectModalOpen && selectedKyc && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-500 font-bold text-base">
              <Ban size={20} />
              Reject KYC Submission
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Specify reason for declining <span className="font-bold text-slate-800">{selectedKyc.fullName}</span>'s KYC submission:
            </p>

            <textarea
              placeholder="e.g. Photo ID was blurred. Please resubmit."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full h-28 px-3.5 py-2.5 border border-slate-200 rounded-2xl text-xs font-semibold outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all text-slate-700"
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleKycAction('REJECT')}
                disabled={actionLoading || !rejectionReason.trim()}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                {actionLoading ? 'Declining...' : 'Decline KYC'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
