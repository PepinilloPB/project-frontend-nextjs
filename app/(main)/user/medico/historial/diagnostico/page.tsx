'use client'
import React, { useState, useContext, useEffect, useRef } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";
import axios from "axios";
import localfont from 'next/font/local';

import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { classNames } from 'primereact/utils';
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressSpinner } from 'primereact/progressspinner';

import { LayoutContext } from '@/layout/context/layoutcontext';
import Acceso_Denegado from "../../acceso_denegado";
import Navbar from "@/app/(project)/components/navbar/page";

import get_una_cita from "../../util/get_una_cita_handler";
import get_un_historial from "../../util/get_un_historial_handler";
import put_historial from "../../util/put_historial_handler";
import put_cita from "../../util/put_cita_handler";
import get_nombres from "../../util/get_nombres_archivos_handler";
import get_archivo from "../../util/get_archivo_handler";

const shortStack = localfont({ src: "../../../../../../fonts/ShortStack-Regular.ttf" });

const Ver_Diagnostico = () => {
  const MAX_IMAGE_SIZE = 100000000

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loadingAnte, setLoadingAnte] = useState(false);
  const [loadingDiag, setLoadingDiag] = useState(false);
  const [denegado, setDenegado] = useState(false);
  const [subirArchivo, setSubirArchivo] = useState(false);

  const [id, setId] = useState("");
  const [patologicos, setPatologicos] = useState("");
  const [noPatologicos, setNoPatologicos] = useState("");
  const [quirurgicos, setQuirurgicos] = useState("");
  const [alergicos, setAlergicos] = useState("");
  const [medicina, setMedicina] = useState("");
  const [motivosConsulta, setMotivoConsulta] = useState("");
  const [examenFisico, setExamenFisico] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [tratamiento, setTratamiento] = useState("");

  const [costo, setCosto] = useState(0);

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
  });

  const [filesAnt, setFilesAnt] = useState<any[]>([]);
  const [filesDiag, setFilesDiag] = useState<any[]>([]);
  const [filesAntSubidos, setFilesAntSubidos] = useState<any[]>([]);
  const [base64Ant, setBase64Ant] = useState<String[]>([]);
  const [base64Diag, setBase64Diag] = useState<String[]>([]);

  const { layoutConfig } = useContext(LayoutContext);
  const containerClassName = 
    classNames('surface-ground flex align-items-center justify-content-center overflow-hidden', 
    { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  var token: any = {};

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setId(params.get('id') ?? "");

    try {
      token = jwt_decode(document.cookie.replace("token=", ""));
      get_una_cita(params.get('id') ?? "").then(data => {
        setCita(data);
        /*setMotivoConsulta(data.motivos_consulta);
        setExamenFisico(data.examen_fisico);
        setDiagnostico(data.diagnostico);
        setTratamiento(data.tratamiento);*/

        get_un_historial(data.historial_id).then(value => {
          setHistorial(value);

          setPatologicos(value.a_patologicos);
          setNoPatologicos(value.a_no_patologicos);
          setQuirurgicos(value.a_quirurgicos);
          setAlergicos(value.a_alergicos);
          setMedicina(value.med_habitual);

          get_nombres(value.id, "ant").then(data => {
            var f: any = [];
  
            data.map((item: String, i: any) => {
              f.push({nombre: item.split("/")[item.split("/").length - 1]})
            });
  
            setFilesAntSubidos(f);

          }).then(() => setLoading(false));
        });
      });
    } catch (error) {
      setDenegado(true);
    }
  }, []);

  const confirmar_ante = () => {
    setLoadingAnte(true);

    const body = {
      a_patologicos: patologicos,
      a_no_patologicos: noPatologicos,
      a_quirurgicos: quirurgicos,
      a_alergicos: alergicos,
      med_habitual: medicina
    }

    put_historial(cita.historial_id, body).then(() => setLoadingAnte(false));
  };

  const confirmar_cita = () => {
    setLoading(true);

    const body_cita = {
      motivos_consulta: motivosConsulta,
      examen_fisico: examenFisico,
      diagnostico: diagnostico,
      tratamiento: tratamiento,
      cita_estado: 1,
      costo: costo,
      pagado: false
    }

    const body_historial = {
      a_patologicos: patologicos,
      a_no_patologicos: noPatologicos,
      a_quirurgicos: quirurgicos,
      a_alergicos: alergicos,
      med_habitual: medicina
    }
    
    put_cita(id, body_cita)
    .then(() => put_historial(cita.historial_id, body_historial)
      .then(() => router.push('/user/medico/citas')))
  };

  const subir_archivos_ant = async (e: any) => {
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

  const subir_archivos_diag = async (e: any) => {
    setLoading(true);

    for(let i = 0; i < base64Diag.length; i++){
      let binario = atob(base64Diag[i].split(",")[1]);

      let array = [];

      for (let j = 0; j < binario.length; j++) {
        array.push(binario.charCodeAt(j))
      }
  
      let blobData = new Blob([new Uint8Array(array)], {type: filesDiag[i].type});

      try {
        await axios.post('https://5m67p1dww2.execute-api.us-west-2.amazonaws.com/dev/archivo', filesDiag[i])
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
  };

  const crear_archivos_diagnosticos = (files: any[], fecha: String) => {
    fecha = fecha.replaceAll("/", "-");

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
  
        setBase64Diag(state => [...state, e.target.result]);
        setFilesDiag(state => [...state, archivo]);
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
    background: 'linear-gradient(180deg, rgba(206, 159, 71, 1) 10%, rgba(206, 159, 71, 1) 30%)'
  }}>
    <Navbar tipo_usuario="medico"/>
    { loading ? 
    <div className={containerClassName}><ProgressSpinner /></div> :
    <div className="grid" style={{
      background: 'rgba(143, 175, 196, 1)',
      height: window.innerHeight
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
                    Ficha # { cita.num_ficha }
                  </div>
                  <ul className="list-none p-0 m-0 mb-3">
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-4 font-medium">Fecha de la Cita</div>
                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                      { cita.fecha_cita }
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-4 font-medium">Hora de la Cita</div>
                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                      { cita.hora_cita }
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-4 font-medium">Costo de la Cita</div>
                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                        <InputNumber value={costo} onChange={(e) => setCosto(e.value ?? 0)} inputStyle={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}></InputNumber>
                      </div>
                    </li>
                    {/*<li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-4 font-medium">Tipo de Pago</div>
                      <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                        <InputNumber value={costo} onChange={(e) => setCosto(e.value ?? 0)} inputStyle={{ 
                            borderRadius: '15px',
                            background: 'rgba(206, 159, 71, 1)',
                            borderColor: 'rgba(206, 159, 71, 1)',
                            color: 'rgba(41, 49, 51, 1)'
                          }}></InputNumber>
                      </div>
                        </li>*/}
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                      <div className="text-700 w-6 md:w-2 font-medium">Creación y Actualización</div>
                      <div className="mr-5 flex align-items-center mt-3">
                        <i className="pi pi-calendar mr-2"></i>
                        <span>Fecha Creación: { new Date(cita.fecha_creacion).toLocaleDateString() }</span>
                      </div>
                      <div className="mr-5 flex align-items-center mt-3">
                        <i className="pi pi-globe mr-2"></i>
                        <span>Última Actualización: { new Date(cita.fecha_actualizacion).toLocaleDateString() }</span>
                      </div>
                    </li>
                    <li className="flex align-items-center border-top-1 border-300 flex-wrap">
                      <div className="md:w-12">
                        <Accordion style={shortStack.style}>
                          <AccordionTab header="Datos de Paciente">
                            <ul className="list-none p-0 m-0 mb-3">
                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-4 font-medium">Código</div>
                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                { historial.codigo }
                                </div>
                              </li>
                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-4 font-medium">Nombre</div>
                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                  { historial.nombre }
                                </div>
                              </li>
                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-4 font-medium">Apellido</div>
                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                  { historial.apellido }
                                </div>
                              </li>
                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-4 font-medium">Fecha de Nacimiento</div>
                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                  { historial.nacimiento }
                                </div>
                              </li>
                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-4 font-medium">C.I.</div>
                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                  { historial.ci }
                                </div>
                              </li>
                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-4 font-medium">Sexo</div>
                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                  { historial.sexo }
                                </div>
                              </li>
                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-4 font-medium">Estado Civil</div>
                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                  { historial.estado_civil }
                                </div>
                              </li>
                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-4 font-medium">Teléfono</div>
                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                  { historial.telefono }
                                </div>
                              </li>
                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-4 font-medium">Dirección</div>
                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                  { historial.direccion }
                                </div>
                              </li>
                              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-4 font-medium">Nacionalidad</div>
                                <div className="text-900 md:w-6 md:flex-order-0 flex-order-1">
                                  { historial.nacionalidad }
                                </div>
                              </li>
                            </ul>
                          </AccordionTab>
                          <AccordionTab header="Antecedentes Médicos">
                          { loadingAnte ?
                            <div className={containerClassName}><ProgressSpinner /></div> :
                            <Accordion style={shortStack.style}>
                              <AccordionTab header="Antecedentes Patológicos">
                                {<InputTextarea rows={5} cols={30}
                                  value={patologicos}
                                  onChange={(e) => setPatologicos(e.target.value)}/>}
                              </AccordionTab>
                              <AccordionTab header="Antecedentes No Patológicos">
                                <InputTextarea rows={5} cols={30}
                                  value={noPatologicos}
                                  onChange={(e) => setNoPatologicos(e.target.value)}/>
                              </AccordionTab>
                              <AccordionTab header="Antecedentes Quirúrgicos">
                                <InputTextarea rows={5} cols={30}
                                  value={quirurgicos}
                                  onChange={(e) => setQuirurgicos(e.target.value)}/>
                              </AccordionTab>
                              <AccordionTab header="Antecedentes Alérgicos">
                                <InputTextarea rows={5} cols={30}
                                  value={alergicos}
                                  onChange={(e) => setAlergicos(e.target.value)}/>
                              </AccordionTab>
                              <AccordionTab header="Medicación Habitual">
                                { medicina }
                                <InputTextarea rows={5} cols={30}
                                  value={medicina}
                                  onChange={(e) => setMedicina(e.target.value)}/>
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
                                      uploadHandler={subir_archivos_ant}
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
                            </Accordion>}
                          </AccordionTab>
                          <AccordionTab header="Diagnóstico Médico">
                          { loadingDiag ?
                            <div className={containerClassName}><ProgressSpinner /></div> :
                            <Accordion style={shortStack.style}>
                              <AccordionTab header="Motivo de la Consulta">
                                <InputTextarea rows={5} cols={30}
                                  value={motivosConsulta} 
                                  onChange={(e) => setMotivoConsulta(e.target.value)}/>
                              </AccordionTab>
                              <AccordionTab header="Examen Físico">
                                <InputTextarea rows={5} cols={30}
                                  value={examenFisico}
                                  onChange={(e) => setExamenFisico(e.target.value)}/>
                              </AccordionTab>
                              <AccordionTab header="Diagnóstico de la Consulta">
                                <InputTextarea rows={5} cols={30}
                                  value={diagnostico}
                                  onChange={(e) => setDiagnostico(e.target.value)}/>
                              </AccordionTab>
                              <AccordionTab header="Tratamiento Recetado">
                                <InputTextarea rows={5} cols={30}
                                  value={tratamiento}
                                  onChange={(e) => setTratamiento(e.target.value)}/>
                              </AccordionTab>
                              <AccordionTab header="Archivos de Diagnóstico">
                                <div className="field col-12 md:col-12" style={shortStack.style}>
                                  <label>Archivos</label>
                                  <FileUpload name="demo[]" multiple accept="*" customUpload 
                                    onSelect={(e) => crear_archivos_diagnosticos(e.files, cita.fecha_cita)}
                                    uploadHandler={subir_archivos_diag}
                                    chooseLabel="Añadir Archivo"
                                    uploadLabel="Subir Archivos"
                                    cancelLabel="Cancelar"
                                    onClear={() => {
                                      setBase64Diag([]); 
                                      setFilesDiag([]);
                                    }}/>
                                </div>
                              </AccordionTab>
                            </Accordion>}
                          </AccordionTab>
                        </Accordion>
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                      <div className="w-6 md:w-12 font-medium">
                        <Button label="Completar Consulta" onClick={confirmar_cita}
                          disabled={
                            motivosConsulta === "" || 
                            examenFisico === "" ||
                            diagnostico === "" ||
                            tratamiento === "" ||
                            costo === 0}/>
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

export default Ver_Diagnostico;