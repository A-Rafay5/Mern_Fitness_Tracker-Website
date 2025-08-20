import React from "react";

const AboutUs = () => {
  return (
    <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-600 mb-4">About Us</h1>
      <div className="max-w-4xl text-start text-gray-800">
        <p className="text-lg mb-4">
          Welcome to <span className="font-semibold text-indigo-500">FitTrack</span>, your ultimate partner in health and fitness. 
          At FitTrack, we are committed to empowering individuals to take charge of their fitness journeys with the help of 
          innovative tools and a supportive community.
        </p>
        <p className="text-lg mb-4">
          Whether you're aiming to shed a few pounds, build muscle, or simply maintain a healthy lifestyle, FitTrack provides 
          personalized insights and progress tracking to help you achieve your goals. Our platform is designed with simplicity 
          and functionality in mind, ensuring that everyone—from fitness enthusiasts to beginners—can navigate and enjoy the benefits.
        </p>
        <p className="text-lg mb-4">
          FitTrack was created by a team of passionate fitness enthusiasts and tech experts who believe in the transformative power of 
          technology. Together, we strive to create a space where users can track their activities, monitor their progress, and stay 
          motivated on their journey to better health.
        </p>
        <p className="text-lg mb-4">
          Join our community and let FitTrack be your guide to a healthier, happier you. Together, let's make fitness a sustainable 
          and rewarding part of life.
        </p>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-indigo-500 mb-4">Our Mission</h2>
        <p className="text-lg  text-gray-700 max-w-2xl">
          To make health and fitness accessible, measurable, and enjoyable for everyone through technology, inspiration, and 
          innovation.
        </p>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-indigo-500 mb-4">Contact Us</h2>
        <p className="text-lg text-gray-700 max-w-2xl">
          Have questions or feedback? Reach out to us at{" "}
          <a href="mailto:support@fittrack.com" className="text-indigo-600 underline">
            support@fittrack.com
          </a>. We'd love to hear from you!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
