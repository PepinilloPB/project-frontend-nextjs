'use client'
import React, { useContext, useEffect, useState, useRef } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";
import localfont from 'next/font/local';

import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Chip } from "primereact/chip";
import { classNames } from 'primereact/utils';
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { ProgressSpinner } from 'primereact/progressspinner';
import { RadioButton } from "primereact/radiobutton";
import { Slider } from 'primereact/slider';
import { Splitter, SplitterPanel } from "primereact/splitter";

import { LayoutContext } from '@/layout/context/layoutcontext';
import Acceso_Denegado from "../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";

import get_un_empleado from "../utils/get_un_empleado_handler";
import get_un_consultorio from "../../paciente/utils/get_consultorio_handler";
import get_especialidades from "../utils/get_especialidades_handler";
import put_empleado from "../utils/put_empleado_handler";
import put_consultorio from "../utils/put_consultorio_handler";
import get_consultorios from "../utils/get_consultorio_handler";
import get_empleados from "../utils/get_empleado_handler";
import get_peticiones from "../utils/get_peticiones_handler";
import post_empleado from "../utils/post_empleado";
import signup_medico from "../utils/signup_medico_handler";
import signup_recepcionista from "../utils/signup_recepcionista_handler";
import put_peticion from "../utils/put_peticion_handler";
import Navbar_Admin from "../navbar";

const shortStack = localfont({ src: "../../../../../fonts/ShortStack-Regular.ttf" });

