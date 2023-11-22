import axios from "axios";

const get_citas_historial = async (historial_id: String) => {
  var citas: any = [];
  
  try {
    await axios.get("https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/cita?historial_id=" + historial_id)
      .then(response => citas = response.data.result);
  } catch (error) {
    citas = error;
  }
    
  return citas;
}

export default get_citas_historial;