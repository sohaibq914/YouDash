import React from "react";

const Button = ({ children, className, ...props }) => (
  <button className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`} {...props}>
    {children}
  </button>
);

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-blue-600">Logo</span>
            </a>
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="/" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </a>
              <a href="/leaderboard" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                Leaderboard
              </a>
              <a href="/goals" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                Goals
              </a>
              <a href="/analytics" className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                Analytics
              </a>
            </div>
          </div>
          <div>
            <Button>Sign Up</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
