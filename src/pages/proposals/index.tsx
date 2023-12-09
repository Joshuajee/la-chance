import { useEffect, useState } from "react"
import ProposalCard from "./proposalCard"
import { IProposalData } from "@/libs/interfaces"
import { GOVERNANCE } from "@/libs/constants"
import { useContractRead } from "wagmi"
import governanceAbi from "@/abi/contracts/Governance.sol/Governance.json";
import ReactPaginate from "react-paginate"

export interface IProposal {
    id: number, 
    title: string, 
    creationTime: number, 
    status: string, 
    description: string, 
    votesFor: number, 
    votesAgainst: number, 
    votingPeriod: number
}

const ProposalPage = () => {


    const itemsPerPage = 20

    const [proposals, setProposals] = useState<IProposalData[]>([])
    const [start, setStart] = useState(0n)
    const [itemOffset, setItemOffset] = useState(0);


    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);


    const proposalCounter = useContractRead({
        address: GOVERNANCE,
        abi: governanceAbi,
        functionName: "proposalCounter"
    })

    const totalProposals = (proposalCounter.data || 1n) as bigint

    const max = BigInt(itemsPerPage)

    const showing = start - max

    const pageCount = Math.ceil(Number(totalProposals) / itemsPerPage);

    const getProposals = useContractRead({
        address: GOVERNANCE,
        abi: governanceAbi,
        functionName: "getProposals",
        args: [showing > 0 ? showing : 0, start],
        enabled: totalProposals > 1,
        watch: true
    })

    useEffect(() => {
        if (getProposals.data) setProposals(getProposals.data as IProposalData[])
    }, [getProposals.data])

    useEffect(() => {
        setStart(totalProposals - 1n)
    }, [totalProposals])

    // Invoke when user click to request another page.
    const handlePageClick = (event: any) => {
        const newOffset = (event.selected * itemsPerPage) % Number(totalProposals.toString());
        console.log(
        `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
        setStart(BigInt(newOffset))
    };

    // console.log(getProposals)

    console.log(proposalCounter)


    return (
        <main className='h-[calc(100vh_-_100px)] pb-10 text-white'>

            <h2 className="text-center text-5xl my-20 text-white font-bold">Proposals</h2>
            
            {/* <h3 className="text-end m-4">Showing from {itemOffset} to {endOffset}</h3> */}

            <div className='grid md:grid-cols-2 gap-4 w-full'>

                {
                    proposals.map((proposal, index) => {
                        console.log(proposal)
                        return (
                            <ProposalCard key={index}   data={proposal}/>
                        )
                    })
                }

            </div>


            <div className="page-wrapper flex w-full justify-end mb-20">

                <ReactPaginate
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
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

        </main>
    )
}


export default ProposalPage