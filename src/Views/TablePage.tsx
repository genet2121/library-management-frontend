import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListComponent from "./ListComponent";
import Forms from "./Forms";
import IForm from "../Intefaces/IForm";
import AuthContext from "../Contexts/AuthContext";
import IPagination from "../Intefaces/IPagination";
import AlertContext from "../Contexts/AlertContext";
import FilterWindow from "../Components/FilterWindow";
import Utils from "../Models/Utils";
import Waiting from "../Components/Extra/Waiting";
import UserRoles from "../Enums/UserRoles";
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PrintIcon from '@mui/icons-material/Print';
import AdminAPI from "../APIs/AdminAPI";

function TablePage(props: {
    formName: string;
    isRelatedList: boolean;
    condition: any;
    parentValue?: any;
}) {

    const { setAlert } = useContext(AlertContext);
    const { loggedUser, cookies, localData } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showWaiting, setWaiting] = useState<boolean>(false);
    const [form, setForm] = useState<IForm | null>();
    const [records, setRecords] = useState<IPagination<any>>({
        Items: [],
        PageNumber: 1,
        PageSize: 10,
        TotalCount: 0
    });
    const [pageSetting, setPageSetting] = useState<{ pageSize: number, pageNumber: number }>({
        pageSize: 10,
        pageNumber: 1
    });
    const [visibleWindow, setVisibleWindow] = useState<string>("");
    const [filterConditions, setFilterConditions] = useState<any>({});
    const [filterQuery, setFilterQuery] = useState<string>("");
    const [selectedIds, setSelectedIds] = useState<any[]>([]);

    useEffect(() => {
        return () => (setRecords({
            Items: [],
            PageNumber: 1,
            PageSize: 10,
            TotalCount: 0
        }))
    }, []);

    useEffect(() => {
        let found_form = Forms.find(frm => (frm.id == props.formName));
       
        if (found_form) {
            // if (found_form && found_form.roles.includes(loggedUser.Roles[0])) {
            setForm(found_form);
            setFilterConditions({ ...filterConditions, ...props.condition });
            setPageSetting({
                pageSize: 10,
                pageNumber: 1
            });
           
        } else {
            setRecords({
                Items: [],
                PageNumber: 1,
                PageSize: 10,
                TotalCount: 0
            });
            setForm(null);
        }
    }, [props]);

    useEffect(() => {
        let temp_qs = Utils.objectToQueryString(filterConditions);
        setFilterQuery(temp_qs);
        getData();
    }, [filterConditions, form, pageSetting]);

    const getData = async (form_given?: IForm) => {
       
        if (form_given && form_given?.listLoader) {
            setRecords(await form_given.listLoader(cookies.login_token, pageSetting.pageNumber, pageSetting.pageSize, localData, filterConditions ?? {}));
        } else if (form?.listLoader) {
            setRecords(await form.listLoader(cookies.login_token, pageSetting.pageNumber, pageSetting.pageSize, localData, filterConditions ?? {}));
        } else {
            setRecords({ Items: [], PageNumber: pageSetting.pageNumber, PageSize: pageSetting.pageSize, TotalCount: 0 });
        }
       

    }

    const goToForm = (id: number) => {
        navigate(`/form/${props.formName}/${id}`);
    }

    const openWindow = (winId = "") => {
        setVisibleWindow(winId);
    }

    const nextPage = () => {
        if (records.TotalCount / pageSetting.pageSize > pageSetting.pageNumber) {
            setPageSetting({ ...pageSetting, pageNumber: pageSetting.pageNumber + 1 });
        }
    }

    const previousPage = () => {
        if (pageSetting.pageNumber != 1) {
            setPageSetting({ ...pageSetting, pageNumber: pageSetting.pageNumber - 1 });
        }
    }


    // const deleteSelected = async () => {
    //     if (window.confirm("Are you sure? all selected records will be deleted.")) {
    //         console.log('selectedIds', selectedIds);
    
    //         try {
               
    //             const response = await AdminAPI.deleteList(
    //                 cookies.login_token, 
    //                 (form?.id.replace("tbl_", "") ?? ""), 
    //                 selectedIds
    //             );

    //                 setSelectedIds([]);
    //                 setRecords(recs => ({
    //                     ...recs,
    //                     Items: records.Items.filter(rc => !selectedIds.includes(rc.id))
    //                 }));
                    
                   
    //                 setAlert(`${response.message.message}`, "success");
                
    //         } catch (error) {
               
    //             console.error('Error deleting records:', error);
    //             setAlert(`${error} Failed to delete records. Please try again`, "error");
    //         }
    //     }
    // }
    const deleteSelected = async () => {
        if (window.confirm("Are you sure? All selected records will be deleted.")) {
            console.log('Selected IDs:', selectedIds);
    
            try {
                const response = await AdminAPI.deleteList(
                    cookies.login_token, 
                    form?.id.replace("tbl_", "") ?? "", 
                    selectedIds
                );
    
                if (response) {
                    console.log("Delete Response:", response);
                    setSelectedIds([]);
                    setRecords(recs => ({
                        ...recs,
                        Items: recs.Items.filter(rc => !selectedIds.includes(rc.id))
                    }));
                    setAlert(`${response.message.message}`, "success");
                } else {
                    //setAlert("Failed to delete records. Please try again.", "error");
                }
    
            } catch (error) {
                console.error('Error deleting records:', error);
                setAlert("Error: Failed to delete records. Please try again.", "error");
            }
        }
    };
    
    

    return (
        <div className="w-100 h-100 zpanel" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div className="px-4">
                {
                    form ? (<div className="d-flex justify-content-between align-items-center py-4 border-bottom">
                        <div className="d-flex">
                            <h5 className="card-title me-3 fs-4" style={{ fontWeight: "700" }}>{form.title}</h5>
                           
                        </div>
                        <div className="btn-group">
                            {
                                (selectedIds.length > 0) && (<button className="btn btn-danger btn-sm me-3" onClick={() => { deleteSelected(); }}>Delete</button>)
                                // (selectedIds.length > 0 && loggedUser.Roles.includes(UserRoles.ADMIN)) && (<button className="btn btn-danger btn-sm me-3" onClick={() => { deleteSelected(); }}>Delete</button>)
                            }
                            <button className="btn zbtn-outline rounded-1 me-3" onClick={() => { goToForm(-1) }}><PrintIcon /></button>
                            {/* <button className="btn btn-outline-primary rounded-1 me-3" onClick={() => { goToForm(-1) }}>Import Orders</button> */}
                            {!form?.notDisplayAddButton && loggedUser.role !== UserRoles.ADMINISTRATOR &&(
                                <button className="btn zbtn rounded-1" onClick={() => goToForm(-1)}>
                                    <AddIcon /> New
                                </button>
                            )}
                        </div>
                    </div>) : (<></>)
                }
                {
                    form ? (<div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div className="w-25">
                            <input type="text" className="form-control form-control-sm zinput" placeholder="Search by ID" />
                        </div>
                        <div className="btn-group">
                        <div className="dropdown me-3">
                            <span className="card-title text-muted me-3" style={{color: "var(--text_color) !important"}}>{pageSetting.pageSize} Per page</span>
                            <button className="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Show
                            </button>
                            <ul className="dropdown-menu zpanel">
                                <li><button className="btn btn-sm dropdown-item zoption" onClick={() => {setPageSetting({...pageSetting, pageSize: 3})}} >3 Records</button></li>
                                <li><button className="btn btn-sm dropdown-item zoption" onClick={() => {setPageSetting({...pageSetting, pageSize: 5})}}>5 Records</button></li>
                                <li><button className="btn btn-sm dropdown-item zoption" onClick={() => {setPageSetting({...pageSetting, pageSize: 15})}}>15 Records</button></li>
                                <li><button className="btn btn-sm dropdown-item zoption" onClick={() => {setPageSetting({...pageSetting, pageSize: 25})}} >25 Records</button></li>
                                <li><button className="btn btn-sm dropdown-item zoption" onClick={() => {setPageSetting({...pageSetting, pageSize: 35})}}>35 Records</button></li>
                                <li><button className="btn btn-sm dropdown-item zoption" onClick={() => {setPageSetting({...pageSetting, pageSize: 50})}}>50 Records</button></li>
                                <li><button className="btn btn-sm dropdown-item zoption" onClick={() => {setPageSetting({...pageSetting, pageSize: 75})}}>75 Records</button></li>
                                <li><button className="btn btn-sm dropdown-item zoption" onClick={() => {setPageSetting({...pageSetting, pageSize: 100})}}>100 Records</button></li>
                            </ul>
                        </div>
                            <button className="btn btn-outline-secondary rounded-1 btn-sm" onClick={() => { openWindow("filter");}}> Filters <KeyboardArrowDownIcon sx={{fontSize: 15}} /></button>
                        </div>
                    </div>) : (<></>)
                }
            </div>

            {
                form ? (<div className={props.isRelatedList ? "w-100" : "h-100 w-100"} style={{ overflow: "auto" }}>
                    <ListComponent cols={form.fields.filter(fld => (!fld.notOnList))} rows={records ? records.Items : []} selector={goToForm} emitOnSelect={(recs => { setSelectedIds(recs) })} idColumn={form.idColumn} realId={form.realId} />
                </div>) : ("")
                // </div>) : (<div className="h-100 container p-3"><Empty message="List Not Available! It is may be because you have no role on this! Contanct your administrator to fix this issue." /></div>)
            }
            {
                form && !form.hidePagination ? (<div className="d-flex justify-content-center p-2 border-top">
                    <div className="btn-group">
                        <button className="btn btn-sm zbtn" onClick={previousPage}>Previous</button>
                        <input value={pageSetting.pageNumber} onChange={(event) => { setPageSetting({ ...pageSetting, pageNumber: parseInt(event.target.value) }) }} type="number" className="form-control form-control-sm zinput" style={{ width: "75px" }} placeholder="Page" />
                        <button className="btn btn-sm zbtn">/{(records?.Items ? Math.ceil(records.TotalCount / pageSetting.pageSize) : 1)}</button>
                        <button className="btn btn-sm zbtn" onClick={nextPage}>Next</button>
                    </div>
                </div>) : (<></>)
            }

            {
                (form && visibleWindow == "filter") ? (
                    <FilterWindow
                        form={form}
                        closeWindow={() => { openWindow() }}
                        conditions={filterConditions}
                        filter={(conditions) => { setFilterConditions(conditions); openWindow() }}
                    />
                ) : (<></>)
            }
            {showWaiting ? (<Waiting />) : ""}
        </div>
    );
}

export default TablePage;