import Input from "@/components/utils/Input";
import useInput from "@/hooks/useInput";
import { memo } from "react";
import { LiaRandomSolid } from "react-icons/lia"

function getRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}


//{index, remove}: { index: number, remove(index: number): void}
const Predition = () => {
  
    const value1 = useInput("text", 1)
    const value2 = useInput("text", 1)
    const value3 = useInput("text", 1)
    const value4 = useInput("text", 1)
    const value5 = useInput("text", 1)

    const random = () => {
        value1.setValue(getRandom(0, 99))
        value2.setValue(getRandom(0, 99))
        value3.setValue(getRandom(0, 99))
        value4.setValue(getRandom(0, 99))
        value5.setValue(getRandom(0, 99))
    }

  
    return (
      <div className="flex">

        <div className="w-10 mx-2">
            <Input 
                value={value1.value} onChange={value1.setValue} type="number"
                onFocus={value1.setOnFocus} error={value1.error} helperText="" />
        </div>

        <div className="w-10 mx-2">
            <Input 
                value={value2.value} onChange={value2.setValue} type="number"
                onFocus={value2.setOnFocus} error={value2.error} helperText="" />
        </div>

        <div className="w-10 mx-2">
            <Input 
                value={value3.value} onChange={value3.setValue} type="number"
                onFocus={value3.setOnFocus} error={value3.error} helperText="" />
        </div>

        <div className="w-10 mx-2">
            <Input 
                value={value4.value} onChange={value4.setValue} type="number"
                onFocus={value4.setOnFocus} error={value4.error} helperText="" />
        </div>

        <div className="w-10 mx-2">
            <Input 
                value={value5.value} onChange={value5.setValue} type="number"
                onFocus={value5.setOnFocus} error={value5.error} helperText="" />
        </div>

        <button onClick={random} className="w-10 h-10 mx-2 mt-2 bg-gray-800 hover:bg-gray-700 p-3"> 
            <LiaRandomSolid color="white" /> 
        </button>

        {/* <button onClick={() => remove(index)} className="w-10 h-10 mx-2 mt-2 bg-gray-800 hover:bg-gray-700 p-3"> 
            <LiaRandomSolid color="white" /> 
        </button> */}

      </div>
    );
}

export default memo(Predition)