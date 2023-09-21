import axios from "./axios";

export async function create(url:string, data:object) {
    const response = await axios.post(`/${url}`,data);
    console.log("posted: ", response.data);
    return response.data;
}
  
export async function get(url:string) {
    const response = await axios.get(`/${url}`);
    console.log("fetched: ", response.data);
    return response.data;
}

export async function edit(url:string, new_data:object) {
    console.log(url, new_data);
    
    const response = await axios.put(`/${url}`, new_data);
    console.log("editted: ", response.data);
    return response.data;
}

export async function remove(url:string) {
    return axios.delete(`/${url}`);
    // console.log("deleted: ", response.data);
    // return response.data;
}
