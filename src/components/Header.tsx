import React from 'react';
import { Target, TrendingUp } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CreatorMatch</h1>
              <p className="text-purple-200 text-sm">AI-Powered Brand Compatibility Analysis</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Live Analysis</span>
          </div>
        </div>
      </div>
    </header>
  );
}