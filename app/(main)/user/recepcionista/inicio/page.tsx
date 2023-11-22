'use client'
import React, { useState, useContext, useEffect, useRef } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";
import localfont from 'next/font/local';

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { classNames } from 'primereact/utils';
import { Column} from 'primereact/column';
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from 'primereact/datatable';
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from "primereact/sidebar";

import { LayoutContext } from '@/layout/context/layoutcontext';
import Acceso_Denegado from "../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";

import get_un_empleado from "../util/get_un_empleado_handler";
import get_un_consultorio from "../util/get_un_consultorio_handler";
import get_citas_consultorio from "../util/get_citas_consultorio_handler";
import put_cita from "../util/put_cita_handler";
import get_citas_pagadas from "../util/get_citas_pagadas_handler";
import put_empleado from "../util/put_empleado_handler";
import post_actualizar_usuario from "../util/post_actualizar_usuario_handler";
import get_consultorios from "../util/get_consultorio_handler";
import { RadioButton } from "primereact/radiobutton";
import { InputTextarea } from "primereact/inputtextarea";
import post_peticion from "../util/post_peticion_handler";

const shortStack = localfont({ src: "../../../../../fonts/ShortStack-Regular.ttf" });

const Inicio = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);
  const [denegado, setDenegado] = useState(false);
  const [displayCita, setDisplayCita] = useState(false);
  const [editarNombre, setEditarNombre] = useState(false);
  const [editarApellido, setEditarApellido] = useState(false);
  const [editarContraseña, setEditarContraseña] = useState(false);
  const [solicitarPeticion, setSolicitarPeticion] = useState(false);
  const [invNombre, setInvNombre] = useState(false);
  const [invApellido, setInvApellido] = useState(false);
  const [invEmail, setInvEmail] = useState(false);
  const [invRol, setInvRol] = useState(false);

  const [citas, setCitas] = useState<any[]>([]);
  const [consultorios, setConsultorios] = useState<any[]>([]);

  const [tipo, setTipo] = useState("Citas Pendientes");
  const [consultorioId, setConsultorioId] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [password, setPassword] = useState("");
  const [peti, setPeti] = useState("");
  const [descrip, setDescrip] = useState("");
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [apellidoNuevo, setApellidoNuevo] = useState("");
  const [emailNuevo, setEmailNuevo] = useState("");
  const [rolNuevo, setRolNuevo] = useState(""); 

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
    pagado: false,
    tipo_pago: ""
  });
  const [empleado, setEmpleado] = useState({
    id: "",
    consultorio_id: "",
    nombre: "",
    apellido: "",
    rol: "",
    email: "",
    fecha_creacion: "",
    fecha_actualizacion: "",
    estado: false
  });
  const [consultorio, setConsultorio] = useState({
    id: "",
    nombre: ""
  });
  const [consultorioCambio, setConsultorioCambio] = useState({
    id: "",
    nombre: ""
  });

  const opciones_tipo = ["Citas Pendientes", "Citas Cumplidas", "Citas Canceladas"/*, "Pagadas"*/];
  const opciones_peti = ["Cambio de Consultorio", "Crear Nuevo Empleado"];

  const { layoutConfig } = useContext(LayoutContext);
  const containerClassName = 
    classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', 
    { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  var token: any = {};

  useEffect(() => {
    try {
      token = jwt_decode(document.cookie.replace("token=", ""));
      setConsultorioId(token['custom:consultorio']);

      get_un_empleado(token['custom:empleado']).then(data => {
        setEmpleado(data);
        setNombre(data.nombre);
        setApellido(data.apellido);

        get_un_consultorio(data.consultorio_id).then(data => {
          setConsultorio(data);
          get_citas_consultorio(token['custom:consultorio'], 0).then(data => setCitas(data)).then(() => 
            get_consultorios().then(data => setConsultorios(data)).then(() => setLoading(false)));
        });
      });
    } catch (error) {
      setDenegado(true);
    }
  }, []);

  const ver_cita = (rowData: any) => {
    setCita(rowData.data);
    setDisplayCita(true);
  }

  const cargar_citas = (e: any) => {
    setLoadingTable(true);
    setTipo(e.target.value);

    if(e.target.value === "Citas Pendientes")
      get_citas_consultorio(consultorioId, 0).then(data => setCitas(data)).then(() => setLoadingTable(false));
    else if(e.target.value === "Citas Cumplidas")
      get_citas_consultorio(consultorioId, 1).then(data => setCitas(data)).then(() => setLoadingTable(false));
    else if(e.target.value === "Citas Canceladas")
      get_citas_consultorio(consultorioId, -1).then(data => setCitas(data)).then(() => setLoadingTable(false));
    /*else if(e.target.value === "Pagadas")
      get_citas_pagadas(consultorioId).then(data => setCitas(data)).then(() => setLoadingTable(false));*/
      
  }

  const cancelar_cita = () => {
    setLoading(true);
    put_cita(cita.id, {cita_estado: -1}).then(() => location.reload());
  }

  const pagar_cita = () => {
    setLoading(true);
    //router.push('/user/recepcionista/citas/pago?id=' + cita.id)
    const date = new Date();
    
    const cita_pagada = {
      pagado: true, 
      fecha_pago: date.toLocaleDateString().replace(", " + date.toLocaleTimeString(), "")
    }
    put_cita(cita.id, cita_pagada).then(() => location.reload());
  }

  const label_pagado = (rowData: any) => {
    return (rowData.pagado === true ? "Pagado" : "En espera");
  }

  const actualizar = () => {
    setLoading(true);

    const body = {
      nombre: nombre,
      apellido: apellido
    }

    put_empleado(empleado.id, body).then(() => location.reload());
  }

  const actualizar_contraseña = () => {
    setLoading(true);

    const body = {
      email: empleado.email,
      rol: "recep",
      password: password
    }

    post_actualizar_usuario(body).then(() => location.reload());
  }

  const enviar_peticion = () => {
    setLoading(true);

    var body = {};

    if(peti === "Cambio de Consultorio"){
      body = {consultorio_id: consultorioCambio.id}
    }else if(peti === "Crear Nuevo Empleado"){
      body = {
        nombre: nombreNuevo,
        apellido: apellidoNuevo,
        rol: rolNuevo,
        email: emailNuevo,
        consultorio_id: consultorio.id
      }
    }

    const peticion = {
      empleado_id: empleado.id,
      tipo: peti,
      cuerpo: body,
      descripcion: descrip,
      cumplida: false
    }

    post_peticion(peticion).then(() => location.reload())

    console.log(body);
  }

  const limpiar_peticion = () => {
    setSolicitarPeticion(false);
    setPeti("");
    setNombreNuevo("");
    setApellidoNuevo("");
    setRolNuevo("");
    setEmailNuevo("");
    setConsultorioCambio({
      id: "",
      nombre: ""
    });
  }

  return (denegado ? 
    <><Acceso_Denegado /></> : 
    <div style={{
      background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)'
    }}>
      {/*<Navbar tipo_usuario="" />*/}
      {loading ? 
      <div className={containerClassName}><ProgressSpinner /></div> :
      /*<div className="grid">
        <div className="col-12">
          <div className="card">
            <div className="p-fluid formgrid grid">
              <div className="field col-12 md:col-12">
                <div className="flex align-items-center justify-content-center">
                  <div className="surface-0">
                    <div className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap font-medium text-3xl text-900">
                      <div className="font-medium text-3xl text-900 w-6 md:w-10">Información de Empleado</div>
                    </div>
                    <ul className="list-none p-0 m-0 mb-3">
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-500 w-6 md:w-2 font-medium">Nombre</div>
                        <div className="text-900 md:w-8 md:flex-order-0 flex-order-1">
                          { empleado.nombre }
                        </div>
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-500 w-6 md:w-2 font-medium">Apellido</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                          { empleado.apellido }
                        </div>
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-500 w-6 md:w-2 font-medium">Email</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                          { empleado.email }
                        </div>
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                        <div className="text-500 w-6 md:w-2 font-medium">Consultorio</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                          { consultorio.nombre }
                        </div>
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                        <div className="text-500 w-6 md:w-2 font-medium">Creación y Actualización</div>
                        <div className="mr-5 flex align-items-center mt-3">
                          <i className="pi pi-calendar mr-2"></i>
                          <span>Fecha Creación: { new Date(empleado.fecha_creacion).toLocaleDateString() }</span>
                        </div>
                        <div className="mr-5 flex align-items-center mt-3">
                          <i className="pi pi-globe mr-2"></i>
                          <span>Última Actualización: { new Date(empleado.fecha_actualizacion).toLocaleDateString() }</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>*/
      <div className="grid" style={{
        background: 'rgba(51, 107, 134, 1)',
        height: '100vh'
        //height: window.innerHeight
      }}>
        <div className="col-12 md:col-5" style={shortStack.style}>
          <div className="card" style={{
            background: 'rgba(143, 175, 196, 1)',
            borderColor: 'rgba(143, 175, 196, 1)'
          }}>
            <div className="align-items-center justify-content-center">
              <div className="surface-0" style={{
                background: 'linear-gradient(180deg, rgba(143, 175, 196, 1) 10%, rgba(143, 175, 196, 1) 30%)'
              }}>
                <div className="font-medium text-3xl text-900 mb-3">Información de Empleado  </div>
                <ul className="list-none p-0 m-0 mb-3">
                  <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-700 w-6 md:w-4 font-medium">Nombre</div>
                    <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                      { editarNombre ? 
                      <InputText value={ nombre } 
                        onChange={(e) => setNombre(e.target.value)} 
                        style={{ 
                          borderRadius: '15px',
                          background: 'rgba(206, 159, 71, 1)',
                          borderColor: 'rgba(206, 159, 71, 1)',
                          color: 'rgba(41, 49, 51, 1)'
                        }}/> :
                      empleado.nombre }
                    </div>
                    { editarNombre ? 
                    <div className="w-6 md:w-2 flex justify-content-end">
                      <Button icon="pi pi-check" rounded text severity="success"
                        onClick={actualizar}/>
                      <Button icon="pi pi-times" rounded text severity="danger"
                        onClick={() => setEditarNombre(false)} />
                    </div> : 
                    <div className="w-6 md:w-2 flex justify-content-end">
                      <Button icon="pi pi-pencil" className="p-button-text" 
                        onClick={() => setEditarNombre(true)}/>
                    </div>}
                  </li>
                  <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-700 w-6 md:w-4 font-medium">Apellido</div>
                    <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                    { editarApellido ? 
                      <InputText value={ apellido } 
                        onChange={(e) => setApellido(e.target.value)} 
                        style={{ 
                          borderRadius: '15px',
                          background: 'rgba(206, 159, 71, 1)',
                          borderColor: 'rgba(206, 159, 71, 1)',
                          color: 'rgba(41, 49, 51, 1)'
                        }}/> :
                      empleado.apellido }
                    </div>
                    { editarApellido ? 
                    <div className="w-6 md:w-2 flex justify-content-end">
                      <Button icon="pi pi-check" rounded text severity="success"
                        onClick={actualizar}/>
                      <Button icon="pi pi-times" rounded text severity="danger"
                        onClick={() => setEditarApellido(false)} />
                    </div> : 
                    <div className="w-6 md:w-2 flex justify-content-end">
                      <Button icon="pi pi-pencil" className="p-button-text" 
                        onClick={() => setEditarApellido(true)}/>
                    </div>}
                  </li>
                  <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                    <div className="text-700 w-6 md:w-4 font-medium">Consultorio</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                      { consultorio.nombre }
                    </div>
                  </li>
                  <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-700 w-6 md:w-4 font-medium">Email</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                      { empleado.email }
                    </div>
                  </li>
                  { editarContraseña ? 
                  <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-700 w-6 md:w-4 font-medium">Contraseña Nueva</div>
                    <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                      <InputText value={ password } 
                        onChange={(e) => setPassword(e.target.value)} 
                        style={{ 
                          borderRadius: '15px',
                          background: 'rgba(206, 159, 71, 1)',
                          borderColor: 'rgba(206, 159, 71, 1)',
                          color: 'rgba(41, 49, 51, 1)'
                        }}/>
                    </div>
                    <div className="w-6 md:w-2 flex justify-content-end">
                      <Button icon="pi pi-check" rounded text severity="success"
                        onClick={actualizar_contraseña}/>
                      <Button icon="pi pi-times" rounded text severity="danger"
                        onClick={() => setEditarContraseña(false)} />
                    </div> 
                  </li> : 
                  <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="md:w-6 ">
                      <Button label="Cambiar Contraseña" onClick={() => setEditarContraseña(true)}
                      style={{ 
                        borderRadius: '20px',
                        background: 'rgba(51, 107, 134, 1)',
                        borderColor: 'rgba(51, 107, 134, 1)',
                        color: 'rgba(143, 175, 196, 1)'
                      }}/>
                    </div>
                    <div className="md:w-6 ">
                      <Button label="Realizar Petición" onClick={() => setSolicitarPeticion(true)}
                      style={{ 
                        borderRadius: '20px',
                        background: 'rgba(51, 107, 134, 1)',
                        borderColor: 'rgba(51, 107, 134, 1)',
                        color: 'rgba(143, 175, 196, 1)'
                      }}/>
                    </div>
                  </li>}
                  <Sidebar visible={solicitarPeticion} onHide={limpiar_peticion} baseZIndex={1000} fullScreen
                  style={{
                    background: 'rgba(51, 107, 134, 1)'
                  }}>
                    <div className="grid" style={shortStack.style}>
                      <div className="col-12">
                        <div className="card" style={{
                          background: 'rgba(143, 175, 196, 1)',
                          borderColor: 'rgba(143, 175, 196, 1)'
                        }}>
                          <h5>Solicitar Petición</h5>
                          <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                              <label>Tipo de Solicitud</label>
                              <Dropdown value={peti} options={opciones_peti}
                                onChange={(e) => setPeti(e.value)}
                                style={{ 
                                  borderRadius: '15px',
                                  background: 'rgba(206, 159, 71, 1)',
                                  borderColor: 'rgba(206, 159, 71, 1)',
                                  color: 'rgba(41, 49, 51, 1)'
                                }}/>
                            </div>
                            { peti === "Cambio de Consultorio" ?
                            <div className="field col-12 md:col-6">
                              <label>Consultorio</label>
                              <Dropdown value={consultorioCambio} options={consultorios} optionLabel="nombre"
                                onChange={(e) => setConsultorioCambio(e.value)}
                                style={{ 
                                  borderRadius: '15px',
                                  background: 'rgba(206, 159, 71, 1)',
                                  borderColor: 'rgba(206, 159, 71, 1)',
                                  color: 'rgba(41, 49, 51, 1)'
                                }}/>
                            </div> : 
                            peti === "Crear Nuevo Empleado" ?
                            <div className="field col-12 md:col-12">
                              <div className="grid">
                                <div className="col-12">
                                  <div className="card"
                                  style={{
                                    background: 'rgba(206, 159, 71, 1)',
                                    borderColor: 'rgba(206, 159, 71, 1)'
                                  }}>
                                    <h5>Crear Empleado</h5>
                                    <div className="p-fluid formgrid grid">
                                      <div className="field col-12 md:col-4">
                                        <label htmlFor="nombre">Nombre</label>
                                        <InputText id="nombre" type="text" value={nombreNuevo}
                                          onChange={(e) => {setNombreNuevo(e.target.value)}} 
                                          className={invNombre ? "p-invalid" : ""}
                                          style={{ 
                                            borderRadius: '15px',
                                            background: 'rgba(143, 175, 196, 1)',
                                            borderColor: 'rgba(143, 175, 196, 1)',
                                            color: 'rgba(41, 49, 51, 1)'
                                          }}/>
                                      </div>
                                      <div className="field col-12 md:col-4">
                                        <label htmlFor="apellido">Apellido</label>
                                        <InputText id="apellido" type="text" value={apellidoNuevo}
                                          onChange={(e) => {setApellidoNuevo(e.target.value)}} 
                                          className={invApellido ? "p-invalid" : ""}
                                          style={{ 
                                            borderRadius: '15px',
                                            background: 'rgba(143, 175, 196, 1)',
                                            borderColor: 'rgba(143, 175, 196, 1)',
                                            color: 'rgba(41, 49, 51, 1)'
                                          }}/>
                                      </div>
                                      <div className="field col-12 md:col-4">
                                        <label htmlFor="externo">Rol de Usuario:</label>
                                        <div className="col-12 md:col-3">
                                          <div className="field-radiobutton mb-1">
                                            <RadioButton inputId="med" name="option" value="Médico" 
                                              checked={rolNuevo === "Médico"} className={invRol ? "p-invalid" : ""}
                                              onChange={(e) => setRolNuevo(e.value)} />
                                            <label htmlFor="med">Médico</label>
                                          </div>
                                          <div className="field-radiobutton mb-1">
                                            <RadioButton inputId="rec" name="option" value="Recepcionista" 
                                              checked={rolNuevo === "Recepcionista"} className={invRol ? "p-invalid" : ""}
                                              onChange={(e) => setRolNuevo(e.value)} />
                                            <label htmlFor="rec">Recepcionista</label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field col-12 md:col-4">
                                        <label htmlFor="email">Email</label>
                                        <InputText id="email" type="email" value={emailNuevo}
                                          onChange={(e) => {setEmailNuevo(e.target.value)}} 
                                          className={invEmail ? "p-invalid" : ""}
                                          style={{ 
                                            borderRadius: '15px',
                                            background: 'rgba(143, 175, 196, 1)',
                                            borderColor: 'rgba(143, 175, 196, 1)',
                                            color: 'rgba(41, 49, 51, 1)'
                                          }}/>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div> : null}
                            <div className="field col-12 md:col-12">
                              <label>Descripción</label>
                              <InputTextarea value={descrip} onChange={(e) => setDescrip(e.target.value)} 
                                rows={5} cols={30} 
                                style={{ 
                                  borderRadius: '15px',
                                  background: 'rgba(206, 159, 71, 1)',
                                  borderColor: 'rgba(206, 159, 71, 1)',
                                  color: 'rgba(41, 49, 51, 1)'
                                }}></InputTextarea>
                            </div>
                            <div className="field col-12 md:col-12">
                              <Button onClick={enviar_peticion} className="justify-content-center"
                                disabled={peti === "" || 
                                (peti === "Cambio de Consultorio" && consultorioCambio.id === "") ||
                                (peti === "Crear Nuevo Empleado" && (nombreNuevo === "" || apellidoNuevo === "" 
                                || emailNuevo === "" || rolNuevo === ""))} 
                                style={{ 
                                  borderRadius: '20px',
                                  background: 'rgba(51, 107, 134, 1)',
                                  borderColor: 'rgba(51, 107, 134, 1)',
                                  color: 'rgba(143, 175, 196, 1)'
                                }}><p style={shortStack.style}>Enviar Petición</p></Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Sidebar>
                </ul>
              </div>
            </div>
          </div>
        </div> 
        <div className="col-12 md:col-7" style={shortStack.style}>
          <div className="card" style={{
            background: 'rgba(143, 175, 196, 1)',
            borderColor: 'rgba(143, 175, 196, 1)'
          }}>
            <div className="font-medium text-3xl text-900 mb-3">Información de Citas y Pagos  </div>
            <div className="p-fluid formgrid grid">
              <div className="field col-12 md:col-4">
                <Dropdown value={tipo} options={opciones_tipo}
                  onChange={(e) => cargar_citas(e)}
                  style={{ 
                    borderRadius: '15px',
                    background: 'rgba(206, 159, 71, 1)',
                    borderColor: 'rgba(206, 159, 71, 1)',
                    color: 'rgba(41, 49, 51, 1)'
                  }}/>
              </div>
            </div>
            <DataTable value={citas} paginator rows={5} emptyMessage="No tiene citas"
              selectionMode="single" onRowClick={ver_cita} loading={loadingTable} style={shortStack.style}>
              <Column field="nombre_paciente" header="Nombre de Paciente" style={{ minWidth: '12rem' }} />
              <Column field="fecha_cita" header="Fecha" style={{ minWidth: '12rem' }} />
              <Column field="hora_cita" header="Hora" style={{ minWidth: '12rem' }} />
              { tipo === "Cumplidas" ? 
              <Column field="pagado" header="Estado de Pago" style={{ minWidth: '12rem' }} 
                body={label_pagado}/> : null}
            </DataTable>
            <Dialog header={ cita.nombre_paciente + " " + cita.apellido_paciente } 
              onHide={() => setDisplayCita(false)} visible={displayCita} style={shortStack.style}>
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
                              { tipo === "Citas Cumplidas" ?
                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-4 font-medium">Tipo de Pago</div>
                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                  { cita.tipo_pago }
                                </div>
                              </li> : null}
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
                                  { tipo === "Citas Pendientes" ?
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
    </div>);
}

export default Inicio;