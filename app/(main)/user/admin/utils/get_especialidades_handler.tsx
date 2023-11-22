import axios from "axios";

const get_especialidades = async () => {
    var especialidades: any = [];

    try {
      await axios.get("https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/especialidad")
        .then(response => especialidades = response.data.result);
    } catch (error) {
      especialidades = error;
    }

    return especialidades;
}

export default get_especialidades