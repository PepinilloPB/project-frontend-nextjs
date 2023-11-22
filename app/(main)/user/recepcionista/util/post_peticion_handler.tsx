//https://5m67p1dww2.execute-api.us-west-2.amazonaws.com/dev/peticion

import axios from "axios";

const post_peticion = async (body: any) => {
    try {
        await axios.post("https://5m67p1dww2.execute-api.us-west-2.amazonaws.com/dev/peticion", body)
        .then(response => console.log(response))
    } catch (error) {
        console.log(error)
    }
}

export default post_peticion