'use client'
import React, { useState, useContext, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import jwt_decode from "jwt-decode";

import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';

import { LayoutContext } from '@/layout/context/layoutcontext';
import Acceso_Denegado from "../../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";

import get_un_empleado from "../../utils/get_un_empleado_handler";
import post_empleado from "../../utils/post_empleado";
import signup_medico from "../../utils/signup_medico_handler";
import signup_recepcionista from "../../utils/signup_recepcionista_handler";
import login_medico from "../../utils/login_medico_handler";

const Nuevo_Usuario = () => {
  const toast = useRef<Toast>(null);

  const router = useRouter();

  const [denegado, setDenegado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invNombre, setInvNombre] = useState(false);
  const [invApellido, setInvApellido] = useState(false);
  const [invEmail, setInvEmail] = useState(false);
  const [invPassword, setInvPassword] = useState(false);
  const [invRol, setInvRol] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState(""); 
  const [nRol, setNRol] = useState("No"); 

  const { layoutConfig } = useContext(LayoutContext);
  const containerClassName = 
    classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', 
    { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  const [empleado, setEmpleado] = useState({
    id: "",
    consultorio_id: "",
    nombre: "",
    apellido: "",
    rol: "",
    email: "",
    fecha_creacion: "",
    fecha_actualizacion: ""
  });

  var token: any = {};

  useEffect(() => {
    try {
      token = jwt_decode(document.cookie.replace("token=", ""));

      get_un_empleado(token['custom:empleado']).then(data => {
        setEmpleado(data);
      });
    } catch (error) {
      setDenegado(true);
    }
  }, []);

  function isLowerCase(string: string) {
    return string.toLowerCase() === string;
  }

  function hasNumber(string: string) {
    return /\d/.test(string);
  }

  function hasSpecialChar(string: string){
    return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(string);
  }

  function hasSpace(string: string){
    return / /.test(string);
  }

  const guardar = () => {
    setLoading(true);

    if(nombre !== "" && apellido !== "" && rol !== ""
      && email !== "" && password !== "" && password.length >= 8 
      && !isLowerCase(password) && hasNumber(password)
      && hasSpecialChar(password) && !hasSpace(password)){
      const body_empleado = {
        nombre: nombre, 
        apellido: apellido,
        rol: rol,
        email: email,
        consultorio_id: token['custom:consultorio']
      }

      post_empleado(body_empleado).then(data => {
        const body_signup = {
          first_name: nombre,
          last_name: apellido,
          email: email,
          password: password,
          consultorio: token['custom:consultorio'],
          empleado: data.id
        }

        const body_login = {
          email: email,
          password: password
        }

        if(rol === "Médico"){
          signup_medico(body_signup).then(() => {
            /*if(nRol === "Si")
              login_medico(body_login).then(() => router.push("/user/medico/inicio"));
            else */
             router.push("/user/admin/usuario")
          });
        }else if(rol === "Recepcionista"){
          signup_recepcionista(body_signup).then(() => router.push("/user/admin/usuario"))
        }
      })
    }else {
      if(nombre === "") setInvNombre(true); else setInvNombre(false);
      if(apellido === "") setInvApellido(true); else setInvApellido(false);
      if(rol === "") setInvRol(true); else setInvRol(false);
      if(email === "") setInvEmail(true); else setInvEmail(false);
      if(password === "" || password.length < 8 || isLowerCase(password) || !hasNumber(password)
        || !hasSpecialChar(password) || hasSpace(password)) setInvPassword(true); else setInvPassword(false);

      setLoading(false);
    };
  }

  return (denegado ? 
  <><Acceso_Denegado /></> : 
  <div>
    <Navbar tipo_usuario="admin" inicio="admin"/>
    { loading === true ? 
    (<div className={containerClassName}><ProgressSpinner /></div>) :
    (<div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>Crear Usuario</h5>
          <div className="p-fluid formgrid grid">
            <Toast ref={toast} />
            <div className="field col-12 md:col-4">
              <label htmlFor="nombre">Nombre</label>
              <InputText id="nombre" type="text" value={nombre}
                onChange={(e) => {setNombre(e.target.value)}} 
                className={invNombre ? "p-invalid" : ""}/>
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="apellido">Apellido</label>
              <InputText id="apellido" type="text" value={apellido}
                onChange={(e) => {setApellido(e.target.value)}} 
                className={invApellido ? "p-invalid" : ""}/>
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="externo">Rol de Usuario:</label>
              <div className="col-12 md:col-3">
                <div className="field-radiobutton mb-1">
                  <RadioButton inputId="med" name="option" value="Médico" 
                    checked={rol === "Médico"} className={invRol ? "p-invalid" : ""}
                    onChange={(e) => setRol(e.value)} />
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
              <label htmlFor="email">Email</label>
              <InputText id="email" type="email" value={email}
                onChange={(e) => {setEmail(e.target.value)}} 
                className={invEmail ? "p-invalid" : ""}/>
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="password">Password</label>
              <Password toggleMask inputId="password" value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Contraseña" feedback={false} 
                className={invPassword ? "p-invalid" : ""}></Password>
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="externo">¿Crear nuevo rol para este usuario?:</label>
              <div className="col-12 md:col-3">
                <div className="field-radiobutton mb-1">
                  <RadioButton inputId="si" name="option" value="Si" 
                    checked={nRol === "Si"}
                    onChange={(e) => {
                      setLoading(true);
                      setNRol(e.value);
                      setEmail(empleado.email);
                      setNombre(empleado.nombre);
                      setApellido(empleado.apellido);
                      setLoading(false);
                    }} />
                  <label htmlFor="si">Si</label>
                </div>
                <div className="field-radiobutton mb-1">
                  <RadioButton inputId="no" name="option" value="No" 
                    checked={nRol === "No"}
                    onChange={(e) => {
                      setNRol(e.value);
                      setNombre("");
                      setApellido("");
                      setEmail("");
                    }}/>
                  <label htmlFor="no">No</label>
                </div>
              </div>
            </div>
            <div className="field col-12 md:col-12">
              <Button label="Solicitar" className="w-full p-3 text-xl" 
                loading={loading} onClick={guardar}></Button>
            </div>
          </div>
        </div>
      </div>
    </div>)}
  </div>)
}

export default Nuevo_Usuario;