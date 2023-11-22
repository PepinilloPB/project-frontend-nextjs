'use client'
import React, { useEffect, useState, useRef, useContext } from "react";
import { useRouter } from 'next/navigation';
import jwt_decode from "jwt-decode";
import localfont from 'next/font/local';

import { BlockUI } from "primereact/blockui";
import { Button } from 'primereact/button';
import { Calendar } from "primereact/calendar";
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';

import { LayoutContext } from '@/layout/context/layoutcontext';
import Navbar from "@/app/(project)/components/navbar/page";

import Acceso_Denegado from "../../acceso_denegado";
import get_especialidades from "../../utils/get_especialidades_handler";
import get_consultorio_especialidad from "../../utils/get_consultorio_especialidad_handler";
import get_citas_fecha_consultorio from "../../utils/get_citas_fecha_y_consultorio_handler";
import post_cita from "../../utils/post_cita_handler";
import get_un_consultorio from "../../utils/get_consultorio_handler";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import get_un_historial from "../../utils/get_historial_handler";
import { Sidebar } from "primereact/sidebar";
import post_historial from "../../utils/post_historial_handler";
import put_historial from "../../utils/put_historial_handler";

const shortStack = localfont({ src: "../../../../../../fonts/ShortStack-Regular.ttf" });

const Solicitar_Cita = () => {
  const toast = useRef<Toast>(null);
  const router = useRouter();

  const [radioValue, setRadioValue] = useState("Si"); 
  
  const [loading, setLoading] = useState(true);
  const [denegado, setDenegado] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [citaDependiente, setCitaDependiente] = useState(false);
  const [displayCita, setDisplayCita] = useState(false);
  const [displayDep, setDisplayDep] = useState(false);
  const [invalidoCons, setInvalidoCons] = useState(false);
  const [invalidoEsp, setInvalidoEsp] = useState(false);
  const [invalidoFecha, setInvalidoFecha] = useState(false);
  const [invalidoNombreDep, setInvalidoNombreDep] = useState(false);
  const [invalidoApellidoDep, setInvalidoApellidoDep] = useState(false);
  const [invalidoNacimiento, setInvalidoNacimiento] = useState(false);
  const [invalidoSexo, setInvalidoSexo] = useState(false);
  const [invalidoCivil, setInvalidoCivil] = useState(false);
  const [invalidoCi, setInvalidoCi] = useState(false);
  const [invalidoTelefono, setInvalidoTelefono] = useState(false);
  const [invalidoDireccion, setInvalidoDireccion] = useState(false);
  const [invalidoNacionalidad, setInvalidoNacionalidad] = useState(false);

  const [nombreDep, setNombreDep] = useState("");
  const [apellidoDep, setApellidoDep] = useState("");
  const [nacimiento, setNacimiento] = useState("");
  const [sexo, setSexo] = useState("");
  const [civil, setCivil] = useState("");
  const [ci, setCi] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");

  const opciones_sexo = ["", "Femenino", "Masculino"];
  const opciones_civil = ["", "Solter@", "Casad@", "Divorciad@"];

  const [especialidades, setEspecialidades] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [dependientes, setDependientes] = useState([]);
  const [citas, setCitas] = useState<any>([]);

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
  const [especialidad, setEspecialidad] = useState({
    id: "",
    nombre: "",
    fecha_creacion: "",
    fecha_actualizacion: "",
    estado: false
  });
  const [consultorio, setConsultorio] = useState({
    id: "",
    nombre: "",
    especializacion: "",
    direccion: "",
    max_citas: 0,
    turnos: 0, 
    hora_entrada: [""],
    hora_salida: [""],
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

  const [fecha, setFecha] = useState<string | Date | Date[] | null>(null);
  const [fechaDep, setFechaDep] = useState<string | Date | Date[] | null>(null);

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
      get_un_historial(token["custom:historial"]).then(data => {
        setHistorial(data);
        //setDependientes(data.dependientes);
        const dpndnts: any = [];
        data.dependientes.forEach((item: String) => {
          get_un_historial(item).then(value => dpndnts.push(value));
        });
        setDependientes(dpndnts);
      });
    } catch (error) {
      setDenegado(true);
    }

    get_especialidades().then(data => {
      setEspecialidades(data);

      if(id !== ""){
        //console.log("Con Id " + id);
        get_un_consultorio(id).then(value => {
          setConsultorio(value);
          setTurnos(value.turnos);

          data.forEach((item: any) => {
            if(item["nombre"] === value["especializacion"]){
                setEspecialidad(item);
                get_consultorio_especialidad(item["nombre"]).then(response => {
                  setConsultorios(response);
                  setLoading(false);
                })
            }
          });
        });
      }else{
        setLoading(false);
      }

    });
  }, []);

  const confirmarCita = ( 
    <>
      <Button type="button" label="Si" icon="pi pi-check" severity="success" onClick={() => guardar_cita(false)} text />
      <Button type="button" label="No" icon="pi pi-times" severity="danger" onClick={() => setDisplayCita(false)} text />
    </> 
  );

  const isSelectable = (data: any) => data.nombre_paciente === "";
  const rowClassName = (data: any) => (isSelectable(data) ? '' : 'p-disabled');

  const set_consultorios = (opcion: any) => {
    setEspecialidad(opcion);
    get_consultorio_especialidad(opcion.nombre).then(data => setConsultorios(data));
  }

  const set_turnos = (opcion: any) => {
    setConsultorio(opcion);
    setTurnos(opcion.turnos)
  }

  const buscar_disponibilidad = () => {
    setLoading(true);

    if(especialidad.id !== '' && consultorio.id !== '' && fecha !== null
      && fecha > new Date()){
      if(citas.length > 0)
        citas.length = 0;

      for( let i = 0; i < turno.max_citas; i++ ){
        const hora = new Date('July 1, 1999, ' + turno.hora_entrada);
        hora.setTime(hora.getTime() + (turno.tiempo_consulta * i) * 60000);

        const cita_vacia = {
          consultorio_id: consultorio.id,
          historial_id: citaDependiente === false ? historial.id : dependiente.id,
          nombre_paciente: "",
          apellido_paciente: "",
          cita_estado: 0, //Estados: Pendiente = 0, Cumplida = 1, Cancelada = -1
          fecha_cita: fecha?.toLocaleString().replace(", 00:00:00", ""),
          hora_cita: hora.toLocaleTimeString(),
          num_ficha: i + 1,
          externa: false,
          motivos_consulta: "",
          examen_fisico: "",
          diagnostico: "",
          tratamiento: "",
          costo: 0,
          pagado: false,
          fecha_pago: ""
        }

        citas.push(cita_vacia);
        setCitas(citas);
      }

      //console.log(citas);

      get_citas_fecha_consultorio(fecha?.toLocaleString().replace(", 00:00:00", ""), consultorio.id)
      .then(data => {
        if(data.length > 0)
          for(let i = 0; i < citas.length; i++){
            data.map((item: any) => {
              if( citas[i].hora_cita === item.hora_cita ) {
                citas[i] = item;
                setCitas(citas);
              }
            });
          }
        
        setLoading(false);
        setBuscado(true);
      });

      //console.log(citas);
    }

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
      
    if(fecha === null || fecha <= new Date()){
      setInvalidoFecha(true);
      setLoading(false);
    }else
      setInvalidoFecha(false); 
  }

  const guardar_cita = (rowData: any) => {
    setLoading(true);

    const nueva_cita = rowData.data;

    if(citaDependiente === false){
      nueva_cita.nombre_paciente = historial.nombre;
      nueva_cita.apellido_paciente = historial.apellido;
      nueva_cita.historial_id = historial.id;
      nueva_cita.externa = true;
    }else {
      nueva_cita.nombre_paciente = dependiente.nombre;
      nueva_cita.apellido_paciente = dependiente.apellido;
      nueva_cita.historial_id = dependiente.id;
      nueva_cita.externa = false;
    }

    post_cita(nueva_cita).then(() => router.push('/user/paciente/citas/pendientes'));
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

  const cita_libre = (rowData: any) => {
    if(rowData.nombre_paciente === "")
      return ("Disponible");
    else
      return ("Ocupada");
  }

  return (denegado ? <><Acceso_Denegado /></> : 
    <div style={{
      background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)'
    }}>
        {/*<Navbar tipo_usuario="paciente"/>*/}
        { loading === true ? 
        (<div className={containerClassName}><ProgressSpinner /></div>) :
        (<div className="grid" style={{
          background: 'rgba(143, 175, 196, 1)',
          height: window.innerHeight
        }}>
          <div className="col-12" style={shortStack.style}>
            <div className="card" style={{
            background: 'rgba(143, 175, 196, 1)',
            borderColor: 'rgba(143, 175, 196, 1)'
          }}>
              <h5>Solicitar Cita</h5>
              <div className="p-fluid formgrid grid">
                <Toast ref={toast} />
                <div className="field col-12 md:col-6">
                  <label htmlFor="especialidad">Especialidad</label>
                  <BlockUI blocked={loading}>
                    <Dropdown id="especialidad" value={especialidad}
                      onChange={(e) => set_consultorios(e.value)} options={especialidades} 
                      optionLabel="nombre" style={{ 
                        borderRadius: '15px',
                        background: 'rgba(206, 159, 71, 1)',
                        borderColor: 'rgba(206, 159, 71, 1)',
                        color: 'rgba(41, 49, 51, 1)'
                      }}
                      className={invalidoEsp ? "p-invalid" : ""}></Dropdown>
                  </BlockUI>
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="consultorio">Consultorio</label>
                  <BlockUI blocked={loading}>
                    <Dropdown id="consultorio" value={consultorio} 
                      onChange={(e) => set_turnos(e.value)} options={consultorios} 
                      optionLabel="nombre" style={{ 
                        borderRadius: '15px',
                        background: 'rgba(206, 159, 71, 1)',
                        borderColor: 'rgba(206, 159, 71, 1)',
                        color: 'rgba(41, 49, 51, 1)'
                      }} 
                      className={invalidoCons ? "p-invalid" : ""}></Dropdown>
                  </BlockUI>
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="consultorio">Turnos</label>
                  <BlockUI blocked={loading}>
                    <Dropdown id="turno" value={turno} 
                      onChange={(e) => setTurno(e.value)} options={turnos} 
                      optionLabel="etiqueta" style={{ 
                        borderRadius: '15px',
                        background: 'rgba(206, 159, 71, 1)',
                        borderColor: 'rgba(206, 159, 71, 1)',
                        color: 'rgba(41, 49, 51, 1)'
                      }} 
                      className={invalidoCons ? "p-invalid" : ""}></Dropdown>
                  </BlockUI>
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="fecha">Fecha</label>
                  <BlockUI blocked={loading}>
                    <Calendar id="fecha" value={fecha} showButtonBar inputStyle={{ 
                        borderRadius: '15px',
                        background: 'rgba(206, 159, 71, 1)',
                        borderColor: 'rgba(206, 159, 71, 1)',
                        color: 'rgba(41, 49, 51, 1)'
                      }}
                      onChange={(e) => setFecha(e.value ?? null)} className={invalidoFecha ? "p-invalid" : ""}/>
                  </BlockUI>
                </div>
                <div className="field col-12 md:col-3">
                  <label htmlFor="externo">¿La cita será para un dependiente?</label>
                  <div className="col-12 md:col-3">
                    <div className="field-radiobutton">
                      <BlockUI blocked={loading}>
                        <RadioButton inputId="si" name="option" value="1" 
                          checked={citaDependiente === true} onChange={() => setCitaDependiente(true)} />
                      </BlockUI>
                      <label htmlFor="si">Si</label>
                    </div>
                  </div>
                  <div className="col-12 md:col-3">
                    <div className="field-radiobutton">
                      <BlockUI blocked={loading}>
                        <RadioButton inputId="no" name="option" value="0" 
                          checked={citaDependiente === false} onChange={() => setCitaDependiente(false)} />
                      </BlockUI>
                      <label htmlFor="no">No</label>
                    </div>
                  </div>
                </div>
                <div className="field col-12 md:col-4">
                  <label htmlFor="fecha">Código</label>
                  <BlockUI blocked={loading}>
                    { citaDependiente === false ? 
                    (<InputText value={ historial.codigo } disabled style={{ 
                      borderRadius: '15px',
                      background: 'rgba(206, 159, 71, 1)',
                      borderColor: 'rgba(206, 159, 71, 1)',
                      color: 'rgba(41, 49, 51, 1)'
                    }}></InputText>) : 
                    (<Dropdown id="dependiente" value={ dependiente } 
                      onChange={(e) => setDependiente(e.value)} options={dependientes} 
                      optionLabel="codigo" style={{ 
                        borderRadius: '15px',
                        background: 'rgba(206, 159, 71, 1)',
                        borderColor: 'rgba(206, 159, 71, 1)',
                        color: 'rgba(41, 49, 51, 1)'
                      }}></Dropdown>) }
                  </BlockUI>
                </div>
                { citaDependiente === true ? 
                (<div className="field col-12 md:col-4">
                  <label htmlFor="fecha">Agregar un nuevo dependiente</label>
                  <Button id="dep" className="justify-content-center"
                    style={{ 
                      borderRadius: '20px',
                      background: 'rgba(51, 107, 134, 1)',
                      borderColor: 'rgba(51, 107, 134, 1)',
                      color: 'rgba(143, 175, 196, 1)'
                    }}
                    loading={loading} onClick={() => setDisplayDep(true)}><p style={shortStack.style}>Agregar</p></Button>
                </div>) : null }
                <Sidebar visible={displayDep} onHide={() => setDisplayDep(false)} baseZIndex={1000} fullScreen>
                <div className="grid">
                  <div className="col-12">
                    <div className="card">
                      <h5>Solicitar Cita</h5>
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
                <div className="field col-12 md:col-12">
                  <Button className="w-full p-3 text-xl mr-2 justify-content-center" 
                    style={{ 
                      borderRadius: '20px',
                      background: 'rgba(51, 107, 134, 1)',
                      borderColor: 'rgba(51, 107, 134, 1)',
                      color: 'rgba(143, 175, 196, 1)'
                    }}
                    loading={loading} onClick={buscar_disponibilidad}><p style={shortStack.style}>Buscar Disponibilidad</p></Button>
                </div>
                { buscado ? (
                <div className="field col-12 md:col-12">
                  <label htmlFor="citas">Citas</label>
                  <DataTable style={shortStack.style} value={citas} selectionMode="single" rowClassName={rowClassName} 
                    rows={turno.max_citas} onRowSelect={guardar_cita}>
                    <Column field="hora_cita" header="Hora" style={{ minWidth: '12rem' }}></Column>
                    <Column field="num_ficha" header="Ficha" style={{ minWidth: '12rem' }}></Column>
                    <Column field="nombre_paciente" header="" body={cita_libre} style={{ minWidth: '12rem' }} />
                  </DataTable>
                </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>)}
    </div>);
}

export default Solicitar_Cita