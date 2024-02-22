'use client';
import React, { useContext, useRef, useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { verifyCaptcha } from "./serveractions";
import { useRouter } from 'next/navigation';
import localfont from 'next/font/local';

import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

import { LayoutContext } from '@/layout/context/layoutcontext';
import login_admin from '../utils/login_admin_handler';

const shortStack = localfont({ src: "../../../../../fonts/ShortStack-Regular.ttf" });

const Login_Admin = () => {
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const [isVerified, setIsverified] = useState<boolean>(false)
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { layoutConfig } = useContext(LayoutContext);

  const router = useRouter();
  const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  const autenticar = () => {
    setLoading(true);

    const body = {
      email: email,
      password: password
    }

    login_admin(body).then(() => router.push("/user/admin/inicio"));
  }

  async function handleCaptchaSubmission(token: string | null) {
    // Server function to verify captcha
    await verifyCaptcha(token)
      .then(() => setIsverified(true))
      .catch(() => setIsverified(false))
  }

  return (
    <div className={containerClassName} style={{
      background: 'linear-gradient(180deg, rgba(51, 107, 134, 1) 10%, rgba(51, 107, 134, 1) 30%)'
    }}>
      <div className="flex flex-column align-items-center justify-content-center">
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
              <div className="text-900 text-3xl font-medium mb-3" style={shortStack.style}>Bienvenid@!</div>
              <span className="text-900 font-medium" style={shortStack.style}>Ingrese para continuar</span>
            </div>

            <div>
              <label htmlFor="email1" className="block text-900 text-1xl font-medium mb-2" style={shortStack.style}>
                Email
              </label>
              <InputText id="email1" type="text" value={email} onChange={(e) => setEmail(e.target.value)} 
                className="w-full md:w-30rem mb-5" style={{ 
                  borderRadius: '15px',
                  background: 'rgba(206, 159, 71, 1)',
                  borderColor: 'rgba(206, 159, 71, 1)',
                  color: 'rgba(41, 49, 51, 1)'
                }} />

              <label htmlFor="password" className="block text-900 font-medium text-1xl mb-2" style={shortStack.style}>
                Contraseña
              </label>
              <Password toggleMask inputId="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                inputClassName="w-full p-3 md:w-30rem" feedback={false} className="w-full md:w-30rem mb-5" 
                inputStyle={{ 
                  borderRadius: '15px',
                  background: 'rgba(206, 159, 71, 1)',
                  borderColor: 'rgba(206, 159, 71, 1)',
                  color: 'rgba(41, 49, 51, 1)'
                }}></Password>

              <div className="flex align-items-center justify-content-between mb-5 gap-5">
              </div>

              <>
                <ReCAPTCHA
                  className="flex align-items-center justify-content-center mb-5 gap-5"
                  sitekey="6LcOjHwpAAAAAAnBBNg7B-YkLRXCzq0FJmVyMmOb"
                  ref={recaptchaRef}
                  onChange={handleCaptchaSubmission}
                />
              </>

              <Button 
                disabled={!isVerified} 
                loading={loading} 
                onClick={autenticar}
                className="w-full p-3 text-xl justify-content-center" 
                style={{ 
                  borderRadius: '20px',
                  background: 'rgba(51, 107, 134, 1)',
                  borderColor: 'rgba(51, 107, 134, 1)',
                  color: 'rgba(143, 175, 196, 1)'
                }}>
                <p style={shortStack.style}>Ingresar</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login_Admin;