import axios from "axios";

const get_peticiones = async () => {
    var peticiones: any = [];

    try {
      await axios.get("https://5m67p1dww2.execute-api.us-west-2.amazonaws.com/dev/peticion")
        .then(response => peticiones = response.data.result);
    } catch (error) {
      peticiones = error;
    }

    return peticiones;
}

export default get_peticiones