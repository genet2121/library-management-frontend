import React, { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import AlertContext from "../Contexts/AlertContext";
import { useNavigate } from "react-router-dom";
import { Login } from "../APIs/AuthAPI";
import AuthContext from "../Contexts/AuthContext";
import LockResetIcon from '@mui/icons-material/LockReset';
import { Authorized, normal } from "../APIs/api";
import { finished } from "stream";

function ResetAccountPage() {

    const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);
    const { setLoggedUser, setLoggedIn, cookies } = useContext(AuthContext);

    const [fields, setFields] = useState<{ Email: string, Finished: boolean }>({
        Email: "",
        Finished: false
    });

    const style = {
        mobile: {
            width: "100%",
            // height: "100%"
        },
        desktop: {
            width: "35%"
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
    }, []);

    const fieldSetter = (type: ("Email" | "Password"), value: any) => {
        setFields({ ...fields, [type]: value });
    }

    const submitForm = async (event: any) => {
        event.preventDefault();

        setTimeout(() => { setWaiting(true) }, 1);
        try {
            let result = await normal().bodyRequest("post", "auth/password_reset", {
                phone: `${fields.Email}`
            });
            setFields({ ...fields, Finished: true });
            // setAlert(result.Message, "success");
        } catch (error: any) {
            setAlert(error.message, "error");
        }
        setWaiting(false)

    }

    return (
        <div className="w-100 h-100" style={{ overflowX: "hidden", overflowY: "auto", background: (isMobile ? "white" : "transparent") }}>
            <div className={isMobile ? "login-form-card" : "card login-form-card"} style={isMobile ? style.mobile : style.desktop}>
                <div className="card-body">
                    <div className="d-flex">
                        <img src="./images/image.png" alt="image" style={{ width: "100px", height: "auto" }} />
                        <div className="w-100">
                            <h3 className="card-title pt-2">Reset Account Password</h3>
                            <span className="card-subtitle">Reset your account here!</span>
                        </div>
                    </div>

                    {
                        fields.Finished ? (
                            <div className="w-100 mt-5 ps-4 pe-4">
                                <p className="mb-3">
                                    <strong style={{ color: "green" }}>SMS has been sent to {fields.Email}</strong> <br />
                                    Use the password on the SMS sent to you.
                                </p>
                                <button className="btn btn-link text-success" onClick={() => { navigate("/") }}>Go to login page</button> <br />
                            </div>
                            
                        ) : (
                            <form action="post" className="w-100 mt-5 ps-4 pe-4" onSubmit={submitForm}>

                                <p className="mb-3">
                                    To reset your account password set the phone number used for your account on the below input.
                                    {/* Then SMS will be sent to your account with the new password. */}
                                </p>
                                <div className="input-group mb-3">
                                    <span className="input-group-text" id="basic-addon1">+251</span>
                                    <input type="number"
                                        className="form-control"
                                        required value={fields.Email}
                                        onChange={(event: any) => { fieldSetter("Email", parseInt(event.target.value)) }}
                                        id="email_input"
                                        placeholder="9x-xxx-xxxx"
                                    />
                                </div>
                                <p className="mb-3">
                                    be sure you don't typ +251. you only need to type starting from 7 or 9 for different network vendors or 09/07.
                                </p>

                                <button className={isMobile ? "btn btn-warning btn-lg mb-3 w-100" : "btn btn-warning mt-3"}>
                                    <LockResetIcon sx={{ fontSize: 25, marginRight: "10px" }} />
                                    Reset Password
                                </button>
                                <br />

                                <button className="btn btn-link text-success" onClick={() => { navigate("/login") }}>I remember my password</button> <br />
                            </form>
                        )
                    }

                </div>
            </div>
        </div>
    );
}

export default ResetAccountPage;

