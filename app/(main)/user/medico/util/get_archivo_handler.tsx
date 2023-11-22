import axios from "axios";

const get_archivo = async (id: String, dir: String, file: String) => {
    var archivo : any = [];
    try {
        await axios.get("https://5m67p1dww2.execute-api.us-west-2.amazonaws.com/dev/archivo/" + id + "/" + dir + "/" + file)
            .then(response => archivo = response.data.result)
    } catch (error) {
        console.log(error)
    }
    return archivo;
}

export default get_archivo;