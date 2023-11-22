'use client'
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from 'next/navigation';
import jwt_decode from "jwt-decode";
import localfont from 'next/font/local';

import { Button } from 'primereact/button';
import { Calendar } from "primereact/calendar";
import { classNames } from 'primereact/utils';
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Slider } from "primereact/slider";

import { LayoutContext } from '@/layout/context/layoutcontext';
import Acceso_Denegado from "../../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";

import get_especialidades from "../../utils/get_especialidades_handler";
import post_consultorio from "../../utils/post_consultorio_handler";
import Navbar_Admin from "../../navbar";

const shortStack = localfont({ src: "../../../../../../fonts/ShortStack-Regular.ttf" });

const Nuevo_Consultorio = () => {
  const router = useRouter();

  const [denegado, setDenegado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [display, setDisplay] = useState(false);
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
  const [turnos, setTurnos] = useState<any[]>([
  /*{
    "etiqueta":"Turno Único",
    "max_citas":7,
    "hora_entrada":"2:09:08",
    "hora_salida":"19:33:36",
    "tiempo_consulta":26
  },*/
  undefined
  ]);

  const { layoutConfig } = useContext(LayoutContext);
  const containerClassName = classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', { 
    'p-input-filled': layoutConfig.inputStyle === 'filled' 
  });

  var token: any = {};

  useEffect(() => {
    try {
      token = jwt_decode(document.cookie.replace("token=", ""));
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

        post_consultorio(new_consultorio).then(() => router.push('/user/admin/inicio'));
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
          background: 'rgba(143, 175, 196, 1)'
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
    <div className="col-12 lg:col-4" style={{
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
        return dataviewAddItem();
    }

    if (layout === 'list') {
        return dataviewListItem(data);
    } else if (layout === 'grid') {
        return dataviewGridItem(data);
    }
  };

  return (denegado ? 
  <><Acceso_Denegado /></> : 
  <div style={{
    background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)',
    //height: window.innerHeight
  }}>
    {/*<Navbar tipo_usuario="admin"/>*/}
    <Navbar_Admin />
    { loading ? 
      <div className={containerClassName}><ProgressSpinner /></div> :
      <div className="grid" style={{
        background: 'linear-gradient(180deg, rgba(143, 175, 196, 1) 10%, rgba(143, 175, 196, 1) 30%)'
      }}>
        <div className="col-12" style={shortStack.style}>
          <div className="card" style={{
            background: 'rgba(143, 175, 196, 1)',
            borderColor: 'rgba(143, 175, 196, 1)'
          }}>
            <h5>Crear Consultorio</h5>
            <div className="p-fluid formgrid grid">
              <div className="field col-12 md:col-6">
                <label htmlFor="nombre">Nombre</label>
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
            <h5>Crear Turnos</h5>
            <div className="p-fluid formgrid grid" >
              <div className="field col-12 md:col-12" >
                <DataView value={turnos} layout={layout} itemTemplate={itemTemplate}></DataView>
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
              <div className="field col-12 md:col-12">
                <Button className="justify-content-center" style={{ 
                        borderRadius: '20px',
                        background: 'rgba(51, 107, 134, 1)',
                        borderColor: 'rgba(51, 107, 134, 1)',
                        color: 'rgba(143, 175, 196, 1)'
                      }} onClick={guardar}><p style={shortStack.style}>Guardar Nuevo Consultorio</p></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  </div>)
}

export default Nuevo_Consultorio;