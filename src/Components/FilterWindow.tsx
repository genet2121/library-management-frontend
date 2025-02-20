import React, { useContext, useEffect, useState } from "react";
import AlertContext from "../Contexts/AlertContext";
import AuthContext from "../Contexts/AuthContext";
import IField from "../Intefaces/IField";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import FieldTypes from "../Enums/FiedTypes";
import { isMobile } from "react-device-detect";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import IForm from "../Intefaces/IForm";
import Operators from "../Enums/Operators";
import AddIcon from '@mui/icons-material/Add';

const wstyle: any = isMobile ? {
    width: "100%",
    maxHeight: "80vh",
    top: "10%",
    position: "absolute"
} : {
    width: "65%",
    maxHeight: "80vh",
    left: "50%",
    top: "10%",
    transform: "translateX(-50%)",
    position: "absolute"
}

function FilterWindow({ form, conditions, filter, closeWindow }: {
    form: IForm,
    closeWindow: () => void,
    conditions: any,
    filter: (conditions: any) => void
}) {

    const { loggedUser, authWaiting, cookies, localData } = useContext(AuthContext);
    const { setAlert, setWaiting } = useContext(AlertContext);

    const [fields, setFields] = useState<IField[]>([]);
    const [selectedColumn, setSelectedColumn] = useState<string>("");
    const [conditionFilter, setConditionFilter] = useState<any>({});

    useEffect(() => {
        loadContent();
    }, [form]);

    const loadContent = async () => {
        let allFields: IField[] = await form.onload(cookies.login_token, form.fields, localData, loggedUser, -1);
        console.log("initial condition", conditions);
        setFields(allFields.map(fld => {
            // let vl = conditions[fld.id] ? conditions[fld.id].split("|") : [fltr, fld.type, ""];
            if(conditions[fld.id]){
                let fltr = ((fld.type == FieldTypes.DATE || fld.type == FieldTypes.DATETIME) ? Operators.ON : Operators.IS);
                fld.value = conditions[fld.id].value ?? "";
                fld.filter = conditions[fld.id].operator ?? fltr;
            }
            return fld;
        }));
        setConditionFilter((con: any) => ({...con, ...conditions}));
    };

    const valueMapper = (new_value: {operator: string, value: any, type: string}) => {
        
        if(new_value.type == FieldTypes.NUMBER || new_value.type == FieldTypes.REFERENCE) {
            new_value.value = Number.isInteger(new_value.value) ? parseInt(new_value.value) : parseFloat(new_value.value);
        } else if((new_value.type == FieldTypes.DATE || new_value.type == FieldTypes.DATETIME)) {
            new_value.value = new Date(new_value.value).toISOString();
        }

        return new_value;

    }

    const fieldSetter = (value: IField) => {

        let temp: any = conditionFilter;

        let temp_fields = fields.map(fld => {
            fld.value = (fld.id == value.id) ? value.value : fld.value;
            if(temp[fld.id]) {
                temp[fld.id] = valueMapper({
                    operator: conditionFilter[fld.id].operator,
                    value: fld.value,
                    type: fld.type
                });
            }
            // `${fld.filter}|${fld.type}|${fld.value}`;
            return fld;
        });

        setFields(temp_fields);
        setConditionFilter(temp);

    }

    const conditionSetter = (value: IField) => {

        if(value.filter) {
            let temp: any = conditionFilter;
            let temp_fields = fields.map(fld => {
                fld.filter = (fld.id == value.id) ? value.filter : fld.filter;
                if(temp[fld.id]) {
                    temp[fld.id] = {
                        operator: fld.filter,
                        value: fld.value,
                        type: fld.type
                    };
                }
                return fld;
            });
    
            setFields(temp_fields);
            setConditionFilter(temp);
        }

    }

    const setColumn = (event: any) => {
        console.log(conditionFilter);
        if(selectedColumn != "" && !conditionFilter[selectedColumn]) {

            let found_field = fields.find(vl => (vl.id == selectedColumn && ![FieldTypes.DATETIME, FieldTypes.DATE, FieldTypes.IMAGE].includes(vl.type)));
            if(found_field){
                let computed_filter = (found_field?.type == FieldTypes.DATE || found_field?.type == FieldTypes.DATETIME) ? Operators.ON : Operators.IS;
                setConditionFilter((cf: any) => ({...cf, [selectedColumn]: {
                    value: "",
                    operator: computed_filter,
                    type: found_field?.type
                } }));
                // setFields(flds => flds.map(field => ({
                //     ...field,
                //     filter: computed_filter
                // })));
            }
        }
        setSelectedColumn("");
    }

    const removeColumnCondition = (field_id: string) => {
        let temp_cond: any = {};
        for(let key in conditionFilter){
            if(key != field_id) {
                temp_cond[key] = conditionFilter[key];
            }
        }

        setConditionFilter((cond: any) => ({...temp_cond}));
    }

    const submit = () => {
        // let temp_filter = {};
        // for(let key in conditionFilter){
        //     if(conditionFilter[key].value != undefined && conditionFilter[key].operator != undefined) {
        //     }
        // }
        filter(conditionFilter);
    }

    return (
        <div className="card rounded shadow-sm zpanel" style={wstyle}>

            <div className="card-header d-flex justify-content-between align-items-center" style={{backgroundColor: "rgba(125, 125, 125, 0.074)"}}>
                <h5 className="card-title">
                    Filter {form.title} Records
                </h5>
                <IconButton onClick={closeWindow}>
                    <CloseIcon sx={{ fontSize: 20, color: "red" }} />
                </IconButton>
            </div>
            <div className="card-body" style={{ height: "100%", overflow: "auto" }}>
                <div className="mb-3 d-flex justify-content-start">
                    {/* <label className="form-label" style={{width: "30%"}}>{field.label}</label> */}
                    <select
                        id={`add_condition_column`}
                        title="Select Condition Column"
                        className="form-control me-3 zinput"
                        style={{width: "30%"}}
                        value={selectedColumn}
                        onChange={async (event: any) => {
                            // await field.onchange(cookies.login_token, form.fields, event.target.value, fieldSetter);
                            setSelectedColumn(event.target.value);
                        }}
                    >

                        <option value="" >Select Column</option>
                        {
                            fields.map(field => (!field.notFilter) ? (
                                (field.id == selectedColumn) ? (<option key={`field_option_${field.id}`} value={field.id} selected >{field.label}</option>) : (<option value={field.id} >{field.label}</option>)
                            ) : (<></>))
                        }
                    </select>
                    <button disabled={selectedColumn == ""} className="btn btn-sm zbtn" style={{ width: "max-content" }} onClick={setColumn}>
                        <AddIcon sx={{ fontSize: 20, marginRight: "5px" }} />
                        Add Condition
                    </button>
                </div>
                <hr className="mb-4" />
                {
                    fields.map(field => {
                        if (field.notFilter || !conditionFilter[field.id]) {
                            return <></>;
                        } else {
                            if ([FieldTypes.TEXT, FieldTypes.TEXTAREA, FieldTypes.EMAIL, FieldTypes.NUMBER, FieldTypes.DATE, FieldTypes.DATETIME].includes(field.type)) {
                                return (
                                    <div key={field.id} className="mb-3 d-flex justify-content-between">
                                        <label className="form-label" style={{width: "35%"}}>
                                            <button className="btn btn-sm btn-danger me-3" style={{ width: "max-content" }} onClick={() => {removeColumnCondition(field.id);}}>
                                                <CloseIcon sx={{ fontSize: 20 }} />
                                            </button>
                                            {field.label}
                                        </label>
                                        <select
                                            id={`operator_${field.id}`}
                                            title="operator"
                                            className="form-control zinput"
                                            style={{width: "30%"}}
                                            value={field.filter}
                                            onChange={async (event: any) => {
                                                // await field.onchange(cookies.login_token, form.fields, event.target.value, fieldSetter);
                                                let tmp = field;
                                                tmp.filter = event.target.value;
                                                conditionSetter(tmp);
                                            }}
                                        >
                                            <option value={Operators.IS} selected={(Operators.IS == field.filter)}>Is</option>
                                            {(field.type == FieldTypes.DATE || field.type == FieldTypes.DATETIME) && (
                                                <option value={Operators.ON} selected={(Operators.ON == field.filter)}>On</option>
                                            )}
                                            {(field.type == FieldTypes.NUMBER) && (
                                                <option value={Operators.LESS} selected={(Operators.LESS == field.filter)}>Less Than</option>
                                            )}
                                            {(field.type == FieldTypes.NUMBER) && (
                                                <option value={Operators.GREATER} selected={(Operators.GREATER == field.filter)}>Greater Than</option>
                                            )}
                                            {([FieldTypes.TEXT, FieldTypes.TEXTAREA, FieldTypes.EMAIL].includes(field.type)) && (
                                                <option value={Operators.CONTAINS} selected={(Operators.CONTAINS == field.filter)}>Contains</option>
                                            )}
                                            <option value={Operators.NOT} selected={(Operators.NOT == field.filter)}>Not</option>
                                        </select>
                                        <input
                                            id={field.id}
                                            placeholder={field.label}
                                            type={field.type}
                                            value={field.value}
                                            className="form-control zinput"
                                            style={{width: "30%"}}
                                            onChange={async (event: any) => {
                                                // await field.onchange(cookies.login_token, fields, event.target.value, fieldSetter);
                                                let tmp = field;
                                                tmp.value = event.target.value;
                                                fieldSetter(tmp);
                                            }}
                                        />
                                    </div>
                                );
                            }
                            if (FieldTypes.SELECT == field.type || FieldTypes.REFERENCE) {
                                return (
                                    <div key={field.id} className="mb-3 d-flex justify-content-between">
                                        <label className="form-label d-flex" style={{width: "35%"}}>
                                            <button className="btn btn-sm btn-danger me-3" style={{ width: "max-content" }} onClick={() => {removeColumnCondition(field.id);}}>
                                                <CloseIcon sx={{ fontSize: 20 }} />
                                            </button>
                                            {field.label}
                                        </label>
                                        <select
                                            id={`operator_${field.id}`}
                                            title="operator"
                                            className="form-control"
                                            style={{width: "30%"}}
                                            value={field.filter}
                                            onChange={async (event: any) => {
                                                // await field.onchange(cookies.login_token, form.fields, event.target.value, fieldSetter);
                                                let tmp = field;
                                                tmp.filter = event.target.value;
                                                conditionSetter(tmp);
                                            }}
                                        >
                                            <option value={Operators.IS}>Is</option>
                                        </select>
                                        <select
                                            id={field.id}
                                            title={field.description}
                                            className="form-control"
                                            style={{width: "30%"}}
                                            value={field.value}
                                            onChange={async (event: any) => {
                                                // await field.onchange(cookies.login_token, form.fields, event.target.value, fieldSetter);
                                                let tmp = field;
                                                tmp.value = field.type == FieldTypes.REFERENCE ? parseInt(event.target.value) : event.target.value;
                                                // tmp.value = event.target.value;
                                                fieldSetter(tmp);
                                            }}
                                        >
                                            <option value="">None</option>
                                            {field.options?.map(option => {
                                                return (
                                                    (field.value == option.value) ?
                                                        (<option value={option.value} selected>{option.label}</option>) :
                                                        (<option value={option.value}>{option.label}</option>)
                                                );
                                            })}
                                        </select>
                                    </div>
                                );
                            }

                        }
                    })
                }

            </div>

            <div className="card-footer d-flex justify-content-end" style={{backgroundColor: "rgba(125, 125, 125, 0.074)"}}>
                <button className="btn btn-sm zbtn" style={{ width: "max-content" }} onClick={() => { filter(conditionFilter); }}>
                    <FilterAltIcon sx={{ fontSize: 20 }} />
                    Filter
                </button>
            </div>

        </div>
    );

}

export default FilterWindow;