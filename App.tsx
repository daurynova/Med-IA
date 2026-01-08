
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DoctorProvider } from './context/DoctorContext';
import OnboardingPage from './features/Onboarding/OnboardingPage';
import DashboardPage from './features/Dashboard/DashboardPage';
import ConsultationPage from './features/Consultation/ConsultationPage';

const App: React.FC = () => {
  return (
    <DoctorProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
        </Routes>
      </HashRouter>
    </DoctorProvider>
  );
};

export default App;
