'use client'
import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import jwt_decode from "jwt-decode";
import localfont from 'next/font/local';

import Acceso_Denegado from "../acceso_denegado";

import { Button } from "primereact/button";
import { BlockUI } from "primereact/blockui";
import { Calendar } from "primereact/calendar";
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';

import { LayoutContext } from '@/layout/context/layoutcontext';
import Navbar from "@/app/(project)/components/navbar/page";

import get_especialidades from "../utils/get_especialidades_handler";
import get_una_cita from "../utils/get_cita_handler";
import get_un_consultorio from "../utils/get_consultorio_handler";
import get_consultorio_especialidad from "../utils/get_consultorio_especialidad_handler";
import put_cita from "../utils/put_cita_handler";
import get_citas_fecha_consultorio from "../utils/get_citas_fecha_y_consultorio_handler";
import Navbar_Paciente from "../navbar";

const shortStack = localfont({ src: "../../../../../fonts/ShortStack-Regular.ttf" });

const Ver_Cita = () => {
  const [denegado, setDenegado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editar, setEditar] = useState(false);
  const [invalidoEsp, setInvalidoEsp] = useState(false);
  const [invalidoCons, setInvalidoCons] = useState(false);
  const [invalidoFecha, setInvalidoFecha] = useState(false);
  const [displayCancelar, setDisplayCancelar] = useState(false);

  const toast = useRef<Toast>(null);
  
  const [consultorios, setConsultorios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  
  const [fecha, setFecha] = useState<string | Date | Date[] | null>(null);
  
  const [radioValue, setRadioValue] = useState("Si"); 
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

  const [cita, setCita] = useState({
    cita_estado: 0,
    consultorio_id: "",
    estado: true,
    externa: false,
    fecha_actualizacion: "",
    fecha_cita: "",
    hora_cita: "",
    fecha_creacion: "",
    historial_id: "",
    id: "",
    nombre_paciente: "",
    apellido_paciente: "",
    num_ficha: 0
  });
  
  const [consultorio, setConsultorio] = useState({
    id: "",
    nombre: "",
    especializacion: "",
    direccion: "",
    extera: true,
    max_citas: 0,
    fecha_creacion: "",
    fecha_actualizacion: "",
    estado: false
  });

  const [especialidad, setEspecialidad] = useState({
    id: "",
    nombre: "",
    fecha_creacion: "",
    fecha_actualizacion: "",
    estado: false
  });

  const { layoutConfig } = useContext(LayoutContext);

  const router = useRouter();
  const containerClassName = classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  var token: any = {};

  useEffect(() => {
    try {
      token = jwt_decode(document.cookie.replace("token=", ""));
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id') ?? "";

      if(id !== ""){
        get_una_cita(id).then(data => {
          setCita(data);
          /*setNombre(token['given_name']);
          setApellido(token['family_name']);*/
          get_un_consultorio(data.consultorio_id).then(data => {
            setConsultorio(data);
            setLoading(false);
          })
        });
      }
    } catch (error) {
      setDenegado(true);
    }
  },[]);
  

  const edicion = () => {
    setLoading(true);
    setEditar(true);

    get_un_consultorio(cita.consultorio_id).then(cons => {
      get_especialidades().then(esp => {
        setEspecialidades(esp);
        esp.forEach((item: any) => {
          if(item.nombre === cons.especializacion){
            get_consultorio_especialidad(item.nombre).then(c => {
              const [dia, mes, ano] = cita.fecha_cita.split('/');

              setConsultorios(c);
              setEspecialidad(item);
              setConsultorio(cons);
              setFecha(new Date(+ano, +mes - 1, +dia));

              if(cita.externa === true){
                setRadioValue("Si");
                setNombre(token['given_name']);
                setApellido(token['family_name']);
              }else if (cita.externa === false){
                setRadioValue("No");
                const nombres = cita.nombre_paciente.split(" ", 5)
                const l_nombres = nombres.length % 2 === 0 ? 
                  (nombres.length / 2) : 
                  (nombres.length / 2 - 0.5);

                var n = "";
                var a = "";

                nombres.slice(0, l_nombres).forEach((item: any) => n = n + item + " ");
                nombres.slice(l_nombres, nombres.length).forEach((item: any) => a = a + item + " ");

                setNombre(n.trimEnd());
                setApellido(a.trimEnd());
              }

              setLoading(false);
            });
          };
        });
      });
    });
  }

  const actualizar_cita = () => {
    setLoading(true);

    var externa = true;

    if(especialidad.id === ''){
      setInvalidoEsp(true);
      setInvalidoCons(true);
      setLoading(false);
    }else 
      setInvalidoEsp(false);

    if(consultorio.id === ''){
      setInvalidoCons(true);
      setLoading(false);
    }else 
      setInvalidoCons(false); 
      
    if(fecha === null){
      setInvalidoFecha(true);
      setLoading(false);
    }else
      setInvalidoFecha(false);


    if(cita.fecha_cita !== fecha?.toLocaleString().replace(", 00:00:00", "")){
      get_citas_fecha_consultorio(fecha?.toLocaleString().replace(", 00:00:00", ""), consultorio.id).then(data => {
        if(data.length < consultorio.max_citas){
          const body  = {
            nombre_paciente: nombre + " " + apellido,
            fecha_cita: fecha?.toLocaleString().replace(", 00:00:00", ""),
            externa: externa,
            num_ficha: data.length + 1
          }

          console.log(body);

          put_cita(cita.id, body).then(() => {
            setLoading(false);
            router.push("/user/paciente/citas/pendientes");
          });
        }else if(data.length === consultorio.max_citas){
          toast.current?.show({
            severity: 'error',
            summary: 'Fecha llena',
            detail: 'La fecha elegida ya no tiene espacio, por favor seleccione otra',
            life: 5000
          });
          setLoading(false);
        }
      })
    }else{
      const body = {
        nombre_paciente: nombre + " " + apellido,
        fecha_cita: fecha?.toLocaleString().replace(", 00:00:00", ""),
        externa: externa
      }

      console.log(body);

      put_cita(cita.id, body).then(() => {
        setLoading(false);
        router.push("/user/paciente/citas/pendientes");
      });
    }
  }

  const cancelar_cita = () => {
    setLoading(true);
    put_cita(cita.id, { cita_estado: -1 }).then(() => router.push("/user/paciente/citas/pendientes"));
  }

  const set_consultorios = (opcion: any) => {
    setEspecialidad(opcion);
    get_consultorio_especialidad(opcion.nombre).then(data => setConsultorios(data));
  }

  const cambiar_externa = (opcion: any) => {
    setRadioValue(opcion);

    if(opcion === "Si"){
      setNombre(token['given_name'])
      setApellido(token['family_name'])
    }else if(opcion === "No"){
      const nombres = cita.nombre_paciente.split(" ", 5)
      const l_nombres = nombres.length % 2 === 0 ? 
        (nombres.length / 2) : 
        (nombres.length / 2 - 0.5);

        var n = "";
        var a = "";

        nombres.slice(0, l_nombres).forEach((item: any) => n = n + item + " ");
        nombres.slice(l_nombres, nombres.length).forEach((item: any) => a = a + item + " ");

        setNombre(n.trimEnd());
        setApellido(a.trimEnd());
    }
  }

  return (denegado ? <><Acceso_Denegado /></> : 
    <div style={{
      background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)'
    }}>
      {/*<Navbar tipo_usuario="paciente" />*/}
      <Navbar_Paciente />
      { loading === true ? 
      (<div className={containerClassName}><ProgressSpinner /></div>) : 
      (<div className="grid" style={{
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
              <div className="field col-12 md:col-12">
                <div className="flex align-items-center justify-content-center">
                  <div className="surface-0" style={{
                    background: 'linear-gradient(180deg, rgba(143, 175, 196, 1) 10%, rgba(143, 175, 196, 1) 30%)'
                  }}>
                    <div className="font-medium text-3xl text-900 mb-3">
                      Información de la Cita
                    </div>
                    <ul className="list-none p-0 m-0 mb-3">
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-700 w-6 md:w-6 font-medium">Nombre del Paciente</div>
                        <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                          { cita.nombre_paciente } { cita.apellido_paciente }
                        </div>
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-700 w-6 md:w-6 font-medium">Número de Ficha</div>
                        <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                          { cita.num_ficha }
                        </div>
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-700 w-6 md:w-6 font-medium">Fecha</div>
                        <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                          { cita.fecha_cita }
                        </div>
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-700 w-6 md:w-6 font-medium">Hora</div>
                        <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                          { cita.hora_cita }
                        </div>
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-700 w-6 md:w-6 font-medium">Consultorio</div>
                        <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                          { consultorio.nombre }
                        </div>
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-700 w-6 md:w-6 font-medium">Especialidad</div>
                        <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                          { consultorio.especializacion }
                        </div>
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                        <div className="text-700 w-6 md:w-2 font-medium">Creación y Actualización</div>
                        <div className="mr-5 flex align-items-center mt-3">
                          <i className="pi pi-calendar mr-2"></i>
                          <span>Fecha Creación: { new Date(cita.fecha_creacion).toLocaleDateString() }</span>
                        </div>
                        <div className="mr-5 flex align-items-center mt-3">
                          <i className="pi pi-globe mr-2"></i>
                          <span>Última Actualización: { new Date(cita.fecha_actualizacion).toLocaleDateString() }</span>
                        </div>
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                        <div className="w-6 md:w-12">
                          <Button label="Cancelar Cita" onClick={cancelar_cita} style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}></Button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>)}
  </div>)
}

export default Ver_Cita;