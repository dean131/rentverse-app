// File Path: apps/frontend/src/components/home/Footer.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { SocialIcon } from '@/components/ui/SocialIcon';

export const Footer = () => {
    const socialLinks = [
        { href: "#", src: "/icons/instagram.png", alt: "Instagram" },
        { href: "#", src: "/icons/youtube.png", alt: "YouTube" },
        { href: "#", src: "/icons/facebook.png", alt: "Facebook" },
        { href: "#", src: "/icons/tiktok.png", alt: "TikTok" },
        { href: "#", src: "/icons/x.png", alt: "X" }
    ];

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Column 1: Logo and About */}
                    <div className="space-y-4">
                        {/* The className is no longer needed here as the PNG has its own colors */}
                        <Logo />
                        <p className="text-sm">
                            The trusted platform for finding your perfect home, whether youre buying, renting, or selling.
                        </p>
                        <div className="flex space-x-4 pt-2">
                           {socialLinks.map(link => <SocialIcon key={link.alt} href={link.href} src={link.src} alt={link.alt} />)}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="pt-2">
                        <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/properties" className="hover:text-white">Property</Link></li>
                            <li><Link href="/properties?type=rent" className="hover:text-white">Rent</Link></li>
                            <li><Link href="/contact" className="hover:text-white">Talk to an expert</Link></li>
                            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                            <li><Link href="/about" className="hover:text-white">About us</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div className="pt-2">
                        <h4 className="font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/help" className="hover:text-white">Help center</Link></li>
                            <li><Link href="/guides" className="hover:text-white">Guides & Articles</Link></li>
                            <li><Link href="/news" className="hover:text-white">Real Estate News</Link></li>
                            <li><Link href="/trends" className="hover:text-white">Market Trends</Link></li>
                            <li><Link href="/calculator" className="hover:text-white">Mortgage Calculator</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Stay Updated */}
                    <div className="pt-2">
                        <h4 className="font-semibold text-white mb-4">Stay Updated</h4>
                        <p className="text-sm mb-4">Subscribe to our newsletter for the latest properties and real estate tips.</p>
                        <div className="flex">
                            <input 
                                type="email" 
                                placeholder="Enter Email Address" 
                                className="w-full px-4 py-2 rounded-l-md text-gray-800 bg-gray-100 border-0 focus:ring-2 focus:ring-orange-500" 
                            />
                            <Button className="rounded-l-none !px-4">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
                    <p>© {new Date().getFullYear()} Rentverse. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

