import axios from "axios";

export async function login(){
  console.log('teste')
  try{
    const data = {
      userID: "amanda.kanashiro@thera.com.br",
      accessKey: "123456",
      grantType: "password"
    };
    const response = await axios.post('https://theraponto.dev.thera.com.br:4433/api/Accounts', data);
    console.log('dentro services',response.data)
    return response;
  } catch (error){
    console.error(error)
    throw error
  }
}

