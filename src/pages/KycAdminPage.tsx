import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plane, Shield, Check, X, RefreshCw, 
  Search, Loader2, AlertCircle, Calendar, Phone, Mail, 
  Ban, FileText 
} from 'lucide-react';
import Button from '../components/ui/Button';

interface KycSubmission {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  documentType: 'national_id' | 'passport';
  frontImage: string;
  backImage: string;
  selfieImage: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  submittedAt: string;
}

const KycAdminPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<KycSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedKyc, setSelectedKyc] = useState<KycSubmission | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Rejection Modal state
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Fetch KYC Submissions
  const fetchSubmissions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/kyc/admin/list');
      if (!response.ok) {
        throw new Error('Failed to fetch KYC list');
      }
      const data = await response.json();
      const list = data.data as KycSubmission[];
      
      // Sort: PENDING first, then by date descending
      const sorted = list.sort((a, b) => {
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      });

      setSubmissions(sorted);
      
      // Keep previously selected if still exists, otherwise select first pending
      if (sorted.length > 0) {
        const findSelected = selectedKyc ? sorted.find(s => s.userId === selectedKyc.userId) : null;
        setSelectedKyc(findSelected || sorted[0]);
      } else {
        setSelectedKyc(null);
      }
    } catch (err: any) {
      setError(err.message || 'Could not fetch list. Verify backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Approve / Reject handler
  const handleAction = async (action: 'APPROVE' | 'REJECT') => {
    if (!selectedKyc) return;
    setIsActionLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/kyc/admin/action', {
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
      await fetchSubmissions();
    } catch (err: any) {
      alert(err.message || 'Something went wrong');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Filter & Search submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchesFilter = filter === 'ALL' || sub.status === filter;
    const matchesSearch = 
      sub.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-flyora-navy text-white px-6 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-flyora-teal to-flyora-teal-light flex items-center justify-center shadow-teal">
              <Plane size={18} className="text-white transform -rotate-45" />
            </div>
            <span className="text-xl font-black text-white">fly<span className="text-flyora-teal">ora</span></span>
            <span className="bg-flyora-teal text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full ml-1">Admin Dashboard</span>
          </Link>

          <Button variant="teal" size="sm" className="flex items-center gap-1.5" onClick={fetchSubmissions}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left column: Submissions List */}
        <div className="w-full lg:w-1/3 flex flex-col bg-white border border-gray-200 rounded-3xl p-4 shadow-sm h-[calc(100vh-180px)] overflow-hidden">
          <div className="space-y-3 pb-3 border-b border-gray-100">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-flyora-teal focus:ring-1 focus:ring-flyora-teal/30 transition-all font-medium text-flyora-navy"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-gray-50 border border-gray-100 rounded-xl p-1 text-[10px] font-bold">
              {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${
                    filter === tab 
                      ? 'bg-white text-flyora-teal shadow-sm border border-gray-100/50' 
                      : 'text-gray-400 hover:text-flyora-navy'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Submissions scrollable container */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 mt-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="text-flyora-teal animate-spin mb-2" size={24} />
                <span className="text-xs text-gray-400 font-bold">Retrieving records...</span>
              </div>
            ) : error ? (
              <div className="p-4 text-center space-y-2">
                <AlertCircle size={32} className="text-red-500 mx-auto" />
                <p className="text-xs text-red-500 font-semibold">{error}</p>
                <Button variant="secondary" size="sm" onClick={fetchSubmissions}>Retry</Button>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="py-16 text-center text-xs text-gray-400 font-semibold">
                No submissions found.
              </div>
            ) : (
              filteredSubmissions.map(sub => (
                <div 
                  key={sub.userId}
                  onClick={() => setSelectedKyc(sub)}
                  className={`p-3.5 cursor-pointer rounded-2xl transition-all duration-200 flex items-center justify-between ${
                    selectedKyc?.userId === sub.userId 
                      ? 'bg-flyora-teal/5 border border-flyora-teal/20' 
                      : 'border border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="space-y-1 truncate max-w-[70%]">
                    <h3 className="font-bold text-xs text-flyora-navy truncate">{sub.fullName}</h3>
                    <p className="text-[10px] text-gray-400 truncate">{sub.email}</p>
                    <div className="text-[9px] text-gray-400 flex items-center gap-1">
                      <Calendar size={10} />
                      <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${
                    sub.status === 'PENDING' 
                      ? 'bg-amber-50 text-amber-700 border-amber-100'
                      : sub.status === 'APPROVED'
                      ? 'bg-green-50 text-green-700 border-green-100'
                      : 'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {sub.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column: Document Details / Previews */}
        <div className="flex-1 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm min-h-[calc(100vh-180px)] overflow-y-auto flex flex-col justify-between">
          {selectedKyc ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              
              {/* User details row */}
              <div className="pb-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-xl font-bold text-flyora-navy">{selectedKyc.fullName}</h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail size={12} className="text-flyora-teal" />
                      <span>{selectedKyc.email}</span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Phone size={12} className="text-flyora-teal" />
                      <span>{selectedKyc.phone}</span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <FileText size={12} className="text-flyora-teal" />
                      <span className="font-bold text-flyora-navy uppercase">
                        {selectedKyc.documentType === 'national_id' ? 'National ID' : 'Passport'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${
                    selectedKyc.status === 'PENDING' 
                      ? 'bg-amber-50 text-amber-700 border-amber-100'
                      : selectedKyc.status === 'APPROVED'
                      ? 'bg-green-50 text-green-700 border-green-100'
                      : 'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {selectedKyc.status}
                  </span>
                </div>
              </div>

              {/* Status Reason Banner if REJECTED */}
              {selectedKyc.status === 'REJECTED' && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-800 text-xs font-bold rounded-xl flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-black uppercase text-[9px] text-red-600 mb-0.5">Rejection Reason</span>
                    "{selectedKyc.rejectionReason}"
                  </div>
                </div>
              )}

              {/* Image Previews Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 flex-1">
                {/* Front ID */}
                <div className="space-y-2 flex flex-col">
                  <span className="text-xs font-bold text-flyora-navy">
                    {selectedKyc.documentType === 'national_id' ? 'Front Side of ID' : 'Passport Photo Page'}
                  </span>
                  <div className="border border-gray-200 bg-gray-50 rounded-2xl overflow-hidden flex-1 min-h-[160px] flex items-center justify-center relative group">
                    {selectedKyc.frontImage ? (
                      <img src={selectedKyc.frontImage} alt="Front ID" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs text-gray-400 font-semibold">No Image</span>
                    )}
                  </div>
                </div>

                {/* Back Document (Optional) */}
                <div className="space-y-2 flex flex-col">
                  <span className="text-xs font-bold text-flyora-navy">
                    {selectedKyc.documentType === 'national_id' ? 'Back Side of ID' : 'Back Side of Passport (Optional)'}
                  </span>
                  <div className="border border-gray-200 bg-gray-50 rounded-2xl overflow-hidden flex-1 min-h-[160px] flex items-center justify-center relative group">
                    {selectedKyc.backImage ? (
                      <img src={selectedKyc.backImage} alt="Back Document" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs text-gray-400 font-semibold">Not Uploaded</span>
                    )}
                  </div>
                </div>

                {/* Selfie */}
                <div className="space-y-2 flex flex-col">
                  <span className="text-xs font-bold text-flyora-navy">Live Selfie Verification</span>
                  <div className="border border-gray-200 bg-gray-50 rounded-2xl overflow-hidden flex-1 min-h-[160px] flex items-center justify-center relative group">
                    {selectedKyc.selfieImage ? (
                      <img src={selectedKyc.selfieImage} alt="Selfie" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-400 font-semibold">No Image</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons (Approve/Reject) */}
              {selectedKyc.status === 'PENDING' && (
                <div className="pt-4 border-t border-gray-100 flex gap-3 justify-end">
                  <Button 
                    variant="secondary" 
                    className="flex items-center gap-1.5 px-6 border-red-200 text-red-500 hover:bg-red-50/50"
                    onClick={() => setIsRejectModalOpen(true)}
                    disabled={isActionLoading}
                  >
                    <X size={16} />
                    Reject Submission
                  </Button>
                  <Button 
                    variant="teal" 
                    className="flex items-center gap-1.5 px-8"
                    onClick={() => handleAction('APPROVE')}
                    disabled={isActionLoading}
                  >
                    <Check size={16} />
                    Approve & Verify
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20 space-y-3">
              <Shield size={48} className="text-gray-300" />
              <h3 className="text-base font-bold text-flyora-navy">Select a Submission</h3>
              <p className="text-xs text-gray-400 max-w-xs">Select any registration document from the list on the left to begin identification review.</p>
            </div>
          )}
        </div>
      </main>

      {/* Rejection Modal overlay */}
      {isRejectModalOpen && selectedKyc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-500 font-bold text-base">
              <Ban size={20} />
              Reject KYC Submission
            </div>
            
            <p className="text-xs text-gray-500 leading-relaxed">
              Please specify the reason for declining <span className="font-bold text-flyora-navy">{selectedKyc.fullName}</span>'s KYC. This message will be displayed to the user so they can correct their documents.
            </p>

            <textarea
              placeholder="e.g. The photo of the front side of your ID card was blurred and illegible. Please submit a clearer image."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full h-28 px-3 py-2 border border-gray-200 rounded-2xl text-xs font-semibold outline-none focus:border-red-500 transition-all text-flyora-navy"
            />

            <div className="flex gap-2 justify-end">
              <Button variant="secondary" size="sm" onClick={() => {
                setIsRejectModalOpen(false);
                setRejectionReason('');
              }}>
                Cancel
              </Button>
              <Button 
                variant="teal" 
                size="sm" 
                className="bg-red-500 hover:bg-red-600 border-red-500 text-white font-bold"
                onClick={() => handleAction('REJECT')}
                disabled={isActionLoading || !rejectionReason.trim()}
              >
                {isActionLoading ? 'Declining...' : 'Decline KYC'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 border-t border-gray-100 bg-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
          <span>© 2025 Flyora Admin Panel. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-flyora-navy transition-colors">Admin Policy</a>
            <a href="#" className="hover:text-flyora-navy transition-colors">Compliance Log</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KycAdminPage;
