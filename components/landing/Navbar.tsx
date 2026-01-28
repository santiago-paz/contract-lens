'use client';

import Link from 'next/link';
import { Globe } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">SplitBerlin</span>
          </div>
          <div className="hidden md:flex items-center gap-8 mr-8">
            <button 
              onClick={() => document.getElementById('product-showcase')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              How it Works
            </button>
            <button 
              onClick={() => document.getElementById('bento-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Security
            </button>
          </div>
          <div className="flex items-center gap-4">
             <Link 
              href="/login" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
            <button
              onClick={() => {
                const contactForm = document.getElementById('contact-form');
                contactForm?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
