'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import localfont from 'next/font/local';


import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Calendar } from "primereact/calendar";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from 'primereact/inputtext';
import { Slider } from "primereact/slider";

import { LayoutContext } from '../../layout/context/layoutcontext';
import get_especialidades from './user/admin/utils/get_especialidades_handler';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { RadioButton } from 'primereact/radiobutton';

const shortStack = localfont({ src: "../../fonts/ShortStack-Regular.ttf" });

export default function Home() {
  const [isHidden, setIsHidden] = useState(false);
  const [displayBasic, setDisplayBasic] = useState(false)

  const [denegado, setDenegado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [display, setDisplay] = useState(false);
  const [invNombreRec, setInvNombreRec] = useState(false);
  const [invApellido, setInvApellido] = useState(false);
  const [invEmail, setInvEmail] = useState(false);
  const [invRol, setInvRol] = useState(false);
  const [invNombre, setInvNombre] = useState(false);
  const [invEspecialidad, setInvEspecialidad] = useState(false);
  const [invDireccion, setInvDireccion] = useState(false);
  const [invNit, setInvNit] = useState(false);
  const [invEtiqueta, setInvEtiqueta] = useState(false);
  const [invHoraEntrada, setInvHoraEntrada] = useState(false);
  const [invHoraSalida, setInvHoraSalida] = useState(false);
  const [invMaxCitas, setInvMaxCitas] = useState(false);
  const [invTiempoConsulta, setInvTiempoConsulta] = useState(false);


  const [nombre, setNombre] = useState("");
  const [nombreRec, setNombreRec] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState(""); 
  const [especializacion, setEspecializacion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nit, setNit] = useState("");
  const [etiqueta, setEtiqueta] = useState("");
  const [horaEntrada, setHoraEntrada] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [tiempoConsulta, setTiempoConsulta] = useState<number | string>('');
  const [layout, setLayout] = useState<'grid' | 'list' | (string & Record<string, unknown>)>('grid');

  const [maxCitas, setMaxCitas] = useState<number | null>(0);

  const [especialidad, setEspecialidad] = useState({
    id: "",
    nombre: "",
    fecha_creacion: "",
    fecha_actualizacion: "",
    estado: false
  });

  const [especialidades, setEspecialidades] = useState<any[]>([]);

  var token: any = {};

  const { layoutConfig } = useContext(LayoutContext);
  const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  const router = useRouter();

  const [turnos, setTurnos] = useState<any[]>([undefined]);

  const menuRef = useRef<HTMLElement | null>(null);
  const panel = useRef<OverlayPanel>(null);

  useEffect(() => {
    try {
      //token = jwt_decode(document.cookie.replace("token=", ""));
      get_especialidades().then(value => setEspecialidades(value)).then(() => setLoading(false));
    } catch (error) {
      setDenegado(true);
    }
  }, []);

  const añadir_turno = () => {
    if(etiqueta !== "" && maxCitas !== 0 &&
      horaEntrada !== "" && horaSalida !== "" && 
      tiempoConsulta !== 0){
      const new_turno = {
        etiqueta: etiqueta,
        max_citas: maxCitas,
        hora_entrada: horaEntrada,
        hora_salida: horaSalida,
        tiempo_consulta: tiempoConsulta
      };

      setTurnos(state => [new_turno, ...state]);
      setDisplay(false);
    }

    if(etiqueta === "") setInvEtiqueta(true); else setInvEtiqueta(false);
    if(maxCitas === 0) setInvMaxCitas(true); else setInvMaxCitas(false);
    if(horaEntrada === "") setInvHoraEntrada(true); else setInvHoraEntrada(false);
    if(horaEntrada === "") setInvHoraSalida(true); else setInvHoraSalida(false);
    if(tiempoConsulta === 0) setInvTiempoConsulta(true); else setInvTiempoConsulta(false);
  }

  const remover_turno = (data: any) => {
    const i = turnos.indexOf(data);
    const new_turnos = turnos.filter((value, index) => index !== i);
    setTurnos(new_turnos);
  }

  const editar_turno = (data: any) => {
    setDisplay(true);
    setEtiqueta(data.etiqueta);
    setMaxCitas(data.max_citas);
    setHoraEntrada(data.hora_entrada);
    setHoraSalida(data.hora_salida);
    setTiempoConsulta(data.tiempo_consulta);
  }

  const guardar = () => {
    if(nombre !== "" && especializacion !== "" && direccion !== ""
      && nit !== "" && turnos.length > 1){
        setLoading(true);
        
        const i = turnos.indexOf(undefined);
        const clean_turnos = turnos.filter((value, index) => index !== i);

        const new_consultorio = {
          nombre: nombre,
          especializacion: especializacion,
          direccion: direccion,
          nit: nit,
          num_turnos: turnos.length,
          turnos: clean_turnos
        }

        //post_consultorio(new_consultorio).then(() => router.push('/user/admin/inicio'));
    }

    if(nombre === "") setInvNombre(true); else setInvNombre(false);
    if(especializacion === "") setInvEspecialidad(true); else setInvEspecialidad(false);
    if(direccion === "") setInvDireccion(true); else setInvDireccion(false);
    if(nit === "") setInvNit(true); else setInvNit(false);
  }

  const dataviewListItem = (data: any) => {
    return (
        <div className="col-12" style={{
          background: 'rgba(143, 175, 196, 1)'
        }}>
            <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
                {/*<img src={`/demo/images/product/${data.image}`} alt={data.name} className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />*/}
                <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
                    <div className="font-bold text-2xl">{data.etiqueta}</div>
                    {/*<div className="mb-2">{data.description}</div>
                    <Rating value={data.rating} readOnly cancel={false} className="mb-2"></Rating>
                    <div className="flex align-items-center">
                        <i className="pi pi-tag mr-2"></i>
                        <span className="font-semibold">{data.category}</span>
                    </div>*/}
                </div>
                {/*<div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                    <span className="text-2xl font-semibold mb-2 align-self-center md:align-self-end">${data.price}</span>
                    <Button icon="pi pi-shopping-cart" label="Add to Cart" disabled={data.inventoryStatus === 'OUTOFSTOCK'} size="small" className="mb-2"></Button>
                    <span className={`product-badge status-${data.inventoryStatus?.toLowerCase()}`}>{data.inventoryStatus}</span>
                </div>*/}
            </div>
        </div>
    );
  };

  const dataviewGridItem = (data: any) => {
    return (
        <div className="col-12 lg:col-4" style={{
          background: 'rgba(143, 175, 196, 1)',
          borderColor: 'rgba(143, 175, 196, 1)'
        }}>
            <div className="card m-3 border-1 surface-border" style={{
              background: 'rgba(206, 159, 71, 1)',
              borderColor: 'rgba(206, 159, 71, 1)',  
            }}>
                <div className="flex flex-column align-items-center text-center mb-3" style={shortStack.style}>
                    <div className="text-2xl font-bold">{ data.etiqueta }</div>
                    <div className="mb-3">{ data.hora_entrada } - { data.hora_salida }</div>
                    <div className="mb-3">Máximo de citas: { data.max_citas }</div>
                    <div className="mb-3">Tiempo de Consulta: { data.tiempo_consulta } min</div>
                    <div className="align-items-center justify-content-between">
                      <Button icon="pi pi-pencil" rounded text 
                        onClick={() => editar_turno(data)}/>
                      <Button icon="pi pi-times" rounded text severity="danger"
                        onClick={() => remover_turno(data)}/>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const dataviewAddItem = () => {
    return (
    <div className={turnos.length % 3 === 1 ? 
        "col-12 lg:col-12" : turnos.length % 3 === 2 ? 
        "col-12 lg:col-8" : "col-12 lg:col-4"
      } 
      style={{
        background: 'rgba(143, 175, 196, 1)'
      }}>
      <div className="card m-3 border-1 surface-border" style={{
          background: 'rgba(206, 159, 71, 1)',
          borderColor: 'rgba(206, 159, 71, 1)',  
        }}>
          <div className="flex flex-column align-items-center justify-content-center">
              <Button icon="pi pi-plus" rounded text /*onClick={añadir_turno}*/
                onClick={() => setDisplay(true)}/>
          </div>
      </div>
  </div>);
  }

  const itemTemplate = (data: any, layout: 'grid' | 'list' | (string & Record<string, unknown>)) => {
    if (data === undefined) {
      //console.log(turnos.length);
      return dataviewAddItem();
      //return;
    }

    if (layout === 'list') {
        return dataviewListItem(data);
    } else if (layout === 'grid') {
        return dataviewGridItem(data);
    }
  };

  const turns = (turnos: any) => {
    return <div>Turnos son {turnos.toString()}</div>;
  };

  const basicDialogFooter = 
    <Button type="button" label="OK" onClick={() => setDisplayBasic(false)} icon="pi pi-check" outlined />;


  return loading ? 
    (<div className={containerClassName}><ProgressSpinner /></div>) : (
      <div className="surface-0 flex justify-content-center">
      <div id="home" className="landing-wrapper overflow-hidden"
      style={{
        //background: 'rgba(206, 159, 71, 0.9)'
        background: 'rgba(51, 107, 134, 1)'
      }}>
        { /**********CABECERA**********/ }
        <div id="hero" className="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
          style={{
            background: 'rgba(143, 175, 196, 1)',
            clipPath: 'ellipse(150% 87% at 93% 13%)'
          }}>
          <div className="mx-4 md:mx-8 mt-0 md:mt-4">
            <h1 className="text-5xl font-bold text-gray-900 line-height-2"
            style={shortStack.style}>
              <span className="font-light block">Bienvenido a MediNow</span>El sistema para la salud de Bolivia 
            </h1>
            <p className="font-normal text-2xl line-height-3 md:mt-3 text-gray-700" style={shortStack.style}>
            Mejore la eficiencia operativa, gestionando datos médicos, historias clínicas y recursos para ofrecer una atención más precisa y efectiva a los pacientes.
            </p>
            {/*<Link href="/#features" onClick={() => setLoading(true)}>
              <Button type="button" label="Ingresar" rounded className="text-xl border-none mt-3 bg-blue-500 font-normal line-height-3 px-3 text-white"></Button>
            </Link>*/}
          </div>
          <div className="flex justify-content-center md:justify-content-end">
            <img src="https://www.pngplay.com/wp-content/uploads/7/Doctor-Transparent-Free-PNG.png" alt="img" className="w-9 md:w-auto" />
          </div>
        </div>

        {/**********BOTONES**********/}
        <div id="features" 
          className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
          <div className="grid justify-content-center">
            <div className="col-12 text-center mt-8 mb-4" style={shortStack.style}>
              <h2 className="text-900 font-normal mb-2">Opciones del Sistema</h2>
              <span className="text-900 text-2xl">Ingrese como...</span>
            </div>

            <div className="col-12 md:col-12 lg:col-5 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
              <div style={{
                height: '160px',
                padding: '2px',
                borderRadius: '10px',
                background: 'rgba(206, 159, 71, 1)'
              }}>
                <div className="p-3 surface-card h-full" style={{ 
                  background: 'linear-gradient(90deg, rgba(206, 159, 71, 1), rgba(206, 159, 71, 1)',
                  //borderRadius: '8px'
                }}>
                  <div className="flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '3.5rem',
                      height: '3.5rem',
                      borderRadius: '10px',
                      background: 'rgba(143, 175, 196, 1)'
                    }}>
                      <Link href="/user/paciente/login" onClick={() => setLoading(true)}>
                        <i className="pi pi-fw pi-users text-2xl"></i>
                      </Link>
                  </div>
                  <h5 className="mb-2 text-900" style={shortStack.style}>Paciente</h5>
                  <span className="text-900" style={shortStack.style}>Ingrese al sistema como paciente</span>
                </div>
              </div>
            </div>

            <div className="col-12 md:col-12 lg:col-5 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
              <div style={{
                height: '160px',
                padding: '2px',
                borderRadius: '10px',
                background: 'rgba(206, 159, 71, 1)'
              }}>
                <div className="p-3 surface-card h-full" style={{ 
                  borderRadius: '8px', 
                  background: 'linear-gradient(90deg, rgba(206, 159, 71, 1), rgba(206, 159, 71, 1)',
                }}>
                  <div className="flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '3.5rem',
                      height: '3.5rem',
                      borderRadius: '10px',
                      background: 'rgba(143, 175, 196, 1)'
                    }}>
                    <i className="pi pi-fw pi-plus text-2xl" onClick={() => setDisplayBasic(true)}></i>

                    <Dialog header={<p style={shortStack.style}>Ingresar como...</p>} visible={displayBasic} 
                      style={{ width: '30vw', background: 'rgba(255, 255, 255, 1)' }} modal onHide={() => setDisplayBasic(false)}>
                      <div className="flex flex-column align-items-center justify-content-center">
                        <div className="mb-2">
                          <Button style={{
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)'
                          }}
                          onClick={() => {
                            setLoading(true);
                            router.push('/user/medico/login');
                          }}><p style={shortStack.style}>Médico</p></Button>
                        </div>
                        <div className="mb-2">
                          <Button style={{
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)'
                          }}
                          onClick={() => {
                            setLoading(true);
                            router.push('/user/recepcionista/login');
                          }}><p style={shortStack.style}>Recepcionista</p></Button>
                        </div>
                        <div className="mb-2">
                          <Button style={{
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)'
                          }}
                          onClick={() => {
                            setLoading(true);
                            router.push('/user/admin/login');
                          }}><p style={shortStack.style}>Administrador</p></Button>
                        </div>
                      </div>
                    </Dialog>
                  </div>
                  <h5 className="mb-2 text-900" style={shortStack.style}>Consultorio</h5>
                  <span className="text-900" style={shortStack.style}>Ingrese al sistema como empleado</span>
                </div>
              </div>
            </div>

            {/**********PETICIÓN**********/}
            <div className="col-12 text-center mt-8 mb-4" style={shortStack.style}>
              <h2 className="text-900 font-normal mb-4">Para registrar su consultorio al sistema</h2>
              <h5 className="text-900 font-normal">Lea el siguiente <a href='https://drive.google.com/file/d/1y_VUOfWPL8UxWbZ_cTzUqzMaaZtNe_Ni/view?usp=sharing' target="_blank" >documento</a> y envíe a edgar.carrarco@ucb.edu.bo la siguiente información:</h5>
              {/*<h6>{nombre !== "" ? "Nombre de Consultorio: " + nombre : ""}</h6>
              <h6>{especialidad.id !== "" ? "Especialidad: " + especialidad.nombre : ""}</h6>
              <h6>{direccion !== "" ? "Dirección: " + direccion : ""}</h6>
              <h6>{nit !== "" ? "NIT: " + nit : ""}</h6>
                        <h6>{turnos.length > 1 ? "Número de Turnos: " + (turnos.length - 1) : ""}</h6>*/}
              <div className="p-fluid formgrid grid text-900">
                <div className="field col-12 md:col-6">
                  <label htmlFor="nombre">Nombre</label>
                  <InputText id="nombre" type="text" value={nombreRec}
                    onChange={(e) => {setNombreRec(e.target.value)}} 
                    className={invNombreRec ? "p-invalid" : ""} style={{ 
                      borderRadius: '15px',
                      background: 'rgba(206, 159, 71, 1)',
                      borderColor: 'rgba(206, 159, 71, 1)',
                      color: 'rgba(41, 49, 51, 1)'
                    }}/>
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="apellido">Apellido</label>
                  <InputText id="apellido" type="text" value={apellido}
                    onChange={(e) => {setApellido(e.target.value)}} 
                    className={invApellido ? "p-invalid" : ""} style={{ 
                      borderRadius: '15px',
                      background: 'rgba(206, 159, 71, 1)',
                      borderColor: 'rgba(206, 159, 71, 1)',
                      color: 'rgba(41, 49, 51, 1)'
                    }}/>
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="email">Email</label>
                  <InputText id="email" type="email" value={email}
                    onChange={(e) => {setEmail(e.target.value)}} 
                    className={invEmail ? "p-invalid" : ""} style={{ 
                      borderRadius: '15px',
                      background: 'rgba(206, 159, 71, 1)',
                      borderColor: 'rgba(206, 159, 71, 1)',
                      color: 'rgba(41, 49, 51, 1)'
                    }}/>
                </div>
                {/*<div className="field col-12 md:col-6">
                  <label htmlFor="externo">Rol de Usuario:</label>
                  <div className="col-12 md:col-3">
                    <div className="field-radiobutton mb-1">
                      <RadioButton inputId="med" name="option" value="Médico" 
                        checked={rol === "Médico"} className={invRol ? "p-invalid" : ""}
                        onChange={(e) => setRol(e.value)}/>
                      <label htmlFor="med">Médico</label>
                    </div>
                    <div className="field-radiobutton mb-1">
                      <RadioButton inputId="rec" name="option" value="Recepcionista" 
                        checked={rol === "Recepcionista"} className={invRol ? "p-invalid" : ""}
                        onChange={(e) => setRol(e.value)} />
                      <label htmlFor="rec">Recepcionista</label>
                    </div>
                  </div>
                  </div>*/}
                <div className="field col-12 md:col-6"> 
                  <label htmlFor="nombre">Nombre de Consultorio</label>
                  <InputText id="nombre" type="text" value={nombre}
                    onChange={(e) => {setNombre(e.target.value)}} 
                    className={invNombre ? "p-invalid" : ""} style={{ 
                      borderRadius: '15px',
                      background: 'rgba(206, 159, 71, 1)',
                      borderColor: 'rgba(206, 159, 71, 1)',
                      color: 'rgba(41, 49, 51, 1)'
                    }}/>
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="especialidad">Especialidad</label>
                  <Dropdown id="especialidad" value={especialidad} options={especialidades} 
                        optionLabel="nombre" style={{ 
                          borderRadius: '15px',
                          background: 'rgba(206, 159, 71, 1)',
                          borderColor: 'rgba(206, 159, 71, 1)',
                          color: 'rgba(41, 49, 51, 1)'
                        }} 
                        className={invEspecialidad ? "p-invalid" : ""}
                        onChange={(e) => {
                          setEspecialidad(e.value);
                          setEspecializacion(e.value.nombre);
                        }}></Dropdown>
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="direccion">Dirección</label>
                  <InputText id="direccion" type="text" value={direccion}
                    onChange={(e) => {setDireccion(e.target.value)}} 
                    className={invDireccion ? "p-invalid" : ""} style={{ 
                      borderRadius: '15px',
                      background: 'rgba(206, 159, 71, 1)',
                      borderColor: 'rgba(206, 159, 71, 1)',
                      color: 'rgba(41, 49, 51, 1)'
                    }}/>
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="nit">NIT</label>
                  <InputText id="nit" type="text" value={nit}
                    onChange={(e) => {setNit(e.target.value)}} 
                    className={invNit ? "p-invalid" : ""} style={{ 
                      borderRadius: '15px',
                      background: 'rgba(206, 159, 71, 1)',
                      borderColor: 'rgba(206, 159, 71, 1)',
                      color: 'rgba(41, 49, 51, 1)'
                    }}/>
                </div>
              </div>

              <div className="p-fluid formgrid grid" >
                <div className="field col-12 md:col-12">
                  <DataView value={turnos} layout={layout} itemTemplate={itemTemplate}/>
                  <Dialog header="Nuevo Turno" visible={display} onHide={() => setDisplay(false)} style={shortStack.style}>
                    <div className="p-fluid formgrid" >
                      <div className="field col-12 md:col-12">
                        <label htmlFor="etiqueta">Etiqueta</label>
                        <InputText id="etiqueta" type="text" value={etiqueta}
                          onChange={(e) => setEtiqueta(e.target.value)}
                          className={invEtiqueta ? "p-invalid" : ""} style={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 0.5)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}/>
                      </div>
                      <div className="field col-12 md:col-12">
                        <label htmlFor="hentrada">Hora de Entrada</label>
                        <Calendar value={new Date('July 1, 1999, ' + horaEntrada)} timeOnly
                          onChange={(e) => setHoraEntrada(e.value?.toLocaleString().split(" ")[1] ?? "")} 
                          className={invHoraEntrada ? "p-invalid" : ""} inputStyle={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 0.5)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}/>
                      </div>
                      <div className="field col-12 md:col-12">
                        <label htmlFor="hsalida">Hora de Salida</label>
                        <Calendar value={new Date('July 1, 1999, ' + horaSalida)} timeOnly
                          onChange={(e) => setHoraSalida(e.value?.toLocaleString().split(" ")[1] ?? "")} 
                          className={invHoraSalida ? "p-invalid" : ""} inputStyle={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 0.5)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}/>
                      </div>
                      <div className="field col-12 md:col-12">
                        <label htmlFor="mcitas">Máximo de Citas</label>
                        <InputNumber value={maxCitas} min={0} max={100} 
                          onChange={(e) => setMaxCitas(e.value)}
                          className={invMaxCitas ? "p-invalid" : ""} inputStyle={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 0.5)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}/>
                      </div>
                      <div className="field col-12 md:col-12">
                        <label htmlFor="etiqueta">Tiempo de la Consulta</label>
                        <InputText value={tiempoConsulta as string} 
                          onChange={(e) => setTiempoConsulta(parseInt(e.target.value, 10))} 
                          className={invTiempoConsulta ? "p-invalid" : ""} style={{ 
                            borderTopRightRadius: '15px',
                            borderTopLeftRadius: '15px',
                            background: 'rgba(206, 159, 71, 0.5)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}/>
                        <Slider value={tiempoConsulta as number} onChange={(e) => setTiempoConsulta(e.value as number)} min={10}
                          className={invTiempoConsulta ? "p-invalid" : ""} style={{ 
                            color: 'rgba(206, 159, 71, 1)'
                          }}/>
                      </div>
                      <div className="field col-12 md:col-12 justify-content-center">
                        <Button className="justify-content-center" style={{ 
                          borderRadius: '20px',
                          background: 'rgba(51, 107, 134, 1)',
                          borderColor: 'rgba(51, 107, 134, 1)'
                        }} onClick={añadir_turno}><p style={shortStack.style}>Crear Nuevo Turno</p></Button>
                      </div>
                    </div>
                  </Dialog>
                </div>
              </div>

              <Button 
                disabled={
                  nombreRec == "" ||
                  apellido == "" ||
                  email == "" ||
                  nombre == "" ||
                  especialidad.id == "" ||
                  direccion == "" ||
                  nit == "" ||
                  turnos.length <= 1
                } 
                style={{ 
                  background: 'rgba(206, 159, 71, 1)',
                  borderColor: 'rgba(206, 159, 71, 1)',
                  color: 'rgba(41, 49, 51, 1)'
                }}
                onClick={() =>  {
                  var mssg = 'Hola, quisiera registrar mi consultorio en el sistema con los siguientes datos:\n' + 
                  'Nombre: ' + nombreRec + '\n' +
                  'Apellido: ' + apellido + '\n' +
                  'Email: ' + apellido + '\n' +
                  'Nombre Consultorio: ' + nombre + '\n' +
                  'Especialidad: ' + especialidad.nombre + '\n' +
                  'Dirección: ' + direccion + '\n' +
                  'NIT: ' + nit + '\n' + 
                  'Número de turnos:' + (turnos.length - 1) + '\n';

                  for(var i = 0; i < turnos.length - 1; i++){
                    mssg += '/**********/' + '\n' + 
                    'Turno ' + turnos[i].etiqueta + '\n' +
                    'Hora de Entrada: ' + turnos[i].hora_entrada + '\n' +
                    'Hora de Salida: ' + turnos[i].hora_salida + '\n' +
                    'Máximo de Citas: ' + turnos[i].max_citas + '\n' +
                    'Tiempo de la Consulta: ' + turnos[i].tiempo_consulta + 'min\n'
                  };

                  mssg += 'He leído el documento de LIBERACIÓN DE RESPONSABILIDADES y acepto su contenido.';

                  navigator.clipboard.writeText(mssg);
                }}>
                Copiar a Portapapeles
              </Button>
            </div>  
          </div>
        </div>
      </div>
    </div>
  )
}
