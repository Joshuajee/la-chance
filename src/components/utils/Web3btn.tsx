import { ReactNode, useState } from "react";
import LoadingButton from "./LoadingButton"
import { useAccount } from "wagmi";
import ModalWrapper from "../modals/ModalWrapper";
import WalletOptions from "../navbar/walletsOptions";

interface IProps { 
    color?: string; 
    disabled?: boolean; 
    loading?: boolean;
    onClick?: () => void; 
    children: ReactNode ,
    loadingText?: string;
}

const Web3btn = (props: IProps) => {

    const { isConnected } = useAccount()
    const [showOptions, setShowOptions] = useState(false)
    const closeOptions  = () => {
        setShowOptions(false)
    }
    
    const click = () => {

        if (!isConnected) return setShowOptions(true)
        props?.onClick?.()

    }

    return (
        <div>
            <LoadingButton loadingText={props.loadingText} color={props.color} loading={props.loading} disabled={props.disabled} onClick={click}>
                {   isConnected ?  props.children : "Connect Wallet" }
            </LoadingButton>

            <ModalWrapper title={"Choose Wallet"} open={showOptions} handleClose={closeOptions}>
                <WalletOptions close={closeOptions}/>
            </ModalWrapper>
            
        </div>
    )

}

export default Web3btn