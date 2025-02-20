import { Avatar, IconButton, MenuItem, Menu } from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import AlertContext from "../../Contexts/AlertContext";
import AuthContext from "../../Contexts/AuthContext";
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import { isDesktop, isMobile } from "react-device-detect";
import ZThemeContext from "../../Contexts/ZThemeContext";
import ContrastIcon from '@mui/icons-material/Contrast';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined';
import UserRoles from "../../Enums/UserRoles";


function TopNav() {

	const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);
	const { loggedUser, authWaiting, removeCookie } = useContext(AuthContext);
	const { theme, setTheme, setUiSettings, uiSettings } = useContext(ZThemeContext);

	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [coloring, setColoring] = useState({
		color1: "",
		color2: ""
	});

	function stringToColor(name: string) {
		let hash = 0;
		let i;
		/* eslint-disable no-bitwise */
		for (i = 0; i < name.length; i += 1) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}

		let color = '#';

		for (i = 0; i < 3; i += 1) {
			const value = (hash >> (i * 8)) & 0xff;
			color += `00${value.toString(16)}`.slice(-2);
		}
		/* eslint-enable no-bitwise */

		return color;
	}

	function stringAvatar(name: string) {
		let slt = name.split(' ');
		return {
			sx: {
				bgcolor: stringToColor(name),
			},
			children: `${name.split(' ')[0][0]}${(slt.length > 1) ? (slt[slt.length - 1][0]) : ""}`,
		};
	}

	const open = Boolean(anchorEl);
	const handleMenuClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	return authWaiting ? (<></>) : (
		<div className="d-flex justify-content-between p-2 border-bottom top-nav zpanel" style={{ flexWrap: "wrap" }}>
			<div className="">
				{ isMobile && (<IconButton onClick={() => { window.history.back(); }}  onMouseOut={() => {setColoring({...coloring, color2: "var(--text_color)"})}} onMouseOver={() => {setColoring({...coloring, color2: "var(--button_bg)"})}} >
					<ArrowBackIcon sx={{fontSize: 25, color: coloring.color2}} />
				</IconButton>)}
				<IconButton onClick={() => { setMenu(!menu) }} onMouseOut={() => {setColoring({...coloring, color1: "var(--text_color)"})}} onMouseOver={() => {setColoring({...coloring, color1: "var(--button_bg)"})}} >
					<MenuIcon sx={{fontSize: 25, color: coloring.color1}} />
				</IconButton>
				<img src="/images/lib.jpg" className="me-2" style={{width: "50px", height: "auto"}} alt="logo" />
				<span className="card-title text-center me-4" >Library Management System</span>
			</div>
			<div className="d-flex align-items-center">
                { isDesktop && (<IconButton className="me-2" onClick={() => { setTheme({...theme, scheme: ((theme.scheme == "zdark") ? "zlight" : "zdark")}) }} >
					<ContrastIcon sx={{fontSize: 25, color: `var(--text_color)`}} />
				</IconButton>)}
				{/* <IconButton onClick={() => { }} > */}
					{/* <Avatar {...stringAvatar(loggedUser.FullName ?? "Default" )} sx={{width: 40, height: 40, fontSize: 20}} /> */}
					{/* <Avatar {...stringAvatar(`${loggedUser.first_name} ${loggedUser.last_name}` )} sx={{width: 35, height: 35, fontSize: 12}} /> */}
				{/* </IconButton> */}

                <div className="dropdown">
                    <button className="btn deactive_zbtn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {`${loggedUser.full_name}`}
                    </button>
                    <ul className="dropdown-menu zpanel">
                        <li><button onClick={() => { navigate("/profile") }} className="dropdown-item zoption">
                            <AccountBoxOutlinedIcon className="me-2" sx={{ fontSize: 20 }} />
                            Profile
                        </button></li>
                        {(loggedUser.role == UserRoles.MEMBER) &&  (<li><button onClick={() => { navigate("/transfer-ownership") }} className="dropdown-item zoption">
                            <SwapHorizontalCircleOutlinedIcon className="me-2" sx={{ fontSize: 20 }} />
                            Transfer Ownership
                        </button></li>)}
						
                        <li><button onClick={() => { setUiSettings(!uiSettings) }} className="dropdown-item zoption">
                            <SettingsOutlinedIcon className="me-2" sx={{ fontSize: 18 }} />
                            Settings
                        </button></li>
                        <li><button onClick={async () => {
                            await removeCookie("login_token");
                            setTimeout(() => {
                                window.location.href = window.location.origin;
                            }, 500);
                        }} className="dropdown-item zoption">
                            <LogoutOutlinedIcon className="me-2" sx={{ fontSize: 18 }} />
                            Logout
                        </button></li>
                    </ul>
                </div>
        	</div>
	    </div>
	);
}

export default TopNav;
