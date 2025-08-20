import React from 'react';
const TextWithImage = () => {
    return (
        <div className="flex flex-col lg:flex-row items-center justify-between px-6 py-16 sm:px-8 lg:px-20 relative">
            {/* Left Section */}
            <div className="lg:w-1/2 text-center lg:text-left">
                <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                    SET GOALS. <br />
                    LOG WORKOUTS. <br />
                    STAY ON TRACK.
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    Easily track your workouts, set training plans, and discover new workout routines to crush your goals.
                </p>
                <div className="mt-6">
                    <a
                        href="#"
                        className="inline-block px-8 py-3 text-lg font-semibold text-white bg-black rounded-md hover:bg-gray-800"
                    >
                        SET GOALS
                    </a>
                </div>
            </div>

            {/* Right Section */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end mt-10 lg:mt-0">
                <div className="relative w-full max-w-md lg:max-w-lg">
                    <img
                        src="https://mapmy.uastatic.com/aaeb86964c6a02e68784d45e76637d9c.webp"
                        alt="Pro Middle-Distance Runner"
                        className="rounded-lg object-cover shadow-lg"
                    />
                    <div className="absolute bottom-4 right-4 text-right text-gray-200 text-sm font-medium">
                        <br />
                    </div>
                </div>
            </div>

            {/* White Line at Bottom */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-white"></div>
        </div>
    );
};

export default TextWithImage;
