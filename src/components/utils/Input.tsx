import { Dispatch, SetStateAction } from "react";

interface IProps {
    id?: string;
    name?: string;
    label?: string;
    placeholder?:string;
    value: any;
    onChange: Dispatch<SetStateAction<any>>;
    onFocus?: Dispatch<SetStateAction<boolean>>;
    helperText?: string;
    min?: number; 
    error?: boolean; 
    type: string;
}

const Input = (props: IProps) => {
    
    const {id, name, label, placeholder, helperText, value, onChange, onFocus, min, error, type} = props

    return (
        <div className="mb-4">
            <label className={`block mb-2 text-sm font-semibold  text-[#344054]`}> {label} </label>
            <input 
                name={name} autoComplete="off" min={min} value={value} type={type} 
                onChange={(e) => onChange(e.target.value)}  id={id}  
                onFocus={() => onFocus?.(true)} 
                className={`
                text-[#344054] bg-[#FFFFFF] border-[1px] border-[#D0D5DD] disabled:border-[#D0D5DD] outline-none text-sm rounded-lg ${error ? "border-red-400": "focus:border-[#023047] focus:text-[#023047]"}  block w-full p-2.5`} 
                    placeholder={placeholder} />
            {error && <p className="my-2 text-xs text-red-400">{helperText}</p>}
        </div>
    )
}

export default Input