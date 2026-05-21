"""
database.py — SQLite con SQLAlchemy
Tablas:
  - medicos:   id, nombre, apellido, especialidad ('medico' | 'fisico')
  - pacientes: id, nombre, id, historia_clinica, diagnostico, fecha_creacion
  - planes:    id, paciente_id, medico_id, fisico_id, ...
"""
from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime
import os

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./braquiapp.db")

_connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=_connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base         = declarative_base()


class Medico(Base):
    __tablename__ = "medicos"
    id            = Column(Integer, primary_key=True, index=True)
    nombre        = Column(String, nullable=False)
    apellido      = Column(String, nullable=False)
    especialidad  = Column(String, nullable=False)   # 'medico' | 'fisico'
    planes        = relationship("Plan", back_populates="medico",  foreign_keys="Plan.medico_id")
    planes_fisico = relationship("Plan", back_populates="fisico",  foreign_keys="Plan.fisico_id")


class Paciente(Base):
    __tablename__ = "pacientes"
    id               = Column(Integer, primary_key=True, index=True)
    nombre           = Column(String, nullable=False)
    dni              = Column(String, nullable=False, unique=True, index=True)
    historia_clinica = Column(String, nullable=False, unique=True, index=True)
    diagnostico      = Column(String, default="")
    fecha_creacion   = Column(DateTime, default=datetime.utcnow)
    planes           = relationship("Plan", back_populates="paciente")


class Plan(Base):
    __tablename__ = "planes"
    id                 = Column(Integer, primary_key=True, index=True)
    paciente_id        = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    medico_id          = Column(Integer, ForeignKey("medicos.id"),   nullable=False)
    fisico_id          = Column(Integer, ForeignKey("medicos.id"),   nullable=False)
    fecha_colocacion   = Column(String, nullable=False)
    tiempo_horas       = Column(Float,  nullable=False)
    dosis_prescripta   = Column(Float,  nullable=False)
    aplicador          = Column(String, nullable=False)
    fecha_extraccion   = Column(String, default="")
    asignacion_fuentes = Column(Text,   default="{}")
    dosis_organos      = Column(Text,   default="{}")
    fecha_creacion     = Column(DateTime, default=datetime.utcnow)
    paciente = relationship("Paciente", back_populates="planes")
    medico   = relationship("Medico", back_populates="planes",        foreign_keys=[medico_id])
    fisico   = relationship("Medico", back_populates="planes_fisico", foreign_keys=[fisico_id])


def init_db():
    """Crea tablas y carga profesionales si la DB está vacía."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Medico).count() == 0:
            profesionales = [
                Medico(nombre="Darío",     apellido="Llanos",   especialidad="medico"),
                Medico(nombre="Ignacio",   apellido="Abregu",   especialidad="medico"),
                Medico(nombre="José Luis", apellido="Castilla", especialidad="medico"),
                Medico(nombre="Marcelo",   apellido="Guzmán",   especialidad="medico"),
                Medico(nombre="Jorge",     apellido="Escobar",  especialidad="fisico"),
                Medico(nombre="Mauricio",  apellido="Franco",   especialidad="fisico"),
            ]
            db.add_all(profesionales)
            db.commit()
    finally:
        db.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()