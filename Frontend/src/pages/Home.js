// src/pages/Home.js

import React from 'react';
import Carousel from '../components/Carousel'; // Adjust the path according to your folder structure
import TextWithImage from '../components/TextWithImage';
import CTA from '../components/CTA';
import Stats from '../components/Stats';

const Home = () => {
  return (
    <div>
      <Carousel /> {/* The Carousel component will be displayed here */}
      {/* Other content of the Home page can go here */}
      <section className="p-10 m-10">
      <TextWithImage/>
      <CTA/>
      <Stats/>
      </section>
    </div>
  );
};

export default Home;
