import React from 'react';
import { ChevronDown, ArrowDown, Mail, CheckCircle, Clock } from 'lucide-react';

interface HomepageProps {
  onStartProject: () => void;
}

export const Homepage: React.FC<HomepageProps> = ({ onStartProject }) => {
  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="bg-white flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Center - Navigation items */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-1 text-gray-700 hover:text-black cursor-pointer">
                <span className="font-medium">Products</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="text-gray-700 hover:text-black cursor-pointer font-medium">
                Pricing
              </div>
              <div className="text-gray-700 hover:text-black cursor-pointer font-medium">
                Community
              </div>
            </div>

            {/* Right side - Auth buttons */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-black font-medium">
                Help
              </button>
              <button className="text-gray-700 hover:text-black font-medium">
                Sign In
              </button>
              <button className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area - Fixed Height */}
      <div className="flex-1 flex">
        {/* Hero Section - Left Side */}
        <main className="flex-1 relative px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          {/* Decorative geometric elements - positioned absolutely */}
          <div className="absolute top-16 left-16 w-4 h-4 border-2 border-black transform rotate-45"></div>
          <div className="absolute top-12 right-24 w-3 h-3 bg-black rounded-full"></div>
          <div className="absolute top-1/2 left-24 w-1 h-8 bg-black transform rotate-12"></div>
          <div className="absolute bottom-1/3 right-16 w-4 h-4 border-2 border-black rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-black rounded-full"></div>
          <div className="absolute bottom-32 left-1/3 w-6 h-1 bg-black transform rotate-45"></div>

          {/* Main content */}
          <div className="text-center max-w-4xl">
            <h1 className="text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
              We didn't reinvent the<br />
              wheel, just{' '}
              <span className="relative inline-block">
                <span className="bg-black text-white px-4 py-2 rounded-full transform -rotate-3 inline-block">
                  design
                </span>
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Design as you know it is out the door. Design as you want it just arrived.
            </p>

            <button 
              onClick={onStartProject}
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors inline-flex items-center space-x-2 shadow-lg"
            >
              <span>Our Project</span>
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>
        </main>

        {/* Process Steps Section - Right Side */}
        <aside className="w-96 bg-gray-50 flex items-center justify-center p-8">
          <div className="space-y-8">
            {/* Step 1 - Subscribe */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Subscribe</h3>
                <p className="text-gray-600 text-sm">
                  Choose a plan & request designs.
                </p>
              </div>
            </div>

            {/* Step 2 - Receive */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Receive</h3>
                <p className="text-gray-600 text-sm">
                  Get designs within days.
                </p>
              </div>
            </div>

            {/* Step 3 - Check */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Check</h3>
                <p className="text-gray-600 text-sm">
                  Revisions until satisfied.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
