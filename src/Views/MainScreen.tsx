import React, { useContext } from "react";
import SideBarComponent from "../Components/NavBars/SideBar";
import { Outlet } from "react-router-dom";
import TopNav from "../Components/NavBars/TopNav";
import AlertContext from "../Contexts/AlertContext";
import { isMobile } from "react-device-detect";

function MainScreen() {

    const {menu} = useContext(AlertContext);

    return (
        <div style={{display: "flex", flexDirection: "column", width: "100vw", height: "100vh", position: "relative"}}>
            <div className="w-100 border-bottom" style={{height: "max-content", overflow: "", zIndex: 10}}>
                <TopNav />
            </div>
            <div className="d-flex w-100" style={{height: "100%", overflow: "hidden auto", zIndex: 1}}>
                {!isMobile && (<div className="border-end" style={{width: (menu ? "17%" : "6.5%"), height: "100%", overflow: "hidden", position: "relative", transitionDuration: "0.4s"}}>
                    <SideBarComponent iconic={true} />
                </div>)}
                <div className="m-0" style={{background: "var(--main_bg)", width: "100%", height: "100%", overflow: "hidden auto"}}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default MainScreen;