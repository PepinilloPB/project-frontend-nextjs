import axios from "axios";

const get_una_cita = async (id: any) => {
  var cita: any = {}

  try {
    await axios.get("https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/cita/" + id)
      .then(response => cita = response.data.result);
  } catch (error) {
    console.log(error);
  }

  return cita;
}

export default get_una_cita;