import React, { useContext, useEffect, useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { colors, IconButton } from "@mui/material";
import { isMobile } from "react-device-detect";
import AlertContext from "../../Contexts/AlertContext";
import { Link, useNavigate } from "react-router-dom";
import INavigation from "../../Intefaces/INavigation";
import SideBarNavigation from "../../Views/SideBarNavigation";
import AuthContext from "../../Contexts/AuthContext";
import NavigationTypes from "../../Enums/NavigationTypes";
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation,  } from 'react-router-dom';
import ContrastIcon from '@mui/icons-material/Contrast';



import { Box, Drawer, AppBar, Toolbar, List, Typography, ListItem, ListItemIcon, ListItemText, CssBaseline } from '@mui/material';
import { Menu, Inbox, Mail, Notifications, AccountCircle } from '@mui/icons-material';
import ZThemeContext from "../../Contexts/ZThemeContext";

function UISettings(props: {iconic?: boolean}) {

    const { uiSettings, setUiSettings, theme, setTheme } = useContext(ZThemeContext);

    const [colors, setColors] = useState<any>({
        button_color: "white",
        button_bg: "blue",
        button_bg_hover: "darkblue",
        ring_color: "lightblue"
    });

    useEffect(() => {
        setColors({
            button_color: theme.button_color,
            button_bg: theme.button_bg,
            button_bg_hover: theme.button_bg_hover
        });
    }, [theme]);


    return (
        <div className="sidebar-overlay">
            <div className="w-100 h-100" style={{zIndex: -1, position: "absolute", top: 0, left: 0}} onClick={() => { setTimeout(() => { setUiSettings(false) }, 50) }}></div>
            <div className="settingbar-container pt-2 px-3 shadow-sm zpanel" style={{ width: isMobile ? "70%" : "30%",  zIndex: 1 }}>

                <div className="d-flex justify-content-between align-items-center w-100 py-3 mb-3">
                    <h5 className="text-center card-title">Dark Color Scheme</h5>
                    <div className="form-check form-switch">
                        <input className="form-check-input zcheck_box"
                            style={{cursor: "pointer"}}
                            type="checkbox"
                            role="switch"
                            checked={theme.scheme == "zdark"}
                            onChange={(event) => {
                                setTheme({
                                    ...theme,
                                    scheme: ((event.target.checked) ? "zdark" : "zlight")})
                            }}
                        />
                    </div>
                    {/* <IconButton className="me-3" onClick={() => { setTheme({...theme, scheme: ((theme.scheme == "zdark") ? "zlight" : "zdark")}) }} >
                        <ContrastIcon sx={{fontSize: 25, color: `var(--text_color)`}} />
                    </IconButton> */}
                </div>
                <div className="w-100 py-3">
                    <h5 className="text-center card-title">Pre Configured Themes</h5>
                </div>

                <div className="d-flex justify-content-center mb-5" style={{flexWrap: "wrap"}}>
                    <div className="rounded-circle m-2"
                        style={{width: "50px", height: "50px", background: "#009628", cursor: "pointer"}}
                        onClick={() => {
                            setColors({
                                button_color: "white",
                                button_bg: "#009628",
                                button_bg_hover: "#239441",
                                ring_color: "#2394414d"
                            })
                        }}
                    ></div>
                    <div className="rounded-circle m-2"
                        style={{width: "50px", height: "50px", background: "#ff8103", cursor: "pointer"}}
                        onClick={() => {
                            setColors({
                                button_color: "white",
                                button_bg: "#ff8103",
                                button_bg_hover: "#ff9e3d",
                                ring_color: "#ff9e3d4d"
                            })
                        }}
                    ></div>
                    <div className="rounded-circle m-2"
                        style={{width: "50px", height: "50px", background: "#d40259", cursor: "pointer"}}
                        onClick={() => {
                            setColors({
                                button_color: "white",
                                button_bg: "#d40259",
                                button_bg_hover: "#cc3373",
                                ring_color: "#cc33734d"
                            })
                        }}
                    ></div>
                    <div className="rounded-circle m-2"
                        style={{width: "50px", height: "50px", background: "#0046eb", cursor: "pointer"}}
                        onClick={() => {
                            setColors({
                                button_color: "white",
                                button_bg: "#0046eb",
                                button_bg_hover: "#2760e6",
                                ring_color: "#2760e64d"
                            })
                        }}
                    ></div>
                </div>

                <div className="w-100 py-3 mb-3">
                    <h5 className="text-center card-title">Manual Theme Settings</h5>
                </div>
                <div className="mb-3">
                    <label className="form-label">Accent Main</label>
                    <input value={colors.button_bg} onChange={(event: any) => {setColors({...colors, button_bg: event.target.value})}} type="text" className="form-control zinput"  placeholder="#lskdf" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Accent Text</label>
                    <input value={colors.button_color} onChange={(event: any) => {setColors({...colors, button_color: event.target.value})}} type="text" className="form-control zinput" placeholder="#lskdf" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Accent Secondary</label>
                    <input value={colors.button_bg_hover} onChange={(event: any) => {setColors({...colors, button_bg_hover: event.target.value})}} type="text" className="form-control zinput" placeholder="#lskdf" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Ring Color</label>
                    <input value={colors.ring_color} onChange={(event: any) => {setColors({...colors, ring_color: event.target.value})}} type="text" className="form-control zinput" placeholder="#lskdf" />
                </div>

                <button className="btn zbtn" onClick={() => {setTheme({...theme, ...colors})}}>Save Changes</button>

            </div>
        </div>
    );
}

export default UISettings;