import IField from "./IField";

export default interface IFormAction {
    lable: any;
    class: string;
    icon?: any;
    roles: string[];
    backToList?: boolean;
    condition?: (token: string, fields: IField[], loggedUser?: any) => boolean;
    action: (token: string, fields: IField[], loggedUser?: any) => Promise<void>;

}