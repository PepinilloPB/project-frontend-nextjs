import axios from "axios";

const put_peticion = async (id: any, body: any) => {
    try {
        await axios.put('https://5m67p1dww2.execute-api.us-west-2.amazonaws.com/dev/peticion/' + id, body)
        .then(response => console.log(response.data.result))
    } catch (error) {
        console.log(error);
    }
}

export default put_peticion