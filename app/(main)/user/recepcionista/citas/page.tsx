'use client'
import React, { useState, useContext, useEffect, useRef } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";

import { Button } from "primereact/button";
import { classNames } from 'primereact/utils';
import { Column} from 'primereact/column';
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';

import { LayoutContext } from '@/layout/context/layoutcontext';
import Acceso_Denegado from "../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";

import get_citas_consultorio from "../util/get_citas_consultorio_handler";
import put_cita from "../util/put_cita_handler";

const Ver_Citas = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);
  const [denegado, setDenegado] = useState(false);
  const [displayCita, setDisplayCita] = useState(false);

  const [citas, setCitas] = useState<any[]>([]);

  const [tipo, setTipo] = useState("Pendientes");
  const [consultorioId, setConsultorioId] = useState("");

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

  const opciones_tipo = ["Pendientes", "Cumplidas", "Canceladas"];

  const { layoutConfig } = useContext(LayoutContext);
  const containerClassName = 
    classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', 
    { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  var token: any = {};

  useEffect(() => {
    try {
      token = jwt_decode(document.cookie.replace("token=", ""));
      setConsultorioId(token['custom:consultorio']);
      get_citas_consultorio(token['custom:consultorio'], 0)
      .then(data => setCitas(data)).then(() => setLoading(false));
    } catch (error) {
      setDenegado(true);
    }
  },[]);

  const ver_cita = (rowData: any) => {
    setCita(rowData.data);
    setDisplayCita(true);
  }

  const cargar_citas = (e: any) => {
    setLoadingTable(true);
    setTipo(e.target.value);

    var cita_estado = 0;

    if(e.target.value === "Pendientes")
      cita_estado = 0;
    else if(e.target.value === "Cumplidas")
      cita_estado = 1;
    else if(e.target.value === "Canceladas")
      cita_estado = -1;

    get_citas_consultorio(consultorioId, cita_estado)
      .then(data => setCitas(data))
      .then(() => setLoadingTable(false));
  }

  const cancelar_cita = () => {
    setLoading(true);
    put_cita(cita.id, {cita_estado: -1}).then(() => location.reload());
  }

  const pagar_cita = () => {
    setLoading(true);
    //router.push('/user/recepcionista/citas/pago?id=' + cita.id)
    //put_cita(cita.id, {pagado: true}).then(() => location.reload());
  }

  return (denegado ? 
  <><Acceso_Denegado /></> : 
  <div>
    <Navbar tipo_usuario="recep"/>
    { loading ? 
    <div className={containerClassName}><ProgressSpinner /></div> :
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-2">
              <h5>Citas</h5>
            </div>
            <div className="field col-12 md:col-2">
              <Dropdown value={tipo} options={opciones_tipo}
                onChange={(e) => cargar_citas(e)}/>
            </div>
          </div>
          <DataTable value={citas} paginator rows={5} emptyMessage="No tiene citas"
            selectionMode="single" onRowClick={ver_cita} loading={loadingTable}>
            <Column field="nombre_paciente" header="Nombre de Paciente" style={{ minWidth: '12rem' }} />
            <Column field="fecha_cita" header="Fecha" style={{ minWidth: '12rem' }} />
            <Column field="hora_cita" header="Hora" style={{ minWidth: '12rem' }} />
          </DataTable>
          
          {/*<Button label="print" onClick={() => window.print()}/>*/}
          <Dialog header={ cita.nombre_paciente + " " + cita.apellido_paciente } 
            onHide={() => setDisplayCita(false)} visible={displayCita}>
            <div className="grid">
              <div className="col-12">
                <div className="card">
                  <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-12">
                      <div className="flex align-items-center justify-content-center">
                        <div className="surface-0">
                          <ul className="list-none p-0 m-0 mb-3">
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                              <div className="text-500 w-6 md:w-4 font-medium">Fecha</div>
                              <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                { cita.fecha_cita }
                              </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                              <div className="text-500 w-6 md:w-4 font-medium">Hora</div>
                              <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                { cita.hora_cita }
                              </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                              <div className="text-500 w-6 md:w-4 font-medium">Costo</div>
                              <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                { cita.costo } Bs.
                              </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                              <div className="text-500 w-6 md:w-4 font-medium">Pagado</div>
                              <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                { cita.pagado ? "Si" : "No" }
                              </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                              <div className="text-500 w-6 md:w-2 font-medium">Creación y Actualización</div>
                              <div className="mr-5 flex align-items-center mt-3">
                                <i className="pi pi-calendar mr-2"></i>
                                <span>Fecha Creación: { new Date(cita.fecha_creacion).toLocaleDateString() }</span>
                              </div>
                              <div className="mr-5 flex align-items-center mt-3">
                                <i className="pi pi-globe mr-2"></i>
                                <span>Última Actualización: { new Date(cita.fecha_actualizacion).toLocaleDateString() }</span>
                              </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                              <div className="md:w-12 md:flex-order-0 flex-order-1">
                                { tipo === "Pendientes" ?
                                <Button label="Cancelar Cita" onClick={cancelar_cita}/> :
                                  tipo === "Cumplidas" && cita.pagado !== true ?
                                <Button label="Pagar Cita" onClick={pagar_cita}/> :
                                  null}
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </div>}
  </div>)
}

export default Ver_Citas;