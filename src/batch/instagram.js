import axios from 'axios';

async function getData(){
  const response = await axios.get('https://api.instagram.com/v1/users/self/media/recent/?access_token=6756377666.0bf922c.05fc969e40cb4233993910dd6f12ed63');
  return response.data.data;
}

export { getData }