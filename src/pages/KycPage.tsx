import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plane, Shield, CheckCircle, AlertCircle, 
  Camera, Upload, Trash2, User, FileText, Check, 
  ShieldAlert, Loader2, RefreshCw 
} from 'lucide-react';
import Button from '../components/ui/Button';

const KycPage: React.FC = () => {
  const userId = localStorage.getItem('flyora_user_id');
  const userName = localStorage.getItem('flyora_user_name') || 'User';

  // State for current view: 'SUBMIT' or 'STATUS'
  const [viewMode, setViewMode] = useState<'SUBMIT' | 'STATUS'>('SUBMIT');
  const [kycStatus, setKycStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_SUBMITTED'>('NOT_SUBMITTED');
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Submit wizard steps: 1 (Doc type), 2 (Uploads), 3 (Selfie), 4 (Submitting)
  const [step, setStep] = useState(1);
  const [documentType, setDocumentType] = useState<'national_id' | 'passport'>('national_id');
  
  // Upload base64 strings
  const [frontImage, setFrontImage] = useState<string>('');
  const [backImage, setBackImage] = useState<string>('');
  const [selfieImage, setSelfieImage] = useState<string>('');

  // Camera states
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // General loaders
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);

  // Fetch current KYC status
  const fetchStatus = async () => {
    if (!userId) {
      setIsPageLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/kyc/status/${userId}`);
      if (response.ok) {
        const data = await response.json();
        const status = data.data.status;
        setKycStatus(status);
        if (status === 'REJECTED') {
          setRejectionReason(data.data.rejectionReason || 'Documents did not meet our verification criteria.');
        }
        
        if (status !== 'NOT_SUBMITTED') {
          setViewMode('STATUS');
        } else {
          setViewMode('SUBMIT');
        }
      }
    } catch (error) {
      console.error('Failed to fetch KYC status:', error);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [userId]);

  // Clean up camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Start Camera
  const startCamera = async () => {
    setCameraError(false);
    try {
      let stream;
      try {
        // Try user-facing camera with standard aspect ratio/resolution negotiation
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' } 
        });
      } catch (e) {
        // Fallback to any active video camera source
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: true 
        });
      }
      
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      console.error('Error starting camera:', err);
      setCameraError(true);
      setCameraActive(false);
    }
  };

  // Bind video stream to element once it is mounted in the DOM
  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => {
        console.error('Video play failed:', err);
      });
    }
  }, [cameraActive]);

  // Capture Selfie
  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;
      const size = Math.min(width, height);
      
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Mirror the selfie preview
        ctx.translate(size, 0);
        ctx.scale(-1, 1);
        
        // Crop and draw the center square of the video feed
        const sx = (width - size) / 2;
        const sy = (height - size) / 2;
        ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setSelfieImage(dataUrl);
        stopCamera();
      }
    }
  };

  // Convert files to base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back' | 'selfie') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (side === 'front') setFrontImage(base64String);
      if (side === 'back') setBackImage(base64String);
      if (side === 'selfie') setSelfieImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  // Submit KYC Details to API
  const handleKycSubmit = async () => {
    if (!userId) return;
    setIsSubmitting(true);
    setSubmitProgress(15);

    try {
      setSubmitProgress(45);
      const response = await fetch('http://localhost:5000/api/kyc/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          documentType,
          frontImage,
          backImage: backImage || undefined,
          selfieImage,
        }),
      });

      setSubmitProgress(80);
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || 'Verification submission failed');
      }

      setSubmitProgress(100);
      setTimeout(() => {
        setKycStatus('PENDING');
        setViewMode('STATUS');
        setIsSubmitting(false);
      }, 500);
    } catch (error) {
      console.error(error);
      alert('Failed to submit verification. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setFrontImage('');
    setBackImage('');
    setSelfieImage('');
    setStep(1);
    setViewMode('SUBMIT');
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-flyora-navy mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6 text-sm">Please sign up first before accessing the KYC Verification flow.</p>
          <Link to="/signup">
            <Button variant="teal" fullWidth>Go to Sign Up</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 size={40} className="text-flyora-teal animate-spin mb-4" />
        <p className="text-sm text-gray-500 font-bold">Securing session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Premium Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-flyora-teal to-flyora-teal-light flex items-center justify-center shadow-teal">
              <Plane size={18} className="text-white transform -rotate-45" />
            </div>
            <span className="text-xl font-black text-flyora-navy">fly<span className="text-flyora-teal">ora</span></span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <Shield size={14} className="text-flyora-teal" />
            <span>Secure 256-bit Encryption</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 flex flex-col justify-center">
        {viewMode === 'SUBMIT' ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
            {/* Progress indicators */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
              <div>
                <span className="text-xs font-bold text-flyora-teal uppercase tracking-wider">Step {step} of 3</span>
                <h1 className="text-xl sm:text-2xl font-bold text-flyora-navy">
                  {step === 1 && 'Choose Document Type'}
                  {step === 2 && 'Upload Identification Document'}
                  {step === 3 && 'Take a Live Selfie'}
                </h1>
              </div>
              
              {/* Dots */}
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div 
                    key={s} 
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      s === step ? 'w-8 bg-flyora-teal' : s < step ? 'w-2.5 bg-flyora-teal/40' : 'w-2.5 bg-gray-200'
                    }`} 
                  />
                ))}
              </div>
            </div>

            {/* STEP 1: Document Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <p className="text-sm text-gray-500">
                  Welcome, <span className="font-bold text-flyora-navy">{userName}</span>. To secure transactions, comply with global shipping regulations, and build traveler trust, please verify your identity.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* National ID card */}
                  <div 
                    onClick={() => setDocumentType('national_id')}
                    className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 flex flex-col justify-between h-44 ${
                      documentType === 'national_id' 
                        ? 'border-flyora-teal bg-flyora-teal/5 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      documentType === 'national_id' ? 'bg-flyora-teal text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-flyora-navy text-base">National ID Card</h3>
                      <p className="text-xs text-gray-500 mt-1">Driving license, Aadhaar card, or government identity card.</p>
                    </div>
                  </div>

                  {/* Passport */}
                  <div 
                    onClick={() => setDocumentType('passport')}
                    className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 flex flex-col justify-between h-44 ${
                      documentType === 'passport' 
                        ? 'border-flyora-teal bg-flyora-teal/5 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      documentType === 'passport' ? 'bg-flyora-teal text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-flyora-navy text-base">International Passport</h3>
                      <p className="text-xs text-gray-500 mt-1">Passport book bio page showing name, photo and passport number.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-xs text-blue-800 mt-4 leading-relaxed font-semibold">
                  <Shield size={18} className="text-blue-500 shrink-0" />
                  <p>Your identification documents are securely stored using advanced encryption algorithms. They are used exclusively for verification and will never be shared.</p>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button variant="teal" className="px-8 py-3" onClick={() => setStep(2)}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: File Uploads */}
            {step === 2 && (
              <div className="space-y-6">
                <p className="text-sm text-gray-500">
                  Please upload clear, legible photos of your {documentType === 'national_id' ? 'National ID Card' : 'International Passport'}.
                </p>

                <div className="space-y-6">
                  {/* Front Side */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-flyora-navy">
                      {documentType === 'national_id' ? 'Front Side of ID (Required)' : 'Passport Bio Page (Required)'}
                    </label>
                    
                    {frontImage ? (
                      <div className="relative border border-gray-200 rounded-2xl overflow-hidden h-44 bg-gray-50 flex items-center justify-center">
                        <img src={frontImage} alt="ID Front Preview" className="h-full object-contain" />
                        <button 
                          onClick={() => setFrontImage('')}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-gray-200 hover:border-flyora-teal rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 h-44 bg-gray-50/50 hover:bg-white group">
                        <Upload size={28} className="text-gray-400 group-hover:text-flyora-teal mb-3 transition-colors" />
                        <span className="text-sm font-bold text-flyora-navy group-hover:text-flyora-teal transition-colors">Click to upload photo</span>
                        <span className="text-xs text-gray-400 mt-1">Supports PNG, JPG, or PDF up to 10MB</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, 'front')} 
                        />
                      </label>
                    )}
                  </div>

                  {/* Back Side */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-flyora-navy">
                      {documentType === 'national_id' ? 'Back Side of ID (Optional)' : 'Back Side of Passport (Optional)'}
                    </label>
                    
                    {backImage ? (
                      <div className="relative border border-gray-200 rounded-2xl overflow-hidden h-44 bg-gray-50 flex items-center justify-center">
                        <img src={backImage} alt="ID Back Preview" className="h-full object-contain" />
                        <button 
                          onClick={() => setBackImage('')}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-gray-200 hover:border-flyora-teal rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 h-44 bg-gray-50/50 hover:bg-white group">
                        <Upload size={28} className="text-gray-400 group-hover:text-flyora-teal mb-3 transition-colors" />
                        <span className="text-sm font-bold text-flyora-navy group-hover:text-flyora-teal transition-colors">Click to upload photo</span>
                        <span className="text-xs text-gray-400 mt-1">Supports PNG, JPG, or PDF up to 10MB</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, 'back')} 
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="pt-6 flex justify-between">
                  <Button variant="secondary" className="px-6 py-3" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button 
                    variant="teal" 
                    className="px-8 py-3" 
                    onClick={() => setStep(3)}
                    disabled={!frontImage}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Selfie Capture */}
            {step === 3 && (
              <div className="space-y-6">
                <p className="text-sm text-gray-500">
                  Please take a live selfie using your device's camera to verify that your face matches the photo on your identification card.
                </p>

                <div className="flex flex-col items-center justify-center py-4">
                  {selfieImage ? (
                    // Captured image preview
                    <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-flyora-teal shadow-lg bg-gray-50">
                      <img src={selfieImage} alt="Selfie Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setSelfieImage('')}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-red-500 text-white font-bold text-xs shadow-md hover:bg-red-600 transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 size={12} />
                        Retake Photo
                      </button>
                    </div>
                  ) : cameraActive ? (
                    // Active video feed
                    <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-flyora-teal shadow-lg bg-black">
                      <video 
                        ref={videoRef} 
                        className="w-full h-full object-cover scale-x-[-1]"
                        autoPlay
                        playsInline
                        muted
                      />
                      <button 
                        onClick={capturePhoto}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white text-flyora-teal flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                      >
                        <Camera size={22} />
                      </button>
                    </div>
                  ) : (
                    // Camera start option
                    <div className="flex flex-col items-center gap-6 w-full max-w-md">
                      <button 
                        onClick={startCamera}
                        className="w-64 h-64 rounded-full border-4 border-dashed border-gray-200 hover:border-flyora-teal flex flex-col items-center justify-center bg-gray-50 hover:bg-white cursor-pointer transition-all duration-200 group"
                      >
                        <Camera size={40} className="text-gray-400 group-hover:text-flyora-teal mb-3 transition-colors" />
                        <span className="text-sm font-bold text-flyora-navy group-hover:text-flyora-teal transition-colors">Start Camera</span>
                        <span className="text-xs text-gray-400 mt-1">Requires camera permission</span>
                      </button>
                    </div>
                  )}

                  {cameraError && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-100 text-amber-800 text-xs font-semibold rounded-xl text-center">
                      Could not access camera. Please check your camera connection and allow camera permissions in your browser.
                    </div>
                  )}
                </div>

                <div className="pt-6 flex justify-between">
                  <Button variant="secondary" className="px-6 py-3" onClick={() => {
                    stopCamera();
                    setStep(2);
                  }}>
                    Back
                  </Button>
                  <Button 
                    variant="teal" 
                    className="px-8 py-3" 
                    onClick={handleKycSubmit}
                    disabled={!selfieImage}
                  >
                    Submit Verification
                  </Button>
                </div>
              </div>
            )}

            {/* Submitting progress overlay */}
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8">
                <Loader2 size={44} className="text-flyora-teal animate-spin mb-4" />
                <h3 className="text-lg font-bold text-flyora-navy mb-1">Encrypting & Uploading Documents</h3>
                <p className="text-xs text-gray-500 mb-6 text-center max-w-xs">Your documents are processed securely using 256-bit SSL encryption protocols.</p>
                <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-flyora-teal transition-all duration-300" style={{ width: `${submitProgress}%` }} />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* STATUS SCREEN MODE */
          <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-sm text-center">
            {/* PENDING / UNDER REVIEW */}
            {kycStatus === 'PENDING' && (
              <div className="space-y-6">
                <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto animate-pulse">
                  <Shield size={40} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-flyora-navy mb-2">Verification Under Review</h2>
                  <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                    Our compliance team is currently reviewing your identity documents. This verification typically takes a few minutes. Thank you for your patience!
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left max-w-md mx-auto text-xs text-amber-800 leading-relaxed font-semibold">
                  <ShieldAlert size={18} className="text-amber-500 shrink-0 inline mr-2 align-text-bottom" />
                  While under review, you can browse verified travel shipments but cannot request bookings or register package transfers. We will email you once approved.
                </div>

                <div className="pt-6 max-w-xs mx-auto">
                  <Link to="/">
                    <Button variant="teal" fullWidth>Go to Homepage</Button>
                  </Link>
                </div>
              </div>
            )}

            {/* APPROVED / SUCCESS */}
            {kycStatus === 'APPROVED' && (
              <div className="space-y-6">
                <div className="w-20 h-20 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto shadow-sm shadow-green-100">
                  <CheckCircle size={44} />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-100 text-green-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                    <Check size={12} strokeWidth={3} />
                    Identity Verified
                  </div>
                  <h2 className="text-2xl font-bold text-flyora-navy mb-2">Verification Approved!</h2>
                  <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                    Congratulations, <span className="font-bold text-flyora-navy">{userName}</span>. Your KYC verification was successful. You are now a trusted and verified member of the Flyora community.
                  </p>
                </div>

                <div className="border border-gray-100 rounded-2xl p-6 max-w-md mx-auto grid grid-cols-3 gap-3 bg-gray-50/50">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-flyora-teal/10 text-flyora-teal flex items-center justify-center mb-1">
                      <Check size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-bold text-flyora-navy">Global Shipping</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-flyora-teal/10 text-flyora-teal flex items-center justify-center mb-1">
                      <Check size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-bold text-flyora-navy">Escrow Protection</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-flyora-teal/10 text-flyora-teal flex items-center justify-center mb-1">
                      <Check size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-bold text-flyora-navy">Trusted Traveler</span>
                  </div>
                </div>

                <div className="pt-6 max-w-xs mx-auto">
                  <Link to="/">
                    <Button variant="teal" fullWidth>Go to Homepage</Button>
                  </Link>
                </div>
              </div>
            )}

            {/* REJECTED */}
            {kycStatus === 'REJECTED' && (
              <div className="space-y-6">
                <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                  <AlertCircle size={44} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-flyora-navy mb-2">Verification Declined</h2>
                  <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                    We were unable to approve your KYC verification because:
                  </p>
                  <div className="mt-3 p-4 bg-red-50 border border-red-100 text-red-800 text-sm font-bold rounded-2xl max-w-md mx-auto text-center leading-relaxed">
                    "{rejectionReason}"
                  </div>
                </div>

                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Please ensure your document images are clear, legible, completely visible, and that your selfie is taken in a well-lit environment.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                  <Button variant="teal" className="flex-1" onClick={handleRetry}>
                    Retry Verification
                  </Button>
                  <Link to="/" className="flex-1">
                    <Button variant="secondary" fullWidth>Cancel</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-100 bg-white px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
          <span>© 2025 Flyora. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-flyora-navy transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-flyora-navy transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-flyora-navy transition-colors">Compliance support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KycPage;
