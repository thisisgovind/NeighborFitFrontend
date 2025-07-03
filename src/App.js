import React, { useState, useContext, useEffect } from 'react';
import './index.css';
import AddNeighborhoodForm from './components/AddNeighborhoodForm';
import PlaceSocieties from './components/PlaceSocieties';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SocietyDetails from './components/SocietyDetails';
import { SearchProvider, SearchContext } from './context/SearchContext';
import neighborhoodLogo from './neighborhood-logo.png';

function AppContent() {
  const [activeTab, setActiveTab] = useState('search');
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const searchContext = useContext(SearchContext);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (searchContext) {
      searchContext.setPlace('');
      searchContext.setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img src={neighborhoodLogo} alt="NeighborFit Logo" className="h-8 w-8 sm:h-10 sm:w-10" style={{display: 'inline-block', verticalAlign: 'middle'}} />
            <h1 className="text-lg sm:text-2xl font-bold gradient-text" style={{display: 'inline-block', verticalAlign: 'middle'}}>NeighborFit</h1>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="#about" onClick={e => { e.preventDefault(); setShowAbout(true); }}>About</a>
            <a href="#contact" onClick={e => { e.preventDefault(); setShowContact(true); }}>Contact</a>
          </div>
        </nav>
      </header>

      {/* Add About Modal/Section */}
      {showAbout && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative border">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl" onClick={() => setShowAbout(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-4 gradient-text">About NeighborFit</h2>
            <p className="mb-3 text-gray-700">NeighborFit helps users find the perfect neighborhood and society based on their preferences and needs. You can:</p>
            <ul className="list-disc pl-6 mb-3 text-gray-700">
              <li>Search for a place and view a list of societies with their average cost of living.</li>
              <li>Click 'Click' to view full details of any society, including ratings for safety, green spaces, nightlife, public transport, and a description.</li>
              <li>Add a new place with multiple societies, each with detailed ratings and descriptions.</li>
              <li>See which aspect (e.g., Safety, Green Spaces) each society is highest rated for.</li>
              <li>Enjoy a clean, modern, and responsive interface.</li>
            </ul>
            <p className="text-gray-700">This project is a demo for neighborhood and society comparison, ideal for people moving to a new city or looking for the best place to live.</p>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative border">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl" onClick={() => setShowContact(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-4 gradient-text">Contact</h2>
            <div className="space-y-2 text-gray-700">
              <div><span className="font-semibold">Name:</span> Govind Kumar</div>
              <div><span className="font-semibold">University:</span> Galgotias University</div>
              <div><span className="font-semibold">Mobile No.:</span> 9006473255</div>
              <div><span className="font-semibold">Email:</span> govind01012003@gmail.com</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold gradient-text mb-3 sm:mb-4">
            Discover Your Ideal Neighborhood
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Use our intelligent matching system to find the perfect neighborhood based on your preferences for safety, cost of living, green spaces, nightlife, and public transport.
          </p>
        </div>

        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-white border rounded-full p-1 w-full max-w-lg shadow-sm">
            <div className="flex space-x-1">
              <button
                onClick={() => handleTabChange('search')}
                className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-200 text-sm sm:text-base ${activeTab === 'search' ? 'bg-[#2563eb] text-white shadow' : 'text-gray-600 hover:text-primary-600'}`}
              >
                Search Place
              </button>
              <button
                onClick={() => handleTabChange('add')}
                className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-200 text-sm sm:text-base ${activeTab === 'add' ? 'bg-[#2563eb] text-white shadow' : 'text-gray-600 hover:text-primary-600'}`}
              >
                Add Place
              </button>
            </div>
          </div>
        </div>

        <div className="card" style={{maxWidth: '100%'}}>
          <Routes>
            <Route path="/" element={
              <div>
                {activeTab === 'search' ? (
                  <PlaceSocieties setActiveTab={setActiveTab} />
                ) : (
                  <AddNeighborhoodForm />
                )}
              </div>
            } />
            <Route path="/society/:placeName/:societyName" element={<SocietyDetails />} />
          </Routes>
        </div>

        {/* Features Section */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="glass-card p-4 sm:p-6 rounded-xl text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Smart Matching</h3>
            <p className="text-sm sm:text-base text-gray-600">Our algorithm finds the perfect neighborhood based on your preferences and priorities.</p>
          </div>
          
          <div className="glass-card p-4 sm:p-6 rounded-xl text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Comprehensive Data</h3>
            <p className="text-sm sm:text-base text-gray-600">Detailed information on safety, cost, amenities, and transportation options.</p>
          </div>
          
          <div className="glass-card p-4 sm:p-6 rounded-xl text-center sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Instant Results</h3>
            <p className="text-sm sm:text-base text-gray-600">Get matched with your ideal neighborhood in seconds with our fast algorithm.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16 sm:mt-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <p className="text-sm sm:text-base text-gray-600">&copy; 2025 NeighborFit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <SearchProvider>
        <AppContent />
      </SearchProvider>
    </Router>
  );
}
