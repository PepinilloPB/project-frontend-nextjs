'use client'
import React, { useEffect, useState, useRef, useContext } from "react";
import { useRouter } from 'next/navigation';
import jwt_decode from "jwt-decode";
import localfont from 'next/font/local';

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { classNames } from 'primereact/utils';
import { Chip } from "primereact/chip";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Slider } from "primereact/slider";

import { LayoutContext } from '@/layout/context/layoutcontext';
import Acceso_Denegado from "../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";

import get_un_empleado from "../utils/get_un_empleado_handler";
import get_un_consultorio from "../../paciente/utils/get_consultorio_handler";
import put_empleado from "../utils/put_empleado_handler";
import post_actualizar_usuario from "../utils/post_actualizar_usuario_handler";
import get_consultorios from "../utils/get_consultorio_handler";

const shortStack = localfont({ src: "../../../../../fonts/ShortStack-Regular.ttf" });

const Ver_Empleado = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [denegado, setDenegado] = useState(false);
  const [editarNombre, setEditarNombre] = useState(false);
  const [editarApellido, setEditarApellido] = useState(false);
  const [editarConsultorio, setEditarConsultorio] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

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
  const [newConsultorio, setNewConsultorio] = useState({
    id: "",
    nombre: ""
  });

  const [consultorios, setConsultorios] = useState<any | null>([]);

  const { layoutConfig } = useContext(LayoutContext);
  const containerClassName = 
    classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', 
    { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  var token: any = {};

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') ?? "";

    try {
      token = jwt_decode(document.cookie.replace("token=", ""));
      get_un_empleado(id).then(data => {
        setEmpleado(data);
        setNombre(data.nombre);
        setApellido(data.apellido);

        get_un_consultorio(data.consultorio_id).then(data => {
          setConsultorio(data);
          setNewConsultorio(data);
        }).then(() => get_consultorios().then(data => setConsultorios(data)).then(() => setLoading(false)));
      });
    } catch (error) {
      setDenegado(true);
    }
  }, []); 

  const borrar = () => {
    setLoading(true);
    put_empleado(empleado.id, {estado: false}).then(() => {
      var body = {}

      if(empleado.rol === "Recepcionista"){
        body = {
          email: empleado.email,
          rol: "recep",
          borrar: true
        }
      }else if(empleado.rol === "Médico"){
        body = {
          email: empleado.email,
          rol: "medico",
          borrar: true
        }
      }
        
      post_actualizar_usuario(body).then(() => router.push('/user/admin/inicio'))
    });
  }

  const actualizar = () => {
    setLoading(true);

    const body = {
      nombre: nombre,
      apellido: apellido,
      consultorio_id: newConsultorio.id
    }

    put_empleado(empleado.id, body).then(() => {
      var body = {}
      
      if(empleado.rol === "Recepcionista"){
        body = {
          email: empleado.email,
          rol: "recep",
          consultorio: newConsultorio.id
        }
      }else if(empleado.rol === "Médico"){
        body = {
          email: empleado.email,
          rol: "medico",
          consultorio: newConsultorio.id
        }
      }
        
      post_actualizar_usuario(body).then(() => location.reload());
    });
  }

  return (denegado ? 
  <><Acceso_Denegado /></> : 
  <div style={{
    background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)',
    height: window.innerHeight
  }}>
    {/*<Navbar tipo_usuario="admin"/>*/}
    { loading ? 
      <div className={containerClassName}><ProgressSpinner /></div> :
      <div className="grid" style={{
        background: 'rgba(143, 175, 196, 1)',
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
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button icon="pi pi-times" severity="danger" className="p-button-text" 
                          onClick={borrar}/>
                      </div>
                    </div>
                    <ul className="list-none p-0 m-0 mb-3">
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-700 w-6 md:w-2 font-medium">Nombre</div>
                        <div className="text-900 md:w-8 md:flex-order-0 flex-order-1">
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
                          <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                            onClick={() => setEditarNombre(true)}
                            style={{ 
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
                          <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                            onClick={() => setEditarApellido(true)}
                            style={{ 
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
                        { editarConsultorio ? 
                          <Dropdown id="consultorio" value={newConsultorio} 
                            onChange={(e) => setNewConsultorio(e.value)} options={consultorios} 
                            optionLabel="nombre" style={{ 
                              borderRadius: '15px',
                              background: 'rgba(206, 159, 71, 1)',
                              borderColor: 'rgba(206, 159, 71, 1)',
                              color: 'rgba(41, 49, 51, 1)'
                            }}></Dropdown> :
                          consultorio.nombre }
                        </div>
                        { editarConsultorio ? 
                        <div className="w-6 md:w-2 flex justify-content-end">
                          <Button icon="pi pi-check" rounded text severity="success"
                            onClick={actualizar}/>
                          <Button icon="pi pi-times" rounded text severity="danger"
                            onClick={() => {
                              setEditarConsultorio(false);
                              setNewConsultorio(consultorio);
                            }} />
                        </div> : 
                        <div className="w-6 md:w-2 flex justify-content-end">
                          <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                            onClick={() => setEditarConsultorio(true)} 
                            style={{ 
                              borderRadius: '20px',
                              background: 'rgba(51, 107, 134, 1)',
                              borderColor: 'rgba(51, 107, 134, 1)',
                              color: 'rgba(143, 175, 196, 1)'
                            }}/>
                        </div>}
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-700 w-6 md:w-2 font-medium">Email</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                          { empleado.email }
                        </div>
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                        <div className="text-700 w-6 md:w-2 font-medium">Rol de Usuario</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                          { empleado.rol }
                        </div>
                      </li>
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
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  </div>);
}

export default Ver_Empleado;