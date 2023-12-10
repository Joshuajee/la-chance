import ModalWrapper from "@/components/modals/ModalWrapper"
import { GOVERNANCE_TOKEN } from "@/libs/constants";
import governanceTokenAbi from "@/abi/contracts/GovernaceToken.sol/GovernanceToken.json";
import { useEffect } from "react"
import { useContractWrite } from "wagmi"
import Input from "@/components/utils/Input";
import Web3btn from "@/components/utils/Web3btn";
import useInput from "@/hooks/useInput";
import { toast } from "react-toastify";
import convert from "ethereum-unit-converter"
import useCurrentChainId from "@/hooks/useCurrentChainId";

interface IProps {
    id: bigint,
    open: boolean,
    accountBal: string,
    setOpen: (open: boolean) => void;
    vote: 1 | 2
}

const VoterAction = ({id, open, vote, accountBal, setOpen}: IProps) => {

    const currentChainId = useCurrentChainId()

    const amount = useInput("number")

    const amountInEther = convert(amount.value, "ether").wei

    const { write, isLoading, isError, isSuccess, error } = useContractWrite({
        address: GOVERNANCE_TOKEN,
        abi: governanceTokenAbi,
        functionName: 'vote',
        args: [id, vote, amountInEther],
        chainId: currentChainId
    })

    useEffect(() => {
        if (isSuccess) {
            toast.success("Vote Recorded")
            setOpen(false)
        }
    }, [isSuccess, error, setOpen])

    useEffect(() => {
        if (isError) toast.error(error?.name)
    }, [isError, error])

    const handleClose = () => {
        setOpen(false)
    }

    console.log(error)

    return (
        <ModalWrapper title="Cast your Vote" open={open} handleClose={handleClose}>

            <h3 className="text-center">Balance: { accountBal } <strong>LGT</strong> </h3>

            <Input type="number" value={amount.value} onChange={amount.setValue} />


            <div className="w-full">
                
                <Web3btn loading={isLoading} onClick={write}>  Cast Vote </Web3btn>

            </div>

        </ModalWrapper>
    )
}

export default VoterAction