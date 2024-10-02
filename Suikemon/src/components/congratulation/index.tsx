import { useState, useEffect } from "react"
import suikemonData from "../../data/data"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../store"
import { setCongratulation } from "../../store/modules/suikemon"

export type Props = {
    show: boolean,
    index: string,
    shiny: boolean
}

export default function Congratulation({ show, index, shiny }: Props) {
    const [spriteIcon, setSpriteIcon] = useState<string>("")
    const dispatch = useDispatch<AppDispatch>()

    function delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    async function sleep(ms: number) {
        await delay(ms)
        dispatch(setCongratulation({
            suikemonID: "",
            shiny
        }))
    }

    useEffect(() => {
        if (!show)
            return
        setSpriteIcon(suikemonData.get(index)[4])
        sleep(3000)
    }, [show])

    return (
        <div className={"fixed left-0 " + (show ? "bottom-0 " : "bottom-full ") + "h-screen w-screen text-center z-[60] transition-all duration-700 ease-in-out"}>
            <div className="h-full w-full bg-black opacity-20"></div>
            <div className="absolute flex flex-col justify-between items-center h-[36%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className={(shiny ? "sprite-icon-shiny " : "sprite-icon ") + `${spriteIcon} scale-[6.6]`}></span>
                <div className="flex flex-col justify-between items-center gap-1 font-bold tracking-widest text-yellow-300">
                    <span>#{index}</span>
                    <span>{index === "" ? "Chinese" : suikemonData.get(index)[1]}</span>
                    <span>{index === "" ? "English" : suikemonData.get(index)[2]}</span>
                </div>
            </div>
        </div>
    )
}