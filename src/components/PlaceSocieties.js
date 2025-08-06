import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../context/SearchContext';

const ratingCategories = [
  { key: 'costOfLiving', label: 'Cost of Living' },
  { key: 'safetyRating', label: 'Safety' },
  { key: 'greenSpaces', label: 'Green Spaces' },
  { key: 'nightlife', label: 'Nightlife' },
  { key: 'publicTransport', label: 'Public Transport' },
];

function formatRupees(amount) {
  if (isNaN(amount)) return amount;
  return `Rs. ${Number(amount).toLocaleString('en-IN')}`;
}

export default function PlaceSocieties() {
  const { place, setPlace, result, setResult, loading, setLoading, error, setError } = useContext(SearchContext);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const trimmedPlace = place.trim();
      const res = await fetch(`${API_URL}/api/places/${encodeURIComponent(trimmedPlace)}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else if (res.status === 404) {
        setError('No societies found for this place.');
      } else {
        setError('Error fetching data.');
      }
    } catch (err) {
      setError('Network error.');
    }
    setLoading(false);
  };

  return (
    <div className="glass-card p-4 sm:p-8 rounded-2xl shadow-2xl">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Search Place</h2>
        <p className="text-sm sm:text-base text-gray-600">Enter a place name to see all societies and their ratings</p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <input
          type="text"
          className="input-field flex-1"
          placeholder="Enter place name (e.g., Greater Noida)"
          value={place}
          onChange={e => setPlace(e.target.value)}
          onBlur={e => setPlace(e.target.value.trim())}
          required
        />
        <button type="submit" className="btn-primary min-w-[120px] sm:min-w-[140px]" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="mb-4 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      )}

      {result && (
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Societies in {result.name}</h3>
          {result.societies && result.societies.length > 0 ? (
            <div className="space-y-4">
              <div className="block sm:hidden">
                {result.societies.map((soc, idx) => (
                  <div
                    key={idx}
                    className="bg-white/80 rounded-lg p-4 mb-4 shadow-sm cursor-pointer hover:bg-primary-50 transition"
                    onClick={() => navigate(`/society/${encodeURIComponent(result.name)}/${encodeURIComponent(soc.name)}`, { state: { society: soc, placeName: result.name, societies: result.societies, currentIndex: idx } })}
                  >
                    <h4 className="font-semibold text-gray-800 mb-3 text-lg">{soc.name}</h4>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-green-600 whitespace-nowrap">{'avg. ' + formatRupees(soc.costOfLiving)}</span>
                      <button
                        className="ml-4 text-primary-600 hover:underline text-sm"
                        onClick={e => { e.stopPropagation(); navigate(`/society/${encodeURIComponent(result.name)}/${encodeURIComponent(soc.name)}`, { state: { society: soc, placeName: result.name, societies: result.societies, currentIndex: idx } }); }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full bg-white/80 rounded-lg shadow">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Society Name</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Cost of Living (Monthly Avg.)</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Highest Rated</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">More Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.societies.map((soc, idx) => {
                      const ratingKeys = ['safetyRating', 'greenSpaces', 'nightlife', 'publicTransport'];
                      let highestKey = ratingKeys[0];
                      ratingKeys.forEach(key => {
                        if (Number(soc[key]) > Number(soc[highestKey])) highestKey = key;
                      });
                      const highestLabel = ratingCategories.find(cat => cat.key === highestKey)?.label || '';
                      return (
                        <tr key={idx} className="border-t border-gray-200">
                          <td className="px-4 py-3 font-medium text-gray-800">{soc.name}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-semibold text-green-600 whitespace-nowrap">{formatRupees(soc.costOfLiving)}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-semibold text-blue-700">{highestLabel}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              className="bg-primary-600 text-white rounded px-3 py-1 text-sm font-medium hover:bg-primary-700 transition"
                              onClick={e => { e.stopPropagation(); navigate(`/society/${encodeURIComponent(result.name)}/${encodeURIComponent(soc.name)}`, { state: { society: soc, placeName: result.name, societies: result.societies, currentIndex: idx } }); }}
                            >
                              Click
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600 text-sm sm:text-base">No societies found for this place.</div>
          )}
        </div>
      )}
    </div>
  );
}
