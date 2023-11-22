'use client'
import React, { useState, useContext, useEffect, useRef } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";

import { classNames } from 'primereact/utils';
import { ProgressSpinner } from 'primereact/progressspinner';

import { LayoutContext } from '@/layout/context/layoutcontext';
import Acceso_Denegado from "../../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";
import get_una_cita from "../../util/get_una_cita_handler";

const Pago = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [denegado, setDenegado] = useState(false);

  const [id, setId] = useState("");

  const [cita, setCita] = useState({
    id: "",
    historial_id: "",
    nombre_paciente: "",
    apellido_paciente: "",
    cita_estado: 0, 
    fecha_cita: "",
    hora_cita: "",
    num_ficha: 0,
    externa: false,
    motivos_consulta: "",
    examen_fisico: "",
    diagnostico: "",
    tratamiento: "",
    fecha_creacion: "",
    fecha_actualizacion: "",
    costo: 0,
    pagado: false
  });

  const { layoutConfig } = useContext(LayoutContext);
  const containerClassName = 
    classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', 
    { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  var token: any = {};

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setId(params.get('id') ?? "");

    try {
      token = jwt_decode(document.cookie.replace("token=", ""));
      get_una_cita(id).then(data => setCita(data)).then(() => setLoading(false));
    } catch (error) {
      setDenegado(true);
    }
  }, []);

  return (denegado ? 
    <><Acceso_Denegado /></> : 
    <div>
      {/*<Navbar tipo_usuario="recep" />*/}
      { loading ? 
      <div className={containerClassName}><ProgressSpinner /></div> :
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <div className="p-fluid formgrid grid">
              <div className="field col-12 md:col-12">
                <div className="flex align-items-center py-3 px-2 border-top-1 border-300">
                  <div className="font-medium text-2xl text-900 w-6 md:w-10">Información para Pago</div>
                </div>
                <ul className="list-none p-0 m-0 mb-3"></ul>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </div>);
}

export default Pago;