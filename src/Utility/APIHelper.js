import axios from 'axios';

const BASE_URL="http://localhost:27030/api"


export default function APIHelper()
{
   
}
export function get(url) {
    axios.defaults.headers.common['Authorization'] =`Bearer ${JSON.parse(localStorage.getItem('userToken'))}`;
    return axios.get(`${BASE_URL}/${url}`);
}
export function getfile(url) {
    axios.defaults.headers.common['Authorization'] =`Bearer ${JSON.parse(localStorage.getItem('userToken'))}`;
    return axios.get(`${BASE_URL}/${url}`,{ responseType: 'arraybuffer'});
}
 export function post(url, data)  {
    axios.defaults.headers.common['Authorization'] =`Bearer ${JSON.parse(localStorage.getItem('userToken'))}`;
    return axios(`${BASE_URL}/${url}`, {
        method: 'post',
        headers:{'Access-Control-Allow-Origin': true,
        "Accept":"application/json",
        "Content-Type": 'multipart/form-data'},
        data:data,
    });
}
export function put(url, data)  {
    axios.defaults.headers.common['Authorization'] =`Bearer ${JSON.parse(localStorage.getItem('userToken'))}`;
    return axios(`${BASE_URL}/${url}`, {
        method: 'put',
        headers:{'Access-Control-Allow-Origin': true,
        "Accept":"application/json",
        "Content-Type": 'multipart/form-data'},
        data:data,
    });
}