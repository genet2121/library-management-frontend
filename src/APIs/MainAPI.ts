
// import FieldTypes from "../Enums/FiedTypes";
// import Operators from "../Enums/Operators";
// import IPagination from "../Intefaces/IPagination";
// import Utils from "../Models/Utils";
// import { authFileRequest, Authorized } from "./api";

// class MainAPI {

//     private static valueMapper(new_value: {operator: string, value: any, type: string}) {

//         if(new_value.type == FieldTypes.NUMBER || new_value.type == FieldTypes.REFERENCE) {
//             new_value.value = Number.isInteger(new_value.value) ? parseInt(new_value.value) : parseFloat(new_value.value);
//         } else if((new_value.type == FieldTypes.DATE || new_value.type == FieldTypes.DATETIME)) {
//             new_value.value = new Date(new_value.value).toISOString();
//         }

//         return new_value;

//     }

//     public static async getAll(token: string, tableName: string, pageNumber: number, pageSize: number, condition?: any): Promise<IPagination<any>> {

//         try {
//             // let query = condition ? `?${Utils.objectToQueryString(condition)}` : "";
//             // let query = "";

//             // let new_condition: any = {};

//             // for (const key in condition) {
//             //     new_condition[key] = this.valueMapper(condition[key]);
//             // }
            
//             return await Authorized(token).bodyRequest("post", `crud/getlist/${tableName}/${pageNumber}/${pageSize}`, condition);

//         } catch (error: any) {
//             console.log(error.message);
//             return {
//                 Items: [],
//                 PageNumber: 1,
//                 PageSize: 10,
//                 TotalCount: 0
//             };
//         }
//     }
    
//     public static async getorAll(token: string, tableName: string, pageNumber: number, pageSize: number, condition?: any): Promise<IPagination<any>> {

//         try {
//             // let query = condition ? `?${Utils.objectToQueryString(condition)}` : "";
//             // let query = "";

//             // let new_condition: any = {};

//             // for (const key in condition) {
//             //     new_condition[key] = this.valueMapper(condition);
//             // }
            
//             return await Authorized(token).bodyRequest("post", `crud/getorlist/${tableName}/${pageNumber}/${pageSize}?type=related`, condition ?? {});

//         } catch (error: any) {
//             console.log(error.message);
//             return {
//                 Items: [],
//                 PageNumber: 1,
//                 PageSize: 10,
//                 TotalCount: 0
//             };
//         }
//     }
    
//     public static async loadAttachments(token: string, table: string, record_id: string): Promise<IPagination<any>> {

//         try {
//             // let query = condition ? `?${Utils.objectToQueryString(condition)}` : "";
//             // let query = "";
//             return await Authorized(token).bodyRequest("post", `crud/getlist/attachment/1/100`, {
//                 "record": {operator: Operators.IS, type: FieldTypes.NUMBER, value: parseInt(record_id)},
//                 "table": {operator: Operators.IS, type: FieldTypes.TEXT, value: table}
//             });
//         } catch (error: any) {
//             // console.log(error.message);
//             return {
//                 Items: [],
//                 PageNumber: 1,
//                 PageSize: 10,
//                 TotalCount: 0
//             };
//         }
//     }

//     public static async getSingle(token: string, tableName: string, id: number): Promise<any> {
//         try {
//             return await Authorized(token).bodyRequest("get", `crud/getform/${tableName}/${id}`);
//         } catch (error: any) {
//             console.log(error.message);
//             return null;
//         }
//     }

//     public static async getSingleRelated(token: string, tableName: string, id: number): Promise<any> {
//         try {
//             return await Authorized(token).bodyRequest("get", `crud/getform/${tableName}/${id}?type=related`);
//         } catch (error: any) {
//             console.log(error.message);
//             return null;
//         }
//     }

//     public static async getAllRelated(token: string, tableName: string, pageNumber: number, pageSize: number, condition?: any): Promise<IPagination<any>> {

//         try {
//             return await Authorized(token).bodyRequest("post", `crud/getlist/${tableName}/${pageNumber}/${pageSize}?type=related`, condition);
//         } catch (error: any) {
//             console.log(error.message);
//             return {
//                 Items: [],
//                 PageNumber: 1,
//                 PageSize: 10,
//                 TotalCount: 0
//             };
//         }
//     }

//     public static async createNew(token: string, table: string, new_data: any): Promise<any> {
//         return await Authorized(token).bodyRequest("post", "crud/create", {tableName: table, data: new_data});
//     }

//     public static async update(token: string, tableName: string, new_data: any): Promise<any> {
//         return await Authorized(token).bodyRequest("put", "crud/update", {table: tableName, data: new_data});
//     }

//     public static async forSelectBox(token: string, table: string, as_id: string, as_label: string) {
//         try {
//             return await Authorized(token).bodyRequest("get", `crud/selectbox/${table}/${as_id}/${as_label}`);
//         } catch (error: any) {
//             return null;
//         }
//     }

//     public static async delete(token: string, table: string, id: number) {
//         return await Authorized(token).bodyRequest("delete", `crud/delete/${table}/${id}`);
//     }

//     public static async deleteList(token: string, table: string, id_s: number[]) {
//         return await Authorized(token).bodyRequest("post", `crud/deleteList/${table}`, { deleteList: id_s });
//         // try {
//         // } catch (error: any) {
//         //     return null;
//         // }
//     }

//     public static async addAttachment(token: string, table: string, record: number, attachment: {file: any, name: string}){
//         return await authFileRequest(token, "post", "file/upload", {table, record: `${record}`, ...attachment});
//     }
// }

// export default MainAPI;