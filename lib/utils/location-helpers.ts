// Location helper functions for fetching countries and cities
// These functions can be integrated with various location APIs

export interface Country {
  code: string;
  name: string;
  flag?: string;
  phoneCode?: string;
}

export interface City {
  id: string;
  name: string;
  countryCode: string;
  state?: string;
}

// Mock data for development - replace with actual API calls
const mockCountries: Country[] = [
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', phoneCode: '+966' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', phoneCode: '+971' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', phoneCode: '+965' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', phoneCode: '+974' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', phoneCode: '+973' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', phoneCode: '+968' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', phoneCode: '+962' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', phoneCode: '+961' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', phoneCode: '+20' },
  { code: 'US', name: 'United States', flag: '🇺🇸', phoneCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', phoneCode: '+44' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', phoneCode: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', phoneCode: '+61' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', phoneCode: '+49' },
  { code: 'FR', name: 'France', flag: '🇫🇷', phoneCode: '+33' },
];

const mockCities: City[] = [
  // Saudi Arabia cities
  { id: '1', name: 'Riyadh', countryCode: 'SA' },
  { id: '2', name: 'Jeddah', countryCode: 'SA' },
  { id: '3', name: 'Mecca', countryCode: 'SA' },
  { id: '4', name: 'Medina', countryCode: 'SA' },
  { id: '5', name: 'Dammam', countryCode: 'SA' },
  { id: '6', name: 'Taif', countryCode: 'SA' },
  { id: '7', name: 'Tabuk', countryCode: 'SA' },
  { id: '8', name: 'Abha', countryCode: 'SA' },

  // UAE cities
  { id: '9', name: 'Dubai', countryCode: 'AE' },
  { id: '10', name: 'Abu Dhabi', countryCode: 'AE' },
  { id: '11', name: 'Sharjah', countryCode: 'AE' },
  { id: '12', name: 'Ajman', countryCode: 'AE' },

  // Kuwait cities
  { id: '13', name: 'Kuwait City', countryCode: 'KW' },
  { id: '14', name: 'Salmiya', countryCode: 'KW' },
  { id: '15', name: 'Hawalli', countryCode: 'KW' },

  // Qatar cities
  { id: '16', name: 'Doha', countryCode: 'QA' },
  { id: '17', name: 'Al Wakrah', countryCode: 'QA' },
  { id: '18', name: 'Al Khor', countryCode: 'QA' },

  // Bahrain cities
  { id: '19', name: 'Manama', countryCode: 'BH' },
  { id: '20', name: 'Muharraq', countryCode: 'BH' },
  { id: '21', name: 'Riffa', countryCode: 'BH' },

  // Oman cities
  { id: '22', name: 'Muscat', countryCode: 'OM' },
  { id: '23', name: 'Salalah', countryCode: 'OM' },
  { id: '24', name: 'Nizwa', countryCode: 'OM' },

  // Jordan cities
  { id: '25', name: 'Amman', countryCode: 'JO' },
  { id: '26', name: 'Zarqa', countryCode: 'JO' },
  { id: '27', name: 'Irbid', countryCode: 'JO' },

  // Lebanon cities
  { id: '28', name: 'Beirut', countryCode: 'LB' },
  { id: '29', name: 'Tripoli', countryCode: 'LB' },
  { id: '30', name: 'Sidon', countryCode: 'LB' },

  // Egypt cities
  { id: '31', name: 'Cairo', countryCode: 'EG' },
  { id: '32', name: 'Alexandria', countryCode: 'EG' },
  { id: '33', name: 'Giza', countryCode: 'EG' },

  // US cities
  { id: '34', name: 'New York', countryCode: 'US' },
  { id: '35', name: 'Los Angeles', countryCode: 'US' },
  { id: '36', name: 'Chicago', countryCode: 'US' },
  { id: '37', name: 'Houston', countryCode: 'US' },

  // UK cities
  { id: '38', name: 'London', countryCode: 'GB' },
  { id: '39', name: 'Manchester', countryCode: 'GB' },
  { id: '40', name: 'Birmingham', countryCode: 'GB' },
  { id: '41', name: 'Liverpool', countryCode: 'GB' },

  // Canada cities
  { id: '42', name: 'Toronto', countryCode: 'CA' },
  { id: '43', name: 'Vancouver', countryCode: 'CA' },
  { id: '44', name: 'Montreal', countryCode: 'CA' },
  { id: '45', name: 'Calgary', countryCode: 'CA' },

  // Australia cities
  { id: '46', name: 'Sydney', countryCode: 'AU' },
  { id: '47', name: 'Melbourne', countryCode: 'AU' },
  { id: '48', name: 'Brisbane', countryCode: 'AU' },
  { id: '49', name: 'Perth', countryCode: 'AU' },

  // Germany cities
  { id: '50', name: 'Berlin', countryCode: 'DE' },
  { id: '51', name: 'Munich', countryCode: 'DE' },
  { id: '52', name: 'Hamburg', countryCode: 'DE' },
  { id: '53', name: 'Frankfurt', countryCode: 'DE' },

  // France cities
  { id: '54', name: 'Paris', countryCode: 'FR' },
  { id: '55', name: 'Marseille', countryCode: 'FR' },
  { id: '56', name: 'Lyon', countryCode: 'FR' },
  { id: '57', name: 'Toulouse', countryCode: 'FR' },
];

