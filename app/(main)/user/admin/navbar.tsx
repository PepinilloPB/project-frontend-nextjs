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

interface props {
   tipo_usuario : { tipo_usuario : string | undefined };
}

const Navbar_Admin = () => {
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
      <Link href="/user/admin/inicio" 
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
            <a href="/user/admin/empleado/nuevo" className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
              <span style={shortStack.style}>Crear Empleado</span>
              <Ripple />
            </a>
          </li>
          <li>
            <a href="/user/admin/consultorio/nuevo" className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
              <span style={shortStack.style}>Crear Consultorio</span>
              <Ripple />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar_Admin;
