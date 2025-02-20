import { useParams } from "react-router-dom";
import TablePage from "./TablePage";
import React from "react";
import TopNav from "../Components/NavBars/TopNav";

export default function () {

    const params = useParams();

    return (
        <div className="w-100 h-100 px-2" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* <TopNav /> */}
            <TablePage formName={params.name ?? ""} isRelatedList={false} condition={{}} />
        </div>
    );

}