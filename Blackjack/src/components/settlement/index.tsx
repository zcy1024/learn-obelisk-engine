const Settlement = ({ result, oneMoreRound }: { result: string, oneMoreRound: () => void }) => {
    const getResultColor = () => {
        if (result === "LOSE")
            return "text-red-600"
        if (result === "WIN")
            return "text-green-600"
        return ""
    }

    return (
        <div className="absolute flex flex-col justify-between content-between left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 h-44 text-center text-white font-mono bg-black ">
            <h3 className={"text-4xl " + getResultColor()}>{result}</h3>
            <p className="text-xl">Profit/Deficit: 1000000000</p>
            <button className="animate-bounce w-36 bg-sky-500/75 self-center rounded-lg" onClick={oneMoreRound}>One More Round</button>
        </div>
    )
}

export default Settlement