import Poll from "./poll";
import { useAccount, useContractWrite } from 'wagmi';
import LoadingButtonSM from '@/components/utils/LoadingButtonSM';
import { toast } from 'react-toastify';
import Status from "./Status";
import { IProposalData } from "@/libs/interfaces";
import Countdown from "react-countdown";
import { PROPSAL_STATUS } from "@/libs/enums";





interface IProps {
    data: IProposalData
}

const id = 2

const ProposalCard = ({ data } : IProps) => {

    const { isConnected } = useAccount()

    const { status, description, voteFor, voteAgainst, votingPeriod } = data

    const yes = Number(voteFor?.toString())
    const no = Number(voteAgainst?.toString())

    const voteYes = useContractWrite({
        // address: contractAddress,
        // abi: ProposalFacetABI,
        functionName: 'voteYes',
        args: [Number(id)],
    })

    const voteNo = useContractWrite({
        // address: contractAddress,
        // abi: ProposalFacetABI,
        functionName: 'voteNo',
        args: [Number(id)],
    })

    console.log(votingPeriod, status)

    const yesVote = () => {
        if (!isConnected) return toast.error("Please Connect")
        voteYes?.write()
    } 

    const noVote = () => {
        if (!isConnected) return toast.error("Please Connect")
        voteNo?.write()
    } 


    return (
        <div className="flex flex-col text-gray-700 bg-white rounded-md p-4 md:px-4 shadow-lg w-full">
           
            <h3 className="mb-3 text-sm"> POLL ID {id.toString()}</h3>
            <h2 className="text-black text-xl md:text-2xl font-semibold mb-3 text-ellipsis">{description.slice(0, 60)}</h2>
            <p className="mb-3">{description}</p>

            <div className="flex flex-col lg:flex-row justify-between font-medium">
                
                <div>
                    <Status status={status} />
                </div> 

                <div>

                    {
                        status === PROPSAL_STATUS.Pending &&
                            <>
                                Proposal Expires in:  <Countdown date={Number(votingPeriod) * 1000} />
                            </> 
                    }

                    {
                        status === PROPSAL_STATUS.Active &&
                            <>
                                Voting ends in:  <Countdown date={Number(votingPeriod) * 1000} />
                            </> 
                    }

                </div>

            </div>

            <div className="flex justify-end"><Poll yes={yes} no={no} /></div> 

            <div className="flex-grow"></div>

            <div className="flex justify-between">
            
            </div>

            <div className="flex flex-row space-x-2">

                <LoadingButtonSM 
                    loading={voteYes?.isLoading} 
                    onClick={yesVote}
                    color="green">
                    Yes
                </LoadingButtonSM>

                <LoadingButtonSM 
                    loading={voteNo?.isLoading}
                    onClick={noVote}
                    color="red">
                    No
                </LoadingButtonSM>

            </div>

        </div>
    )
}

export default ProposalCard