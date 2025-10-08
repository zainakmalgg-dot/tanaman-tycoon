
import React, { useEffect, useState } from 'react';
import type { NotificationMessage } from '../types';

interface NotificationProps {
  message: NotificationMessage | null;
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  if (!message) return null;

  const baseClasses = "fixed bottom-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-500";
  const typeClasses = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[message.type]} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      {message.text}
    </div>
  );
};

export default Notification;
