import { isAddress } from "ethers"
import { useEffect, useState } from "react"

type Verification = "text" | "slug" | "username" | "address"

const useInput = (verification: Verification, minLength?: number, initial?: string | number) => {

    const [value, setValue] = useState<string | number>(initial || "")
    const [errorWarning, setErrorWarning] = useState(false)
    const [onFocus, setOnFocus] = useState(false)
    const [error, setError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    useEffect(() => {

        switch (verification) {
            case "address":
                if (!isAddress(value)) {
                    setError(true)
                    setErrorMessage(`Too short, should contain atleast ${minLength} characters`)
                } else {
                    setError(false)
                    setErrorMessage("")
                }
                break
            case "text":
                if ((value as string)?.length < Number(minLength)) {
                    setError(true)
                    setErrorMessage(`Too short, should contain atleast ${minLength} characters`)
                } else {
                    setError(false)
                    setErrorMessage("")
                }
                break
            case "slug":
                if ((value as string)?.length < Number(minLength) || (value as string)?.includes(" ")) {
                    setError(true)
                    setErrorMessage(`No white space and should contain atleast ${minLength} characters`)
                } else {
                    setError(false)
                    setErrorMessage("")
                }
                break
            case "username":
                if (String(value).length < 4) {
                    setError(true)
                    setErrorMessage("Too short must be atleast 4 characters")
                } else if (!(value as string)?.match(/^[A-Za-z0-9]+/)) {
                    setError(true)
                    setErrorMessage("No white space or special Characters allowed")
                } else {
                    setError(false)
                    setErrorMessage("")
                }
                break
            default:
                console.error("")

        }

    }, [value, verification, minLength])

    useEffect(() => {
        if (error && onFocus) {
            setErrorWarning(true)
        } else {
            setErrorWarning(false)
        }
    }, [error, onFocus])

    return { setValue, setError, setErrorMessage, setOnFocus,  value, error, errorMessage, errorWarning}
}

export default useInput