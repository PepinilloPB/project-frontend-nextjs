import axios from 'axios';

const get_un_consultorio = async(id: any) => {
  var consultorio: any = {};
    
  try {
    await axios.get("https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/consultorio/" + id)
      .then(response => consultorio = response.data.result);
  } catch (error) {
    console.log(error);
  }

  return consultorio;
}

export default get_un_consultorio;