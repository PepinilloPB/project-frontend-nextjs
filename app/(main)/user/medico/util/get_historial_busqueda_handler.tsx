import axios from 'axios';

const get_historial_busqueda = async (query: String) => {
    var historiales : any = [];
    try {
        await axios.get("https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/historial?" + query)
            .then(response => historiales = response.data.result)
    } catch (error) {
        console.log(error)
    }
    return historiales;
}

export default get_historial_busqueda;