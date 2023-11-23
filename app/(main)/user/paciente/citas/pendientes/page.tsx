'use client'
import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";
import localfont from 'next/font/local';

import { Button } from "primereact/button";
import { Column} from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

import Acceso_Denegado from "../../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";

import get_citas_historial from "../../utils/get_citas_historial_handler";
import get_un_historial from "../../utils/get_historial_handler";
import Navbar_Paciente from "../../navbar";

const shortStack = localfont({ src: "../../../../../../fonts/ShortStack-Regular.ttf" });

const Citas_Pendientes = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [denegado, setDenegado] = useState(false);
  const [dependiente, setDependiente] = useState(false);

  const [historial, setHistorial] = useState({
    id: "",
    nombre: "",
    apellido: "",
    nacimiento: "",
    codigo: "",
    sexo: "",
    estado_civil: "",
    ci: "",
    telefono: "",
    direccion: "",
    nacionalidad: "",
    dependientes: [""],
    fecha_creacion: "",
    fecha_actualizacion: "",
    estado: 0
  });

  const [citas, setCitas] = useState<any[]>([]);
  const [citasD, setCitasD] = useState<any[]>([]);
  const [filtros, setFiltros] = useState<DataTableFilterMeta>({});  

  const initFilters = () => {
    setFiltros({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      nombre_paciente: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      fecha: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
      }
    });
  };

  useEffect(() => initFilters(), []);

  var token: any = {};
  
  useEffect(() => {
    try {
      token = jwt_decode(document.cookie.replace("token=", ""));

      if(token['custom:historial'] === undefined) throw Error;

      get_un_historial(token['custom:historial']).then(data => {
        if(data === undefined) throw Error;

        var deps: any = [];

        data.dependientes.forEach((item: any) => {
          get_citas_historial(item).then(value => {
            deps = deps.concat(value);
            setCitasD(deps);
          });
        });

        get_citas_historial(data.id).then(value => {
          setCitas(value);
          setLoading(false);
        });
      });
    } catch (error) {
      setDenegado(true);
    }
  },[]);

  const tabla_dependiente = () => {
    //setLoading(true);
    setDependiente(true);

    /*get_un_historial(historial.id).then(data =>  {
      var citas_dep: any = [];
      data.dependientes.forEach((item: any) => {
        get_citas_historial(item).then(response => {
          citas_dep = citas_dep.concat(response);
          setCitasD(citas_dep);
        });
      });
      
      //console.log(citas_dep);
    }).finally(() => setLoading(false));*/
  }

  const externa = (rowData: any) => {
    if(rowData.externa === false)
      return "Si";
    else if (rowData.externa === true)
      return "No";
    return "";
  }

  const ver_mas = (rowData: any) => {
    setLoading(true);
    router.push("/user/paciente/cita?id=" + rowData.data.id);
  }

  return (denegado ? <><Acceso_Denegado /></> : 
    <div style={{
      background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)'
    }}>
      {/*<Navbar tipo_usuario="paciente"/>*/}
      <Navbar_Paciente />
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
            <h5>Citas de Paciente</h5>
            <DataTable style={shortStack.style} value={citas} paginator className="p-datatable-gridlines mt-0 md:mt-4" showGridlines rows={5}
              dataKey="id" filters={filtros} filterDisplay="menu" loading={loading}
              responsiveLayout="scroll" emptyMessage="No tiene citas" selectionMode="single" onRowClick={ver_mas}
              pt={{
                wrapper: {
                  style: {
                    borderTopLeftRadius: '15px',
                    borderTopRightRadius: '15px'
                  }
                }
              }}>
              <Column field="nombre_paciente" header="Nombre de Paciente" filter 
                filterPlaceholder="Buscar por nombre" style={{ minWidth: '12rem' }} 
                pt={{
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
              <Column field="fecha_cita" header="Fecha" filterField="fecha" 
                dataType="date" style={{ minWidth: '10rem' }} 
                pt={{
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
              <Column field="hora_cita" header="Hora" style={{ minWidth: '12rem' }} 
                pt={{
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
              <Column field="externa" header="Cita externa" body={externa} style={{ minWidth: '12rem' }} 
                pt={{
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
              {/*<Column field="id" header="" body={ver_mas} style={{ minWidth: '12rem' }} />*/}
            </DataTable>

            { dependiente ? 
            (<DataTable value={citasD} paginator className="p-datatable-gridlines mt-0 md:mt-4" showGridlines
              rows={5} dataKey="id" filters={filtros} filterDisplay="menu" loading={loading}
              responsiveLayout="scroll" emptyMessage="No tiene citas" selectionMode="single" onRowClick={ver_mas}
              pt={{
                wrapper: {
                  style: {
                    borderTopLeftRadius: '15px',
                    borderTopRightRadius: '15px'
                  }
                }
              }}>
              <Column field="nombre_paciente" header="Nombre de Paciente" filter 
                filterPlaceholder="Buscar por nombre" style={{ minWidth: '12rem' }} 
                pt={{
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
              <Column field="fecha_cita" header="Fecha" filterField="fecha" 
                dataType="date" style={{ minWidth: '10rem' }} 
                pt={{
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
              <Column field="hora_cita" header="Hora" style={{ minWidth: '12rem' }} 
                pt={{
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
              <Column field="externa" header="Cita externa" body={externa} style={{ minWidth: '12rem' }} 
                pt={{
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
              {/*<Column field="id" header="" body={ver_mas} style={{ minWidth: '12rem' }} />*/}
            </DataTable>) : null}
            
            <Button label="Ver citas de dependientes" className="mt-0 md:mt-4"
              loading={loading} disabled={dependiente} onClick={tabla_dependiente} 
              style={{ 
                borderRadius: '20px',
                background: 'rgba(51, 107, 134, 1)',
                borderColor: 'rgba(51, 107, 134, 1)',
                color: 'rgba(143, 175, 196, 1)'
              }}></Button>
          </div>
        </div>
      </div>
    </div>);
}

export default Citas_Pendientes;