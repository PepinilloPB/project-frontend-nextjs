import axios from "axios";

const get_nombres = async (id: String, dir: String) => {
    var nombres : any = [];
    try {
        await axios.get("https://5m67p1dww2.execute-api.us-west-2.amazonaws.com/dev/archivo/" + id + "/" + dir)
            .then(response => nombres = response.data.result)
    } catch (error) {
        console.log(error)
    }
    return nombres;
}

export default get_nombres;