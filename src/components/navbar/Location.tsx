import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Navigation2, ChevronRight } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { PopularCity } from "../../types/location";





const POPULAR_CITIES: PopularCity[] = [
  { name: "Kasaragod", state: "Kerala" },
  { name: "Kochi", state: "Kerala" },
  { name: "Trivandrum", state: "Kerala" },
];

const LocationSelector = () => {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Kasaragod");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

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
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const initializeAutocomplete = () => {
    if (window.google?.maps) {
      const service = new window.google.maps.places.AutocompleteService();
      setAutocompleteService(service);
    }
  };

  const detectCurrentLocation = () => {
    if (!window.google?.maps) {
      console.error("Google Maps not loaded");
      return;
    }

    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new window.google.maps.Geocoder();
          const latlng = { lat: latitude, lng: longitude };

          geocoder.geocode(
            { location: latlng },
            (
              results: google.maps.GeocoderResult[] | null,
              status: google.maps.GeocoderStatus
            ) => {
              if (status === "OK" && results?.[0]) {
                const cityComponent = results[0].address_components.find(
                  (component) => component.types.includes("locality")
                );
                if (cityComponent) {
                  setSelectedLocation(cityComponent.long_name);
                  setCurrentLocation(cityComponent.long_name);
                }
              }
              setIsLoading(false);
            }
          );
        },
        (error: GeolocationPositionError) => {
          console.error("Error getting location:", error);
          alert("Failed to detect location. Please allow location access.");
          setIsLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleLocationSelect = (locationName: string) => {
    setSelectedLocation(locationName);
    setIsLocationOpen(false);
  };

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!autocompleteService || !debouncedSearchQuery) {
        setPredictions([]);
        return;
      }

      setIsLoading(true);
      try {
        const request: google.maps.places.AutocompletionRequest = {
          input: debouncedSearchQuery,
          types: ["(cities)"],
          componentRestrictions: { country: "in" },
        };

        autocompleteService.getPlacePredictions(
          request,
          (
            results: google.maps.places.AutocompletePrediction[] | null,
            status: google.maps.places.PlacesServiceStatus
          ) => {
            if (status === "OK" && results) {
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

    fetchPredictions();
  }, [debouncedSearchQuery, autocompleteService]);

  const filteredCities: (google.maps.places.AutocompletePrediction | PopularCity)[] = 
    searchQuery ? predictions : POPULAR_CITIES;

  return (
    <>
      <Button 
        variant="ghost" 
        size="lg" 
        className="hidden lg:flex items-center space-x-1" 
        onClick={() => setIsLocationOpen(true)}
      >
        <MapPin className="h-4 w-4" />
        <span className="text-base">{selectedLocation}</span>
      </Button>

      <div 
        className="flex lg:hidden items-center space-x-1 cursor-pointer" 
        onClick={() => setIsLocationOpen(true)}
      >
        <span className="text-sm text-orange-500">{selectedLocation}</span>
        <ChevronRight className="h-4 w-4 text-orange-500" />
      </div>

      <Dialog open={isLocationOpen} onOpenChange={setIsLocationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose your location</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4 h-96">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Search for your city"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={detectCurrentLocation} 
                disabled={isLoading}
              >
                <Navigation2 className="h-4 w-4" />
                <span className="hidden md:inline">Detect my location</span>
              </Button>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">
                {searchQuery ? "Search Results" : "Popular Cities"}
              </h3>
              <div className="grid grid-cols-3 gap-4 max-h-[300px] overflow-y-auto">
                {isLoading ? (
                  <div className="col-span-3 text-center py-4">Loading...</div>
                ) : filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <Button
                      key={'place_id' in city ? city.place_id : city.name}
                      variant="ghost"
                      className="flex flex-col items-start p-4 h-auto"
                      onClick={() => 
                        handleLocationSelect(
                          'structured_formatting' in city 
                            ? city.structured_formatting.main_text 
                            : city.name
                        )
                      }
                    >
                      <span className="font-medium">
                        {'structured_formatting' in city 
                          ? city.structured_formatting.main_text 
                          : city.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {'structured_formatting' in city 
                          ? city.structured_formatting.secondary_text 
                          : city.state}
                      </span>
                    </Button>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-4">No cities found</div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LocationSelector;