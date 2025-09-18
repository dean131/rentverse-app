// File Path: apps/frontend/src/components/home/Footer.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: Logo and About */}
                    <div className="md:col-span-1">
                        <h3 className="text-2xl font-bold text-white mb-4">RENTVERSE</h3>
                        <p className="text-sm">
                            The trusted destination for property seekers and owners. We simplify the journey of finding a place to call home.
                        </p>
                        {/* Social Icons would go here */}
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            {/* CORRECTED: Removed nested <a> tags and applied className to <Link> */}
                            <li><Link href="/" className="hover:text-white">Company</Link></li>
                            <li><Link href="/" className="hover:text-white">Blog</Link></li>
                            <li><Link href="/" className="hover:text-white">Contact Us</Link></li>
                            <li><Link href="/" className="hover:text-white">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-white">Tenants Guide</Link></li>
                            <li><Link href="/" className="hover:text-white">Owners Section</Link></li>
                            <li><Link href="/" className="hover:text-white">Real Estate News</Link></li>
                            <li><Link href="/" className="hover:text-white">Vendor Calculator</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Stay Updated */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Stay Updated</h4>
                        <p className="text-sm mb-4">Get the latest property news and updates from Rentverse by subscribing to our newsletter.</p>
                        <div className="flex">
                            <input type="email" placeholder="Your Email Address" className="w-full px-4 py-2 rounded-l-md text-gray-800 focus:outline-none" />
                            <Button className="rounded-l-none">Subscribe</Button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm">
                    <p>© {new Date().getFullYear()} Rentverse. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

