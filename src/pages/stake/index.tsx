import Web3btn from "@/components/utils/Web3btn"
import Predition from "./Prediction"
import LoadingButton from "@/components/utils/LoadingButton"
import { useState } from "react"

interface IStakes {
    value1: number;
    value2: number;
    value3: number;
    value4: number;
    value5: number;
}

const StakePage = () => {

    const [stakes, setStakes] = useState<{error: boolean, stakes: IStakes[]}>(
        { 
            error: true, 
            stakes: [ {value1: 0, value2: 0, value3: 0, value4: 0, value5: 0 }]
        })


    const add = () => {
        const temp = [...stakes.stakes, {value1: 0, value2: 0, value3: 0, value4: 0, value5: 0 }]
        setStakes({...stakes, stakes: temp})
    }

    // const remove = (index: number) => {
    //     const temp = [...stakes.stakes].splice(index, 1)
    //     console.log(temp)
    //     setStakes({...stakes, stakes: temp})
    // }

    return (
        <main className="flex flex-col ">

            <div className="bg-white px-4 rounded-lg  w-[600px] border-slate-200">

                <h3 className="text-center text-3xl font-bold text-gray-800 mt-4">Stake </h3>

                <div className="flex flex-col items-center justify-center my-10">

                    { stakes.stakes.map((stake, index) => {
                        console.log(stake, index)
                        return (
                            <Predition key={index} />
                        )
                    })}

                    <div className="w-80 mt-10">
                        <LoadingButton onClick={add} color="gray">Add More</LoadingButton>
                    </div>

                    <div className="w-80">
                        <Web3btn>Stake</Web3btn>
                    </div>
          
                 
                </div>

            </div>


        </main>
    )
}


export default StakePage