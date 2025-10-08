import React, { useEffect, useState } from 'react';

interface AdminMessageProps {
  message: string | null;
}

const AdminMessage: React.FC<AdminMessageProps> = ({ message }) => {
  const [visible, setVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!currentMessage) {
      return null;
  }

  return (
    <div className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg font-bold shadow-lg transition-all duration-500 bg-red-600 text-white z-[100] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
      [PENGUMUMAN]: {currentMessage}
    </div>
  );
};

export default AdminMessage;
