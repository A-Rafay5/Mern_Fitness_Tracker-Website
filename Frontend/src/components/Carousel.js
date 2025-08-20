// src/components/Carousel.js

import { useState } from 'react';
const Carousel = () => {

    const token = localStorage.getItem('token');

    const slides = [
        {
            image: 'https://mapmy.uastatic.com/8204e443475663629ec36d12c44e0881.webp',
            heading: 'Welcome to Our Fitness Tracker',
            text: 'Track your progress and stay motivated on your fitness journey.',
            buttonText: 'Sign Up Now',
            buttonLink: '/signup', // Link to your signup page
        },
    ];

    const links = [
        { name: 'Login', href: '#' },
        { name: 'Signup', href: '#' },
    ];

    return (
        <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32 min-h-screen">
            <img
                alt=""
                src="https://mapmy.uastatic.com/8204e443475663629ec36d12c44e0881.webp"
                className="absolute inset-0 -z-10 w-full h-full object-cover object-center"
            />
            <div
                aria-hidden="true"
                className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
                />
            </div>
            <div
                aria-hidden="true"
                className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
                />
            </div>
            <div className="absolute inset-0 flex items-center justify-center px-6 py-16 sm:px-8 lg:px-10">
                <div className="mx-auto max-w-7xl sm:max-w-xl lg:max-w-2xl">
                    <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">{slides[0].heading}</h2>
                    <p className="mt-8 text-lg font-medium text-gray-300 sm:text-xl">{slides[0].text}</p>
                    <div className="mt-10">
                        {!token ? (
                            <a
                                href={slides[0].buttonLink}
                                className="inline-block px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                            >
                                {slides[0].buttonText}
                            </a>
                        ) : null}

                    </div>
                </div>
            </div>

            {/* Optionally, you can add the links for login/signup */}
            {/* <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-x-6">
                {links.map((link) => (
                    <a key={link.name} href={link.href} className="text-white font-medium">
                        {link.name} <span aria-hidden="true">&rarr;</span>
                    </a>
                ))}
            </div> */}
        </div>
    );
};

export default Carousel;
