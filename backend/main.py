from fastapi import FastAPI, Response, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from xhtml2pdf import pisa
from sqlalchemy.orm import Session
from typing import Optional
import io, re, json

from core.physics import get_decayed_activity, calcular_fecha_extraccion, SOURCES_DB
from core.schemas import PlanBraquiterapia
from database import init_db, get_db, Medico, Paciente, Plan

app = FastAPI(title="BraquiApp API")

@app.on_event("startup")
def startup():
    init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# ── SCHEMAS ───────────────────────────────────────────────────────────────────
class InformeData(BaseModel):
    nombre_paciente: str
    id_paciente: str
    historia_clinica: str
    diagnostico: str = ""
    medico_responsable: str = ""
    fisico_medico: str = ""
    fecha_colocacion: str
    tiempo_tratamiento_horas: float
    dosis_prescripta_braqui: float = 0
    aplicador: str
    resultado: dict

class PacienteCreate(BaseModel):
    nombre: str
    dni: str
    historia_clinica: str
    diagnostico: str = ""

class PlanCreate(BaseModel):
    paciente_id: int
    medico_id: int
    fisico_id: int
    fecha_colocacion: str
    tiempo_horas: float
    dosis_prescripta: float
    aplicador: str
    fecha_extraccion: str = ""
    asignacion_fuentes: dict = {}
    dosis_organos: dict = {}

# ── FUENTES Y PLAN ────────────────────────────────────────────────────────────
@app.get("/fuentes")
def listar_fuentes():
    return list(SOURCES_DB.keys())

@app.post("/procesar-plan")
def procesar_plan(plan: PlanBraquiterapia):
    fecha_fin = calcular_fecha_extraccion(plan.fecha_colocacion, plan.tiempo_tratamiento_horas)
    detalles  = {}
    for pos, f_id in plan.posiciones.items():
        if f_id:
            act = get_decayed_activity(f_id, plan.fecha_colocacion.split(" ")[0])
            detalles[pos] = {"id": f_id, "mCi": act}
    return {"status": "success", "data": {
        "paciente": plan.nombre_paciente,
        "fecha_extraccion": fecha_fin,
        "asignacion": detalles
    }}

