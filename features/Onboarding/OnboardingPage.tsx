
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctor } from '../../context/DoctorContext';

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const { profile, updateProfile, saveProfile } = useDoctor();
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      saveProfile();
      navigate('/dashboard');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col lg:flex-row items-center gap-12 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
            <div className="w-full lg:w-1/2">
              <img src="https://picsum.photos/seed/doctor/600/450" className="rounded-2xl shadow-lg w-full" alt="Welcome" />
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">Bienvenido a su nuevo consultorio digital</h1>
              <p className="text-slate-600 text-lg">Gracias por elegir Med-iA. Estamos listos para ayudarle a gestionar sus pacientes de manera eficiente.</p>
              <div className="flex gap-4 pt-4">
                <button onClick={handleNext} className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all">Comenzar Configuración</button>
                <button className="border border-slate-200 px-8 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all">Ver Demo</button>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="max-w-xl mx-auto space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900">Hola, Doctor/a.</h2>
              <p className="text-slate-500 text-lg">Confirmemos su identidad profesional.</p>
            </div>
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Nombre Completo</label>
                <input 
                  type="text" 
                  value={profile.doctorName}
                  onChange={(e) => updateProfile({ doctorName: e.target.value })}
                  placeholder="Dr. Juan Pérez" 
                  className="w-full h-14 rounded-xl border-slate-200 focus:ring-primary focus:border-primary text-lg" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Especialidad</label>
                <select 
                  value={profile.specialty}
                  onChange={(e) => updateProfile({ specialty: e.target.value })}
                  className="w-full h-14 rounded-xl border-slate-200 focus:ring-primary focus:border-primary text-lg"
                >
                  <option value="">Selecciona tu especialidad</option>
                  <option value="Cardiología">Cardiología</option>
                  <option value="Pediatría">Pediatría</option>
                  <option value="Medicina General">Medicina General</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Exequatur / Licencia</label>
                <input 
                  type="text" 
                  value={profile.license}
                  onChange={(e) => updateProfile({ license: e.target.value })}
                  placeholder="Ej. 12345-67" 
                  className="w-full h-14 rounded-xl border-slate-200 focus:ring-primary focus:border-primary text-lg" 
                />
              </div>
              <button onClick={handleNext} className="w-full bg-primary text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 mt-4">Guardar y Continuar</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto h-full">
            <div className="lg:w-5/12 space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">Personaliza tu Receta</h2>
                <p className="text-slate-500">Sube tu logo y confirma los detalles.</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Nombre del Consultorio</label>
                  <input 
                    type="text" 
                    value={profile.clinicName}
                    onChange={(e) => updateProfile({ clinicName: e.target.value })}
                    className="w-full h-12 rounded-xl border-slate-200 focus:ring-primary focus:border-primary" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Logotipo</label>
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all">
                    <span className="material-symbols-outlined text-4xl text-slate-400">cloud_upload</span>
                    <span className="text-sm font-medium text-slate-600 mt-2">Haz clic para subir logo</span>
                    <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                  </label>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Color de Acento</label>
                   <div className="flex gap-4">
                      {['#00A9CE', '#3b82f6', '#10b981', '#8b5cf6'].map(color => (
                        <button 
                          key={color}
                          onClick={() => updateProfile({ accentColor: color })}
                          className={`w-10 h-10 rounded-full border-4 ${profile.accentColor === color ? 'border-slate-300' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                   </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <button onClick={() => setStep(1)} className="flex-1 border border-slate-200 h-12 rounded-xl font-bold text-slate-600">Atrás</button>
                  <button onClick={handleNext} className="flex-[2] bg-primary text-white h-12 rounded-xl font-bold shadow-lg shadow-primary/25">Continuar</button>
                </div>
              </div>
            </div>
            <div className="lg:w-7/12 bg-slate-100 rounded-3xl p-10 flex items-center justify-center relative overflow-hidden">
               <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Vista Previa en Vivo
               </div>
               {/* Recipe Preview */}
               <div className="w-full max-w-md aspect-[1/1.3] bg-white shadow-2xl rounded-sm p-8 flex flex-col">
                  <div className="flex justify-between border-b-2 pb-4" style={{ borderColor: profile.accentColor }}>
                    <div className="flex items-center gap-3">
                      {profile.logo ? <img src={profile.logo} className="w-12 h-12 rounded object-contain" /> : <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-300"><span className="material-symbols-outlined">image</span></div>}
                      <div>
                        <h4 className="font-bold text-slate-900 leading-none">{profile.clinicName}</h4>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tight">Medicina General</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-800">{profile.doctorName || 'Dr. Alejandro V.'}</p>
                      <p className="text-[9px] text-slate-500">Céd. Prof. {profile.license || '12345678'}</p>
                    </div>
                  </div>
                  <div className="mt-8 flex-1">
                    <h3 className="text-3xl font-serif font-bold italic opacity-30" style={{ color: profile.accentColor }}>Rx</h3>
                    <div className="mt-4 space-y-4">
                       <div className="h-2 w-3/4 bg-slate-50 rounded" />
                       <div className="h-2 w-1/2 bg-slate-50 rounded" />
                       <div className="h-2 w-2/3 bg-slate-50 rounded" />
                    </div>
                  </div>
                  <div className="mt-auto pt-8 flex justify-end">
                    <div className="w-32 border-t border-slate-300 pt-1 text-center">
                      <p className="text-[8px] uppercase font-bold text-slate-400 tracking-widest">Firma</p>
                    </div>
                  </div>
                  <div className="mt-4 -mx-8 -mb-8 px-8 py-2 text-white text-[9px] font-bold text-center" style={{ backgroundColor: profile.accentColor }}>
                     {profile.address || 'Av. Reforma 222, CDMX'} | Tel: {profile.phone || '(55) 1234-5678'}
                  </div>
               </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900">¿Dónde te encontrarán tus pacientes?</h2>
              <p className="text-slate-500 text-lg">Esta información aparecerá en tus recetas y recordatorios.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-900"><span className="material-symbols-outlined text-primary">place</span> <h3 className="font-bold">Dirección del Consultorio</h3></div>
                  <div className="grid grid-cols-3 gap-4">
                    <input className="col-span-2 rounded-xl border-slate-200 h-12" placeholder="Calle" onChange={(e) => updateProfile({ address: e.target.value })} />
                    <input className="rounded-xl border-slate-200 h-12" placeholder="Nº" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-900"><span className="material-symbols-outlined text-primary">phone</span> <h3 className="font-bold">Teléfonos de contacto</h3></div>
                  <input className="w-full rounded-xl border-slate-200 h-12" placeholder="Teléfono principal" onChange={(e) => updateProfile({ phone: e.target.value })} />
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <img src="https://picsum.photos/seed/map/400/200" className="w-full object-cover" alt="Map" />
                <div className="p-6 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vista Previa Paciente</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary"><span className="material-symbols-outlined">business</span></div>
                    <div>
                      <p className="font-bold">{profile.clinicName}</p>
                      <p className="text-sm text-slate-500">{profile.address || 'Av. Santa Fe 1234'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-8">
              <button onClick={() => setStep(2)} className="text-slate-500 font-bold flex items-center gap-2"><span className="material-symbols-outlined">arrow_back</span> Atrás</button>
              <button onClick={handleNext} className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-primary/25 flex items-center gap-2">Siguiente Paso <span className="material-symbols-outlined">arrow_forward</span></button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="max-w-xl mx-auto text-center space-y-8">
            <div className="relative inline-block">
               <img src="https://picsum.photos/seed/success/300/300" className="rounded-3xl shadow-2xl mx-auto" alt="Success" />
               <div className="absolute -bottom-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg"><span className="material-symbols-outlined text-3xl">check_circle</span></div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900 leading-tight">¡Felicidades! <br/> Tu consultorio digital está listo.</h2>
              <p className="text-slate-500">Hemos configurado tu perfil, horarios y plantillas básicas. Ya puedes empezar a recibir citas.</p>
            </div>
            <button onClick={handleNext} className="w-full bg-primary text-white h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 transform hover:scale-[1.02] transition-all">Finalizar y Entrar a mi Consultorio</button>
            <p className="text-sm text-slate-400">© 2024 Med-iA Platform. Todos los derechos reservados.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg text-white"><span className="material-symbols-outlined text-2xl icon-filled">medical_services</span></div>
          <span className="text-xl font-black text-slate-900 tracking-tight">Med-iA</span>
        </div>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 text-sm font-bold text-slate-600 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50">
             <span className="material-symbols-outlined text-[18px]">help</span> Ayuda
           </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-8 md:p-12">
        {step > 0 && step < 4 && (
          <div className="max-w-6xl mx-auto w-full mb-12">
            <div className="flex justify-between items-end mb-3">
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Configuración</p>
              <p className="text-xs font-bold text-slate-400">Paso {step} de 4 • {step * 25}% Completado</p>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-700" style={{ width: `${step * 25}%` }} />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center">
          {renderStep()}
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;
