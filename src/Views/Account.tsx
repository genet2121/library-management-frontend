import React, { useContext, useEffect, useState } from "react";
import BadgeIcon from '@mui/icons-material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import TopNav from "../Components/NavBars/TopNav";
import { isMobile } from "react-device-detect";
import BatterySaverIcon from '@mui/icons-material/BatterySaver';
import AuthContext from "../Contexts/AuthContext";
import ChangePassword from "../Components/ChangePassword";
import AlertContext from "../Contexts/AlertContext";
import { Phone } from "@mui/icons-material";
import SecurityIcon from '@mui/icons-material/Security';
import ZThemeContext from "../Contexts/ZThemeContext";
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import { Authorized } from "../APIs/api";
import AdminAPI from "../APIs/AdminAPI";

function AccountPage() {

    const { loggedUser, authWaiting, cookies, removeCookie, setLoggedUser } = useContext(AuthContext);
    const { setAlert, setWaiting } = useContext(AlertContext);
    const { theme } = useContext(ZThemeContext);

    const [changePassword, setChangePassword] = useState<boolean>(false);
    
    const [fields, setFields] = useState<any>({
        first_name: loggedUser.first_name,
        last_name: loggedUser.last_name,
        email: loggedUser.email,
        phone_number: loggedUser.phone_number

       
    });
    const submit = async () => {
        
        setTimeout(() => { setWaiting(true) }, 1);
        
        try {
            
            const Id = loggedUser.id;

           if(Id){
            let result = await AdminAPI.update(cookies.login_token, `v1/admin/${Id}/profile`, {first_name: fields.first_name,
                last_name: fields.last_name,});
        
            setAlert(result.message, "success");
             let temp_data: any = window.localStorage.getItem("loggedUser");
            if(temp_data) {
                temp_data = JSON.parse(temp_data);
                temp_data.first_name = fields.first_name;
                temp_data.last_name = fields.last_name;
                setLoggedUser(temp_data);
                window.localStorage.setItem("loggedUser", JSON.stringify(temp_data));
            }
           
           }
          
        } catch (error: any) {
            setAlert(error.message, "error");
        }
        setWaiting(false)
    }
    
    const submitEmailOrPhone = async () => {
        setWaiting(true);
    
        try {
            const Id = loggedUser?.id; 
            
            if (Id) {
               
                let result = await AdminAPI.update(cookies.login_token, `v1/admin/${Id}/emailorphonenumber`, {
                    email: fields.email,
                    phone_number: fields.phone_number,
                });
                
                setAlert(result.message, "success");
                
                
                setTimeout(() => {
                    
                    removeCookie("login_token", { path: "/" });
    
                    
                    window.location.href = "/";
                }, 1500);
            }
        } catch (error: any) {
            setAlert(error.message, "error");
        } finally {
            setWaiting(false);
        }
    };
    
    const inputChange = (input: ("first_name" | "last_name" | "email" | "phone_number" ), value: any) => {
        if (input == "first_name") {
            setFields({ ...fields, first_name: value })
        }
        if (input == "last_name") {
            setFields({ ...fields, last_name: value })
        }
        if (input == "email") {
            setFields({ ...fields, email: value })
        }
        if (input == "phone_number") {
            setFields({ ...fields, phone_number: value })
        }
       
    }


    const initiateChangePassword = () => {
        setChangePassword(!changePassword);
    }

    return (
        <div className="w-100">
            {/* <div className="w-100" style={{height: "125px", background: `var(--button_bg)`}}></div> */}
            <div className="w-100 px-4" style={{background: "var(--panel_bg)"}}>
                <div className="d-flex py-3 justify-content-between mb-4 border-bottom">
                    <div className="" style={{position: "relative"}}>
                        {/* <div className="me-3" style={{width: "125px"}}>
                            <img src="./images/placeholder.jpg" alt="profile placeholder" className="rounded-circle" style={{width: "125px", height: "125px", border: "5px solid var(--panel_bg)", position: "absolute", top: "50%", transform: "translateY(-50%)"}} />
                        </div>
                        <div>
                            <h3 className="card-title" style={{color: `var(--text_color)`}}>{`${loggedUser.first_name} ${loggedUser.last_name}`}</h3>
                            <span style={{width: "100px", color: `var(--border_color) !important`}} className="text-muted card-subtitle">My Website address is here</span>
                        </div> */}
                        <h3 className="card-title" style={{color: `var(--text_color)`}}>{`${loggedUser.first_name} ${loggedUser.last_name}`}</h3>
                        <span style={{width: "100px", color: `var(--border_color) !important`}} className="text-muted card-subtitle">My Website address is here</span>
                    </div>
                    {/* <div className="button-group">
                        <button className="btn btn-sm btn-primary">Save Changes</button>
                    </div> */}
                </div>
                {/* <div className="w-100 d-flex py-3 justify-content-between border-bottom mb-4" style={{background: "var(--panel_bg)"}}>
                    <div className={isMobile ? "w-50 bg-transparent" : "bg-transparent"}>
                        <h5 className="card-title" style={{color: `var(--text_color)`}}>User profile</h5>
                        <span style={{width: "100px", color: `var(--border_color) !important`}} className="text-muted card-subtitle">Update your profile picture and details here</span>
                    </div>
                    <div className={isMobile ? "w-50" : "button-group"}>
                        <button className="btn btn-sm btn-primary">Save Changes</button>
                    </div>
                </div> */}
                <div className="w-100 d-flex py-3 justify-content-start border-bottom flex-wrap" style={{background: "var(--panel_bg)"}}>
                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                        <h5 className="card-title" style={{color: `var(--text_color)`}}>Public profile</h5>
                        <span style={{width: "100px", color: `var(--border_color) !important`}} className="text-muted card-subtitle">This will be displayed on you profile</span>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <div className="input-group flex-nowrap mb-3">
                            <span className="input-group-text" id="addon-wrapping" style={{backgroundColor: "rgba(125, 125, 125, 0.074)", color: "var(--text_color)"}}>First Name</span>
                            <input type="text" className="form-control zinput" style={{color: `var(--text_color)`}} placeholder="Username"
                             aria-label="Username" aria-describedby="addon-wrapping"
                             value={fields.first_name}  
                             onChange={(event: any) => { inputChange("first_name", event.target.value) }} />
                        </div>
                        <div className="input-group flex-nowrap mb-3">
                            <span className="input-group-text" id="addon-wrapping" style={{backgroundColor: "rgba(125, 125, 125, 0.074)", color: "var(--text_color)"}}>Last Name</span>
                            <input type="text" className="form-control zinput" placeholder="Username" 
                            aria-label="Username" aria-describedby="addon-wrapping"
                            value={fields.last_name}  
                            onChange={(event: any) => { inputChange("last_name", event.target.value) }} />
                        </div>
                        <div className="w-100 d-flex">
                            <button className="btn btn-sm btn-primary" onClick={submit}>Save Changes</button>
                        </div>
                    </div>
                </div>
                
                <div className="w-100 d-flex py-3 justify-content-start border-bottom flex-wrap" style={{background: "var(--panel_bg)"}}>
                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                        <h5 className="card-title" style={{color: `var(--text_color)`}}>Account setting</h5>
                        <span style={{width: "100px", color: `var(--border_color) !important`}} className="text-muted card-subtitle">your account</span>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <div className="input-group flex-nowrap mb-3">
                            <span className="input-group-text" id="addon-wrapping" style={{backgroundColor: "rgba(125, 125, 125, 0.074)", color: "var(--text_color)"}}>Email</span>
                            <input type="text" className="form-control zinput" style={{color: `var(--text_color)`}} placeholder="Username"
                             aria-label="Username" aria-describedby="addon-wrapping"
                             value={fields.email}  
                             onChange={(event: any) => { inputChange("email", event.target.value) }} />
                        </div>
                        <div className="input-group flex-nowrap mb-3">
                            <span className="input-group-text" id="addon-wrapping" style={{backgroundColor: "rgba(125, 125, 125, 0.074)", color: "var(--text_color)"}}>Phone Number</span>
                            <input type="text" className="form-control zinput" placeholder="Username" 
                            aria-label="Username" aria-describedby="addon-wrapping"
                            value={fields.phone_number}  
                            onChange={(event: any) => { inputChange("phone_number", event.target.value) }} />
                        </div>
                        <div className="w-100 d-flex">
                            <button className="btn btn-sm btn-primary" onClick={submitEmailOrPhone}>Save Changes</button>
                        </div>
                    </div>
                </div>

                {/* <div className="w-100 d-flex py-3 justify-content-between border-bottom" style={{background: "var(--panel_bg)"}}>
                    <div className="col-sm-12 col-md-6 col-lg-4">
                        <h5 className="card-title" style={{color: `var(--text_color)`}}>User profile picture</h5>
                        <span style={{width: "100px", color: `var(--border_color) !important`}} className="text-muted card-subtitle">Update your profile picture here.</span>
                    </div>
                    <div className="col d-flex">
                        <img src="./images/placeholder.jpg" alt="profile placeholder" className="rounded-circle me-3" style={{width: "70px", height: "70px"}} />
                        <div className="card border" style={{width: "300px", background: "var(--panel_bg)"}}>
                            <div className="card-body">
                                <div className="w-100 d-flex justify-content-center">
                                    <BackupOutlinedIcon className="me-2" sx={{fontSize: 25, color: `var(--text_color)`}} />
                                </div>
                                <span className="card-subtitle text-muted" style={{color: `var(--border_color) !important`}}>SVG, PNG, JPG or GIF (max 2MB 400x400 px)</span>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="w-100 d-flex py-3 justify-content-between border-bottom" style={{background: "var(--panel_bg)"}}>
                    <div className="col-sm-12 col-md-6 col-lg-4">
                        <h5 className="card-title" style={{color: `var(--text_color)`}}>User account states</h5>
                        <span style={{width: "100px", color: `var(--border_color) !important`}} className="text-muted card-subtitle">Update your account state here.</span>
                    </div>
                    <div className={isMobile ? "col-sm-12" : "col"}>
                        <div className="form-check w-100 mb-3">
                            <input className="form-check-input zcheck_box"
                                type="checkbox"
                                value="" 
                                checked={loggedUser.is_active}
                                id="flexCheckIndeterminate1"
                                disabled
                            />
                            <label className="form-check-label" style={{color: `var(--text_color) !important`}}>
                                Active
                            </label>
                        </div>
                        <div className="form-check w-100">
                            <input className="form-check-input zcheck_box"
                                type="checkbox"
                                disabled
                                checked={loggedUser.is_password_changed}
                                id="flexCheckIndeterminate1"
                            />
                            <label className="form-check-label" style={{color: `var(--text_color) !important`}}>
                                Password Changed
                            </label>
                        </div>
                        <div className="form-check w-100">
                            <input className="form-check-input zcheck_box"
                                type="checkbox"
                                value=""
                                checked={loggedUser.first_account}
                                id="flexCheckIndeterminate1"
                                disabled
                            />
                            <label className="form-check-label" style={{color: `var(--text_color) !important`}}>
                                First Account
                            </label>
                        </div>
                        <div className="form-check w-100">
                            <label className="form-check-label" style={{color: `var(--text_color) !important`}}>
                                {loggedUser.role}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="w-100 d-flex py-3 justify-content-between border-bottom" style={{background: "var(--panel_bg)"}}>
                    <div className="col-sm-12 col-md-6 col-lg-4">
                        <h5 className="card-title" style={{color: `var(--text_color)`}}>Change Password</h5>
                        <span style={{width: "100px", color: `var(--border_color) !important`}} className="text-muted card-subtitle">Change your account password here.</span>
                    </div>
                    <div className={isMobile ? "col-sm-12" : "col"}>
                        <button className={isMobile ? "btn btn-sm zbtn w-100" : "btn btn-lg zbtn"} onClick={initiateChangePassword}>Change Password</button>
                    </div>
                </div>
            </div>

            {changePassword && (<ChangePassword closer={initiateChangePassword} />)}
        </div>
    );
}

export default AccountPage;