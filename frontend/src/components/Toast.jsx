import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="text-green-400" size={20} />,
    error: <XCircle className="text-red-400" size={20} />,
    warning: <AlertCircle className="text-yellow-400" size={20} />,
    info: <AlertCircle className="text-blue-400" size={20} />
  };

  const colors = {
    success: 'bg-green-900/30 border-green-500/30',
    error: 'bg-red-900/30 border-red-500/30',
    warning: 'bg-yellow-900/30 border-yellow-500/30',
    info: 'bg-blue-900/30 border-blue-500/30'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className={`p-4 rounded-xl border backdrop-blur-xl ${colors[type]} flex items-center gap-3 mb-2 shadow-lg`}
        >
          {icons[type]}
          <span className="text-white font-medium flex-1">{message}</span>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="p-1 rounded hover:bg-white/10"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

// Toast Manager
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};