import {Authorized, normal} from "./api";


export async function Login(phone: string, password: string){

    try{

        let response = await normal().bodyRequest("post", "library_management.api.user_login", {
            email: phone,
            password: password
        });

        return response;

    }catch(error){
        throw error;
    }

}

export async function information(token: string): Promise<{status: boolean, data: (any | null)}> {

    try{

        let response = await Authorized(token).bodyRequest("get", "auth/authorize");
        
        return {
            status: true,
            data: {...response, token: token}
        };

    }catch (error: any){
        console.log(error.message);
    }

    return {
        status: false,
        data: null
    };

}


export async function signup(fields:any) {
    try {
        let response = await normal().bodyRequest("post", "v1/admin/firstaccount", fields); 
        return response;
    } catch (error) {
        throw error;
    }
}

export async function changeDefaultPassword(id: string, fields: any) {
    try {
        let response = await normal().bodyRequest("patch", `v1/admin/${id}/defaultpassword`, {
            default_password: fields.default_password,
            password: fields.password,
            confirm_password: fields.confirm_password
        });

        return response;
    } catch (error) {
        throw error;
    }
}


export async function createUser(token: string, user_data: {
    name: string,
    email: string,
    password: string,
}) {
    try{
        let response = await Authorized(token).bodyRequest("post", "/Users/create", user_data);
    }catch(error){
        throw error;
    }
}
