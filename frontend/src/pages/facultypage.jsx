import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Mail,
  BookOpen,
  ShieldCheck,
  AlertCircle,
  Download,
  Loader2,
  RefreshCw,
  LogOut,
  Eye,
  EyeOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./facultypage.css";

export default function Facultypage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const [odRequests, setOdRequests] = useState([]);

  // Check if faculty is already logged in
  useEffect(() => {
    const facultyLoggedIn = localStorage.getItem("facultyLoggedIn");
    if (facultyLoggedIn === "true") {
      setIsLoggedIn(true);
      fetchAllODs();
    }
  }, []);

  const fetchAllODs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/od/all");
      if (!response.ok) {
        throw new Error("Failed to fetch OD requests");
      }
      const data = await response.json();
      setOdRequests(data);
    } catch (error) {
      console.error("Error fetching ODs:", error);
      alert("Failed to fetch OD requests. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacultyLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:8000/od/auth/faculty-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }
      
      const data = await response.json();
      
      // Only allow if password is "admin123"
      if (loginData.password === "admin123") {
        setIsLoggedIn(true);
        localStorage.setItem("facultyLoggedIn", "true");
        localStorage.setItem("facultyUsername", loginData.username);
        fetchAllODs();
      } else {
        throw new Error("Invalid credentials");
      }
      
    } catch (error) {
      alert(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsLoading(false);
    setSelectedRequest(null);
    setLoginData({ username: "", password: "" });
    localStorage.removeItem("facultyLoggedIn");
    localStorage.removeItem("facultyUsername");
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this request?`)) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/od/status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Status update failed");
      }
      
      // Update local state
      setOdRequests(prev => 
        prev.map(request => 
          request._id === id ? { ...request, status: newStatus } : request
        )
      );
      
      if (selectedRequest?._id === id) {
        setSelectedRequest(prev => ({ ...prev, status: newStatus }));
      }
      
      alert(`Status updated to ${newStatus.toUpperCase()}`);
    } catch (error) {
      alert(error.message || "Failed to update status.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = odRequests.filter(request => {
    const matchesSearch = 
      (request.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (request.roll_no?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (request.student_email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (request.reason?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || (request.status === filterStatus);
    
    return matchesSearch && matchesFilter;
  });

  const getStatusCount = (status) => {
    return odRequests.filter(req => req.status === status).length;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Invalid Date";
    }
  };

  const exportToExcel = () => {
    // Simple CSV export implementation
    const headers = ['Name', 'Email', 'Roll No', 'Department', 'Section', 'Reason', 'Venue', 'Description', 'Status', 'Applied Date'];
    const csvData = [
      headers.join(','),
      ...odRequests.map(req => [
        `"${req.name || ''}"`,
        `"${req.student_email || ''}"`,
        `"${req.roll_no || ''}"`,
        `"${req.dept_name || ''}"`,
        `"${req.section || ''}"`,
        `"${req.reason || ''}"`,
        `"${req.venue || ''}"`,
        `"${req.description || ''}"`,
        `"${req.status || ''}"`,
        `"${req.applied_at ? new Date(req.applied_at).toLocaleDateString() : ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `od-requests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert("Data exported successfully!");
  };

  // Login Form
  if (!isLoggedIn) {
    return (
      <div className="relative overflow-hidden min-h-screen">
        {/* Animated Background */}
        <div className="faculty-background">
          <div className="faculty-orb-1"></div>
          <div className="faculty-orb-2"></div>
          <div className="faculty-orb-3"></div>
        </div>
        
        <div className="container relative z-10 p-4 md:p-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <button
              onClick={() => navigate("/")}
              className="faculty-btn faculty-btn-secondary flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold flex items-center gap-3 faculty-text-gradient">
                <ShieldCheck className="text-purple-400" />
                Faculty Portal - Admin Access
              </h1>
              <p className="faculty-text-muted">Restricted access for faculty members only</p>
            </div>
            
            <div className="w-32"></div>
          </motion.div>

          {/* Faculty Login Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="faculty-login-card"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-purple-500/20 mb-4">
                <ShieldCheck className="text-purple-400" size={48} />
              </div>
              <h2 className="text-2xl font-bold">Faculty Login</h2>
              <p className="faculty-text-muted mt-2">Enter admin credentials to access the portal</p>
            </div>
            
            <form onSubmit={handleFacultyLogin} className="faculty-space-y-6">
              <div className="faculty-input-group">
                <label className="faculty-input-group label">Username</label>
                <div className="faculty-input-with-icon">
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    placeholder="Enter admin username"
                    required
                    disabled={isLoading}
                  />
                  <User className="faculty-input-icon" size={20} />
                </div>
              </div>
              
              <div className="faculty-input-group">
                <label className="faculty-input-group label">Password</label>
                <div className="faculty-input-with-icon">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    placeholder="Enter admin password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-sm faculty-text-muted mt-2">
                  Hint: Password is "admin123"
                </p>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="faculty-btn faculty-btn-primary w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Authenticating...
                  </>
                ) : (
                  "Login to Faculty Portal"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main Faculty Dashboard
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Animated Background */}
      <div className="faculty-background">
        <div className="faculty-orb-1"></div>
        <div className="faculty-orb-2"></div>
        <div className="faculty-orb-3"></div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="faculty-loading-overlay">
          <Loader2 className="animate-spin text-purple-500" size={48} />
          <p className="text-white mt-4">Processing...</p>
        </div>
      )}

      <div className="container relative z-10 p-4 md:p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="faculty-btn faculty-btn-secondary flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>
            
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold flex items-center gap-3 faculty-text-gradient">
                <ShieldCheck className="text-purple-400" />
                Faculty Portal
              </h1>
              <p className="faculty-text-muted">Review and manage OD requests</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="font-medium">{localStorage.getItem("facultyUsername") || "Admin"}</p>
              <p className="text-sm faculty-text-muted">Faculty Account</p>
            </div>
            
            <button
              onClick={fetchAllODs}
              disabled={isLoading}
              className="faculty-btn faculty-btn-secondary flex items-center gap-2"
            >
              <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
            
            <button
              onClick={exportToExcel}
              disabled={isLoading}
              className="faculty-btn faculty-btn-success flex items-center gap-2"
            >
              <Download size={20} />
              Export
            </button>
            
            <button
              onClick={handleLogout}
              className="faculty-btn faculty-btn-danger flex items-center gap-2"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="faculty-stats-grid mb-8">
          <div className="faculty-stat-card faculty-stat-card-total">
            <div className="flex items-center justify-between">
              <div>
                <p className="faculty-text-muted">Total Requests</p>
                <p className="text-3xl font-bold">{odRequests.length}</p>
              </div>
              <AlertCircle className="text-blue-400" size={32} />
            </div>
          </div>
          <div className="faculty-stat-card faculty-stat-card-pending">
            <div className="flex items-center justify-between">
              <div>
                <p className="faculty-text-warning">Pending</p>
                <p className="text-3xl font-bold faculty-text-warning">{getStatusCount('pending')}</p>
              </div>
              <Clock className="faculty-text-warning" size={32} />
            </div>
          </div>
          <div className="faculty-stat-card faculty-stat-card-approved">
            <div className="flex items-center justify-between">
              <div>
                <p className="faculty-text-success">Approved</p>
                <p className="text-3xl font-bold faculty-text-success">{getStatusCount('approved')}</p>
              </div>
              <CheckCircle className="faculty-text-success" size={32} />
            </div>
          </div>
          <div className="faculty-stat-card faculty-stat-card-rejected">
            <div className="flex items-center justify-between">
              <div>
                <p className="faculty-text-danger">Rejected</p>
                <p className="text-3xl font-bold faculty-text-danger">{getStatusCount('rejected')}</p>
              </div>
              <XCircle className="faculty-text-danger" size={32} />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3.5 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search by name, roll number, email, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="faculty-input-with-icon input pl-12"
            />
          </div>
          <div className="faculty-filter-buttons">
            <button
              onClick={() => setFilterStatus("all")}
              className={`faculty-filter-btn ${filterStatus === "all" ? "active" : ""}`}
            >
              <Filter size={20} />
              All ({odRequests.length})
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`faculty-filter-btn ${filterStatus === "pending" ? "active" : ""}`}
            >
              <Clock size={20} />
              Pending ({getStatusCount('pending')})
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Requests List */}
          <div className={`lg:w-2/3 ${selectedRequest ? 'lg:w-1/2' : 'w-full'}`}>
            <h2 className="text-xl font-bold mb-4">
              OD Requests ({filteredRequests.length})
              {searchTerm && (
                <span className="text-sm faculty-text-muted ml-2">
                  filtered by "{searchTerm}"
                </span>
              )}
            </h2>
            
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 faculty-glass-panel">
                <Search size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-xl">No OD requests found</p>
                <p className="text-sm faculty-text-muted">Try changing your search or filter criteria</p>
              </div>
            ) : (
              <div className="faculty-scrollable space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredRequests.map((request) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSelectedRequest(request)}
                    className={`faculty-request-item ${selectedRequest?._id === request._id ? 'selected' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <User size={16} className="faculty-text-muted" />
                          {request.name || "N/A"}
                        </h3>
                        <p className="faculty-text-muted text-sm">
                          {request.roll_no || "N/A"} • {request.dept_name || "N/A"} • {request.section || "N/A"}
                        </p>
                      </div>
                      <span className={`faculty-status-badge ${
                        request.status === 'approved' ? 'faculty-status-approved' :
                        request.status === 'rejected' ? 'faculty-status-rejected' :
                        'faculty-status-pending'
                      }`}>
                        {request.status?.toUpperCase() || "PENDING"}
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-gray-300 font-medium">{request.reason || "No reason provided"}</p>
                      <p className="faculty-text-muted text-sm mt-1">
                        <span className="font-medium">Venue:</span> {request.venue || "N/A"}
                      </p>
                    </div>
                    
                    <p className="faculty-text-muted text-sm truncate mb-3">
                      {request.description || "No description provided"}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 faculty-text-muted">
                        <Mail size={14} />
                        <span className="truncate max-w-[200px]">{request.student_email || "N/A"}</span>
                      </div>
                      <div className="faculty-text-muted">
                        {formatDate(request.applied_at)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Request Details */}
          {selectedRequest && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-1/2"
            >
              <div className="faculty-details-panel faculty-glass-panel p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold faculty-text-gradient">Request Details</h2>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="faculty-btn faculty-btn-secondary p-1 rounded-full"
                  >
                    ×
                  </button>
                </div>

                <div className="faculty-space-y-6">
                  {/* Student Info */}
                  <div className="faculty-details-section">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <User className="text-purple-400" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">{selectedRequest.name || "N/A"}</h3>
                        <p className="faculty-text-muted">{selectedRequest.student_email || "N/A"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="faculty-text-muted text-sm">Roll Number</p>
                        <p className="font-medium">{selectedRequest.roll_no || "N/A"}</p>
                      </div>
                      <div>
                        <p className="faculty-text-muted text-sm">Department</p>
                        <p className="font-medium">{selectedRequest.dept_name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="faculty-text-muted text-sm">Section</p>
                        <p className="font-medium">{selectedRequest.section || "N/A"}</p>
                      </div>
                      <div>
                        <p className="faculty-text-muted text-sm">Applied On</p>
                        <p className="font-medium">{formatDate(selectedRequest.applied_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="faculty-details-section">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <BookOpen size={20} />
                      OD Request Information
                    </h4>
                    <div className="faculty-space-y-4">
                      <div>
                        <p className="faculty-text-muted text-sm">Reason for OD</p>
                        <p className="font-medium p-3 rounded bg-gray-800/50 mt-1">
                          {selectedRequest.reason || "No reason provided"}
                        </p>
                      </div>
                      <div>
                        <p className="faculty-text-muted text-sm">Venue</p>
                        <p className="font-medium p-3 rounded bg-gray-800/50 mt-1">
                          {selectedRequest.venue || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="faculty-text-muted text-sm">Description</p>
                        <p className="font-medium text-gray-300 p-3 rounded bg-gray-800/50 mt-1 whitespace-pre-wrap">
                          {selectedRequest.description || "No description provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="faculty-details-section">
                    <h4 className="font-bold mb-3">Current Status</h4>
                    <div className={`faculty-status-badge ${
                      selectedRequest.status === 'approved' ? 'faculty-status-approved' :
                      selectedRequest.status === 'rejected' ? 'faculty-status-rejected' :
                      'faculty-status-pending'
                    }`}>
                      {selectedRequest.status === 'approved' ? <CheckCircle size={20} /> :
                       selectedRequest.status === 'rejected' ? <XCircle size={20} /> :
                       <Clock size={20} />}
                      <span className="font-bold">
                        {selectedRequest.status?.toUpperCase() || "PENDING"}
                      </span>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="faculty-details-section">
                    <h4 className="font-bold mb-3">Update Status</h4>
                    <div className="faculty-action-buttons">
                      <button
                        onClick={() => handleStatusUpdate(selectedRequest._id, 'approved')}
                        disabled={selectedRequest.status === 'approved' || isLoading}
                        className="faculty-action-btn faculty-action-approve"
                      >
                        <CheckCircle size={20} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedRequest._id, 'rejected')}
                        disabled={selectedRequest.status === 'rejected' || isLoading}
                        className="faculty-action-btn faculty-action-reject"
                      >
                        <XCircle size={20} />
                        Reject
                      </button>
                    </div>
                    <p className="faculty-text-muted text-sm mt-3">
                      Clicking "Approve" or "Reject" will immediately update the student's request status.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}