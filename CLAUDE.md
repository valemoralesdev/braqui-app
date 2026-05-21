# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**BraquiApp** is a medical planning tool for LDR (Low Dose Rate) gynecological brachytherapy. It calculates radioactive source decay (Cs-137), assigns sources to applicator positions (Fletcher tandem+ovoids or Cúpula), and generates dosimetric reports as PDFs.

## Commands

### Backend (FastAPI)

```powershell
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload   # runs at http://localhost:8000
```

Install dependencies (if venv is missing):
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy pydantic xhtml2pdf pypdf
```

### Frontend (React + Vite)

```powershell
cd frontend
npm install
npm run dev        # runs at http://localhost:5173
npm run build
npm run lint
```

## Architecture

### Backend (`backend/`)

- **`main.py`** — All FastAPI routes in one file. Key endpoints:
  - `GET /fuentes` — lists available Cs-137 source IDs
  - `POST /procesar-plan` — computes decayed activities and extraction datetime
  - `POST /generar-pdf` — renders dosimetric report as PDF via xhtml2pdf
  - `POST /procesar-eclipse` — parses a PDF from the Eclipse TPS to extract reference point doses
  - CRUD for `/pacientes`, `/planes`, `/medicos`

- **`database.py`** — SQLite via SQLAlchemy. Three models: `Medico` (shared for médicos and físicos, distinguished by `especialidad` field), `Paciente`, `Plan`. The DB file `braquiapp.db` is created at startup; `init_db()` seeds the professionals list if empty.

- **`core/physics.py`** — Cs-137 decay math (`t½ = 30.17 × 365.25 days`). `SOURCES_DB` is the hardcoded inventory of physical sources with their initial activity and calibration date. `get_decayed_activity()` and `calcular_fecha_extraccion()` are the core calculation functions.

- **`core/schemas.py`** — Pydantic schema `PlanBraquiterapia` used by `/procesar-plan`.

### Frontend (`frontend/src/`)

- **`components/FormularioPaciente.jsx`** — The entire UI lives here (~1000+ lines). It's a multi-step wizard:
  - **Step 0**: Patient history search + "Nuevo Plan" button
  - **Step 1**: Patient data entry (name, DNI, HC, diagnosis, professionals, applicator type, date/time, treatment hours)
  - **Step 2**: Source assignment to positions (F1–F5 for Fletcher; F1 for Cúpula), with preset lots `LOTE_1`/`LOTE_2`
  - **Step 3**: Results display — shows computed extraction datetime, source activities, Fletcher/Cúpula SVG diagrams, and buttons to save plan, generate PDF, or print prescription

- **`components/PrescripcionMedica.jsx`** — A print-only prescription document rendered as a React component (A4 layout, shown via `window.print()`).

### Data Flow

```
FormularioPaciente (Step 2)
  → POST /procesar-plan  →  physics.get_decayed_activity()
  → resultado state (fecha_extraccion, asignacion)

FormularioPaciente (Step 3)
  → POST /planes         →  saves to SQLite
  → POST /generar-pdf    →  returns PDF blob
  → POST /procesar-eclipse  ←  user uploads Eclipse PDF, fills dosis_organos
```

### Important Details

- The frontend calls the backend at `http://localhost:8000` (hardcoded in `FormularioPaciente.jsx`).
- `asignacion_fuentes` and `dosis_organos` are stored as JSON strings in SQLite (`Text` columns).
- The `Medico` table stores both médicos and físicos; the `especialidad` field (`'medico'` | `'fisico'`) differentiates them.
- Date parsing in `physics.py` handles multiple formats from `<input type="datetime-local">` (T-separator, with/without seconds).
- The SVG diagrams (`EsquemaFletcherPDF`, `EsquemaCupulaPDF`) inside `FormularioPaciente.jsx` are inline and sized for A4 PDF rendering.
