import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import IField from "../Intefaces/IField";
import FieldTypes from "../Enums/FiedTypes";
import { props } from "../APIs/api";


function ListComponent({ selector, cols, rows, idColumn, realId, emitOnSelect }: {
    selector: (id: number) => void, cols: IField[],
    rows: any[],
    idColumn?: string,
    realId?: string,
    emitOnSelect: (selected_records: any[]) => void
}) {

    const [columns, setColumns] = useState<IField[]>([]);
    const [records, setRecords] = useState<any[]>([]);
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);

    useEffect(() => {
        setColumns(cols);
        setRecords(rows);
    }, [cols, rows]);

    useEffect(() => {

        let temp_selected: any[] = [];
        if(selectAll) {
            temp_selected = records.map(rc => rc[(realId ?? "id")]);
        }

        setSelectedRecords(srec => temp_selected);
        emitOnSelect(temp_selected);

    }, [selectAll]);

    const selectRecord = (rec_id: any) => {

        let temp_selected: any[] = [];
        if(!selectedRecords.includes(rec_id)) {
            temp_selected = [...selectedRecords, rec_id];
            console.log("selected ", rec_id);
        }else {
            temp_selected = selectedRecords.filter(r => (r != rec_id));
            console.log("un selected ", rec_id);
        }
        
        emitOnSelect(temp_selected);
        setSelectedRecords(sr => temp_selected);

    }

    return (
        <div className="d-flex" style={{ flexWrap: "wrap" }}>
            <div className="col"></div>
            <div className={isMobile ? "w-100" : "col-xlg-10 col-lg-12"}>
                <div className="card-body px-4" style={{ width: "100%", overflowX: "auto" }}>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <td scope="col">
                                    <input className="form-check-input zcheck_box" type="checkbox" checked={selectAll} title="Select all records" onChange={() => {setSelectAll(!selectAll)}} />
                                   
                                </td>
                                {columns.map(col => (<th style={{fontWeight: "bolder", color: "var(--border_color) !important"}} key={col.id} id={col.id}>{col.label}</th>))}
                            </tr>
                        </thead>
                        <tbody style={{fontSize: "13px"}}>
                            {records.map(rec => (
                                <tr className="py-1" key={`row_${rec[(realId ?? "id")]}`}>
                                    <td className="py-1" scope="row" key={`select_col_${rec[(realId ?? "id")]}`} >
                                        <input className="form-check-input zcheck_box" type="checkbox" checked={selectedRecords.includes(rec[(realId ?? "id")])} title="select this record" onChange={(event: any) => {selectRecord(rec[(realId ?? "id")])}} />
                                    </td>
                                    {
                                    columns.map(col => {
                                        if((col.id.toLowerCase()) == (idColumn ?? "id")) {
                                            return (
                                                <td className="py-0" key={`${col.id}_col_${rec[(realId ?? "id")]}`}>
                                                    <button className="btn btn-link btn-sm" style={{fontSize: "13px"}} onClick={() => { selector(rec[(realId ?? "id")]) }}>{rec[col.id.toLowerCase()]}</button>
                                                </td>
                                            );
                                        } else if(col.type == FieldTypes.IMAGE) {
                                            return (<td className="py-1" scope="row" key={`${col.id}_col_${rec[(realId ?? "id")]}`}>
                                                <img src={`${props.baseURL}file/${rec[col.id]}`} className="rounded" style={{ width: "100px", height: "auto" }} alt="attached image" />
                                            </td>);
                                        }
                                        else if(col.type == FieldTypes.SELECT) {
                                            return (
                                                <td scope="row" className="py-1" key={`${col.id}_col_${rec[(realId ?? "id")]}`}>
                                                    <span className="badge rounded-pill py-1 px-3 mb-0" style={rec[col.id] ? {background: rec[col.id].bgColor, color: rec[col.id].color, paddingTop: "5px !important", lineHeight: 1} : {}}>
                                                        {rec[col.id] ? rec[col.id].label : "NULL"}
                                                    </span>
                                                </td>
                                            );
                                        }
                                        else if(col.type == FieldTypes.TEXTAREA) {
                                            return (
                                                <td scope="row" className="py-1" key={`${col.id}_col_${rec[(realId ?? "id")]}`} title={rec[col.id]} style={{cursor: "pointer"}}>
                                                    {rec[col.id] ? rec[col.id].replace(/<\/?[^>]+(>|$)/g, "").substring(0, 20) : ""} {(rec[col.id] && rec[col.id].length > 20) ? "..." : ""}
                                                </td>
                                            );
                                        } else if(col.type == FieldTypes.NUMBER) {
                                            return (
                                                <td scope="row" className="py-1" key={`${col.id}_col_${rec[(realId ?? "id")]}`} title={rec[col.id]} style={{cursor: "pointer"}}>
                                                    {rec[col.id]}
                                                </td>
                                            );
                                        } else {
                                            return (<td scope="row" className="py-1" key={`${col.id}_col_${rec[(realId ?? "id")]}`}>
                                                {/* {rec[col.id]} */}
                                                {rec[col.id] ? rec[col.id].replace(/<\/?[^>]+(>|$)/g, "").substring(0, 20) : ""} {(rec[col.id] && rec[col.id].length > 20) ? "..." : ""}
                                            </td>);
                                        }
                                    })
                                }</tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="col"></div>
        </div>
    );
}

export default ListComponent;