
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DoctorProfile } from '../types';

interface DoctorContextType {
  profile: DoctorProfile;
  updateProfile: (updates: Partial<DoctorProfile>) => void;
  saveProfile: () => void;
}

const DEFAULT_PROFILE: DoctorProfile = {
  doctorName: '',
  clinicName: 'Mi Clínica Médica',
  specialty: '',
  license: '',
  logo: null,
  accentColor: '#00A9CE',
  email: '',
  phone: '',
  address: '',
};

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const DoctorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<DoctorProfile>(() => {
    const saved = localStorage.getItem('med_ia_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const updateProfile = (updates: Partial<DoctorProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const saveProfile = () => {
    localStorage.setItem('med_ia_profile', JSON.stringify(profile));
  };

  return (
    <DoctorContext.Provider value={{ profile, updateProfile, saveProfile }}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (!context) throw new Error('useDoctor must be used within a DoctorProvider');
  return context;
};
