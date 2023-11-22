import axios from "axios";

const post_actualizar_usuario = async (body: any) => {
    try {
        await axios.post("https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/password/user", body)
        .then(response => console.log(response))
    } catch (error) {
        console.log(error)
    }
}

export default post_actualizar_usuario