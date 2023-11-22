import axios from "axios";

const put_consultorio = async (id: any, body: any) => {
    try {
        await axios.put('https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/consultorio/' + id, body)
        .then(response => console.log(response.data.result))
    } catch (error) {
        console.log(error);
    }
}

export default put_consultorio