'use client'
import React, { useState, useContext, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import jwt_decode from "jwt-decode";
import localfont from 'next/font/local';

import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Dropdown } from "primereact/dropdown";
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RadioButton } from 'primereact/radiobutton';

import { LayoutContext } from '@/layout/context/layoutcontext';
import Acceso_Denegado from "../../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";
import get_consultorios from "../../utils/get_consultorio_handler";
import post_empleado from "../../utils/post_empleado";
import signup_medico from "../../utils/signup_medico_handler";
import signup_recepcionista from "../../utils/signup_recepcionista_handler";

const shortStack = localfont({ src: "../../../../../../fonts/ShortStack-Regular.ttf" });

const Nuevo_Empleado = () => {
  const router = useRouter();

  const [denegado, setDenegado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [invNombre, setInvNombre] = useState(false);
  const [invApellido, setInvApellido] = useState(false);
  const [invEmail, setInvEmail] = useState(false);
  const [invRol, setInvRol] = useState(false);
  const [invConsultorio, setInvConsultorio] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState(""); 

  const [consultorio, setConsultorio] = useState({
    id: "",
    nombre: ""
  });

  const [consultorios, setConsultorios] = useState<any[]>([]);

  const { layoutConfig } = useContext(LayoutContext);
  const containerClassName = 
    classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', 
    { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  var token: any = {};

  useEffect(() => {
    try {
      token = jwt_decode(document.cookie.replace("token=", ""));
      get_consultorios().then(data => {
        setConsultorios(data);
        setLoading(false);
      });
    } catch (error) {
      setDenegado(true);
    }
  }, []);

  const generar_contraseña = () => {
    const mayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const minusculas = "abcdefghijklmnopqrstuvwxyz";
    const numeros = "0123456789";
    const especiales = "!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?~]";

    let password = '';

    password += mayusculas.charAt(Math.floor(Math.random() * mayusculas.length));

    let count = 0;
    while(count < 5){
      password += minusculas.charAt(Math.floor(Math.random() * minusculas.length));
      count++;
    }

    password += numeros.charAt(Math.floor(Math.random() * numeros.length));

    password += especiales.charAt(Math.floor(Math.random() * especiales.length));

    return password;
  }

  const guardar = () => {
    if(nombre !== "" && apellido !== "" && rol !== "" && consultorio.id !== "" && email !== ""){
      setLoading(true);

      const body_empleado = {
        nombre: nombre, 
        apellido: apellido,
        rol: rol,
        email: email,
        consultorio_id: consultorio.id
      }

      post_empleado(body_empleado).then(data => {
        const body_signup = {
          first_name: nombre,
          last_name: apellido,
          email: email,
          password: generar_contraseña(),
          consultorio: consultorio.id,
          empleado: data.id
        }

        if(rol === "Médico")
          signup_medico(body_signup).then(() => router.push('/user/admin/inicio'));
        else if(rol === "Recepcionista")
          signup_recepcionista(body_signup).then(() => router.push('/user/admin/inicio'));
      });  
    }

    if(nombre === "") setInvNombre(true); else setInvNombre(false);
    if(apellido === "") setInvApellido(true); else setInvApellido(false);
    if(rol === "") setInvRol(true); else setInvRol(false);
    if(consultorio.id === "") setInvConsultorio(true); else setInvConsultorio(false);
    if(email === "") setInvEmail(true); else setInvEmail(false);
  }

  return (denegado ? 
  <><Acceso_Denegado /></> : 
  <div style={{
    background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)'
  }}>
    {/*<Navbar tipo_usuario="admin"/>*/}
    { loading ? 
      <div className={containerClassName}><ProgressSpinner /></div> :
      <div className="grid" style={{
        background: 'rgba(51, 107, 134, 1)',
        //height: window.innerHeight
      }}>
        <div className="col-12" style={shortStack.style}>
          <div className="card" style={{
            background: 'rgba(143, 175, 196, 1)',
            borderColor: 'rgba(143, 175, 196, 1)'
          }}>
            <h5>Crear Empleado</h5>
            <div className="p-fluid formgrid grid">
              <div className="field col-12 md:col-4">
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
              <div className="field col-12 md:col-4">
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
              <div className="field col-12 md:col-4">
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
              </div>
              <div className="field col-12 md:col-4">
                <label htmlFor="consultorio">Consultorio</label>
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
              <div className="field col-12 md:col-4">
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
              <div className="field col-12 md:col-12">
                <Button className="w-full p-3 text-xl justify-content-center" 
                  loading={loading} onClick={guardar} style={{ 
                    borderRadius: '20px',
                    background: 'rgba(51, 107, 134, 1)',
                    borderColor: 'rgba(51, 107, 134, 1)',
                    color: 'rgba(143, 175, 196, 1)'
                  }}><p style={shortStack.style}>Crear Nuevo Usuario</p></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  </div>)
}

export default Nuevo_Empleado;