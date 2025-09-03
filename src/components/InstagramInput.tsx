import React, { useState } from 'react';
import { Search, Instagram, Loader2 } from 'lucide-react';

interface InstagramInputProps {
  onAnalyze: (handle: string) => void;
  isLoading: boolean;
}

export function InstagramInput({ onAnalyze, isLoading }: InstagramInputProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const extractHandle = (input: string): string => {
    // Remove @ symbol if present
    let handle = input.replace('@', '');
    
    // Extract handle from Instagram URL
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)/;
    const match = handle.match(urlRegex);
    
    if (match) {
      return match[1];
    }
    
    // Return as-is if it's just a handle
    return handle;
  };

  const validateHandle = (handle: string): boolean => {
    const handleRegex = /^[a-zA-Z0-9._]+$/;
    return handleRegex.test(handle) && handle.length >= 1 && handle.length <= 30;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!input.trim()) {
      setError('Please enter an Instagram handle or URL');
      return;
    }
    
    const handle = extractHandle(input.trim());
    
    if (!validateHandle(handle)) {
      setError('Please enter a valid Instagram handle');
      return;
    }
    
    onAnalyze(handle);
  };

  return (
    <div className="mb-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <div className="text-center mb-6">
          <Instagram className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Analyze Creator Compatibility</h2>
          <p className="text-purple-200">Enter an Instagram handle or URL to get detailed brand compatibility insights</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="@username or instagram.com/username"
                className="w-full px-4 py-4 pl-12 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                disabled={isLoading}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
            </div>
            {error && (
              <p className="mt-2 text-red-300 text-sm">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing Creator...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Analyze Compatibility</span>
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-purple-200 text-sm">
            Try: @nike, @selenagomez, or https://instagram.com/cristiano
          </p>
        </div>
      </div>
    </div>
  );
}