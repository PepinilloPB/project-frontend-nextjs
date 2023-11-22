import axios from "axios";

const get_empleados_consultorio = async (id: any) => {
  var consultorios: any = [];
  try {
    await axios.get("https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/empleado?consultorio_id=" + id)
      .then(response => consultorios = response.data.result);
  } catch (error) {
    console.log(error)
  }
  return consultorios;
}

export default get_empleados_consultorio;