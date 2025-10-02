// File Path: apps/frontend/src/ui/layout/Navbar.tsx
'use client';

import { useState, useEffect, ReactNode, useCallback, useRef, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/useAuth';
import { Button } from '@/ui/ui/Button';
import { Logo } from '@/ui/ui/Logo';
import { debounce } from 'lodash';

// A dedicated NavLink component for cleaner active and hover states
const NavLink = ({ href, children }: { href: string; children: ReactNode }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    let isActive = false;

    if (href.startsWith('/properties?')) {
        const hrefParams = new URLSearchParams(href.split('?')[1]);
        const typeInHref = hrefParams.get('listingType');
        const typeInUrl = searchParams.get('listingType');
        isActive = pathname === '/properties' && typeInHref === typeInUrl && !searchParams.get('type');
    } else {
        isActive = pathname === href;
    }

    return (
        <Link
            href={href}
            className={`
                relative py-2 text-sm font-semibold transition-colors duration-300 group whitespace-nowrap
                ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}
            `}
        >
            <span>{children}</span>
            <span
                className={`
                    absolute bottom-0 left-0 h-0.5 bg-orange-400
                    transition-all duration-300 ease-in-out
                    group-hover:w-full
                    ${isActive ? 'w-full' : 'w-0'}
                `}
            />
        </Link>
    );
};

// --- ENHANCED SEARCH BAR ---

interface NominatimResult {
    place_id: number;
    display_name: string;
}

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLFormElement>(null);

    const searchAddress = useCallback(
        debounce(async (query: string) => {
            if (query.length < 3) {
                setSuggestions([]);
                return;
            }
            setIsSearching(true);
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=id&limit=5`);
                const data: NominatimResult[] = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error("Failed to fetch address suggestions:", error);
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 300),
        []
    );

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        searchAddress(query);
    };

    const handleSuggestionClick = (suggestion: NominatimResult) => {
        const address = suggestion.display_name;
        setSearchQuery(address);
        setSuggestions([]);
        router.push(`/properties?search=${encodeURIComponent(address)}`);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuggestions([]);
        const trimmedQuery = searchQuery.trim();
        router.push(trimmedQuery ? `/properties?search=${encodeURIComponent(trimmedQuery)}` : '/properties');
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSuggestions([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm" ref={searchRef}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                value={searchQuery}
                onChange={handleQueryChange}
                placeholder="Search by address..."
                autoComplete="off"
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm text-gray-800 placeholder-gray-500 transition-colors"
            />
            {(isSearching || suggestions.length > 0) && (
                <div className="absolute z-20 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-100">
                    {isSearching && <div className="p-3 text-sm text-gray-500">Searching for address...</div>}
                    <ul className="max-h-80 overflow-auto">
                        {suggestions.map(suggestion => (
                            <li
                                key={suggestion.place_id}
                                className="p-3 text-sm text-gray-800 hover:bg-gray-50 cursor-pointer"
                                onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(suggestion); }}
                            >
                                {suggestion.display_name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </form>
    );
};

export const Navbar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/properties?listingType=RENT', label: 'Rent' },
    { href: '/properties?listingType=SALE', label: 'Buy' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0"><Logo /></div>
            <div className="hidden md:block"><SearchBar /></div>
          </div>
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Suspense fallback={<div className="w-56 h-5 bg-gray-200 rounded-md" />}>
              <div className="flex items-center space-x-8">
                {navLinks.map((link) => <NavLink key={link.href} href={link.href}>{link.label}</NavLink>)}
              </div>
            </Suspense>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <>
                  <Link href="/admin/dashboard"><Button variant="outline">Dashboard</Button></Link>
                  <Button onClick={logout}>Logout</Button>
                </>
              ) : (
                <>
                  <Link href="/login"><Button variant="outline">Login</Button></Link>
                  <Link href="/register"><Button>Register</Button></Link>
                </>
              )}
            </div>
            <div className="lg:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none" aria-controls="mobile-menu" aria-expanded={isMobileMenuOpen}>
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6 transform transition-transform duration-300" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path className={`transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  <path className={`absolute transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full opacity-0'}`} id="mobile-menu">
        <div className="px-4 pt-3 pb-4 space-y-3">
          <div className="md:hidden"><SearchBar /></div>
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return <Link key={link.href} href={link.href} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'}`}>{link.label}</Link>;
            })}
          </div>
          <div className="pt-4 border-t border-gray-200 flex items-center space-x-2 md:hidden">
            {user ? (
              <>
                <Link href="/admin/dashboard" className="w-full"><Button variant="outline" className="w-full">Dashboard</Button></Link>
                <Button onClick={logout} className="w-full">Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login" className="w-full"><Button variant="outline" className="w-full">Login</Button></Link>
                <Link href="/register" className="w-full"><Button className="w-full">Register</Button></Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};