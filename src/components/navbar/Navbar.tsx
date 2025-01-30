import { useState } from "react";
import { Search, MapPin, Bell, User, Menu, Home, Film } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import Location from "./Location";

export default function Navbar() {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Kasaragod");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const detectCurrentLocation = () => {
    // Add your location detection logic here
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="w-full bg-white border-b shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="flex items-center">
                <img
                  src="/filmgo1.png"
                  alt="FilmGo Logo"
                  className="h-10 rounded-xl w-auto object-contain"
                />
                <span className="text-slate-900 font-bold text-2xl ml-2">
                  FilmGo
                </span>
              </div>
            </div>

            {/* Search & Location (Visible in Mobile and Desktop) */}
            <div className="flex  md:hidden  items-center space-x-4">
              <button onClick={() => setIsSearchOpen(true)}>
                <Search className="h-6 w-6 text-gray-600" />
              </button>
 
              
            </div>
            <div className="hidden md:block w-1/2">
              <SearchBar />
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center space-x-4">

              <Button variant="default" className="bg-orange-500 hover:bg-orange-600">
                Sign In
              </Button>
              {/* Notifications & User */}
              <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
              <User className="h-6 w-6 text-gray-600 cursor-pointer" />


            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Search Movies & Events</DialogTitle>
          </DialogHeader>
          <SearchBar closeSearch={() => setIsSearchOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md md:hidden">
        <div className="flex justify-around py-2">
          <div className="flex flex-col items-center text-gray-600">
            <Home className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </div>
          <div className="flex flex-col items-center text-gray-600">
            <Film className="h-6 w-6" />
            <span className="text-xs">Movies</span>
          </div>
          <div className="flex flex-col items-center text-gray-600">
            <Bell className="h-6 w-6" />
            <span className="text-xs">Notifications</span>
          </div>
          <div className="flex flex-col items-center text-gray-600">
            <User className="h-6 w-6" />
            <span className="text-xs">Profile</span>
          </div>
        </div>
      </div>
    </>
  );
}