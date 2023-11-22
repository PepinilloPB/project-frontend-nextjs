'use client';
import React, { useContext, useState, useRef } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import localfont from 'next/font/local';

import { Button } from 'primereact/button';
import { Calendar } from "primereact/calendar";
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

import { LayoutContext } from '@/layout/context/layoutcontext';

import post_historial from '../utils/post_historial_handler';
import signup_paciente from '../utils/signup_paciente_handler';
import login from '../utils/login_handler';

const shortStack = localfont({ src: "../../../../../fonts/ShortStack-Regular.ttf" });

const Signup_Paciente = () => {
  const [loading, setLoading] = useState(false);

  const [fecha, setFecha] = useState<string | Date | Date[] | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [nacimiento, setNacimiento] = useState("");
  const [sexo, setSexo] = useState("");
  const [civil, setCivil] = useState("");
  const [ci, setCi] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");

  const opciones_sexo = ["", "Femenino", "Masculino"];
  const opciones_civil = ["", "Solter@", "Casad@", "Divorciad@"];
  
  const { layoutConfig } = useContext(LayoutContext);
  
  const router = useRouter();
  const containerClassName = classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
  
  const crear = () => {
    setLoading(true);
    
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
      a_patologicos: "",
      a_no_patologicos: "",
      a_quirurgicos: "",
      a_alergicos: "",
      med_habitual: "",
      dependientes: []
    }

    post_historial(body_historial)
    .then(data => {
      const body_signup = {
        email: email,
        password: password,
        username: data.historial.codigo,
        historial: data.historial.id
      }
      
      signup_paciente(body_signup)
      .then(() => {
        const body = {
          email: email,
          password: password
        }
        login(body).then(() => router.push("/user/paciente/inicio"));
      })
    });
  }

  return (
  <div className={containerClassName} style={{
    background: 'linear-gradient(180deg, rgba(51, 107, 134, 1) 10%, rgba(51, 107, 134, 1) 30%)'
  }}>
    <div className="flex flex-column align-items-center justify-content-center" style={shortStack.style}>
      <img src={`/layout/images/logo.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
      <div style={{
        borderRadius: '56px',
        padding: '0.3rem',
      }}>
        <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ 
            borderRadius: '53px',
            background: 'linear-gradient(180deg, rgba(143, 175, 196, 1) 10%, rgba(143, 175, 196, 1) 30%)'
          }}>
          <div className="text-center mb-5">
            <div className="text-900 text-3xl font-medium mb-3">Bienvenid@!</div>
            <span className="text-900 font-medium">Ingrese para crear usuario</span>
          </div>

          <div>
            <label htmlFor="nombre" className="block text-900 text-xl font-medium mb-1">
              Nombre
            </label>
            <InputText id="nombre" type="text" value={ nombre } 
              onChange={(e) => setNombre(e.target.value)}  
              className="w-full md:w-30rem mb-3" style={{ 
                padding: '1rem',
                borderRadius: '15px',
                background: 'rgba(206, 159, 71, 1)',
                borderColor: 'rgba(206, 159, 71, 1)',
                color: 'rgba(41, 49, 51, 1)'
              }} />

            <label htmlFor="apellido" className="block text-900 text-xl font-medium mb-1">
              Apellido
            </label>
            <InputText id="apellido" type="text" value={ apellido } 
              onChange={(e) => setApellido(e.target.value)}  
              className="w-full md:w-30rem mb-3" style={{ 
                padding: '1rem',
                borderRadius: '15px',
                background: 'rgba(206, 159, 71, 1)',
                borderColor: 'rgba(206, 159, 71, 1)',
                color: 'rgba(41, 49, 51, 1)'
              }} />

            <label htmlFor="telefono" className="block text-900 text-xl font-medium mb-1">
                Teléfono
            </label>
            <InputText id="telefono" type="text" value={ telefono }  
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full md:w-30rem mb-3" style={{ 
                padding: '1rem',
                borderRadius: '15px',
                background: 'rgba(206, 159, 71, 1)',
                borderColor: 'rgba(206, 159, 71, 1)',
                color: 'rgba(41, 49, 51, 1)'
              }}/>

            <label htmlFor="direccion" className="block text-900 text-xl font-medium mb-1">
              Dirección
            </label>
            <InputText id="direccion" type="text" value={ direccion } 
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full md:w-30rem mb-3" style={{ 
                padding: '1rem',
                borderRadius: '15px',
                background: 'rgba(206, 159, 71, 1)',
                borderColor: 'rgba(206, 159, 71, 1)',
                color: 'rgba(41, 49, 51, 1)'
              }}/>

            <label htmlFor="fecha" className="block text-900 text-xl font-medium mb-1">
              Fecha de Nacimiento
            </label>
            <Calendar id="fecha" value={ fecha } showButtonBar className="w-full md:w-30rem mb-3"
              inputStyle={{ 
                padding: '1rem',
                borderRadius: '15px',
                background: 'rgba(206, 159, 71, 1)',
                borderColor: 'rgba(206, 159, 71, 1)',
                color: 'rgba(41, 49, 51, 1)'
              }}
              onChange={(e) => {
                const date: any = e.value;
                setFecha(e.value ?? null);
                setNacimiento(date?.toLocaleString().replace(", 00:00:00", ""));}}/>

            <label htmlFor="ci" className="block text-900 text-xl font-medium mb-1">
              Carnet de Identidad
            </label>
            <InputText id="ci" type="text" value={ ci } className="w-full md:w-30rem mb-3"
              onChange={(e) => setCi(e.target.value)} style={{ 
                padding: '1rem',
                borderRadius: '15px',
                background: 'rgba(206, 159, 71, 1)',
                borderColor: 'rgba(206, 159, 71, 1)',
                color: 'rgba(41, 49, 51, 1)'
              }}/>

            <label htmlFor="sexo" className="block text-900 text-xl font-medium mb-1">
              Sexo
            </label>
            <Dropdown value={ sexo } options={ opciones_sexo } className="w-full md:w-30rem mb-3"
              onChange={(event) => {setSexo(event.target.value)}} style={{ 
                borderRadius: '15px',
                background: 'rgba(206, 159, 71, 1)',
                borderColor: 'rgba(206, 159, 71, 1)',
                color: 'rgba(41, 49, 51, 1)'
              }}/>

            <label htmlFor="civil" className="block text-900 text-xl font-medium mb-1">
              Estado Civil
            </label>
            <Dropdown id="civil" value={ civil } options={ opciones_civil } 
              className="w-full md:w-30rem mb-3"
              onChange={(event) => {setCivil(event.target.value)}} style={{ 
                borderRadius: '15px',
                background: 'rgba(206, 159, 71, 1)',
                borderColor: 'rgba(206, 159, 71, 1)',
                color: 'rgba(41, 49, 51, 1)'
              }}/>

            <label htmlFor="nacionalidad" className="block text-900 text-xl font-medium mb-1">
              Nacionalidad
            </label>
            <InputText id="nacionalidad" type="text" value={ nacionalidad }
              className="w-full md:w-30rem mb-3"
              onChange={(e) => setNacionalidad(e.target.value)} style={{ 
                padding: '1rem',
                borderRadius: '15px',
                background: 'rgba(206, 159, 71, 1)',
                borderColor: 'rgba(206, 159, 71, 1)',
                color: 'rgba(41, 49, 51, 1)'
              }}/>

            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-1">
              Email
            </label>
            <InputText id="email1" type="text" value={email} 
              onChange={(e) => setEmail(e.target.value)} placeholder="Email" 
              className="w-full md:w-30rem mb-3" style={{ 
                padding: '1rem',
                borderRadius: '15px',
                background: 'rgba(206, 159, 71, 1)',
                borderColor: 'rgba(206, 159, 71, 1)',
                color: 'rgba(41, 49, 51, 1)'
              }} />

            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-1">
              Password
            </label>
            <Password toggleMask inputId="password1" value={password} 
              onChange={(e) => setPassword(e.target.value)} inputStyle={{ 
                padding: '1rem',
                borderRadius: '15px',
                background: 'rgba(206, 159, 71, 1)',
                borderColor: 'rgba(206, 159, 71, 1)',
                color: 'rgba(41, 49, 51, 1)'
              }}
              className="w-full mb-3" inputClassName="w-full p-3 md:w-30rem"></Password>
              
            <div className="flex align-items-center justify-content-between mb-4 gap-5">
              <Link href={"/user/paciente/login"} 
                className="font-medium no-underline ml-2 text-right cursor-pointer" 
                style={{ color: 'rgba(51, 107, 134, 1)' }} >
                Ingresar usuario
              </Link>
            </div>
            <Button className="w-full p-3 text-xl justify-content-center" 
              loading={loading} onClick={crear} style={{ 
                borderRadius: '20px',
                background: 'rgba(51, 107, 134, 1)',
                borderColor: 'rgba(51, 107, 134, 1)',
                color: 'rgba(143, 175, 196, 1)'
              }}><p style={shortStack.style}>Crear</p></Button>
          </div>
        </div>
      </div>
    </div>
  </div>);
}

export default Signup_Paciente