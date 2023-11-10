import { memo } from "react"
import { useAccount, useContractRead } from "wagmi"

const VoterAction = ({id}: {id: number}) => {

    const { isConnected } = useAccount()

    const { data } = useContractRead({
        // address: contract,
        // abi: ProjectABI,
        functionName: 'isDonor',
        args: [id],
        enabled: isConnected
    })

    console.log(data)

    return (
        <div>
            

        </div>
    )
}

export default memo(VoterAction)