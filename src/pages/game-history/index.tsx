import { useNavigate } from "react-router-dom"

const GameHistoryPage = () => {

    const navigate = useNavigate()

    return (
        <main className="flex flex-col items-center ">

            <div className="my-10">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg border-[1px]">
                    <table className="w-full text-sm text-left text-white">
                        <thead className="text-xs uppercase text-white">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Numbers
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Winners
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Time
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                [1, 2, 3].map((result, index) => {

                                    console.log(result)

                                    return (
                                        <tr className="cursor" onClick={() => navigate("/game-history/" + index)}>
                                            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                                                12, 20, 30, 45, 55
                                            </th>
                                            <td className="px-6 py-4">
                                                10
                                            </td>
                                            <td className="px-6 py-4">
                                                {Date.now()}
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>

        </main>
    )
}


export default GameHistoryPage