import React from 'react';

import SleepBanner from '../../public/assets/svgs/sleep.svg';
import SleepQualityWidget from '../comps/SleepQualityWidget';

const Index = () => {
  const HeroSection = () => (
    <SleepBanner className="max-w-lg lg:max-w-2xl mx-auto p-8 " />
  );
  return (
    <main className="w-screen h-full bg-blue-200">
      <section className="max-w-6xl mx-auto py-2 px-4">
        <HeroSection />
        <SleepQualityWidget />
      </section>
    </main>
  );
};

export default Index;