# ── GENERAR PDF ───────────────────────────────────────────────────────────────
@app.post("/generar-pdf")
async def generar_pdf(data: InformeData):
    fuentes_html = "".join([
        f"<tr><td>{pos.upper()}</td><td>{info['id']}</td><td>{info['mCi']} mCi</td></tr>"
        for pos, info in data.resultado.get('asignacion', {}).items()
    ])
    html_content = f"""
    <html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style>
        @page {{ size: A4; margin: 2cm; }}
        body {{ font-family: Helvetica, Arial, sans-serif; color: #1e293b; }}
        .header {{ border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 20px; }}
        .label {{ font-size: 9pt; color: #64748b; font-weight: bold; text-transform: uppercase; }}
        .value {{ font-size: 12pt; font-weight: bold; color: #0f172a; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 10px; }}
        th {{ background-color: #0f172a; color: white; padding: 8px; text-align: left; font-size: 10pt; }}
        td {{ border-bottom: 1px solid #e2e8f0; padding: 8px; font-size: 10pt; }}
    </style></head>
    <body>
    <div class="header"><h1 style="margin:0;">BraquiApp.</h1>
    <p style="font-size:10pt;color:#64748b;">INFORME DOSIMÉTRICO</p></div>
    <table><thead><tr><th>Posición</th><th>ID Fuente</th><th>Actividad</th></tr></thead>
    <tbody>{fuentes_html}</tbody></table>
    </body></html>"""
    result = io.BytesIO()
    pisa.CreatePDF(src=io.BytesIO(html_content.encode("utf-8")), dest=result, encoding='utf-8')
    return Response(content=result.getvalue(), media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Informe_{data.id_paciente}.pdf"})

# ── PROFESIONALES ─────────────────────────────────────────────────────────────
@app.get("/medicos")
def listar_medicos(db: Session = Depends(get_db)):
    todos = db.query(Medico).all()
    return {
        "medicos": [{"id": m.id, "nombre": f"Dr. {m.nombre} {m.apellido}"}
                    for m in todos if m.especialidad == "medico"],
        "fisicos": [{"id": m.id, "nombre": f"{m.nombre} {m.apellido}"}
                    for m in todos if m.especialidad == "fisico"],
    }

# ── PACIENTES ─────────────────────────────────────────────────────────────────
@app.get("/pacientes")
def listar_pacientes(q: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Paciente)
    if q:
        query = query.filter(
            Paciente.nombre.ilike(f"%{q}%") |
            Paciente.dni.ilike(f"%{q}%") |
            Paciente.historia_clinica.ilike(f"%{q}%")
        )
    return [{"id": p.id, "nombre": p.nombre, "dni": p.dni,
             "historia_clinica": p.historia_clinica, "diagnostico": p.diagnostico}
            for p in query.order_by(Paciente.nombre).all()]

@app.post("/pacientes")
def crear_o_actualizar_paciente(data: PacienteCreate, db: Session = Depends(get_db)):
    existente = db.query(Paciente).filter(Paciente.dni == data.dni).first()
    if existente:
        existente.nombre           = data.nombre
        existente.historia_clinica = data.historia_clinica
        existente.diagnostico      = data.diagnostico
        db.commit(); db.refresh(existente)
        return {"id": existente.id, "created": False}
    nueva = Paciente(**data.dict())
    db.add(nueva); db.commit(); db.refresh(nueva)
    return {"id": nueva.id, "created": True}

@app.get("/pacientes/{paciente_id}/planes")
def historial_paciente(paciente_id: int, db: Session = Depends(get_db)):
    p = db.query(Paciente).filter(Paciente.id == paciente_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Paciente no encontrada")
    planes = [{
        "id":                pl.id,
        "fecha_colocacion":  pl.fecha_colocacion,
        "fecha_extraccion":  pl.fecha_extraccion,
        "aplicador":         pl.aplicador,
        "dosis_prescripta":  pl.dosis_prescripta,
        "tiempo_horas":      pl.tiempo_horas,
        "medico":            f"Dr. {pl.medico.nombre} {pl.medico.apellido}",
        "fisico":            f"{pl.fisico.nombre} {pl.fisico.apellido}",
        "asignacion_fuentes": json.loads(pl.asignacion_fuentes),
        "dosis_organos":      json.loads(pl.dosis_organos),
        "fecha_creacion":    pl.fecha_creacion.isoformat() if pl.fecha_creacion else "",
    } for pl in p.planes]
    return {
        "paciente": {"id": p.id, "nombre": p.nombre, "dni": p.dni,
                     "historia_clinica": p.historia_clinica, "diagnostico": p.diagnostico},
        "planes": sorted(planes, key=lambda x: x["fecha_creacion"], reverse=True)
    }

# ── PLANES ────────────────────────────────────────────────────────────────────
@app.post("/planes")
def guardar_plan(data: PlanCreate, db: Session = Depends(get_db)):
    plan = Plan(
        paciente_id=data.paciente_id,
        medico_id=data.medico_id,
        fisico_id=data.fisico_id,
        fecha_colocacion=data.fecha_colocacion,
        tiempo_horas=data.tiempo_horas,
        dosis_prescripta=data.dosis_prescripta,
        aplicador=data.aplicador,
        fecha_extraccion=data.fecha_extraccion,
        asignacion_fuentes=json.dumps(data.asignacion_fuentes),
        dosis_organos=json.dumps(data.dosis_organos),
    )
    db.add(plan); db.commit(); db.refresh(plan)
    return {"id": plan.id, "status": "saved"}

@app.delete("/planes/{plan_id}")
def eliminar_plan(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan no encontrado")
    db.delete(plan); db.commit()
    return {"status": "ok"}

@app.delete("/pacientes/{paciente_id}")
def eliminar_paciente(paciente_id: int, db: Session = Depends(get_db)):
    paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    db.query(Plan).filter(Plan.paciente_id == paciente_id).delete()
    db.delete(paciente); db.commit()
    return {"status": "ok"}

# ── ECLIPSE PDF ───────────────────────────────────────────────────────────────
from pypdf import PdfReader

def _extraer_texto_eclipse(b: bytes) -> str:
    reader = PdfReader(io.BytesIO(b))
    return "\n".join(p.extract_text(extraction_mode="layout") or "" for p in reader.pages)

def _parsear_reference_points(txt: str) -> dict:
    res = {"recto":"","vejiga":"","sigma":"","ad":"","ai":"","bd":"","bi":""}
    idx = txt.find("Reference Points")
    if idx == -1:
        idx = txt.find("Puntos de referencia")
    if idx == -1: return res
    bloque = txt[idx:idx+2500]
    patron = re.compile(
        r'^[ \t]+(\S+(?:[ \t]+\S+)?)[ \t]+'
        r'[\d.-]+[ \t]*cm[ \t]+[\d.-]+[ \t]*cm[ \t]+[\d.-]+[ \t]*cm[ \t]+'
        r'([\d.]+)[ \t]*cGy.*?'
        r'(Rectum|Bladder|Sigmoid|Sigma|PTV[^\n]*|Fantoma[^\n]*|NS[^\n]*)?$',
        re.MULTILINE)
    for m in patron.finditer(bloque):
        pid=m.group(1).strip().lower(); dosis=m.group(2); vol=(m.group(3) or "").lower()
        if "rectum"  in vol:                          res["recto"]  = dosis
        elif "bladder" in vol:                        res["vejiga"] = dosis
        elif "sigmoid" in vol or "sigma" in vol:     res["sigma"]  = dosis
        # Fallback: cuando la columna Volume ID no matchea, usar el nombre del punto
        if not res["recto"]  and ("recto"  in pid or "rectum"  in pid): res["recto"]  = dosis
        if not res["vejiga"] and ("vejiga" in pid or "bladder" in pid):  res["vejiga"] = dosis
        if not res["sigma"]  and ("sigma"  in pid or "sigmoid" in pid):  res["sigma"]  = dosis
        if   pid=="ad":                               res["ad"]=dosis
        elif pid=="ai":                               res["ai"]=dosis
        elif pid=="bd":                               res["bd"]=dosis
        elif pid=="bi":                               res["bi"]=dosis
        elif pid=="a" and not res["ai"]:              res["ai"]=dosis
        elif pid=="b" and not res["bi"]:              res["bi"]=dosis
    return res

def _parsear_seed_collections(txt: str) -> dict:
    """Devuelve {app_source_id: eclipse_treatment_mCi} matcheando por actividad de calibración."""
    patron = re.compile(
        r'(?:Seed Collection ID|ID conjunto de semillas):\s+(\S+).*?'
        r'(?:Treatment Activity|Actividad del tratamiento):\s+([\d.]+)\s*mCi.*?'
        r'(?:Calibration Activity|Actividad de calibración):\s+([\d.]+)\s*mCi',
        re.DOTALL
    )
    result = {}
    for m in patron.finditer(txt):
        cal_act   = float(m.group(3))
        treat_act = float(m.group(2))
        matched   = min(SOURCES_DB.values(), key=lambda s: abs(s["act_init"] - cal_act))
        if abs(matched["act_init"] - cal_act) <= 0.05:
            result[matched["id"]] = treat_act
    return result

@app.post("/procesar-eclipse")
async def procesar_eclipse(archivo: UploadFile = File(...)):
    try:
        texto = _extraer_texto_eclipse(await archivo.read())
        datos = _parsear_reference_points(texto)
        datos["actividades"] = _parsear_seed_collections(texto)
        return {"status": "success", "datos": datos}
    except Exception as e:
        return {"status": "error", "error": str(e)}

