const Poll = ({yes, no}: {yes: number, no: number}) => {

    const total = yes + no
    const yesPercent = Math.round(yes * 100 / total)
    const noPercent = 100 - yesPercent

    return (
        <div className="block py-4 w-full max-w-xs">

            <h4 className="text-right text-sm mb-2">Votes casted: <strong> {total} </strong> </h4>

            { 
                total > 0 &&
                <>
                    <div className="flex justify-between">
                        <p className="text-green-900 font-semibold">{yesPercent} %</p>
                        <p className="text-red-900 font-semibold">{noPercent} %</p>
                    </div>

                    <div className="relative pt-1">
                        <div className="overflow-hidden h-[4px] mb-4 text-xs flex rounded bg-red-600">
                            <div style={{width: yesPercent + "%"}} className="shadow-lg flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600"></div>
                        </div>
                    </div>
                </>
            }

        </div>
    )
}

export default Poll