import React, { useState, useEffect } from "react";
import { Search, MapPin, Navigation2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface City {
  name: string;
  state: string;
  place_id?: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

const POPULAR_CITIES: City[] = [
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Delhi", state: "Delhi" },
  { name: "Bangalore", state: "Karnataka" },
  { name: "Hyderabad", state: "Telangana" },
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Kolkata", state: "West Bengal" },
  { name: "Pune", state: "Maharashtra" },
  { name: "Ahmedabad", state: "Gujarat" },
  { name: "Jaipur", state: "Rajasthan" },
];

interface LocationSearchProps {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  detectCurrentLocation: () => void;
}

const Location: React.FC<LocationSearchProps> = ({
  selectedLocation,
  setSelectedLocation,
  detectCurrentLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState<any>(null);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();

    return () => {
      const script = document.querySelector('script[src*="maps.googleapis.com"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializeAutocomplete = () => {
    if (window.google) {
      const service = new window.google.maps.places.AutocompleteService();
      setAutocompleteService(service);
    }
  };

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!autocompleteService || !searchQuery) {
        setPredictions([]);
        return;
      }

      setIsLoading(true);
      try {
        autocompleteService.getPlacePredictions(
          {
            input: searchQuery,
            types: ["(cities)"],
            componentRestrictions: { country: "in" },
          },
          (results: any, status: any) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              setPredictions(results);
            } else {
              setPredictions([]);
            }
            setIsLoading(false);
          }
        );
      } catch (error) {
        console.error("Error fetching predictions:", error);
        setIsLoading(false);
        setPredictions([]);
      }
    };

    const debounceTimer = setTimeout(fetchPredictions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, autocompleteService]);

  const filteredCities = searchQuery
    ? predictions
    : POPULAR_CITIES.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for your city"
        className="pl-10 w-full"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

      <Button
        variant="outline"
        className="flex items-center gap-2 mt-2"
        onClick={detectCurrentLocation}
        disabled={isLoading}
      >
        <Navigation2 className="h-4 w-4" />
        Detect my location
      </Button>

      <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-96 overflow-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : filteredCities.length > 0 ? (
          filteredCities.map((city) => (
            <Button
              key={city.place_id || city.name}
              variant="ghost"
              className="flex flex-col items-start p-4 h-auto"
              onClick={() => setSelectedLocation(city.name)}
            >
              <span className="font-medium">
                {city.structured_formatting?.main_text || city.name}
              </span>
              <span className="text-sm text-gray-500">
                {city.structured_formatting?.secondary_text || city.state}
              </span>
            </Button>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">No cities found</div>
        )}
      </div>
    </div>
  );
};

export default Location;
