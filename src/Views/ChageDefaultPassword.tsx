import React, { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import AlertContext from "../Contexts/AlertContext";
import { useNavigate } from "react-router-dom";
import { changeDefaultPassword, Login, signup } from "../APIs/AuthAPI";
import AuthContext from "../Contexts/AuthContext";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Visibility, VisibilityOff } from '@mui/icons-material';


function ChangeDefaultPasswordPage() {

    const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);
    const { loggedUser, setLoggedUser, removeCookie } = useContext(AuthContext);

    const style = {
        mobile: {
            width: "100%",
            // height: "100%"
        },
        desktop: {
            width: "35%"
        }
    };

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [coniformPasswordVisible, setConiformPasswordVisible] = useState(false);
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);
    const [fields, setFields] = useState({

        default_password: '',
        password: '',
        confirm_password: '',
    });

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConiformPasswordVisibility = () => {
        setConiformPasswordVisible(!coniformPasswordVisible);
    };
    const toggleChangePasswordVisibility = () => {
        setChangePasswordVisible(!changePasswordVisible);
    };

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setFields({
            ...fields,
            [name]: value,
        });
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            const response = await changeDefaultPassword(loggedUser._id, fields);
            removeCookie("login_token");
            setTimeout(() => {
                window.location.href = window.location.origin;
            }, 1500);
            // let temp_data: any = window.localStorage.getItem("loggedUser");
            // if(temp_data) {
            //     temp_data = JSON.parse(temp_data);
            //     temp_data.is_default_password = false;
            //     setLoggedUser(temp_data);
            //     window.localStorage.setItem("loggedUser", JSON.stringify(temp_data));
            // }
            console.log('changed successful:', response);
            // navigate('/');
        } catch (error) {
            console.error('Signup failed:', error);

        }
    };

    return (
        <div className="w-100 h-100" style={{ overflowX: "hidden", overflowY: "auto", background: (isMobile ? "white" : "transparent") }}>
            <div className={isMobile ? "login-form-card" : "card login-form-card"} style={isMobile ? style.mobile : style.desktop}>
                <div className="card-body">
                    <div className="d-flex mb-5">
                        <img src="./images/image.png" alt="image" style={{ width: "70px", height: "auto" }} />
                        <div className="w-100">
                            <h4 className="card-title pt-2">Change your Default Password</h4>
                            <span className="card-subtitle">change your default password here!</span>

                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 position-relative">
                            <label className="form-label">Default Password</label>
                            <input
                                type={changePasswordVisible ? 'text' : 'password'}
                                name="default_password"
                                placeholder="••••••••"
                                className="form-control"
                                style={{ height: '45px' }}
                                value={fields.default_password}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                onClick={toggleChangePasswordVisibility}
                                className="btn btn-outline-secondary position-absolute end-0 top-0 me-2"
                                style={{ border: 'none', background: 'transparent', marginTop: '32px' }}
                            >
                                {changePasswordVisible ? <VisibilityOff /> : <Visibility />}
                            </button>
                        </div>

                        <div className="mb-3 position-relative">
                            <label className="form-label">New Password</label>
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                name="password"
                                placeholder="••••••••"
                                className="form-control"
                                style={{ height: '45px' }}
                                value={fields.password}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="btn btn-outline-secondary position-absolute end-0 top-0 me-2"
                                style={{ border: 'none', background: 'transparent', marginTop: '32px' }}
                            >
                                {passwordVisible ? <VisibilityOff /> : <Visibility />}
                            </button>
                        </div>

                        <div className="mb-4 position-relative">
                            <label className="form-label">Coniform New Password</label>
                            <input
                                type={coniformPasswordVisible ? 'text' : 'password'}
                                name="confirm_password"
                                placeholder="••••••••"
                                className="form-control"
                                style={{ height: '45px' }}
                                value={fields.confirm_password}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                onClick={toggleConiformPasswordVisibility}
                                className="btn btn-outline-secondary position-absolute end-0 top-0 me-2"
                                style={{ border: 'none', background: 'transparent', marginTop: '32px' }}
                            >
                                {coniformPasswordVisible ? <VisibilityOff /> : <Visibility />}
                            </button>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mb-3 mt-3">
                            Change default password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChangeDefaultPasswordPage;