import Card from "../card"

const Hand = ({ identity }: { identity: string }) => {
    return (
        <div className={identity === "player" ? "relative h-1/3 top-2/3" : "relative h-1/3 bottom-1/3"}>
            <ul className="flex h-full px-60">
                <li className="relative flex-auto"><Card content="10" /></li>
                <li className="relative flex-auto"><Card content="J" /></li>
                <li className="relative flex-auto"><Card content="A" /></li>
                <li className="relative flex-auto"><Card content="A" /></li>
                {/* <li className="relative flex-auto"><Card content="A" /></li> */}
            </ul>
            {/* <ul className="absolute flex flex-col justify-between top-0 right-44 h-full py-20 text-white"> */}
            <ul className={"absolute flex flex-col " + (identity === "player" ? "justify-between " : "justify-center ") +  "top-0 right-44 h-full py-20 text-white"}>
                <li>Points: 0</li>
                { identity === "player" && <li className="cursor-pointer">Ask for cards</li> }
                { identity === "player" && <li className="cursor-pointer">Double down</li> }
                { identity === "player" && <li className="cursor-pointer">Admit defeat</li> }
            </ul>
        </div>
    )
}

export default Hand