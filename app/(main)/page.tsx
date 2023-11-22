'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import localfont from 'next/font/local';

import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ProgressSpinner } from 'primereact/progressspinner';

import { LayoutContext } from '../../layout/context/layoutcontext';

const shortStack = localfont({ src: "../../fonts/ShortStack-Regular.ttf" });

export default function Home() {
  const [isHidden, setIsHidden] = useState(false);
  const [displayBasic, setDisplayBasic] = useState(false);
  const [loading, setLoading] = useState(false);

  const { layoutConfig } = useContext(LayoutContext);
  const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  const router = useRouter();

  const menuRef = useRef<HTMLElement | null>(null);
  const panel = useRef<OverlayPanel>(null);

  const basicDialogFooter = 
    <Button type="button" label="OK" onClick={() => setDisplayBasic(false)} icon="pi pi-check" outlined />;

  return loading ? 
    (<div className={containerClassName}><ProgressSpinner /></div>) : (
      <div className="surface-0 flex justify-content-center">
      <div id="home" className="landing-wrapper overflow-hidden"
      style={{
        //background: 'rgba(206, 159, 71, 0.9)'
        background: 'rgba(51, 107, 134, 1)'
      }}>
        { /**********CABECERA**********/ }
        <div id="hero" className="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
          style={{
            background: 'rgba(143, 175, 196, 1)',
            clipPath: 'ellipse(150% 87% at 93% 13%)'
          }}>
          <div className="mx-4 md:mx-8 mt-0 md:mt-4">
            <h1 className="text-5xl font-bold text-gray-900 line-height-2"
            style={shortStack.style}>
              <span className="font-light block">Bienvenido a MediNow</span>El sistema para la salud de Bolivia 
            </h1>
            <p className="font-normal text-2xl line-height-3 md:mt-3 text-gray-700" style={shortStack.style}>
            Mejore la eficiencia operativa, gestionando datos médicos, historias clínicas y recursos para ofrecer una atención más precisa y efectiva a los pacientes.
            </p>
            {/*<Link href="/#features" onClick={() => setLoading(true)}>
              <Button type="button" label="Ingresar" rounded className="text-xl border-none mt-3 bg-blue-500 font-normal line-height-3 px-3 text-white"></Button>
            </Link>*/}
          </div>
          <div className="flex justify-content-center md:justify-content-end">
            <img src="https://www.pngplay.com/wp-content/uploads/7/Doctor-Transparent-Free-PNG.png" alt="img" className="w-9 md:w-auto" />
          </div>
        </div>

        {/**********BOTONES**********/}
        <div id="features" 
          className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
          <div className="grid justify-content-center">
            <div className="col-12 text-center mt-8 mb-4" style={shortStack.style}>
              <h2 className="text-900 font-normal mb-2">Opciones del Sistema</h2>
              <span className="text-900 text-2xl">Ingrese como...</span>
            </div>

            <div className="col-12 md:col-12 lg:col-5 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
              <div style={{
                height: '160px',
                padding: '2px',
                borderRadius: '10px',
                background: 'rgba(206, 159, 71, 1)'
              }}>
                <div className="p-3 surface-card h-full" style={{ 
                  background: 'linear-gradient(90deg, rgba(206, 159, 71, 1), rgba(206, 159, 71, 1)',
                  //borderRadius: '8px'
                }}>
                  <div className="flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '3.5rem',
                      height: '3.5rem',
                      borderRadius: '10px',
                      background: 'rgba(143, 175, 196, 1)'
                    }}>
                      <Link href="/user/paciente/login" onClick={() => setLoading(true)}>
                        <i className="pi pi-fw pi-users text-2xl"></i>
                      </Link>
                  </div>
                  <h5 className="mb-2 text-900" style={shortStack.style}>Paciente</h5>
                  <span className="text-900" style={shortStack.style}>Ingrese al sistema como paciente</span>
                </div>
              </div>
            </div>

            <div className="col-12 md:col-12 lg:col-5 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
              <div style={{
                height: '160px',
                padding: '2px',
                borderRadius: '10px',
                background: 'rgba(206, 159, 71, 1)'
              }}>
                <div className="p-3 surface-card h-full" style={{ 
                  borderRadius: '8px', 
                  background: 'linear-gradient(90deg, rgba(206, 159, 71, 1), rgba(206, 159, 71, 1)',
                }}>
                  <div className="flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '3.5rem',
                      height: '3.5rem',
                      borderRadius: '10px',
                      background: 'rgba(143, 175, 196, 1)'
                    }}>
                    <i className="pi pi-fw pi-plus text-2xl" onClick={() => setDisplayBasic(true)}></i>

                    <Dialog header={<p style={shortStack.style}>Ingresar como...</p>} visible={displayBasic} 
                      style={{ width: '30vw', background: 'rgba(255, 255, 255, 1)' }} modal onHide={() => setDisplayBasic(false)}>
                      <div className="flex flex-column align-items-center justify-content-center">
                        <div className="mb-2">
                          <Button style={{
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)'
                          }}
                          onClick={() => {
                            setLoading(true);
                            router.push('/user/medico/login');
                          }}><p style={shortStack.style}>Médico</p></Button>
                        </div>
                        <div className="mb-2">
                          <Button style={{
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)'
                          }}
                          onClick={() => {
                            setLoading(true);
                            router.push('/user/recepcionista/login');
                          }}><p style={shortStack.style}>Recepcionista</p></Button>
                        </div>
                        <div className="mb-2">
                          <Button style={{
                            background: 'rgba(51, 107, 134, 1)',
                            borderColor: 'rgba(51, 107, 134, 1)'
                          }}
                          onClick={() => {
                            setLoading(true);
                            router.push('/user/admin/login');
                          }}><p style={shortStack.style}>Administrador</p></Button>
                        </div>
                      </div>
                    </Dialog>
                  </div>
                  <h5 className="mb-2 text-900" style={shortStack.style}>Consultorio</h5>
                  <span className="text-900" style={shortStack.style}>Ingrese al sistema como empleado</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/**********PETICIÓN**********/}
        {/*<div id="features" className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
          <div className="grid justify-content-center">
            <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
              <h2 className="text-900 font-normal mb-2">Petición para crear consultorio</h2>
              <Button label='Realizar Petición'></Button>
            </div>
          </div>
        </div>*/}
      </div>
    </div>
  )
}
