import axios from "axios";

const post_empleado = async (body: any) => {
    var empleado: any = {};
    try {
        await axios.post("https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/empleado", body)
        .then(response => empleado = response.data.result)
    } catch (error) {
        console.log(error)
    }
    return empleado
}

export default post_empleado