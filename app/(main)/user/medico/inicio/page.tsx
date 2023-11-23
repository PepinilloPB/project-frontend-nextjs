'use client'
import React, { useState, useContext, useEffect, useRef } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";
import localfont from 'next/font/local';

import { Button } from "primereact/button";
import { classNames } from 'primereact/utils';
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from 'primereact/progressspinner';

import { LayoutContext } from '@/layout/context/layoutcontext';
import Acceso_Denegado from "../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";

import get_un_empleado from "../util/get_un_empleado_handler";
import get_un_consultorio from "../util/get_un_consultorio_handler";
import put_empleado from "../util/put_empleado_handler";
import post_actualizar_usuario from "../util/post_actualizar_usuario_handler";
import { Sidebar } from "primereact/sidebar";
import { Dropdown } from "primereact/dropdown";
import get_consultorios from "../util/get_consultorio_handler";
import { InputTextarea } from "primereact/inputtextarea";
import post_peticion from "../util/post_peticion_handler";
import Navbar_Medico from "../navbar";

const shortStack = localfont({ src: "../../../../../fonts/ShortStack-Regular.ttf" });

const Inicio = () => {
  const router = useRouter();

  const [denegado, setDenegado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editarNombre, setEditarNombre] = useState(false);
  const [editarApellido, setEditarApellido] = useState(false);
  const [editarContraseña, setEditarContraseña] = useState(false);
  const [solicitarPeticion, setSolicitarPeticion] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [password, setPassword] = useState("");
  const [descrip, setDescrip] = useState("");
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [apellidoNuevo, setApellidoNuevo] = useState("");
  const [emailNuevo, setEmailNuevo] = useState("");
  const [rolNuevo, setRolNuevo] = useState(""); 

  const [consultorios, setConsultorios] = useState<any[]>([]);

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

  const { layoutConfig } = useContext(LayoutContext);
  const containerClassName = 
    classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', 
    { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  var token: any = {};

  useEffect(() => {
    try {
      token = jwt_decode(document.cookie.replace("token=", ""));
      get_un_empleado(token['custom:empleado']).then(data => {
        setEmpleado(data);
        setNombre(data.nombre);
        setApellido(data.apellido);
        
        get_un_consultorio(data.consultorio_id).then(data => {
          setConsultorio(data);
          get_consultorios().then(data => setConsultorios(data)).then(() => setLoading(false))
        });
      });
    } catch (error) {
      setDenegado(true);
    }
  }, []);

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
      rol: "medico",
      password: password
    }

    post_actualizar_usuario(body).then(() => location.reload());
  }

  const limpiar_peticion = () => {
    setSolicitarPeticion(false);
    setNombreNuevo("");
    setApellidoNuevo("");
    setRolNuevo("");
    setEmailNuevo("");
    setConsultorioCambio({
      id: "",
      nombre: ""
    });
  }

  const enviar_peticion = () => {
    setLoading(true);

    var body = {consultorio_id: consultorioCambio.id}

    const peticion = {
      empleado_id: empleado.id,
      tipo: "Cambio de Consultorio",
      cuerpo: body,
      descripcion: descrip,
      cumplida: false
    }

    post_peticion(peticion).then(() => location.reload())

    console.log(body);
  }

  return (denegado ? 
  <><Acceso_Denegado /></> : 
  <div style={{
    background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)',
    //height: window.innerHeight
  }}>
    {/*<Navbar tipo_usuario="medico" />*/}
    <Navbar_Medico />
    {loading ? 
    <div className={containerClassName}><ProgressSpinner /></div> :
    <div className="grid" style={{
      background: 'rgba(143, 175, 196, 1)',
      height: '100%'
    }}>
      <div className="col-12">
        <div className="card" style={{
          background: 'rgba(143, 175, 196, 1)',
          borderColor: 'rgba(143, 175, 196, 1)'
        }}>
          <div className="p-fluid formgrid grid" style={shortStack.style}>
            <div className="field col-12 md:col-12">
              <div className="flex align-items-center justify-content-center">
                <div className="surface-0" style={{
                  background: 'linear-gradient(180deg, rgba(143, 175, 196, 1) 10%, rgba(143, 175, 196, 1) 30%)'
                }}>
                  <div className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap font-medium text-3xl text-900">
                    <div className="font-medium text-3xl text-900 w-6 md:w-10">Información de Empleado</div>
                  </div>
                  <ul className="list-none p-0 m-0 mb-3">
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-2 font-medium">Nombre</div>
                      <div className="text-900 md:w-8 md:flex-order-0 flex-order-1">
                        { editarNombre ? 
                        <InputText value={ nombre } 
                          onChange={(e) => setNombre(e.target.value)} style={{ 
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
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                          onClick={() => setEditarNombre(true)} style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}/>
                      </div>}
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-2 font-medium">Apellido</div>
                      <div className="text-900 md:w-8 md:flex-order-0 flex-order-1">
                      { editarApellido ? 
                        <InputText value={ apellido } 
                          onChange={(e) => setApellido(e.target.value)} style={{ 
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
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                          onClick={() => setEditarApellido(true)} style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}/>
                      </div>}
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-2 font-medium">Consultorio</div>
                      <div className="text-900 md:w-8 md:flex-order-0 flex-order-1">
                        { consultorio.nombre }
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-2 font-medium">Email</div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        { empleado.email }
                      </div>
                    </li>
                    { editarContraseña ? 
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-4 font-medium">Contraseña Nueva</div>
                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                        <InputText value={ password } 
                          onChange={(e) => setPassword(e.target.value)} style={{ 
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
                      <div className="md:w-5 mr-8 md:flex-order-0 flex-order-1">
                        <Button label="Cambiar Contraseña" onClick={() => setEditarContraseña(true)} style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}/>
                      </div>
                      <div className="md:w-5 md:flex-order-0 flex-order-1">
                        <Button label="Pedir Cambio de Consultorio" onClick={() => setSolicitarPeticion(true)} style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}/>
                      </div>
                    </li>}
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-2 font-medium">Creación y Actualización</div>
                      <div className="mr-5 flex align-items-center mt-3">
                        <i className="pi pi-calendar mr-2"></i>
                        <span>Fecha Creación: { new Date(empleado.fecha_creacion).toLocaleDateString() }</span>
                      </div>
                      <div className="mr-5 flex align-items-center mt-3">
                        <i className="pi pi-globe mr-2"></i>
                        <span>Última Actualización: { new Date(empleado.fecha_actualizacion).toLocaleDateString() }</span>
                      </div>
                    </li>
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
                              <label>Consultorio</label>
                              <Dropdown value={consultorioCambio} options={consultorios} optionLabel="nombre"
                                onChange={(e) => setConsultorioCambio(e.value)} style={{ 
                                  borderRadius: '15px',
                                  background: 'rgba(206, 159, 71, 1)',
                                  borderColor: 'rgba(206, 159, 71, 1)',
                                  color: 'rgba(41, 49, 51, 1)'
                                }}/>
                            </div> 
                            <div className="field col-12 md:col-12">
                              <label>Descripción</label>
                              <InputTextarea value={descrip} onChange={(e) => setDescrip(e.target.value)} 
                                rows={5} cols={30} style={{ 
                                  borderRadius: '15px',
                                  background: 'rgba(206, 159, 71, 1)',
                                  borderColor: 'rgba(206, 159, 71, 1)',
                                  color: 'rgba(41, 49, 51, 1)'
                                }}></InputTextarea>
                            </div>
                            <div className="field col-12 md:col-12">
                              <Button label="Enviar Petición" onClick={enviar_peticion} 
                                disabled={consultorioCambio.id === ""} style={{ 
                                  borderRadius: '20px',
                                  background: 'rgba(51, 107, 134, 1)',
                                  borderColor: 'rgba(51, 107, 134, 1)',
                                  color: 'rgba(143, 175, 196, 1)'
                                }}></Button>
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
        </div>
      </div>
    </div>}
  </div>);
}

export default Inicio;