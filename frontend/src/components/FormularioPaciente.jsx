import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? '' });

// ─── FUENTES PREDEFINIDAS ────────────────────────────────────────────────────
const LOTES_PREDEFINIDOS = {
  LOTE_1: { f1: "M2DR983", f2: "J5HF205", f3: "J5HF207", f4: "J3HF203", f5: "J3HB438" },
  LOTE_2: { f1: "M2DR982", f2: "J5HF204", f3: "M2DR984", f4: "M4DR985", f5: "M4DR986" }
};

// ─── ESQUEMAS SVG PARA PDF ───────────────────────────────────────────────────
const EsquemaFletcherPDF = ({ asignacion }) => {
  // Escala: 20px = 1 cm
  const tx = 220;          // centro tándem coronal
  const tW = 13;           // ancho tándem
  const tyTop = 28;
  const tyBot = 196;

  const yF5 = 67;
  const yF4 = 112;
  const yF3 = 157;         // nivel eje A/B

  const ySep1 = (yF5 + yF4) / 2;
  const ySep2 = (yF4 + yF3) / 2;

  const xAd = tx - 40;    // 2 cm izq
  const xAi = tx + 40;    // 2 cm der
  const xBd = xAd - 60;   // 3 cm más izq
  const xBi = xAi + 60;   // 3 cm más der

  const oy  = 258;         // centro ovoides
  const oxL = tx - 52;    // ovoide izq
  const oxR = tx + 52;    // ovoide der

  const sx = 510;          // centro tándem sagital

  return (
  <svg viewBox="0 0 660 310" style={{ width:'100%', height:'295px' }}>
    <defs>
      <marker id="arr-fl" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 z" fill="#333"/>
      </marker>
      <marker id="arr-fl-r" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
        <path d="M0,0 L6,3 L0,6 z" fill="#333"/>
      </marker>
    </defs>

    {/* ══ PLANO CORONAL ══ */}

    {/* Cotas horizontales */}
    <line x1={tx}  y1={yF5-28} x2={xAd} y2={yF5-28} stroke="#333" strokeWidth="0.9" markerEnd="url(#arr-fl)" markerStart="url(#arr-fl)"/>
    <line x1={tx}  y1={yF5-33} x2={tx}  y2={yF5-23} stroke="#333" strokeWidth="0.9"/>
    <line x1={xAd} y1={yF5-33} x2={xAd} y2={yF5-23} stroke="#333" strokeWidth="0.9"/>
    <text x={(tx+xAd)/2} y={yF5-30} textAnchor="middle" style={{fontSize:'7px',fill:'#333',fontWeight:'600'}}>2 cm</text>

    <line x1={xAd} y1={yF5-28} x2={xBd} y2={yF5-28} stroke="#333" strokeWidth="0.9" markerEnd="url(#arr-fl)" markerStart="url(#arr-fl)"/>
    <line x1={xBd} y1={yF5-33} x2={xBd} y2={yF5-23} stroke="#333" strokeWidth="0.9"/>
    <text x={(xAd+xBd)/2} y={yF5-30} textAnchor="middle" style={{fontSize:'7px',fill:'#333',fontWeight:'600'}}>3 cm</text>

    <line x1={xAi} y1={yF5-28} x2={xBi} y2={yF5-28} stroke="#333" strokeWidth="0.9" markerEnd="url(#arr-fl)" markerStart="url(#arr-fl)"/>
    <line x1={xAi} y1={yF5-33} x2={xAi} y2={yF5-23} stroke="#333" strokeWidth="0.9"/>
    <line x1={xBi} y1={yF5-33} x2={xBi} y2={yF5-23} stroke="#333" strokeWidth="0.9"/>
    <text x={(xAi+xBi)/2} y={yF5-30} textAnchor="middle" style={{fontSize:'7px',fill:'#333',fontWeight:'600'}}>3 cm</text>

    {/* Tándem — rectángulo hueco con separadores */}
    <rect x={tx-tW/2} y={tyTop} width={tW} height={tyBot-tyTop}
      fill="white" stroke="#334155" strokeWidth="1.5"/>
    <line x1={tx-tW/2} y1={ySep1} x2={tx+tW/2} y2={ySep1} stroke="#334155" strokeWidth="1"/>
    <line x1={tx-tW/2} y1={ySep2} x2={tx+tW/2} y2={ySep2} stroke="#334155" strokeWidth="1"/>

    {/* Labels fuentes — izquierda del tándem */}
    <text x={tx-tW/2-5} y={yF5+4} textAnchor="end" style={{fontSize:'7.5px',fill:'#334155',fontWeight:'600'}}>F5</text>
    <text x={tx-tW/2-5} y={yF4+4} textAnchor="end" style={{fontSize:'7.5px',fill:'#334155',fontWeight:'600'}}>F4</text>
    <text x={tx-tW/2-5} y={yF3+4} textAnchor="end" style={{fontSize:'7.5px',fill:'#334155',fontWeight:'600'}}>F3</text>

    {/* Eje horizontal A/B */}
    <line x1={xBd-8} y1={yF3} x2={tx-tW/2}  y2={yF3} stroke="#555" strokeWidth="0.9"/>
    <line x1={tx+tW/2} y1={yF3} x2={xBi+8}  y2={yF3} stroke="#555" strokeWidth="0.9"/>

    {/* Puntos B y A — labels al mismo nivel */}
    <circle cx={xBd} cy={yF3} r="3.5" fill="#333"/>
    <text x={xBd-6} y={yF3+4} textAnchor="end" style={{fontSize:'7.5px',fill:'#333',fontWeight:'600'}}>Bd</text>

    <circle cx={xAd} cy={yF3} r="3.5" fill="#333"/>
    <text x={xAd-6} y={yF3+4} textAnchor="end" style={{fontSize:'7.5px',fill:'#333',fontWeight:'600'}}>Ad</text>

    <circle cx={xAi} cy={yF3} r="3.5" fill="#333"/>
    <text x={xAi+6} y={yF3+4} textAnchor="start" style={{fontSize:'7.5px',fill:'#333',fontWeight:'600'}}>Ai</text>

    <circle cx={xBi} cy={yF3} r="3.5" fill="#333"/>
    <text x={xBi+6} y={yF3+4} textAnchor="start" style={{fontSize:'7.5px',fill:'#333',fontWeight:'600'}}>Bi</text>

    {/* Línea punteada — vertical recta desde base del tándem */}
    <line x1={tx} y1={tyBot} x2={tx} y2={oy-24}
      stroke="#aaa" strokeWidth="0.9" strokeDasharray="4 3"/>

    {/* Cota vertical 2 cm */}
    <line x1={tx+28} y1={yF3} x2={tx+28} y2={oy}
      stroke="#333" strokeWidth="0.9"
      markerStart="url(#arr-fl-r)" markerEnd="url(#arr-fl)"/>
    <rect x={tx+30} y={(yF3+oy)/2-7} width={26} height={13} rx="2" fill="white"/>
    <text x={tx+43} y={(yF3+oy)/2+4} textAnchor="middle"
      style={{fontSize:'6.5px',fill:'#333',fontWeight:'700'}}>2 cm</text>

    {/* Ovoides */}
    <ellipse cx={oxL} cy={oy} rx="30" ry="22" fill="white" stroke="#334155" strokeWidth="1.5"/>
    <circle  cx={oxL} cy={oy} r="10"  fill="none" stroke="#334155" strokeWidth="1.2"/>
    <text x={oxL-37} y={oy+4} textAnchor="end" style={{fontSize:'7.5px',fill:'#334155',fontWeight:'600'}}>F1</text>

    <ellipse cx={oxR} cy={oy} rx="30" ry="22" fill="white" stroke="#334155" strokeWidth="1.5"/>
    <circle  cx={oxR} cy={oy} r="10"  fill="none" stroke="#334155" strokeWidth="1.2"/>
    <text x={oxR+37} y={oy+4} textAnchor="start" style={{fontSize:'7.5px',fill:'#334155',fontWeight:'600'}}>F2</text>

    {/* Título */}
    <text x={tx} y="300" textAnchor="middle"
      style={{fontSize:'7.5px',fill:'#334155',fontWeight:'700',letterSpacing:'0.5px'}}>Plano Coronal</text>

    {/* Nota pie */}
    <text x="8" y="308" style={{fontSize:'5.5px',fill:'#94a3b8'}}>
      {'Fuentes Cs-137: CDCSJ (tándem F3–F5) · CDCJ5 (ovoides F1–F2) — Escala 1:1'}
    </text>

    {/* Divisor */}
    <line x1="415" y1="8" x2="415" y2="295" stroke="#e2e8f0" strokeWidth="1"/>

    {/* ══ PLANO SAGITAL ══ */}

    {/* Tándem sagital — rectángulo hueco */}
    <rect x={sx-tW/2} y={tyTop} width={tW} height={tyBot-tyTop}
      fill="white" stroke="#334155" strokeWidth="1.5"/>
    <line x1={sx-tW/2} y1={ySep1} x2={sx+tW/2} y2={ySep1} stroke="#334155" strokeWidth="1"/>
    <line x1={sx-tW/2} y1={ySep2} x2={sx+tW/2} y2={ySep2} stroke="#334155" strokeWidth="1"/>

    <text x={sx-tW/2-5} y={yF5+4} textAnchor="end" style={{fontSize:'7.5px',fill:'#334155',fontWeight:'600'}}>F5</text>
    <text x={sx-tW/2-5} y={yF4+4} textAnchor="end" style={{fontSize:'7.5px',fill:'#334155',fontWeight:'600'}}>F4</text>
    <text x={sx-tW/2-5} y={yF3+4} textAnchor="end" style={{fontSize:'7.5px',fill:'#334155',fontWeight:'600'}}>F3</text>

    {/* Punto A/B sagital */}
    <circle cx={sx+50} cy={yF3} r="3.5" fill="#333"/>
    <text x={sx+57} y={yF3+4} style={{fontSize:'6.5px',fill:'#333',fontWeight:'600'}}>Bd, Ad, Ai, Bi</text>

    {/* Ovoide F1 — rectángulo horizontal */}
    <rect x={sx-40} y={tyBot+16} width={80} height={40} rx="2"
      fill="white" stroke="#334155" strokeWidth="1.5"/>
    <text x={sx} y={tyBot+40} textAnchor="middle"
      style={{fontSize:'7px',fill:'#334155',fontWeight:'700'}}>F1</text>

    {/* Vejiga */}
    <text x={sx+46} y={tyBot+36} style={{fontSize:'6.5px',fill:'#334155'}}>Vejiga</text>

    {/* Título */}
    <text x={sx} y="300" textAnchor="middle"
      style={{fontSize:'7.5px',fill:'#334155',fontWeight:'700',letterSpacing:'0.5px'}}>Plano Sagital</text>

  </svg>
  );
}

