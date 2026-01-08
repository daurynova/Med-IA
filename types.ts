
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface DoctorProfile {
  doctorName: string;
  clinicName: string;
  specialty: string;
  license: string;
  logo: string | null;
  accentColor: string;
  email: string;
  phone: string;
  address: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  bloodType: string;
  dni: string;
  lastVisit: string;
  status: 'Activo' | 'Inactivo' | 'Pendiente' | 'Finalizado' | 'En espera';
  gender: string;
  insurance?: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: string;
  status: 'Confirmed' | 'Waiting' | 'Pending';
  date: string;
}
