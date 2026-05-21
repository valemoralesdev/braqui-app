import React from 'react';

export const PrescripcionMedica = ({ data, formData }) => {
  if (!data || !formData) return null;

  return (
    <div className="bg-white p-12 shadow-2xl border border-slate-200 w-[210mm] min-h-[297mm] mx-auto text-slate-800 print:shadow-none print:border-none" id="prescripcion-medica">
      {/* Encabezado */}
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
        <div>
          <h1 className="text-2xl font-black uppercase text-slate-900">Clínica Privada de Radioterapia</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Servicio de Física Médica</p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-bold uppercase bg-slate-900 text-white px-4 py-1 italic">Prescripción Médica</h2>
        </div>
      </div>

      {/* Datos Paciente */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 border-b border-slate-200 pb-2">
          <label className="text-[9px] font-black uppercase text-slate-400 block">Paciente</label>
          <span className="font-bold text-xl uppercase">{formData.nombre_paciente}</span>
        </div>
        <div className="border-b border-slate-200 pb-2">
          <label className="text-[9px] font-black uppercase text-slate-400 block">ID / HC</label>
          <span className="font-bold text-xl">{formData.id_paciente} / {formData.historia_clinica}</span>
        </div>
      </div>

      {/* DOSIS PRESCRIPTA (Dato aparte, no en la tabla) */}
      <div className="mb-10 bg-blue-50 border-2 border-blue-100 p-6 rounded-[2rem] flex justify-between items-center">
        <div>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Dosis Total Prescripta (Braquiterapia)</p>
          <p className="text-sm font-bold text-slate-600 italic">
            {formData.aplicador === 'cupula' ? 'Punto de control: Pto I (0.5 cm)' : 'Punto de control: Pto A (Manchester)'}
          </p>
        </div>
        <div className="text-right">
          <span className="text-4xl font-black text-blue-600 tracking-tighter">{formData.dosis_prescripta_braqui}</span>
          <span className="ml-2 text-sm font-bold text-blue-400 uppercase">cGy</span>
        </div>
      </div>

      {/* Tabla de Órganos a Riesgo */}
      <div className="mb-10">
        <h3 className="text-xs font-black uppercase bg-slate-100 p-2 mb-4 border-l-4 border-slate-900">Órganos a Riesgo (Dosis Absoluta cGy)</h3>
        <table className="w-full border-collapse border border-slate-200 text-xs">
          <thead>
            <tr className="bg-slate-50 uppercase font-black text-slate-600">
              <th className="border p-3 text-left">Órgano</th>
              <th className="border p-3 text-center">RT Externa</th>
              <th className="border p-3 text-center">Braquiterapia</th>
              <th className="border p-3 text-center bg-slate-900 text-white">Total EQD2</th>
            </tr>
          </thead>
          <tbody>
            {['Vejiga (D2cc)', 'Recto (D2cc)', 'Sigma (D2cc)'].map((organo) => (
              <tr key={organo}>
                <td className="border p-3 font-bold uppercase">{organo}</td>
                <td className="border p-3 text-center text-slate-300 italic">Pendiente</td>
                <td className="border p-3 text-center text-slate-300 italic">Pendiente</td>
                <td className="border p-3 text-center bg-slate-50 text-slate-300">--</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fuentes */}
      <div className="mb-12">
        <h3 className="text-xs font-black uppercase bg-slate-100 p-2 mb-4 border-l-4 border-slate-900">Inventario de Fuentes Utilizadas</h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-2 px-4">
          {Object.entries(data.asignacion).map(([pos, item]) => (
            <div key={pos} className="flex justify-between items-center text-[11px] border-b border-slate-100 py-2">
              <span className="font-black text-slate-900 uppercase">{pos}: {item.id}</span>
              <span className="font-black text-slate-900">{item.mCi} mCi</span>
            </div>
          ))}
        </div>
      </div>

      {/* Firmas */}
      <div className="mt-24 grid grid-cols-2 gap-32 px-10">
        <div className="text-center border-t-2 border-slate-900 pt-4">
          <p className="text-[10px] font-black uppercase">Firma Médico Radioterapeuta</p>
        </div>
        <div className="text-center border-t-2 border-slate-900 pt-4">
          <p className="text-[10px] font-black uppercase">Firma Físico Médico</p>
        </div>
      </div>
    </div>
  );
};