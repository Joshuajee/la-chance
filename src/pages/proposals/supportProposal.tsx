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
}

const SupportProposal = ({id, open, accountBal, setOpen}: IProps) => {

    const currentChainId = useCurrentChainId()

    const amount = useInput("number")

    const amountInEther = convert(amount.value, "ether").wei

    const handleClose = () => {
        setOpen(false)
    }

    const { write, isLoading, isError, isSuccess, error } = useContractWrite({
        address: GOVERNANCE_TOKEN,
        abi: governanceTokenAbi,
        functionName: 'supportProposal',
        args: [id, amountInEther],
        chainId: currentChainId
    })


    useEffect(() => {
        if (isSuccess) {
            toast.success("Proposal Sponsored")
            setOpen(false)
        }
    }, [isSuccess, error, setOpen])

    useEffect(() => {
        if (isError) toast.error(error?.name)
    }, [isError, error])

    return (
        <ModalWrapper title="Sponsor Proposal" open={open} handleClose={handleClose}>

            <h3 className="text-center">Balance: { accountBal } <strong>LGT</strong> </h3>

            <Input type="number" value={amount.value} onChange={amount.setValue} />

            <div className="w-full">
                
                <Web3btn loading={isLoading} onClick={write}>  Support </Web3btn>

            </div>

        </ModalWrapper>
    )
}

export default SupportProposal