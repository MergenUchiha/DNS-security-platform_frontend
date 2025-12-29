import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast = ({ id, type, message, duration = 5000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      color: 'text-cyber-green',
      bg: 'bg-cyber-green/20',
      border: 'border-cyber-green/50',
    },
    error: {
      icon: XCircle,
      color: 'text-cyber-pink',
      bg: 'bg-cyber-pink/20',
      border: 'border-cyber-pink/50',
    },
    warning: {
      icon: AlertCircle,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/50',
    },
    info: {
      icon: Info,
      color: 'text-cyber-blue',
      bg: 'bg-cyber-blue/20',
      border: 'border-cyber-blue/50',
    },
  };

  const { icon: Icon, color, bg, border } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`glass rounded-lg p-4 border-2 ${bg} ${border} min-w-[300px] max-w-md`}
    >
      <div className="flex items-start space-x-3">
        <Icon className={`w-5 h-5 ${color} flex-shrink-0 mt-0.5`} />
        <p className="text-white flex-1 text-sm">{message}</p>
        <button
          onClick={() => onClose(id)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;