const EsquemaCupulaPDF = ({ asignacion }) => (
  /*
   * Réplica exacta del diagrama institucional CEMENU.
   * Coordenadas medidas sobre el original:
   *   - Línea base (eje horizontal): y=140
   *   - Aplicador coronal: x=100..220, y=140..260
   *   - Eje axial vertical: x=160 (centro del aplicador)
   *   - Cotas hacia ARRIBA desde y=140:
   *       I  → y=120  (0,5cm)
   *       II → y=100  (1 cm)
   *       III→ y= 80  (1,5cm)
   *   - Flechas dobles escalonadas a la derecha del eje:
   *       col1 x=170 (0,5), col2 x=183 (1), col3 x=196 (1,5)
   *   - Aplicador sagital: desplazado +350px
   */
  <svg viewBox="0 0 720 330" style={{ width:'100%', height:'300px', fontFamily:'Arial,sans-serif' }}>
    <defs>
      <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 z" fill="#000"/>
      </marker>
      <marker id="arr-rev" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
        <path d="M0,0 L6,3 L0,6 z" fill="#000"/>
      </marker>
    </defs>

    {/* ════════════════════════ PLANO CORONAL ════════════════════════ */}

    {/* Línea base horizontal */}
    <line x1="10"  y1="140" x2="330" y2="140" stroke="#000" strokeWidth="1.5"/>

    {/* Rectángulo aplicador */}
    <rect x="100" y="140" width="120" height="130" fill="white" stroke="#000" strokeWidth="1.2"/>

    {/* Labels orientación */}
    <text x="55"  y="200" textAnchor="middle" style={{fontSize:'10px', fontWeight:'bold'}}>DER.</text>
    <text x="275" y="200" textAnchor="middle" style={{fontSize:'10px', fontWeight:'bold'}}>IZQ.</text>
    <text x="160" y="320" textAnchor="middle" style={{fontSize:'12px', fontWeight:'bold'}}>Plano Coronal</text>

    {/* Fuentes — F1, F2, F3 arco superior */}
    <circle cx="118" cy="158" r="8" fill="#888" stroke="#000" strokeWidth="0.8"/>
    <text x="108" y="154" style={{fontSize:'8px'}}>F1</text>

    <circle cx="148" cy="155" r="8" fill="#888" stroke="#000" strokeWidth="0.8"/>
    <text x="148" y="148" textAnchor="middle" style={{fontSize:'8px'}}>F2</text>

    <circle cx="178" cy="158" r="8" fill="#888" stroke="#000" strokeWidth="0.8"/>
    <text x="189" y="155" style={{fontSize:'8px'}}>F3</text>

    {/* F5, F4 fila inferior */}
    <circle cx="132" cy="183" r="8" fill="#888" stroke="#000" strokeWidth="0.8"/>
    <text x="132" y="198" textAnchor="middle" style={{fontSize:'8px'}}>F5</text>

    <circle cx="162" cy="183" r="8" fill="#888" stroke="#000" strokeWidth="0.8"/>
    <text x="162" y="198" textAnchor="middle" style={{fontSize:'8px'}}>F4</text>

    {/* Eje axial vertical punteado */}
    <line x1="160" y1="140" x2="160" y2="55" stroke="#000" strokeWidth="0.6" strokeDasharray="4 3"/>

    {/* ─── Cotas — líneas horizontales a la izquierda, flechas dobles a la derecha ─── */}

    {/* I — 0,5 cm: línea y=120, flecha col x=172 */}
    <line x1="100" y1="120" x2="163" y2="120" stroke="#000" strokeWidth="1"/>
    <text x="95" y="123" textAnchor="end" style={{fontSize:'11px', fontWeight:'bold'}}>I</text>
    <line x1="172" y1="140" x2="172" y2="120"
      stroke="#000" strokeWidth="1"
      markerStart="url(#arr-rev)" markerEnd="url(#arr)"/>
    <text x="177" y="133" style={{fontSize:'8.5px', fontWeight:'bold'}}>0,5</text>

    {/* II — 1 cm: línea y=100, flecha col x=186 */}
    <line x1="100" y1="100" x2="163" y2="100" stroke="#000" strokeWidth="1"/>
    <text x="95" y="103" textAnchor="end" style={{fontSize:'11px', fontWeight:'bold'}}>II</text>
    <line x1="186" y1="140" x2="186" y2="100"
      stroke="#000" strokeWidth="1"
      markerStart="url(#arr-rev)" markerEnd="url(#arr)"/>
    <text x="191" y="123" style={{fontSize:'8.5px', fontWeight:'bold'}}>1</text>

    {/* III — 1,5 cm: línea y=80, flecha col x=200 */}
    <line x1="100" y1="80" x2="163" y2="80" stroke="#000" strokeWidth="1"/>
    <text x="95" y="83" textAnchor="end" style={{fontSize:'11px', fontWeight:'bold'}}>III</text>
    <line x1="200" y1="140" x2="200" y2="80"
      stroke="#000" strokeWidth="1"
      markerStart="url(#arr-rev)" markerEnd="url(#arr)"/>
    <text x="205" y="113" style={{fontSize:'8.5px', fontWeight:'bold'}}>1,5</text>


    {/* ════════════════════════ PLANO SAGITAL ════════════════════════ */}

    {/* Línea base horizontal */}
    <line x1="360" y1="140" x2="700" y2="140" stroke="#000" strokeWidth="1.5"/>

    {/* Rectángulo aplicador */}
    <rect x="450" y="140" width="160" height="130" fill="white" stroke="#000" strokeWidth="1.2"/>

    {/* Labels orientación */}
    <text x="410" y="200" textAnchor="middle" style={{fontSize:'10px', fontWeight:'bold'}}>POST.</text>
    <text x="650" y="200" textAnchor="middle" style={{fontSize:'10px', fontWeight:'bold'}}>ANT.</text>
    <text x="530" y="320" textAnchor="middle" style={{fontSize:'12px', fontWeight:'bold'}}>Plano Sagital</text>

    {/* Barras grises fuentes */}
    <rect x="451" y="148" width="158" height="18" fill="#b0b0b0"/>
    <text x="449" y="160" textAnchor="end" style={{fontSize:'8.5px', fontWeight:'bold'}}>F1, 2, 3</text>

    <rect x="451" y="172" width="130" height="18" fill="#b0b0b0"/>
    <text x="449" y="184" textAnchor="end" style={{fontSize:'8.5px', fontWeight:'bold'}}>F4, 5</text>

    {/* Flecha R ← izquierda */}
    <line x1="450" y1="157" x2="420" y2="157"
      stroke="#000" strokeWidth="1" markerEnd="url(#arr-rev)"/>
    <text x="416" y="160" textAnchor="end" style={{fontSize:'11px', fontWeight:'bold'}}>R</text>
    <text x="435" y="153" textAnchor="middle" style={{fontSize:'8px'}}>1</text>

    {/* Flecha V → derecha */}
    <line x1="609" y1="157" x2="639" y2="157"
      stroke="#000" strokeWidth="1" markerEnd="url(#arr)"/>
    <text x="643" y="160" style={{fontSize:'11px', fontWeight:'bold'}}>V</text>
    <text x="624" y="153" textAnchor="middle" style={{fontSize:'8px'}}>1</text>

    {/* Eje axial vertical punteado */}
    <line x1="530" y1="140" x2="530" y2="55" stroke="#000" strokeWidth="0.6" strokeDasharray="4 3"/>

    {/* I — 0,5 cm */}
    <line x1="470" y1="120" x2="533" y2="120" stroke="#000" strokeWidth="1"/>
    <text x="466" y="123" textAnchor="end" style={{fontSize:'11px', fontWeight:'bold'}}>I</text>
    <line x1="542" y1="140" x2="542" y2="120"
      stroke="#000" strokeWidth="1"
      markerStart="url(#arr-rev)" markerEnd="url(#arr)"/>
    <text x="547" y="133" style={{fontSize:'8.5px', fontWeight:'bold'}}>0,5</text>

    {/* II — 1 cm */}
    <line x1="470" y1="100" x2="533" y2="100" stroke="#000" strokeWidth="1"/>
    <text x="466" y="103" textAnchor="end" style={{fontSize:'11px', fontWeight:'bold'}}>II</text>
    <line x1="556" y1="140" x2="556" y2="100"
      stroke="#000" strokeWidth="1"
      markerStart="url(#arr-rev)" markerEnd="url(#arr)"/>
    <text x="561" y="123" style={{fontSize:'8.5px', fontWeight:'bold'}}>1</text>

    {/* III — 1,5 cm */}
    <line x1="470" y1="80" x2="533" y2="80" stroke="#000" strokeWidth="1"/>
    <text x="466" y="83" textAnchor="end" style={{fontSize:'11px', fontWeight:'bold'}}>III</text>
    <line x1="570" y1="140" x2="570" y2="80"
      stroke="#000" strokeWidth="1"
      markerStart="url(#arr-rev)" markerEnd="url(#arr)"/>
    <text x="575" y="113" style={{fontSize:'8.5px', fontWeight:'bold'}}>1,5</text>

    {/* Nota pie */}
    <text x="8" y="326" style={{fontSize:'6.5px', fill:'#94a3b8'}}>
      * Las fuentes son Cs-137 CDCSM. Los dibujos no están a escala.
    </text>
  </svg>
);

// ─── SLOT INTERACTIVO ────────────────────────────────────────────────────────
const Slot = ({ id, label, posiciones, slotActivo, setSlotActivo }) => (
  <button type="button" onClick={() => setSlotActivo(id)}
    className={`w-full p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center min-h-[65px] shadow-sm
      ${slotActivo === id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' :
        posiciones[id] ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-400'}`}>
    <span className="text-[10px] font-bold text-slate-400 uppercase">{label}</span>
    <span className="text-xs font-black text-slate-800">{posiciones[id] || "VACÍO"}</span>
  </button>
);

