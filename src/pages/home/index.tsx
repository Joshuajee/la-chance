import Pots from "./pots"
import RecentResults from "./recentResults"
import LoadingButton from "@/components/utils/LoadingButton"
import { useNavigate } from "react-router-dom"
import JackpotAbi from "./../../abi/contracts/Jackpot.sol/Jackpot.json"
import { Address, useContractRead } from "wagmi"
import { ADDRESS_ZERO, JACKPOT } from "@/libs/constants"
import { useEffect, useState } from "react"
import useCurrentChainId from "@/hooks/useCurrentChainId"


const HomePage = () => {

    const navigate = useNavigate()

    const currentChainId = useCurrentChainId()

    const [vaults, setVaults] = useState<Address[7]>(Array(7).fill(ADDRESS_ZERO) as any)

    const { data, isLoading } = useContractRead({
        abi: JackpotAbi,
        address: JACKPOT,
        functionName: "vaultAddresses",
        chainId: currentChainId
    })

    useEffect(() => {
        if (data) setVaults(data as Address[7])
    }, [data])

    console.log(isLoading)

    return (
        <main className="flex flex-col items-center justify-center">

            <div className="flex gap-10 mt-20">

                <Pots title="DOA Pot" contractAddr={vaults[5]} />

                <Pots title="Community Pot" contractAddr={vaults[6]} />

            </div>

            <div className="flex gap-10 mt-20">

                <Pots title="Pot #1" contractAddr={vaults[0]} />

                <Pots title="Pot #2" contractAddr={vaults[1]} />

                <Pots title="Pot #3" contractAddr={vaults[2]} />

                <Pots title="Pot #4" contractAddr={vaults[3]} />

                <Pots title="Pot #5" contractAddr={vaults[4]} />

            </div>

            <div className="mt-12 w-40">

                <LoadingButton onClick={() => navigate("/stake")}>Stake</LoadingButton>

            </div>

            <div className="my-10">
                <h3 className="text-center mb-4 text-white font-bold text-3xl">Recent Results</h3>
                <RecentResults />
            </div>

        </main>
    )
}


export default HomePage