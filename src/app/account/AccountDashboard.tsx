"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, ShoppingBag, Heart, Award, MapPin, Shield, Bell, 
  Trash2, Plus, Edit2, Check, RefreshCw, ChevronRight, FileText, 
  Lock, Smartphone, Key, Star, Clock, AlertTriangle, Eye, EyeOff, Sparkles
} from "lucide-react";
import { Footer } from "@/components/home/HomeSections";
import Navbar from "@/components/layout/Navbar";


// Mock WooCommerce Products for Wishlist / Recently Viewed
const productsList = [
  { id: "p1", name: "0-GRAVITY HOODIE", price: 120, oldPrice: 150, image: "/prod-hoodie.png", tag: "NEW", category: "Mens" },
  { id: "p2", name: "VOID CARGO PANTS", price: 145, oldPrice: 145, image: "/prod-cargo.png", tag: "", category: "Mens" },
  { id: "p3", name: "NEBULA OVERSIZED TEE", price: 65, oldPrice: 80, image: "/prod-tee.png", tag: "BEST SELLER", category: "Womens" },
  { id: "p4", name: "STRUCTURAL JACKET", price: 210, oldPrice: 210, image: "/prod-jacket.png", tag: "LIMITED", category: "Mens" },
  { id: "p5", name: "SYNTHETIC BEANIE", price: 35, oldPrice: 45, image: "/prod-hoodie.png", tag: "", category: "Accessories" },
  { id: "p13", name: "CYBERPUNK IPHONE CASE", price: 40, oldPrice: 50, image: "/prod-phone-case.png", tag: "NEW", category: "Accessories" },
  { id: "p14", name: "CYBERPUNK AIRPODS COVER", price: 30, oldPrice: 35, image: "/prod-airpods-cover.png", tag: "NEW", category: "Accessories" },
  { id: "p15", name: "STREETWEAR SNAPBACK CAP", price: 45, oldPrice: 55, image: "/prod-cap.png", tag: "POPULAR", category: "Accessories" },
  { id: "p16", name: "TECHWEAR SUNGLASSES", price: 60, oldPrice: 75, image: "/prod-sunglasses.png", tag: "LIMITED", category: "Accessories" },
  { id: "p17", name: "AESTHETIC STICKER PACK", price: 15, oldPrice: 20, image: "/prod-stickers.png", tag: "BUDGET", category: "Accessories" }
];

// Helper to render gender specific icons on the profile dashboard
const renderGenderIcon = (genderVal: string) => {
  const cleanGender = (genderVal || "").toLowerCase().trim();
  if (cleanGender === "male" || cleanGender === "men" || cleanGender === "man") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-gray-400 group-hover:text-brand-green transition-colors">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        {/* Small male symbol arrow in top right */}
        <path d="M16 5l3-3m0 0h-3m3 0v3" strokeWidth="1.5" stroke="currentColor" />
      </svg>
    );
  }
  if (cleanGender === "female" || cleanGender === "women" || cleanGender === "woman") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-gray-400 group-hover:text-brand-green transition-colors">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        {/* Small female symbol cross at bottom/right */}
        <path d="M12 11v3m-1.5-1.5h3" strokeWidth="1.5" stroke="currentColor" />
      </svg>
    );
  }
  // Other / Non-Binary
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-gray-400 group-hover:text-brand-green transition-colors">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      {/* Sparkle/star overlay */}
      <path d="M12 2l1 1.5L14.5 4 13 5l-1 1.5L11 5 9.5 4 11 3.5z" fill="currentColor" stroke="none" />
    </svg>
  );
};

