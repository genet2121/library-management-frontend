import React, { useContext, useEffect, useState } from "react";
import IField from "../Intefaces/IField";
import { useNavigate, useParams } from "react-router-dom";
import IForm from "../Intefaces/IForm";
import AlertContext from "../Contexts/AlertContext";
import AuthContext from "../Contexts/AuthContext";
import FieldTypes from "../Enums/FiedTypes";
import Forms from "./Forms";
import IRelatedList from "../Intefaces/IRelatedList";
import IFormAction from "../Intefaces/IFormAction";
import CustomeSelectBox from "../Components/Reusables/CustomeSelectBox";
import Select from "react-select";
import Utils from "../Models/Utils";




function CreateCompany() {

    const { setAlert, setWaiting, showWaiting } = useContext(AlertContext);
    const { loggedUser,  cookies, localData } = useContext(AuthContext);
    const [form, setForm] = useState<IForm>();
    const [fieldValues, setFieldValues] = useState<any>({});
    const [currentRelatedList, setCurrentRelatedList] = useState<string>("");
    const [allRelatedList, setAllRelatedList] = useState<IRelatedList[]>([]);
  
    const [urlParams, setURLParams] = useState<any>({});


    const params = useParams();
    const navigate = useNavigate();

    const prepareForm = async () => {

        setTimeout(() => {setWaiting(true);}, 10);
        let spec = getFormSpec(params.name ?? "");
        let new_fields = await spec.onload(cookies.login_token, spec.fields, localData, loggedUser, params.r_id);
       
        spec.fields = new_fields;
       
        let temp_fields: any = new Object();
        new_fields.forEach(({ id, value }) => {
           
            Object.defineProperty(temp_fields, id, {
                value: value,
                writable: true,
            });
        })

        // console.log("roles check ", Utils.checkRole(loggedUser.roles, spec.actions[0].roles), spec.actions[0].roles, loggedUser.roles);
       
        setFieldValues(temp_fields);
        setForm(spec);
        console.log('abnet', form);
        setAllRelatedList(spec.relatedList);
        // loadAttachment();
        setCurrentRelatedList(spec.relatedList.length > 0 ? spec.relatedList[0].id : "");

        setTimeout(() => {setWaiting(false);}, 10);
    }

    useEffect(() => {

        console.log("url loggedUser genet", loggedUser.roles);
        prepareForm();

    }, [urlParams]);

    useEffect(() => {

       
        if(urlParams.name != params.name || urlParams.r_id != params.r_id) {
            setURLParams(params);
        }

    }, [params]);

    const fieldSetter = (index: number, value: IField) => {

      
        if(form) {
            let temp = {...form};
            let new_value = ((temp.fields[index].type == FieldTypes.NUMBER) ? (Number.isInteger(temp.fields[index].value) ? parseInt(value.value) : parseFloat(value.value)) : value.value)
            temp.fields[index] = {...value, value: new_value};
            setForm(temp);
        }

    }

    


    const submitForm = async (event: any) => {

        event.preventDefault();

        setTimeout(() => {
            setWaiting(true);
        }, 1);

        try {
            let response = await form?.onsubmit(cookies.login_token, form.fields);
            // setAlert("Record Created Successfully", "success");
            setAlert(response.message.message, "success");
            navigate(`/list/${params.name}`);
            
        } catch (error: any) {
            setAlert(error.message, "error");
        }

        setTimeout(() => {
            setWaiting(false);
        }, 2);


    }
    const insertAndStay = async (event: any) => {

        event.preventDefault();
        setTimeout(() => {
            setWaiting(true);
        }, 1);

        try {
            let response = await form?.onsubmit(cookies.login_token, form.fields);
            setAlert(response.message, "success");
            navigate(`/form/${params.name}/${response.data[(form?.id.replace("tbl_", "") ?? "")][form?.realId ?? "id"]}`);
        } catch (error: any) {
            setAlert(error.message, "error");
        }

        setTimeout(() => {
            setWaiting(false);
        }, 2);

    }

    const getFormSpec = (form_name: string): IForm => {

        let found_form = Forms.find(frm => (frm.id == form_name));
        if (!found_form) {
            throw new Error("Form not found");
        }

        return found_form;
    }

    const actionCall = async (formAction: IFormAction, frm: any) => {
        setTimeout(() => {
            setWaiting(true);
        }, 1);

        try {
            let response: any = await formAction.action(cookies.login_token, frm.fields, loggedUser);
            setAlert(response.message, "success");
            // setAlert("Action Successful", "success");
            setTimeout(() => {
                setWaiting(false);
            }, 1);

            if(formAction.backToList) {
                navigate(`/list/${params.name}`);
            }
        } catch (error: any) {
            setAlert(error.message, "error");
            setTimeout(() => { setWaiting(false); }, 1);
        }
    }

    return (
        <div className="w-100 zpanel" style={{overflow: "visible"}}>
            {(form) ? (
                <div className="d-flex justify-content-between align-itmes-center pt-2 pb-2 ps-4 pe-4" style={{backgroundColor: "rgba(125, 125, 125, 0.074)"}} >
                    <h5 className="card-title">{form?.title}</h5>
                    <div className="btn-groups">

                        {/* {
                            form.actions.map(action => (params.r_id && parseInt(params.r_id) > 0 && action.roles.includes(loggedUser.role) && ((!action.condition) || (action.condition && (action.condition(cookies.login_token, form.fields, null))))) ? (
                            // form.actions.map(action => (params.r_id && parseInt(params.r_id) > 0 && ((!action.condition) || (action.condition && (action.condition("cookies.login_token", form.fields, null))))) ? (
                                <button className={`btn btn-sm me-3 ${action.class}`} onClick={() => { actionCall(action, form) }}>{action.lable}</button>
                            ) : (<></>))
                        } */}
                        

                    {/*
                        form.actions.map(action => (  
                                <button 
                                    className={`btn btn-sm me-3 ${action.class}`} 
                                    onClick={() => { actionCall(action, form) }}
                                >
                                    {action.lable}
                                </button>
                            
                        ))
                    */}
                    {
                        form.actions.map(action => (( params.r_id != "-1" && 
                            Utils.checkRole(loggedUser.roles, action.roles) && 
                            ((!action.condition) || (action.condition && action.condition(cookies.login_token, form.fields, null)))) ? (
                                <button 
                                    className={`btn btn-sm me-3 ${action.class}`} 
                                    onClick={() => { actionCall(action, form) }}
                                >
                                    {action.lable}
                                </button>
                            ) : (<></>)
                        ))
                    }
                    {
                        (params.r_id && parseInt(params.r_id) < 1) &&
                        (<button className="btn zbtn btn-sm me-3" onClick={submitForm} >Submit</button>)
                    }
                    {
                        (params.r_id && parseInt(params.r_id) < 1) &&
                        (<button className="btn zbtn-outline btn-sm" onClick={insertAndStay} >Save Stay</button>)
                    }
                    </div>
                </div>) : (<></>)}
            {form ? (
                <div className="row p-0 m-0">
                  
                    <div className={(params.r_id && parseInt(params.r_id) > 0 && form.hasAttachment) ? "col-sm-12 col-md-12 col-lg-9" : "col-12"}>
                        <div className="container mt-4">
                            <div className="form_section w-100 mb-4">
                                <div className="row">
                                    {
                                        form?.fields.map((field, field_index) => {
                                            if (!field.visible) {
                                                return <></>;
                                            } else {
                                                if ([FieldTypes.TEXT, FieldTypes.EMAIL, FieldTypes.PASSWORD, FieldTypes.NUMBER, FieldTypes.DATE, FieldTypes.DATETIME].includes(field.type)) {
                                                    return (
                                                        <div key={field.id} className="col-sm-12 col-md-6 col-lg-4">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    {(field.required) && (<b style={{color: "red", fontSize: "20px"}}>*</b>)}
                                                                    {field.label}
                                                                </label>
                                                                <input
                                                                    id={field.id}
                                                                    placeholder={field.label}
                                                                    type={field.type}
                                                                    value={field.value}
                                                                    className="form-control zinput"
                                                                    required={field.required}
                                                                    disabled={field.readonly}
                                                                    readOnly={field.readonly}
                                                                    title={field.description}
                                                                    data-bs-toggle="tooltip" data-bs-title="Popover title" data-bs-content="And here's some amazing content. It's very engaging. Right?"
                                                                    onChange={async (event: any) => {
                                                                        try {

                                                                            let new_value = event.target.value;
                                                                            await field.onchange(cookies.login_token, form.fields, new_value, fieldSetter);
                                                                            let tmp = field;
                                                                            if(field.type == FieldTypes.NUMBER) {
                                                                                tmp.value = Number.isInteger(new_value) ? parseInt(new_value) : parseFloat(new_value);
                                                                            } else {
                                                                                tmp.value = new_value;
                                                                            }

                                                                            fieldSetter(field_index, tmp);

                                                                        } catch(err: any) {
                                                                            setAlert(err.message, "error");
                                                                        }
                                                                    }}
                                                                    
                                                                    onFocus={() => {
                                                                        let element = document.getElementById(`${field.id}_help`);
                                                                        if(element) {
                                                                            element.style.display = "";
                                                                        }
                                                                    }}

                                                                    onBlur={() => {
                                                                        let element = document.getElementById(`${field.id}_help`);
                                                                        if(element) {
                                                                            element.style.display = "none";
                                                                        }
                                                                    }}
                                                                />
                                                                <div id={`${field.id}_help`} style={{display: "none", color: "var(--text-color)"}} className="form-text">{field.description}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                if (FieldTypes.REFERENCE == field.type) {
                                                    return (
                                                        <div key={field.id} className="col-sm-12 col-md-6 col-lg-4">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    {(field.required) && (<b style={{color: "red", fontSize: "20px"}}>*</b>)}
                                                                    {field.label}
                                                                </label>
                                                                <div className="d-flex w-100">
                                                                    <CustomeSelectBox
                                                                        id={field.id}
                                                                        title={field.description}
                                                                        options={field.options ?? []}
                                                                        givenValue={field.value}
                                                                        disabled={field.readonly}
                                                                        onChange={async (event: any) => {
                                                                            let tmp = {...field};
                                                                            let new_value = await field.onchange(cookies.login_token, form.fields, event, fieldSetter, localData);
                                                                            tmp.value = new_value.value;
                                                                            fieldSetter(field_index, tmp);
                                                                        }}

                                                                        onFocus={() => {
                                                                            let element = document.getElementById(`${field.id}_help`);
                                                                            if(element) {
                                                                                element.style.display = "";
                                                                            }
                                                                        }}
    
                                                                        onBlur={() => {
                                                                            let element = document.getElementById(`${field.id}_help`);
                                                                            if(element) {
                                                                                element.style.display = "none";
                                                                            }
                                                                        }}
                                                                    />
                                                                    {/*
                                                                        (params.r_id != "-1" && Number.isInteger(field.value)) && (
                                                                            <button className="btn btn-light ms-2 shadow-sm" onClick={() => {
                                                                                goToReference(parseInt(field.value), field.references ?? "")
                                                                            }}>
                                                                                { <PushPinIcon /> }
                                                                            </button>
                                                                        )
                                                                    */}
                                                                </div>
                                                                <div id={`${field.id}_help`} style={{display: "none", color: "var(--text-color)"}} className="form-text">{field.description}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                             

                                                if (FieldTypes.MULTISELECT == field.type) {
                                                    return (
                                                      <div key={field.id} className="col-sm-12 col-md-6 col-lg-4">
                                                        <div className="mb-3">
                                                          <label className="form-label">
                                                            {field.required && <b style={{ color: "red", fontSize: "20px" }}>*</b>}
                                                            {field.label}
                                                          </label>
                                                          <div className="d-flex w-100">
                                                            {/* **MultiSelect using react-select** */}
                                                            <Select
                                                              id={field.id}
                                                              isMulti
                                                              options={field.options?.map(option => ({
                                                                value: option.value,
                                                                label: option.label,
                                                              }))}
                                                              value={field.options?.filter(option => field.value?.includes(option.value))}
                                                              onChange={async (selectedOptions) => {
                                                                let selectedValues = selectedOptions.map(option => option.value);
                                                                let vl = await field.onchange(cookies.login_token, form.fields, selectedValues, fieldSetter, localData);
                                                                fieldSetter(field_index, { ...field, value: vl });
                                                              }}
                                                              isDisabled={field.readonly}
                                                              className="w-100"
                                                             
                                                            />
                                                          </div>
                                                          <div id={`${field.id}_help`} style={{ display: "none", color: "var(--text-color)" }} className="form-text">
                                                            {field.description}
                                                          </div>
                                                        </div>
                                                      </div>
                                                    );
                                                  }
                                                  
                                              
                                            }
                                        })
                                    }

                                </div>

                                {
                                    (params.r_id && parseInt(params.r_id) < 1) &&
                                    (<button type="button" className="btn zbtn btn-sm ms-3" onClick={submitForm} >Submit</button>)
                                }
                                {/* {
                                    form.actions.map(action => (params.r_id && parseInt(params.r_id) > 0 && action.roles.includes(loggedUser.role) && ((!action.condition) || (action.condition && (action.condition(cookies.login_token, form.fields, loggedUser))))) ? (
                                        <button className={`btn btn-sm me-3 ${action.class}`} onClick={() => { actionCall(action, form) }}>{action.lable}</button>
                                    ) : (<></>))
                                } */}
                                {
                                form.actions.map(action => (
                                    params.r_id && parseInt(params.r_id) > 0 && 
                                    action.roles.some(role => loggedUser.roles.includes(role)) && 
                                    ((!action.condition) || (action.condition && action.condition(cookies.login_token, form.fields, loggedUser))) ? (
                                        <button 
                                            className={`btn btn-sm me-3 ${action.class}`} 
                                            onClick={() => { actionCall(action, form) }}
                                        >
                                            {action.lable}
                                        </button>
                                    ) : (<></>))
                                )
                            }

                            </div>

                        </div>
                    </div>
                </div>
            ) : (!showWaiting && (""))}
    
        </div>
    );
}

export default CreateCompany;