/**
 * Fetch all countries from the API
 * @returns Promise<Country[]> - Array of countries
 */
export async function fetchCountries(): Promise<Country[]> {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/countries');
    // if (!response.ok) throw new Error('Failed to fetch countries');
    // return await response.json();

    // For now, return mock data with simulated delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockCountries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    // Return mock data as fallback
    return mockCountries;
  }
}

/**
 * Fetch cities by country code from the API
 * @param countryCode - The country code to filter cities by
 * @returns Promise<City[]> - Array of cities for the specified country
 */
export async function fetchCitiesByCountry(countryCode: string): Promise<City[]> {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/cities?countryCode=${countryCode}`);
    // if (!response.ok) throw new Error('Failed to fetch cities');
    // return await response.json();

    // For now, return mock data with simulated delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockCities.filter(city => city.countryCode === countryCode);
  } catch (error) {
    console.error('Error fetching cities:', error);
    // Return mock data as fallback
    return mockCities.filter(city => city.countryCode === countryCode);
  }
}

/**
 * Search countries by name (case-insensitive)
 * @param query - Search query string
 * @returns Promise<Country[]> - Filtered array of countries
 */
export async function searchCountries(query: string): Promise<Country[]> {
  try {
    const countries = await fetchCountries();
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) return countries;

    return countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm) ||
      country.code.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching countries:', error);
    return [];
  }
}

/**
 * Search cities by name within a country (case-insensitive)
 * @param query - Search query string
 * @param countryCode - Country code to search within
 * @returns Promise<City[]> - Filtered array of cities
 */
export async function searchCities(query: string, countryCode?: string): Promise<City[]> {
  try {
    const cities = countryCode
      ? await fetchCitiesByCountry(countryCode)
      : mockCities;

    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) return cities;

    return cities.filter(city =>
      city.name.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
}

/**
 * Get country by code
 * @param code - Country code
 * @returns Promise<Country | null> - Country object or null if not found
 */
export async function getCountryByCode(code: string): Promise<Country | null> {
  try {
    const countries = await fetchCountries();
    return countries.find(country => country.code === code) || null;
  } catch (error) {
    console.error('Error getting country by code:', error);
    return null;
  }
}

/**
 * Get city by ID
 * @param id - City ID
 * @returns Promise<City | null> - City object or null if not found
 */
export async function getCityById(id: string): Promise<City | null> {
  try {
    const cities = await fetchCitiesByCountry(''); // Get all cities
    return cities.find(city => city.id === id) || null;
  } catch (error) {
    console.error('Error getting city by ID:', error);
    return null;
  }
}

/**
 * Validate if a country code exists
 * @param code - Country code to validate
 * @returns Promise<boolean> - True if country code exists
 */
export async function isValidCountryCode(code: string): Promise<boolean> {
  try {
    const country = await getCountryByCode(code);
    return country !== null;
  } catch (error) {
    console.error('Error validating country code:', error);
    return false;
  }
}

/**
 * Get phone code for a country
 * @param countryCode - Country code
 * @returns Promise<string | null> - Phone code or null if not found
 */
export async function getCountryPhoneCode(countryCode: string): Promise<string | null> {
  try {
    const country = await getCountryByCode(countryCode);
    return country?.phoneCode || null;
  } catch (error) {
    console.error('Error getting country phone code:', error);
    return null;
  }
}
