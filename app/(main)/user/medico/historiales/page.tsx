'use client'
import React, { useState, useContext, useEffect, useRef } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";
import localfont from 'next/font/local';

import { classNames } from 'primereact/utils';
import { ProgressSpinner } from 'primereact/progressspinner';

import { LayoutContext } from '@/layout/context/layoutcontext';
import Acceso_Denegado from "../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import get_historial_busqueda from "../util/get_historial_busqueda_handler";
import { Column } from "primereact/column";
import Navbar_Medico from "../navbar";

const shortStack = localfont({ src: "../../../../../fonts/ShortStack-Regular.ttf" });

const Buscar_Historiales = () => {
  const router = useRouter();

  const [denegado, setDenegado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displayTabla, setDisplayTable] = useState(false);
  const [loadingTabla, setLoadingTabla] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [valor, setValor] = useState("");

  const [resultados, setResultados] = useState<any>([]);

  const opciones_busqueda = ["Nombre", "Apellido", "Código"];

  const { layoutConfig } = useContext(LayoutContext);
  const containerClassName = 
    classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', 
    { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  var token: any = {};

  useEffect(() => {
    try {
      token = jwt_decode(document.cookie.replace("token=", ""));
      setLoading(false);
    } catch (error) {
      setDenegado(true);
    }
  }, []);


  const buscar = () => {
    setDisplayTable(true);
    setLoadingTabla(true);

    const query = busqueda.toLocaleLowerCase().replace("ó", "o") + "=" + valor.replace(" ", "_");

    get_historial_busqueda(query).then(data => setResultados(data)).then(() => setLoadingTabla(false));
  }

  const ver_historial = (rowData: any) => {
    setLoading(true);
    router.push('/user/medico/historial?id=' + rowData.data.id);
  }

  return (denegado ? 
  <><Acceso_Denegado /></> : 
  <div style={{
    background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)'
  }}>
    {/*<Navbar tipo_usuario="medico" />*/}
    <Navbar_Medico />
    { loading ? 
    <div className={containerClassName}><ProgressSpinner /></div> :
    <div className="grid" style={{
      background: 'rgba(143, 175, 196, 1)',
      height: '100vh'
      //height: window.innerHeight
    }}>
      <div className="col-12" style={shortStack.style}>
        <div className="card" style={{
          background: 'rgba(143, 175, 196, 1)',
          borderColor: 'rgba(143, 175, 196, 1)'
        }}>
          <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-4">
              <label htmlFor="externo">Buscar por:</label>
              <Dropdown value={busqueda} options={opciones_busqueda} 
                onChange={(e) => setBusqueda(e.value)} style={{ 
                  borderRadius: '15px',
                  background: 'rgba(206, 159, 71, 1)',
                  borderColor: 'rgba(206, 159, 71, 1)',
                  color: 'rgba(41, 49, 51, 1)'
                }}></Dropdown >
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="externo">
                { busqueda === "" ? 
                "Seleccione una opción de búsqueda" :
                "Ingrese " +  busqueda.toLocaleLowerCase()  + " para la búsqueda" }
              </label>
              <div className="p-inputgroup">
                <InputText placeholder="Buscar" disabled={busqueda === ""}
                  onChange={(e) => setValor(e.target.value)}style={{ 
                    borderTopLeftRadius: '15px',
                    borderBottomLeftRadius: '15px',
                    background: 'rgba(206, 159, 71, 1)',
                    borderColor: 'rgba(206, 159, 71, 1)',
                    color: 'rgba(41, 49, 51, 1)'
                  }}/>
                <Button icon="pi pi-search" disabled={busqueda === "" || valor === ""}
                  onClick={buscar} style={{ 
                    background: 'rgba(51, 107, 134, 1)',
                    borderColor: 'rgba(51, 107, 134, 1)',
                    color: 'rgba(143, 175, 196, 1)'
                  }}/>
              </div>
            </div>
            { displayTabla ?  
            <div className="field col-12 md:col-12">
              { loadingTabla ? 
              <div className={containerClassName}><ProgressSpinner /></div>: 
              <DataTable value={resultados} paginator rows={10} selectionMode="single"
                onRowClick={ver_historial} style={shortStack.style} pt={{
                  wrapper: {
                    style: {
                      borderTopLeftRadius: '15px',
                      borderTopRightRadius: '15px'
                    }
                  }
                }}>
                <Column header="Nombre" field="nombre" pt={{
                    headerCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(51, 107, 134, 1) 10%, rgba(51, 107, 134, 1) 30%)',
                        borderColor: 'rgba(51, 107, 134, 1)',
                      }
                    },
                    bodyCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)',
                        borderColor: 'rgba(206, 159, 71, 1)',
                      }
                    },
                  }}></Column>
                <Column header="Apellido" field="apellido" pt={{
                    headerCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(51, 107, 134, 1) 10%, rgba(51, 107, 134, 1) 30%)',
                        borderColor: 'rgba(51, 107, 134, 1)',
                      }
                    },
                    bodyCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)',
                        borderColor: 'rgba(206, 159, 71, 1)',
                      }
                    },
                  }}></Column>
                <Column header="Código" field="codigo" pt={{
                    headerCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(51, 107, 134, 1) 10%, rgba(51, 107, 134, 1) 30%)',
                        borderColor: 'rgba(51, 107, 134, 1)',
                      }
                    },
                    bodyCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)',
                        borderColor: 'rgba(206, 159, 71, 1)',
                      }
                    },
                  }}></Column>
              </DataTable>}
            </div> : null}
          </div>
        </div>
      </div>
    </div>}
  </div>);
}

export default Buscar_Historiales;