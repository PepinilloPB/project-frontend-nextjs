import axios from "axios";

const login = async (body: any) => {
  const current_time = new Date();
  current_time.setTime(current_time.getTime() + (60*60*1000));

  let expires = "expires=" + current_time.toUTCString();

  try {
    await axios.post('https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/login/paci', body)
      .then(response => {
        document.cookie = "token=" + response.data.token + "," + expires + ",path=/user/paciente";
      })
      //.then(() => setTimeout(() => console.log("Cargando..."), 3000));
  } catch (error) {
    console.log(error);
  }
}

export default login;