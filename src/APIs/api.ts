import axios, { AxiosInstance } from "axios";

export const props: any = {
   
    // baseURL: "http://localhost:8001/api/method/",
    baseURL: "http://localhost:8001/api/method/",
    // baseURL: "https://www.api.mirac.et/api/",
    
    // crossdomain: true,
    headers: {
          
    //     "Referrer-Policy": "no-referrer",
    //     "Content-Type": 'multipart/form-data; boudary=' + form._boundary,
    //     "Content-Type": 'application/x-www-form-urlencoded',
    //     "Cache-Control": "no-cache",
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }
};

// export props;

// const api = axios.create(props);

const rest: {
    api: AxiosInstance|null, 
    bodyRequest: Function, 
    formRequest: Function, 
    prepareData: Function
} = {

    api: axios.create(props),

    bodyRequest: async <T>(type: ("post"|"get"|"put"|"delete"|"patch"), route: string, request_data?: any): Promise<T> => {
        try {

            let response;
            switch (type) {
                case "post":
                    response = await rest.api?.post(route, request_data ?? {});
                    break;
                case "put":
                    response = await rest.api?.put(route, request_data ?? {});
                    break;
                case "patch":
                    response = await rest.api?.patch(route, request_data ?? {});
                    break;
                case "delete":
                    response = await rest.api?.delete(route, {data: (request_data ?? {})});
                    break;
                default:
                    response = await rest.api?.get(route, request_data ?? {});
                    break;
            }

            // console.log(response);
            return response ? response.data : {};
    
        }catch(error: any){
            if(error.response.data){
                throw new Error(error.response.data.message);
            }

            throw error;
        }
    },

    formRequest: async (type: string, route: string, request_data?: (object | FormData)): Promise<any> => {
        try {
    
            let data = request_data ? rest.prepareData(request_data) : new FormData();
            return rest.bodyRequest(type, route, data);
    
        }catch(error){
            throw error;
        }
    },

    prepareData: (request_data: any): FormData => {

        if(typeof request_data !== "object"){
            return new FormData();
        }
    
        let req_data = new FormData();
        let arr = Object.keys(request_data);
    
        if(arr.length > 0){
            arr.forEach(key => {req_data.append(key, request_data[key])});
        }
    
        return req_data;
    
    }

}

export function Authorized(token: string){

    props.headers['Content-Type'] = 'application/json'
    props.headers["Authorization1"] = "Bearer " + token;
    rest.api = axios.create(props);
    return rest;

}

export function normal(){
    props.headers['Content-Type'] = 'application/json'
    rest.api = axios.create(props);
    return rest;
}



export async function AuthorizedRequest(token: string, type: string, url: string, request_data?: (object | FormData)): Promise<any> {

    props.headers["authorization"] = "bearer " + token;
    const api = axios.create(props);
    await oldRequest(api, type, url, request_data);

}

export async function Request(type: string, url: string, request_data?: (object | FormData)): Promise<any>{
    
    const api = axios.create(props);
    await oldRequest(api, type, url, request_data);

}

export async function fileRequest(type: string, url: string, request_data?: (object | FormData)): Promise<any>{
    
    props.headers['Content-Type'] = 'multipart/form-data'
    const api = axios.create(props);
    await oldRequest(api, type, url, request_data);

}

export async function authFileRequest(token: string, type: string, url: string, request_data?: (object | FormData)): Promise<any>{
    
    props.headers['Content-Type'] = 'multipart/form-data'
    props.headers['authorization'] = "bearer " + token;
    const api = axios.create(props);
    return await oldRequest(api, type, url, request_data);

}

async function oldRequest(api: AxiosInstance, type: string, url: string, request_data?: (object | FormData)): Promise<any>{
    try {

        let data = request_data ? prepareData(request_data) : new FormData();
        let response = ((type == "post") ? await api.post(url, data) : await api.get(url));
        // if(response.data.message || response.data.message == ""){
        //     throw new Error(response.data.message);
        // }
        // console.log(response);

        return response.data;

    }catch(error){
        throw error;
    }
}

function prepareData(request_data: any): FormData{

    if(typeof request_data !== "object"){
        return new FormData();
    }

    let req_data = new FormData();
    let arr = Object.keys(request_data);

    if(arr.length > 0){
        arr.forEach(key => {req_data.append(key, request_data[key])});
    }

    return req_data;

}

// export default api;