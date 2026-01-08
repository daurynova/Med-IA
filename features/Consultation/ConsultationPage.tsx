
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctor } from '../../context/DoctorContext';
import { Medication, Patient } from '../../types';
import { patients } from '../../services/mockData';
import { GoogleGenAI } from "@google/genai";

const ConsultationPage: React.FC = () => {
  const { profile } = useDoctor();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Receta' | 'Licencia' | 'Historia'>('Receta');
  const [showMedModal, setShowMedModal] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [prescribedMeds, setPrescribedMeds] = useState<Medication[]>([
    { id: '1', name: 'Amoxicilina', dosage: '500mg', frequency: 'Cada 8 horas', duration: '7 días' },
    { id: '2', name: 'Paracetamol', dosage: '1g', frequency: 'SOS Dolor o fiebre', duration: '3 días' }
  ]);
  
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '', duration: '' });
  const patient: Patient = patients[1]; // Using James Wilson for demo

  // Audio Recording Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleAddMed = () => {
    if (newMed.name && newMed.dosage) {
      setPrescribedMeds([...prescribedMeds, { ...newMed, id: Date.now().toString() }]);
      setNewMed({ name: '', dosage: '', frequency: '', duration: '' });
      setShowMedModal(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsTranscribing(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("No se pudo acceder al micrófono. Por favor revisa los permisos.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsTranscribing(false);
    }
  };

  const transcribeAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const base64Data = await blobToBase64(blob);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: 'audio/webm',
                  data: base64Data,
                },
              },
              {
                text: "Transcribe esta consulta médica de forma precisa. Si se mencionan síntomas, diagnósticos o medicamentos, asegúrate de escribirlos correctamente en español profesional.",
              },
            ],
          },
        ],
      });

      const transcription = response.text || "";
      setClinicalNotes(prev => prev + (prev ? "\n" : "") + transcription);
    } catch (err) {
      console.error("Transcription error:", err);
      alert("Hubo un error al procesar el audio.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden flex-col">
      {/* Top Navbar */}
      <header className="flex-none h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-slate-900"><span className="material-symbols-outlined text-[28px]">arrow_back</span></button>
          <div className="flex items-center gap-3">
             <div className="bg-primary/10 p-2 rounded-lg text-primary"><span className="material-symbols-outlined text-2xl icon-filled">medical_services</span></div>
             <h1 className="text-lg font-black text-slate-900">Med-iA Consult <span className="text-slate-300 font-normal text-base ml-2">| Consultorio Digital</span></h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Sistema Online
           </div>
           <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
             <div className="text-right">
               <p className="text-sm font-bold text-slate-900 leading-none">{profile.doctorName || 'Dr. Alejandro Vega'}</p>
               <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{profile.specialty || 'Medicina Interna'}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white shadow-sm" style={{ backgroundImage: `url(https://picsum.photos/seed/doc/100/100)` }} />
           </div>
        </div>
      </header>

      {/* Patient Context Bar */}
      <div className="flex-none bg-white border-b border-slate-100 px-8 py-4 shadow-sm z-10 flex items-center justify-between">
         <div className="flex items-center gap-5">
           <div className="relative">
             <div className="w-14 h-14 rounded-full bg-cover bg-center shadow-inner" style={{ backgroundImage: `url(https://picsum.photos/seed/${patient.id}/100/100)` }} />
             <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-sm"><span className="material-symbols-outlined text-primary text-xl icon-filled">check_circle</span></div>
           </div>
           <div>
             <div className="flex items-center gap-3">
               <h2 className="text-xl font-black text-slate-900">{patient.name}</h2>
               <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded">ID: {patient.id}</span>
             </div>
             <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mt-1 uppercase tracking-tight">
               <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">calendar_today</span> {patient.age} años</span>
               <span className="w-1 h-1 bg-slate-200 rounded-full" />
               <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">bloodtype</span> {patient.bloodType}</span>
               <span className="w-1 h-1 bg-slate-200 rounded-full" />
               <span>Consulta General</span>
             </div>
           </div>
         </div>
         <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all"><span className="material-symbols-outlined text-[20px]">history</span> Historial</button>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-all"><span className="material-symbols-outlined text-[20px]">add_circle</span> Nueva Orden</button>
         </div>
      </div>

      {/* Main Workspace: Split View */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Input/Notes */}
        <div className="w-5/12 border-r border-slate-100 flex flex-col bg-white">
           <div className="p-4 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><span className="material-symbols-outlined text-primary">mic</span> Notas de Consulta</h3>
              <div className="flex gap-2">
                <button 
                  onClick={isTranscribing ? stopRecording : startRecording}
                  className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold ${isTranscribing ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{isTranscribing ? 'stop_circle' : 'mic'}</span>
                  {isTranscribing ? 'Grabando...' : 'Dictar Notas'}
                </button>
                <button onClick={() => setClinicalNotes('')} className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
              </div>
           </div>
           <div className="flex-1 p-8 space-y-6 overflow-y-auto">
              <div className="bg-primary p-6 rounded-3xl text-white shadow-xl shadow-primary/10 space-y-3 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
                 <div className="flex items-center gap-2 relative z-10">
                   <span className="material-symbols-outlined text-yellow-300">auto_awesome</span>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-80">AI Generated Summary</p>
                 </div>
                 <h4 className="text-xl font-black relative z-10">Resumen Clínico Inteligente</h4>
                 <p className="text-sm font-medium leading-relaxed opacity-90 relative z-10">
                   James presenta un cuadro de hipertensión controlada pero reporta fatiga reciente. Se recomienda monitorear frecuencia cardíaca y ajustar dieta hiposódica.
                 </p>
              </div>
              <textarea 
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="w-full h-[400px] border-none focus:ring-0 text-slate-700 text-lg leading-relaxed placeholder:text-slate-300 resize-none p-0"
                placeholder="Presione el micrófono para dictar o escriba sus notas aquí... Ejemplo: Paciente refiere dolor abdominal de 3 días de evolución..."
              />
           </div>
           <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-4">
              <button className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-black transition-all">
                <span className="material-symbols-outlined">auto_awesome</span> Generar Documentos con IA
              </button>
           </div>
        </div>

        {/* Right: Tabs & Documents */}
        <div className="w-7/12 flex flex-col p-8 gap-6 bg-slate-50/80">
          <div className="flex p-1 bg-slate-200/50 rounded-2xl w-full max-w-lg mx-auto">
             {(['Receta', 'Licencia', 'Historia'] as const).map(tab => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
               >
                 {tab}
               </button>
             ))}
          </div>

          <div className="flex-1 bg-white shadow-2xl rounded-3xl overflow-y-auto border border-slate-100 p-12 flex flex-col">
            {activeTab === 'Receta' ? (
              <div className="flex flex-col h-full relative">
                {/* Dynamic Doctor Branding from Context */}
                <div className="flex justify-between border-b-2 border-primary/20 pb-8 mb-10">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden">
                        {profile.logo ? <img src={profile.logo} className="w-full h-full object-contain" /> : <span className="material-symbols-outlined text-4xl text-slate-200">medical_services</span>}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 leading-none">{profile.clinicName || 'Mi Clínica'}</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">{profile.specialty || 'Especialista'}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">Reg. Medico: {profile.license}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-800 text-lg">{profile.doctorName || 'Dr. Alejandro Vega'}</p>
                      <p className="text-xs font-bold text-slate-500">{profile.address || 'Av. Principal 123'}</p>
                      <p className="text-xs font-bold text-slate-500">Tel: {profile.phone || '(555) 123-4567'}</p>
                    </div>
                </div>

                <div className="flex justify-between items-end mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paciente</p>
                    <p className="text-xl font-black text-slate-900">{patient.name}</p>
                    <p className="text-xs font-bold text-slate-500">ID: {patient.id}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</p>
                    <p className="text-xl font-black text-slate-900">24 Oct, 2023</p>
                    <p className="text-xs font-bold text-slate-500">Folio: #99281</p>
                  </div>
                </div>

                <div className="flex-1 space-y-8">
                  <h3 className="text-center font-black text-2xl uppercase tracking-[0.2em] text-slate-800 underline decoration-primary decoration-4 underline-offset-8 mb-12">Receta Médica</h3>
                  
                  <div className="space-y-8">
                    {prescribedMeds.map((med, idx) => (
                      <div key={med.id} className="group relative pl-6 border-l-4 border-primary/20 hover:border-primary transition-all">
                        <div className="flex justify-between items-baseline mb-2">
                          <p className="font-black text-xl text-slate-900">{idx + 1}. {med.name}</p>
                          <span className="text-sm font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-lg">{med.dosage}</span>
                        </div>
                        <p className="text-slate-600 font-medium italic">Tomar {med.frequency} por {med.duration}.</p>
                        <button 
                          onClick={() => setPrescribedMeds(prev => prev.filter(m => m.id !== med.id))}
                          className="absolute -right-4 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => setShowMedModal(true)}
                      className="w-full h-16 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-slate-400 font-bold hover:border-primary hover:text-primary transition-all group"
                    >
                      <span className="material-symbols-outlined group-hover:scale-125 transition-transform">add_circle</span>
                      Agregar Medicamento
                    </button>
                  </div>

                  <div className="mt-16 bg-amber-50 p-5 rounded-2xl border border-amber-100 flex gap-4">
                    <span className="material-symbols-outlined text-amber-500">info</span>
                    <p className="text-sm font-medium text-amber-700 leading-relaxed">Indicaciones generales: Beber abundante líquido. Volver a control si la fiebre persiste por más de 48 horas.</p>
                  </div>
                </div>

                <div className="mt-auto pt-16 flex flex-col items-center">
                   <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCssdT0UylZJHLc1C218v9RY8fQa5YFVdWRWmNUQ54Z7W1skJs2VP7u3PP_-cRNEbbTS2iTLeguW_Rf2X2OpvivhEB5nGrHTi0m2gNP29PN2FyV4js5lM9E2-QCJ38MfWy6vwxDPTIOnTt4RDIKrd65ud6_QUeBQs3zhMtEK-F-tACyddHRbjygMMSeiZEs64oZRwlMFj3ZRKOL1rbFSqda0_ur8Pwv95vOWpC7eBfnTnKx_T7OYmmkFZFXJVNXSKVPKA70DWRjXt_g" className="h-16 opacity-50 mb-2" alt="Signature" />
                   <div className="w-64 border-t border-slate-200" />
                   <p className="text-sm font-black text-slate-900 mt-2">{profile.doctorName || 'Dr. Alejandro Vega'}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Firmado electrónicamente</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-300 font-bold">Documento de {activeTab} en construcción...</div>
            )}
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-white border border-slate-200 h-14 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
               <span className="material-symbols-outlined">print</span> Imprimir
            </button>
            <button className="flex-[2] bg-slate-900 text-white h-14 rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:bg-black transition-all flex items-center justify-center gap-3">
               <span className="material-symbols-outlined">send</span> Enviar al Paciente
            </button>
          </div>
        </div>
      </main>

      {/* Medication Modal */}
      {showMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Agregar Medicamento</h3>
                <button onClick={() => setShowMedModal(false)} className="text-slate-400 hover:text-slate-900"><span className="material-symbols-outlined">close</span></button>
             </div>
             <div className="p-8 space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nombre del Medicamento</label>
                  <input 
                    type="text" 
                    value={newMed.name}
                    onChange={(e) => setNewMed({...newMed, name: e.target.value})}
                    placeholder="Ej. Omeprazol" 
                    className="w-full h-12 rounded-xl border-slate-200 focus:ring-primary focus:border-primary" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Dosis</label>
                    <input 
                      type="text" 
                      value={newMed.dosage}
                      onChange={(e) => setNewMed({...newMed, dosage: e.target.value})}
                      placeholder="20mg" 
                      className="w-full h-12 rounded-xl border-slate-200 focus:ring-primary focus:border-primary" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Frecuencia</label>
                    <input 
                      type="text" 
                      value={newMed.frequency}
                      onChange={(e) => setNewMed({...newMed, frequency: e.target.value})}
                      placeholder="Cada 24h" 
                      className="w-full h-12 rounded-xl border-slate-200 focus:ring-primary focus:border-primary" 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Duración</label>
                  <input 
                    type="text" 
                    value={newMed.duration}
                    onChange={(e) => setNewMed({...newMed, duration: e.target.value})}
                    placeholder="14 días" 
                    className="w-full h-12 rounded-xl border-slate-200 focus:ring-primary focus:border-primary" 
                  />
                </div>
             </div>
             <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button onClick={() => setShowMedModal(false)} className="flex-1 h-12 font-bold text-slate-500 hover:text-slate-900 transition-colors">Cancelar</button>
                <button onClick={handleAddMed} className="flex-1 h-12 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20">Añadir a Receta</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationPage;
