from pydantic import BaseModel
from typing import List, Optional, Dict

class PlanBraquiterapia(BaseModel):
    # Datos Filiatorios
    nombre_paciente: str
    historia_clinica: str
    id_paciente: str
    diagnostico: str
    medico_responsable: str
    fisico_medico: str
    
    # Datos del Implante
    fecha_colocacion: str  # Formato "YYYY-MM-DD HH:MM"
    tiempo_tratamiento_horas: float
    
    # Fuentes y Dosimetría
    ids_fuentes: List[str]  # Lista de las 5 fuentes (ej: ["6102", "6103", ...])
    posiciones: Dict[str, Optional[str]]
    dosis_externa_gy: float
    fraccionamiento_externa: int
    puntos_interes: Optional[dict] = None # Para Manchester o Cúpula después