// ─── LOGO ────────────────────────────────────────────────────────────────────
// El archivo logo.jpg debe estar en la carpeta public/ del proyecto (public/logo.jpg)
const LogoEmpresa = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    {/* Iniciales CR/SJ */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1 }}>
      <span style={{ fontSize: '13pt', fontWeight: '900', color: '#64748b', letterSpacing: '-0.5px' }}>CR</span>
      <span style={{ fontSize: '13pt', fontWeight: '900', color: '#64748b', letterSpacing: '-0.5px' }}>SJ</span>
    </div>
    {/* Línea divisoria vertical */}
    <div style={{ width: '1.5px', height: '38px', background: '#94a3b8', flexShrink: 0 }} />
    {/* Texto del centro */}
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.15 }}>
      <span style={{ fontSize: '7.5pt', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Centro</span>
      <span style={{ fontSize: '7.5pt', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Radioterapia</span>
      <span style={{ fontSize: '7.5pt', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>San Juan</span>
    </div>
  </div>
);

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
const BraquiApp = () => {
  const [step, setStep] = useState(0);
  const [fuentesDisponibles, setFuentesDisponibles] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [slotActivo, setSlotActivo] = useState(null);
  const [fechaImpresion] = useState(new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }));

  // ── Profesionales (desde DB) ──
  const [medicos, setMedicos] = useState([]);
  const [fisicos, setFisicos] = useState([]);
  const [medicoSelId, setMedicoSelId] = useState('');
  const [fisicoSelId, setFisicoSelId] = useState('');
  const [pacienteDbId, setPacienteDbId] = useState(null);
  const [guardadoStatus, setGuardadoStatus] = useState(null); // null | 'saving' | 'ok' | 'error'
  const [imagenCarta, setImagenCarta] = useState(null);      // base64 de la imagen de curvas

  // ── Historial ──
  const [historialQuery, setHistorialQuery] = useState('');
  const [historialResultados, setHistorialResultados] = useState([]);
  const [historialPaciente, setHistorialPaciente] = useState(null);  // { paciente, planes }
  const [historialLoading, setHistorialLoading] = useState(false);

  // ── Archivos externos ──
  const [dvhStatus, setDvhStatus] = useState(null);
  const [eclipseStatus, setEclipseStatus] = useState(null);
  const [organosDosis, setOrganosDosis] = useState({ vejiga: '', recto: '', sigma: '' });
  const [braquiDatos, setBraquiDatos] = useState(null);
  const [printTrigger, setPrintTrigger] = useState(false);

  const [formData, setFormData] = useState({
    nombre_paciente: '',
    historia_clinica: '',
    id_paciente: '',
    diagnostico: '',
    medico_responsable: '',
    fisico_medico: '',
    fecha_colocacion: '',
    tiempo_tratamiento_horas: '',
    aplicador: 'fletcher',
    ids_fuentes: [],
    posiciones: { f1: null, f2: null, f3: null, f4: null, f5: null },
    dosis_prescripta_braqui: '',
    dosis_externa_gy: 0,
    fraccionamiento_externa: 2,
    dosis_punto_a: '',
    dosis_punto_i: '',
    comentarios: '',
  });

  useEffect(() => {
    api.get('/fuentes')
      .then(res => setFuentesDisponibles(res.data))
      .catch(() => setFuentesDisponibles(["M2DR983","J5HF205","J5HF207","J3HF203","J3HB438","M2DR982","J5HF204","M2DR984","M4DR985","M4DR986"]));
    api.get('/medicos')
      .then(res => {
        if (res.data.medicos?.length) setMedicos(res.data.medicos);
        if (res.data.fisicos?.length)  setFisicos(res.data.fisicos);
      })
      .catch(err => {
        console.warn('No se pudo cargar profesionales desde la DB, usando lista local:', err);
        // Fallback hardcodeado
        setMedicos([
          { id: 1, nombre: 'Dr. Darío Llanos'     },
          { id: 2, nombre: 'Dr. Ignacio Abregu'   },
          { id: 3, nombre: 'Dr. José Luis Castilla'},
          { id: 4, nombre: 'Dr. Marcelo Guzmán'   },
        ]);
        setFisicos([
          { id: 5, nombre: 'Jorge Escobar'  },
          { id: 6, nombre: 'Mauricio Franco' },
        ]);
      });
  }, []);

  useEffect(() => {
    if (!printTrigger || !resultado) return;
    requestAnimationFrame(() => {
      const apellido = (formData.nombre_paciente || 'Paciente')
        .split(',')[0].trim().toLowerCase().replace(/\s+/g, '_');
      const titulo = document.title;
      document.title = `informe_${apellido}`;
      window.print();
      document.title = titulo;
      setPrintTrigger(false);
    });
  }, [printTrigger, resultado]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' && value !== '' ? parseFloat(value) : value }));
  };

  const cargarLote = (nombreLote) => {
    const lote = LOTES_PREDEFINIDOS[nombreLote];
    setFormData(prev => ({ ...prev, posiciones: lote, ids_fuentes: Object.values(lote) }));
    setSlotActivo(null);
  };

  const asignarFuenteASlot = (fuenteId) => {
    if (!slotActivo) return;
    const nuevas = { ...formData.posiciones };
    Object.keys(nuevas).forEach(k => { if (nuevas[k] === fuenteId) nuevas[k] = null; });
    nuevas[slotActivo] = fuenteId;
    setFormData(prev => ({ ...prev, posiciones: nuevas, ids_fuentes: Object.values(nuevas).filter(Boolean) }));
    setSlotActivo(null);
  };

  // ── Parser DVH.txt — extrae D1% de vejiga, recto y sigma ──
  // Formato real: DVH acumulativo exportado desde Eclipse/Aria
  // Columnas: "Dosis [cGy]  Dosis relativa [%]  Proporción de volumen de estructura total [%]"
  // D1% = dosis donde el volumen acumulado cae a ≤ 1% (interpolación lineal)
  const parsearDVH = (texto) => {
    const resultado = { vejiga: '', recto: '', sigma: '' };
    // Separar por bloques de estructura
    const bloques = texto.split(/Estructura:\s*/);
    for (const bloque of bloques) {
      const nombreLinea = bloque.split('\n')[0].trim().replace('\r','').toLowerCase();
      let clave = null;
      if (nombreLinea.includes('rectum') || nombreLinea.includes('recto')) clave = 'recto';
      else if (nombreLinea.includes('bladder') || nombreLinea.includes('vejiga')) clave = 'vejiga';
      else if (nombreLinea.includes('sigma') || nombreLinea.includes('sigmoid')) clave = 'sigma';
      else continue;

      // Extraer filas numéricas — 2 col (dosis, vol%) o 3 col (dosis, dosis_rel, vol%)
      const datos = [];
      for (const linea of bloque.split('\n')) {
        const cols = linea.trim().split(/\s+/);
        if (cols.length >= 2) {
          const dosis = parseFloat(cols[0]);
          const vol   = parseFloat(cols[cols.length - 1]);
          if (!isNaN(dosis) && !isNaN(vol)) datos.push([dosis, vol]);
        }
      }
      // Buscar cruce con 1% — interpolación lineal
      for (let i = 0; i < datos.length; i++) {
        const [dosis, vol] = datos[i];
        if (vol <= 1.0) {
          let d1;
          if (i > 0) {
            const [d0, v0] = datos[i - 1];
            d1 = d0 + (1.0 - v0) * (dosis - d0) / (vol - v0);
          } else {
            d1 = dosis;
          }
          resultado[clave] = Math.round(d1 * 10) / 10;
          break;
        }
      }
      // Si nunca baja de 1%, tomar el máximo registrado
      if (!resultado[clave] && datos.length > 0) {
        resultado[clave] = datos[datos.length - 1][0];
      }
    }
    return resultado;
  };

  // parsearEclipse movido al backend → endpoint /procesar-eclipse

  const handleDVH = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setDvhStatus('loading');
    try {
      const texto = await archivo.text();
      const datos = parsearDVH(texto);
      setOrganosDosis(datos);
      setDvhStatus('ok');
    } catch {
      setDvhStatus('error');
    }
  };

  const handleEclipsePDF = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setEclipseStatus('loading');
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);
      const res = await api.post('/procesar-eclipse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.status === 'success') {
        setBraquiDatos({ nombre: archivo.name, ...res.data.datos });
        setEclipseStatus('ok');
      } else {
        console.error('Error Eclipse:', res.data.error);
        setEclipseStatus('error');
      }
    } catch (err) {
      console.error('Error procesando PDF:', err);
      setEclipseStatus('error');
    }
  };

  const guardarEnDB = async (resultadoData) => {
    setGuardadoStatus('saving');
    try {
      const pRes = await api.post('/pacientes', {
        nombre: formData.nombre_paciente,
        dni: formData.id_paciente,
        historia_clinica: formData.historia_clinica,
        diagnostico: formData.diagnostico,
      });
      const pid = pRes.data.id;
      setPacienteDbId(pid);
      await api.post('/planes', {
        paciente_id: pid,
        medico_id: parseInt(medicoSelId) || 1,
        fisico_id: parseInt(fisicoSelId) || 5,
        fecha_colocacion: formData.fecha_colocacion.substring(0, 16).replace("T", " "),
        tiempo_horas: formData.tiempo_tratamiento_horas,
        dosis_prescripta: formData.dosis_prescripta_braqui,
        aplicador: formData.aplicador,
        fecha_extraccion: resultadoData.fecha_extraccion || '',
        asignacion_fuentes: resultadoData.asignacion || {},
        dosis_organos: {
          vejiga_ext: organosDosis.vejiga, recto_ext: organosDosis.recto, sigma_ext: organosDosis.sigma,
          vejiga_braqui: braquiDatos?.vejiga || '', recto_braqui: braquiDatos?.recto || '',
          sigma_braqui: braquiDatos?.sigma || '',
          ad: braquiDatos?.ad || '', ai: braquiDatos?.ai || '',
          bd: braquiDatos?.bd || '', bi: braquiDatos?.bi || '',
          actividades: braquiDatos?.actividades || null,
          imagen_carta: imagenCarta || null,
        },
      });
      setGuardadoStatus('ok');
    } catch (err) {
      console.error('Error guardando:', err);
      setGuardadoStatus('error');
    }
  };

  const volverAlInicio = () => {
    setResultado(null);
    setStep(0);
    setGuardadoStatus(null);
    setPacienteDbId(null);
    setDvhStatus(null);
    setEclipseStatus(null);
    setOrganosDosis({ vejiga: '', recto: '', sigma: '' });
    setBraquiDatos(null);
    setSlotActivo(null);
    setMedicoSelId('');
    setFisicoSelId('');
    setFormData(prev => ({
      ...prev,
      nombre_paciente: '', historia_clinica: '', id_paciente: '',
      diagnostico: '', medico_responsable: '', fisico_medico: '',
      fecha_colocacion: '', tiempo_tratamiento_horas: 48,
      dosis_prescripta_braqui: 4000,
      ids_fuentes: [],
      posiciones: { f1: null, f2: null, f3: null, f4: null, f5: null },
    }));
  };

  const imprimirPlanHistorial = (plan, paciente) => {
    setFormData(prev => ({
      ...prev,
      nombre_paciente: paciente.nombre,
      id_paciente: paciente.dni,
      historia_clinica: paciente.historia_clinica,
      diagnostico: paciente.diagnostico,
      medico_responsable: (plan.medico || '').replace(/^Dr\.\s*/i, ''),
      fisico_medico: plan.fisico,
      aplicador: plan.aplicador,
      fecha_colocacion: plan.fecha_colocacion.replace(' ', 'T'),
      tiempo_tratamiento_horas: plan.tiempo_horas || 48,
      dosis_prescripta_braqui: plan.dosis_prescripta,
    }));
    setResultado({
      fecha_extraccion: plan.fecha_extraccion,
      asignacion: plan.asignacion_fuentes,
    });
    setOrganosDosis({
      vejiga: plan.dosis_organos?.vejiga_ext || '',
      recto: plan.dosis_organos?.recto_ext || '',
      sigma: plan.dosis_organos?.sigma_ext || '',
    });
    const doa = plan.dosis_organos || {};
    setBraquiDatos(
      (doa.vejiga_braqui || doa.ad || doa.actividades)
        ? {
            vejiga: doa.vejiga_braqui || '',
            recto:  doa.recto_braqui  || '',
            sigma:  doa.sigma_braqui  || '',
            ad: doa.ad || '', ai: doa.ai || '',
            bd: doa.bd || '', bi: doa.bi || '',
            actividades: doa.actividades || null,
          }
        : null
    );
    setImagenCarta(doa.imagen_carta || null);
    setPrintTrigger(true);
  };

  const enviarFinal = async () => {
    try {
      const fechaLimpia = formData.fecha_colocacion.substring(0, 16).replace("T", " ");
      console.log("Fecha enviada al backend:", fechaLimpia);
      const payload = { ...formData, fecha_colocacion: fechaLimpia };
      const res = await api.post('/procesar-plan', payload);
      setResultado(res.data.data);
    } catch (err) {
      console.error('Error:', err);
      setResultado({
        fecha_extraccion: "30/04/2026 a las 10:30 hs",
        asignacion: Object.entries(formData.posiciones).reduce((acc, [pos, id]) => {
          if (id) acc[pos] = { id, mCi: "25.40" };
          return acc;
        }, {})
      });
    }
  };

  const formatFechaColocacion = () => {
    if (!formData.fecha_colocacion) return '___/___/______  ___:___ hs';
    // Parseo manual para evitar problemas de timezone con new Date()
    const s = formData.fecha_colocacion.replace('T', ' ');
    const [fecha, hora] = s.split(' ');
    const [anio, mes, dia] = fecha.split('-');
    const [hh, mm] = (hora || '00:00').split(':');
    return `${dia}/${mes}/${anio}, ${hh}:${mm} hs`;
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (<>
    <div className="print:hidden min-h-screen bg-[#f1f5f9] flex flex-col items-center p-8 font-sans text-slate-900">

      {/* ═══════════════════════════════════════════════════════════════════
          VISTA PANTALLA — oculta al imprimir
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-2xl">
        <div className={`w-full bg-white shadow-2xl rounded-[2rem] border border-slate-100 overflow-hidden transition-all duration-700 ${step === 3 ? 'max-w-5xl mx-auto' : ''}`}>

          {/* HEADER */}
          <div className="bg-slate-900 p-8 flex justify-between items-center">
            <LogoEmpresa dark={true} />
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest italic">● Sesión Activa</span>
          </div>

          <div className="p-10">

            {/* STEP 0 — Inicio + Historial */}
            {step === 0 && (
              <div className="space-y-8 py-4">

                {/* Saludo + botón nuevo plan */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sistema de Planificación LDR</p>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Braquiterapia Ginecológica</h2>
                  </div>
                  <button onClick={() => {
                      volverAlInicio();
                      setHistorialPaciente(null);
                      setHistorialQuery('');
                      setHistorialResultados([]);
                      setStep(1);
                    }}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition-all flex items-center gap-3 flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Nuevo Plan
                  </button>
                </div>

                {/* Buscador de pacientes */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3">Historial de Pacientes</p>
                  <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                      value={historialQuery}
                      onChange={async e => {
                        const q = e.target.value;
                        setHistorialQuery(q);
                        setHistorialPaciente(null);
                        if (q.trim().length < 2) { setHistorialResultados([]); return; }
                        setHistorialLoading(true);
                        try {
                          const res = await api.get(`/pacientes?q=${encodeURIComponent(q)}`);
                          setHistorialResultados(res.data);
                        } catch { setHistorialResultados([]); }
                        setHistorialLoading(false);
                      }}
                      placeholder="Buscar por nombre, ID o N° de historia clínica..."
                      className="w-full border-2 border-slate-100 pl-10 pr-5 py-4 rounded-2xl bg-slate-50 outline-none focus:border-blue-400 text-sm"
                    />
                  </div>

                  {/* Resultados de búsqueda */}
                  {historialResultados.length > 0 && !historialPaciente && (
                    <div className="mt-2 border border-slate-100 rounded-2xl overflow-hidden shadow-lg">
                      {historialResultados.map((p, i) => (
                        <button key={p.id}
                          onClick={async () => {
                            setHistorialLoading(true);
                            try {
                              const res = await api.get(`/pacientes/${p.id}/planes`);
                              setHistorialPaciente(res.data);
                            } catch {}
                            setHistorialLoading(false);
                          }}
                          className={`w-full flex items-center justify-between px-5 py-4 text-left hover:bg-blue-50 transition-all
                            ${i < historialResultados.length - 1 ? 'border-b border-slate-100' : ''}`}>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{p.nombre}</p>
                            <p className="text-xs text-slate-400 mt-0.5">ID: {p.dni} · HC: {p.historia_clinica}</p>
                          </div>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                      ))}
                    </div>
                  )}

                  {historialLoading && (
                    <p className="text-xs text-slate-400 mt-3 text-center">Buscando...</p>
                  )}

                  {/* Panel detalle paciente */}
                  {historialPaciente && (
                    <div className="mt-4 border border-slate-100 rounded-3xl overflow-hidden">

                      {/* Header paciente */}
                      <div className="bg-slate-900 px-6 py-5 flex items-start justify-between">
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Paciente</p>
                          <p className="text-lg font-black text-white">{historialPaciente.paciente.nombre}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            ID: {historialPaciente.paciente.dni} · HC: {historialPaciente.paciente.historia_clinica}
                          </p>
                          <p className="text-xs text-slate-300 mt-0.5 italic">{historialPaciente.paciente.diagnostico}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <button
                            onClick={async () => {
                              if (!window.confirm(`¿Eliminar a ${historialPaciente.paciente.nombre} y todos sus planes? Esta acción no se puede deshacer.`)) return;
                              try {
                                await api.delete(`/pacientes/${historialPaciente.paciente.id}`);
                              } catch {}
                              setHistorialPaciente(null);
                              setHistorialQuery('');
                              setHistorialResultados([]);
                            }}
                            className="text-slate-500 hover:text-red-400 transition-colors"
                            title="Eliminar paciente">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                            </svg>
                          </button>
                          <button onClick={() => { setHistorialPaciente(null); setHistorialQuery(''); setHistorialResultados([]); }}
                            className="text-slate-500 hover:text-white transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        </div>
                      </div>

                      {/* Lista de planes */}
                      {historialPaciente.planes.length === 0 ? (
                        <div className="px-6 py-8 text-center text-slate-400 text-sm">Sin planes registrados</div>
                      ) : (
                        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                          {historialPaciente.planes.map((plan, i) => (
                            <div key={plan.id} className="px-6 py-4 relative group">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg
                                    ${plan.aplicador === 'fletcher' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                    {plan.aplicador === 'fletcher' ? 'Fletcher' : 'Cúpula'}
                                  </span>
                                  <span className="text-xs text-slate-400 font-medium">
                                    {plan.fecha_creacion?.slice(0,10).split('-').reverse().join('/')}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-black text-blue-600">{plan.dosis_prescripta} cGy</span>
                                  {/* Botón imprimir — aparece al hover */}
                                  <button
                                    onClick={() => imprimirPlanHistorial(plan, historialPaciente.paciente)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-blue-500 p-1 rounded-lg hover:bg-blue-50"
                                    title="Imprimir informe">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                      <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                                    </svg>
                                  </button>
                                  {/* Botón borrar — aparece al hover */}
                                  <button
                                    onClick={async () => {
                                      if (!window.confirm(`¿Borrar este plan de ${historialPaciente.paciente.nombre}? Esta acción no se puede deshacer.`)) return;
                                      try {
                                        await api.delete(`/planes/${plan.id}`);
                                        // Refrescar historial
                                        const res = await api.get(`/pacientes/${pacienteDbId || plan.id}/planes`);
                                        setHistorialPaciente(res.data);
                                      } catch {
                                        // Refrescar buscando por nombre
                                        const r = await api.get(`/pacientes?q=${historialPaciente.paciente.dni}`);
                                        if (r.data[0]) {
                                          const h = await api.get(`/pacientes/${r.data[0].id}/planes`);
                                          setHistorialPaciente(h.data);
                                        }
                                      }
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500 p-1 rounded-lg hover:bg-red-50"
                                    title="Borrar plan">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
                                <span>↓ Colocación: <strong className="text-slate-700">{plan.fecha_colocacion}</strong></span>
                                <span>↑ Extracción: <strong className="text-emerald-600">{plan.fecha_extraccion}</strong></span>
                                <span>Médico: <strong className="text-slate-700">{plan.medico}</strong></span>
                                <span>Físico: <strong className="text-slate-700">{plan.fisico}</strong></span>
                              </div>
                              {Object.keys(plan.asignacion_fuentes).length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {Object.entries(plan.asignacion_fuentes).map(([pos, data]) => (
                                    <span key={pos} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg font-mono">
                                      {pos.toUpperCase()}: {data.id} · {data.mCi} mCi
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Footer: nuevo plan para esta paciente */}
                      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                        <button
                          onClick={() => {
                            const p = historialPaciente.paciente;
                            setFormData(prev => ({
                              ...prev,
                              nombre_paciente: p.nombre,
                              id_paciente: p.dni,
                              historia_clinica: p.historia_clinica,
                              diagnostico: p.diagnostico,
                            }));
                            setHistorialPaciente(null);
                            setHistorialQuery('');
                            setStep(1);
                          }}
                          className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all">
                          + Nuevo plan para esta paciente
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 1 — Datos del paciente */}
            {step === 1 && (
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-slate-900 italic tracking-tight">Información del Paciente</h3>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                  <div className="md:col-span-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-3 mb-2 block tracking-widest">Nombre Completo</label>
                    <input name="nombre_paciente" value={formData.nombre_paciente} onChange={handleChange} className="w-full border-2 border-slate-100 p-5 rounded-2xl bg-slate-50 outline-none focus:border-blue-400 font-semibold text-lg"/>
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-3 mb-2 block tracking-widest">ID Paciente</label>
                    <input name="id_paciente" value={formData.id_paciente} onChange={handleChange} className="w-full border-2 border-slate-100 p-5 rounded-2xl bg-slate-50 outline-none"/>
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-3 mb-2 block tracking-widest">Historia Clínica</label>
                    <input name="historia_clinica" value={formData.historia_clinica} onChange={handleChange} className="w-full border-2 border-slate-100 p-5 rounded-2xl bg-slate-50 outline-none"/>
                  </div>
                  <div className="md:col-span-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-3 mb-2 block tracking-widest">Diagnóstico</label>
                    <input name="diagnostico" value={formData.diagnostico} onChange={handleChange} className="w-full border-2 border-slate-100 p-5 rounded-2xl bg-slate-50 outline-none"/>
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-3 mb-2 block tracking-widest">Médico Responsable</label>
                    <select value={medicoSelId}
                      onChange={e => {
                        setMedicoSelId(e.target.value);
                        const m = medicos.find(x => x.id === parseInt(e.target.value));
                        if (m) setFormData(p => ({ ...p, medico_responsable: m.nombre.replace('Dr. ', '') }));
                      }}
                      className="w-full border-2 border-slate-100 p-5 rounded-2xl bg-white outline-none font-bold text-blue-900 cursor-pointer">
                      <option value="">— Seleccionar —</option>
                      {medicos.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-3 mb-2 block tracking-widest">Físico Responsable</label>
                    <select value={fisicoSelId}
                      onChange={e => {
                        setFisicoSelId(e.target.value);
                        const f = fisicos.find(x => x.id === parseInt(e.target.value));
                        if (f) setFormData(p => ({ ...p, fisico_medico: f.nombre }));
                      }}
                      className="w-full border-2 border-slate-100 p-5 rounded-2xl bg-white outline-none font-bold text-blue-900 cursor-pointer">
                      <option value="">— Seleccionar —</option>
                      {fisicos.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 py-6 px-8 rounded-3xl font-bold transition-all">← Volver</button>
                  <button onClick={() => setStep(2)} className="flex-1 bg-slate-900 text-white py-6 rounded-3xl font-bold shadow-xl hover:bg-blue-700 transition-all">Continuar →</button>
                </div>
              </div>
            )}

            {/* STEP 2 — Parámetros del tratamiento */}
            {step === 2 && (
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-slate-900 italic tracking-tight">Parámetros del Tratamiento</h3>

                {/* Fecha y hora — ocupa el ancho completo para que se vea bien */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-3 mb-2 block tracking-widest">Fecha y Hora de Colocación</label>
                  <input
                    type="datetime-local"
                    name="fecha_colocacion"
                    value={formData.fecha_colocacion}
                    onChange={handleChange}
                    className="w-full border-2 border-slate-100 p-5 rounded-2xl bg-slate-50 font-bold text-lg outline-none focus:border-blue-400"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                {/* Horas + Dosis en la misma fila */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-3 mb-2 block tracking-widest">Horas de Tratamiento</label>
                    <input type="number" name="tiempo_tratamiento_horas" value={formData.tiempo_tratamiento_horas} onChange={handleChange} className="w-full border-2 border-slate-100 p-5 rounded-2xl bg-slate-50 font-bold text-emerald-600 text-xl outline-none focus:border-emerald-400"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-3 mb-2 block tracking-widest">Dosis Braqui (cGy)</label>
                    <input type="number" name="dosis_prescripta_braqui" value={formData.dosis_prescripta_braqui} onChange={handleChange} className="w-full border-2 border-blue-100 p-5 rounded-2xl bg-blue-50 font-black text-blue-600 text-xl outline-none focus:border-blue-400"/>
                  </div>
                </div>

                {/* Selector aplicador */}
                <div className="flex gap-6">
                  <button type="button" onClick={() => setFormData(p => ({ ...p, aplicador: 'fletcher' }))}
                    className={`flex-1 py-8 px-6 border-2 rounded-[2.5rem] font-bold transition-all ${formData.aplicador === 'fletcher' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-inner' : 'border-slate-100 text-slate-300 hover:border-slate-300'}`}>
                    Aplicador Fletcher<br/><span className="text-xs font-normal">Manchester</span>
                  </button>
                  <button type="button" onClick={() => setFormData(p => ({ ...p, aplicador: 'cupula' }))}
                    className={`flex-1 py-8 px-6 border-2 rounded-[2.5rem] font-bold transition-all ${formData.aplicador === 'cupula' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-inner' : 'border-slate-100 text-slate-300 hover:border-slate-300'}`}>
                    Cúpula Vaginal<br/><span className="text-xs font-normal">CEMENU</span>
                  </button>
                </div>

                {/* ── Carga de archivos externos ── */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Archivos del Planificador</p>

                  {/* DVH externo */}
                  <label className={`flex items-center gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all
                    ${dvhStatus === 'ok' ? 'border-emerald-400 bg-emerald-50' :
                      dvhStatus === 'error' ? 'border-red-300 bg-red-50' :
                      'border-slate-100 bg-slate-50 hover:border-slate-300'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-xs
                      ${dvhStatus === 'ok' ? 'bg-emerald-500 text-white' :
                        dvhStatus === 'error' ? 'bg-red-400 text-white' :
                        'bg-slate-200 text-slate-500'}`}>
                      {dvhStatus === 'loading' ? '…' : dvhStatus === 'ok' ? '✓' : dvhStatus === 'error' ? '✗' : 'DVH'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-800">DVH Radioterapia Externa</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {dvhStatus === 'ok'
                          ? `Vejiga: ${organosDosis.vejiga || '—'} cGy · Recto: ${organosDosis.recto || '—'} cGy · Sigma: ${organosDosis.sigma || '—'} cGy`
                          : dvhStatus === 'error' ? 'Error al leer el archivo — verificar formato'
                          : 'Archivo .txt exportado desde el planificador'}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex-shrink-0">.txt</span>
                    <input type="file" accept=".txt" className="hidden" onChange={handleDVH} />
                  </label>

                  {/* PDF Eclipse */}
                  <label className={`flex items-center gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all
                    ${eclipseStatus === 'ok' ? 'border-emerald-400 bg-emerald-50' :
                      eclipseStatus === 'error' ? 'border-red-300 bg-red-50' :
                      'border-slate-100 bg-slate-50 hover:border-slate-300'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-xs
                      ${eclipseStatus === 'ok' ? 'bg-emerald-500 text-white' :
                        eclipseStatus === 'error' ? 'bg-red-400 text-white' :
                        'bg-slate-200 text-slate-500'}`}>
                      {eclipseStatus === 'loading' ? '…' : eclipseStatus === 'ok' ? '✓' : eclipseStatus === 'error' ? '✗' : 'PDF'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-800">Informe Braquiterapia — Eclipse</p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {eclipseStatus === 'ok' && braquiDatos
                          ? `Recto: ${braquiDatos.recto||'—'} cGy · Vejiga: ${braquiDatos.vejiga||'—'} cGy · Sigma: ${braquiDatos.sigma||'—'} cGy`
                          : eclipseStatus === 'error' ? 'Error al leer el archivo PDF'
                          : 'Informe .pdf exportado desde Eclipse'}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex-shrink-0">.pdf</span>
                    <input type="file" accept=".pdf" className="hidden" onChange={handleEclipsePDF} />
                  </label>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 py-6 rounded-3xl font-bold text-slate-400 uppercase text-[10px] tracking-widest">← Atrás</button>
                  <button onClick={() => setStep(3)} className="flex-[2] bg-blue-600 text-white py-6 rounded-3xl font-bold shadow-xl hover:bg-blue-700 transition-all">Mapa de Carga →</button>
                </div>
              </div>
            )}

            {/* STEP 3 — Mapa de carga + resultado */}
            {step === 3 && (
              <div>
                <div className="grid grid-cols-12 gap-10">
                  
                  {/* Panel izquierdo: aplicador visual interactivo */}
                  <div className="col-span-12 lg:col-span-5 bg-slate-50 rounded-[3rem] p-6 border border-slate-200 flex flex-col items-center justify-center">
                    {formData.aplicador === 'fletcher' ? (
                      <div className="w-full flex flex-col items-center gap-3">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Aplicador Fletcher — Manchester</span>
                        {/* Punta (centro) */}
                        <div className="flex justify-center gap-3 w-full">
                          <div className="w-28 invisible" />
                          <div className="w-28"><Slot id="f2" label="Punta" posiciones={formData.posiciones} slotActivo={slotActivo} setSlotActivo={setSlotActivo}/></div>
                          <div className="w-28 invisible" />
                        </div>
                        <div className="w-2 h-4 bg-slate-300 rounded-sm" />
                        {/* Cuerpo (centro) */}
                        <div className="flex justify-center gap-3 w-full">
                          <div className="w-28 invisible" />
                          <div className="w-28"><Slot id="f1" label="Cuerpo" posiciones={formData.posiciones} slotActivo={slotActivo} setSlotActivo={setSlotActivo}/></div>
                          <div className="w-28 invisible" />
                        </div>
                        <div className="w-2 h-4 bg-slate-300 rounded-sm" />
                        {/* Base (centro) */}
                        <div className="flex justify-center gap-3 w-full">
                          <div className="w-28 invisible" />
                          <div className="w-28"><Slot id="f3" label="Base" posiciones={formData.posiciones} slotActivo={slotActivo} setSlotActivo={setSlotActivo}/></div>
                          <div className="w-28 invisible" />
                        </div>
                        {/* Separador */}
                        <div className="w-full border-t border-dashed border-slate-300 my-1" />
                        {/* Ovoides (izq y der) */}
                        <div className="flex justify-center gap-3 w-full">
                          <div className="w-28"><Slot id="f4" label="Ovoide I" posiciones={formData.posiciones} slotActivo={slotActivo} setSlotActivo={setSlotActivo}/></div>
                          <div className="w-28 invisible" />
                          <div className="w-28"><Slot id="f5" label="Ovoide D" posiciones={formData.posiciones} slotActivo={slotActivo} setSlotActivo={setSlotActivo}/></div>
                        </div>
                      </div>
                    ) : (
                      /* ── CÚPULA: mapa de canales centrado y fijado ── */
                      <div className="w-full flex flex-col items-center select-none">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Cúpula Vaginal — CEMENU</p>
                        <div className="w-full flex justify-between text-[9px] font-bold text-slate-500 px-2 mb-1">
                          <span>DER.</span>
                          <span className="text-slate-400 italic font-normal">Plano coronal</span>
                          <span>IZQ.</span>
                        </div>
                        <div className="w-full h-[2px] bg-slate-400"/>
                        <div className="w-full border-x-2 border-b-2 border-slate-400 bg-slate-50 rounded-b-xl pt-4 pb-4 px-3 flex flex-col gap-4 items-center">
                          <div className="flex justify-center gap-2 w-full">
                            {[
                              { id:'f1', label:'F1' },
                              { id:'f2', label:'F2' },
                              { id:'f3', label:'F3' },
                            ].map(({id, label}) => (
                              <button key={id} type="button" onClick={() => setSlotActivo(slotActivo === id ? null : id)}
                                className={`w-28 py-3 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center ${slotActivo === id ? 'border-blue-500 bg-blue-50 ring-2' : formData.posiciones[id] ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                                <div className="text-[9px] font-bold text-slate-400 mb-0.5">{label}</div>
                                <div className="text-xs font-black text-slate-800 truncate max-w-full px-1">{formData.posiciones[id] || <span className="text-slate-300 font-medium">vacío</span>}</div>
                              </button>
                            ))}
                          </div>
                          <div className="h-px bg-slate-200 w-5/6"/>
                          <div className="flex justify-center gap-2 w-full">
                            {[
                              { id:'f5', label:'F5' },
                              { id:'f4', label:'F4' },
                            ].map(({id, label}) => (
                              <button key={id} type="button" onClick={() => setSlotActivo(slotActivo === id ? null : id)}
                                className={`w-28 py-3 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center ${slotActivo === id ? 'border-blue-500 bg-blue-50 ring-2' : formData.posiciones[id] ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                                <div className="text-[9px] font-bold text-slate-400 mb-0.5">{label}</div>
                                <div className="text-xs font-black text-slate-800 truncate max-w-full px-1">{formData.posiciones[id] || <span className="text-slate-300 font-medium">vacío</span>}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Panel derecho: fuentes + acciones */}
                  <div className="col-span-12 lg:col-span-7 space-y-6">
                    {slotActivo && (
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-blue-700 text-sm font-bold text-center animate-pulse">
                        Seleccioná una fuente para asignar a <span className="uppercase">{slotActivo}</span>
                      </div>
                    )}
                    <div className="flex gap-4">
                      <button onClick={() => cargarLote('LOTE_1')} className="flex-1 bg-white border border-orange-200 text-orange-600 p-5 rounded-2xl font-bold italic shadow-sm hover:bg-orange-50 transition-all text-xs">🚀 Lote 1</button>
                      <button onClick={() => cargarLote('LOTE_2')} className="flex-1 bg-white border border-emerald-200 text-emerald-600 p-5 rounded-2xl font-bold italic shadow-sm hover:bg-emerald-50 transition-all text-xs">🌿 Lote 2</button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 max-h-[280px] overflow-y-auto pr-2">
                      {fuentesDisponibles.map(id => (
                        <button key={id} onClick={() => asignarFuenteASlot(id)} disabled={!slotActivo}
                          className={`p-4 rounded-xl border-2 font-bold text-[11px] transition-all ${formData.ids_fuentes.includes(id) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed'}`}>
                          {id}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Barra de navegación */}
                <div className="mt-10 flex gap-4 border-t border-slate-100 pt-8">
                  <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest">← Paciente</button>
                  <button onClick={() => setStep(2)} className="flex-1 bg-slate-50 text-slate-400 py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest">Parámetros</button>
                  <button onClick={enviarFinal} className="flex-[2] bg-emerald-600 text-white py-5 rounded-2xl font-bold text-lg uppercase shadow-xl italic tracking-tight hover:bg-emerald-700 transition-all">
                    Generar Plan ✓
                  </button>
                </div>

                {/* Resultado + botón imprimir */}
                {resultado && (
                  <div className="mt-10 bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="px-8 pt-7 pb-5 border-b border-slate-700">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-1">Resultado del cálculo dosimétrico</p>
                      <p className="text-sm font-semibold text-slate-300">{formData.nombre_paciente || "—"}</p>
                    </div>
                    <div className="px-8 py-6 flex items-center justify-between gap-6">
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Extracción programada</p>
                        <p className="text-[11px] font-medium text-slate-400 mb-1">Fecha</p>
                        <p className="text-3xl font-bold text-white tracking-tight leading-none">
                          {resultado.fecha_extraccion?.split(" a las ")[0] || resultado.fecha_extraccion}
                        </p>
                      </div>
                      <div className="w-px h-16 bg-slate-700 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] font-medium text-slate-400 mb-1">Hora</p>
                        <p className="text-3xl font-bold text-emerald-400 tracking-tight leading-none">
                          {resultado.fecha_extraccion?.split(" a las ")[1] || "—"}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">{formData.tiempo_tratamiento_horas}h de tratamiento</p>
                      </div>
                    </div>
                    <div className="px-8 pb-7 space-y-3">
                      {/* Uploader imagen carta de alta */}
                      <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                        ${imagenCarta ? 'border-emerald-500 bg-emerald-50' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black
                          ${imagenCarta ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                          {imagenCarta ? '✓' : '📷'}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-300">Imagen curvas de isodosis</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {imagenCarta ? 'Imagen cargada — se incluirá en carta de alta' : 'Opcional · .jpg / .png para carta de alta'}
                          </p>
                        </div>
                        {imagenCarta && (
                          <button type="button" onClick={e => { e.preventDefault(); setImagenCarta(null); }}
                            className="text-slate-500 hover:text-red-400 transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        )}
                        <input type="file" accept="image/*" className="hidden"
                          onChange={e => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = ev => setImagenCarta(ev.target.result);
                            reader.readAsDataURL(file);
                          }} />
                      </label>

                      {/* Imprimir */}
                      <button
                        onClick={() => {
                          const apellido = (formData.nombre_paciente || 'Paciente')
                            .split(',')[0].trim()
                            .toLowerCase().replace(/\s+/g, '_');
                          const titulo = document.title;
                          document.title = `informe_${apellido}`;
                          window.print();
                          document.title = titulo;
                        }}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/></svg>
                        Imprimir Informes Clínicos
                      </button>

                      <div className="flex gap-3">
                        {/* Guardar en DB */}
                        <button
                          onClick={() => guardarEnDB(resultado)}
                          disabled={guardadoStatus === 'saving' || guardadoStatus === 'ok'}
                          className={`flex-1 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95
                            ${guardadoStatus === 'ok'
                              ? 'bg-slate-700 text-emerald-400 cursor-default'
                              : guardadoStatus === 'error'
                              ? 'bg-red-900 text-red-300 hover:bg-red-800'
                              : guardadoStatus === 'saving'
                              ? 'bg-slate-700 text-slate-400 cursor-wait'
                              : 'bg-slate-700 hover:bg-slate-600 text-white'}`}>
                          {guardadoStatus === 'ok' ? (
                            <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Guardado</>
                          ) : guardadoStatus === 'saving' ? (
                            <>Guardando...</>
                          ) : guardadoStatus === 'error' ? (
                            <>Error — Reintentar</>
                          ) : (
                            <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>Guardar</>
                          )}
                        </button>

                        {/* Volver al inicio */}
                        <button
                          onClick={volverAlInicio}
                          className="flex-1 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all active:scale-95">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                          Inicio
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

    </div>

    {/* ═══════════════════════════════════════════════════════════════════════
        VISTA IMPRESIÓN — solo visible al hacer window.print()
        HOJA 1: PRESCRIPCIÓN MÉDICA
        HOJA 2: INFORME DOSIMÉTRICO
    ═══════════════════════════════════════════════════════════════════════ */}
    {resultado && (<>
        <div id="informe-clinico-pdf" style={{ display: 'none' }}>
          {/* ─────────────────────────────────────────────────────────────────
              HOJA 1 — PRESCRIPCIÓN MÉDICA
          ───────────────────────────────────────────────────────────────── */}
          <div className="bloque-pdf hoja-impresion">

            {/* Encabezado */}
            <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <LogoEmpresa />
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '13pt', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1 }}>Prescripción Médica</div>
                <div style={{ fontSize: '7pt', color: '#94a3b8', marginTop: '3px' }}>Braquiterapia Ginecológica · LDR &nbsp;|&nbsp; {fechaImpresion}</div>
              </div>
            </div>

            {/* Datos filiatorios */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '9px' }}>
              <tbody>
                <tr>
                  <td style={{ width: '60%', padding: '6px 10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', verticalAlign: 'top' }}>
                    <div style={{ fontSize: '6.5pt', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2px' }}>Paciente</div>
                    <div style={{ fontSize: '14pt', fontWeight: '900', textTransform: 'uppercase', lineHeight: 1.1 }}>{formData.nombre_paciente || '________________________________'}</div>
                    <div style={{ fontSize: '8pt', color: '#475569', marginTop: '2px' }}>ID: {formData.id_paciente || '___________'} &nbsp;|&nbsp; HC: {formData.historia_clinica || '___________'}</div>
                    <div style={{ fontSize: '8pt', color: '#475569', marginTop: '2px' }}>Diagnóstico: <strong>{formData.diagnostico || '______________________________'}</strong></div>
                  </td>
                  <td style={{ width: '3%' }}></td>
                  <td style={{ width: '37%', padding: '6px 10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', verticalAlign: 'top' }}>
                    <div style={{ fontSize: '6.5pt', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2px' }}>Médico Responsable</div>
                    <div style={{ fontSize: '11pt', fontWeight: '700' }}>Dr. {formData.medico_responsable || '_______________________'}</div>
                    <div style={{ marginTop: '6px', fontSize: '6.5pt', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Físico Responsable</div>
                    <div style={{ fontSize: '11pt', fontWeight: '700' }}>{formData.fisico_medico || '_______________________'}</div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Tratamiento y fuentes */}
            <div style={{ background: '#0f172a', color: 'white', borderRadius: '8px', padding: '10px 14px', marginBottom: '9px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '6.5pt', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Tratamiento</div>
                <div style={{ fontSize: '13pt', fontWeight: '900' }}>
                  {formData.aplicador === 'fletcher' ? 'Aplicador Fletcher (Manchester)' : 'Cúpula Vaginal (CEMENU)'}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '6.5pt', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  Dosis Total Prescripta ({formData.aplicador === 'fletcher' ? 'Punto A' : 'Punto I'})
                </div>
                <div style={{ fontSize: '22pt', fontWeight: '900', lineHeight: 1 }}>{formData.dosis_prescripta_braqui} cGy</div>
              </div>
            </div>

            {/* Tabla fuentes */}
            <div style={{ marginBottom: '9px' }}>
              <div style={{ fontSize: '7pt', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>
                Fuentes Utilizadas — Cs-137
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9pt' }}>
                <thead>
                  <tr style={{ background: '#1e293b', color: 'white' }}>
                    <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '1px' }}>Posición</th>
                    <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '1px' }}>N° Serie</th>
                    <th style={{ padding: '6px 10px', textAlign: 'center', fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '1px' }}>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(resultado.asignacion).map(([pos, data], i) => {
                    const tipoFuente = data.id?.startsWith('J3') ? 'CDCSJ3' : data.id?.startsWith('J5') ? 'CDCJ5' : data.id?.startsWith('M2') ? 'CDCSM2' : data.id?.startsWith('M4') ? 'CDCSM4' : '—';
                    const posLabel = pos.toUpperCase();
                    return (
                      <tr key={pos} style={{ background: i % 2 === 0 ? '#f8fafc' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '6px 10px', fontWeight: '700' }}>{posLabel}</td>
                        <td style={{ padding: '6px 10px', fontFamily: 'monospace', fontSize: '10pt', fontWeight: '700' }}>{data.id}</td>
                        <td style={{ padding: '6px 10px', textAlign: 'center', fontSize: '8pt', color: '#64748b' }}>Amersham {tipoFuente}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Tabla órganos a riesgo */}
            <div style={{ marginBottom: '9px' }}>
              <div style={{ fontSize: '7pt', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>
                Órganos a Riesgo
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9pt' }}>
                <thead>
                  <tr style={{ background: '#1e293b', color: 'white' }}>
                    <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: '7pt', textTransform: 'uppercase' }}>Órgano</th>
                    <th style={{ padding: '6px 10px', textAlign: 'center', fontSize: '7pt', textTransform: 'uppercase' }}>Dosis RT Externa</th>
                    <th style={{ padding: '6px 10px', textAlign: 'center', fontSize: '7pt', textTransform: 'uppercase' }}>Dosis Braquiterapia</th>
                    <th style={{ padding: '6px 10px', textAlign: 'center', fontSize: '7pt', textTransform: 'uppercase' }}>Dosis Total</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Vejiga', key: 'vejiga' },
                    { label: 'Recto',  key: 'recto'  },
                    { label: 'Sigma',  key: 'sigma'   },
                  ].map(({ label, key }, i) => {
                    const dosisExt    = organosDosis[key] ? String(organosDosis[key]) : '';
                    const dosisBraqui = braquiDatos?.[key] ? String(braquiDatos[key]) : '';
                    const dosisTotal  = dosisExt || dosisBraqui
                      ? `${(parseFloat(dosisExt || '0') + parseFloat(dosisBraqui || '0')).toFixed(0)} cGy`
                      : '';
                    return (
                      <tr key={label} style={{ background: i % 2 === 0 ? '#f8fafc' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px 10px', fontWeight: '700', fontStyle: 'italic' }}>{label}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', color: dosisExt ? '#0f172a' : '#94a3b8', fontWeight: dosisExt ? '700' : '400' }}>
                          {dosisExt ? `${dosisExt} cGy` : '_________ cGy'}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', color: dosisBraqui ? '#0f172a' : '#94a3b8', fontWeight: dosisBraqui ? '700' : '400' }}>
                          {dosisBraqui ? `${dosisBraqui} cGy` : '_________ cGy'}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', color: dosisTotal ? '#0f172a' : '#94a3b8', fontWeight: '700' }}>
                          {dosisTotal || '_______'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Comentarios */}
            {formData.comentarios && (
              <div style={{ background: '#fefce8', border: '1px solid #fde047', borderRadius: '8px', padding: '8px 12px', marginBottom: '14px', fontSize: '9pt' }}>
                <span style={{ fontWeight: '700', fontSize: '7pt', textTransform: 'uppercase', color: '#92400e', letterSpacing: '1px' }}>Comentarios: </span>
                {formData.comentarios}
              </div>
            )}

            {/* Firmas hoja 1 */}
            <div style={{ marginTop: '40px', paddingTop: '0px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
              {[
                { nombre: `Dr. ${formData.medico_responsable || ''}`, rol: 'Firma y Sello — Médico Responsable' },
                { nombre: formData.fisico_medico || '', rol: 'Firma — Físico Responsable' },
              ].map(({ nombre, rol }) => (
                <div key={rol} style={{ textAlign: 'center' }}>
                  {/* Espacio en blanco para la firma manuscrita */}
                  <div style={{ height: '38px' }} />
                  <div style={{ borderTop: '1px solid #0f172a', paddingTop: '6px' }}>
                    <div style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '8.5pt', letterSpacing: '0.5px' }}>{nombre}</div>
                    <div style={{ fontSize: '6.5pt', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{rol}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              HOJA 2 — INFORME DOSIMÉTRICO
          ───────────────────────────────────────────────────────────────── */}
          <div className="salto-hoja bloque-pdf hoja-impresion">

            {/* Encabezado */}
            <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <LogoEmpresa />
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '13pt', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1 }}>Informe Dosimétrico</div>
                <div style={{ fontSize: '7pt', color: '#94a3b8', marginTop: '3px' }}>
                  {formData.aplicador === 'fletcher' ? 'Aplicador Fletcher' : 'Cúpula Vaginal — CEMENU'} &nbsp;|&nbsp; {fechaImpresion}
                </div>
              </div>
            </div>

            {/* Datos del paciente compactos */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 14px', marginBottom: '9px', display: 'flex', gap: '30px', flexWrap: 'wrap', fontSize: '9pt' }}>
              <div><span style={{ color: '#94a3b8', fontSize: '6.5pt', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>Paciente</span><strong style={{ textTransform: 'uppercase' }}>{formData.nombre_paciente}</strong></div>
              <div><span style={{ color: '#94a3b8', fontSize: '6.5pt', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>Diagnóstico</span><strong>{formData.diagnostico}</strong></div>
              <div><span style={{ color: '#94a3b8', fontSize: '6.5pt', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>Médico</span><strong>Dr. {formData.medico_responsable}</strong></div>
              <div><span style={{ color: '#94a3b8', fontSize: '6.5pt', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>Físico</span><strong>{formData.fisico_medico}</strong></div>
            </div>

            {/* Tiempos */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '9px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '7px 12px' }}>
                <div style={{ fontSize: '6.5pt', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2px' }}>Fecha y Hora de Colocación</div>
                <div style={{ fontSize: '13pt', fontWeight: '900' }}>{formatFechaColocacion()}</div>
              </div>
              <div style={{ background: '#0f172a', borderRadius: '8px', padding: '7px 12px', color: 'white' }}>
                <div style={{ fontSize: '6.5pt', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2px' }}>↗ Fecha y Hora de Extracción</div>
                <div style={{ fontSize: '13pt', fontWeight: '900', color: '#4ade80' }}>{resultado.fecha_extraccion}</div>
                <div style={{ fontSize: '7.5pt', color: '#94a3b8', marginTop: '2px' }}>Duración: {formData.tiempo_tratamiento_horas} horas</div>
              </div>
            </div>

            {/* Esquema + tabla dosis */}
            <div style={{ display: 'grid', gridTemplateColumns: '55% 43%', gap: '2%', marginBottom: '9px' }}>
              {/* Esquema */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '6.5pt', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px', alignSelf: 'flex-start' }}>
                  Esquema de Implante — Posición de Fuentes
                </div>
                {formData.aplicador === 'fletcher'
                  ? <img src="/implante-fletcher.jpg" alt="Esquema Fletcher"
                      style={{ width: '100%', maxHeight: '295px', objectFit: 'contain', display: 'block' }}/>
                  : <img src="/implante-cupula.jpg" alt="Esquema Cúpula"
                      style={{ width: '100%', maxHeight: '295px', objectFit: 'contain', display: 'block' }}/>
                }
                <div style={{ fontSize: '7pt', color: '#94a3b8', textAlign: 'center', marginTop: '4px' }}>
                  {formData.aplicador === 'fletcher'
                    ? '* Las fuentes son Cs-137 CDCSJ (cuerpo) y CDCJ5 (ovoides). Escala 1:1.'
                    : '* Las fuentes son Cs-137 CDCSM. Los dibujos no están a escala.'}
                </div>
              </div>

              {/* Tabla dosis puntos */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: '#1e293b', color: 'white', padding: '8px 12px', fontSize: '7pt', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  Dosis en Puntos de Interés
                </div>
                {/* Header row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', background: '#f1f5f9', padding: '5px 10px', borderBottom: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '6.5pt', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Punto</span>
                  <span style={{ fontSize: '6.5pt', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px' }}>cGy</span>
                </div>
                {(formData.aplicador === 'fletcher'
                  ? [
                      { label: 'A derecho', code: 'Ad', italic: false },
                      { label: 'A izquierdo', code: 'Ai', italic: false },
                      { label: 'B derecho', code: 'Bd', italic: false },
                      { label: 'B izquierdo', code: 'Bi', italic: false },
                      { label: 'Recto', code: 'R', italic: true, footnote: true },
                      { label: 'Vejiga', code: 'V', italic: true, footnote: true },
                    ]
                  : [
                      { label: '0,5 cm', code: 'I', italic: false },
                      { label: '1 cm', code: 'II', italic: false },
                      { label: '1,5 cm', code: 'III', italic: false },
                      { label: 'Recto', code: 'R', italic: true, footnote: true },
                      { label: 'Vejiga', code: 'V', italic: true, footnote: true },
                    ]
                ).map(({ label, code, italic, footnote }, i) => {
                  // Mapear code → clave en braquiDatos
                  const claveMap = { Ad:'ad', Ai:'ai', Bd:'bd', Bi:'bi', R:'recto', V:'vejiga', I:'i', II:'ii', III:'iii' };
                  const valorBraqui = braquiDatos?.[claveMap[code]];
                  const tieneDato  = valorBraqui && String(valorBraqui).trim() !== '';
                  return (
                  <div key={code} style={{
                    display: 'grid', gridTemplateColumns: 'auto 1fr auto',
                    alignItems: 'center', gap: '8px',
                    padding: '5px 10px',
                    background: i % 2 === 0 ? 'white' : '#f8fafc',
                    borderBottom: '1px solid #f1f5f9',
                  }}>
                    <span style={{
                      display: 'inline-block', minWidth: '22px', textAlign: 'center',
                      background: footnote ? '#f1f5f9' : '#1e293b',
                      color: footnote ? '#94a3b8' : 'white',
                      borderRadius: '4px', padding: '1px 5px',
                      fontSize: '7.5pt', fontWeight: '900', fontStyle: 'normal',
                    }}>{code}</span>
                    <span style={{ fontSize: '8.5pt', color: italic ? '#94a3b8' : '#0f172a', fontStyle: italic ? 'italic' : 'normal' }}>
                      {label}{footnote ? ' *' : ''}
                    </span>
                    <span style={{
                      fontSize: '8.5pt',
                      fontWeight: tieneDato ? '700' : '400',
                      color: tieneDato ? '#0f172a' : '#cbd5e1',
                      borderBottom: `1px solid ${tieneDato ? '#0f172a' : '#cbd5e1'}`,
                      minWidth: '72px', display: 'inline-block', textAlign: 'right',
                      paddingRight: '4px', paddingBottom: '1px',
                    }}>{tieneDato ? `${valorBraqui} cGy` : ' '}</span>
                  </div>
                  );
                })}
                <div style={{ padding: '5px 10px', fontSize: '6.5pt', color: '#94a3b8', borderTop: '1px solid #e2e8f0', background: '#f8fafc', lineHeight: '1.5' }}>
                  {formData.aplicador === 'fletcher'
                    ? '* R y V localizados por el médico según referencias anatómicas.'
                    : '* R y V localizados por el médico responsable.'}
                </div>
              </div>
            </div>

            {/* Actividad de fuentes */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                <div style={{ width: '3px', height: '13px', background: '#0f172a', borderRadius: '1px', flexShrink: 0 }} />
                <span style={{ fontSize: '7pt', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#0f172a' }}>
                  Actividad de Fuentes a la Fecha de Tratamiento
                </span>
              </div>
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9pt' }}>
                  <thead>
                    {braquiDatos?.actividades && (
                      <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                        <th colSpan={3} style={{ padding: '3px 10px' }} />
                        <th colSpan={3} style={{ padding: '3px 10px', textAlign: 'center', fontSize: '6pt', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#475569', borderLeft: '2px solid #94a3b8' }}>
                          Verificación — Eclipse TPS
                        </th>
                      </tr>
                    )}
                    <tr style={{ background: '#0f172a', color: 'white' }}>
                      <th style={{ padding: '7px 10px', textAlign: 'left', fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Posición</th>
                      <th style={{ padding: '7px 10px', textAlign: 'left', fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>N° Serie</th>
                      <th style={{ padding: '7px 10px', textAlign: 'right', fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Actividad (mCi)</th>
                      {braquiDatos?.actividades && <>
                        <th style={{ padding: '7px 10px', textAlign: 'right', fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', borderLeft: '2px solid #334155' }}>Eclipse (mCi)</th>
                        <th style={{ padding: '7px 10px', textAlign: 'right', fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Error %</th>
                        <th style={{ padding: '7px 10px', textAlign: 'center', fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Estado</th>
                      </>}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(resultado.asignacion).map(([pos, data], i) => {
                      const actEclipse = braquiDatos?.actividades?.[data.id];
                      const error = actEclipse != null
                        ? Math.abs((actEclipse - parseFloat(data.mCi)) / parseFloat(data.mCi)) * 100
                        : null;
                      const aceptable = error != null && error < 2;
                      return (
                        <tr key={pos} style={{ background: i % 2 === 0 ? '#f8fafc' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '7px 10px', fontWeight: '700', fontSize: '9pt' }}>{pos.toUpperCase()}</td>
                          <td style={{ padding: '7px 10px', fontFamily: 'monospace', fontSize: '9pt', fontWeight: '700', color: '#334155' }}>{data.id}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', fontWeight: '900', fontSize: '11pt' }}>{data.mCi}</td>
                          {braquiDatos?.actividades && <>
                            <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: '700', borderLeft: '2px solid #e2e8f0' }}>
                              {actEclipse != null ? actEclipse : '—'}
                            </td>
                            <td style={{ padding: '7px 10px', textAlign: 'right', fontWeight: '800', background: error == null ? 'transparent' : aceptable ? '#f0fdf4' : '#fef2f2', color: error == null ? '#94a3b8' : aceptable ? '#15803d' : '#dc2626' }}>
                              {error != null ? `${error.toFixed(1)}%` : '—'}
                            </td>
                            <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                              {error == null ? (
                                <span style={{ color: '#94a3b8', fontSize: '8pt' }}>—</span>
                              ) : aceptable ? (
                                <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '20px', fontSize: '7pt', fontWeight: '800', background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', letterSpacing: '0.3px' }}>✓ Conforme</span>
                              ) : (
                                <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '20px', fontSize: '7pt', fontWeight: '800', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', letterSpacing: '0.3px' }}>✗ Revisar</span>
                              )}
                            </td>
                          </>}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Comentarios */}
            {formData.comentarios && (
              <div style={{ background: '#fefce8', border: '1px solid #fde047', borderRadius: '8px', padding: '8px 12px', marginBottom: '14px', fontSize: '9pt' }}>
                <span style={{ fontWeight: '700', fontSize: '7pt', textTransform: 'uppercase', color: '#92400e', letterSpacing: '1px' }}>Comentarios: </span>
                {formData.comentarios}
              </div>
            )}

            {/* Nota metodológica */}
            <div style={{ fontSize: '7pt', color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: '4px', marginBottom: '10px', lineHeight: '1.6' }}>
              {formData.aplicador === 'fletcher'
                ? 'Sistema de puntos según Manchester (Tod & Meredith, 1938, 1953). Se adjuntan curvas de isodosis correspondientes a los planos de las placas localizadoras (anterior y lateral). La escala del diagrama es 1:1.'
                : 'Implante cúpula vaginal (CEMENU). Los dibujos del esquema no están a escala; las magnitudes mostradas están en cm. A menos que se aclare lo contrario, las fuentes son Cs-137 código CDCSM.'}
            </div>

            {/* Firmas hoja 2 */}
            <div style={{ marginTop: '40px', paddingTop: '0px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
              {[
                { nombre: `Dr. ${formData.medico_responsable || ''}`, rol: 'Firma y Sello — Médico Responsable' },
                { nombre: formData.fisico_medico || '', rol: 'Firma — Físico Responsable' },
              ].map(({ nombre, rol }) => (
                <div key={rol} style={{ textAlign: 'center' }}>
                  <div style={{ height: '38px' }} />
                  <div style={{ borderTop: '1px solid #0f172a', paddingTop: '6px' }}>
                    <div style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '8.5pt', letterSpacing: '0.5px' }}>{nombre}</div>
                    <div style={{ fontSize: '6.5pt', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{rol}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            HOJA 3 — CARTA DE ALTA (portal → body para ancho landscape)
        ───────────────────────────────────────────────────────────────── */}
        {createPortal(<div id="carta-de-alta-pdf" style={{ display: 'none' }}>
          <div style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            width: '100%',
            height: '186mm',
            maxHeight: '186mm',
            overflow: 'hidden',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          }}>

            {/* ── HEADER ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '8px', marginBottom: '4px' }}>
              <div style={{ fontSize: '10pt', color: '#334155', lineHeight: '1.5' }}>
                <div>Apellido y Nombre: <strong style={{ fontSize: '11pt' }}>{formData.nombre_paciente || '______________________________'}</strong></div>
                <div style={{ color: '#64748b', fontStyle: 'italic', fontSize: '9pt' }}>{formData.diagnostico || 'Ca de Cuello de Útero'}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1 }}>
                  <span style={{ fontSize: '20pt', fontWeight: '900', color: '#64748b', letterSpacing: '-0.5px' }}>CR</span>
                  <span style={{ fontSize: '20pt', fontWeight: '900', color: '#64748b', letterSpacing: '-0.5px' }}>SJ</span>
                </div>
                <div style={{ width: '2px', height: '48px', background: '#94a3b8' }} />
                <div style={{ lineHeight: 1.25 }}>
                  <div style={{ fontSize: '9.5pt', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>CENTRO</div>
                  <div style={{ fontSize: '9.5pt', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>RADIOTERAPIA</div>
                  <div style={{ fontSize: '9.5pt', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>SAN JUAN</div>
                </div>
              </div>
            </div>

            {/* Línea dorada superior */}
            <div style={{ height: '4px', background: 'linear-gradient(to right, #78350f, #d97706, #78350f)', marginBottom: '10px', flexShrink: 0 }} />

            {/* ── Imagen — ocupa todo el espacio sobrante ── */}
            <div style={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: imagenCarta ? 'none' : '1px dashed #cbd5e1',
              backgroundColor: imagenCarta ? 'transparent' : '#f8fafc',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '10px',
            }}>
              {imagenCarta
                ? <img src={imagenCarta} alt="Curvas de isodosis"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                : <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '11pt', fontWeight: '600' }}>[ Imagen de curvas de isodosis ]</div>
                    <div style={{ fontSize: '9pt', marginTop: '6px' }}>Cargá la imagen antes de imprimir</div>
                  </div>
              }
            </div>

            {/* ── Leyenda ── */}
            <div style={{ textAlign: 'center', fontSize: '9pt', fontWeight: '700', color: '#1e293b', marginBottom: '10px', flexShrink: 0 }}>
              {formData.aplicador === 'fletcher'
                ? 'Curvas de isodosis en planos coronal y sagital para los distintos puntos de prescripción A, y B, recto y vejiga.'
                : `Curvas de isodosis para los distintos puntos de prescripción I, II y III, recto y vejiga. Tiempo de implante ${formData.tiempo_tratamiento_horas} horas para entregar ${formData.dosis_prescripta_braqui} cGy al punto I.`
              }
            </div>

            {/* ── FOOTER ── */}
            <div style={{ flexShrink: 0 }}>
              <div style={{ height: '4px', background: 'linear-gradient(to right, #78350f, #d97706, #78350f)', marginBottom: '8px' }} />
              <div style={{ fontSize: '8.5pt', color: '#64748b' }}>
                Rivadavia 1069 (este) Ciudad - San Juan - Tel: 0264 422 2233 - E-Mail: info@crsanjuan.com.ar
              </div>
            </div>

          </div>
        </div>, document.body)}
        {createPortal(<div id="print-tail" />, document.body)}
    </>)}

  </>);
};

export default BraquiApp;