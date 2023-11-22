/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useContext, useRef, useState } from 'react';
import Link from 'next/link';
import localfont from 'next/font/local';

import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Ripple } from 'primereact/ripple';
import { StyleClass } from 'primereact/styleclass';

import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { NodeRef } from '../../../../types/types';
import { useRouter } from 'next/navigation';

import get_consultorio_nombre from '@/app/(main)/user/paciente/utils/get_consultorio_nombre_handler';

const shortStack = localfont({ src: "../../../../fonts/ShortStack-Regular.ttf" });

type ButtonEvent = React.MouseEvent<HTMLButtonElement>;

const Navbar = ({ tipo_usuario } : { tipo_usuario : any }) => {
  const [isHidden, setIsHidden] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [consultorios, setConsultorios] = useState([]);

  const { layoutConfig } = useContext(LayoutContext);

  const menuRef = useRef<HTMLElement | null>(null);
  const panel = useRef<OverlayPanel>(null);

  const router = useRouter();

  const toggleBusqueda = (event: ButtonEvent) => {
    panel.current?.toggle(event);

    get_consultorio_nombre(busqueda)
    .then(data => {
      setConsultorios(data);
      setLoading(false);
    });
  };

  const solicitar_cita = (rowData: any) => {
    setLoading(true);
    router.push('/user/paciente/citas/nueva?id=' + rowData.data.id);
    setLoading(false);
  }

  return (
    <div className="py-4 px-4 mx-0 md:mx-6 lg:px-8 flex align-items-center justify-content-between relative lg:static"
    style={{
      background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)'
    }}>
      <Link href={tipo_usuario.includes("paciente") ? "/user/paciente/inicio" : 
                  tipo_usuario.includes("admin") ? "/user/admin/inicio" : 
                  tipo_usuario.includes("medico") ? "/user/medico/inicio" : 
                  tipo_usuario.includes("recep") ? "/user/recepcionista/inicio" : ""} 
        className="flex align-items-center">
        <img src={`/layout/images/logo.svg`} alt="Sakai Logo" height="50" className="mr-0 lg:mr-2" />
        <span className="text-900 font-medium text-2xl line-height-3 mr-8" style={shortStack.style}>MEDNOW</span>
      </Link>
      <StyleClass nodeRef={menuRef as NodeRef} selector="@next" enterClassName="hidden" leaveToClassName="hidden" hideOnOutsideClick>
        <i ref={menuRef} className="pi pi-bars text-4xl cursor-pointer block lg:hidden text-700"></i>
      </StyleClass>
      <div className={
        classNames('align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2', { hidden: isHidden })} 
        style={{ 
          top: '100%', 
          background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)' 
        }}>
        <ul className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
          <li>
            { tipo_usuario.includes("paciente") ? 
            (<a href="/user/paciente/citas/pendientes" className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
              <span style={shortStack.style}>Citas Pendientes</span>
              <Ripple />
            </a>) : tipo_usuario.includes("admin") ? 
            (<a href="/user/admin/empleado/nuevo" className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
              <span style={shortStack.style}>Crear Empleado</span>
              <Ripple />
            </a>) : tipo_usuario.includes("medico") ?
            (<a href="/user/medico/historiales" className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
              <span style={shortStack.style}>Buscar Historial</span>
              <Ripple />
            </a>) : tipo_usuario.includes("recep") ?
            (<a href="/user/recepcionista/citas" className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
              <span style={shortStack.style}>Ver Citas</span>
              <Ripple />
            </a>) : null}
          </li>
          <li>
            { tipo_usuario.includes("paciente") ? 
            (<a href="/user/paciente/citas/nueva" className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
              <span style={shortStack.style}>Solicitar Citas</span>
              <Ripple />
            </a>) : tipo_usuario.includes("admin") ? 
            (<a href="/user/admin/consultorio/nuevo" className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
              <span style={shortStack.style}>Crear Consultorio</span>
              <Ripple />
            </a>) : tipo_usuario.includes("medico") ?
            (<a href="/user/medico/historial/nuevo" className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
              <span style={shortStack.style}>Crear Historial</span>
              <Ripple />
            </a>) : tipo_usuario.includes("recep") ?
            (<a href="/user/recepcionista/pagos" className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
              <span style={shortStack.style}>Ver Pagos</span>
              <Ripple />
            </a>) : null}
          </li>
          <li>
            { tipo_usuario.includes("paciente") ? 
            (<a href="/user/paciente/antecedentes" className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
              <span style={shortStack.style}>Antecedentes</span>
              <Ripple />
            </a>) : tipo_usuario.includes("medico") ?
            (<a href="/user/medico/citas" className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
              <span style={shortStack.style}>Ver Citas</span>
              <Ripple />
            </a>) : null}
          </li>
        </ul>
        {tipo_usuario.includes("paciente") ? 
        <div className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
          <span className="p-input-icon-right">
            <i className="pi pi-search" /*onClick={() => console.log(busqueda)}*/ 
              onClick={toggleBusqueda} />
            <InputText type="text" placeholder="Buscar"
              onChange={(e) => setBusqueda(e.target.value)}/>
            <OverlayPanel ref={panel} appendTo={typeof window !== 'undefined' ? document.body : null} 
              showCloseIcon id="overlay_panel" style={{ width: '450px' }}>
              <DataTable value={consultorios} loading={loading}
                selectionMode="single" responsiveLayout="scroll" paginator rows={5} 
                onRowSelect={solicitar_cita}>
                <Column field='nombre' header="Nombre" style={{ minWidth: '12rem' }}></Column>
                <Column field='especializacion' header="Especialidad" style={{ minWidth: '12rem' }}></Column>
              </DataTable>
            </OverlayPanel>
          </span>
        </div> : null}
      </div>
    </div>
  );
}

export default Navbar;
