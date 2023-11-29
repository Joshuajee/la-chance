const PotStatus = ({ value }: { value: boolean }) => {
    if (value) {
        return (
            <div className="w-20 h-20 p-2 border-[1px] mx-1 bg-green-800">
                Won
            </div>
        );
    } else {
        return (
            <div className="basis-40 h-20 p-2 border-[1px] mx-1 bg-red-800">
                Lost
            </div>
        )
    }
}

export default PotStatus