export default function AccountDashboard() {
  const { addToCart } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [timeGreeting, setTimeGreeting] = useState("Welcome Back");
  const [showNotifications, setShowNotifications] = useState(false);
  const [infoSaved, setInfoSaved] = useState(false);

  // Load name and settings
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthday: "",
    gender: "Male"
  });

  // Load saved addresses
  const [addresses, setAddresses] = useState<any[]>([]);

  // Wishlist list
  const [wishlist, setWishlist] = useState<any[]>(productsList.slice(0, 3));

  // Order List with Milestones
  const [orders, setOrders] = useState<any[]>([]);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: "System Upgrade Completed", desc: "Your security credentials have been successfully updated.", category: "Announcements", time: "2 hrs ago", read: false },
    { id: 2, title: "Order Shipped YD-9042", desc: "Your parcel has left our Delhi fulfillment hub.", category: "Orders", time: "1 day ago", read: false },
    { id: 3, title: "Silver Tier Unlocked!", desc: "Enjoy 5% off on all upcoming Limited Edition drops.", category: "Rewards", time: "3 days ago", read: true },
    { id: 4, title: "Weekend Flash Sale ⚡", desc: "Get 20% off accessories using code VOID20.", category: "Offers", time: "5 days ago", read: true }
  ]);

  // Security Toggles
  const [twoFactor, setTwoFactor] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);

  // Auth local inputs
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authConfirmPassword, setAuthConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authFirstName, setAuthFirstName] = useState("");
  const [authLastName, setAuthLastName] = useState("");
  const [authGender, setAuthGender] = useState("Men");
  const [authError, setAuthError] = useState("");
  const [forgotPasswordStep, setForgotPasswordStep] = useState<"none" | "send_otp" | "verify_otp" | "reset_password">("none");
  const [showForgotPasswordLink, setShowForgotPasswordLink] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [enteredEmailOtp, setEnteredEmailOtp] = useState("");
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [otpDebugMessage, setOtpDebugMessage] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [verifiedToken, setVerifiedToken] = useState("");

  // Load customer session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("cocart_token");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      fetchCustomerData(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCustomerData = async (authToken: string) => {
    setIsLoading(true);
    try {
      // Fetch WooCommerce Profile via Next.js backend API
      const profileRes = await fetch("/api/customer/me", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setPersonalInfo({
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          email: profileData.email || "",
          phone: profileData.billing?.phone || "",
          birthday: localStorage.getItem("user_birthday") || "",
          gender: profileData.gender || localStorage.getItem("user_gender") || "Male"
        });

        // Map WooCommerce addresses
        const addressList = [];
        if (profileData.billing?.address1) {
          addressList.push({
            id: 1,
            type: "Billing",
            isDefault: true,
            name: `${profileData.firstName} ${profileData.lastName}`,
            street: profileData.billing.address1 + (profileData.billing.address2 ? ", " + profileData.billing.address2 : ""),
            city: profileData.billing.city,
            state: profileData.billing.state,
            postcode: profileData.billing.postcode,
            country: profileData.billing.country || "India"
          });
        }
        if (profileData.shipping?.address1) {
          addressList.push({
            id: 2,
            type: "Shipping",
            isDefault: false,
            name: `${profileData.firstName} ${profileData.lastName}`,
            street: profileData.shipping.address1 + (profileData.shipping.address2 ? ", " + profileData.shipping.address2 : ""),
            city: profileData.shipping.city,
            state: profileData.shipping.state,
            postcode: profileData.shipping.postcode,
            country: profileData.shipping.country || "India"
          });
        }
        setAddresses(addressList);
      } else if (profileRes.status === 401) {
        handleLogout();
      }

      // Fetch Orders via Next.js backend API
      const ordersRes = await fetch("/api/customer/orders", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
    } catch (err) {
      console.error("Error fetching customer data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthenticating(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      // Save token in storage
      localStorage.setItem("cocart_token", data.token);
      localStorage.setItem("customer_email", data.email);
      localStorage.setItem("customer_display_name", data.displayName);
      
      setToken(data.token);
      setIsAuthenticated(true);
      await fetchCustomerData(data.token);
    } catch (err: any) {
      const errMsg = err.message || "Invalid credentials.";
      setAuthError(errMsg);
      // Show forgot password option if the error suggests wrong credentials or wrong password
      const isPasswordError = errMsg.toLowerCase().includes("password") || 
                              errMsg.toLowerCase().includes("incorrect") || 
                              errMsg.toLowerCase().includes("credentials");
      setShowForgotPasswordLink(isPasswordError);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const triggerSendResetOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError("");

    if (!authEmail.trim()) {
      setAuthError("Please provide your email address.");
      return;
    }

    setIsAuthenticating(true);
    setOtpDebugMessage("");

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          email: authEmail.trim(),
          purpose: "reset",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset code.");
      }

      if (data.otpToken) {
        setOtpToken(data.otpToken);
      }
      if (data.debugNote) {
        setOtpDebugMessage(data.debugNote);
      }
      setForgotPasswordStep("verify_otp");
    } catch (err: any) {
      setAuthError(err.message || "Failed to send reset code.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleVerifyResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsOtpVerifying(true);

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          email: authEmail.trim(),
          emailOtp: enteredEmailOtp,
          otpToken: otpToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "OTP verification failed.");
      }

      if (data.verifiedToken) {
        setVerifiedToken(data.verifiedToken);
      }
      setEnteredEmailOtp("");
      setForgotPasswordStep("reset_password");
    } catch (err: any) {
      setAuthError(err.message || "OTP verification failed.");
    } finally {
      setIsOtpVerifying(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (authPassword !== authConfirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    setIsAuthenticating(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authEmail.trim(),
          password: authPassword,
          verifiedToken: verifiedToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      // Auto-login after password reset succeeds
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: authEmail.trim(), 
          password: authPassword 
        }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        throw new Error("Password updated successfully, but auto-login failed. Please log in manually.");
      }

      localStorage.setItem("cocart_token", loginData.token);
      localStorage.setItem("customer_email", loginData.email);
      localStorage.setItem("customer_display_name", loginData.displayName);

      setToken(loginData.token);
      setIsAuthenticated(true);
      await fetchCustomerData(loginData.token);

      // Reset states
      setForgotPasswordStep("none");
      setShowForgotPasswordLink(false);
      setAuthPassword("");
      setAuthConfirmPassword("");
    } catch (err: any) {
      setAuthError(err.message || "Failed to reset password.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const triggerSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError("");

    if (!authEmail.trim()) {
      setAuthError("Please provide an email address.");
      return;
    }

    if (authPassword !== authConfirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    setIsAuthenticating(true);
    setOtpDebugMessage("");

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          email: authEmail.trim(),
          purpose: "register",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch verification code.");
      }

      setIsOtpSent(true);
      if (data.otpToken) {
        setOtpToken(data.otpToken);
      }
      if (data.debugNote) {
        setOtpDebugMessage(data.debugNote);
      }
    } catch (err: any) {
      setAuthError(err.message || "Failed to dispatch verification code.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleOtpVerificationAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsOtpVerifying(true);

    try {
      // 1. Verify OTP
      const verifyRes = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          email: authEmail.trim(),
          emailOtp: enteredEmailOtp,
          otpToken: otpToken,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || "OTP verification failed.");
      }

      // 2. Finalize WooCommerce registration
      setIsAuthenticating(true);
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authEmail.trim(),
          password: authPassword,
          firstName: authFirstName,
          lastName: authLastName,
          verifiedToken: verifyData.verifiedToken,
          gender: authGender,
        }),
      });

      const registerData = await registerRes.json();
      if (!registerRes.ok) {
        throw new Error(registerData.error || "Registration failed.");
      }

      // 3. Automatically login
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: authEmail.trim(), 
          password: authPassword 
        }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        throw new Error("Registration succeeded, but auto-login failed. Please log in manually.");
      }

      localStorage.setItem("cocart_token", loginData.token);
      localStorage.setItem("customer_email", loginData.email);
      localStorage.setItem("customer_display_name", loginData.displayName);
      localStorage.setItem("user_gender", authGender);

      setToken(loginData.token);
      setIsAuthenticated(true);
      await fetchCustomerData(loginData.token);
      
      // Reset OTP states on complete success
      setIsOtpSent(false);
      setEnteredEmailOtp("");
      setOtpDebugMessage("");
    } catch (err: any) {
      setAuthError(err.message || "Authentication verification failed.");
    } finally {
      setIsOtpVerifying(false);
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("cocart_token");
    localStorage.removeItem("customer_email");
    localStorage.removeItem("customer_display_name");
    setToken(null);
    setIsAuthenticated(false);
    setPersonalInfo({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      birthday: "",
      gender: "Male"
    });
    setAddresses([]);
    setOrders([]);
  };

  // Time-based greetings
  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) setTimeGreeting("Good Morning");
    else if (hrs < 18) setTimeGreeting("Good Afternoon");
    else setTimeGreeting("Good Evening");
  }, []);

  const handleInfoSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoSaved(false);

    try {
      const activeToken = localStorage.getItem("cocart_token") || token;
      if (!activeToken) return;

      localStorage.setItem("user_birthday", personalInfo.birthday);
      localStorage.setItem("user_gender", personalInfo.gender);

      const res = await fetch("/api/customer/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          phone: personalInfo.phone,
          billing: {
            phone: personalInfo.phone
          }
        }),
      });

      if (res.ok) {
        setInfoSaved(true);
        setTimeout(() => setInfoSaved(false), 3000);
      } else {
        const errData = await res.json();
        console.error("Profile save error:", errData.error);
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  const handleToggleDefaultAddress = (id: number) => {
    setAddresses(prev => 
      prev.map(addr => ({ ...addr, isDefault: addr.id === id }))
    );
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const handleRemoveFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative min-h-screen w-full bg-[#030303] text-white flex flex-col justify-between overflow-x-hidden font-sans z-10 selection:bg-brand-green selection:text-brand-black">
      <Navbar />
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-radial from-[#B1F310]/5 via-transparent to-transparent blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-5%] w-[500px] h-[500px] bg-radial from-[#B1F310]/4 via-transparent to-transparent blur-[140px] pointer-events-none z-0" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 z-10 relative flex-1">
        {isLoading && isAuthenticated ? (
          <div className="flex flex-col items-center justify-center pt-24 pb-12 space-y-4">
            <RefreshCw className="w-8 h-8 text-brand-green animate-spin" />
            <p className="text-gray-400 text-xs font-mono uppercase tracking-[0.25em]">Retrieving Secure Grid Credentials...</p>
          </div>
        ) : !isAuthenticated ? (
          <div className="w-full max-w-md mx-auto py-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-card p-6 sm:p-8 rounded-[24px] border border-white/10 bg-white/[0.01] hover:border-brand-green/35 hover:shadow-[0_0_50px_rgba(177,243,16,0.03)] transition-all duration-500 relative overflow-hidden"
            >
              {/* Outer glow orb */}
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-radial from-[#B1F310]/5 via-transparent to-transparent blur-[40px] pointer-events-none" />

              <div className="space-y-6 relative z-10">
                {/* Header */}
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-green font-bold block">
                    {forgotPasswordStep !== "none"
                      ? "Secure Recovery Code"
                      : authMode === "login"
                      ? "Access Your World"
                      : "Join The Yubby Dubby Club"}
                  </span>
                  <h2 className="text-2xl font-heading font-black uppercase tracking-widest text-white mt-1">
                    {forgotPasswordStep === "send_otp"
                      ? "RECOVER PASSCODE"
                      : forgotPasswordStep === "verify_otp"
                      ? "RESET AUTHORIZATION"
                      : forgotPasswordStep === "reset_password"
                      ? "NEW CREDENTIALS"
                      : authMode === "login"
                      ? "MEMBER SIGN IN"
                      : "CREATING PROFILE"}
                  </h2>
                  <p className="text-gray-400 text-xs font-sans">
                    {forgotPasswordStep === "send_otp"
                      ? "Request a secure code to authorize account passcode rotation."
                      : forgotPasswordStep === "verify_otp"
                      ? "Enter the code sent to your email to verify profile ownership."
                      : forgotPasswordStep === "reset_password"
                      ? "Define a new security passcode for future session authorizations."
                      : authMode === "login"
                      ? "Track orders, save favorites, unlock rewards and discover your next obsession."
                      : "Create your account and unlock exclusive rewards, faster checkout, saved collections and personalized recommendations."}
                  </p>
                </div>

                {/* Form Mode Tabs */}
                {forgotPasswordStep === "none" && (
                  <div className="grid grid-cols-2 gap-2 bg-white/5 border border-white/5 p-1 rounded-full text-xs font-mono">
                    <button
                      onClick={() => { 
                        setAuthMode("login"); 
                        setAuthError(""); 
                        setAuthConfirmPassword(""); 
                        setShowPassword(false); 
                        setShowConfirmPassword(false); 
                        setIsOtpSent(false);
                        setEnteredEmailOtp("");
                        setIsOtpVerifying(false);
                        setOtpDebugMessage("");
                        setShowForgotPasswordLink(false);
                      }}
                      className={`py-2 px-4 rounded-full transition-all uppercase tracking-wider font-bold cursor-pointer ${
                        authMode === "login" 
                          ? "bg-brand-green text-brand-black" 
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => { 
                        setAuthMode("register"); 
                        setAuthError(""); 
                        setAuthConfirmPassword(""); 
                        setShowPassword(false); 
                        setShowConfirmPassword(false); 
                        setIsOtpSent(false);
                        setEnteredEmailOtp("");
                        setIsOtpVerifying(false);
                        setOtpDebugMessage("");
                      }}
                      className={`py-2 px-4 rounded-full transition-all uppercase tracking-wider font-bold cursor-pointer ${
                        authMode === "register" 
                          ? "bg-brand-green text-brand-black" 
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Register
                    </button>
                  </div>
                )}

                {/* Error Banner */}
                {authError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-lg font-mono uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* Form */}
                <form 
                  onSubmit={
                    forgotPasswordStep === "send_otp"
                      ? triggerSendResetOtp
                      : forgotPasswordStep === "verify_otp"
                      ? handleVerifyResetOtp
                      : forgotPasswordStep === "reset_password"
                      ? handleResetPasswordSubmit
                      : authMode === "login"
                      ? handleLogin
                      : isOtpSent
                      ? handleOtpVerificationAndRegister
                      : triggerSendOtp
                  } 
                  className="space-y-4"
                >
                  {forgotPasswordStep === "send_otp" ? (
                    <div className="space-y-4">
                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono block">Email Address</label>
                        <input
                          type="email"
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-mono tracking-wider focus:outline-none focus:border-brand-green text-white"
                          placeholder="e.g. name@domain.com"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isAuthenticating}
                        className="w-full py-3 bg-brand-green text-brand-black font-heading font-black uppercase tracking-widest text-xs rounded-full hover:bg-white hover:shadow-[0_0_20px_rgba(177,243,16,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isAuthenticating ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Requesting Recovery Link...</span>
                          </>
                        ) : (
                          <span>SEND RESET CODE</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setForgotPasswordStep("none");
                          setAuthError("");
                        }}
                        className="w-full py-2 bg-transparent text-gray-400 hover:text-white text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer text-center"
                      >
                        ← Cancel and return to login
                      </button>
                    </div>
                  ) : forgotPasswordStep === "verify_otp" ? (
                    <div className="space-y-4">
                      <div className="p-3 bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs rounded-lg font-mono uppercase tracking-wider text-center">
                        Verification Code Sent
                      </div>
                      <p className="text-gray-400 text-xs font-sans text-center">
                        We sent a secure verification code to <strong>{authEmail}</strong>. Please enter it below to complete your reset.
                      </p>

                      <div className="grid gap-4 grid-cols-1">
                        {/* Email OTP */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono block">Email OTP Code</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={enteredEmailOtp}
                            onChange={(e) => setEnteredEmailOtp(e.target.value)}
                            className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-center text-sm font-mono tracking-[0.25em] focus:outline-none focus:border-brand-green text-white"
                            placeholder="••••••"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono px-1">
                        <span className="text-gray-400">Didn't receive the code?</span>
                        <button
                          type="button"
                          disabled={isAuthenticating}
                          onClick={() => triggerSendResetOtp()}
                          className="text-brand-green hover:text-white transition-colors cursor-pointer font-bold uppercase tracking-wider disabled:opacity-50"
                        >
                          Resend Code
                        </button>
                      </div>

                      {otpDebugMessage && (
                        <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] rounded font-mono uppercase tracking-wider text-center animate-pulse-slow">
                          {otpDebugMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isOtpVerifying}
                        className="w-full py-3 bg-brand-green text-brand-black font-heading font-black uppercase tracking-widest text-xs rounded-full hover:bg-white hover:shadow-[0_0_20px_rgba(177,243,16,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isOtpVerifying ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Validating Credentials...</span>
                          </>
                        ) : (
                          <span>CONFIRM RESET CODE</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setForgotPasswordStep("send_otp");
                          setAuthError("");
                        }}
                        className="w-full py-2 bg-transparent text-gray-400 hover:text-white text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer text-center"
                      >
                        ← Back to email input
                      </button>
                    </div>
                  ) : forgotPasswordStep === "reset_password" ? (
                    <div className="space-y-4">
                      {/* Password */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono block">New Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            className="w-full h-11 pl-4 pr-10 bg-white/5 border border-white/10 rounded-xl text-xs font-mono tracking-wider focus:outline-none focus:border-brand-green text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono block">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={authConfirmPassword}
                            onChange={(e) => setAuthConfirmPassword(e.target.value)}
                            className="w-full h-11 pl-4 pr-10 bg-white/5 border border-white/10 rounded-xl text-xs font-mono tracking-wider focus:outline-none focus:border-brand-green text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isAuthenticating}
                        className="w-full py-3 bg-brand-green text-brand-black font-heading font-black uppercase tracking-widest text-xs rounded-full hover:bg-white hover:shadow-[0_0_20px_rgba(177,243,16,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isAuthenticating ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Updating Credentials...</span>
                          </>
                        ) : (
                          <span>RESET PASSWORD</span>
                        )}
                      </button>
                    </div>
                  ) : authMode === "register" && isOtpSent ? (
                    <div className="space-y-4">
                      <div className="p-3 bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs rounded-lg font-mono uppercase tracking-wider text-center">
                        Verification Code Sent
                      </div>
                      <p className="text-gray-400 text-xs font-sans text-center">
                        We sent a secure verification code to <strong>{authEmail}</strong>. Please enter it below to complete your registration.
                      </p>

                      <div className="grid gap-4 grid-cols-1">
                        {/* Email OTP */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono block">Email OTP Code</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={enteredEmailOtp}
                            onChange={(e) => setEnteredEmailOtp(e.target.value)}
                            className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-center text-sm font-mono tracking-[0.25em] focus:outline-none focus:border-brand-green text-white"
                            placeholder="••••••"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono px-1">
                        <span className="text-gray-400">Didn't receive the code?</span>
                        <button
                          type="button"
                          disabled={isAuthenticating}
                          onClick={() => triggerSendOtp()}
                          className="text-brand-green hover:text-white transition-colors cursor-pointer font-bold uppercase tracking-wider disabled:opacity-50"
                        >
                          Resend Code
                        </button>
                      </div>

                      {otpDebugMessage && (
                        <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] rounded font-mono uppercase tracking-wider text-center animate-pulse-slow">
                          {otpDebugMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isOtpVerifying}
                        className="w-full py-3 bg-brand-green text-brand-black font-heading font-black uppercase tracking-widest text-xs rounded-full hover:bg-white hover:shadow-[0_0_20px_rgba(177,243,16,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isOtpVerifying ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Validating Credentials...</span>
                          </>
                        ) : (
                          <span>CONFIRM VERIFICATION</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsOtpSent(false);
                          setAuthError("");
                        }}
                        className="w-full py-2 bg-transparent text-gray-400 hover:text-white text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer text-center"
                      >
                        ← Back to registration details
                      </button>
                    </div>
                  ) : (
                    <>
                      {authMode === "register" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* First Name */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono block">First Name</label>
                            <input
                              type="text"
                              required
                              value={authFirstName}
                              onChange={(e) => setAuthFirstName(e.target.value)}
                              className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green text-white"
                            />
                          </div>
                          {/* Last Name */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono block">Last Name</label>
                            <input
                              type="text"
                              required
                              value={authLastName}
                              onChange={(e) => setAuthLastName(e.target.value)}
                              className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green text-white"
                            />
                          </div>
                        </div>
                      )}

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono block">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-mono tracking-wider focus:outline-none focus:border-brand-green text-white"
                          placeholder="e.g. name@domain.com"
                        />
                      </div>

                      {/* Gender Selection */}
                      {authMode === "register" && (
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono block">Gender</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["Men", "Women", "Other"].map((g) => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => setAuthGender(g)}
                                className={`h-11 rounded-xl text-[11px] font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                                  authGender === g
                                    ? "bg-brand-green text-brand-black border-brand-green font-bold shadow-[0_0_15px_rgba(177,243,16,0.15)]"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                                }`}
                              >
                                {g}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Password */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono block">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            className="w-full h-11 pl-4 pr-10 bg-white/5 border border-white/10 rounded-xl text-xs font-mono tracking-wider focus:outline-none focus:border-brand-green text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {showForgotPasswordLink && (
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setForgotPasswordStep("send_otp");
                              setAuthError("");
                            }}
                            className="text-[10px] text-brand-green hover:text-white transition-colors font-mono uppercase tracking-wider cursor-pointer bg-transparent border-none p-0"
                          >
                            Forgot Password?
                          </button>
                        </div>
                      )}

                      {/* Confirm Password (Register Only) */}
                      {authMode === "register" && (
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono block">Confirm Password</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              required
                              value={authConfirmPassword}
                              onChange={(e) => setAuthConfirmPassword(e.target.value)}
                              className="w-full h-11 pl-4 pr-10 bg-white/5 border border-white/10 rounded-xl text-xs font-mono tracking-wider focus:outline-none focus:border-brand-green text-white"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                            >
                              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isAuthenticating}
                        className="w-full py-3 bg-brand-green text-brand-black font-heading font-black uppercase tracking-widest text-xs rounded-full hover:bg-white hover:shadow-[0_0_20px_rgba(177,243,16,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isAuthenticating ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Verifying Security Key...</span>
                          </>
                        ) : (
                          <span>{authMode === "login" ? "INITIALIZE SESSION" : "REGISTER PROFILE"}</span>
                        )}
                      </button>
                    </>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Dynamic Greeting */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-brand-green font-bold">
                  Secure Member Space
                </span>
                <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase tracking-tighter text-white mt-1">
                  {timeGreeting}, {personalInfo.firstName || "Member"}
                </h1>
                <p className="text-gray-400 text-xs mt-1 font-sans">
                  Ready for your next drop? Manage your profile and orders here.
                </p>
              </div>

              {/* Action Row */}
              <div className="flex items-center gap-4">
                {/* Notifications Alert */}
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 bg-white/5 border border-white/10 rounded-full hover:border-brand-green hover:text-brand-green transition-all duration-300 cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-green rounded-full shadow-[0_0_8px_#B1F310]" />
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="text-[10px] text-red-400 font-mono hover:text-red-500 tracking-wider bg-white/5 px-4 py-2 border border-white/5 rounded-full uppercase cursor-pointer transition-colors"
                >
                  LOGOUT
                </button>
                <div className="text-[10px] text-gray-500 font-mono tracking-wider bg-white/5 px-4 py-2 border border-white/5 rounded-full uppercase">
                  Loyalty Status: <span className="text-brand-green font-bold">Silver Drop</span>
                </div>
              </div>
            </div>

        {/* HERO PROFILE SECTION */}
        <section className="group glass-card p-6 sm:p-8 rounded-[20px] border border-white/10 bg-white/[0.01] hover:border-brand-green/35 hover:shadow-[0_20px_50px_rgba(177,243,16,0.03)] transition-all duration-500 relative overflow-hidden mb-12">
          {/* Subtle inside gradient glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-radial from-[#B1F310]/5 via-transparent to-transparent blur-[80px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Avatar block */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-brand-green to-white/10 shadow-[0_0_15px_rgba(177,243,16,0.2)] animate-pulse-slow">
                <div className="w-full h-full bg-[#0d0d0d] rounded-full overflow-hidden flex items-center justify-center border border-black">
                  {renderGenderIcon(personalInfo.gender)}
                </div>
                <span className="absolute bottom-0 right-0 bg-brand-green text-brand-black w-6 h-6 rounded-full border border-black flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl font-heading font-black uppercase tracking-tight text-white">
                    {personalInfo.firstName} {personalInfo.lastName}
                  </h2>
                  <span className="bg-brand-green/10 border border-brand-green/20 text-brand-green text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono">
                    Verified Customer
                  </span>
                </div>
                <p className="text-gray-400 text-xs font-sans">{personalInfo.email}</p>
                <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                  <Clock size={12} className="text-brand-green" /> Member Since 2026
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-8">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block font-mono">Total Orders</span>
                <div className="text-3xl font-heading font-black text-white">{orders.length}</div>
                <span className="text-[10px] text-gray-400 font-sans block">Completed checkouts</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block font-mono">Lifetime Value</span>
                <div className="text-3xl font-heading font-black text-brand-green tracking-wide">${personalInfo.firstName === "ZTK" ? "42,580" : "0"}</div>
                <span className="text-[10px] text-gray-400 font-sans block">Invested in style</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block font-mono">Rewards Point</span>
                <div className="text-3xl font-heading font-black text-white">1,240</div>
                <span className="text-[10px] text-brand-green font-bold block uppercase tracking-wider text-[9px] font-mono">Silver Member</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block font-mono">Saved Wishlist</span>
                <div className="text-3xl font-heading font-black text-white">{wishlist.length}</div>
                <span className="text-[10px] text-gray-400 font-sans block">Products monitor</span>
              </div>
            </div>
          </div>
        </section>

        {/* NOTIFICATIONS BAR */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="glass-card p-6 rounded-[20px] border border-brand-green/20 bg-brand-green/5 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-brand-green" />
                    Member Notifications ({unreadCount} Unread)
                  </h3>
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] font-bold uppercase tracking-wider text-brand-green hover:text-white transition-colors cursor-pointer"
                  >
                    Mark All As Read
                  </button>
                </div>

                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-[12px] border flex items-start justify-between gap-4 transition-all duration-300 ${
                        n.read
                          ? "bg-white/[0.01] border-white/5 text-gray-400"
                          : "bg-white/[0.03] border-brand-green/20 text-white font-semibold shadow-[0_0_10px_rgba(177,243,16,0.02)]"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-brand-green font-mono">
                            {n.category}
                          </span>
                          <span className="text-[10px] text-gray-500 font-sans">{n.time}</span>
                        </div>
                        <h4 className="text-xs uppercase font-bold text-white">{n.title}</h4>
                        <p className="text-[11px] text-gray-400 font-sans">{n.desc}</p>
                      </div>
                      {!n.read && (
                        <span className="w-2 h-2 bg-brand-green rounded-full shrink-0 mt-1 shadow-[0_0_8px_#B1F310]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN INTERACTIVE AREA: BENTO TABS LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT BENTO NAVIGATION (Desktop sidebar, Mobile stack) */}
          <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-4">
            
            {/* Overview / Stats Tab Link */}
            <button
              onClick={() => setActiveTab("overview")}
              className={`glass-card p-4 rounded-[16px] border text-left flex flex-col justify-between h-28 group relative overflow-hidden transition-all duration-300 cursor-pointer ${
                activeTab === "overview"
                  ? "bg-brand-green text-brand-black border-brand-green"
                  : "bg-white/[0.01] border-white/10 hover:border-white/30 text-white"
              }`}
            >
              <User className={`w-5 h-5 ${activeTab === "overview" ? "text-brand-black" : "text-brand-green"}`} />
              <div>
                <h3 className="font-heading font-black text-sm uppercase tracking-wider block">Overview</h3>
                <span className={`text-[10px] uppercase font-mono ${activeTab === "overview" ? "text-brand-black/70" : "text-gray-500"}`}>
                  Member Space
                </span>
              </div>
            </button>

            {/* Orders Tab Link */}
            <button
              onClick={() => setActiveTab("orders")}
              className={`glass-card p-4 rounded-[16px] border text-left flex flex-col justify-between h-28 group relative overflow-hidden transition-all duration-300 cursor-pointer ${
                activeTab === "orders"
                  ? "bg-brand-green text-brand-black border-brand-green"
                  : "bg-white/[0.01] border-white/10 hover:border-white/30 text-white"
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <ShoppingBag className={`w-5 h-5 ${activeTab === "orders" ? "text-brand-black" : "text-brand-green"}`} />
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${activeTab === "orders" ? "bg-brand-black text-brand-green" : "bg-white/5 border border-white/10"}`}>
                  {orders.length}
                </span>
              </div>
              <div>
                <h3 className="font-heading font-black text-sm uppercase tracking-wider block">Orders</h3>
                <span className={`text-[10px] uppercase font-mono ${activeTab === "orders" ? "text-brand-black/70" : "text-gray-500"}`}>
                  Checkouts Timeline
                </span>
              </div>
            </button>

            {/* Wishlist Tab Link */}
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`glass-card p-4 rounded-[16px] border text-left flex flex-col justify-between h-28 group relative overflow-hidden transition-all duration-300 cursor-pointer ${
                activeTab === "wishlist"
                  ? "bg-brand-green text-brand-black border-brand-green"
                  : "bg-white/[0.01] border-white/10 hover:border-white/30 text-white"
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <Heart className={`w-5 h-5 ${activeTab === "wishlist" ? "text-brand-black" : "text-brand-green"}`} />
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${activeTab === "wishlist" ? "bg-brand-black text-brand-green" : "bg-white/5 border border-white/10"}`}>
                  {wishlist.length}
                </span>
              </div>
              <div>
                <h3 className="font-heading font-black text-sm uppercase tracking-wider block">Wishlist</h3>
                <span className={`text-[10px] uppercase font-mono ${activeTab === "wishlist" ? "text-brand-black/70" : "text-gray-500"}`}>
                  Monitored Drops
                </span>
              </div>
            </button>

            {/* Rewards Tab Link */}
            <button
              onClick={() => setActiveTab("rewards")}
              className={`glass-card p-4 rounded-[16px] border text-left flex flex-col justify-between h-28 group relative overflow-hidden transition-all duration-300 cursor-pointer ${
                activeTab === "rewards"
                  ? "bg-brand-green text-brand-black border-brand-green"
                  : "bg-white/[0.01] border-white/10 hover:border-white/30 text-white"
              }`}
            >
              <Award className={`w-5 h-5 ${activeTab === "rewards" ? "text-brand-black" : "text-brand-green"}`} />
              <div>
                <h3 className="font-heading font-black text-sm uppercase tracking-wider block">Rewards</h3>
                <span className={`text-[10px] uppercase font-mono ${activeTab === "rewards" ? "text-brand-black/70" : "text-gray-500"}`}>
                  Points & Club
                </span>
              </div>
            </button>

            {/* Saved Addresses Tab Link */}
            <button
              onClick={() => setActiveTab("addresses")}
              className={`glass-card p-4 rounded-[16px] border text-left flex flex-col justify-between h-28 group relative overflow-hidden transition-all duration-300 cursor-pointer ${
                activeTab === "addresses"
                  ? "bg-brand-green text-brand-black border-brand-green"
                  : "bg-white/[0.01] border-white/10 hover:border-white/30 text-white"
              }`}
            >
              <MapPin className={`w-5 h-5 ${activeTab === "addresses" ? "text-brand-black" : "text-brand-green"}`} />
              <div>
                <h3 className="font-heading font-black text-sm uppercase tracking-wider block">Addresses</h3>
                <span className={`text-[10px] uppercase font-mono ${activeTab === "addresses" ? "text-brand-black/70" : "text-gray-500"}`}>
                  Shipment Books
                </span>
              </div>
            </button>

            {/* Account Security Tab Link */}
            <button
              onClick={() => setActiveTab("security")}
              className={`glass-card p-4 rounded-[16px] border text-left flex flex-col justify-between h-28 group relative overflow-hidden transition-all duration-300 cursor-pointer ${
                activeTab === "security"
                  ? "bg-brand-green text-brand-black border-brand-green"
                  : "bg-white/[0.01] border-white/10 hover:border-white/30 text-white"
              }`}
            >
              <Shield className={`w-5 h-5 ${activeTab === "security" ? "text-brand-black" : "text-brand-green"}`} />
              <div>
                <h3 className="font-heading font-black text-sm uppercase tracking-wider block">Security</h3>
                <span className={`text-[10px] uppercase font-mono ${activeTab === "security" ? "text-brand-black/70" : "text-gray-500"}`}>
                  2FA & Shields
                </span>
              </div>
            </button>

          </div>

          {/* RIGHT VIEWPORT CONTENT AREA */}
          <div className="lg:col-span-9">
            
            <AnimatePresence mode="wait">
              
              {/* 1. OVERVIEW / BENTO SUMMARY */}
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Next Drop Alert card */}
                    <div className="glass-card p-6 rounded-[20px] border border-brand-green/20 bg-brand-green/5 relative overflow-hidden flex flex-col justify-between min-h-[200px]">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles size={100} className="text-brand-green" />
                      </div>
                      <div className="space-y-2 relative z-10">
                        <span className="text-[9px] font-mono tracking-widest bg-brand-green text-brand-black font-bold px-2 py-0.5 rounded">
                          EXCLUSIVES CLUB
                        </span>
                        <h3 className="font-heading font-black text-xl uppercase tracking-wider text-white pt-2">
                          Next Drop: Cyber-Denim Capsule
                        </h3>
                        <p className="text-gray-300 text-xs font-sans max-w-[280px]">
                          Your early access coordinates will be sent to your email 24 hours prior.
                        </p>
                      </div>
                      <div className="relative z-10 pt-4">
                        <button
                          onClick={() => setActiveTab("rewards")}
                          className="px-6 py-2 bg-brand-green text-brand-black font-heading font-black text-xs uppercase tracking-widest rounded-full hover:bg-white transition-all cursor-pointer"
                        >
                          View Member Perks
                        </button>
                      </div>
                    </div>

                    {/* Quick Profile Summary Form preview */}
                    <div className="glass-card p-6 rounded-[20px] border border-white/10 bg-white/[0.01] flex flex-col justify-between min-h-[200px]">
                      <div className="space-y-3">
                        <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white border-b border-white/5 pb-2">
                          Account Profile
                        </h3>
                        <div className="space-y-2 text-xs font-mono">
                          <div className="flex justify-between text-gray-500">
                            <span>NAME:</span>
                            <span className="text-white font-sans">{personalInfo.firstName} {personalInfo.lastName}</span>
                          </div>
                          <div className="flex justify-between text-gray-500">
                            <span>EMAIL:</span>
                            <span className="text-white">{personalInfo.email}</span>
                          </div>
                          <div className="flex justify-between text-gray-500">
                            <span>PHONE:</span>
                            <span className="text-white">{personalInfo.phone}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab("info")}
                        className="w-full py-2 border border-white/10 text-white font-heading font-black text-xs uppercase tracking-widest rounded-full hover:border-white transition-all cursor-pointer"
                      >
                        Edit Personal Information
                      </button>
                    </div>
                  </div>

                  {/* Active Orders Quick Preview Card */}
                  <div className="glass-card p-6 sm:p-8 rounded-[20px] border border-white/10 bg-white/[0.01] space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white">
                        Active Order Tracking
                      </h3>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-xs text-brand-green hover:text-white transition-colors uppercase font-bold tracking-wider"
                      >
                        See All Orders
                      </button>
                    </div>

                    {orders.length > 0 ? (
                      <div className="p-4 rounded-[12px] bg-white/[0.02] border border-white/5 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs font-mono border-b border-white/5 pb-2 text-gray-400">
                          <div>ORDER ID: <span className="text-white">{orders[0].id}</span></div>
                          <div>DATE: <span className="text-white">{orders[0].date}</span></div>
                          <div>STATUS: <span className="text-brand-green uppercase font-bold">{orders[0].status}</span></div>
                        </div>

                        {/* Order Timeline indicator */}
                        <div className="pt-2">
                          <div className="flex justify-between relative">
                            <div className="absolute top-2.5 left-0 right-0 h-0.5 bg-white/10 z-0" />
                            {orders[0].timeline.map((step: any, idx: number) => (
                              <div key={idx} className="flex flex-col items-center relative z-10">
                                <div
                                  className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                                    step.done
                                      ? "bg-brand-green border-brand-green text-brand-black font-bold shadow-[0_0_10px_#B1F310]"
                                      : "bg-brand-black border-white/20 text-gray-500"
                                  }`}
                                >
                                  {step.done ? "✓" : idx + 1}
                                </div>
                                <span className="text-[9px] font-heading uppercase tracking-tighter text-center mt-2 max-w-[60px] leading-none text-white block">
                                  {step.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 rounded-[12px] bg-white/[0.01] border border-white/5 text-center text-xs text-gray-400 font-mono uppercase tracking-wider">
                        No active orders found in drop logs
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* 2. ORDERS SECTION */}
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  <h2 className="font-heading font-black text-2xl uppercase tracking-widest text-white border-b border-white/10 pb-4">
                    Order History
                  </h2>

                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="glass-card p-6 rounded-[20px] border border-white/10 bg-white/[0.01] space-y-6"
                      >
                        {/* Order Header Summary */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-white/5 pb-4">
                          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-8 text-xs font-mono">
                            <div>
                              <span className="text-gray-500 block">ORDER ID</span>
                              <span className="text-white font-bold">{order.id}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block">DATE PLACED</span>
                              <span className="text-white font-bold">{order.date}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block">TOTAL VALUE</span>
                              <span className="text-brand-green font-bold">${order.total}.00</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block">PAYMENT PORTAL</span>
                              <span className="text-white">{order.paymentStatus}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-4 py-1.5 bg-white/5 border border-white/10 hover:border-brand-green hover:text-brand-green text-[10px] font-heading uppercase tracking-widest rounded-full transition-all flex items-center gap-1.5 cursor-pointer">
                              <FileText size={12} /> Invoice
                            </button>
                            <button className="px-4 py-1.5 bg-brand-green text-brand-black font-heading uppercase tracking-widest text-[10px] rounded-full hover:bg-white transition-all cursor-pointer">
                              Reorder
                            </button>
                          </div>
                        </div>

                        {/* Order Timeline Visual */}
                        <div className="py-4">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 font-mono">
                            Milestone Tracking: <span className="text-brand-green uppercase">{order.status}</span>
                          </div>
                          
                          <div className="flex justify-between relative px-2">
                            {/* Connecting Line */}
                            <div className="absolute top-2.5 left-4 right-4 h-0.5 bg-white/5 z-0" />
                            {order.timeline.map((step: any, idx: number) => (
                              <div key={idx} className="flex flex-col items-center relative z-10">
                                <div
                                  className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                                    step.done
                                      ? "bg-brand-green border-brand-green text-brand-black font-bold shadow-[0_0_10px_#B1F310]"
                                      : "bg-brand-black border-white/10 text-gray-600"
                                  }`}
                                >
                                  {step.done ? "✓" : idx + 1}
                                </div>
                                <span className={`text-[9px] font-heading uppercase tracking-tighter text-center mt-2 max-w-[65px] leading-tight block ${
                                  step.done ? "text-white" : "text-gray-600"
                                }`}>
                                  {step.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Items in Order */}
                        <div className="border-t border-white/5 pt-4 space-y-3">
                          {order.items.map((item: any, index: number) => (
                            <div key={index} className="flex gap-4 items-center justify-between">
                              <div className="flex gap-4 items-center min-w-0">
                                <div className="relative aspect-square w-12 rounded-[8px] overflow-hidden border border-white/10 bg-white/5 shrink-0 flex items-center justify-center">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    sizes="50px"
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-heading font-bold uppercase tracking-tight text-white truncate text-sm">
                                    {item.name}
                                  </h4>
                                  <div className="text-[10px] text-gray-500 font-mono uppercase">
                                    QTY: {item.qty} | SIZE: {item.size}
                                  </div>
                                </div>
                              </div>
                              <div className="font-heading font-black text-brand-green tracking-widest text-sm shrink-0">
                                ${item.price * item.qty}.00
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 3. WISHLIST SECTION */}
              {activeTab === "wishlist" && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <h2 className="font-heading font-black text-2xl uppercase tracking-widest text-white border-b border-white/10 pb-4">
                    My Wishlist
                  </h2>

                  {wishlist.length === 0 ? (
                    <div className="glass-card p-12 text-center rounded-[20px] border border-white/10 bg-white/[0.01] space-y-4">
                      <Heart className="w-12 h-12 text-gray-500 mx-auto" />
                      <h3 className="font-heading font-bold text-lg uppercase text-white">No Items Saved</h3>
                      <p className="text-gray-400 text-xs max-w-[200px] mx-auto font-sans leading-relaxed">
                        Create your collection by tapping the heart icon on your favorite streetwear drops.
                      </p>
                      <button
                        onClick={() => setActiveTab("overview")}
                        className="px-6 py-2 bg-brand-green text-brand-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all cursor-pointer"
                      >
                        Explore Drops
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map((item) => (
                        <div
                          key={item.id}
                          className="glass-card p-4 rounded-[16px] border border-white/10 bg-white/[0.01] hover:border-brand-green/30 hover:shadow-[0_15px_30px_rgba(177,243,16,0.05)] transition-all duration-300 group"
                        >
                          {/* Image box */}
                          <div className="relative aspect-[3/4] w-full rounded-[12px] overflow-hidden border border-white/5 mb-4 bg-white/5 flex items-center justify-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="(max-width: 640px) 100vw, 25vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            <button
                              onClick={() => handleRemoveFromWishlist(item.id)}
                              className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                            {item.price < item.oldPrice && (
                              <span className="absolute top-3 left-3 bg-brand-green text-brand-black text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest font-mono rounded">
                                SALE
                              </span>
                            )}
                          </div>

                          {/* Details */}
                          <div className="space-y-2">
                            <h3 className="font-heading font-bold uppercase tracking-tight text-white text-sm truncate">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-2 font-heading font-bold tracking-widest text-xs">
                              <span className="text-brand-green">${item.price}.00</span>
                              {item.price < item.oldPrice && (
                                <span className="text-gray-500 line-through">${item.oldPrice}.00</span>
                              )}
                            </div>
                            <button
                              onClick={() => addToCart({
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                size: "M",
                                image: item.image
                              }, 1)}
                              className="w-full py-2 bg-white text-black hover:bg-brand-green hover:shadow-[0_0_15px_rgba(177,243,16,0.3)] transition-all text-[10px] font-heading font-black uppercase tracking-widest rounded-[var(--radius-dropdown)] cursor-pointer"
                            >
                              Quick Add To Bag
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* 4. REWARDS CLUB SECTION */}
              {activeTab === "rewards" && (
                <motion.div
                  key="rewards"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <h2 className="font-heading font-black text-2xl uppercase tracking-widest text-white border-b border-white/10 pb-4">
                    Loyalty Rewards Club
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    {/* Club Progression status */}
                    <div className="glass-card p-6 md:p-8 rounded-[20px] border border-white/10 bg-white/[0.01] md:col-span-8 flex flex-col justify-between space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono tracking-widest uppercase text-brand-green font-bold">
                          Current Tier Status
                        </span>
                        <div className="flex items-baseline gap-2">
                          <h3 className="font-heading font-black text-4xl uppercase tracking-widest text-white">
                            SILVER DROP
                          </h3>
                          <span className="text-gray-500 font-mono text-xs">1,240 pts</span>
                        </div>
                      </div>

                      {/* Progression progress bar */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-gray-500">
                          <span>SILVER (1,000 PTS)</span>
                          <span>GOLD (2,500 PTS)</span>
                        </div>
                        {/* Progress track */}
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "42%" }} // (1240-1000)/(2500-1000) = 240/1500 = 16% + base
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="h-full bg-brand-green rounded-full shadow-[0_0_10px_#B1F310]"
                          />
                        </div>
                        <div className="text-[10px] text-gray-400 font-sans leading-normal">
                          Earn <span className="text-white font-bold">1,260 more points</span> to unlock the <span className="text-brand-green font-bold uppercase">Gold Drop</span> tier benefits.
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/5 text-center text-[9px] font-mono tracking-wider text-gray-500">
                        <div>
                          <span className="block text-white font-bold">BRONZE</span>
                          <span>Base Entry</span>
                        </div>
                        <div>
                          <span className="block text-brand-green font-bold">★ SILVER</span>
                          <span>5% Discount</span>
                        </div>
                        <div>
                          <span className="block text-white font-bold">GOLD</span>
                          <span>10% Off + EA</span>
                        </div>
                        <div>
                          <span className="block text-white font-bold">PLATINUM</span>
                          <span>VIP Drops</span>
                        </div>
                      </div>
                    </div>

                    {/* Reward Perks Card */}
                    <div className="glass-card p-6 rounded-[20px] border border-brand-green/20 bg-brand-green/5 md:col-span-4 flex flex-col justify-between min-h-[260px]">
                      <div className="space-y-4">
                        <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white border-b border-brand-green/20 pb-2">
                          Silver Benefits
                        </h3>
                        <ul className="space-y-2 text-xs font-sans text-gray-300">
                          <li className="flex gap-2 items-start">
                            <span className="text-brand-green font-bold">✓</span>
                            5% discount code applied automatically.
                          </li>
                          <li className="flex gap-2 items-start">
                            <span className="text-brand-green font-bold">✓</span>
                            Free standard delivery globally.
                          </li>
                          <li className="flex gap-2 items-start">
                            <span className="text-brand-green font-bold">✓</span>
                            Early previews of editorial drops.
                          </li>
                        </ul>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center text-[10px] font-mono text-gray-400 mt-4">
                        Active Promo: <span className="text-brand-green font-bold">SILVERDROP5</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 5. SAVED ADDRESSES */}
              {activeTab === "addresses" && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <h2 className="font-heading font-black text-2xl uppercase tracking-widest text-white">
                      Saved Addresses
                    </h2>
                    <button className="px-4 py-2 bg-brand-green text-brand-black font-heading font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer">
                      <Plus size={14} /> Add Address
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="glass-card p-12 text-center rounded-[20px] border border-white/10 bg-white/[0.01] space-y-4">
                      <MapPin className="w-12 h-12 text-gray-500 mx-auto" />
                      <h3 className="font-heading font-bold text-lg uppercase text-white">No Addresses Saved</h3>
                      <button className="px-6 py-2 bg-brand-green text-brand-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all cursor-pointer">
                        Add New Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`glass-card p-6 rounded-[20px] border transition-all duration-300 flex flex-col justify-between min-h-[220px] bg-white/[0.01] ${
                            addr.isDefault 
                              ? "border-brand-green/35 shadow-[0_10px_20px_rgba(177,243,16,0.03)]" 
                              : "border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div className="flex gap-2">
                                <span className="bg-white/5 border border-white/10 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono">
                                  {addr.type}
                                </span>
                                {addr.isDefault && (
                                  <span className="bg-brand-green/10 border border-brand-green/20 text-brand-green text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono">
                                    DEFAULT
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-heading font-bold text-sm uppercase tracking-tight text-white">
                                {addr.name}
                              </h4>
                              <p className="text-gray-400 text-xs font-sans leading-relaxed">
                                {addr.street},<br />
                                {addr.city}, {addr.state} - {addr.postcode}<br />
                                {addr.country}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4 pt-4 border-t border-white/5 mt-4 text-[10px] font-mono tracking-wider uppercase">
                            <button className="text-gray-400 hover:text-brand-green transition-colors inline-flex items-center gap-1 cursor-pointer">
                              <Edit2 size={12} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                            {!addr.isDefault && (
                              <button
                                onClick={() => handleToggleDefaultAddress(addr.id)}
                                className="text-brand-green hover:text-white transition-colors cursor-pointer"
                              >
                                Set As Default
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* 6. ACCOUNT SECURITY */}
              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <h2 className="font-heading font-black text-2xl uppercase tracking-widest text-white border-b border-white/10 pb-4">
                    Security Center
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Security Toggles Card */}
                    <div className="glass-card p-6 sm:p-8 rounded-[20px] border border-white/10 bg-white/[0.01] space-y-6">
                      <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white border-b border-white/5 pb-2">
                        Verification Checklist
                      </h3>

                      <div className="space-y-4">
                        {/* Email verification */}
                        <div className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 rounded-[12px]">
                          <div className="flex items-center gap-3">
                            <Lock className={`w-5 h-5 ${emailVerified ? "text-brand-green" : "text-yellow-500"}`} />
                            <div className="text-xs">
                              <span className="font-bold text-white block uppercase tracking-wider">Email Verification</span>
                              Verified: {personalInfo.email}
                            </div>
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            emailVerified ? "bg-brand-green/10 text-brand-green" : "bg-yellow-500/10 text-yellow-500"
                          }`}>
                            {emailVerified ? "SECURE" : "ATTENTION"}
                          </span>
                        </div>



                        {/* Two Factor Toggle */}
                        <div className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 rounded-[12px]">
                          <div className="flex items-center gap-3">
                            <Key className={`w-5 h-5 ${twoFactor ? "text-brand-green" : "text-gray-500"}`} />
                            <div className="text-xs">
                              <span className="font-bold text-white block uppercase tracking-wider">Two-Factor Auth (2FA)</span>
                              Add an extra layer of protection.
                            </div>
                          </div>
                          <button
                            onClick={() => setTwoFactor(!twoFactor)}
                            className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-colors cursor-pointer ${
                              twoFactor ? "bg-brand-green text-brand-black font-bold" : "bg-white/5 text-white hover:bg-white/10"
                            }`}
                          >
                            {twoFactor ? "ENABLED" : "ENABLE 2FA"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Change Password Card */}
                    <div className="glass-card p-6 sm:p-8 rounded-[20px] border border-white/10 bg-white/[0.01] flex flex-col justify-between min-h-[280px]">
                      <div className="space-y-4">
                        <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white border-b border-white/5 pb-2">
                          Update Security Credentials
                        </h3>
                        <div className="space-y-2 text-xs font-sans text-gray-400">
                          <p>
                            It is recommended to update your security password every 90 days to protect your exclusive drop codes.
                          </p>
                          <p className="text-[10px] font-mono text-gray-600">
                            LAST PASSCODE ROTATION: 28 DAYS AGO
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3 pt-6">
                        <button className="w-full py-3 bg-white text-black font-heading font-black text-xs uppercase tracking-widest rounded-full hover:bg-brand-green hover:shadow-[0_0_15px_rgba(177,243,16,0.3)] transition-all cursor-pointer">
                          Change Password
                        </button>
                        <button className="w-full py-3 border border-white/5 hover:border-white/20 text-gray-400 hover:text-white font-heading font-black text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer">
                          Manage Active Devices
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 7. PERSONAL INFORMATION */}
              {activeTab === "info" && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <h2 className="font-heading font-black text-2xl uppercase tracking-widest text-white border-b border-white/10 pb-4">
                    Personal Information
                  </h2>

                  <form onSubmit={handleInfoSave} className="glass-card p-6 sm:p-8 rounded-[20px] border border-white/10 bg-white/[0.01] space-y-6">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* First Name */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                          First Name
                        </label>
                        <input
                          type="text"
                          required
                          value={personalInfo.firstName}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                          className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all text-white"
                        />
                      </div>

                      {/* Last Name */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                          Last Name
                        </label>
                        <input
                          type="text"
                          required
                          value={personalInfo.lastName}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                          className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Email */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                          className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all text-white"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                          className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Birthday */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                          Birthday
                        </label>
                        <input
                          type="date"
                          value={personalInfo.birthday}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, birthday: e.target.value })}
                          className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all text-white"
                        />
                      </div>

                      {/* Gender */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                          Gender
                        </label>
                        <select
                          value={personalInfo.gender}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                          className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all text-white"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-Binary">Non-Binary</option>
                          <option value="Prefer Not to Say">Prefer Not to Say</option>
                        </select>
                      </div>
                    </div>

                    {infoSaved && (
                      <div className="p-4 bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs rounded font-mono uppercase tracking-wider flex items-center gap-2">
                        <Check size={16} /> Personal specifications updated successfully!
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-4 bg-brand-green text-brand-black font-heading font-black uppercase tracking-widest text-sm rounded-[var(--radius-btn)] hover:bg-white hover:shadow-[0_0_20px_rgba(177,243,16,0.4)] transition-all cursor-pointer"
                    >
                      Save Configuration
                    </button>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
            
          </div>
        </div>

        {/* RECENTLY VIEWED PRODUCTS CAROUSEL */}
        <section className="mt-20 border-t border-white/5 pt-12 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-brand-green font-bold uppercase block">
                Based on your sessions
              </span>
              <h2 className="font-heading font-black text-2xl uppercase tracking-tighter text-white">
                Recently Viewed Drops
              </h2>
            </div>
            <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase flex items-center gap-1">
              <Eye size={12} className="text-brand-green" /> Session recommendations
            </div>
          </div>

          <div className="relative w-full overflow-hidden py-4">
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
              {productsList.map((product) => (
                <div
                  key={product.id}
                  className="min-w-[200px] w-[200px] bg-white/[0.01] border border-white/5 p-4 rounded-[16px] hover:border-brand-green/30 hover:shadow-[0_15px_30px_rgba(177,243,16,0.05)] transition-all duration-300 group relative cursor-pointer"
                >
                  <div className="relative aspect-[3/4] w-full rounded-[10px] overflow-hidden bg-white/5 flex items-center justify-center mb-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="180px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-tight text-white truncate group-hover:text-brand-green transition-colors">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] font-heading font-bold tracking-widest text-brand-green">
                      ${product.price}.00
                    </span>
                    <button
                      onClick={() => addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        size: "M",
                        image: product.image
                      }, 1)}
                      className="text-[9px] font-mono font-bold uppercase tracking-wider text-white hover:text-brand-green transition-colors cursor-pointer"
                    >
                      + Quick Bag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
          </>
        )}

      </main>

      {/* MOBILE STICKY BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#090909]/95 backdrop-blur-md border-t border-white/10 py-3 px-6 flex justify-around items-center lg:hidden">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === "overview" ? "text-brand-green" : "text-gray-500 hover:text-white"
          }`}
        >
          <User size={18} />
          <span className="text-[8px] font-mono uppercase tracking-wider">Overview</span>
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === "orders" ? "text-brand-green" : "text-gray-500 hover:text-white"
          }`}
        >
          <ShoppingBag size={18} />
          <span className="text-[8px] font-mono uppercase tracking-wider">Orders</span>
        </button>
        <button
          onClick={() => setActiveTab("wishlist")}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === "wishlist" ? "text-brand-green" : "text-gray-500 hover:text-white"
          }`}
        >
          <Heart size={18} />
          <span className="text-[8px] font-mono uppercase tracking-wider">Wishlist</span>
        </button>
        <button
          onClick={() => setActiveTab("rewards")}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === "rewards" ? "text-brand-green" : "text-gray-500 hover:text-white"
          }`}
        >
          <Award size={18} />
          <span className="text-[8px] font-mono uppercase tracking-wider">Club</span>
        </button>
      </div>

      <Footer />
    </div>
  );
}
