import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Alert {
  id: number;
  message: string;
  type: "error" | "info" | "success";
}

interface AlertSystemProps {
  newAlert: Alert | null;
}

export const AlertSystem: React.FC<AlertSystemProps> = ({ newAlert }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Add new alerts
  useEffect(() => {
    if (!newAlert) return;

    setAlerts((prev) => [...prev, newAlert]);

    // Auto-remove after 3 seconds
    const timer = setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== newAlert.id));
    }, 3000);

    return () => clearTimeout(timer);
  }, [newAlert]);

  // Manual remove function
  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`w-full max-w-md px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium border-l-4 flex justify-between items-center
              ${alert.type === "error" ? "bg-red-600 border-red-800" : ""}
              ${alert.type === "info" ? "bg-blue-600 border-blue-800" : ""}
              ${alert.type === "success" ? "bg-green-600 border-green-800" : ""}
            `}
          >
            <span>{alert.message}</span>
            <button
              onClick={() => removeAlert(alert.id)}
              className="ml-3 font-bold hover:text-gray-200"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
