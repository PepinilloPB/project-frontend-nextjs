import axios from "axios";

const post_cita = async (cita : any) => {
  try {
    await axios.post("https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/cita", cita)
      .then(response => console.log(response.data));
  } catch (error) {
    console.log(error)      
  }
}

export default post_cita;