import axios from "axios";

const get_un_historial = async (id: any) => {
  var historial: any = {}
  try {
    await axios.get("https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/historial/" + id)
      .then(response => historial = response.data.result)
  } catch (error) {
    console.log(error)
  }
  return historial
}

export default get_un_historial;