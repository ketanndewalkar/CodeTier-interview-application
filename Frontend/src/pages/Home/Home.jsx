import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from './Hero';
import FeatureCards from './FeatureCards';
import WorkflowSection from './WorkflowSection';
import AnalyticsSection from './AnalyticsSection';
import CTASection from './CTASection';
import Navbar from '../../components/ui/Navbar';
import Footer from '../../components/ui/Footer';


export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToWorkflow || location.hash === '#interview-lifecycle' || location.hash === '#workflow') {
      const timer = setTimeout(() => {
        const element = document.getElementById('interview-lifecycle');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="bg-black text-white min-h-screen selection:bg-[#6c4f91] selection:text-white overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <AnalyticsSection />
        <WorkflowSection />
        <FeatureCards />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
