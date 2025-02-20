import React, { useEffect, useState } from "react";

function ScriptEditor({onExit, scriptValue}: {
    onExit: (new_value: string) => void,
    scriptValue: string
}) {

    const [scriptText, setScriptText] = useState<string>("");

    useEffect(() => {
        setScriptText(scriptValue)
    }, [scriptValue])


    return (
        <div className="waiting-container d-flex justify-content-center align-items-center" >
            <div className="card rounded shadow-lg" style={{width: "96%", height: "96%",}}>
                <div className="card-header border-bottom" style={{fontSize: "15px"}}>Script Editor</div>
                <div className="card-body h-100">
                    <textarea
                        name="Script editor"
                        id="editor"
                        className="form-control w-100 h-100"
                        value={scriptText}
                        onChange={(event: any) => {setScriptText(event.target.value);}}
                        style={{fontFamily: "monospace", background: "black", color: "lightblue" }}
                    />
                </div>
                <div className="card-footer d-flex justify-content-end">
                    <button className="btn btn-outline-danger btn-sm me-3 px-3" onClick={() => {onExit(scriptText)}}>Cancel</button>
                    <button className="btn btn-outline-primary btn-sm px-3">Save</button>
                </div>
            </div>
        </div>
    );
}

export default ScriptEditor;