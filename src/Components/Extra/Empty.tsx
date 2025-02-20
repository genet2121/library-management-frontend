import React from "react";
import AddchartIcon from '@mui/icons-material/Addchart';

export default function({message}: {message: string}) {

    return (
        <div className="container mt-3 zpanel">
            <div className="card zpanel">
                <div className="card-body">
                    <div className="d-flex p-2">
                        <AddchartIcon sx={{fontSize: 100}} />
                        <div className="w-100 ps-3">
                            <h5 className="card-title">Content Not Found</h5>
                            <p className="lead">{message}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}