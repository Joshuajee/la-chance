import Pots from "./pots"
import RecentResults from "./recentResults"
import LoadingButton from "@/components/utils/LoadingButton"
import { useNavigate } from "react-router-dom"

const HomePage = () => {

    const navigate = useNavigate()


    return (
        <main className="flex flex-col items-center justify-center">

            <div className="flex gap-10 mt-20">

                <Pots title="Pot #1"  />

                <Pots title="Pot #2"  />

                <Pots title="Pot #3"  />

                <Pots title="Pot #4"  />

                <Pots title="Pot #5"  />

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