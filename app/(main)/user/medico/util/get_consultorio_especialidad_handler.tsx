import axios from "axios";

const get_consultorio_especialidad = async (especialidad: any) => {
  var consultorios: any = [];
    
  try {
    await axios.get("https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/consultorio?especialidad=" + especialidad)
      .then(response => consultorios = response.data.result);   
  } catch (error) {
    console.log(error);
  }

  return consultorios;
}

export default get_consultorio_especialidad;