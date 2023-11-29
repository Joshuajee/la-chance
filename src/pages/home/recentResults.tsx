import ValueBox from "@/components/utils/ValueBox"
import JackpotCoreAbi from "./../../abi/contracts/JackpotCore.sol/JackpotCore.json"
import { JACKPOT_CORE } from "@/libs/constants"
import { useEffect, useState } from "react"
import { useContractRead } from "wagmi"
import { ResultStanding } from "@/libs/interfaces"



const RecentResults = () => {

    const [results, setResults] = useState<ResultStanding[]>([])

    const gameRounds = useContractRead({
        address: JACKPOT_CORE,
        abi: JackpotCoreAbi,
        functionName: "gameRounds"
    })

    const rounds = gameRounds.data as bigint || 1n

    const start = rounds - 1n
    const showing = 10n
    const diff = start - showing



    const gameResult = useContractRead({
        address: JACKPOT_CORE,
        abi: JackpotCoreAbi,
        functionName: "getRecentResults",
        args: [diff > 0 ? diff : 0, start],
        enabled: rounds > 1,
        watch: true
    })

    useEffect(() => {
        if (gameResult.data) setResults(gameResult.data as ResultStanding[]) 
    }, [gameResult.data])


    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg border-[1px]">
            <table className="w-full text-sm text-left text-white">
                <thead className="text-xs uppercase text-white">
                    <tr>
                        <th colSpan={5} scope="col" className="px-6 py-3">
                            Result
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Winners
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        results.map((result) => {

                            const { pot1, pot2, pot3, pot4, pot5 } = result;

                            const { value1, value2, value3, value4, value5 } = result.result;

                            return (
                                <tr className="">
                                    <ValueBox value={value1}  />
                                    <ValueBox value={value2}  />
                                    <ValueBox value={value3}  />                 
                                    <ValueBox value={value4}  />          
                                    <ValueBox value={value5}   />
                                    <td className="px-6 py-4">
                                        { Number(pot1 + pot2 + pot3 + pot4 + pot5) }
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>

    )
}

export default RecentResults