import IField from "./IField";
import IPagination from "./IPagination";
import LocalData from "./LocalData";

export default interface IRelatedList {
    id: string,
    lable: string;
    form: string;
    relatingColumn: string;
    loader: (filds: IField[]) => any
}