'use client'
import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import jwt_decode from "jwt-decode";

import Acceso_Denegado from "../../acceso_denegado";

import { Button } from "primereact/button";
import { BlockUI } from "primereact/blockui";
import { Calendar } from "primereact/calendar";
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';

import { LayoutContext } from '@/layout/context/layoutcontext';
import Navbar from "@/app/(project)/components/navbar/page";
import get_un_empleado from "../../utils/get_un_empleado_handler";

const Empleado = () => {
  const [denegado, setDenegado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editar, setEditar] = useState(false);
  const [displayCancelar, setDisplayCancelar] = useState(false);

  const [empleado, setEmpleado] = useState({
    id: "",
    nombre: "",
    apellido: "",
    rol: "",
    email: "",
    fecha_creacion: "",
    fecha_actualizacion: "",
    estado: false
  });

  const toast = useRef<Toast>(null);

  const { layoutConfig } = useContext(LayoutContext);

  const router = useRouter();
  const containerClassName = classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  var token: any = {};

  useEffect(() => {
    try {
      token = jwt_decode(document.cookie.replace("token=", ""));
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id') ?? "";

      if(id !== ""){
        get_un_empleado(id).then(data => {
          setEmpleado(data);
          setLoading(false);
        });
      }
    } catch (error) {
      setDenegado(true);
    }
  }, []);

  const edicion = () => {}

  const actualizar_empleado = () => {}

  const eliminar_empleado = () => {}

  const confirmationDialogFooter = (
    <>
      <Button type="button" label="Si" icon="pi pi-check" 
        onClick={eliminar_empleado} text />
      <Button type="button" label="No" icon="pi pi-times" 
        onClick={() => setDisplayCancelar(false)} text autoFocus />
    </>
  );
  
  return (denegado ? <><Acceso_Denegado /></> : 
  <div>
    <Navbar tipo_usuario="admin" inicio="admin" />
    { loading === true ? 
    (<div className={containerClassName}><ProgressSpinner /></div>) :
    (<div className="grid">
      <div className="col-12">
        <div className="card">
          <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-12">
              <div className="flex align-items-center justify-content-center">
                <div className="surface-0">
                  <div className="font-medium text-3xl text-900 mb-3">
                    Información de Empleado
                  </div>
                  <ul className="list-none p-0 m-0 mb-3">
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">Nombre</div>
                      <div className="text-900 md:w-8 md:flex-order-0 flex-order-1">
                        { empleado.nombre }
                      </div>
                      {/*<div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-text" />
                      </div>*/}
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">Apellido</div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        { empleado.apellido }
                      </div>
                      {/*<div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-text" />
                      </div>*/}
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">Email</div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        { empleado.email }
                      </div>
                      {/*<div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-text" />
                      </div>*/}
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">Rol de Usuario</div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                        { empleado.rol }
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
    </div>)}
  </div>)
}

export default Empleado