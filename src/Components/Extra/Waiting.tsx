import React from "react";

function Waiting(){

    return (
        <div className="waiting-container d-flex justify-content-center">
            <div className="my-waiting rounded shadow-lg mb-3 zpanel border">
                {/* <img src="/images/keno_ball.png" alt="image" /> */}
                <div className="text-center mb-0 mt-2" style={{fontSize: "15px",}}>Processing...</div>
                <div className="loading_parent">
                    <div className="loading_child" style={{backgroundColor: "var(--button_bg)"}}></div>
                </div>
            </div>
        </div>
    );
}

export default Waiting;