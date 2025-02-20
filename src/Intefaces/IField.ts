import FieldTypes from "../Enums/FiedTypes";
import Operators from "../Enums/Operators";
import LocalData from "./LocalData";

export default interface IField {
    id: string;
    label: string;
    type: FieldTypes;
    description: string;
    value: any;
    filter?: Operators;
    displayValue?: any;
    order: number;
    references?: string,
    required: boolean;
    visible: boolean;
    readonly?: boolean;
    notOnList?: boolean;
    editorExpanded?: boolean;
    notFilter?: boolean;
    options?: {value: any, label: string, color?: string, bgColor?: string}[];
    
    onchange: (token: string, fields: IField[], value: any, set_field: (index: number, value: IField) => void, localData?: any) => Promise<any>
}