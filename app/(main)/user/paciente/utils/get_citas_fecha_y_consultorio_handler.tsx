import axios from "axios";

const get_citas_fecha_consultorio = async (fecha: String | undefined, consultorio: String) => {
  var citas: any = [];

  try {
    await axios.get(
      "https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/cita?consultorio_id=" + consultorio + "&fecha=" + fecha)
      .then(response => citas = response.data.result);
  } catch (error) {
    console.log(error)
  }

    return citas;
}

export default get_citas_fecha_consultorio