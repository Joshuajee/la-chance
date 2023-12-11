import Badge from "@/components/utils/Badge";
import { PROPSAL_STATUS } from "@/libs/enums";


interface IProps {
    status: PROPSAL_STATUS;
    expired: boolean;
}

const Status = ({ status, expired } : IProps) => {

    if (expired)            
        return (
            <Badge color={"gray"}> 
                <p className="ml-2 text-sm">{"Expired"}</p> 
            </Badge>
        )

    switch(status) {
        case PROPSAL_STATUS.Active:
            return (
                <Badge color={"green"}> 
                    <p className="ml-2 text-sm">{"Active"}</p> 
                </Badge>
            )
        case PROPSAL_STATUS.Failed:
            return (
                <Badge color={"marron"}> 
                    <p className="ml-2 text-sm">{"Failed"}</p> 
                </Badge>
            )
        case PROPSAL_STATUS.Rejected:
            return (
                <Badge color={"red"}> 
                    <p className="ml-2 text-sm">{"Rejected"}</p> 
                </Badge>
            )
        case PROPSAL_STATUS.Executed:
            return (
                <Badge color={"gray"}> 
                    <p className="ml-2 text-sm">{"Executed"}</p> 
                </Badge>
            )

    }

    return (
        <Badge color={"yellow"}> 
            <p className="ml-2 text-sm">{"Pending"}</p> 
        </Badge>
    )
}

export default Status