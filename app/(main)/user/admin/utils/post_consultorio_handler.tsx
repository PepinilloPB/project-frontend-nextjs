import axios from "axios";

const post_consultorio = async (body: any) => {
    var empleado: any = {};
    try {
        await axios.post("https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/consultorio", body)
        .then(response => empleado = response.data.result)
    } catch (error) {
        console.log(error)
    }
    return empleado
}

export default post_consultorio