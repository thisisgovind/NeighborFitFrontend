import React, { useState } from 'react';
const API_URL = process.env.REACT_APP_API_URL;

const AddNeighborhoodForm = () => {
  const [formData, setFormData] = useState({
    placeName: '',
    societies: [
      {
        name: '',
        description: '',
        safetyRating: '',
        costOfLiving: '',
        greenSpaces: '',
        nightlife: '',
        publicTransport: ''
      }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocietyChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      societies: prev.societies.map((society, i) => 
        i === index ? { ...society, [field]: value } : society
      )
    }));
  };

  const addSociety = () => {
    setFormData(prev => ({
      ...prev,
      societies: [...prev.societies, {
        name: '',
        description: '',
        safetyRating: '',
        costOfLiving: '',
        greenSpaces: '',
        nightlife: '',
        publicTransport: ''
      }]
    }));
  };

  const removeSociety = (index) => {
    if (formData.societies.length > 1) {
      setFormData(prev => ({
        ...prev,
        societies: prev.societies.filter((_, i) => i !== index)
      }));
    }
  };

  const validate = () => {
    if (!formData.placeName || !formData.placeName.trim()) return false;
    return formData.societies.every(society => {
      if (!society.name || !society.name.trim()) return false;
      if (isNaN(Number(society.costOfLiving)) || Number(society.costOfLiving) < 1) return false;
      const ratings = ['safetyRating', 'greenSpaces', 'nightlife', 'publicTransport'];
      return ratings.every(r => society[r] >= 1 && society[r] <= 5);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      alert('Please fill all fields correctly (ratings should be 1-5)');
      return;
    }

    setLoading(true);
    try {
      // Check if place exists
      const checkRes = await fetch(`${API_URL}/api/places/${encodeURIComponent(formData.placeName)}`);
      if (checkRes.ok) {
        // Place exists, add each society to it
        let allSuccess = true;
        for (const society of formData.societies) {
          const societyData = {
            ...society,
            safetyRating: parseFloat(society.safetyRating),
            costOfLiving: parseFloat(society.costOfLiving),
            greenSpaces: parseFloat(society.greenSpaces),
            nightlife: parseFloat(society.nightlife),
            publicTransport: parseFloat(society.publicTransport)
          };
          const addSocietyRes = await fetch(`${API_URL}/api/places/${encodeURIComponent(formData.placeName)}/societies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(societyData)
          });
          if (!addSocietyRes.ok) {
            allSuccess = false;
            const errorText = await addSocietyRes.text();
            alert('Failed to add society: ' + errorText);
            break;
          }
        }
        if (allSuccess) {
          setSuccess(true);
          setFormData({
            placeName: '',
            societies: [{
              name: '',
              description: '',
              safetyRating: '',
              costOfLiving: '',
              greenSpaces: '',
              nightlife: '',
              publicTransport: ''
            }]
          });
          setTimeout(() => setSuccess(false), 3000);
        }
      } else {
        // Place does not exist, create new place as before
        const requestData = {
          name: formData.placeName,
          societies: formData.societies.map(society => ({
            name: society.name,
            description: society.description,
            safetyRating: parseFloat(society.safetyRating),
            costOfLiving: parseFloat(society.costOfLiving),
            greenSpaces: parseFloat(society.greenSpaces),
            nightlife: parseFloat(society.nightlife),
            publicTransport: parseFloat(society.publicTransport)
          }))
        };
        const res = await fetch('${API_URL}/api/places', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        });
        if (res.ok) {
          setSuccess(true);
          setFormData({
            placeName: '',
            societies: [{
              name: '',
              description: '',
              safetyRating: '',
              costOfLiving: '',
              greenSpaces: '',
              nightlife: '',
              publicTransport: ''
            }]
          });
          setTimeout(() => setSuccess(false), 3000);
        } else {
          const errorText = await res.text();
          alert('Failed to add place: ' + errorText);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred. Please check your connection and try again.');
    }
    setLoading(false);
  };

  const ratingFields = [
    { name: 'safetyRating', label: 'Safety Rating', icon: '��️' },
    { name: 'greenSpaces', label: 'Green Spaces', icon: '🌳' },
    { name: 'nightlife', label: 'Nightlife', icon: '🌙' },
    { name: 'publicTransport', label: 'Public Transport', icon: '🚌' }
  ];

  return (
    <div className="glass-card p-4 sm:p-8 rounded-2xl shadow-2xl">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Add New Place</h2>
        <p className="text-sm sm:text-base text-gray-600">Add a place with multiple societies and their ratings</p>
      </div>

      {success && (
        <div className="mb-6 p-3 sm:p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center text-sm sm:text-base">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Place added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Place Information */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Place Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Place Name</label>
            <input
              name="placeName"
              placeholder="e.g., Greater Noida, Metro City"
              value={formData.placeName}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>

        {/* Societies */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Societies</h3>
            <button
              type="button"
              onClick={addSociety}
              className="btn-secondary text-sm px-3 sm:px-4 py-2 self-start sm:self-auto"
            >
              + Add Society
            </button>
          </div>
          
          {formData.societies.map((society, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white/50">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">Society {index + 1}</h4>
                {formData.societies.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSociety(index)}
                    className="text-red-500 hover:text-red-700 text-sm self-start sm:self-auto"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Society Name</label>
                  <input
                    placeholder="e.g., Alpha 1, Greenwood"
                    value={society.name}
                    onChange={(e) => handleSocietyChange(index, 'name', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost of Living (Average per month in Rs.)</label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    placeholder="e.g., 15000"
                    value={society.costOfLiving}
                    onChange={(e) => handleSocietyChange(index, 'costOfLiving', e.target.value)}
                    className="input-field text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {ratingFields.map(field => (
                  <div key={field.name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                      <span className="mr-2">{field.icon}</span>
                      <span className="text-xs sm:text-sm">{field.label}</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      placeholder="1-5"
                      value={society[field.name]}
                      onChange={(e) => handleSocietyChange(index, field.name, e.target.value)}
                      className="rating-input text-sm sm:text-base"
                      required
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1 (Poor)</span>
                      <span>5 (Excellent)</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                <textarea
                  placeholder="Write something about this society... (About)"
                  value={society.description}
                  onChange={(e) => handleSocietyChange(index, 'description', e.target.value)}
                  className="input-field min-h-[60px]"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm sm:text-base">Adding Place...</span>
            </div>
          ) : (
            <span className="text-sm sm:text-base">Add Place</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddNeighborhoodForm;
