import { useEffect } from "react";
// import { AiOutlineClockCircle } from "react-icons/ai"
import date from 'date-and-time';
//import Poll from "./poll"
import { useContractRead, useContractWrite } from "wagmi";
// import LoadingButtonSM from "@/components/utils/LoadingButtonSM";
import { toast } from "react-toastify";
import { IProposal } from ".";
// import Badge from "@/components/utils/Badge";
// import Countdown from "react-countdown";





const VotingPage = () => {

    const { data, isError, isLoading, isSuccess } = useContractRead({
        // address: contractAddress,
        // abi: ProposalFacetABI,
        functionName: 'viewProposal',
        args: [1],
        watch: true,
    })

    const { id, title, creationTime, status, description, votesFor, votesAgainst, votingPeriod } = data as IProposal

    const yes = Number(votesFor?.toString())
    const no = Number(votesAgainst?.toString())

    console.log({yes, no, votingPeriod, status,  isError, isLoading, isSuccess })


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

    // const yesVote = () => {
    //     if (!isConnected) return toast.error("Please Connect")
    //     voteYes?.write()
    // } 

    // const noVote = () => {
    //     if (!isConnected) return toast.error("Please Connect")
    //     voteNo?.write()
    // } 

    useEffect(() => {
        //if (voteYes?.isError) toast.error(voteYes?.error?.reason)
        if (voteYes?.isSuccess) toast.success("You have voted for this proposal")
    }, [voteYes?.isError, voteYes?.error, voteYes?.isSuccess]);

    useEffect(() => {
        //if (voteNo?.isError) toast.error(voteNo?.error?.reason)
        if (voteNo?.isSuccess) toast.success("You have voted against this proposal")
    }, [voteNo?.isError, voteNo?.error, voteNo?.isSuccess]);



    return (
        <div className="flex flex-col text-gray-700 bg-white rounded-md p-4 md:px-4 shadow-lg w-full">
           
            <h3 className="mb-3 text-sm">POSTED {date.format(new Date(Number(creationTime.toString()) * 1000), 'ddd, MMM DD YYYY')}  | POLL ID {id.toString()}</h3>
            <h2 className="text-black text-xl md:text-2xl font-semibold mb-3">{title}</h2>
            <p className="mb-3">{description}</p>

            <div className="flex flex-col lg:flex-row justify-between font-medium">
                
                {/* <div>
                    <Badge color={proposalStatus?.color}> 
                        <AiOutlineClockCircle size={18} /> 
                        <p className="ml-2 text-sm">{proposalStatus?.status}</p> 
                    </Badge>
                </div> */}
{/* 
                <div>

                    {
                        proposalStatus?.state === 0 &&
                            <>
                                Voting starts in:  <Countdown date={Number(delay)} />
                            </>
                    }

                    {
                        proposalStatus?.state === 1 &&
                            <>
                                Voting ends in:  <Countdown date={Number(deadline)} />
                            </> 
                    }

                </div> */}

            </div>
{/* 
            <div className="flex justify-end"><Poll yes={yes} no={no} /></div> */}

            <div className="flex-grow"></div>

            <div className="flex justify-between">
{/* 
                { !expanded ? <button onClick={() => router.push(`${links.proposals}/${id.toString()}`)} className="text-gray-600">View Details </button> : <div> </div> } */}

                {/* {   
                    (proposalStatus as any)?.state === 1 || true &&
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
                } */}
                
            </div>

        </div>
    )
}

export default VotingPage