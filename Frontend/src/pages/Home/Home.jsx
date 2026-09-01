import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from './Hero';
import FeatureCards from './FeatureCards';
import WorkflowSection from './WorkflowSection';
import AnalyticsSection from './AnalyticsSection';
import CTASection from './CTASection';

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
    <div>
      <Hero />
      <AnalyticsSection />
      <WorkflowSection />
      <FeatureCards />
      <CTASection />
    </div>
  );
}
