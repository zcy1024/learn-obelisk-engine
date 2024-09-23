import { useEffect, useContext } from "react"
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Balance, Mask } from "../../pages";
import { betSettlement as tx_betSettlement } from "../../apis";

let settlementFinished = false

const Settlement = ({ result, oneMoreRound, bet }: { result: string, oneMoreRound: () => void, bet: number }) => {
    const account = useCurrentAccount()
    const [_, setBalance] = useContext(Balance)
    const setIsMasked = useContext(Mask)

    const getResultColor = () => {
        if (result === "LOSE")
            return "text-red-600"
        if (result === "WIN")
            return "text-green-600"
        return ""
    }

    const betSettlement = async () => {
        await tx_betSettlement({ account, result, bet, setBalance })
        setIsMasked(false)
        settlementFinished = true
    }

    useEffect(() => {
        setIsMasked(true)
        settlementFinished = false
        betSettlement()
    }, [])

    return (
        <div className="absolute flex flex-col justify-between content-between left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 h-44 text-center text-white font-mono bg-black ">
            <h3 className={"text-4xl " + getResultColor()}>{result}</h3>
            <p className="text-xl">Profit/Deficit: 1000000000</p>
            <button className="animate-bounce w-36 bg-sky-500/75 self-center rounded-lg" onClick={oneMoreRound} disabled={!settlementFinished}>One More Round</button>
        </div>
    )
}

export default Settlement