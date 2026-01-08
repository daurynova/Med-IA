
import { Patient, Appointment } from '../types';

export const patients: Patient[] = [
  { id: '80802', name: 'Olivia Rhye', age: 28, bloodType: 'A+', dni: 'P-4421', lastVisit: '24 Oct, 2023', status: 'Finalizado', gender: 'Femenino', insurance: 'Humano - Plan Royal' },
  { id: '80803', name: 'Phoenix Baker', age: 34, bloodType: 'O+', dni: 'P-9921', lastVisit: '24 Oct, 2023', status: 'En espera', gender: 'Masculino' },
  { id: '80804', name: 'Lana Steiner', age: 45, bloodType: 'B-', dni: 'P-5511', lastVisit: '23 Oct, 2023', status: 'Activo', gender: 'Femenino' },
];

export const appointments: Appointment[] = [
  { id: '1', patientName: 'Maria Garcia', time: '10:00 AM - 10:30 AM', type: 'General Checkup', status: 'Confirmed', date: 'Oct 24' },
  { id: '2', patientName: 'James Wilson', time: '11:15 AM - 12:00 PM', type: 'Cardiology Consult', status: 'Waiting', date: 'Oct 24' },
  { id: '3', patientName: 'Sarah Connor', time: '01:30 PM - 02:00 PM', type: 'Follow-up', status: 'Pending', date: 'Oct 24' },
];

export const weeklyData = [
  { name: 'Lun', patients: 12 },
  { name: 'Mar', patients: 19 },
  { name: 'Mié', patients: 15 },
  { name: 'Jue', patients: 22 },
  { name: 'Vie', patients: 30 },
  { name: 'Sáb', patients: 10 },
  { name: 'Dom', patients: 5 },
];
