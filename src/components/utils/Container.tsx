import { ReactNode } from "react"

interface IProps {
    children: ReactNode,
}

const Container = (props: IProps) => {
 
    return (
        <section role="section" className={`w-full flex justify-center hero_gradient pb-20`}>
            <div aria-label="container" className={`min-h-screen justify-center w-full flex flex-wrap py-2 lg:py-3 px-2 lg:px-40 2xl:container`}>
                {props.children}
            </div>
        </section>
    )
}

export default Container