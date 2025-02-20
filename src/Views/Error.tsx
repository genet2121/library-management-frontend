import React from 'react';

function ErrorPage() {
    return (
        <div className='d-flex justify-content-center mt-5'>
            <div className="col"></div>
            <div className='col-sm-11 col-md-6 p-3 rounded'>
                <img src="./images/page_not_found_vector_no_bg.png" alt="page not found" style={{height: "300px", left: "50%", transform: "translateX(-50%)", position: "relative"}} />
                <h3 className="card-title text-center">Oops!</h3>
                <p className="card-subtitle fs-5 text-center">
                    the page you requested could not be found! we are working on it <br/>
                </p>
                {/* <button className="btn btn-lg btn-primary">Home</button> */}
            </div>
            <div className="col"></div>
        </div>
    );
}

export default ErrorPage;