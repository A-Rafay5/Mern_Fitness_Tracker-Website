import React from 'react';

const CTA = () => {
    return (
        <div className="flex items-center justify-center px-6 py-16 sm:px-8 lg:px-16 bg-gray-100">
            <div className="mx-auto max-w-lg text-center flex flex-col items-center justify-center lg:mx-0 lg:flex-auto lg:text-left">
                <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                    PUSH YOUR LIMITS
                </h2>
                <p className="mt-6 text-lg text-center text-gray-700">
                    Hit milestones and PR’s by taking on a new challenge every month.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                    <a
                        href="#"
                        className="inline-block px-8 py-3 text-lg font-semibold text-white bg-black rounded-md hover:bg-gray-800"
                    >
                        GET STARTED
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CTA;
