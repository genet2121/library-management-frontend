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
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, Drawer, AppBar, Toolbar, List, Typography, ListItem, ListItemIcon, ListItemText, CssBaseline } from '@mui/material';
import { Menu, Inbox, Mail, Notifications, AccountCircle } from '@mui/icons-material';
import ZThemeContext from "../../Contexts/ZThemeContext";

const drawerWidth = 240;

function SideBarComponent(props: {iconic?: boolean}) {

    const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);
    const { loggedUser, removeCookie } = useContext(AuthContext);
    const { setUiSettings, uiSettings } = useContext(ZThemeContext);

    const [navList, setNavList] = useState<INavigation[]>([]);
  
    const location = useLocation();

    const navigate = useNavigate();
    useEffect(() => {
        loadData();
    }, [loggedUser]);

    const exitSideBar = () => {
        if(isMobile) {
            setMenu(false);
        }
    }

    const loadData = () => {
        let temp_navs: INavigation[] = [];
        SideBarNavigation.forEach(async nav => {
            // if(nav.active && nav.roles.includes(loggedUser.Roles[0]) && await nav.validator(loggedUser)) {
            //     temp_navs.push(nav);
            // }
            temp_navs.push(nav);
            
        });
        setNavList(temp_navs);
    }
    // const isActive = (navLink: string) => {
    //     return location.pathname == navLink; 
    //   };
    const isActive = (navLink: string) => {
        const currentPath = location.pathname;
    
        const currentBase = currentPath.split("/")[2];  
        const navBase = navLink.split("/")[2];         
        return currentBase === navBase;
    };
    
    
    // const isActive = (navLink: string) => {
    //     const currentPath = location.pathname;
    //     const baseTable = navLink.split('/')[2]; 
    //     return location.pathname == navLink || currentPath.startsWith(`/list/${baseTable}`) || currentPath.startsWith(`/form/${baseTable}`);
    // };
    

    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    return (
        // <div className="sidebar-overlay" onClick={() => { setTimeout(() => { setMenu(false) }, 50) }}>
            <div className="sidebar-container pt-2 shadow-sm zpanel" style={{ width: isMobile ? "70%" : "100%" }}>

                {/* <div className="w-100 pe-2 d-flex justify-content-end">
                    <IconButton onClick={() => { setMenu(false) }} >
                        <ArrowBackIcon />
                    </IconButton>
                </div> */}
                {/* <div className="d-flex pt-3 justify-content-center">
                    <img src={`/images/main_logo.svg`} alt="image" style={{ width: "150px", height: "auto", }} />
                </div> */}
                {/* <h5 className="card-title mb-5 text-center" >MIRAC</h5> */}

                <div className="list-group-flush h-100" >
                    {
                        navList.map((nav) => {
                            const isActiveClass = isActive(nav.link ?? '/') ? 'zbtn' : 'deactive_zbtn';

                            if (nav.type == NavigationTypes.LINK) {
                                return (
                                    <div className={`px-3 mb-2 w-100`}key={nav.Name}>
                                        <button  className={`btn ${menu ? 'text-start' : 'text-center'} w-100 ${isActiveClass}`}
                                            onClick={async () => {
                                                navigate(nav.link ?? "/");
                                                exitSideBar()
                                            }}
                                            title={(!menu ? nav.Name : "")}
                                        >
                                            <nav.Icon /> {(menu) && (nav.Name)}
                                        </button>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="px-3 w-100 mb-3">
                                        <button className={`btn btn-primary ${menu ? 'text-start' : 'text-center'} w-100`}
                                            onClick={async () => {
                                                if (nav.action) {
                                                    await nav.action(loggedUser);
                                                }
                                                exitSideBar()
                                            }}
                                            title={(!menu ? nav.Name : "")}
                                        >
                                            <nav.Icon /> {(menu) && (nav.Name)}
                                        </button>
                                    </div>
                                );
                            }
                        })
                    }



                </div>
                <div className="px-3 w-100 mb-3" style={{position: "relative"}}>

                    <button className="btn text-start w-100" onClick={() => {
                        setUiSettings(!uiSettings);
                    }}  style={{color:"var(--button_bg)"}}>
                        <SettingsOutlinedIcon className="me-3"/>
                        {(menu) && ("Settings")}
                    </button>
                </div>
                <div className="px-3 w-100 mb-3" style={{position: "relative"}}>

                    <button className="btn text-start w-100" onClick={() => {
                        // exitSideBar()
                        removeCookie("login_token");
                        setTimeout(() => {
                            window.location.href = window.location.origin;
                        }, 500);
                    }}  style={{color:"var(--button_bg)"}}>
                        <LogoutIcon className="me-3"/> {(menu) && ("Logout")}
                    </button>
                </div>
            </div>
        // </div>
    );
}

export default SideBarComponent;