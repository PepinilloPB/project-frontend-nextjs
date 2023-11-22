'use client'
import React, { useEffect, useState, useRef, useContext } from "react";
import { useRouter } from 'next/navigation';
import jwt_decode from "jwt-decode";
import localfont from 'next/font/local';

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { classNames } from 'primereact/utils';
import { Chip } from "primereact/chip";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Slider } from "primereact/slider";

import { LayoutContext } from '@/layout/context/layoutcontext';
import Acceso_Denegado from "../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";

import get_un_consultorio from "../../paciente/utils/get_consultorio_handler";
import put_consultorio from "../utils/put_consultorio_handler";
import get_especialidades from "../utils/get_especialidades_handler";
import Navbar_Admin from "../navbar";

const shortStack = localfont({ src: "../../../../../fonts/ShortStack-Regular.ttf" });

const Ver_Consultorio = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [denegado, setDenegado] = useState(false);
  const [display, setDisplay] = useState(false);
  const [editarNombreConsultorio, setEditarNombreConsultorio] = useState(false);
  const [editarEspecialidad, setEditarEspecialidad] = useState(false);
  const [editarDireccion, setEditarDireccion] = useState(false);
  const [editarNit, setEditarNit] = useState(false);
  const [editarHoraEntrada, setEditarHoraEntrada] = useState(false);
  const [editarHoraSalida, setEditarHoraSalida] = useState(false);
  const [editarMaxCitas, setEditarMaxCitas] = useState(false);
  const [editarTiempoConsulta, setEditarTiempoConsulta] = useState(false);

  const [nombreConsultorio, setNombreConsultorio] = useState("");
  const [especializacion, setEspecializacion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nit, setNit] = useState("");
  const [turnos, setTurnos] = useState<any[]>([]);
  const [horaEntrada, setHoraEntrada] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [maxCitas, setMaxCitas] = useState<number | null>(0);
  const [tiempoConsulta, setTiempoConsulta] = useState<number | string>('');

  const [posTurno, setPosTurno] = useState(0);

  const [consultorio, setConsultorio] = useState({
    id: "",
    nombre: "",
    especializacion: "",
    direccion: "",
    nit: "",
    num_turnos: 0,
    turnos: [{
      etiqueta: "",
      max_citas: 0,
      hora_entrada: "",
      hora_salida: "",
      tiempo_consulta: 0,
      tiempo_maximo: 0
    }],
    fecha_creacion: "",
    fecha_actualizacion: "",
    estado: false
  });
  const [turno, setTurno] = useState({
    etiqueta: "",
    max_citas: 0,
    hora_entrada: "",
    hora_salida: "",
    tiempo_consulta: 0,
    tiempo_maximo: 0
  });
  const [especialidad, setEspecialidad] = useState({
    id: "",
    nombre: "",
    fecha_creacion: "",
    fecha_actualizacion: "",
    estado: false
  });

  const [especialidades, setEspecialidades] = useState([]);
  
  const { layoutConfig } = useContext(LayoutContext);
  const containerClassName = 
    classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', 
    { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  var token: any = {};

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') ?? "";

    try {
      token = jwt_decode(document.cookie.replace("token=", ""));
      get_un_consultorio(id).then(data => {
        setConsultorio(data);
        setNombreConsultorio(data.nombre);
        setDireccion(data.direccion);
        setNit(data.nit);
        setTurnos(data.turnos);

        get_especialidades().then(value => {
          setEspecialidades(value);

          value.forEach((item: any) => {
            if(item.nombre === data.especializacion){
              setEspecialidad(item);
              setEspecializacion(item.nombre);
            }
          });
        }).then(() => setLoading(false));
      });
    } catch (error) {
      setDenegado(true);
    }
  },[]);

  const guardar = () => {
    setLoading(true);

    for(var i = 0; i < turnos.length; i++){
      var h_entrada = new Date('July 1, 1999, ' + turnos[i].hora_entrada);
      var h_salida = new Date('July 1, 1999, ' + turnos[i].hora_salida);

      turnos[i].tiempo_maximo = Math.floor( new Date((h_salida.getTime() - h_entrada.getTime()) / 
        turnos[i].max_citas).getTime() / 60000 );

      if(turnos[i].tiempo_maximo < turnos[i].tiempo_consulta)
        turnos[i].tiempo_consulta = turnos[i].tiempo_maximo;
    }

    const body_consultorio = {
      nombre: nombreConsultorio,
      especializacion: especializacion,
      direccion: direccion,
      nit: nit,
      turnos: turnos
    }

    put_consultorio(consultorio.id, body_consultorio).then(() => location.reload());
  }

  const eliminar = () => {
    setLoading(true);

    consultorio.estado = false;

    put_consultorio(consultorio.id, consultorio).then(() => router.push('/user/admin/inicio'));
  }

  return (denegado ? 
  <><Acceso_Denegado /></> : 
  <div style={{
    background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)',
    //height: window.innerHeight
  }}>
    {/*<Navbar tipo_usuario="admin" />*/}
    <Navbar_Admin />
    { loading ? 
    <div className={containerClassName}><ProgressSpinner /></div> : 
    (<div className="grid" style={{
      background: 'rgba(143, 175, 196, 1)',
    }}>
      <div className="col-12">
        <div className="card" style={{
          background: 'rgba(143, 175, 196, 1)',
          borderColor: 'rgba(143, 175, 196, 1)'
        }}>
          <div className="p-fluid formgrid grid" style={shortStack.style}>
            <div className="field col-12 md:col-12">
              <div className="flex align-items-center justify-content-center">
                <div className="surface-0" style={{
                  background: 'linear-gradient(180deg, rgba(143, 175, 196, 1) 10%, rgba(143, 175, 196, 1) 30%)'
                }}>
                  <div className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap font-medium text-3xl text-900">
                    <div className="font-medium text-3xl text-900 w-6 md:w-10">Información de Consultorio</div>
                    <div className="w-6 md:w-2 flex justify-content-end">
                      <Button icon="pi pi-times" severity="danger" className="p-button-text"
                        onClick={eliminar}/>
                    </div>
                  </div>
                  <ul className="list-none p-0 m-0 mb-3">
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-2 font-medium">Nombre</div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        { editarNombreConsultorio ? 
                        (<InputText value={ nombreConsultorio } 
                          onChange={(e) => setNombreConsultorio(e.target.value)}  
                          style={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}/>) : 
                        consultorio.nombre }
                      </div>
                      { editarNombreConsultorio ? 
                      (<div className="w-6 md:w-2 flex justify-content-end">
                        <Button icon="pi pi-check" rounded text severity="success"
                          onClick={guardar} />
                        <Button icon="pi pi-times" rounded text severity="danger"
                          onClick={() => setEditarNombreConsultorio(false)} />
                      </div>) : 
                      (<div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                          onClick={() => setEditarNombreConsultorio(true)}
                          style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}/>
                      </div>)}
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-2 font-medium">Especialidad</div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        { editarEspecialidad ? 
                        (<Dropdown id="especialidad" value={especialidad} options={especialidades} 
                          optionLabel="nombre"  style={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}
                          onChange={(e) => {
                            setEspecialidad(e.value);
                            setEspecializacion(e.value.nombre)
                          }} ></Dropdown>) : 
                        consultorio.especializacion }
                      </div>
                      { editarEspecialidad ? 
                      (<div className="w-6 md:w-2 flex justify-content-end">
                        <Button icon="pi pi-check" rounded text severity="success"
                          onClick={guardar} />
                        <Button icon="pi pi-times" rounded text severity="danger"
                          onClick={() => setEditarEspecialidad(false)} />
                      </div>) : 
                      (<div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                          onClick={() => setEditarEspecialidad(true)}
                          style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}/>
                      </div>)}
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-2 font-medium">Dirección</div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        { editarDireccion ? 
                        (<InputText value={ direccion } onChange={(e) => setDireccion(e.target.value)}  
                        style={{ 
                          borderRadius: '15px',
                          background: 'rgba(206, 159, 71, 1)',
                          borderColor: 'rgba(206, 159, 71, 1)',
                          color: 'rgba(41, 49, 51, 1)'
                        }}/>) :
                        consultorio.direccion }
                      </div>
                      { editarDireccion ? 
                      (<div className="w-6 md:w-2 flex justify-content-end">
                        <Button icon="pi pi-check" rounded text severity="success"
                          onClick={guardar} />
                        <Button icon="pi pi-times" rounded text severity="danger"
                          onClick={() => setEditarDireccion(false)} />
                      </div>) : 
                      (<div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                          onClick={() => setEditarDireccion(true)}
                          style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}/>
                      </div>)}
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-2 font-medium">NIT</div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        { editarNit ? 
                        (<InputText value={ nit } onChange={(e) => setNit(e.target.value)} 
                        style={{ 
                          borderRadius: '15px',
                          background: 'rgba(206, 159, 71, 1)',
                          borderColor: 'rgba(206, 159, 71, 1)',
                          color: 'rgba(41, 49, 51, 1)'
                        }}/>) : 
                        consultorio.nit }
                      </div>
                      { editarNit ? 
                      (<div className="w-6 md:w-2 flex justify-content-end">
                        <Button icon="pi pi-check" rounded text severity="success"
                          onClick={guardar} />
                        <Button icon="pi pi-times" rounded text severity="danger"
                          onClick={() => setEditarNit(false)} />
                      </div>) : 
                      (<div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                          onClick={() => setEditarNit(true)}
                          style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}/>
                      </div>)}
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-2 font-medium">Turnos</div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3" 
                      >
                        { consultorio.turnos.map((item, i) => {
                          return (<Chip key={i} label={item.etiqueta} onClick={() => {
                            setTurno(item);
                            setPosTurno(i);
                            setHoraEntrada(item.hora_entrada);
                            setHoraSalida(item.hora_salida);
                            setMaxCitas(item.max_citas);
                            setDisplay(true);
                          }} className="mr-2"
                          style={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}></Chip>);
                        }) }
                        
                        <Dialog header={"Turno: " + turno.etiqueta} visible={display} style={shortStack.style} 
                          onHide={() => setDisplay(false)} modal>
                          <ul className="list-none p-0 m-0">
                            { editarHoraEntrada ? 
                            (<li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                              <div className="flex justify-content-end md:w-8 md:flex-order-0 flex-order-1">
                                <Calendar value={new Date('July 1, 1999, ' + horaEntrada)} timeOnly
                                  onChange={(e) => {
                                    setHoraEntrada(e.value?.toLocaleString().split(" ")[1] ?? "");
                                    turnos[posTurno].hora_entrada =  e.value?.toLocaleString().split(" ")[1] ?? "";

                                    var h_entrada = new Date('July 1, 1999, ' + turnos[posTurno].hora_entrada);
                                    var h_salida = new Date('July 1, 1999, ' + turnos[posTurno].hora_salida);

                                    turnos[posTurno].tiempo_maximo = Math.floor( new Date((h_salida.getTime() - h_entrada.getTime()) / 
                                      turnos[posTurno].max_citas).getTime() / 60000 );

                                    if(turnos[posTurno].tiempo_maximo < turnos[posTurno].tiempo_consulta)
                                      turnos[posTurno].tiempo_consulta = turnos[posTurno].tiempo_maximo;
                                  }} />
                              </div>
                              <div className="md:w-4 flex justify-content-end">
                                <Button icon="pi pi-check" rounded text severity="success"
                                  onClick={guardar}/>
                                <Button icon="pi pi-times" rounded text severity="danger"
                                  onClick={() => setEditarHoraEntrada(false)}/>
                              </div>
                            </li>) : 
                            (<li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                              <div className="text-500 w-6 md:w-4 font-medium">Hora de Entrada</div>
                              <div className="text-900 md:w-5 md:flex-order-0 flex-order-1">
                                { turno.hora_entrada }
                              </div>
                              <div className="w-6 md:w-2 flex justify-content-end">
                                <Button icon="pi pi-pencil" rounded text 
                                  onClick={() => setEditarHoraEntrada(true)} />
                              </div>
                            </li>)}
                            { editarHoraSalida ? 
                            (<li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                              <div className="flex justify-content-end md:w-8 md:flex-order-0 flex-order-1">
                                <Calendar value={new Date('July 1, 1999, ' + horaSalida)} timeOnly
                                  onChange={(e) => {
                                    setHoraSalida(e.value?.toLocaleString().split(" ")[1] ?? "");
                                    turnos[posTurno].hora_salida =  e.value?.toLocaleString().split(" ")[1] ?? "";

                                    var h_entrada = new Date('July 1, 1999, ' + turnos[posTurno].hora_entrada);
                                    var h_salida = new Date('July 1, 1999, ' + turnos[posTurno].hora_salida);

                                    turnos[posTurno].tiempo_maximo = Math.floor( new Date((h_salida.getTime() - h_entrada.getTime()) / 
                                      turnos[posTurno].max_citas).getTime() / 60000 );

                                    if(turnos[posTurno].tiempo_maximo < turnos[posTurno].tiempo_consulta)
                                      turnos[posTurno].tiempo_consulta = turnos[posTurno].tiempo_maximo;
                                  }} />
                              </div>
                              <div className="md:w-4 flex justify-content-end">
                                <Button icon="pi pi-check" rounded text severity="success"
                                  onClick={guardar}/>
                                <Button icon="pi pi-times" rounded text severity="danger"
                                  onClick={() => setEditarHoraSalida(false)}/>
                              </div>
                            </li>) : 
                            (<li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                              <div className="text-500 w-6 md:w-4 font-medium">Hora de Salida</div>
                              <div className="text-900 md:w-5 md:flex-order-0 flex-order-1">
                                { turno.hora_salida }
                              </div>
                              <div className="w-6 md:w-2 flex justify-content-end">
                                <Button icon="pi pi-pencil" rounded text 
                                  onClick={() => setEditarHoraSalida(true)}/>
                              </div>
                            </li>)}
                            { editarMaxCitas ? 
                            (<li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                              <div className="flex justify-content-end md:w-8 md:flex-order-0 flex-order-1">
                                <InputNumber value={maxCitas} min={0} max={100} 
                                  onChange={(e) => {
                                    setMaxCitas(e.value);
                                    turnos[posTurno].max_citas = e.value; 
                                  }}/>
                              </div>
                              <div className="md:w-4 flex justify-content-end">
                                <Button icon="pi pi-check" rounded text severity="success"
                                  onClick={guardar}/>
                                <Button icon="pi pi-times" rounded text severity="danger"
                                  onClick={() => setEditarMaxCitas(false)}/>
                              </div>
                            </li>) : 
                            (<li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                              <div className="text-500 w-6 md:w-4 font-medium"># Citas</div>
                              <div className="text-900 md:w-5 md:flex-order-0 flex-order-1">
                                { turno.max_citas } fichas
                              </div>
                              <div className="w-6 md:w-2 flex justify-content-end">
                                <Button icon="pi pi-pencil" rounded text 
                                onClick={() => setEditarMaxCitas(true)}/>
                              </div>
                            </li>)}
                            { editarTiempoConsulta ? 
                            (<li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                              <div className="flex justify-content-end md:w-8 md:flex-order-0 flex-order-1">
                                <div>
                                <InputText value={tiempoConsulta as string} 
                                  onChange={(e) => {
                                    setTiempoConsulta(parseInt(e.target.value, 10));
                                    turnos[posTurno].tiempo_consulta = parseInt(e.target.value, 10);
                                  }} />
                                <Slider value={tiempoConsulta as number} onChange={(e) => {
                                  setTiempoConsulta(e.value as number);
                                  turnos[posTurno].tiempo_consulta = e.value as number;
                                  }} 
                                  max={turno.tiempo_maximo} min={10}/>
                                </div>
                              </div>
                              <div className="md:w-4 flex justify-content-end">
                                <Button icon="pi pi-check" rounded text severity="success"
                                  onClick={guardar}/>
                                <Button icon="pi pi-times" rounded text severity="danger"
                                  onClick={() => setEditarTiempoConsulta(false)}/>
                              </div>
                            </li>) : 
                            (<li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                              <div className="text-500 w-6 md:w-4 font-medium">Tiempo de Consulta</div>
                              <div className="text-900 md:w-5 md:flex-order-0 flex-order-1">
                                { turno.tiempo_consulta } min
                              </div>
                              <div className="w-6 md:w-2 flex justify-content-end">
                                <Button icon="pi pi-pencil" rounded text 
                                  onClick={() => setEditarTiempoConsulta(true)}/>
                              </div>
                            </li>)}
                          </ul>
                        </Dialog>
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-2 font-medium">Creación y Actualización</div>
                      <div className="mr-5 flex align-items-center mt-3">
                        <i className="pi pi-calendar mr-2"></i>
                        <span>Fecha Creación: { new Date(consultorio.fecha_creacion).toLocaleDateString() }</span>
                      </div>
                      <div className="mr-5 flex align-items-center mt-3">
                        <i className="pi pi-globe mr-2"></i>
                        <span>Última Actualización: { new Date(consultorio.fecha_actualizacion).toLocaleDateString() }</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>) }
  </div>)
}

export default Ver_Consultorio;