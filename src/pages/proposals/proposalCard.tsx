import Poll from "./poll";
import LoadingButtonSM from '@/components/utils/LoadingButtonSM';
import Status from "./status";
import { IProposalData } from "@/libs/interfaces";
import Countdown from "react-countdown";
import { PROPSAL_STATUS } from "@/libs/enums";
import { useEffect, useState } from "react";
import VoterAction from "./voterAction";
import SupportProposal from "./supportProposal";
import Web3btn from "@/components/utils/Web3btn";
import { useContractWrite } from "wagmi";
import { GOVERNANCE } from "@/libs/constants";
import governanceAbi from "@/abi/contracts/Governance.sol/Governance.json";
import useCurrentChainId from "@/hooks/useCurrentChainId";
import { toast } from "react-toastify";




interface IProps {
    data: IProposalData,
    accountBal: string,
}


const ProposalCard = ({ data, accountBal } : IProps) => {

    const currentChainId = useCurrentChainId()

    const [openVote, setOpenVote] = useState(false)
    const [openSupport, setOpenSupport] = useState(false)

    const [voteType, setVoteType] = useState<1 | 2>(1)

    const { id, status, threshold, description, voteFor, voteAgainst, votingPeriod } = data

    const yes = Number(voteFor?.toString())
    const no = Number(voteAgainst?.toString())

    const countdown = Date.now() + Number(votingPeriod) * 1000

    const expired = votingPeriod === 0n && status === PROPSAL_STATUS.Pending

    const execute = useContractWrite({
        address: GOVERNANCE,
        abi: governanceAbi,
        functionName: 'execute',
        args: [id],
        chainId: currentChainId
    })

    const claimFunds = useContractWrite({
        address: GOVERNANCE,
        abi: governanceAbi,
        functionName: 'claimFunds',
        args: [id],
        chainId: currentChainId
    })

    const voteYes = () => {
        setOpenVote(true)
        setVoteType(1)
    }

    const voteNo = () => {
        setOpenVote(true)
        setVoteType(2)
    }

    const support = () => {
        setOpenSupport(true)
    }


    useEffect(() => {
        if (execute.isSuccess) {
            toast.success("Proposal has been executed, you can now Claim funds")
        }
    }, [execute.isSuccess])

    useEffect(() => {
        if (execute.isError) {
            toast.error(execute.error?.message)
        }
    }, [execute.isError, execute.error]);


    useEffect(() => {
        if (claimFunds.isSuccess) {
            toast.success("Funds claimed succesfully")
        }
    }, [claimFunds.isSuccess])

    useEffect(() => {
        if (claimFunds.isError) {
            toast.error(claimFunds.error?.message)
        }
    }, [claimFunds.isError, claimFunds.error]);

    return (
        <div className="flex flex-col text-gray-700 bg-white rounded-md p-4 md:px-4 shadow-lg w-full">
           
            <h3 className="mb-3 text-sm"> POLL ID {id.toString()}</h3>
            <h2 className="text-black text-xl md:text-2xl font-semibold mb-3 text-ellipsis">{description.slice(0, 60)}</h2>
            <p className="mb-3">{description}</p>

            <div className="flex flex-col lg:flex-row justify-between font-medium">
                
                <div>
                    <Status status={status} expired={expired} />
                </div> 

                <div>

                    {
                        status === PROPSAL_STATUS.Pending &&
                            <>
                                Proposal Expires in:  <Countdown date={countdown} />
                            </> 
                    }

                    {
                        status === PROPSAL_STATUS.Active &&
                            <>
                                Voting ends in:  <Countdown date={countdown} />
                            </> 
                    }

                </div>

            </div>

            <div className="flex justify-end"><Poll yes={yes} no={no} threshold={threshold} /></div> 

            <div className="flex-grow"></div>

            <div className="flex justify-between">
            
            </div>

            {
                status === PROPSAL_STATUS.Pending && !expired && (
                    <div className="flex flex-row space-x-2 justify-end">
                        <div className="w-48">
                            <LoadingButtonSM 
                                loading={false} 
                                onClick={support}
                                color="green">
                                Support Proposal
                            </LoadingButtonSM>
                        </div>
                    </div>
                )
            }

            {
                status === PROPSAL_STATUS.Active && votingPeriod > 1n && (
                    <div className="flex flex-row space-x-2">
                        <LoadingButtonSM 
                            loading={false} 
                            onClick={voteYes}
                            color="green">
                            Yes
                        </LoadingButtonSM>
                        <LoadingButtonSM 
                            loading={false}
                            onClick={voteNo}
                            color="red">
                            No
                        </LoadingButtonSM>
                    </div>
                )
            }


            {
                status === PROPSAL_STATUS.Active && votingPeriod <= 0n && (
                    <div className="flex flex-row space-x-2 justify-end">
                        <div className="w-48">
                            <Web3btn
                                loading={execute.isLoading} 
                                onClick={execute.write}
                                color="gray">
                                Execute Proposal
                            </Web3btn>
                        </div>
                    </div>
                )
            }

        {
                status > PROPSAL_STATUS.Active && (
                    <div className="flex flex-row space-x-2 justify-end">
                        <div className="w-48">
                            <Web3btn
                                loading={claimFunds.isLoading} 
                                onClick={claimFunds.write}
                                color="blue">
                                Claim Funds
                            </Web3btn>
                        </div>
                    </div>
                )
            }


            <VoterAction id={id} open={openVote} setOpen={setOpenVote} vote={voteType} accountBal={accountBal} />

            <SupportProposal id={id} open={openSupport} setOpen={setOpenSupport} accountBal={accountBal} />

        </div>
    )
}

export default ProposalCard