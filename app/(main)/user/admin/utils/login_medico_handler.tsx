import axios from "axios";

const login_medico = async (body: any) => {
  const current_time = new Date();
  current_time.setTime(current_time.getTime() + (60*60*1000));

  let expires = "expires=" + current_time.toUTCString();

  var token = "";

  try {
    await axios.post('https://hoccb28teb.execute-api.us-west-2.amazonaws.com/dev/login/medico', body)
      .then(response => {
        document.cookie = "token=" + response.data.token + ";" + expires + ";path=/user/medico";
        token = response.data.token;
      });
  } catch (error) {
    console.log(error);
  }

  return token;
}

export default login_medico;