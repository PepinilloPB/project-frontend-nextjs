import axios from 'axios';

const put_cita = async (id: any, body: any) => {
    try {
        await axios.put("https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/cita/" + id, body)
        .then(response => console.log(response.data));
    } catch (error) {
        console.log(error);
    }
}

export default put_cita;