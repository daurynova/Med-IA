
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDoctor } from '../../context/DoctorContext';
import { patients, appointments, weeklyData } from '../../services/mockData';

type ViewType = 'Dashboard' | 'Pacientes' | 'Agenda' | 'Reportes' | 'Documentos';

const DashboardPage: React.FC = () => {
  const { profile } = useDoctor();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ViewType>('Dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'Dashboard':
        return (
          <div className="space-y-8 max-w-[1400px] mx-auto w-full">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard icon="groups" label="Pacientes Hoy" value="24" trend="+12%" color="primary" />
              <MetricCard icon="pending_actions" label="Citas Pendientes" value="8" trend="+2%" color="amber" />
              <MetricCard icon="payments" label="Ingresos (Mes)" value="$3,450" trend="+5%" color="emerald" />
              <MetricCard icon="hourglass_top" label="Tiempo de Espera" value="12 min" trend="-1m" color="rose" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart Card */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">Actividad de la Agenda</h3>
                    <p className="text-sm text-slate-400 font-medium">Citas programadas esta semana</p>
                  </div>
                  <select className="bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-500 px-4 h-9">
                    <option>Últimos 7 días</option>
                    <option>Últimos 30 días</option>
                  </select>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData}>
                      <defs>
                        <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00A9CE" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#00A9CE" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="patients" stroke="#00A9CE" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Próximas Citas</h3>
                  <button className="text-xs font-bold text-primary">Ver todas</button>
                </div>
                <div className="space-y-4 overflow-y-auto pr-1">
                  {appointments.map(apt => (
                    <div key={apt.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 transition-all cursor-pointer group">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center bg-white rounded-xl p-2 min-w-[50px] shadow-sm">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Oct</span>
                          <span className="text-xl font-black text-slate-900 leading-none">24</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{apt.patientName}</h4>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{apt.status}</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{apt.type}</p>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-2">
                             <span className="material-symbols-outlined text-[14px]">schedule</span> {apt.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-auto pt-6 w-full border-t border-dashed border-slate-200 text-sm font-bold text-slate-400 flex items-center justify-center gap-2 hover:text-primary transition-colors">
                   <span className="material-symbols-outlined text-[18px]">add</span> Nueva Cita
                </button>
              </div>
            </div>
            {/* Recent Patients Table moved to Pacientes view */}
          </div>
        );
      case 'Pacientes':
        return (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Directorio de Pacientes</h3>
                <div className="flex gap-2">
                   <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"><span className="material-symbols-outlined">filter_list</span></button>
                   <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"><span className="material-symbols-outlined">download</span></button>
                   <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20">Añadir Paciente</button>
                </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                   <tr>
                     <th className="px-6 py-4">Nombre</th>
                     <th className="px-6 py-4">ID</th>
                     <th className="px-6 py-4">Género</th>
                     <th className="px-6 py-4">Tipo Sangre</th>
                     <th className="px-6 py-4">Fecha</th>
                     <th className="px-6 py-4 text-right">Acciones</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {patients.map(p => (
                     <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/${p.id}/100/100)` }} />
                           <span className="text-sm font-bold text-slate-900">{p.name}</span>
                         </div>
                       </td>
                       <td className="px-6 py-4 text-sm text-slate-500 font-medium">{p.dni}</td>
                       <td className="px-6 py-4 text-sm text-slate-500 font-medium">{p.gender}</td>
                       <td className="px-6 py-4 text-sm text-slate-500 font-medium">{p.bloodType}</td>
                       <td className="px-6 py-4 text-sm text-slate-500 font-medium">{p.lastVisit}</td>
                       <td className="px-6 py-4 text-right">
                         <button className="text-slate-300 hover:text-slate-600 transition-colors px-2"><span className="material-symbols-outlined">edit</span></button>
                         <button className="text-slate-300 hover:text-slate-600 transition-colors px-2"><span className="material-symbols-outlined">more_vert</span></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        );
      case 'Agenda':
        return (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[500px] text-center space-y-4">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
               <span className="material-symbols-outlined text-5xl">calendar_month</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Agenda Médica</h3>
              <p className="text-slate-500 max-w-xs">Gestiona tus horarios y citas programadas con facilidad.</p>
            </div>
            <button className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20">Configurar Horarios</button>
          </div>
        );
      case 'Reportes':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold mb-4">Ingresos por Especialidad</h3>
                <div className="h-64 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 italic">Módulo de analíticas avanzado</div>
             </div>
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold mb-4">Crecimiento de Pacientes</h3>
                <div className="h-64 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 italic">Módulo de analíticas avanzado</div>
             </div>
          </div>
        );
      case 'Documentos':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Consentimientos', 'Plantillas Recetas', 'Certificados'].map(doc => (
              <div key={doc} className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-primary transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                   <span className="material-symbols-outlined">folder</span>
                </div>
                <h4 className="font-bold text-slate-900">{doc}</h4>
                <p className="text-xs text-slate-500 mt-1">12 Archivos</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-6 hidden lg:flex">
        <div className="flex items-center gap-4 mb-10 px-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="bg-primary/10 p-2 rounded-xl text-primary"><span className="material-symbols-outlined text-3xl icon-filled">medical_services</span></div>
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-tight">Med-iA</h1>
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">SaaS Médico</p>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          <NavItem icon="dashboard" label="Dashboard" active={activeView === 'Dashboard'} onClick={() => setActiveView('Dashboard')} />
          <NavItem icon="group" label="Pacientes" active={activeView === 'Pacientes'} onClick={() => setActiveView('Pacientes')} />
          <NavItem icon="calendar_month" label="Agenda" active={activeView === 'Agenda'} onClick={() => setActiveView('Agenda')} />
          <NavItem icon="analytics" label="Reportes" active={activeView === 'Reportes'} onClick={() => setActiveView('Reportes')} />
          <NavItem icon="description" label="Documentos" active={activeView === 'Documentos'} onClick={() => setActiveView('Documentos')} />
        </nav>
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <NavItem icon="settings" label="Configuración" />
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white shadow-sm" style={{ backgroundImage: `url(https://picsum.photos/seed/doc/100/100)` }} />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{profile.doctorName || 'Dr. Usuario'}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase truncate">{profile.specialty || 'Especialista'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100 px-8 flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{activeView === 'Dashboard' ? `Buenos días, ${profile.doctorName?.split(' ')[1] || 'Doctor'}` : activeView}</h2>
            <p className="text-sm text-slate-400 font-medium tracking-tight">
              {activeView === 'Dashboard' ? 'Aquí tienes el resumen de hoy.' : `Gestiona tu sección de ${activeView.toLowerCase()}.`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
              <input className="w-80 h-11 pl-10 pr-4 bg-slate-100 border-none rounded-xl text-sm focus:ring-primary focus:bg-white transition-all" placeholder="Buscar pacientes, historial..." />
            </div>
            <button className="w-11 h-11 rounded-full bg-slate-100 text-slate-400 hover:text-primary transition-colors flex items-center justify-center relative">
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button onClick={() => navigate('/consultation')} className="bg-primary text-white h-11 px-5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-[20px]">add</span>
              Nueva Consulta
            </button>
          </div>
        </header>

        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// Subcomponents
const NavItem: React.FC<{ icon: string; label: string; active?: boolean; onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${active ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
    <span className={`material-symbols-outlined text-2xl ${active ? 'icon-filled' : ''}`}>{icon}</span>
    <span className="text-sm font-bold">{label}</span>
  </button>
);

const MetricCard: React.FC<{ icon: string; label: string; value: string; trend: string; color: string }> = ({ icon, label, value, trend, color }) => {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    amber: 'bg-amber-50 text-amber-500',
    emerald: 'bg-emerald-50 text-emerald-500',
    rose: 'bg-rose-50 text-rose-500'
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4 group hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="absolute right-0 top-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity"><span className="material-symbols-outlined text-6xl">{icon}</span></div>
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorMap[color]}`}><span className="material-symbols-outlined text-2xl">{icon}</span></div>
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">trending_up</span> {trend}</span>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <h4 className="text-3xl font-black text-slate-900 mt-1">{value}</h4>
      </div>
    </div>
  );
};

export default DashboardPage;
