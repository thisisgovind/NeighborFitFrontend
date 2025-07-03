import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [place, setPlace] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <SearchContext.Provider value={{ place, setPlace, result, setResult, loading, setLoading, error, setError }}>
      {children}
    </SearchContext.Provider>
  );
} 