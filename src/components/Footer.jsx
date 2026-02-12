import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Learnix</span>
            </Link>
            <p className="text-gray-600 max-w-sm text-sm leading-relaxed">
              Empowering learners and educators with modern online learning
              technology. Transform your educational journey with Learnix.
            </p>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">
              Platform
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/courses" className="hover:text-blue-600 transition-colors">Browse Courses</Link>
              </li>
              <li>
                <Link to="/instructor/dashboard" className="hover:text-blue-600 transition-colors">Instructor Dashboard</Link>
              </li>
              <li>
                <Link to="/student/dashboard" className="hover:text-blue-600 transition-colors">Student Dashboard</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">
              Support
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/help" className="hover:text-blue-600 transition-colors">Help Center</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            © {currentYear} Learnix. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Privacy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
