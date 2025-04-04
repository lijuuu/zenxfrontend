import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from './index';

type CountryData = {
  [key: string]: {
    name: string;
    image: string;
  };
};

// This could be moved to a Redux slice if needed, but for simplicity we'll keep it as local state
const useCountries = () => {
  const [countries, setCountries] = useState<CountryData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("https://restcountries.com/v3.1/all");
  
      const countryData: CountryData = {};
      response.data.forEach((country: any) => {
        const code = country.cca2; 
        countryData[code] = {
          name: country.name.common,
          image: country.flags.svg, 
        };
      });
  
      setCountries(countryData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching country data", error);
      setError("Failed to fetch country data");
      setLoading(false);
    }
  };

  return { countries, fetchCountries, loading, error };
};

export default useCountries;
