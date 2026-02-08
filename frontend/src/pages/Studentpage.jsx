import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  PlusCircle, 
  History, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  MapPin,
  FileText,
  GraduationCap,
  Loader2,
  AlertCircle,
  Eye,
  RefreshCw,
  LogOut,
  Download,
  Filter,
  Search,
  BarChart3,
  User,
  Building,
  Hash,
  Users,
  Globe,
  Target,
  Award,
  ChevronRight,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Dropdown from "../components/Dropdown";
import "./Studentpage.css";

export default function Studentpage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("apply");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState({
    student_email: "",
    name: "",
    dept_name: "",
    roll_no: "",
    section: "",
    reason: "",
    venue: "",
    description: ""
  });

  const [odRequests, setOdRequests] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  // Load student info from localStorage on component mount
  useEffect(() => {
    const savedStudent = localStorage.getItem('studentInfo');
    const savedEmail = localStorage.getItem('studentEmail');
    
    if (savedStudent && savedEmail) {
      setIsLoggedIn(true);
      setStudentEmail(savedEmail);
      setFormData(prev => ({
        ...prev,
        student_email: savedEmail
      }));
    }
  }, []);

  // Auto-refresh OD requests every 30 seconds
  useEffect(() => {
    let interval;
    if (isLoggedIn && activeTab === "history" && studentEmail) {
      fetchStudentODs();
      interval = setInterval(fetchStudentODs, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, isLoggedIn, studentEmail]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await api.login(studentEmail);
      setIsLoggedIn(true);
      localStorage.setItem('studentEmail', studentEmail);
      
      const namePart = studentEmail.split('@')[0];
      const name = namePart.split('.')[0];
      const dept = namePart.split('.')[1].replace(/\d+/g, '');
      
      setFormData(prev => ({
        ...prev,
        student_email: studentEmail,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        dept_name: dept.toUpperCase()
      }));
      
    } catch (error) {
      alert(error.message || "Login failed. Please check your email format.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setIsLoading(true);
    setShowConfirmModal(false);
    
    try {
      const odData = {
        ...formData,
        student_email: studentEmail,
        applied_at: new Date().toISOString()
      };
      
      await api.submitODRequest(odData);
      alert("✅ OD Request Submitted Successfully!");
      
      setActiveTab("history");
      await fetchStudentODs();
      
      setFormData(prev => ({
        ...prev,
        roll_no: "",
        section: "",
        reason: "",
        venue: "",
        description: ""
      }));
      
    } catch (error) {
      alert(error.message || "Failed to submit OD request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentODs = async () => {
    if (!studentEmail) return;
    
    try {
      setIsLoading(true);
      const data = await api.getStudentODsByEmail(studentEmail);
      setOdRequests(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching ODs:", error);
      setOdRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setStudentEmail("");
    setOdRequests([]);
    localStorage.removeItem('studentEmail');
  };

  // Filter and sort requests
  const filteredRequests = odRequests
    .filter(request => {
      const matchesSearch = 
        request.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case "date-desc": return new Date(b.applied_at || b.date) - new Date(a.applied_at || a.date);
        case "date-asc": return new Date(a.applied_at || a.date) - new Date(b.applied_at || b.date);
        case "status": return a.status.localeCompare(b.status);
        default: return 0;
      }
    });

  const stats = {
    total: odRequests.length,
    approved: odRequests.filter(req => req.status === 'approved').length,
    pending: odRequests.filter(req => req.status === 'pending').length,
    rejected: odRequests.filter(req => req.status === 'rejected').length
  };

  const exportToPDF = () => {
    alert("Exporting your OD history...");
    // Implement PDF export logic here
  };

  const departmentOptions = [
    { value: "CSE", label: "Computer Science & Engineering" },
    { value: "ECE", label: "Electronics & Communication" },
    {value: "AIDS", label: "Artificial Intelligence and Data Science"},
    { value: "EEE", label: "Electrical & Electronics" },
    { value: "MECH", label: "Mechanical Engineering" },
    { value: "CIVIL", label: "Civil Engineering" },
    { value: "IT", label: "Information Technology" }
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" }
  ];

  const sortOptions = [
    { value: "date-desc", label: "Newest First" },
    { value: "date-asc", label: "Oldest First" },
    { value: "status", label: "By Status" }
  ];

  if (!isLoggedIn) {
    return (
      <div className="relative overflow-hidden min-h-screen">
        {/* Animated Background */}
        <div className="ambient-background">
          <div className="gradient-orb-1"></div>
          <div className="gradient-orb-2"></div>
          <div className="gradient-orb-3"></div>
        </div>
        
        <div className="container relative z-10 p-4 md:p-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-12"
          >
            <button
              onClick={() => navigate("/")}
              className="btn btn-secondary flex items-center gap-2"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="section-icon">
                <GraduationCap className="text-gradient" size={28} />
              </div>
              <h1 className="text-3xl font-bold text-gradient">
                Student Portal
              </h1>
            </div>
            
            <div className="w-32"></div>
          </motion.div>

          {/* Login Card */}
          <div className="max-w-md mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="gradient-border hover-lift"
            >
              <div className="glass-panel p-8 overflow-hidden fade-in">
                <div className="text-center mb-8">
                  <div className="section-icon mx-auto mb-6">
                    <GraduationCap className="text-gradient" size={36} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-gradient">
                    Student Login
                  </h2>
                  <p className="text-gray-400">Access your OD management portal</p>
                </div>

                <form onSubmit={handleLogin}>
                  <div className="input-group">
                    <label className="input-group label">
                      College Email Address
                    </label>
                    <div className="input-with-icon">
                      <input
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="name.departmentYEAR@citchennai.net"
                        className="focus-ring"
                        required
                      />
                      <User className="input-icon" size={20} />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Format: name.departmentYEAR@citchennai.net
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <ShieldCheck size={20} />
                    )}
                    {isLoading ? "Authenticating..." : "Sign in to Portal"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-50 glass-panel rounded-none border-x-0 border-t-0 mb-8">
        <div className="container px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="btn btn-secondary"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Home</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="section-icon">
                  <GraduationCap className="text-gradient" size={20} />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-gradient">
                    Student Portal
                  </h1>
                  <p className="text-xs text-gray-400 truncate max-w-[200px]">{studentEmail}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportToPDF}
                className="btn btn-secondary hidden sm:flex"
              >
                <Download size={18} />
                Export
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-secondary bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container p-4 md:p-8">
        {/* Tabs */}
        <div className="tab-container mb-8">
          <button
            onClick={() => setActiveTab("apply")}
            className={`tab-button ${activeTab === "apply" ? "active" : ""}`}
          >
            <PlusCircle size={20} />
            New Application
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`tab-button ${activeTab === "history" ? "active" : ""}`}
          >
            <History size={20} />
            Request History
            {stats.total > 0 && (
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30">
                {stats.total}
              </span>
            )}
          </button>
        </div>

        {/* Apply Form */}
        <AnimatePresence mode="wait">
          {activeTab === "apply" && (
            <motion.div
              key="apply"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fade-in"
            >
              {/* Progress Indicator */}
              <div className="progress-steps">
                {["Student Info", "Academic Details", "Event Details"].map((step, index) => (
                  <React.Fragment key={step}>
                    <div className="progress-step">
                      <div className={`step-number ${index === 0 ? "active" : ""}`}>
                        {index === 0 ? <CheckCircle size={20} /> : index + 1}
                      </div>
                      <div className="step-info">
                        <div className="step-title">Step {index + 1}</div>
                        <div className="step-subtitle">{step}</div>
                      </div>
                    </div>
                    {index < 2 && <div className="step-connector" />}
                  </React.Fragment>
                ))}
              </div>

              <div className="glass-panel p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-gradient">
                      <PlusCircle className="text-blue-400" />
                      New OD Application
                    </h2>
                    <p className="text-gray-400 mt-1">Complete all sections to submit your request</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("history")}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                  >
                    View History <ChevronRight size={16} />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Student Information Section */}
                  <div className="form-section">
                    <div className="section-header">
                      <div className="section-icon bg-blue-500/10 border-blue-500/20">
                        <User className="text-blue-400" size={20} />
                      </div>
                      <div>
                        <h3 className="section-title">Student Information</h3>
                        <p className="section-subtitle">Your personal details</p>
                      </div>
                    </div>
                    
                    <div className="form-grid">
                      <div className="input-group">
                        <label className="input-group label">
                          Full Name
                        </label>
                        <div className="input-with-icon">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="focus-ring"
                            required
                          />
                          <User className="input-icon" size={20} />
                        </div>
                      </div>

                      <div className="input-group">
                        <label className="input-group label">
                          Department
                        </label>
                        <div className="input-with-icon">
                          <Dropdown
                            options={departmentOptions}
                            value={formData.dept_name}
                            onChange={(value) => setFormData({...formData, dept_name: value})}
                            placeholder="Select Department"
                            className="w-full"
                          />
                          <Building className="input-icon" size={20} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Academic Details Section */}
                  <div className="form-section">
                    <div className="section-header">
                      <div className="section-icon bg-purple-500/10 border-purple-500/20">
                        <Hash className="text-purple-400" size={20} />
                      </div>
                      <div>
                        <h3 className="section-title">Academic Details</h3>
                        <p className="section-subtitle">Your academic information</p>
                      </div>
                    </div>
                    
                    <div className="form-grid">
                      <div className="input-group">
                        <label className="input-group label">
                          Roll Number
                        </label>
                        <div className="input-with-icon">
                          <input
                            type="text"
                            name="roll_no"
                            value={formData.roll_no}
                            onChange={(e) => setFormData({...formData, roll_no: e.target.value})}
                            className="focus-ring"
                            required
                          />
                          <Hash className="input-icon" size={20} />
                        </div>
                      </div>

                      <div className="input-group">
                        <label className="input-group label">
                          Section
                        </label>
                        <div className="input-with-icon">
                          <input
                            type="text"
                            name="section"
                            value={formData.section}
                            onChange={(e) => setFormData({...formData, section: e.target.value})}
                            className="focus-ring"
                            required
                          />
                          <Users className="input-icon" size={20} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event Details Section */}
                  <div className="form-section">
                    <div className="section-header">
                      <div className="section-icon bg-pink-500/10 border-pink-500/20">
                        <Target className="text-pink-400" size={20} />
                      </div>
                      <div>
                        <h3 className="section-title">Event Details</h3>
                        <p className="section-subtitle">Information about the event</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="input-group">
                        <label className="input-group label">
                          Event Venue
                        </label>
                        <div className="input-with-icon">
                          <MapPin className="input-icon" size={20} />
                          <input
                            type="text"
                            name="venue"
                            value={formData.venue}
                            onChange={(e) => setFormData({...formData, venue: e.target.value})}
                            placeholder="e.g., IIT Madras, Chennai"
                            className="focus-ring"
                            required
                          />
                        </div>
                      </div>

                      <div className="input-group">
                        <label className="input-group label">
                          Reason for OD
                        </label>
                        <input
                          type="text"
                          name="reason"
                          value={formData.reason}
                          onChange={(e) => setFormData({...formData, reason: e.target.value})}
                          placeholder="e.g., Technical Symposium, Sports Event, Conference"
                          className="input-with-icon input focus-ring"
                          required
                        />
                      </div>

                      <div className="input-group">
                        <label className="input-group label">
                          Description
                        </label>
                        <div className="input-with-icon">
                          <FileText className="input-icon top-4" size={20} />
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows={5}
                            placeholder="Provide detailed description of the event and your participation..."
                            className="glass-textarea focus-ring"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          roll_no: "",
                          section: "",
                          reason: "",
                          venue: "",
                          description: ""
                        });
                      }}
                      className="btn btn-secondary"
                    >
                      Clear Form
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      <PlusCircle size={20} />
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="slide-in"
            >
              {/* Stats Cards */}
              <div className="stats-grid mb-8">
                <div className="stat-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total</p>
                      <p className="text-2xl font-bold mt-1">{stats.total}</p>
                    </div>
                    <BarChart3 className="text-blue-400" size={24} />
                  </div>
                </div>
                <div className="stat-card pending">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-300">Pending</p>
                      <p className="text-2xl font-bold text-yellow-300 mt-1">{stats.pending}</p>
                    </div>
                    <Clock className="text-yellow-400" size={24} />
                  </div>
                </div>
                <div className="stat-card approved">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-300">Approved</p>
                      <p className="text-2xl font-bold text-green-300 mt-1">{stats.approved}</p>
                    </div>
                    <CheckCircle className="text-green-400" size={24} />
                  </div>
                </div>
                <div className="stat-card rejected">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-300">Rejected</p>
                      <p className="text-2xl font-bold text-red-300 mt-1">{stats.rejected}</p>
                    </div>
                    <XCircle className="text-red-400" size={24} />
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="glass-panel p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
                    <input
                      type="text"
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-with-icon input pl-12 focus-ring"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Dropdown
                      options={statusOptions}
                      value={statusFilter}
                      onChange={setStatusFilter}
                      className="w-40"
                    />
                    <Dropdown
                      options={sortOptions}
                      value={sortBy}
                      onChange={setSortBy}
                      className="w-40"
                    />
                  </div>
                </div>
              </div>

              {/* Request List */}
              <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-16 glass-panel">
                    <History className="mx-auto mb-4 text-gray-500" size={48} />
                    <p className="text-gray-400 text-lg mb-2">No OD requests found</p>
                    <p className="text-gray-500 text-sm">Try adjusting your filters or submit a new request</p>
                  </div>
                ) : (
                  filteredRequests.map((request) => (
                    <motion.div
                      key={request._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-panel card-hover p-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`status-badge ${
                              request.status === 'approved' ? 'status-approved' :
                              request.status === 'rejected' ? 'status-rejected' :
                              'status-pending'
                            }`}>
                              {request.status === 'approved' && <CheckCircle size={12} />}
                              {request.status === 'rejected' && <XCircle size={12} />}
                              {request.status === 'pending' && <Clock size={12} />}
                              {request.status.toUpperCase()}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar size={14} />
                              {new Date(request.applied_at || request.date).toLocaleDateString()}
                            </div>
                          </div>
                          <h3 className="text-lg font-bold mb-2 text-white">{request.venue}</h3>
                          <p className="text-gray-300">{request.reason}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={fetchStudentODs}
                            className="btn btn-secondary p-2.5"
                            title="Refresh"
                          >
                            <RefreshCw size={18} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-400 mb-4 bg-gray-800/30 rounded-xl p-4">
                        {request.description}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-800">
                        <div className="text-gray-500">
                          Request ID: {request._id?.substring(0, 10)}...
                        </div>
                        <div className="flex items-center gap-2">
                          {request.status === 'approved' && (
                            <CheckCircle className="text-green-400" size={16} />
                          )}
                          {request.status === 'rejected' && (
                            <XCircle className="text-red-400" size={16} />
                          )}
                          {request.status === 'pending' && (
                            <Clock className="text-yellow-400" size={16} />
                          )}
                          <span className={
                            request.status === 'approved' ? 'text-green-300' :
                            request.status === 'rejected' ? 'text-red-300' :
                            'text-yellow-300'
                          }>
                            {request.status === 'approved' ? 'Approved' : 
                             request.status === 'rejected' ? 'Rejected' : 
                             'Pending Review'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Auto-refresh indicator */}
              <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Auto-refresh enabled (every 30s)
                </div>
                {lastUpdated && (
                  <span>Last updated: {lastUpdated}</span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[9999]">
          
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          />

          {/* Centered Modal */}
          <div className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4">
            <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 animate-scale-in">
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                  <AlertCircle className="text-blue-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gradient">
                  Confirm OD Submission
                </h3>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30">
                  <p className="font-medium text-blue-300">
                    Please review your application
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    Once submitted, your OD request will be sent for faculty review.
                    You cannot edit the request after submission.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400">Name:</span>
                    <span className="font-medium text-white">{formData.name}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400">Department:</span>
                    <span className="font-medium text-white">{formData.dept_name}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400">Roll No:</span>
                    <span className="font-medium text-white">{formData.roll_no}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400">Reason:</span>
                    <span className="font-medium text-blue-400">{formData.reason}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  disabled={isLoading}
                  className="btn btn-primary flex-1"
                >
                  {isLoading && <Loader2 className="animate-spin" size={20} />}
                  {isLoading ? "Submitting..." : "Confirm & Submit"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}