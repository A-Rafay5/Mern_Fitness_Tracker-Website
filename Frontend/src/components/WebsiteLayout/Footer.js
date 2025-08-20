import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-6 sm:px-8 lg:px-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    {/* Logo and Description */}
                    <div>
                        <h2 className="text-2xl font-bold">Fitness Tracking</h2>
                        <p className="mt-4 text-gray-400 leading-relaxed">
                            Empowering you to achieve your goals with our innovative solutions.
                        </p>
                    </div>

                    {/* Links Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-gray-400 hover:text-white transition duration-300 ease-in-out">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/about-us" className="text-gray-400 hover:text-white transition duration-300 ease-in-out">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="/wingman" className="text-gray-400 hover:text-white transition duration-300 ease-in-out">
                                    WingmanAI
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Subscribe Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Subscribe to our newsletter to get the latest updates and offers.
                        </p>
                        <form className="mt-4 flex items-center">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 rounded-l-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            />
                            <button
                                type="submit"
                                className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-r-md hover:bg-indigo-700 transition duration-300"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Fitness Tracking. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
