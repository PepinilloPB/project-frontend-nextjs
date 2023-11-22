'use client'
import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import jwt_decode from "jwt-decode";
import axios from "axios";
import localfont from 'next/font/local';

import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { classNames } from 'primereact/utils';
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from "primereact/sidebar";

import { LayoutContext } from '@/layout/context/layoutcontext';
import Acceso_Denegado from "../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";

import get_un_historial from "../util/get_un_historial_handler";
import post_historial from "../util/post_historial_handler";
import put_historial from "../util/put_historial_handler";
import get_citas_historial from "../util/get_citas_historial_handler";
import get_nombres from "../util/get_nombres_archivos_handler";
import get_archivo from "../util/get_archivo_handler";
import Navbar_Medico from "../navbar";

const shortStack = localfont({ src: "../../../../../fonts/ShortStack-Regular.ttf" });

const Ver_Historial = () => {
  //const fs = require('fs');

  const MAX_IMAGE_SIZE = 100000000
  
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [denegado, setDenegado] = useState(false);
  const [displayDep, setDisplayDep] = useState(false);
  const [displayDia, setDisplayDia] = useState(false);
  const [displayNewDep, setDisplayNewDep] = useState(false);
  const [invalidoNombreDep, setInvalidoNombreDep] = useState(false);
  const [invalidoApellidoDep, setInvalidoApellidoDep] = useState(false);
  const [invalidoNacimientoDep, setInvalidoNacimientoDep] = useState(false);
  const [invalidoSexoDep, setInvalidoSexoDep] = useState(false);
  const [invalidoCivilDep, setInvalidoCivilDep] = useState(false);
  const [invalidoCiDep, setInvalidoCiDep] = useState(false);
  const [invalidoTelefonoDep, setInvalidoTelefonoDep] = useState(false);
  const [invalidoDireccionDep, setInvalidoDireccionDep] = useState(false);
  const [invalidoNacionalidadDep, setInvalidoNacionalidadDep] = useState(false);
  const [editarNombre, setEditarNombre] = useState(false);
  const [editarApellido, setEditarApellido] = useState(false);
  const [editarNacimiento, setEditarNacimiento] = useState(false);
  const [editarCi, setEditarCi] = useState(false);
  const [editarSexo, setEditarSexo] = useState(false);
  const [editarCivil, setEditarCivil] = useState(false);
  const [editarTelefono, setEditarTelefono] = useState(false);
  const [editarDireccion, setEditarDireccion] = useState(false);
  const [editarNacionalidad, setEditarNacionalidad] = useState(false);
  const [editarNombreDep, setEditarNombreDep] = useState(false);
  const [editarApellidoDep, setEditarApellidoDep] = useState(false);
  const [editarNacimientoDep, setEditarNacimientoDep] = useState(false);
  const [editarCiDep, setEditarCiDep] = useState(false);
  const [editarSexoDep, setEditarSexoDep] = useState(false);
  const [editarCivilDep, setEditarCivilDep] = useState(false);
  const [editarTelefonoDep, setEditarTelefonoDep] = useState(false);
  const [editarDireccionDep, setEditarDireccionDep] = useState(false);
  const [editarNacionalidadDep, setEditarNacionalidadDep] = useState(false);
  const [subirArchivo, setSubirArchivo] = useState(false);

  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [nacimiento, setNacimiento] = useState("");
  const [sexo, setSexo] = useState("");
  const [civil, setCivil] = useState("");
  const [ci, setCi] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [nombreDep, setNombreDep] = useState("");
  const [apellidoDep, setApellidoDep] = useState("");
  const [nacimientoDep, setNacimientoDep] = useState("");
  const [sexoDep, setSexoDep] = useState("");
  const [civilDep, setCivilDep] = useState("");
  const [ciDep, setCiDep] = useState("");
  const [telefonoDep, setTelefonoDep] = useState("");
  const [direccionDep, setDireccionDep] = useState("");
  const [nacionalidadDep, setNacionalidadDep] = useState("");

  const [fecha, setFecha] = useState<string | Date | Date[] | null>(null);
  const [fechaDep, setFechaDep] = useState<string | Date | Date[] | null>(null);
  
  const [historiales, setHistoriales] = useState<any | null>([]);
  const [citas, setCitas] = useState<any | null>([]);
  const [filesAnt, setFilesAnt] = useState<any[]>([]);
  const [filesAntSubidos, setFilesAntSubidos] = useState<any[]>([]);
  const [filesDiagSubidos, setFilesDiagSubidos] = useState<any[]>([]);
  const [base64Ant, setBase64Ant] = useState<String[]>([]);

  const opciones_sexo = ["", "Femenino", "Masculino"];
  const opciones_civil = ["", "Solter@", "Casad@", "Divorciad@"];

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
    a_patologicos: "",
    a_no_patologicos: "",
    a_quirurgicos: "",
    a_alergicos: "",
    med_habitual: "",
    dependientes: [""],
    fecha_creacion: "",
    fecha_actualizacion: "",
    estado: 0
  });
  const [dependiente, setDependiente] = useState({
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
    a_patologicos: "",
    a_no_patologicos: "",
    a_quirurgicos: "",
    a_alergicos: "",
    med_habitual: "",
    dependientes: [],
    fecha_creacion: "",
    fecha_actualizacion: "",
  });
  const [cita, setCita] = useState({
    historial_id: "",
    nombre_paciente: "",
    apellido_paciente: "",
    cita_estado: 0, 
    fecha_cita: "",
    hora_cita: "",
    num_ficha: 0,
    externa: false,
    motivos_consulta: "",
    examen_fisico: "",
    diagnostico: "",
    tratamiento: "",
    fecha_creacion: "",
    fecha_actualizacion: ""
  });

  const { layoutConfig } = useContext(LayoutContext);
  const containerClassName = 
    classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', 
    { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  var token: any = {};

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setId(params.get('id') ?? "");

    var dep: any = [];

    try {
      token = jwt_decode(document.cookie.replace("token=", ""));
      get_un_historial(params.get('id') ?? "").then(data => {
        setHistorial(data);
        setNombre(data.nombre);
        setApellido(data.apellido);
        setNacimiento(data.nacimiento);

        const [day, month, year] = data.nacimiento.split('/');
        setFecha(new Date(+year, +month - 1, +day));

        setCi(data.ci);
        setSexo(data.sexo);
        setCivil(data.estado_civil);
        setTelefono(data.telefono);
        setDireccion(data.direccion);
        setNacionalidad(data.nacionalidad);

        data.dependientes.forEach((item: any) => {
          get_un_historial(item).then(data => dep.push(data));
        });

        setHistoriales(dep);

        get_nombres(data.id, "ant").then(data => {
          var f: any = [];

          data.map((item: String, i: any) => {
            f.push({nombre: item.split("/")[item.split("/").length - 1]})
          });

          setFilesAntSubidos(f);
        });

        get_citas_historial(data.id).then(data => {
          setCitas(data);
        }).then(() => setLoading(false));
      })
    } catch (error) {
      setDenegado(true);
    }
  }, []);

  const ver_dependiente = (rowData: any) => {
    setDisplayDep(true);
    setDependiente(rowData.data);
    setNombreDep(rowData.data.nombre);
    setApellidoDep(rowData.data.apellido);
    setNacimientoDep(rowData.data.nacimiento);

    const [day, month, year] = rowData.data.nacimiento.split('/');
    setFechaDep(new Date(+year, +month - 1, +day));

    setCiDep(rowData.data.ci);
    setSexoDep(rowData.data.sexo);
    setCivilDep(rowData.data.estado_civil);
    setTelefonoDep(rowData.data.telefono);
    setDireccionDep(rowData.data.direccion);
    setNacionalidadDep(rowData.data.nacionalidad);
  }

  const ver_diagnostico = (rowData: any) => {
    setDisplayDia(true);
    setCita(rowData.data);

    //console.log("diag/" + rowData.data.fecha_cita.replaceAll("/", "-"));
    get_nombres(historial.id, "diag*" + rowData.data.fecha_cita.replaceAll("/", "-"))
      .then(data => {
        var f: any = [];

          data.map((item: String, i: any) => {
            f.push({nombre: item.split("/")[item.split("/").length - 1]})
          });


          setFilesDiagSubidos(f);
      });
  }

  const agregar_dependiente = () => {
    setLoading(true);

    if(nombreDep !== "" && apellidoDep !== "" && nacimientoDep !== ""
      && sexoDep !== "" && civilDep !== "" && ciDep !== ""
      && telefonoDep !== "" && direccionDep !== "" && nacionalidadDep !== ""){
      const body_historial = {
        nombre: nombreDep,
        apellido: apellidoDep,
        nacimiento: nacimientoDep,
        sexo: sexoDep,
        estado_civil: civilDep,
        ci: ciDep,
        telefono: telefonoDep,
        direccion: direccionDep,
        nacionalidad: nacionalidadDep,
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
      setInvalidoNacimientoDep(true);
      setLoading(false);
    }else
      setInvalidoNacimientoDep(false);

    if(sexo === ""){
      setInvalidoSexoDep(true);
      setLoading(false);
    }else
      setInvalidoSexoDep(false);

    if(civil === ""){
      setInvalidoCivilDep(true);
      setLoading(false);
    }else
      setInvalidoCivilDep(false);

    if(ci === ""){
      setInvalidoCiDep(true);
      setLoading(false);
    }else
      setInvalidoCiDep(false);

    if(telefono === ""){
      setInvalidoTelefonoDep(true);
      setLoading(false);
    }else
      setInvalidoTelefonoDep(false);

    if(direccion === ""){
      setInvalidoDireccionDep(true);
      setLoading(false);
    }else
      setInvalidoDireccionDep(false);

    if(nacionalidad === ""){
      setInvalidoNacionalidadDep(true);
      setLoading(false);
    }else
      setInvalidoNacionalidadDep(false);
  }

  const guardar_historial = () => {
    setLoading(true);

    const body = {
      nombre: nombre,
      apellido: apellido,
      nacimiento: nacimiento,
      sexo: sexo,
      estado_civil: civil,
      ci: ci,
      telefono: telefono,
      direccion: direccion,
      nacionalidad: nacionalidad
    }

    put_historial(historial.id, body).then(() => location.reload());
  }

  const guardar_dependiente = () => {
    setLoading(true);

    const body = {
      nombre: nombreDep,
      apellido: apellidoDep,
      nacimiento: nacimientoDep,
      sexo: sexoDep,
      estado_civil: civilDep,
      ci: ciDep,
      telefono: telefonoDep,
      direccion: direccionDep,
      nacionalidad: nacionalidadDep
    }

    put_historial(dependiente.id, body).then(() => location.reload());
  }

  const subir_archivos = async (e: any) => {
    setLoading(true);

    for(let i = 0; i < base64Ant.length; i++){
      let binario = atob(base64Ant[i].split(",")[1]);

      let array = [];

      for (let j = 0; j < binario.length; j++) {
        array.push(binario.charCodeAt(j))
      }
  
      let blobData = new Blob([new Uint8Array(array)], {type: filesAnt[i].type});

      try {
        await axios.post('https://5m67p1dww2.execute-api.us-west-2.amazonaws.com/dev/archivo', filesAnt[i])
          .then(async response => {
            const url = response.data.url;
            await axios.put(url, blobData).then(response => console.log(response))
          })
          .then(() => setLoading(false));
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  const crear_archivos_antecedentes = (files: any[]) => {
    for(let i = 0; i < files.length; i++){
      let reader = new FileReader();

      reader.onload = (e: any) => {
        if (e.target.result.length > MAX_IMAGE_SIZE) {
          return alert('Archivo ' + i + ' es muy grande')
        }

        const archivo: any = {
          name: files[i].name,
          type: files[i].type,
          id: historial.id,
          origen: "historiales",
          carpeta: "/ant"
        }
  
        setBase64Ant(state => [...state, e.target.result]);
        setFilesAnt(state => [...state, archivo]);
      };

      reader.readAsDataURL(files[i])
    }
  }

  const crear_archivos_diagnosticos = (files: any[], fecha: String) => {
    for(let i = 0; i < files.length; i++){
      let reader = new FileReader();

      reader.onload = (e: any) => {
        if (e.target.result.length > MAX_IMAGE_SIZE) {
          return alert('Archivo ' + i + ' es muy grande')
        }

        const archivo: any = {
          name: files[i].name,
          type: files[i].type,
          id: historial.id,
          origen: "historiales",
          carpeta: "/diag/" + fecha
        }
  
        setBase64Ant(state => [...state, e.target.result]);
        setFilesAnt(state => [...state, archivo]);
      };

      reader.readAsDataURL(files[i])
    }
  }

  const obtener_archivo = (dir: String, name: String) => {
    setLoading(true);

    try {
      get_archivo(historial.id, dir, name).then(data => {
        const link = document.createElement('a');
        link.href = data;
        link.click();
      }).then(() => setLoading(false))
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (denegado ? 
  <><Acceso_Denegado /></> : 
  <div style={{
    background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)',
    //height: window.innerHeight
  }}>
    {/*<Navbar tipo_usuario="medico"/>*/}
    <Navbar_Medico />
    { loading === true ? 
    <div className={containerClassName}><ProgressSpinner /></div> :
    <div className="grid" style={{
      background: 'rgba(143, 175, 196, 1)',
      height: '100%'
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
                  <div className="font-medium text-3xl text-900 mb-3">
                    Información de Historial
                  </div>
                  <ul className="list-none p-0 m-0 mb-3">
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-4 font-medium">Código</div>
                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                      { historial.codigo }
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-4 font-medium">Nombre</div>
                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                      { editarNombre ? 
                        <InputText value={ nombre } 
                          onChange={(e) => setNombre(e.target.value)} style={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}/> :
                        historial.nombre }
                      </div>
                      { editarNombre ? 
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button icon="pi pi-check" rounded text severity="success"
                          onClick={guardar_historial}/>
                        <Button icon="pi pi-times" rounded text severity="danger"
                          onClick={() => setEditarNombre(false)} />
                      </div> : 
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                          onClick={() => setEditarNombre(true)} style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}/>
                      </div>}
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-4 font-medium">Apellido</div>
                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                      { editarApellido ? 
                        <InputText value={ apellido } 
                          onChange={(e) => setApellido(e.target.value)} style={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}/> :
                        historial.apellido }
                      </div>
                      { editarApellido ? 
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button icon="pi pi-check" rounded text severity="success"
                          onClick={guardar_historial}/>
                        <Button icon="pi pi-times" rounded text severity="danger"
                          onClick={() => setEditarApellido(false)} />
                      </div> : 
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                          onClick={() => setEditarApellido(true)} style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}/>
                      </div>}
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-4 font-medium">Fecha de Nacimiento</div>
                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                      { editarNacimiento ? 
                        <Calendar id="fecha" value={ fecha } showButtonBar className="w-full md:w-30rem mb-3"
                          onChange={(e) => {
                            const date: any = e.value;
                            setFecha(e.value ?? null);
                            setNacimiento(date?.toLocaleString().replace(", 00:00:00", ""));}} inputStyle={{ 
                              borderRadius: '15px',
                              background: 'rgba(206, 159, 71, 1)',
                              borderColor: 'rgba(206, 159, 71, 1)',
                              color: 'rgba(41, 49, 51, 1)'
                            }}/> :
                        historial.nacimiento }
                      </div>
                      { editarNacimiento ? 
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button icon="pi pi-check" rounded text severity="success"
                          onClick={guardar_historial}/>
                        <Button icon="pi pi-times" rounded text severity="danger"
                          onClick={() => setEditarNacimiento(false)} />
                      </div> : 
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                          onClick={() => setEditarNacimiento(true)} style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}/>
                      </div>}
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-4 font-medium">C.I.</div>
                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                      { editarCi ? 
                        <InputText value={ ci } 
                          onChange={(e) => setCi(e.target.value)} style={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}/> :
                        historial.ci }
                      </div>
                      { editarCi ? 
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button icon="pi pi-check" rounded text severity="success"
                          onClick={guardar_historial}/>
                        <Button icon="pi pi-times" rounded text severity="danger"
                          onClick={() => setEditarCi(false)} />
                      </div> : 
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                          onClick={() => setEditarCi(true)} style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}/>
                      </div>}
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-4 font-medium">Sexo</div>
                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                      { editarSexo ? 
                        <Dropdown value={ sexo } options={ opciones_sexo } className={invalidoSexoDep ? "p-invalid" : ""}
                          onChange={(event) => {setSexo(event.target.value)}} 
                          placeholder="Sexo" style={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}/> :
                        historial.sexo }
                      </div>
                      { editarSexo ? 
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button icon="pi pi-check" rounded text severity="success"
                          onClick={guardar_historial}/>
                        <Button icon="pi pi-times" rounded text severity="danger"
                          onClick={() => setEditarSexo(false)} />
                      </div> : 
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                          onClick={() => setEditarSexo(true)} style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}/>
                      </div>}
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-4 font-medium">Estado Civil</div>
                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                      { editarCivil ? 
                        <Dropdown id="civil" value={ civil } options={ opciones_civil } 
                          onChange={(event) => {setCivil(event.target.value)}} 
                          placeholder="Estado Civil" style={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}/> :
                          historial.estado_civil }
                      </div>
                      { editarCivil ? 
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button icon="pi pi-check" rounded text severity="success"
                          onClick={guardar_historial}/>
                        <Button icon="pi pi-times" rounded text severity="danger"
                          onClick={() => setEditarCivil(false)} />
                      </div> : 
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                          onClick={() => setEditarCivil(true)} style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}/>
                      </div>}
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-4 font-medium">Teléfono</div>
                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                      { editarTelefono ? 
                        <InputText value={ telefono } 
                          onChange={(e) => setTelefono(e.target.value)} style={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}/> :
                        historial.telefono }
                      </div>
                      { editarTelefono ? 
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button icon="pi pi-check" rounded text severity="success"
                          onClick={guardar_historial}/>
                        <Button icon="pi pi-times" rounded text severity="danger"
                          onClick={() => setEditarTelefono(false)} />
                      </div> : 
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                          onClick={() => setEditarTelefono(true)} style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}/>
                      </div>}
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-4 font-medium">Dirección</div>
                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                      { editarDireccion ? 
                        <InputText value={ direccion } 
                          onChange={(e) => setDireccion(e.target.value)} style={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}/> :
                        historial.direccion }
                      </div>
                      { editarDireccion ? 
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button icon="pi pi-check" rounded text severity="success"
                          onClick={guardar_historial}/>
                        <Button icon="pi pi-times" rounded text severity="danger"
                          onClick={() => setEditarDireccion(false)} />
                      </div> : 
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                          onClick={() => setEditarDireccion(true)} style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}/>
                      </div>}
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-4 font-medium">Nacionalidad</div>
                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                      { editarNacionalidad ? 
                        <InputText value={ nacionalidad } 
                          onChange={(e) => setNacionalidad(e.target.value)} style={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}/> :
                        historial.nacionalidad }
                      </div>
                      { editarNacionalidad ? 
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button icon="pi pi-check" rounded text severity="success"
                          onClick={guardar_historial}/>
                        <Button icon="pi pi-times" rounded text severity="danger"
                          onClick={() => setEditarNacionalidad(false)} />
                      </div> : 
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                          onClick={() => setEditarNacionalidad(true)} style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}/>
                      </div>}
                    </li>
                    <li className="flex align-items-center border-top-1 border-300 flex-wrap">
                      <div className="md:w-12 md:flex-order-0 flex-order-1">
                        <Accordion style={shortStack.style}>
                          <AccordionTab header="Antecedentes Médicos">
                            <Accordion style={shortStack.style}>
                              <AccordionTab header="Antecedentes Patológicos">
                                <p>{ historial.a_patologicos }</p>
                              </AccordionTab>
                              <AccordionTab header="Antecedentes No Patológicos">
                                <p>{ historial.a_no_patologicos }</p>
                              </AccordionTab>
                              <AccordionTab header="Antecedentes Quirúrgicos">
                                <p>{ historial.a_quirurgicos }</p>
                              </AccordionTab>
                              <AccordionTab header="Antecedentes Alérgicos">
                                <p>{ historial.a_alergicos }</p>
                              </AccordionTab>
                              <AccordionTab header="Medicación Habitual">
                                <p>{ historial.med_habitual }</p>
                              </AccordionTab>
                              <AccordionTab header="Archivos de Antecedentes">
                                <DataTable value={filesAntSubidos} showGridlines paginator selectionMode="single"
                                  rows={5} emptyMessage="No tiene archivos guardados" 
                                  onRowClick={(e) => obtener_archivo("ant", e.data.nombre)}>
                                  <Column header="Nombre" field="nombre"></Column>
                                </DataTable>
                                <Button label="Subir Archivos" onClick={() => setSubirArchivo(true)}></Button>
                                <Dialog onHide={() => setSubirArchivo(false)} visible={subirArchivo}>
                                  <div className="field col-12 md:col-12">
                                    <label>Archivos</label>
                                    <FileUpload name="demo[]" multiple accept="*" customUpload 
                                      onSelect={(e) => crear_archivos_antecedentes(e.files)}
                                      uploadHandler={subir_archivos}
                                      chooseLabel="Añadir Archivo"
                                      uploadLabel="Subir Archivos"
                                      cancelLabel="Cancelar"
                                      onClear={() => {
                                        setBase64Ant([]); 
                                        setFilesAnt([]);
                                      }}/>
                                  </div>
                                </Dialog>
                              </AccordionTab>
                            </Accordion>
                          </AccordionTab>
                        </Accordion>
                      </div>
                    </li>
                    <li className="flex align-items-center border-top-1 border-300 flex-wrap">
                      <div className="md:w-12 md:flex-order-0 flex-order-1">
                        <Accordion style={shortStack.style}>
                          <AccordionTab header="Diagnósticos Médicos">
                            <DataTable value={citas} showGridlines paginator selectionMode="single"
                              rows={5} dataKey="id" emptyMessage="No tiene citas" 
                              onRowClick={ver_diagnostico} style={shortStack.style}>
                              <Column field="fecha_cita" header="Fecha de Cita" />
                            </DataTable>
                            <Dialog header={"Fecha de Cita: " + cita.fecha_cita} visible={displayDia}
                              onHide={() => setDisplayDia(false)}>
                              <div className="grid">
                                <div className="col-12">
                                  <div className="card">
                                    <div className="p-fluid formgrid grid">
                                      <div className="field col-12 md:col-12">
                                        <div className="flex align-items-center justify-content-center">
                                          <div className="surface-0">
                                            <ul className="list-none p-0 m-0 mb-3">
                                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                                <div className="md:w-12">
                                                <Accordion>
                                                  <AccordionTab header="Motivos de la Consulta">
                                                    <p>{ cita.motivos_consulta }</p>
                                                  </AccordionTab>
                                                  <AccordionTab header="Examen Físico">
                                                    <p>{ cita.examen_fisico }</p>
                                                  </AccordionTab>
                                                  <AccordionTab header="Diagnóstico de la Consulta">
                                                    <p>{ cita.diagnostico }</p>
                                                  </AccordionTab>
                                                  <AccordionTab header="Tratamiento Recetado">
                                                    <p>{ cita.tratamiento }</p>
                                                  </AccordionTab>
                                                  <AccordionTab header="Archivos de Diagnóstico">
                                                    <DataTable value={filesDiagSubidos} showGridlines paginator selectionMode="single"
                                                      rows={5} emptyMessage="No tiene archivos guardados" 
                                                      onRowClick={(e) => obtener_archivo("diag*" + cita.fecha_cita.replaceAll("/", "-"), 
                                                      e.data.nombre)}>
                                                      <Column header="Nombre" field="nombre"></Column>
                                                    </DataTable>
                                                  </AccordionTab>
                                                </Accordion>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Dialog>
                          </AccordionTab>
                        </Accordion>
                      </div>
                    </li>
                    <li className="flex align-items-center border-top-1 border-300 flex-wrap">
                      <div className="md:w-12 md:flex-order-0 flex-order-1">
                        <Accordion style={shortStack.style}>
                          <AccordionTab header="Dependientes">
                            <DataTable style={shortStack.style} value={historiales} showGridlines paginator selectionMode="single"
                              rows={5} dataKey="id" emptyMessage="No tiene dependientes" 
                              onRowClick={ver_dependiente}>
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
                                        <InputText id="telefono" type="text" value={ telefonoDep } placeholder="Teléfono" 
                                          onChange={(e) => setTelefonoDep(e.target.value)} className={invalidoTelefonoDep ? "p-invalid" : ""}/>
                                      </div>
                                      <div className="field col-12 md:col-6">
                                        <label htmlFor="direccion">Dirección</label>
                                        <InputText id="direccion" type="text" value={ direccionDep } placeholder="Dirección"
                                          onChange={(e) => setDireccionDep(e.target.value)} className={invalidoDireccionDep ? "p-invalid" : ""}/>
                                      </div>
                                      <div className="field col-12 md:col-6">
                                        <label htmlFor="fecha">Fecha de Nacimiento</label>
                                        <Calendar id="fecha" value={ fechaDep } showButtonBar
                                          onChange={(e) => {
                                            const date: any = e.value;
                                            setFechaDep(e.value ?? null);
                                            setNacimientoDep(date?.toLocaleString().replace(", 00:00:00", ""));
                                          }} className={invalidoNacimientoDep ? "p-invalid" : ""}/>
                                      </div>
                                      <div className="field col-12 md:col-6">
                                        <label htmlFor="ci">Carnet de Identidad</label>
                                        <InputText id="ci" type="text" value={ ciDep } className={invalidoCiDep ? "p-invalid" : ""}
                                          onChange={(e) => setCiDep(e.target.value)} placeholder="C.I."/>
                                      </div>
                                      <div className="field col-12 md:col-6">
                                        <label htmlFor="sexo">Sexo</label>
                                        <Dropdown value={ sexoDep } options={ opciones_sexo } className={invalidoSexoDep ? "p-invalid" : ""}
                                          onChange={(event) => {setSexoDep(event.target.value)}} 
                                          placeholder="Sexo"/>
                                      </div>
                                      <div className="field col-12 md:col-6">
                                        <label htmlFor="civil">Estado Civil</label>
                                        <Dropdown id="civil" value={ civilDep } options={ opciones_civil } 
                                          onChange={(event) => {setCivilDep(event.target.value)}} 
                                          placeholder="Estado Civil" className={invalidoCivilDep ? "p-invalid" : ""}/>
                                      </div>
                                      <div className="field col-12 md:col-6">
                                        <label htmlFor="nacionalidad">Nacionalidad</label>
                                        <InputText id="nacionalidad" type="text" value={ nacionalidadDep } placeholder="Nacionalidad"
                                          onChange={(e) => setNacionalidadDep(e.target.value)} className={invalidoNacionalidadDep ? "p-invalid" : ""}/>
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
                            <Dialog header= { dependiente.codigo } visible={displayDep} 
                              onHide={() => setDisplayDep(false)}>
                              <div className="grid">
                                <div className="col-12">
                                  <div className="card">
                                    <div className="p-fluid formgrid grid">
                                      <div className="field col-12 md:col-12">
                                        <div className="flex align-items-center justify-content-center">
                                          <div className="surface-0">
                                            <ul className="list-none p-0 m-0 mb-3">
                                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-4 font-medium">Nombre</div>
                                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                                { editarNombreDep ? 
                                                  <InputText value={ nombreDep } 
                                                    onChange={(e) => setNombreDep(e.target.value)} /> :
                                                  dependiente.nombre }
                                                </div>
                                                { editarNombreDep ? 
                                                <div className="w-6 md:w-2 flex justify-content-end">
                                                  <Button icon="pi pi-check" rounded text severity="success" 
                                                    onClick={guardar_dependiente}/>
                                                  <Button icon="pi pi-times" rounded text severity="danger"
                                                    onClick={() => setEditarNombreDep(false)} />
                                                </div> : 
                                                <div className="w-6 md:w-2 flex justify-content-end">
                                                  <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                                                    onClick={() => setEditarNombreDep(true)}/>
                                                </div>}
                                              </li>
                                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-4 font-medium">Apellido</div>
                                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                                { editarApellidoDep ? 
                                                  <InputText value={ apellidoDep } 
                                                    onChange={(e) => setApellidoDep(e.target.value)} /> :
                                                  dependiente.apellido }
                                                </div>
                                                { editarApellidoDep ? 
                                                <div className="w-6 md:w-2 flex justify-content-end">
                                                  <Button icon="pi pi-check" rounded text severity="success"
                                                    onClick={guardar_dependiente}/>
                                                  <Button icon="pi pi-times" rounded text severity="danger"
                                                    onClick={() => setEditarApellidoDep(false)} />
                                                </div> : 
                                                <div className="w-6 md:w-2 flex justify-content-end">
                                                  <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                                                    onClick={() => setEditarApellidoDep(true)}/>
                                                </div>}
                                              </li>
                                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-4 font-medium">Fecha de Nacimiento</div>
                                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                                { editarNacimientoDep ? 
                                                  <Calendar id="fecha" value={ fechaDep } showButtonBar className="w-full md:w-30rem mb-3"
                                                    onChange={(e) => {
                                                      const date: any = e.value;
                                                      setFechaDep(e.value ?? null);
                                                      setNacimientoDep(date?.toLocaleString().replace(", 00:00:00", ""));}}/> :
                                                    dependiente.nacimiento }
                                                </div>
                                                { editarNacimientoDep ? 
                                                <div className="w-6 md:w-2 flex justify-content-end">
                                                  <Button icon="pi pi-check" rounded text severity="success"
                                                    onClick={guardar_dependiente}/>
                                                  <Button icon="pi pi-times" rounded text severity="danger"
                                                    onClick={() => setEditarNacimientoDep(false)} />
                                                </div> : 
                                                <div className="w-6 md:w-2 flex justify-content-end">
                                                  <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                                                    onClick={() => setEditarNacimientoDep(true)}/>
                                                </div>}
                                              </li>
                                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-4 font-medium">C.I.</div>
                                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                                { editarCiDep ? 
                                                  <InputText value={ ciDep } 
                                                    onChange={(e) => setCiDep(e.target.value)} /> :
                                                  dependiente.ci }
                                                </div>
                                                { editarCiDep ? 
                                                <div className="w-6 md:w-2 flex justify-content-end">
                                                  <Button icon="pi pi-check" rounded text severity="success"
                                                    onClick={guardar_dependiente}/>
                                                  <Button icon="pi pi-times" rounded text severity="danger"
                                                    onClick={() => setEditarCiDep(false)} />
                                                </div> : 
                                                <div className="w-6 md:w-2 flex justify-content-end">
                                                  <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                                                    onClick={() => setEditarCiDep(true)}/>
                                                </div>}
                                              </li>
                                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-4 font-medium">Sexo</div>
                                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                                { editarSexoDep ? 
                                                  <Dropdown value={ sexoDep } options={ opciones_sexo } 
                                                    onChange={(event) => {setSexoDep(event.target.value)}} 
                                                    placeholder="Sexo"/> :
                                                  dependiente.sexo }
                                                </div>
                                                { editarSexoDep ? 
                                                <div className="w-6 md:w-2 flex justify-content-end">
                                                  <Button icon="pi pi-check" rounded text severity="success"
                                                    onClick={guardar_dependiente}/>
                                                  <Button icon="pi pi-times" rounded text severity="danger"
                                                    onClick={() => setEditarSexoDep(false)} />
                                                </div> : 
                                                <div className="w-6 md:w-2 flex justify-content-end">
                                                  <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                                                    onClick={() => setEditarSexoDep(true)}/>
                                                </div>}
                                              </li>
                                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-4 font-medium">Estado Civil</div>
                                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                                { editarCivilDep ? 
                                                  <Dropdown id="civil" value={ civilDep } options={ opciones_civil } 
                                                    onChange={(event) => {setCivilDep(event.target.value)}} 
                                                    placeholder="Estado Civil"/> :
                                                    dependiente.estado_civil }
                                                </div>
                                                { editarCivilDep ? 
                                                <div className="w-6 md:w-2 flex justify-content-end">
                                                  <Button icon="pi pi-check" rounded text severity="success"
                                                    onClick={guardar_dependiente}/>
                                                  <Button icon="pi pi-times" rounded text severity="danger"
                                                    onClick={() => setEditarCivilDep(false)} />
                                                </div> : 
                                                <div className="w-6 md:w-2 flex justify-content-end">
                                                  <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                                                    onClick={() => setEditarCivilDep(true)}/>
                                                </div>}
                                              </li>
                                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-4 font-medium">Teléfono</div>
                                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                                { editarTelefonoDep ? 
                                                  <InputText value={ telefonoDep } 
                                                    onChange={(e) => setTelefonoDep(e.target.value)} /> :
                                                  dependiente.telefono }
                                                </div>
                                                { editarTelefonoDep ? 
                                                <div className="w-6 md:w-2 flex justify-content-end">
                                                  <Button icon="pi pi-check" rounded text severity="success"
                                                    onClick={guardar_dependiente}/>
                                                  <Button icon="pi pi-times" rounded text severity="danger"
                                                    onClick={() => setEditarTelefonoDep(false)} />
                                                </div> : 
                                                <div className="w-6 md:w-2 flex justify-content-end">
                                                  <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                                                    onClick={() => setEditarTelefonoDep(true)}/>
                                                </div>}
                                              </li>
                                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-4 font-medium">Dirección</div>
                                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                                { editarDireccionDep ? 
                                                  <InputText value={ direccionDep } 
                                                    onChange={(e) => setDireccionDep(e.target.value)} /> :
                                                  dependiente.direccion }
                                                </div>
                                                { editarDireccionDep ? 
                                                <div className="w-6 md:w-2 flex justify-content-end">
                                                  <Button icon="pi pi-check" rounded text severity="success"
                                                    onClick={guardar_dependiente}/>
                                                  <Button icon="pi pi-times" rounded text severity="danger"
                                                    onClick={() => setEditarDireccionDep(false)} />
                                                </div> : 
                                                <div className="w-6 md:w-2 flex justify-content-end">
                                                  <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                                                    onClick={() => setEditarDireccionDep(true)}/>
                                                </div>}
                                              </li>
                                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-4 font-medium">Nacionalidad</div>
                                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                                { editarNacionalidadDep ? 
                                                  <InputText value={ nacionalidadDep } 
                                                    onChange={(e) => setNacionalidadDep(e.target.value)} /> :
                                                  dependiente.nacionalidad }
                                                </div>
                                                { editarNacionalidadDep ? 
                                                <div className="w-6 md:w-2 flex justify-content-end">
                                                  <Button icon="pi pi-check" rounded text severity="success"
                                                    onClick={guardar_dependiente}/>
                                                  <Button icon="pi pi-times" rounded text severity="danger"
                                                    onClick={() => setEditarNacionalidadDep(false)} />
                                                </div> : 
                                                <div className="w-6 md:w-2 flex justify-content-end">
                                                  <Button label="Editar" icon="pi pi-pencil" className="p-button-text" 
                                                    onClick={() => setEditarNacionalidadDep(true)}/>
                                                </div>}
                                              </li>
                                              <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-2 font-medium">Creación y Actualización</div>
                                                <div className="mr-5 flex align-items-center mt-3">
                                                  <i className="pi pi-calendar mr-2"></i>
                                                  <span>Fecha Creación: { new Date(dependiente.fecha_creacion).toLocaleDateString() }</span>
                                                </div>
                                                <div className="mr-5 flex align-items-center mt-3">
                                                  <i className="pi pi-globe mr-2"></i>
                                                  <span>Última Actualización: { new Date(dependiente.fecha_actualizacion).toLocaleDateString() }</span>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Dialog>
                          </AccordionTab>
                        </Accordion>
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-2 font-medium">Creación y Actualización</div>
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
    </div>}
  </div>);
}

export default Ver_Historial;