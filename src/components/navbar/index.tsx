import { Link } from "react-router-dom"
import { useScroll } from "@/hooks/windows"
import ConnectBtn from "./connectBtn"


const Navbar = () => {

    const scrollPosition = useScroll()

    const trigger = scrollPosition > 80


    return (
        <nav data-aos="fade-in" className={`${trigger && "shadow-lg backdrop-blur-xl bg-blue/50 z-10"} fixed w-full flex justify-between py-4 px-2 md:px-10`}>

            <Link to={"/"} className="text-gray-800  text-white font-bold text-sm md:text-2xl">La chance</Link>

            <ConnectBtn />

        </nav>
    )
}

export default Navbar