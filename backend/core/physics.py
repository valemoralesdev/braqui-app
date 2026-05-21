from datetime import datetime, timedelta
import math

SOURCES_DB = {
    "J3HF203": {"id": "J3HF203", "act_init": 40.33, "date_cal": "2001-03-14"},
    "J5HF207": {"id": "J5HF207", "act_init": 66.50, "date_cal": "2001-03-14"},
    "J3HB438": {"id": "J3HB438", "act_init": 42.28, "date_cal": "2000-02-08"},
    "J5HF204": {"id": "J5HF204", "act_init": 66.05, "date_cal": "2001-03-14"},
    "J5HF205": {"id": "J5HF205", "act_init": 66.22, "date_cal": "2001-03-14"},
    "M2DR982": {"id": "M2DR982", "act_init": 28.29, "date_cal": "1994-09-13"},
    "M2DR983": {"id": "M2DR983", "act_init": 27.77, "date_cal": "1994-09-13"},
    "M2DR984": {"id": "M2DR984", "act_init": 26.69, "date_cal": "1994-09-13"},
    "M4DR985": {"id": "M4DR985", "act_init": 53.24, "date_cal": "1994-09-19"},
    "M4DR986": {"id": "M4DR986", "act_init": 56.72, "date_cal": "1994-09-19"},
}


def _parsear_fecha(fecha_str: str) -> datetime:
    """
    Parsea la fecha de colocación tolerando todos los formatos
    que puede enviar el frontend:
      - "YYYY-MM-DD HH:MM"       ← el que esperamos
      - "YYYY-MM-DDTHH:MM"       ← datetime-local sin replace
      - "YYYY-MM-DD HH:MM:SS"    ← con segundos
      - "YYYY-MM-DDTHH:MM:SS"    ← ISO completo
    """
    # Normalizar: reemplazar T por espacio y quitar segundos si vienen
    s = fecha_str.strip().replace("T", " ")
    # Quitar segundos si están presentes: "HH:MM:SS" → "HH:MM"
    partes = s.split(" ")
    if len(partes) == 2:
        hora = partes[1][:5]   # tomar solo HH:MM
        s = f"{partes[0]} {hora}"
    return datetime.strptime(s, "%Y-%m-%d %H:%M")


def get_decayed_activity(source_id: str, target_date_str: str):
    source = SOURCES_DB.get(source_id)
    if not source:
        return None
    t_half_days = 30.17 * 365.25
    date_cal    = datetime.strptime(source["date_cal"], "%Y-%m-%d")
    date_target = datetime.strptime(target_date_str.split(" ")[0], "%Y-%m-%d")
    days_passed = (date_target - date_cal).days
    lam         = math.log(2) / t_half_days
    act_now     = source["act_init"] * math.exp(-lam * days_passed)
    return round(act_now, 3)


def calcular_fecha_extraccion(fecha_inicio_str: str, horas_tratamiento: float) -> str:
    inicio     = _parsear_fecha(fecha_inicio_str)
    extraccion = inicio + timedelta(hours=horas_tratamiento)
    return extraccion.strftime("%d/%m/%Y a las %H:%M hs")