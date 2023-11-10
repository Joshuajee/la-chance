import ProposalCard from "./proposalCard"

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

const title = "Remove Minum Token price for proposals"
const time = Date.now()
const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam placerat malesuada metus, ac dictum magna dapibus quis. Phasellus molestie ante pretium laoreet aliquam."

const ProposalPage = () => {


    return (
        <main className='h-[calc(100vh_-_100px)]'>

            <h2 className="text-center text-5xl my-20 text-white font-bold">Proposals</h2>

            <div className='grid md:grid-cols-2 gap-4 w-full'>

                <ProposalCard 
                    proposal={{id: 1, title, creationTime: time, status: "active", description, votesFor: 1, votesAgainst: 1,  votingPeriod: 1}}  />


                <ProposalCard 
                    proposal={{id: 1, title, creationTime: time, status: "active", description, votesFor: 1, votesAgainst: 1,  votingPeriod: 1}}  />

            </div>

        </main>
    )
}


export default ProposalPage