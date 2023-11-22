import axios from "axios";

const signup_recepcionista = async (body: any) => {
    try {
        await axios.post("https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/signup/recep", body)
        .then(response => console.log(response.data))
    } catch (error) {
        console.log(error)
    }
}

export default signup_recepcionista