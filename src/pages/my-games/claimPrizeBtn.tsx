import { useContractWrite } from "wagmi"
import JackpotAbi from "./../../abi/contracts/Jackpot.sol/Jackpot.json"
import Web3btn from "@/components/utils/Web3btn"
import { JACKPOT } from "@/libs/constants"
import { useEffect } from "react"
import { toast } from "react-toastify"
import useCurrentChainId from "@/hooks/useCurrentChainId"


const ClaimPrize = ({gameRound, ticketId}: { gameRound: bigint, ticketId: bigint }) => {

    const currentChainId = useCurrentChainId()

    const { write,  isLoading, isSuccess, isError, error } = useContractWrite({
        address: JACKPOT,
        abi: JackpotAbi,
        functionName: "claimTicket",
        args: [gameRound, ticketId],
        chainId: currentChainId
    })


    useEffect(() => {
        if (isError) toast.error(error?.name)
    }, [isError, error?.name])

    useEffect(() => {
        if (isSuccess) toast.success("Ticket Claimed")
    }, [isSuccess])


    return (
        <div>
            <Web3btn loading={isLoading} onClick={write}>
                Claim Prize
            </Web3btn>
        </div>
    )
}

export default ClaimPrize