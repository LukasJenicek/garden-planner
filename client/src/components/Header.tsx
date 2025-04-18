import { useState } from "react";

interface HeaderProps {
  onSaveGarden: () => void;
  onLoadGarden: () => void;
}

export default function Header({ onSaveGarden, onLoadGarden }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-garden-green text-white py-3 px-4 shadow-md z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69a.5.5 0 0 0 .62-.45V17.5c0-.23-.18-.41-.4-.41h-.7c-.57 0-1.1-.35-1.3-.88-.39-1.05-1.06-1.38-1.76-1.38-.37 0-.62.39-.23.74.91.88 1.01 1.24 1.33 1.79.2.34.57.54.95.54h1.59c.23 0 .41.18.41.41v1.5c0 .27.25.46.49.4A9 9 0 0 0 12 2z"/>
            <path d="M12.88 7.63l-.39.7c-.07.13-.14.4 0 .59l1.66 1.3c.18.15.45.12.59-.07l.39-.7c.07-.13.09-.29 0-.43l-1.66-1.3c-.23-.18-.52-.15-.59.07z"/>
            <path d="M9.1 7.7c-.13-.07-.29-.09-.43 0l-1.3 1.66c-.15.18-.12.45.07.59l.7.39c.13.07.29.09.43 0l1.3-1.66c.15-.18.12-.45-.07-.59l-.7-.39z"/>
          </svg>
          <h1 className="text-xl md:text-2xl font-bold">Garden Planner</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <button 
            className="bg-leaf-green hover:bg-opacity-90 text-white px-4 py-1 rounded-md flex items-center"
            onClick={onSaveGarden}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
            </svg>
            Save
          </button>
          <button 
            className="bg-white text-garden-green border border-garden-green px-4 py-1 rounded-md flex items-center"
            onClick={onLoadGarden}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" />
            </svg>
            Load
          </button>
        </div>
        
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="mt-3 pb-2">
          <button 
            className="w-full bg-leaf-green hover:bg-opacity-90 text-white px-4 py-2 mb-2 rounded-md flex items-center justify-center"
            onClick={() => {
              onSaveGarden();
              setMobileMenuOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
            </svg>
            Save Garden
          </button>
          <button 
            className="w-full bg-white text-garden-green border border-garden-green px-4 py-2 rounded-md flex items-center justify-center"
            onClick={() => {
              onLoadGarden();
              setMobileMenuOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" />
            </svg>
            Load Garden
          </button>
        </div>
      )}
    </header>
  );
}
