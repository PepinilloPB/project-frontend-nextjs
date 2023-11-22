import axios from "axios";

const get_un_empleado = async (id: String) => {
    var empleado: any = {}
    try {
        await axios.get("https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/empleado/" + id)
            .then(response => empleado = response.data.result);
    } catch (error) {
        console.log(error);
    }
    return empleado
}

export default get_un_empleado;