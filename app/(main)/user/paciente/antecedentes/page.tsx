'use client'
import React, { useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import localfont from 'next/font/local';

import { Accordion, AccordionTab } from 'primereact/accordion';
import { classNames } from 'primereact/utils';
import { ProgressSpinner } from 'primereact/progressspinner';

import { LayoutContext } from '@/layout/context/layoutcontext';
import Acceso_Denegado from "../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";

import get_un_historial from "../utils/get_historial_handler";

const shortStack = localfont({ src: "../../../../../fonts/ShortStack-Regular.ttf" });

const Antecedentes_Medicos = () => {
  const [denegado, setDenegado] = useState(false);
  const [loading, setLoading] = useState(true);

  const [historial, setHistorial] = useState({
    nombre: "",
    apellido: "",
    nacimiento: "",
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
    med_habitual: ""
  });

  const { layoutConfig } = useContext(LayoutContext);
  const containerClassName = 
    classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', 
    { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  var token: any = {};

  /*try {
    token = jwt_decode(document.cookie.replace("token=", ""));

    useEffect(() => {
      get_un_historial(token['custom:historial'])
      .then(data => {
        setLoading(false);
        setHistorial(data);
        console.log(data);
      })
    }, []);
  } catch (error) {
    useEffect(() => setDenegado(true), []);
  }*/

  useEffect(() => {
    try {
      token = jwt_decode(document.cookie.replace("token=", ""));
      get_un_historial(token['custom:historial'])
      .then(data => {
        setLoading(false);
        setHistorial(data);
        console.log(data);
      });
    } catch (error) {
      setDenegado(true)
    }
  }, []);

  return (denegado ? <><Acceso_Denegado /></> : 
    <div style={{
      background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)'
    }}>
      {/*<Navbar tipo_usuario="paciente"/>*/}
      { loading === true ? 
      (<div className={containerClassName}><ProgressSpinner /></div>) : 
      (<div className="card" style={{
        background: 'rgba(143, 175, 196, 1)',
        borderColor: 'rgba(143, 175, 196, 1)',
        //height: window.innerHeight
      }}>
        <h5 style={shortStack.style}>Antecedentes Médicos</h5>
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
        </Accordion>
      </div>)}
    </div>);
}

export default Antecedentes_Medicos