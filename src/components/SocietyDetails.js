import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function formatRupees(amount) {
  if (isNaN(amount)) return amount;
  return `Rs. ${Number(amount).toLocaleString('en-IN')}`;
}

export default function SocietyDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { society, placeName, societies, currentIndex } = location.state || {};

  if (!society) {
    return <div className="p-8 text-center text-red-500">No society data found.</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 sm:p-10 bg-white/90 rounded-2xl shadow-2xl mt-8">
      <button
        className="mb-4 text-primary-600 hover:underline text-sm"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 gradient-text">{society.name}</h2>
      <p className="text-gray-600 mb-4 text-base sm:text-lg">in <span className="font-semibold">{placeName}</span></p>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Ratings & Info</h3>
        <ul className="space-y-2">
          <li><span className="font-medium">Cost of Living:</span> <span className="text-green-600 font-semibold">{formatRupees(society.costOfLiving)}</span></li>
          <li><span className="font-medium">Safety:</span> <span className="font-semibold">{society.safetyRating} / 5</span></li>
          <li><span className="font-medium">Green Spaces:</span> <span className="font-semibold">{society.greenSpaces} / 5</span></li>
          <li><span className="font-medium">Nightlife:</span> <span className="font-semibold">{society.nightlife} / 5</span></li>
          <li><span className="font-medium">Public Transport:</span> <span className="font-semibold">{society.publicTransport} / 5</span></li>
        </ul>
      </div>
      {society.description && (
        <div className="mb-2">
          <h3 className="text-lg font-semibold mb-2">About</h3>
          <p className="text-gray-700 whitespace-pre-line">{society.description}</p>
        </div>
      )}
    </div>
  );
} 