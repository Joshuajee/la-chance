// import { AiOutlineClockCircle } from "react-icons/ai"
import date from 'date-and-time';
//import Poll from "./poll"
import { IProposal } from ".";
import Badge from "@/components/utils/Badge";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Poll from "./poll";
import { useAccount, useContractWrite } from 'wagmi';
import LoadingButtonSM from '@/components/utils/LoadingButtonSM';
import { toast } from 'react-toastify';
// import Badge from "@/components/utils/Badge";
// import Countdown from "react-countdown";



interface IProps {
    proposal: IProposal
}


const ProposalCard = ({proposal } : IProps) => {

    const { isConnected } = useAccount()

    const navigate = useNavigate()

    const { id, title, creationTime, status, description, votesFor, votesAgainst, votingPeriod } = proposal

    const yes = Number(votesFor?.toString())
    const no = Number(votesAgainst?.toString())

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
           
            <h3 className="mb-3 text-sm">POSTED {date.format(new Date(Number(creationTime.toString()) * 1000), 'ddd, MMM DD YYYY')}  | POLL ID {id.toString()}</h3>
            <h2 className="text-black text-xl md:text-2xl font-semibold mb-3">{title}</h2>
            <p className="mb-3">{description}</p>

            <div className="flex flex-col lg:flex-row justify-between font-medium">
                
                <div>
                    <Badge color={"green"}> 
                        <AiOutlineClockCircle size={18} /> 
                        <p className="ml-2 text-sm">{"Open"}</p> 
                    </Badge>
                </div> 
{/* 
                <div>

                    {
                        proposalStatus?.state === 1 &&
                            <>
                                Voting ends in:  <Countdown date={Number(deadline)} />
                            </> 
                    }

                </div> */}

            </div>

            <div className="flex justify-end"><Poll yes={yes} no={no} /></div> 

            <div className="flex-grow"></div>

            <div className="flex justify-between">
            
            <button 
                onClick={() => navigate(id.toString())} 
                className="text-gray-600"> View Details </button> 
                
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