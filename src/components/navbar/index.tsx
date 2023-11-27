import { Link } from "react-router-dom"
import { useScroll } from "@/hooks/windows"
import ConnectBtn from "./connectBtn"


const Navbar = () => {

    const scrollPosition = useScroll()

    const trigger = scrollPosition > 80


    return (
        <nav data-aos="fade-in" className={`${trigger && "shadow-lg backdrop-blur-xl bg-blue/50 z-10"} fixed w-full flex justify-between text-white py-4 px-2 md:px-10`}>

            <Link to={"/"} className="text-white font-bold text-sm md:text-2xl">La chance</Link>

                <ul className="flex gap-x-4">
                    <li><Link to="/"> Home </Link> </li>
                    <li><Link to="/my-games"> My Games  </Link> </li>
                    <li><Link to="/game-history"> Game History </Link> </li>
                    <li><Link to="/proposals"> Proposals </Link> </li>
                </ul>

            <ConnectBtn />

        </nav>
    )
}

export default Navbar