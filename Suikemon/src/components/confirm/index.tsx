import { useState, ChangeEvent, useRef, useEffect, Dispatch, SetStateAction, useDebugValue } from "react"
import { sell } from "../../apis"
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../store"
import { refreshAll } from "../../store/modules/suikemon"

export type Props = {
    type: string,
    index: string,
    shiny: boolean,
    stock: string,
    sprite_icon: string,
    clearConfirm: () => void,
    setIsLoading: Dispatch<SetStateAction<boolean>>
}

export default function Confirm({ type, index, shiny, stock, sprite_icon, clearConfirm, setIsLoading }: Props) {
    const [price, setPrice] = useState<string>("")
    const [number, setNumber] = useState<string>("")
    const [tip, setTip] = useState<boolean>(false)
    const handlerPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTip(false)
        let cur_num = e.target.value
        for (let i = 0; i < cur_num.length; i++)
            if (cur_num[i] < '0' || cur_num[i] > '9')
                return
        if (Number(cur_num) < 0) {
            setTip(true)
            return
        }
        while (cur_num.length > 1 && cur_num[0] === '0')
            cur_num = cur_num.slice(1)
        setPrice(cur_num)
    }
    const handlerNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTip(false)
        let cur_num = e.target.value
        for (let i = 0; i < cur_num.length; i++)
            if (cur_num[i] < '0' || cur_num[i] > '9')
                return
        if (Number(cur_num) < 0 || Number(cur_num) > Number(stock)) {
            setTip(true)
            return
        }
        while (cur_num.length > 1 && cur_num[0] === '0')
            cur_num = cur_num.slice(1)
        setNumber(cur_num)
    }

    const priceRef = useRef<HTMLInputElement>()
    const numberRef = useRef<HTMLInputElement>()

    useEffect(() => {
        if (type === "hidden")
            return
        priceRef.current.focus()
    }, [type])

    const disappear = () => {
        setPrice("")
        setNumber("")
        setTip(false)
        clearConfirm()
    }

    const account = useCurrentAccount()
    const dispatch = useDispatch<AppDispatch>()
    const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction()
    const handlerOnClick = async () => {
        if (price === "" || Number(price) < 100) {
            priceRef.current.focus()
            setTip(true)
            return
        }
        if (number === "") {
            numberRef.current.focus()
            setTip(true)
            return
        }
        setIsLoading(true)
        await sell({ suikemon: index, is_shiny: shiny, sell_number: number, sell_price: price, signAndExecuteTransaction })
        dispatch(refreshAll(account))
        disappear()
        setIsLoading(false)
    }

    return (
        <div className={"fixed top-0 " + (type === "hidden" ? "left-full " : "left-0 ") + "h-screen w-screen text-center z-[60] transition-all duration-700 ease-in-out"}>
            <div className="h-full w-full bg-black opacity-20" onClick={disappear}></div>
            <div className="absolute flex flex-col justify-between items-center h-[48%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className={(shiny ? "sprite-icon-shiny " : "sprite-icon ") + `${sprite_icon} scale-[6.6]`}></span>
                <div className="flex flex-col justify-between items-center gap-6">
                    <div className="flex justify-between w-52 rounded-full bg-gradient-to-tr from-yellow-300 to-blue-500 opacity-60">
                        <span className="ml-2 text-indigo-600">Sales price:</span>
                        <input className="pr-2 ml-2 w-20 outline-0 bg-transparent" value={price} onChange={handlerPriceChange} ref={priceRef} />
                    </div>
                    <div className="flex justify-between w-52 rounded-full bg-gradient-to-tr from-yellow-300 to-blue-500 opacity-60">
                        <span className="ml-2 text-indigo-600">{type === "buy" ? "Purchase quantity:" : "Sales quantity:"}</span>
                        <input className="pr-2 ml-2 w-20 outline-0 bg-transparent" value={number} onChange={handlerNumberChange} ref={numberRef} />
                    </div>
                    <button className="py-1 px-2 rounded-full font-medium tracking-wider bg-yellow-100 text-blue-500 hover:bg-blue-200 hover:text-yellow-500 active:scale-90 transition-colors duration-700 ease-in-out" onClick={handlerOnClick}>Confirm</button>
                    <span className={(tip ? "opacity-100 " : "opacity-0 ") + "text-red-600 transition-opacity duration-700 ease-in-out"}>The price cannot be less than 100 and the quantity cannot exceed {stock}!</span>
                </div>
            </div>
        </div>
    )
}