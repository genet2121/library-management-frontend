import React, { createContext, useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, information } from "./APIs/AuthAPI";
import AuthContext from "./Contexts/AuthContext";
import AlertContext from "./Contexts/AlertContext";
import Alert from "./Components/Extra/Alert";
import Waiting from "./Components/Extra/Waiting";
import { useCookies } from "react-cookie";
import Error from "./Views/Error";
import LoginPage from "./Views/Login";
import SideBar from "./Components/NavBars/SideBar";
import Account from "./Views/Account";
import Dashboard from "./Views/Dashboard";
import CreateCompany from "./Views/CreateCompany";
import AuthResult from "./Intefaces/AuthResult";
import LocalData from "./Intefaces/LocalData";
import ResetAccount from "./Views/ResetAccount";
import TableComponent from "./Views/TableComponent";
import { isMobile } from "react-device-detect";
import MainScreen from "./Views/MainScreen";
import ZThemeContext from "./Contexts/ZThemeContext";
import UISettings from "./Components/Reusables/UISettings";
import SignupForm from "./Views/FirstAcount";
import ChangeDefaultPasswordPage from "./Views/ChageDefaultPassword";
import OwnershipTransferPage from "./Views/OwnershipTransfer";
import AdminAPI from "./APIs/AdminAPI";


function App(params: any) {

    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
    const [loggedUser, setLoggedUser] = useState<null | AuthResult>(null);
    const [cookies, setCookie, removeCookie] = useCookies(["login_token"]);
    const [authWaiting, setAuthWaiting] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showWaiting, setWaiting] = useState<boolean>(false);
    const [alertType, setAlertType] = useState<"success" | "error" | "warning" | "info">("info");
    const [alertMessage, setMessage] = useState<string>("");
    const [menu, setMenu] = useState<boolean>(false);
    const [uiSettings, setUiSettings] = useState<boolean>(false);
    const [theme, setTheme] = useState<any>({
        scheme: "zlight",
       
        button_color: "white",
        button_bg: "#0046eb",
        button_bg_hover: "#2760e6",
        ring_color: "#2760e64d"
    })
    const [localData, setLocalData] = useState<LocalData>({
        books: [],
        members: [],
        roles: []
    });


    useEffect(() => {

        const checkAuth = async (token: string) => {

            setTimeout(() => { setAuthWaiting(true); }, 1);
            setTimeout(() => { setWaiting(true); }, 1);
            // let response = await information(token);
            let response = window.localStorage.getItem("loggedUser");
            setLoggedIn(response ? true : false);
            setLoggedUser(response ? JSON.parse(response) : null);
            await loadLocalData();
            setTimeout(() => { setAuthWaiting(false); }, 5);
            setTimeout(() => { setWaiting(false); }, 5);

        };

        if (cookies.login_token && cookies.login_token != "") {
            checkAuth(cookies.login_token);
            // connectWithServer();
        }

        let found_theme = window.localStorage.getItem("theme");
        if (found_theme) {
            changeTheme(JSON.parse(found_theme));
        }

    }, []);

    const setAlert = (
        message: string,
        type: "success" | "error" | "warning" | "info"
    ) => {

        setAlertType(type);
        setShowAlert(true);
        setMessage(message);

        setTimeout(() => {
            setShowAlert(false);
        }, 3000);

    }

    const loadLocalData = async () => {

        let temp_data = localData;
        
        temp_data.books = (await AdminAPI.getAllwithoutPagination(cookies.login_token, "library_management.api.get_books")).Items;
        temp_data.members = (await AdminAPI.getAllwithoutPagination(cookies.login_token, "library_management.api.get_members")).Items;
        temp_data.roles = (await AdminAPI.getAllwithoutPagination(cookies.login_token, "library_management.api.get_all_roles")).Items;

        console.log("local roles", temp_data.roles);

    
        setLocalData(temp_data);

    }

    const changeTheme = (value: any) => {

        setTheme(value);
        let element: any = document.getElementById("root");
        if (element) {
            element.className = `accents ${value.scheme}`;
            element.style.setProperty("--button_bg", value.button_bg);
            element.style.setProperty("--button_color", value.button_color);
            element.style.setProperty("--button_bg_hover", value.button_bg_hover);
            element.style.setProperty("--input-ring-color", value.ring_color);
        }
        window.localStorage.setItem("theme", JSON.stringify(value));

    }

    const onLogin = (signinUser: any) => {

        window.localStorage.setItem("loggedUser", JSON.stringify(signinUser));
        loadLocalData();

    }


    return (
        <ZThemeContext.Provider value={{ theme, setTheme: changeTheme, setUiSettings, uiSettings }}>
            <AlertContext.Provider value={{ showAlert, alertType, setAlertType, setAlert, setWaiting, showWaiting, menu, setMenu }}>
                <AuthContext.Provider value={{
                    isLoggedIn, loggedUser, setLoggedUser, setLoggedIn, setCookie, cookies, removeCookie, authWaiting, localData, onLogin
                }}>
                    <BrowserRouter>
                        {
                            !authWaiting && (
                                !isLoggedIn ? (
                                    <Routes>
                                        <Route path="/" element={<LoginPage />} />
                                     
                                        <Route path="/reset" element={<ResetAccount />} />
                                        <Route path="/first-account" element={<SignupForm />} />
                                      
                                        <Route path="*" element={<Error />} />
                                    </Routes>
                                ) : (
                                    (loggedUser?.is_default_password) ? (
                                        <Routes>
                                            <Route path="/" element={<ChangeDefaultPasswordPage />} />
                                            <Route path="*" element={<Error />} />
                                        </Routes>
                                    ) : (
                                        <Routes>
                                            

                                            <Route path="/" element={<MainScreen />} >
                                                <Route path="list/:name" element={<TableComponent />} />
                                                <Route path="form/:name/:r_id" element={<CreateCompany />} />
                                                <Route path="profile" element={<Account />} />
                                                <Route path="transfer-ownership" element={<OwnershipTransferPage />} />
                                                <Route path="" element={<Dashboard />} />
                                                <Route path="*" element={<Error />} />
                                            </Route>
                                        </Routes>
                                    )
                                )
                            )
                        }
                       
                        {showAlert ? (<Alert message={alertMessage} color={alertType} />) : ""}
                        {showWaiting ? (<Waiting />) : ""}
                        {(menu && isMobile) ? (
                            <div className="sidebar-overlay" onClick={() => { setTimeout(() => { setMenu(false) }, 50) }}>
                                <SideBar />
                            </div>
                        ) : ""}
                        {(uiSettings) ? (<UISettings />) : ""}
                    </BrowserRouter>
                </AuthContext.Provider>
            </AlertContext.Provider>
        </ZThemeContext.Provider>
    );

}

export default App;