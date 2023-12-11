import JackpotCoreAbi from "./../../abi/contracts/JackpotCore.sol/JackpotCore.json"
import { useAccount, useContractRead } from "wagmi"
import { JACKPOT_CORE } from "@/libs/constants"
import { useEffect, useState } from "react"
import ValueBox from "@/components/utils/ValueBox"
import PotStatus from "@/components/utils/PotStatus"
import { TicketStanding } from "@/libs/interfaces"
import ClaimPrize from "./claimPrizeBtn"
import WithdrawStake from "./withdrawStakeBtn"
import ReactPaginate from 'react-paginate';
import useCurrentChainId from "@/hooks/useCurrentChainId"

const MyGames = () => {

    const currentChainId = useCurrentChainId()

    const itemsPerPage = 20

    const [myTickets, setMyTickets] = useState<TicketStanding[]>([])
    const [start, setStart] = useState(0n)
    const [itemOffset, setItemOffset] = useState(0);


    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);



    const { address } = useAccount()

    const getMyTicketLength = useContractRead({
        address: JACKPOT_CORE,
        abi: JackpotCoreAbi,
        functionName: "getMyTicketLength",
        args: [address],
        chainId: currentChainId
    })

    const myTicketLength = (getMyTicketLength.data || 1n) as bigint

    const max = BigInt(itemsPerPage)

    const showing = start - max

    const pageCount = Math.ceil(Number(myTicketLength) / itemsPerPage);

    const myGames = useContractRead({
        address: JACKPOT_CORE,
        abi: JackpotCoreAbi,
        functionName: "getMyRecentTickets",
        args: [address, showing > 0 ? showing : 0, start],
        enabled: myTicketLength > 1,
        watch: true,
        chainId: currentChainId
    })

    useEffect(() => {
        if (myGames.data) setMyTickets(myGames.data as TicketStanding[])
    }, [myGames.data])

    useEffect(() => {
        setStart(myTicketLength - 1n)
    }, [myTicketLength])

    // Invoke when user click to request another page.
    const handlePageClick = (event: any) => {
        const newOffset = (event.selected * itemsPerPage) % Number(myTicketLength.toString());
        console.log(
        `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
        setStart(BigInt(newOffset))
    };

    return (
        <main className="flex flex-col items-center mb-20">

            <div className="my-10 mb-20">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg border-[1px]">
                    <table className="w-full text-sm text-left text-white">
                        <thead className="text-xs uppercase text-white">
                            <tr>
                                <th scope="col" className="px-6 py-3">Numbers</th>
                                <th scope="col" className="px-6 py-3">Pot 1</th>
                                <th scope="col" className="px-6 py-3">Pot 2</th>
                                <th scope="col" className="px-6 py-3">
                                    Pot 3
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Pot 4
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Pot 5
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Time
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                myTickets.map((result, index) => {

                                    const { value1, value2, value3, value4, value5 } = result.ticket.ticketValue
                                    const { won1, won2, won3, won4, won5 } = result
                                    const hasResult = result.hasResult

                                    const canWithdraw = () => {
                                        if (!hasResult) return false
                                        if (result.ticket.hasClaimedPrize) return false
                                        if (won1) return true
                                        if(Number(result.ticket.stakePeriod) * 1000 < Date.now()) return true
                                        return false
                                    }

                                    return (
                                        <tr key={index} className="cursor">

                                            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                                                <ValueBox value={value1} />
                                                <ValueBox value={value2} />
                                                <ValueBox value={value3} />
                                                <ValueBox value={value4} />
                                                <ValueBox value={value5} />
                                            </th>

                                            {
                                                !hasResult && (
                                                    <td colSpan={5} className="px-6 py-4 text-center">
                                                        Waiting for results
                                                    </td>
                                                )
                                            }

                                            {  
                                                hasResult &&
                                                <>
                                                    <PotStatus value={won1}  />
                                                    <PotStatus value={won2}  />
                                                    <PotStatus value={won3}  />                 
                                                    <PotStatus value={won4}  />          
                                                    <PotStatus value={won5}   />
                                                </>
                                            }
                                            
                                            <td className="px-6 py-4">
                                                {result.ticket.stakePeriod.toString()}
                                            </td>

                                            <td className="px-4">
                                                <div className="w-36">
                                        
                                                    {   
                                                        won1 ? 
                                                            <ClaimPrize gameRound={result.gameRound} ticketId={result.ticketId} disabled={!canWithdraw()} /> 
                                                                : 
                                                            <WithdrawStake gameRound={result.gameRound} ticketId={result.ticketId} disabled={!canWithdraw()}  />
                                                    }
             
                                                </div>
                                            </td>
                                        
                                        </tr>
                                    )
                                })
                            }

                        </tbody>

                    </table>

                </div>

            </div>

            { pageCount > 1 &&                
                <div className="page-wrapper flex w-full justify-end">
                    <ReactPaginate
                        nextLabel="next >"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={8}
                        marginPagesDisplayed={2}
                        pageCount={pageCount}
                        previousLabel="< previous"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                        renderOnZeroPageCount={null}/>
                    </div>
                }

        </main>
    )
}


export default MyGames