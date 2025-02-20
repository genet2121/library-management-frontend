import React, { useEffect, useState } from 'react';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

function CustomeSelectBox({givenValue, onChange, title, readonly, disabled, id, onFocus, onBlur, options}: {
    givenValue: any,
    options: {value: any, label: string}[]
    onChange?: (event: any) => Promise<void>,
    title?: string,
    readonly?: boolean,
    disabled?: boolean,
    id?: number|string,
    onFocus?: (event?: any) => void,
    onBlur?: (event?: any) => void,
}) {

    const [selectedOption, setSelectedOption] = useState<{value: any, label: string}>();
    const [searchWord, setSearchWord] = useState<string>("");
    const [controlledOptions, setControlledOptions] = useState<{value: any, label: string}[]>([]);

    useEffect(() => {

        if(givenValue != undefined && givenValue != "") {
            // console.log("change happen ", givenValue, options);
            let selected = options.find(opt => (opt.value == givenValue));
            if(selected) {
                setSelectedOption(selected);
            }
        }

    }, [givenValue]);
    
    useEffect(() => {
        setControlledOptions(options);
    }, [options]);
    

    const selectOption = async (selected_option: {value: any, label: string}) => {

        setSelectedOption(selected_option);
        setSearchWord("");
        setControlledOptions(options);
        if(onChange){
            await onChange(selected_option);
        }

    }

    return (
        <div className="dropdown w-100 p-0 m-0 btn-group">
            <button 
                className={`btn zinput form-control border text-start`}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                disabled={disabled}
            >
                {selectedOption ? selectedOption.label : "None"}
            </button>
            { (selectedOption && selectedOption.value) && (<button className='btn zinput rounded-end' 
                onClick={() => {
                    selectOption({
                        label: "None",
                        value: ""
                    });
                }}
            >
                <ClearRoundedIcon sx={{color: "red"}} />
            </button>)}
            <ul className="dropdown-menu w-100 shadow zpanel">
                <li className="p-2" style={{backgroundColor: "rgba(125, 125, 125, 0.074)"}}>
                    <input 
                        className="form-control zinput"
                        value={searchWord}
                        onChange={(event: any) => {
                            setSearchWord(event.target.value);
                            setControlledOptions(options.filter(opt => (opt.label.toLowerCase().includes(event.target.value.toLowerCase()))));
                        }}
                        placeholder='Search Here'
                    />
                </li>
                {controlledOptions.map(opt => (
                    <li 
                        className={`dropdown-item zoption ${selectedOption?.value == opt.value ? "selected_zoption" : ""}`}
                        style={{cursor: "pointer"}}
                        onClick={() => {
                            selectOption(opt);
                        }}
                    >{opt.label}</li>
                ))}
            </ul>
        </div>
    );

}

export default CustomeSelectBox;