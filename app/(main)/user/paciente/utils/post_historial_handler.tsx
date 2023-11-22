import axios from "axios";

const post_historial = async (body: any) => {
    var data: any = "";
    try {
        await axios.post('https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/historial', body)
        .then(response => data = response.data)
    } catch (error) {
        console.log(error);
    }
    return data;
}

export default post_historial