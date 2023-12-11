import Input from "@/components/utils/Input"
import Web3btn from "@/components/utils/Web3btn"
import useInput from "@/hooks/useInput"
import { useEffect, useState } from "react"
import governanceAbi from "@/abi/contracts/Governance.sol/Governance.json";
import { useContractWrite } from "wagmi";
import { GOVERNANCE } from "@/libs/constants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";





const CreateProposal = () => {

    const [description, setDescription] = useState("")

    const target = useInput("address")
    const value = useInput("number")
    const calldata = useInput("text", 2, "0x")

    const navigate = useNavigate()


    const { write, isLoading, isSuccess, isError, error } = useContractWrite({
        address: GOVERNANCE,
        abi: governanceAbi,
        functionName: "propose",
        args: [[target.value], [value.value], [calldata.value], description ]
    })

    useEffect(() => {
        if (isSuccess) {
            toast.success("Proposal Created Successfully")
            toast.info("Redirecting...")
            setTimeout(() => {
                navigate("/proposals")
            }, 3000)
        }
    }, [isSuccess, navigate])

    useEffect(() => {
        if (isError) toast.error(error?.message)
    }, [isError, error])


    return (
        <div>
            <div className="flex flex-col text-gray-700 bg-white rounded-md p-4 md:px-4 shadow-lg w-[600px]">

                <Input 
                    label="Target *" type="text" 
                    value={target.value} onChange={target.setValue} 
                    onFocus={target.setOnFocus} error={target.errorWarning}
                    helperText={target.errorMessage} />

                <Input 
                    label="Value *" type="text" 
                    value={value.value} onChange={value.setValue} 
                    onFocus={value.setOnFocus} error={value.errorWarning}
                    helperText={value.errorMessage} />

                <Input 
                    label="Calldata *" type="text" 
                    value={calldata.value} onChange={calldata.setValue} 
                    onFocus={calldata.setOnFocus} error={calldata.errorWarning}
                    helperText={calldata.errorMessage} />

                <label className="my-2 text-sm font-bold">Description *</label>

                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mb-2 outline-none resize-none h-32 border-gray-700 border-[1px] rounded-lg p-2">

                </textarea>

                <Web3btn loading={isLoading} onClick={write}>Create Proposal</Web3btn>


            </div>

        </div>
    )
}

export default CreateProposal