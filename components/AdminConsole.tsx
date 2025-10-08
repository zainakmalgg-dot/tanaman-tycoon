import React, { useState, useEffect, useRef } from 'react';

interface AdminConsoleProps {
  isOpen: boolean;
  onCommand: (command: string) => void;
}

const AdminConsole: React.FC<AdminConsoleProps> = ({ isOpen, onCommand }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onCommand(inputValue);
    }
    setInputValue(''); 
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-2 bg-gray-900/90 backdrop-blur-sm border-t-2 border-red-500 z-[100] shadow-2xl">
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <span className="text-red-400 font-mono text-lg animate-pulse">#</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Jalankan perintah sebagai admin..."
          className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none font-mono"
          autoComplete="off"
        />
      </form>
    </div>
  );
};

export default AdminConsole;