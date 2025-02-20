import AuthResult from "./AuthResult";
import IField from "./IField";
import IFormAction from "./IFormAction";
import IPagination from "./IPagination";
import IRelatedList from "./IRelatedList";
import LocalData from "./LocalData";

export default interface IForm {
    title: string;
    id: string;
    fields: IField[];
    actions: IFormAction[];
    roles?: string[];
    relatedList: IRelatedList[];
    hasAttachment: boolean;
    idColumn?: string;
    realId?: string;
    notDisplayAddButton?: boolean;
    hidePagination?: boolean;
    onsubmit: (token: string, fileds: any) => Promise<any>;
    onload: (token: string, fields: IField[], localData: (LocalData | any), loggedUser: (AuthResult | any), id?: any) => Promise<IField[]>;
    listLoader?: (token: string, pageNumber: number, pageSize: number, localData: (LocalData | any), condition?: any) => Promise<IPagination<any>>;
}