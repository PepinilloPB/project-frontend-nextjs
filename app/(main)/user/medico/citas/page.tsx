'use client'
import React, { useState, useContext, useEffect, useRef } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";
import localfont from 'next/font/local';

import { classNames } from 'primereact/utils';
import { Column} from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';

import { LayoutContext } from '@/layout/context/layoutcontext';
import Acceso_Denegado from "../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";

import get_citas_consultorio from "../util/get_citas_consultorio_handler";
import Navbar_Medico from "../navbar";

const shortStack = localfont({ src: "../../../../../fonts/ShortStack-Regular.ttf" });

const Ver_Citas = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [denegado, setDenegado] = useState(false);

  const [citas, setCitas] = useState<any[]>([]);

  const { layoutConfig } = useContext(LayoutContext);
  const containerClassName = 
    classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', 
    { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  var token: any = {};

  useEffect(() => {
    try {
      token = jwt_decode(document.cookie.replace("token=", ""));
      get_citas_consultorio(token['custom:consultorio'])
      .then(data => setCitas(data)).then(() => setLoading(false));
    } catch (error) {
      setDenegado(true);
    }
  },[]);

  const ver_cita = (rowData: any) => {
    setLoading(true);
    router.push('/user/medico/historial/diagnostico?id=' + rowData.data.id);
  }

  return (denegado ? 
  <><Acceso_Denegado /></> : 
  <div style={{
    background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)'
  }}>
    {/*<Navbar tipo_usuario="medico"/>*/}
    <Navbar_Medico />
    { loading ? 
    <div className={containerClassName}><ProgressSpinner /></div> :
    <div className="grid" style={{
      background: 'rgba(143, 175, 196, 1)',
      height: '100%'
      //height: window.innerHeight
    }}>
      <div className="col-12" style={shortStack.style}>
        <div className="card" style={{
          background: 'rgba(143, 175, 196, 1)',
          borderColor: 'rgba(143, 175, 196, 1)'
        }}>
        <h5>Citas</h5>
            <DataTable style={shortStack.style} value={citas} paginator rows={5} emptyMessage="No tiene citas"
              selectionMode="single" onRowClick={ver_cita} pt={{
                wrapper: {
                  style: {
                    borderTopLeftRadius: '15px',
                    borderTopRightRadius: '15px'
                  }
                }
              }}>
              <Column field="nombre_paciente" header="Nombre de Paciente" style={{ minWidth: '12rem' }} pt={{
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
                  }}/>
              <Column field="fecha_cita" header="Fecha" style={{ minWidth: '12rem' }} pt={{
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
                  }}/>
              <Column field="hora_cita" header="Hora" style={{ minWidth: '12rem' }} pt={{
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
                  }}/>
            </DataTable>
        </div>
      </div>
    </div>}
  </div>)
}

export default Ver_Citas;