import  { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchMovies } from "../../services/MovieService";
import { useDebounce } from "../../hooks/useDebounce";
import { Movie } from "../../types/movie";

interface SearchBarProps {
  closeSearch?: () => void;
}

export default function SearchBar({ closeSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery) {
        setResults([]);
        setTotalResults(0);
        return;
      }

      setIsSearching(true);
      try {
        const response = await searchMovies(debouncedQuery);
        setResults(response.data);
        setTotalResults(response.total);
      } catch (error) {
        console.error("Error searching movies:", error);
        setResults([]);
        setTotalResults(0);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for Movies, Events, Plays, Sports..."
        className="pl-10 pr-4 py-2 w-full"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

      {query && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-96 overflow-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <>
              <div className="p-2 text-sm text-gray-500 border-b">
                Found {totalResults} results
              </div>
              <div className="py-2">
                {results.map((movie) => (
                  <div
                    key={movie._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setQuery("");
                      if (closeSearch) closeSearch();
                    }}
                  >
                    <div className="font-medium capitalize">{movie.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="capitalize">{movie.type}</span>
                      {movie.locationName && (
                        <>
                          <span>•</span>
                          <span>{movie.locationName}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
