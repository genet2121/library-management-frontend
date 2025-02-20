import { authFileRequest, Authorized } from "./api";
import FieldTypes from "../Enums/FiedTypes";
import Operators from "../Enums/Operators";
import IPagination from "../Intefaces/IPagination";
import Utils from "../Models/Utils";
import axios from "axios";

class AdminAPI {
    
    public static async getAll(token: string, tableName: string, pageNumber: number, pageSize: number, condition?: any,  ): Promise<IPagination<any>> {

        try {
          

            let condition_string = Utils.objectToQueryString(condition);
           
            let result = await Authorized(token).bodyRequest("get", `${tableName}?page=${pageNumber}&limit=${pageSize}${condition_string == "" ? "" : "&"}${condition_string}`, {});
            return {
                Items: result.message,
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            };

        } catch (error: any) {
            console.log(error.message);
            return {
                Items: [],
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            };
        }
    }

    
    public static async getAllwithoutPagination(token: string, tableName: string,   ) {

        try {
          
            let result = await Authorized(token).bodyRequest("get", `${tableName}`);
            return {
                Items: result.message || [],
                TotalCount:0
            };

        } catch (error: any) {
            console.log(error.message);
            return {
                Items: [],
               
                
            };
        }
    }
    public static async getTotalCount(token: string, tableName: string,  ) {

        try {
          
            let result = await Authorized(token).bodyRequest("get", `${tableName}`);
            return {
                Items: result
                
            };

        } catch (error: any) {
            console.log(error.message);
            return {
                Items: [],
               
                
            };
        }
    }
    public static async getorAll(token: string, tableName: string, pageNumber: number, pageSize: number, condition?: any): Promise<IPagination<any>> {

        try {
            // let query = condition ? `?${Utils.objectToQueryString(condition)}` : "";
            // let query = "";

            // let new_condition: any = {};

            // for (const key in condition) {
            //     new_condition[key] = this.valueMapper(condition);
            // }
            
            return await Authorized(token).bodyRequest("post", `crud/getorlist/${tableName}/${pageNumber}/${pageSize}?type=related`, condition ?? {});

        } catch (error: any) {
            console.log(error.message);
            return {
                Items: [],
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            };
        }
    }
    
    public static async loadAttachments(token: string, table: string, record_id: string): Promise<IPagination<any>> {

        try {
            // let query = condition ? `?${Utils.objectToQueryString(condition)}` : "";
            // let query = "";
            return await Authorized(token).bodyRequest("post", `crud/getlist/attachment/1/100`, {
                "record": {operator: Operators.IS, type: FieldTypes.NUMBER, value: parseInt(record_id)},
                "table": {operator: Operators.IS, type: FieldTypes.TEXT, value: table}
            });
        } catch (error: any) {
            // console.log(error.message);
            return {
                Items: [],
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            };
        }
    }

    public static async getSingle(token: string, tableName: string, id: number, parm: string ): Promise<any> {
        try {
            // let result = await Authorized(token).bodyRequest("get", `${tableName}/${id}`);
            let result = await Authorized(token).bodyRequest("get", `${tableName}?${parm}=${id}`);
            return result.message || [];
        } catch (error: any) {
            console.log(error.message);
            return null;
        }
    }

    public static async getSingleRelated(token: string, tableName: string, id: number): Promise<any> {
        try {
            return await Authorized(token).bodyRequest("get", `crud/getform/${tableName}/${id}?type=related`);
        } catch (error: any) {
            console.log(error.message);
            return null;
        }
    }

    public static async getAllRelated(token: string, tableName: string, pageNumber: number, pageSize: number, condition?: any): Promise<IPagination<any>> {

        try {
            return await Authorized(token).bodyRequest("post", `crud/getlist/${tableName}/${pageNumber}/${pageSize}?type=related`, condition);
        } catch (error: any) {
            console.log(error.message);
            return {
                Items: [],
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            };
        }
    }

    public static async createNew(token: string, table: string, new_data: any): Promise<any> {
        return await Authorized(token).bodyRequest("post", table, new_data);
    }

    public static async update(token: string, tableName: string, new_data: any): Promise<any> {
        // return await Authorized(token).bodyRequest("put", "crud/update", {table: tableName, data: new_data});
        return await Authorized(token).bodyRequest("post",  tableName, new_data);
    }

    public static async forSelectBox(token: string, table: string, as_id: string, as_label: string) {
        try {
            return await Authorized(token).bodyRequest("get", `crud/selectbox/${table}/${as_id}/${as_label}`);
        } catch (error: any) {
            return null;
        }
    }
    // public static async delete(token: string, table: string, id: number) {
    //     return await Authorized(token).bodyRequest("delete", `crud/delete/${table}/${id}`);
    // }
    
    public static async deletList(token: string, table: string, id_s: string[]) {
        let tableName
        if (table == "v1/user"){
            tableName = "library_management.api.delete_user"
            return await Authorized(token).bodyRequest("post", `${tableName}`, { email: id_s });
        }
        else if (table == "v1/book"){
            tableName = "library_management.api.delete_book"
            return await Authorized(token).bodyRequest("post", `${tableName}`, { book_id: id_s });
        }else {
            console.error("Invalid table name");
            return null;
        }
       
        // try {
        // } catch (error: any) {
        //     return null;
        // }
    }
    public static async deleteList(token: string, table: string, id_s: string[]) {
        let tableName;
        let body;
    
        console.log("Received table name:", table); 
    
        switch (table.toLowerCase()) {
            case "user":
                tableName = "library_management.api.delete_user";
                body = { ids: id_s };
                break;
            case "book":
                tableName = "library_management.api.delete_book";
                body = { ids: id_s };
                break;
            case "member":
                tableName = "library_management.api.delete_member";
                body = { ids: id_s };
                break;
            case "loan":
                tableName = "library_management.api.delete_loan";
                body = { ids: id_s };
                break;
            default:
                console.error("Invalid table name:", table);
                return null;
        }
    
        try {
            console.log("Requesting:", tableName);
            console.log("Body:", body);
    
            const response = await Authorized(token).bodyRequest("post", tableName, body);
    
            console.log("API Response:", response);
            return response;
        } catch (error) {
            console.error("Error calling deleteList:", error);
            return null;
        }
    }
    
    

    public static async addAttachment(token: string, table: string, record: number, attachment: {file: any, name: string}){
        return await authFileRequest(token, "post", "file/upload", {table, record: `${record}`, ...attachment});
    }

    public static async uploadImage(file: any) {
        const CLOUD_NAME = "dtbvvcp04";
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default");
        let result = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData);
        return result.data;
    }

};

export default AdminAPI;