const Inicio = () => {
  const router = useRouter();

  const menu = useRef<Menu>(null);

  const [denegado, setDenegado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCons, setLoadingCons] = useState(true);
  const [loadingEmp, setLoadingEmp] = useState(true);
  const [loadingEsp, setLoadingEsp] = useState(true);
  const [loadingNot, setLoadingNot] = useState(true);
  const [display, setDisplay] = useState(false);
  const [editarNombre, setEditarNombre] = useState(false);
  const [editarApellido, setEditarApellido] = useState(false);
  const [editarNombreConsultorio, setEditarNombreConsultorio] = useState(false);
  const [editarEspecialidad, setEditarEspecialidad] = useState(false);
  const [editarDireccion, setEditarDireccion] = useState(false);
  const [editarNit, setEditarNit] = useState(false);
  const [editarHoraEntrada, setEditarHoraEntrada] = useState(false);
  const [editarHoraSalida, setEditarHoraSalida] = useState(false);
  const [editarMaxCitas, setEditarMaxCitas] = useState(false);
  const [editarTiempoConsulta, setEditarTiempoConsulta] = useState(false);
  const [cumplirPeticion, setCumplirPeticion] = useState(false);
  const [invNombre, setInvNombre] = useState(false);
  const [invApellido, setInvApellido] = useState(false);
  const [invEmail, setInvEmail] = useState(false);
  const [invRol, setInvRol] = useState(false);
  const [invConsultorio, setInvConsultorio] = useState(false);

  const [posTurno, setPosTurno] = useState(0);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("");

  const [nombreNuevo, setNombreNuevo] = useState("");
  const [apellidoNuevo, setApellidoNuevo] = useState("");
  const [emailNuevo, setEmailNuevo] = useState("");
  const [rolNuevo, setRolNuevo] = useState(""); 

  const [nombreConsultorio, setNombreConsultorio] = useState("");
  const [especializacion, setEspecializacion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nit, setNit] = useState("");
  const [turnos, setTurnos] = useState<any[]>([]);
  const [horaEntrada, setHoraEntrada] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [maxCitas, setMaxCitas] = useState<number | null>(0);
  const [tiempoConsulta, setTiempoConsulta] = useState<number | string>('');

  const [filtrosConsultorio, setFiltrosConsultorio] = useState<DataTableFilterMeta>({});
  const [filtrosEmpleado, setFiltrosEmpleado] = useState<DataTableFilterMeta>({});
  const [filtrosEspecialidad, setFiltrosEspecialidad] = useState<DataTableFilterMeta>({});

  const [consultorios, setConsultorios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [peticiones, setPeticiones] = useState([]);

  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const containerClassName = classNames('flex align-items-center justify-content-center overflow-hidden');

  const [peticion, setPeticion] = useState({
    id: "",
    empleado_id: "",
    tipo: "",
    cuerpo: {},
    descripcion: "",
    cumplida: false
  });
  const [consultorio, setConsultorio] = useState({
    id: "",
    nombre: ""
  });
  const [empleado, setEmpleado] = useState({
    id: "",
    nombre: "",
    apellido: ""
  });

  const initFilters = () => {
    setFiltrosConsultorio({
      nombre: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      direccion: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      especializacion: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
    });

    setFiltrosEmpleado({
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
  
  useEffect(() => {
    initFilters();

    try {
      token = jwt_decode(document.cookie.replace("token=", ""));
      setNombre(token['given_name']);
      setApellido(token['family_name']);
      setEmail(token['email']);

      get_consultorios().then(data => setConsultorios(data)).then(() => setLoadingCons(false));
      get_empleados().then(data => setEmpleados(data)).then(() => setLoadingEmp(false));
      get_especialidades().then(data => setEspecialidades(data)).then(() => setLoadingEsp(false));
      get_peticiones().then(data => setPeticiones(data)).then(() => setLoadingNot(false));
    } catch (error) {
      setDenegado(true);
    }
  }, []);

  const ver_consultorio = (rowData: any) => {
    setLoading(true);
    router.push('/user/admin/consultorio?id=' + rowData.data.id)
  }

  const ver_empleado = (rowData: any) => {
    setLoading(true);
    router.push('/user/admin/empleado?id=' + rowData.data.id)
  }

  const cargar_peticion = (item: any) => {
    setPeticion(item);

    if(item.tipo === "Crear Nuevo Empleado"){
      setNombreNuevo(item.cuerpo.nombre);
      setApellidoNuevo(item.cuerpo.apellido);
      setRolNuevo(item.cuerpo.rol);
      setEmailNuevo(item.cuerpo.email);

      consultorios.forEach((value: any, i: any) => {
        if(value.id === item.cuerpo.consultorio_id)
          setConsultorio(value);
      });
    }else if (item.tipo === "Cambio de Consultorio"){
      setLoading(true);

      get_un_empleado(item.empleado_id).then(data => {
        setEmpleado(data);
        consultorios.forEach((value: any, i: any) => {
          if(value.id === item.cuerpo.consultorio_id)
            setConsultorio(value);
        });
      }).then(() => setLoading(false));
    }

    setCumplirPeticion(true);
  }

  const guardar_empleado = () => {
    if(nombreNuevo !== "" && apellidoNuevo !== "" && rolNuevo !== "" && consultorio.id !== "" && emailNuevo !== ""){
      setLoading(true);

      const body_empleado = {
        nombre: nombreNuevo, 
        apellido: apellidoNuevo,
        rol: rolNuevo,
        email: emailNuevo,
        consultorio_id: consultorio.id
      }

      const pwrd = nombre.charAt(0) + apellido.replaceAll(" ", "_") + new Date().getFullYear() + "!";

      post_empleado(body_empleado).then(data => {
        const respuesta = "Empleado " + rolNuevo + " creado con email: " + emailNuevo + " y contraseña: " + pwrd;

        const body_signup = {
          first_name: nombreNuevo,
          last_name: apellidoNuevo,
          email: emailNuevo,
          password: pwrd,
          consultorio: consultorio.id,
          empleado: data.id
        }

        if(rolNuevo === "Médico")
          signup_medico(body_signup).then(() => put_peticion(peticion.id, {cumplida: true, respuesta: respuesta}).then(() => location.reload()));
        else if(rolNuevo === "Recepcionista")
          signup_recepcionista(body_signup).then(() => put_peticion(peticion.id, {cumplida: true, respuesta: respuesta}).then(() => location.reload()));
      }); 
    }

    if(nombreNuevo === "") setInvNombre(true); else setInvNombre(false);
    if(apellidoNuevo === "") setInvApellido(true); else setInvApellido(false);
    if(rolNuevo === "") setInvRol(true); else setInvRol(false);
    if(consultorio.id === "") setInvConsultorio(true); else setInvConsultorio(false);
    if(emailNuevo === "") setInvEmail(true); else setInvEmail(false);
  }

  const consultorio_data = (rowData: any) => {
    /*setLoadingEmp(true);
    get_un_consultorio(rowData.consultorio_id).then(data => {
      setLoadingEmp(false);
      //console.log(data);
      return (data.nombre);
    });*/

    //console.log(rowData.consultorio_id);

    return ("");
  }
  
  return (denegado ? <><Acceso_Denegado /></> : 
  <div style={{
    background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)'
  }}>
    {/*<Navbar tipo_usuario="admin" />*/}
    <Navbar_Admin />
    {loading ? 
    <div className={containerClassName}><ProgressSpinner /></div> :
    <div className="grid" style={{
      background: 'rgba(51, 107, 134, 1)',
      height: '100vh'
    }}>
      <div className="col-12 md:col-4">
        <div className="card" style={{
          background: 'rgba(143, 175, 196, 1)',
          borderColor: 'rgba(143, 175, 196, 1)'
        }}>
          <div className="align-items-center justify-content-center">
            { nombre === "" || apellido === "" || email === "" ?
            <div className={containerClassName}><ProgressSpinner /></div> : 
            (<div className="surface-0" style={{
              background: 'linear-gradient(180deg, rgba(143, 175, 196, 1) 10%, rgba(143, 175, 196, 1) 30%)'
            }}>
              <div className="font-medium text-2xl text-900 mb-3" style={shortStack.style}>
                Información de Usuario  
              </div>
              <ul className="list-none p-0 m-0 mb-3">
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                  <div className="text-800 w-6 md:w-4 font-medium" style={shortStack.style}>Nombre</div>
                  <div className="text-900 md:w-8 md:flex-order-0 flex-order-1" style={shortStack.style}>
                    { nombre }
                  </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                  <div className="text-800 w-6 md:w-4 font-medium" style={shortStack.style}>Apellido</div>
                  <div className="text-900 md:w-8 md:flex-order-0 flex-order-1" style={shortStack.style}>
                    { apellido }
                  </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap" >
                  <div className="text-800 w-6 md:w-3 font-medium" style={shortStack.style}>Email</div>
                  <div className="text-900 md:w-8 md:flex-order-0 flex-order-1" style={shortStack.style}>
                    { email }
                  </div>
                </li>
              </ul>
            </div>)}
          </div>
        </div>
        {loadingNot ? 
        <div className={containerClassName}><ProgressSpinner /></div> :
        <div className="card" style={{
          background: 'rgba(143, 175, 196, 1)',
          borderColor: 'rgba(143, 175, 196, 1)'
        }}>
          <div className="flex align-items-center justify-content-between mb-4">
            <h5 style={shortStack.style}>Notificaciones</h5>
          </div>
          { peticiones.map((item: any, i: any) => {
            return (
            <div key={i} onClick={() => cargar_peticion(item)}>
              <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                <li className="flex align-items-center py-2 border-bottom-1 surface-border" style={shortStack.style}>
                  { item.tipo === "Cambio de Consultorio" ? 
                  <div className="w-3rem h-3rem flex align-items-center justify-content-center border-circle mr-3 flex-shrink-0 bg-blue-100">
                    <i className="pi pi-replay text-xl text-blue-500" />
                  </div> :
                  item.tipo === "Crear Nuevo Empleado" ?
                  <div className="w-3rem h-3rem flex align-items-center justify-content-center border-circle mr-3 flex-shrink-0 bg-orange-100"> 
                    <i className="pi pi-user text-xl text-orange-500" /> 
                  </div>: null}
                  <span className="text-900 line-height-3">
                    { dias[new Date(item.fecha_creacion).getDay()] }, { new Date(item.fecha_creacion).getDate() } de { meses[new Date(item.fecha_creacion).getMonth()] } de { new Date(item.fecha_creacion).getFullYear() } : <span className="text-700"> { item.tipo }</span>
                  </span>
                </li>
              </ul>
            </div>)
          }) }
          <Dialog visible={cumplirPeticion} header={peticion.tipo} style={shortStack.style}
            onHide={() => {
              setCumplirPeticion(false);
              setPeticion({
                id: "",
                empleado_id: "",
                tipo: "",
                cuerpo: {},
                descripcion: "",
                cumplida: false
              });
            }}>
            {peticion.tipo === "Crear Nuevo Empleado" ? 
            <div className="p-fluid formgrid grid">
              <div className="field col-12 md:col-4">
                <label htmlFor="nombre">Nombre</label>
                <InputText id="nombre" type="text" value={nombreNuevo}
                  onChange={(e) => {setNombreNuevo(e.target.value)}} 
                  className={invNombre ? "p-invalid" : ""} style={{ 
                    borderRadius: '15px',
                    background: 'rgba(206, 159, 71, 1)',
                    borderColor: 'rgba(206, 159, 71, 1)',
                    color: 'rgba(41, 49, 51, 1)'
                  }}/>
              </div>
              <div className="field col-12 md:col-4">
                <label htmlFor="apellido">Apellido</label>
                <InputText id="apellido" type="text" value={apellidoNuevo}
                  onChange={(e) => {setApellidoNuevo(e.target.value)}} 
                  className={invApellido ? "p-invalid" : ""} style={{ 
                    borderRadius: '15px',
                    background: 'rgba(206, 159, 71, 1)',
                    borderColor: 'rgba(206, 159, 71, 1)',
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
                <label htmlFor="consultorio">Consultorio</label>
                <Dropdown id="consultorio" value={consultorio} options={consultorios} 
                  optionLabel="nombre" style={{ 
                    borderRadius: '15px',
                    background: 'rgba(206, 159, 71, 1)',
                    borderColor: 'rgba(206, 159, 71, 1)',
                    color: 'rgba(41, 49, 51, 1)'
                  }}
                  className={invConsultorio ? "p-invalid" : ""}
                  onChange={(e) => {
                    setConsultorio(e.value);
                  }}></Dropdown>
              </div>
              <div className="field col-12 md:col-4">
                <label htmlFor="email">Email</label>
                <InputText id="email" type="email" value={emailNuevo}
                  onChange={(e) => {setEmailNuevo(e.target.value)}} 
                  className={invEmail ? "p-invalid" : ""} style={{ 
                    borderRadius: '15px',
                    background: 'rgba(206, 159, 71, 1)',
                    borderColor: 'rgba(206, 159, 71, 1)',
                    color: 'rgba(41, 49, 51, 1)'
                  }}/>
              </div>
              <div className="field col-12 md:col-12">
                <Button className="w-full p-3 text-xl justify-content-center" 
                  loading={loading} onClick={guardar_empleado}><p style={shortStack.style}>Crear Nuevo Empleado</p></Button>
              </div>
            </div>: peticion.tipo === "Cambio de Consultorio" ? 
            <div className="p-fluid formgrid grid">
              <div className="field col-12 md:col-6">
                <label htmlFor="nombre">Nombre de Empleado</label>
                <InputText id="nombre" type="text" value={empleado.nombre + " " + empleado.apellido} disabled style={{ 
                    borderRadius: '15px',
                    background: 'rgba(206, 159, 71, 1)',
                    borderColor: 'rgba(206, 159, 71, 1)',
                    color: 'rgba(41, 49, 51, 1)'
                  }}/>
              </div>
              <div className="field col-12 md:col-6">
                <label htmlFor="consultorio">Nuevo Consultorio</label>
                <Dropdown id="consultorio" value={consultorio} options={consultorios} 
                  optionLabel="nombre"
                  className={invConsultorio ? "p-invalid" : ""} style={{ 
                    borderRadius: '15px',
                    background: 'rgba(206, 159, 71, 1)',
                    borderColor: 'rgba(206, 159, 71, 1)',
                    color: 'rgba(41, 49, 51, 1)'
                  }}
                  onChange={(e) => {
                    setConsultorio(e.value);
                  }}></Dropdown>
              </div>
              <div className="field col-12 md:col-12">
                <Button className="w-full p-3 text-xl justify-content-center" 
                  loading={loading}><p style={shortStack.style}>Confirmar Cambio de Consultorio</p></Button>
              </div>
            </div> : null}</Dialog>
        </div>}
      </div> 
      <div className="col-12 md:col-8">
        <div className="card" style={{
          background: 'rgba(143, 175, 196, 1)',
          borderColor: 'rgba(143, 175, 196, 1)'
        }}>
          <div className="font-medium text-2xl text-900 mb-2" style={shortStack.style}>
            Información del Sistema  
          </div>
          
          <Accordion activeIndex={0} pt={{}}>
            <AccordionTab header="Consultorios" style={shortStack.style} 
            pt={{
              content: {
                style: {
                  background: 'linear-gradient(180deg, rgba(51, 107, 134, 1) 10%, rgba(51, 107, 134, 1) 30%)',
                  borderColor: 'rgba(51, 107, 134, 1)',
                }
              },
            }}>
              <div className="h-full align-items-center justify-content-center">
                { loadingCons ? 
                <div className={containerClassName}><ProgressSpinner /></div> : 
                (<DataTable dataKey="id" filters={filtrosConsultorio}
                  filterDisplay="menu" value={consultorios} selectionMode="single"
                  responsiveLayout="scroll" emptyMessage="No existen consultorios"
                  paginator rows={5} onRowClick={ver_consultorio} style={shortStack.style}
                  pt={{
                    wrapper: {
                      style: {
                        borderTopLeftRadius: '15px',
                        borderTopRightRadius: '15px'
                      }
                    }
                  }}>
                  <Column header="Nombre" field="nombre" filter filterPlaceholder="Buscar por nombre" pt={{
                    headerCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(143, 175, 196, 1) 10%, rgba(143, 175, 196, 1) 30%)',
                        borderColor: 'rgba(143, 175, 196, 1)',
                      }
                    },
                    bodyCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)',
                        borderColor: 'rgba(206, 159, 71, 1)',
                      }
                    },
                  }}></Column>
                  <Column header="Dirección" field="direccion" filter filterPlaceholder="Buscar por dirección" pt={{
                    headerCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(143, 175, 196, 1) 10%, rgba(143, 175, 196, 1) 30%)',
                        borderColor: 'rgba(143, 175, 196, 1)',
                      }
                    },
                    bodyCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)',
                        borderColor: 'rgba(206, 159, 71, 1)',
                      }
                    },
                  }}></Column>
                  <Column header="Especialidad" field="especializacion" filter filterPlaceholder="Buscar por especialidad" pt={{
                    headerCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(143, 175, 196, 1) 10%, rgba(143, 175, 196, 1) 30%)',
                        borderColor: 'rgba(143, 175, 196, 1)',
                      }
                    },
                    bodyCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)',
                        borderColor: 'rgba(206, 159, 71, 1)',
                      }
                    },
                  }}></Column>
                </DataTable>)}
              </div>
            </AccordionTab>
            <AccordionTab header="Empleados" style={shortStack.style} pt={{
              content: {
                style: {
                  background: 'linear-gradient(180deg, rgba(51, 107, 134, 1) 10%, rgba(51, 107, 134, 1) 30%)',
                  borderColor: 'rgba(51, 107, 134, 1)',
                }
              },
            }}>
              <div className="h-full align-items-center justify-content-center">
                { loadingEmp ? 
                <div className={containerClassName}><ProgressSpinner /></div> : 
                (<DataTable dataKey="id" filters={filtrosEmpleado}
                  filterDisplay="menu" value={empleados} selectionMode="single"
                  responsiveLayout="scroll" emptyMessage="No existen empleados"
                  paginator rows={5} style={shortStack.style} onRowClick={ver_empleado}
                  pt={{
                    wrapper: {
                      style: {
                        borderTopLeftRadius: '15px',
                        borderTopRightRadius: '15px'
                      }
                    }
                  }}>
                  <Column header="Nombre" field="nombre" filter filterPlaceholder="Buscar por nombre" pt={{
                    headerCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(143, 175, 196, 1) 10%, rgba(143, 175, 196, 1) 30%)',
                        borderColor: 'rgba(143, 175, 196, 1)',
                      }
                    },
                    bodyCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)',
                        borderColor: 'rgba(206, 159, 71, 1)',
                      }
                    },
                  }}></Column>
                  <Column header="Apellido" field="apellido" filter filterPlaceholder="Buscar por apellido" pt={{
                    headerCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(143, 175, 196, 1) 10%, rgba(143, 175, 196, 1) 30%)',
                        borderColor: 'rgba(143, 175, 196, 1)',
                      }
                    },
                    bodyCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)',
                        borderColor: 'rgba(206, 159, 71, 1)',
                      }
                    },
                  }}></Column>
                  <Column header="Rol de Usuario" field="rol" filter filterPlaceholder="Buscar por rol" pt={{
                    headerCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(143, 175, 196, 1) 10%, rgba(143, 175, 196, 1) 30%)',
                        borderColor: 'rgba(143, 175, 196, 1)',
                      }
                    },
                    bodyCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)',
                        borderColor: 'rgba(206, 159, 71, 1)',
                      }
                    },
                  }}></Column>
                  {/*<Column header="Consultorio" field="consultorio_id" body={consultorio_data}></Column>*/}
                </DataTable>)}
              </div>
            </AccordionTab>
            <AccordionTab header="Especialidades"  style={shortStack.style} pt={{
              content: {
                style: {
                  background: 'linear-gradient(180deg, rgba(51, 107, 134, 1) 10%, rgba(51, 107, 134, 1) 30%)',
                  borderColor: 'rgba(51, 107, 134, 1)',
                }
              },
            }}>
              <div className="h-full align-items-center justify-content-center">
                { loadingEsp ? 
                <div className={containerClassName}><ProgressSpinner /></div> : 
                (<DataTable value={especialidades} paginator rows={5} style={shortStack.style} pt={{
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
                        background: 'linear-gradient(180deg, rgba(143, 175, 196, 1) 10%, rgba(143, 175, 196, 1) 30%)',
                        borderColor: 'rgba(143, 175, 196, 1)',
                      }
                    },
                    bodyCell: {
                      style: {
                        background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)',
                        borderColor: 'rgba(206, 159, 71, 1)',
                      }
                    },
                  }}></Column>
                </DataTable>)}
              </div>
            </AccordionTab>
          </Accordion>
        </div>
      </div>
    </div>}
  </div>);
}

export default Inicio