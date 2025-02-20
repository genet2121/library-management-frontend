import React, { useContext, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material";
import { Authorized } from "../APIs/api";
import AlertContext from "../Contexts/AlertContext";
import AuthContext from "../Contexts/AuthContext";
import { isMobile } from "react-device-detect";

const wstyle: any = isMobile ? {
    width: "100%",
    top: "10%",
    position: "absolute"
} : {
    width: "50%",
    left: "50%",
    top: "10%",
    transform: "translateX(-50%)",
    position: "absolute"
}

function ChangePassword({ closer }: { closer: () => void }) {

    const { loggedUser, authWaiting, cookies, removeCookie } = useContext(AuthContext);

    const { setAlert, setWaiting } = useContext(AlertContext);

    const [fields, setFields] = useState<any>({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });

    const submit = async () => {
        
        setTimeout(() => { setWaiting(true) }, 1);
        
        try {
            
            if(fields.new_password != fields.confirm_password){
                setTimeout(() => { setWaiting(false) }, 1);
                throw new Error("Password confirmation does not match");
            }
            const Id = loggedUser.id;

           if(Id){
            let result = await Authorized(cookies.login_token).bodyRequest("patch", `v1/admin/${Id}/password`, {
                 
                    current_password: fields.old_password,
                    password: fields.new_password,
                    confirm_password: fields.confirm_password,
                    
                
                // ConfirmPassword: fields.confirm_password
            });
            setAlert(result.message, "success");
            setTimeout(() => {
                    
                removeCookie("login_token", { path: "/" });

                
                window.location.href = "/";
            }, 1500);
            closer();
           }
          
        } catch (error: any) {
            setAlert(error.message, "error");
        }
        setWaiting(false)
    }

    const inputChange = (input: ("old" | "new" | "confirm"), value: any) => {
        if (input == "old") {
            setFields({ ...fields, old_password: value })
        }
        if (input == "new") {
            setFields({ ...fields, new_password: value })
        }
        if (input == "confirm") {
            setFields({ ...fields, confirm_password: value })
        }
    }

    return (
        <div className="card shadow" style={wstyle}>
            <div className="card-header d-flex justify-content-end">
                <IconButton onClick={closer}>
                    <CloseIcon sx={{ fontSize: 20, color: "red" }} />
                </IconButton>
            </div>
            <div className="card-body">
                <h5 className="card-title text-center mb-4">Change Password</h5>

                <div className="mb-3">
                    <label htmlFor="old_password">Current Password</label>
                    <input type="password" className="form-control" placeholder="Enter Old Password" title="set your old password" onChange={(event: any) => { inputChange("old", event.target.value) }} />
                </div>

                <div className="mb-3">
                    <label htmlFor="new_password"> Password</label>
                    <input type="password" className="form-control" placeholder="Create New Password" title="set your new password to be used" onChange={(event: any) => { inputChange("new", event.target.value) }} />
                </div>

                <div className="mb-3">
                    <label htmlFor="confirm_password">Confirm Password</label>
                    <input type="password" placeholder="Enter The New Password" className="form-control" title="set your new password to confirm" onChange={(event: any) => { inputChange("confirm", event.target.value) }} />
                </div>

                <button className="btn btn-primary" onClick={submit}>Change</button>
            </div>
        </div>
    );
};

export default ChangePassword;