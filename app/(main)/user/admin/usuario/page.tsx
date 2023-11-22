'use client'
import React, { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import jwt_decode from "jwt-decode";

import { Column} from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Toast } from 'primereact/toast';

import Acceso_Denegado from "../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";

import get_empleados_consultorio from "../utils/get_empleados_consultorio_handler";
import get_un_empleado from "../utils/get_un_empleado_handler";

const Listar_Usuarios = () => {
  const toast = useRef<Toast>(null);

  const [filtros, setFiltros] = useState<DataTableFilterMeta>({});
  const [denegado, setDenegado] = useState(false);
  const [loading, setLoading] = useState(true);

  const [empleados, setEmpleados] = useState([]);

  const initFilters = () => {
    setFiltros({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      nombre: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      apellido: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      rol: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      }
    });
  };

  var token: any = {};

  try {
    token = jwt_decode(document.cookie.replace("token=", ""));

    useEffect(() => {
      initFilters();
      get_empleados_consultorio(token['custom:consultorio']).then(data => {
        setEmpleados(data);
        setLoading(false);
      })
    }, [])
  } catch (error) {
    useEffect(() => setDenegado(true), []);
  }

  const ver_mas = (rowData: any) => {
    return <Link href={ "/user/admin/usuario/empleado?id=" + rowData.id} 
              onClick={() => setLoading(true)}>Ver Más</Link>;
  }

  return (denegado ? 
  <><Acceso_Denegado /></> : 
  <div>
    <Navbar tipo_usuario="admin" inicio="admin"/>
    <DataTable
      value={empleados}
      paginator
      className="p-datatable-gridlines"
      showGridlines
      rows={10}
      dataKey="id"
      filters={filtros}
      filterDisplay="menu"
      loading={loading}
      responsiveLayout="scroll"
      emptyMessage="No tiene citas">
      <Column field="nombre" header="Nombres" filter 
        filterPlaceholder="Buscar por nombre" style={{ minWidth: '12rem' }} />
      <Column field="apellido" header="Apellidos" filter 
        filterPlaceholder="Buscar por apellido" style={{ minWidth: '12rem' }} />
      <Column field="rol" header="Rol de Usuario" filter 
        filterPlaceholder="Buscar por rol" style={{ minWidth: '12rem' }} />
      <Column field="id" header="" body={ver_mas} style={{ minWidth: '12rem' }} />
    </DataTable>
  </div>)
}

export default Listar_Usuarios;