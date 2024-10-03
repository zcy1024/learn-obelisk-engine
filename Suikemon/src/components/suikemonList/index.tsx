import { useState, useContext, useEffect } from "react";
import { useAppSelector } from "../../store";
import Confirm, { Props as ConfirmData } from "../confirm";
import Loading from "../loading";
import { IsLoading } from "../../pages/_app";
import { suikemonType, tradingType } from "../../store/modules/suikemon";
import suikemonData from "../../data/data"
import Congratulation from "../congratulation";
import { useCurrentAccount } from "@mysten/dapp-kit";

const starPosition = [["left-1/4", "top-1/4"], ["left-1/4", "bottom-1/4"], ["right-1/4", "top-1/4"], ["right-1/4", "bottom-1/4"]]

export default function SuikemonList() {
    const showType = useAppSelector(state => state.suikemon.pageShowType)
    const data = useAppSelector(state => {
        if (showType === "Home")
            return state.suikemon.backpack
        if (showType === "Trading Place")
            return state.suikemon.trading
        return state.suikemon.collection.toSorted((a, b) => {
            if (a.suikemonID !== b.suikemonID)
                return Number(a.suikemonID) - Number(b.suikemonID)
            return a.shiny ? 1 : -1
        })
    })

    const [isLoading, setIsLoading] = useContext(IsLoading)

    const [confirmData, setConfirmData] = useState<ConfirmData>({
        type: "hidden",
        index: "",
        shiny: false,
        stock: "",
        sprite_icon: "",
        clearConfirm: () => { },
        setIsLoading: null,
        unit_price: 0,
        index_in_trading_place: -1,
        seller: ""
    })

    const clearConfirm = () => {
        setConfirmData({
            ...confirmData,
            type: "hidden"
        })
    }
    const handlerClick = (index: string, shiny: boolean, stock: string, sprite_icon: string, unit_price: number, index_in_trading_place: number, seller: string) => {
        setConfirmData({ type: (showType === "Home" ? "sell" : "buy"), index, shiny, stock, sprite_icon, clearConfirm, setIsLoading, unit_price, index_in_trading_place, seller })
    }

    const [showCongratulation, setShowCongratulation] = useState<boolean>(false)
    const congratulationInfo = useAppSelector(state => state.suikemon.congratulationInfo)
    useEffect(() => {
        const new_suikemon_id = congratulationInfo.suikemonID
        setShowCongratulation(new_suikemon_id !== "")
    }, [congratulationInfo])

    const account = useCurrentAccount()

    return (
        <>
            <div className="flex flex-wrap gap-12 pt-28 pb-4 inset-x-0 px-4 sm:px-6 lg:px-8 xl:px-24 2xl:px-56 mx-auto transition-all duration-700 ease-in-out after:flex-1">
                {data.map((suikemon: suikemonType | tradingType, index_in_trading_place: number) => {
                    const isSuikemonType = (suikemon: suikemonType | tradingType): suikemon is suikemonType => {
                        return !!(suikemon as suikemonType).suikemonID
                    }

                    const [index, chinese, japanese, detail, sprite_icon] = suikemonData.get(isSuikemonType(suikemon) ? suikemon.suikemonID : suikemon.suikemon.suikemonID)
                    return (
                        <div className="relative flex justify-around items-center h-[17rem] w-[12.5rem] text-center group overflow-hidden" key={index + (isSuikemonType(suikemon) ? suikemon.shiny : suikemon.suikemon.shiny)}>
                            <div className="relative flex flex-col justify-between items-center h-48 w-48 cursor-pointer rounded-full group-hover:ring transition-all duration-700 ease-in-out" onClick={() => window.open(detail, '_blank', 'noopener,noreferrer')}>
                                <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-gradient-to-t from-yellow-300 opacity-30"></div>
                                <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-gradient-to-b from-blue-300 opacity-60"></div>

                                {(isSuikemonType(suikemon) ? suikemon.shiny : suikemon.suikemon.shiny) && starPosition.map(pos => (
                                    <div className={`absolute ${pos[0]} ${pos[1]} rounded-full animate-ping bg-transparent opacity-80 z-10`} key={pos.join(" ")}>
                                        <svg className="h-2.5 w-2.5">
                                            <polygon points="5,0.5 2,9.9 9.5,3.9 0.5,3.9 8,9.9"
                                                style={{ fill: "yellow", stroke: "skyblue", strokeWidth: "0.4", fillRule: "evenodd" }} />
                                            Sorry, your browser does not support inline SVG.
                                        </svg>
                                    </div>
                                ))}

                                <span className={((isSuikemonType(suikemon) ? suikemon.shiny : suikemon.suikemon.shiny) ? "sprite-icon-shiny " : "sprite-icon ") + `${sprite_icon} scale-[2.5]`}></span>
                                <div className="font-medium leading-7 tracking-wider text-blue-500 group-hover:text-blue-200 transition-all duration-700 ease-in-out">
                                    <p>#{index}</p>
                                    <p>{chinese}</p>
                                    <p>{japanese}</p>
                                </div>
                            </div>
                            {
                                showType !== "Collection Map"
                                &&
                                <div className="absolute flex flex-col justify-evenly items-center h-[40%] w-full top-full rounded-full opacity-0 bg-transparent text-transparent group-hover:top-1/2 group-hover:opacity-60 group-hover:bg-gray-400 group-hover:text-yellow-400 transition-all duration-700 ease-in-out">
                                    <p>Number: {isSuikemonType(suikemon) ? suikemon.number : suikemon.stock}</p>
                                    { !isSuikemonType(suikemon) &&  <p>Price: {suikemon.price}</p> }
                                    { isSuikemonType(suikemon) && showType === "Home" && <button className="rounded-full hover:scale-125 transition-transform duration-700 ease-in-out" onClick={() => handlerClick(index, suikemon.shiny, suikemon.number, sprite_icon, 0, -1, "")}>Trading</button> }
                                    { !isSuikemonType(suikemon) &&
                                        <button className="rounded-full hover:scale-125 transition-transform duration-700 ease-in-out" onClick={() => handlerClick(index, suikemon.suikemon.shiny, suikemon.stock, sprite_icon, Number(suikemon.price), index_in_trading_place, suikemon.seller)}>
                                        {
                                            account && account.address.slice(2) !== suikemon.seller &&
                                            <span>BUY</span> ||
                                            <span>REDEEM</span>
                                        }
                                        </button>
                                    }
                                </div>
                            }
                        </div>
                    )
                })}
            </div>
            <Confirm type={confirmData.type} index={confirmData.index} shiny={confirmData.shiny} stock={confirmData.stock} sprite_icon={confirmData.sprite_icon} clearConfirm={confirmData.clearConfirm} setIsLoading={confirmData.setIsLoading} unit_price={confirmData.unit_price} index_in_trading_place={confirmData.index_in_trading_place} seller={confirmData.seller} />
            <Congratulation show={showCongratulation} index={congratulationInfo.suikemonID} shiny={congratulationInfo.shiny} />
            {isLoading && <Loading />}
        </>
    )
}