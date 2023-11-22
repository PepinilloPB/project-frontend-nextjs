'use client'
import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import jwt_decode from "jwt-decode";
import localfont from 'next/font/local';

import { LayoutContext } from '@/layout/context/layoutcontext';
import Acceso_Denegado from "../../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";

import { classNames } from 'primereact/utils';
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { ProgressSpinner } from 'primereact/progressspinner';
import { FileUpload } from "primereact/fileupload";
import { RadioButton } from "primereact/radiobutton";

import post_historial from "../../util/post_historial_handler";
import signup_paciente from "../../util/signup_paciente_handler";
import { InputTextarea } from "primereact/inputtextarea";

const shortStack = localfont({ src: "../../../../../../fonts/ShortStack-Regular.ttf" });

const Nuevo_Historial = () => {
  //const MAX_IMAGE_SIZE = 100000000

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [denegado, setDenegado] = useState(false);
  const [invalidoNombre, setInvalidoNombre] = useState(false);
  const [invalidoApellido, setInvalidoApellido] = useState(false);
  const [invalidoNacimiento, setInvalidoNacimiento] = useState(false);
  const [invalidoSexo, setInvalidoSexo] = useState(false);
  const [invalidoCivil, setInvalidoCivil] = useState(false);
  const [invalidoCi, setInvalidoCi] = useState(false);
  const [invalidoTelefono, setInvalidoTelefono] = useState(false);
  const [invalidoDireccion, setInvalidoDireccion] = useState(false);
  const [invalidoNacionalidad, setInvalidoNacionalidad] = useState(false);
  const [invalidoEmail, setInvalidoEmail] = useState(false);
  const [invalidoPatologicos, setInvalidoPatologicos] = useState(false);
  const [invalidoNoPatologicos, setInvalidoNoPatologicos] = useState(false);
  const [invalidoAlergicos, setInvalidoAlergicos] = useState(false);
  const [invalidoQuirurgicos, setInvalidoQuirurgicos] = useState(false);
  const [invalidoMedicacion, setInvalidoMedicacion] = useState(false);
  //const [subirArchivo, setSubirArchivo] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [nacimiento, setNacimiento] = useState("");
  const [sexo, setSexo] = useState("");
  const [civil, setCivil] = useState("");
  const [ci, setCi] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [email, setEmail] = useState("");
  const [patologicos, setPatologicos] = useState("");
  const [noPatologicos, setNoPatologicos] = useState("");
  const [alergicos, setAlergicos] = useState("");
  const [quirurgicos, setQuirurgicos] = useState("");
  const [medicacion, setMedicacion] = useState("");

  const [fecha, setFecha] = useState<string | Date | Date[] | null>(null);

  /*const [files, setFiles] = useState<any[]>([]);
  const [base64s, setBase64s] = useState<String[]>([]);*/

  const opciones_sexo = ["", "Femenino", "Masculino"];
  const opciones_civil = ["", "Solter@", "Casad@", "Divorciad@"];

  const { layoutConfig } = useContext(LayoutContext);
  const containerClassName = 
    classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', 
    { 'p-input-filled': layoutConfig.inputStyle === 'filled' });


  var token: any = {};

  useEffect(() => {
    try {
      token = jwt_decode(document.cookie.replace("token=", ""));
      setLoading(false);
    } catch (error) {
      setDenegado(true);
    }
  }, []);

  const crear_historial = () => {
    setLoading(true);

    if(nombre !== "" && apellido !== "" && nacimiento !== ""
      && sexo !== "" && civil !== "" && ci !== ""
      && telefono !== "" && direccion !== "" && nacionalidad !== ""){

      const body_historial = {
        nombre: nombre,
        apellido: apellido,
        nacimiento: nacimiento,
        sexo: sexo,
        estado_civil: civil,
        ci: ci,
        telefono: telefono,
        direccion: direccion,
        nacionalidad: nacionalidad,
        a_patologicos: patologicos,
        a_no_patologicos: noPatologicos,
        a_quirurgicos: quirurgicos,
        a_alergicos: alergicos,
        med_habitual: medicacion,
        dependientes: []
      }  
      
      post_historial(body_historial).then(data => {
        const body_signup = {
          email: email,
          password: ci,
          username: data.historial.codigo,
          historial: data.historial.id
        }

        signup_paciente(body_signup)
      });
    }

    if(nombre === ""){
      setInvalidoNombre(true);
      setLoading(false);
    }else
      setInvalidoNombre(false);

    if(apellido === ""){
      setInvalidoApellido(true);
      setLoading(false);
    }else
      setInvalidoApellido(false);

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

  /*const subir_archivos = async (e: any) => {
    setLoading(true);

    for(let i = 0; i < base64s.length; i++){
      let binario = atob(base64s[i].split(",")[1]);

      let array = [];

      for (let j = 0; j < binario.length; j++) {
        array.push(binario.charCodeAt(j))
      }
  
      let blobData = new Blob([new Uint8Array(array)], {type: files[i].type});

      try {
        await axios.post('https://5m67p1dww2.execute-api.us-west-2.amazonaws.com/dev/archivo', files[i])
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

  const crear_archivos = (files: any[]) => {
    for(let i = 0; i < files.length; i++){
      let reader = new FileReader();

      reader.onload = (e: any) => {
        if (e.target.result.length > MAX_IMAGE_SIZE) {
          return alert('Archivo ' + i + ' es muy grande')
        }

        const archivo: any = {
          name: files[i].name,
          type: files[i].type,
          id: "579def48-98ff-4634-be9a-ac00d6965233",
          origen: "historiales"
        }
  
        setBase64s(state => [...state, e.target.result]);
        setFiles(state => [...state, archivo]);
      };

      reader.readAsDataURL(files[i])
    }
  }*/

  return (denegado ? 
    <><Acceso_Denegado /></> :
    <div style={{
      background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)',
      height: window.innerHeight
    }}>
      <Navbar tipo_usuario="medico"/>
      { loading === true ? 
      <div className={containerClassName}><ProgressSpinner /></div> :
      <div className="grid" style={{
        background: 'rgba(143, 175, 196, 1)',
      }}>
        <div className="col-12">
          <div className="card" style={{
            background: 'rgba(143, 175, 196, 1)',
            borderColor: 'rgba(143, 175, 196, 1)'
          }}>
            <h5>Crear Historial</h5>
            <div className="p-fluid formgrid grid" style={shortStack.style}>
              <div className="field col-12 md:col-6">
                <label htmlFor="nombre">Nombre</label>
                <InputText id="nombre" type="text" value={ nombre } style={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}
                  onChange={(e) => setNombre(e.target.value)} 
                  className={invalidoNombre ? "p-invalid" : ""} />
              </div>
              <div className="field col-12 md:col-6">
                <label htmlFor="apellido">Apellido</label>
                <InputText id="apellido" type="text" value={ apellido } style={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}
                  onChange={(e) => setApellido(e.target.value)} 
                  className={invalidoApellido ? "p-invalid" : ""}/>
              </div>
              <div className="field col-12 md:col-6">
                <label htmlFor="telefono">Teléfono</label>
                <InputText id="telefono" type="text" value={ telefono } style={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }} 
                  onChange={(e) => setTelefono(e.target.value)} 
                  className={invalidoTelefono ? "p-invalid" : ""}/>
              </div>
              <div className="field col-12 md:col-6">
                <label htmlFor="direccion">Dirección</label>
                <InputText id="direccion" type="text" value={ direccion } style={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}
                  onChange={(e) => setDireccion(e.target.value)} 
                  className={invalidoDireccion ? "p-invalid" : ""}/>
              </div>
              <div className="field col-12 md:col-6">
                <label htmlFor="fecha">Fecha de Nacimiento</label>
                <Calendar id="fecha" value={ fecha } showButtonBar
                  onChange={(e) => {
                    const date: any = e.value;
                    setFecha(e.value ?? null);
                    setNacimiento(date?.toLocaleString().replace(", 00:00:00", ""));
                  }} className={invalidoNacimiento ? "p-invalid" : ""} inputStyle={{ 
                    borderRadius: '15px',
                    background: 'rgba(206, 159, 71, 1)',
                    borderColor: 'rgba(206, 159, 71, 1)',
                    color: 'rgba(41, 49, 51, 1)'
                  }}/>
              </div>
              <div className="field col-12 md:col-6">
                <label htmlFor="ci">Carnet de Identidad</label>
                <InputText id="ci" type="text" value={ ci } className={invalidoCi ? "p-invalid" : ""}
                  onChange={(e) => setCi(e.target.value)} style={{ 
                    borderRadius: '15px',
                    background: 'rgba(206, 159, 71, 1)',
                    borderColor: 'rgba(206, 159, 71, 1)',
                    color: 'rgba(41, 49, 51, 1)'
                  }}/>
              </div>
              <div className="field col-12 md:col-6">
                <label htmlFor="sexo">Sexo</label>
                <Dropdown value={ sexo } options={ opciones_sexo } className={invalidoSexo ? "p-invalid" : ""}
                  onChange={(event) => {setSexo(event.target.value)}} 
                  style={{ 
                    borderRadius: '15px',
                    background: 'rgba(206, 159, 71, 1)',
                    borderColor: 'rgba(206, 159, 71, 1)',
                    color: 'rgba(41, 49, 51, 1)'
                  }}/>
              </div>
              <div className="field col-12 md:col-6">
                <label htmlFor="civil">Estado Civil</label>
                <Dropdown id="civil" value={ civil } options={ opciones_civil } 
                  onChange={(event) => {setCivil(event.target.value)}} 
                  style={{ 
                    borderRadius: '15px',
                    background: 'rgba(206, 159, 71, 1)',
                    borderColor: 'rgba(206, 159, 71, 1)',
                    color: 'rgba(41, 49, 51, 1)'
                  }} className={invalidoCivil ? "p-invalid" : ""}/>
              </div>
              <div className="field col-12 md:col-6">
                <label htmlFor="nacionalidad">Nacionalidad</label>
                <InputText id="nacionalidad" type="text" value={ nacionalidad } style={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}
                  onChange={(e) => setNacionalidad(e.target.value)} className={invalidoNacionalidad ? "p-invalid" : ""}/>
              </div>
              <div className="field col-12 md:col-6">
                <label>Email</label>
                <InputText id="email" type="text" value={email} style={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}
                  onChange={(e) => setEmail(e.target.value)} className={invalidoEmail ? "p-invalid" : ""}/>
              </div>
              <div className="field col-12 md:col-12">
                <label>Antecedentes Patológicos</label>
                <InputTextarea value={patologicos} 
                  onChange={(e) => setPatologicos(e.target.value)} 
                  rows={5} cols={30} style={{ 
                    borderRadius: '15px',
                    background: 'rgba(206, 159, 71, 1)',
                    borderColor: 'rgba(206, 159, 71, 1)',
                    color: 'rgba(41, 49, 51, 1)'
                  }}></InputTextarea>
              </div>
              <div className="field col-12 md:col-12">
                <label>Antecedentes No Patológicos</label>
                <InputTextarea value={noPatologicos} 
                  onChange={(e) => setNoPatologicos(e.target.value)} 
                  rows={5} cols={30} style={{ 
                    borderRadius: '15px',
                    background: 'rgba(206, 159, 71, 1)',
                    borderColor: 'rgba(206, 159, 71, 1)',
                    color: 'rgba(41, 49, 51, 1)'
                  }}></InputTextarea>
              </div>
              <div className="field col-12 md:col-12">
                <label>Antecedentes Alérgicos</label>
                <InputTextarea value={alergicos} 
                  onChange={(e) => setAlergicos(e.target.value)} 
                  rows={5} cols={30} style={{ 
                    borderRadius: '15px',
                    background: 'rgba(206, 159, 71, 1)',
                    borderColor: 'rgba(206, 159, 71, 1)',
                    color: 'rgba(41, 49, 51, 1)'
                  }}></InputTextarea>
              </div>
              <div className="field col-12 md:col-12">
                <label>Antecedentes Quirúrgicos</label>
                <InputTextarea value={quirurgicos} 
                  onChange={(e) => setQuirurgicos(e.target.value)} 
                  rows={5} cols={30} style={{ 
                    borderRadius: '15px',
                    background: 'rgba(206, 159, 71, 1)',
                    borderColor: 'rgba(206, 159, 71, 1)',
                    color: 'rgba(41, 49, 51, 1)'
                  }}></InputTextarea>
              </div>
              <div className="field col-12 md:col-12">
                <label>Medicación Habitual</label>
                <InputTextarea value={medicacion} 
                  onChange={(e) => setMedicacion(e.target.value)} 
                  rows={5} cols={30} style={{ 
                    borderRadius: '15px',
                    background: 'rgba(206, 159, 71, 1)',
                    borderColor: 'rgba(206, 159, 71, 1)',
                    color: 'rgba(41, 49, 51, 1)'
                  }}></InputTextarea>
              </div>
              {/*<div className="field col-12 md:col-6">
                <label>¿Desea subir archivos?</label>
                <div className="field-radiobutton mb-1">
                    <RadioButton inputId="si" name="option" value="1" 
                      checked={subirArchivo === true}
                      onChange={() => setSubirArchivo(true)} />
                    <label>Si</label>
                  </div>
                  <div className="field-radiobutton mb-1">
                    <RadioButton inputId="no" name="option" value="0" 
                      checked={subirArchivo === false} 
                      onChange={() => setSubirArchivo(false)} />
                    <label>No</label>
                  </div>
                </div>*/}
              {/* subirArchivo ? <div className="field col-12 md:col-12">
                <label>Archivos</label>
                <FileUpload name="demo[]" multiple accept="*" customUpload 
                  onSelect={(e) => crear_archivos(e.files)}
                  uploadHandler={subir_archivos}
                  onClear={() => {
                    setBase64s([]); 
                    setFiles([]);
                  }}/>
                </div> : null*/}
              <div className="field col-12 md:col-12">
                <Button className="p-3 text-xl justify-content-center" onClick={crear_historial} style={{ 
                            borderRadius: '20px',
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)',
                            color: 'rgba(143, 175, 196, 1)'
                          }}><p style={shortStack.style}>Crear Usuario</p></Button>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </div>);
}

export default Nuevo_Historial;