import Image from 'next/image';
import Header from './components/Header.js';  // Assumi che Header sia stato spostato in un file separato
import FeaturesSection from './components/FeaturesSection.js';  // Assumi che FeaturesSection sia stato spostato in un file separato

export default function Home() {
  return (
    <>
      <Header />
      <Image className='w-100' src="/images/store.jpg" width={1200} height={500} alt="Store image" />
      <FeaturesSection />
    </>
  );
}