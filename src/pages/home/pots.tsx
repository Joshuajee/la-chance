

const Pots = ({title} : {title: string}) => {

    const prize = 100

    //https://lottie.host/1967e79b-05d6-4a1e-a50d-2d3ca3d64787/hniP5LUzEF.json


    return (
        <div className="w-40 h-20 border-[1px] rounded-lg text-white">

    
            
            <p className="text-center">{prize}</p>
            
            <h3 className="text-center">{title}</h3>

        </div>
    )
}

export default Pots