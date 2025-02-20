import React from "react";
import { useEffect, useRef } from "react";

const UploadWidget = function () {

    const cloudinaryRef = useRef<any>();
    const widgetRef = useRef<any>();

    useEffect(() => {

        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: "",
            uploadPreset: ""
        }, (error: any, result: any) => {
            console.log(result);
        });

    }, []);

    return (
        <button onClick={() => {
            widgetRef.current.open();
        }}>
            Upload
        </button>
    );

}

export default UploadWidget;