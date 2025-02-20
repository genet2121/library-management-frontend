import React from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../Components/NavBars/TopNav";

export default function () {

    const navigate = useNavigate();

    let blogs = [];

    for(let i = 0; i < 30; i++) {
        blogs.push(
            <div className="col-sm-12 col-md-4 col-lg-3 p-1">
                <div className="card" >
                    <div className="card-body">
                        <h5 className="card-title">Blog Title Here</h5>
                        <h6 className="card-subtitle mb-2 text-body-secondary">
                            <span className="badge text-bg-info text-white me-2">#Java</span>
                            <span className="badge text-bg-info text-white me-2">#Servicenow</span>
                        </h6>
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-100 h-100" style={{ flexWrap: "wrap", overflowX: "hidden", overflowY: "auto" }} >
            <div className="w-100 h-100 ab-flex-column" style={{position: "relative"}}>
                <TopNav />
                <div className="w-100 h-100" style={{ overflow: "hidden", position: "relative" }}>
                    <img src="/images/home-image.jpg" alt="image" style={{ width: "100%", height: "100%" }} />
                    <div className="w-100 h-100 blur-overlay">
                        <span className="display-4 home-title-text text-white" style={{ fontWeight: "bold" }}>
                            Blog With us
                        </span>
                    </div>
                </div>
            </div>
            <div className="w-100 h-100 ab-flex-column" style={{overflowX: "hidden", overflowY: "auto"}}>
                <div className="d-flex p-2 border-bottom bg-light" style={{position: "sticky", top: 0, zIndex: 1020 }}>
                    <button className="btn btn-link btn-sm me-3">#ServerAdministration</button>
                    <button className="btn btn-link btn-sm me-3">#Java</button>
                    <button className="btn btn-link btn-sm me-3">#.Net</button>
                </div>
                <div className="d-flex w-100 p-3" style={{ flexWrap: "wrap", position: "relative" }}>
                    {blogs}
                </div>
            </div>
        </div>
    );
}