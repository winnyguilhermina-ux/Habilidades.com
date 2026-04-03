import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tighter">
                Hab<span className="text-red-600">.</span>com
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="hover:text-yellow-400 transition-colors px-3 py-2 rounded-md font-medium">Home</Link>
              <Link to="/cursos" className="hover:text-yellow-400 transition-colors px-3 py-2 rounded-md font-medium">Cursos</Link>
              <Link to="/contacto" className="hover:text-yellow-400 transition-colors px-3 py-2 rounded-md font-medium">Contacto</Link>
              <Link to="/ensinar" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold transition-all transform hover:scale-105">Quero Ensinar</Link>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block hover:text-yellow-400 px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <Link to="/cursos" onClick={() => setIsOpen(false)} className="block hover:text-yellow-400 px-3 py-2 rounded-md text-base font-medium">Cursos</Link>
            <Link to="/contacto" onClick={() => setIsOpen(false)} className="block hover:text-yellow-400 px-3 py-2 rounded-md text-base font-medium">Contacto</Link>
            <Link to="/ensinar" onClick={() => setIsOpen(false)} className="block bg-red-600 text-white px-3 py-2 rounded-md text-base font-bold">Quero Ensinar</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
