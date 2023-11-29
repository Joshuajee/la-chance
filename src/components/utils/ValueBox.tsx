const ValueBox = ({ value }: { value: bigint | string }) => {

    return (
        <td className="px-2 py-2">
            <span className="w-20 h-20 p-2 border-[1px]">
                {Number(value) < 10 ? "0"+value : value.toString()}
            </span>
        </td>
    )
}

export default ValueBox