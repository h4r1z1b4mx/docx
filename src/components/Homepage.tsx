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
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span className="ml-2 text-lg font-bold text-black hidden sm:block">DocX Editor</span>
            </div>

            {/* Center - Navigation items (hidden on mobile) */}
            <div className="hidden md:flex items-center space-x-8">
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
            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="text-gray-700 hover:text-black font-medium hidden sm:block">
                Help
              </button>
              <button className="text-gray-700 hover:text-black font-medium text-sm md:text-base">
                Sign In
              </button>
              <button className="bg-black text-white px-3 md:px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm md:text-base">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area - Mobile responsive */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Hero Section */}
        <main className="flex-1 relative px-4 sm:px-6 lg:px-8 flex items-center justify-center py-8 lg:py-0">
          {/* Decorative geometric elements - hidden on mobile */}
          <div className="hidden lg:block absolute top-16 left-16 w-4 h-4 border-2 border-black transform rotate-45"></div>
          <div className="hidden lg:block absolute top-12 right-24 w-3 h-3 bg-black rounded-full"></div>
          <div className="hidden lg:block absolute top-1/2 left-24 w-1 h-8 bg-black transform rotate-12"></div>
          <div className="hidden lg:block absolute bottom-1/3 right-16 w-4 h-4 border-2 border-black rounded-full"></div>
          <div className="hidden lg:block absolute top-1/3 right-1/3 w-3 h-3 bg-black rounded-full"></div>
          <div className="hidden lg:block absolute bottom-32 left-1/3 w-6 h-1 bg-black transform rotate-45"></div>

          {/* Main content */}
          <div className="text-center max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-4 lg:mb-6 leading-tight">
              Welcome to <br />
              <span className="relative inline-block">
                <span className="bg-black text-white px-3 sm:px-4 py-2 rounded-full transform -rotate-3 inline-block text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">
                  DocX Project
                </span>
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 lg:mb-8 max-w-2xl mx-auto leading-relaxed px-4 lg:px-0">
              DocX simplifies document creation and management with customizable templates and seamless export options.
            </p>

            <button 
              onClick={onStartProject}
              className="bg-black text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-800 transition-colors inline-flex items-center space-x-2 shadow-lg w-full sm:w-auto max-w-xs sm:max-w-none mx-auto justify-center"
            >
              <span>Start Your Project</span>
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>
        </main>

        {/* Process Steps Section - Responsive */}
        <aside className="w-full lg:w-96 bg-gray-50 flex items-center justify-center p-4 lg:p-8">
          <div className="space-y-6 lg:space-y-8 w-full max-w-md lg:max-w-none">
            {/* Step 1 - Upload */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-10 lg:w-12 h-10 lg:h-12 bg-black rounded-2xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base lg:text-lg font-bold text-black mb-1">Upload</h3>
                <p className="text-gray-600 text-sm">
                  Upload your documents or start with a template.
                </p>
              </div>
            </div>

            {/* Step 2 - Edit */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-10 lg:w-12 h-10 lg:h-12 bg-black rounded-2xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base lg:text-lg font-bold text-black mb-1">Edit</h3>
                <p className="text-gray-600 text-sm">
                  Customize your content with our intuitive editor.
                </p>
              </div>
            </div>

            {/* Step 3 - Export */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-10 lg:w-12 h-10 lg:h-12 bg-black rounded-2xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base lg:text-lg font-bold text-black mb-1">Export</h3>
                <p className="text-gray-600 text-sm">
                  Export your documents in multiple formats.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
