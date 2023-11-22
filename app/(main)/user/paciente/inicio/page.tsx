'use client'
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import jwt_decode from "jwt-decode";
import localfont from 'next/font/local';

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { classNames } from 'primereact/utils';
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from 'primereact/dropdown';
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from "primereact/sidebar";

import { LayoutContext } from '@/layout/context/layoutcontext';
import Acceso_Denegado from "../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";

import get_un_historial from "../utils/get_historial_handler";
import put_historial from "../utils/put_historial_handler";
import post_historial from "../utils/post_historial_handler";
import { Accordion, AccordionTab } from "primereact/accordion";
import Navbar_Paciente from "../navbar";

const shortStack = localfont({ src: "../../../../../fonts/ShortStack-Regular.ttf" });

const Inicio_Paciente = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [denegado, setDenegado] = useState(false);
  const [verDep, setVerDep] = useState(false);
  const [displatDep, setDisplayDep] = useState(false);
  const [displayNewDep, setDisplayNewDep] = useState(false);
  const [invalidoNombreDep, setInvalidoNombreDep] = useState(false);
  const [invalidoApellidoDep, setInvalidoApellidoDep] = useState(false);
  const [invalidoNacimiento, setInvalidoNacimiento] = useState(false);
  const [invalidoSexo, setInvalidoSexo] = useState(false);
  const [invalidoCivil, setInvalidoCivil] = useState(false);
  const [invalidoCi, setInvalidoCi] = useState(false);
  const [invalidoTelefono, setInvalidoTelefono] = useState(false);
  const [invalidoDireccion, setInvalidoDireccion] = useState(false);
  const [invalidoNacionalidad, setInvalidoNacionalidad] = useState(false);
  const [editar, setEditar] = useState(false);
  
  const [fecha, setFecha] = useState<string | Date | Date[] | null>(null);
  const [fechaDep, setFechaDep] = useState<string | Date | Date[] | null>(null);

  const opciones_sexo = ["", "Femenino", "Masculino"];
  const opciones_civil = ["", "Solter@", "Casad@", "Divorciad@"];
  
  const [nombreDep, setNombreDep] = useState("");
  const [apellidoDep, setApellidoDep] = useState("");

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [nacimiento, setNacimiento] = useState("");
  const [sexo, setSexo] = useState("");
  const [civil, setCivil] = useState("");
  const [ci, setCi] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  
  const [historiales, setHistoriales] = useState<any | null>([]);

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

  const [dependiente, setDependiente] = useState({
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
    a_patologicos: "",
    a_no_patologicos: "",
    a_quirurgicos: "",
    a_alergicos: "",
    med_habitual: "",
    dependientes: [],
    fecha_creacion: "",
    fecha_actualizacion: "",
  });

  const { layoutConfig } = useContext(LayoutContext);
  const containerClassName = 
    classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', 
    { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  var token: any = {};

  useEffect(() => {
    var dep: any = [];

    try {
      token = jwt_decode(document.cookie.replace("token=", ""));

      get_un_historial(token['custom:historial'])
      .then(data => {
        if(data !== undefined) setHistorial(data);
        else setDenegado(true);

        data.dependientes.forEach((item: any) => {
          get_un_historial(item).then(data => dep.push(data));
        });

        setHistoriales(dep)

        setLoading(false);
      })
    } catch (error) {
      setDenegado(true)
    }
  } ,[0]);

  const ver_dependiente = (rowData: any) => {
    setDisplayDep(true);
    setDependiente(rowData.data);
  }

  const agregar_dependiente = () => {
    setLoading(true);

    if(nombreDep !== "" && apellidoDep !== "" && nacimiento !== ""
      && sexo !== "" && civil !== "" && ci !== ""
      && telefono !== "" && direccion !== "" && nacionalidad !== ""){
      const body_historial = {
        nombre: nombreDep,
        apellido: apellidoDep,
        nacimiento: nacimiento,
        sexo: sexo,
        estado_civil: civil,
        ci: ci,
        telefono: telefono,
        direccion: direccion,
        nacionalidad: nacionalidad,
        a_patologicos: "",
        a_no_patologicos: "",
        a_quirurgicos: "",
        a_alergicos: "",
        med_habitual: "",
        dependientes: []
      }      
    
      post_historial(body_historial).then(data => {
        historial.dependientes.push(data.historial.id);
        put_historial(historial.id, historial).then(() => location.reload());
      });
    }

    if(nombreDep === ""){
      setInvalidoNombreDep(true);
      setLoading(false);
    }else
      setInvalidoNombreDep(false);

    if(apellidoDep === ""){
      setInvalidoApellidoDep(true);
      setLoading(false);
    }else
      setInvalidoApellidoDep(false);

    if(nacimiento === ""){
      setInvalidoNacimiento(true);
      setLoading(false);
    }else
      setInvalidoNacimiento(false);

    if(sexo === ""){
      setInvalidoSexo(true);
      setLoading(false);
    }else
      setInvalidoSexo(false);

    if(civil === ""){
      setInvalidoCivil(true);
      setLoading(false);
    }else
      setInvalidoCivil(false);

    if(ci === ""){
      setInvalidoCi(true);
      setLoading(false);
    }else
      setInvalidoCi(false);

    if(telefono === ""){
      setInvalidoTelefono(true);
      setLoading(false);
    }else
      setInvalidoTelefono(false);

    if(direccion === ""){
      setInvalidoDireccion(true);
      setLoading(false);
    }else
      setInvalidoDireccion(false);

    if(nacionalidad === ""){
      setInvalidoNacionalidad(true);
      setLoading(false);
    }else
      setInvalidoNacionalidad(false);
  }

  return (denegado ? <><Acceso_Denegado /></> : 
  <div style={{
    background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)',
    //height: window.innerHeight
  }}>
    {/*<Navbar tipo_usuario="paciente"/>*/}
    <Navbar_Paciente />
    {loading === true ? 
    (<div className={containerClassName}><ProgressSpinner /></div>) : 
    (<div className="grid" style={{
      background: 'rgba(143, 175, 196, 1)',
      height: '100vh'
    }}>
      <div className="col-12">
        <div className="card" style={{
          background: 'rgba(143, 175, 196, 1)',
          borderColor: 'rgba(143, 175, 196, 1)'
        }}>
          <div className="p-fluid formgrid grid" style={shortStack.style}>
            <div className="field col-12 md:col-12" >
              <div className="flex align-items-center justify-content-center" >
                <div className="surface-0" style={{
                  background: 'linear-gradient(180deg, rgba(143, 175, 196, 1) 10%, rgba(143, 175, 196, 1) 30%)'
                }}>
                  <div className="font-medium text-3xl text-900 mb-3" >
                    Información de Usuario
                  </div>
                  <ul className="list-none p-0 m-0 mb-3">
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-600 text-2xl w-6 md:w-6 font-medium">Nombre</div>
                      <div className="text-900 text-2xl md:w-6 md:flex-order-0 flex-order-1">
                        { historial.nombre }
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-600 text-2xl w-6 md:w-6 font-medium">Apellido</div>
                      <div className="text-900 text-2xl md:w-6 md:flex-order-0 flex-order-1">
                        { historial.apellido }
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-600 text-2xl w-6 md:w-6 font-medium">Fecha de Nacimiento</div>
                      <div className="text-900 text-2xl md:w-6 md:flex-order-0 flex-order-1">
                        { historial.nacimiento }
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-600 text-2xl w-6 md:w-6 font-medium">C.I.</div>
                      <div className="text-900 text-2xl md:w-6 md:flex-order-0 flex-order-1">
                        { historial.ci }
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-600 text-2xl w-6 md:w-6 font-medium">Sexo</div>
                      <div className="text-900 text-2xl md:w-6 md:flex-order-0 flex-order-1">
                        { historial.sexo }
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-600 text-2xl w-6 md:w-6 font-medium">Estado Civil</div>
                      <div className="text-900 text-2xl md:w-6 md:flex-order-0 flex-order-1">
                        { historial.estado_civil }
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-600 text-2xl w-6 md:w-6 font-medium">Teléfono</div>
                      <div className="text-900 text-2xl md:w-6 md:flex-order-0 flex-order-1">
                        { historial.telefono }
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-600 text-2xl w-6 md:w-6 font-medium">Dirección</div>
                      <div className="text-900 text-2xl md:w-6 md:flex-order-0 flex-order-1">
                        { historial.direccion }
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-600 text-2xl w-6 md:w-6 font-medium">Nacionalidad</div>
                      <div className="text-900 text-2xl md:w-6 md:flex-order-0 flex-order-1">
                        { historial.nacionalidad }
                      </div>
                    </li>
                    <li className="flex align-items-center border-top-1 border-300 flex-wrap" >
                      <div className="md:w-12 md:flex-order-0 flex-order-1">
                        <Accordion style={shortStack.style}>
                          <AccordionTab header="Dependientes" className="text-600 font-medium">
                            <DataTable value={historiales} showGridlines paginator selectionMode="single"
                              rows={5} dataKey="id" emptyMessage="No tiene dependientes" 
                              onRowClick={ver_dependiente} style={shortStack.style}>
                              <Column field="nombre" header="Nombre" />
                              <Column field="apellido" header="Apellido" />
                              <Column field="codigo" header="Código" />
                              <Column field="ci" header="C.I." />
                            </DataTable>
                            <Button label="Agregar Dependiente" onClick={() => setDisplayNewDep(true)}></Button>
                            <Sidebar visible={displayNewDep} onHide={() => setDisplayNewDep(false)} baseZIndex={1000} fullScreen>
                              <div className="grid">
                                <div className="col-12">
                                  <div className="card">
                                    <h5>Agregar Dependiente</h5>
                                    <div className="p-fluid formgrid grid">
                                      <div className="field col-12 md:col-6">
                                        <label htmlFor="nombreDep">Nombre del Dependiente</label>
                                        <InputText id="nombreDep" type="text" value={ nombreDep } placeholder="Nombre" 
                                          onChange={(e) => setNombreDep(e.target.value)} className={invalidoNombreDep ? "p-invalid" : ""}/>
                                      </div>
                                      <div className="field col-12 md:col-6">
                                        <label htmlFor="apellidoDep">Apellido del Dependiente</label>
                                        <InputText id="apellidoDep" type="text" value={ apellidoDep } placeholder="Apellido"
                                          onChange={(e) => setApellidoDep(e.target.value)} className={invalidoApellidoDep ? "p-invalid" : ""}/>
                                      </div>
                                      <div className="field col-12 md:col-6">
                                        <label htmlFor="telefono">Teléfono</label>
                                        <InputText id="telefono" type="text" value={ telefono } placeholder="Teléfono" 
                                          onChange={(e) => setTelefono(e.target.value)} className={invalidoTelefono ? "p-invalid" : ""}/>
                                      </div>
                                      <div className="field col-12 md:col-6">
                                        <label htmlFor="direccion">Dirección</label>
                                        <InputText id="direccion" type="text" value={ direccion } placeholder="Dirección"
                                          onChange={(e) => setDireccion(e.target.value)} className={invalidoDireccion ? "p-invalid" : ""}/>
                                      </div>
                                      <div className="field col-12 md:col-6">
                                        <label htmlFor="fecha">Fecha de Nacimiento</label>
                                        <Calendar id="fecha" value={ fechaDep } showButtonBar
                                          onChange={(e) => {
                                            const date: any = e.value;
                                            setFechaDep(e.value ?? null);
                                            setNacimiento(date?.toLocaleString().replace(", 00:00:00", ""));
                                          }} className={invalidoNacimiento ? "p-invalid" : ""}/>
                                      </div>
                                      <div className="field col-12 md:col-6">
                                        <label htmlFor="ci">Carnet de Identidad</label>
                                        <InputText id="ci" type="text" value={ ci } className={invalidoCi ? "p-invalid" : ""}
                                          onChange={(e) => setCi(e.target.value)} placeholder="C.I."/>
                                      </div>
                                      <div className="field col-12 md:col-6">
                                        <label htmlFor="sexo">Sexo</label>
                                        <Dropdown value={ sexo } options={ opciones_sexo } className={invalidoSexo ? "p-invalid" : ""}
                                          onChange={(event) => {setSexo(event.target.value)}} 
                                          placeholder="Sexo"/>
                                      </div>
                                      <div className="field col-12 md:col-6">
                                        <label htmlFor="civil">Estado Civil</label>
                                        <Dropdown id="civil" value={ civil } options={ opciones_civil } 
                                          onChange={(event) => {setCivil(event.target.value)}} 
                                          placeholder="Estado Civil" className={invalidoCivil ? "p-invalid" : ""}/>
                                      </div>
                                      <div className="field col-12 md:col-6">
                                        <label htmlFor="nacionalidad">Nacionalidad</label>
                                        <InputText id="nacionalidad" type="text" value={ nacionalidad } placeholder="Nacionalidad"
                                          onChange={(e) => setNacionalidad(e.target.value)} className={invalidoNacionalidad ? "p-invalid" : ""}/>
                                      </div>
                                      <div className="field col-12 md:col-12">
                                        <Button label="Crear Usuario" className="p-3 text-xl" loading={loading} 
                                          onClick={agregar_dependiente}></Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Sidebar>
                            <Dialog header={dependiente.nombre + " " + dependiente.apellido} visible={displatDep} 
                              onHide={() => setDisplayDep(false)}>
                              <div className="flex align-items-center justify-content-center">
                                <div className="surface-0">
                                  <ul className="list-none p-0 m-0 mb-3">
                                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                      <div className="text-500 w-6 md:w-6 font-medium">Código</div>
                                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                        { dependiente.codigo }
                                      </div>
                                    </li>
                                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                      <div className="text-500 w-6 md:w-6 font-medium">Fecha de Nacimiento</div>
                                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                        { dependiente.nacimiento }
                                      </div>
                                    </li>
                                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                      <div className="text-500 w-6 md:w-6 font-medium">C.I.</div>
                                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                        { dependiente.ci }
                                      </div>
                                    </li>
                                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                      <div className="text-500 w-6 md:w-6 font-medium">Sexo</div>
                                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                        { dependiente.sexo }
                                      </div>
                                    </li>
                                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                      <div className="text-500 w-6 md:w-6 font-medium">Estado Civil</div>
                                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                        { dependiente.estado_civil }
                                      </div>
                                    </li>
                                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                      <div className="text-500 w-6 md:w-6 font-medium">Teléfono</div>
                                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                        { dependiente.telefono }
                                      </div>
                                    </li>
                                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                      <div className="text-500 w-6 md:w-6 font-medium">Dirección</div>
                                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                        { dependiente.direccion }
                                      </div>
                                    </li>
                                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                      <div className="text-500 w-6 md:w-6 font-medium">Nacionalidad</div>
                                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                        { dependiente.nacionalidad }
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </Dialog>
                          </AccordionTab>
                        </Accordion>
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                      <div className="text-600 w-6 md:w-2 font-medium">Creación y Actualización</div>
                      <div className="mr-5 flex align-items-center mt-3">
                        <i className="pi pi-calendar mr-2"></i>
                        <span>Fecha Creación: { new Date(historial.fecha_creacion).toLocaleDateString() }</span>
                      </div>
                      <div className="mr-5 flex align-items-center mt-3">
                        <i className="pi pi-globe mr-2"></i>
                        <span>Última Actualización: { new Date(historial.fecha_actualizacion).toLocaleDateString() }</span>
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
  </div>);
}

export default Inicio_Paciente;