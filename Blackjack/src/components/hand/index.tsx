import { useEffect, useState, Dispatch, SetStateAction, useContext } from "react"
import { useCurrentAccount } from "@mysten/dapp-kit";
import Card from "../card"
import { Mask } from "../../pages";
import { calPoints, refreshCards as tx_refreshCards, askForCards as tx_askForCards, checkGameOver } from "../../apis";

type Props = {
    identity: string,
    playerOver?: boolean,
    setPlayerOver?: Dispatch<SetStateAction<boolean>>,
    playerPoints?: number,
    setPlayerPoints?: Dispatch<SetStateAction<number>>,
    gameOver?: string,
    setGameOver?: Dispatch<SetStateAction<string>>,
    bet?: number
}

const Hand = ({ identity, playerOver, setPlayerOver, playerPoints, setPlayerPoints, gameOver, setGameOver, bet }: Props) => {
    const account = useCurrentAccount()

    const [cards, setCards] = useState<string[]>([])
    const [points, setPoints] = useState<number>(0)
    const setIsMasked = useContext(Mask)

    const refreshCards = async () => {
        await tx_refreshCards({ account, setCards, identity })
        setIsMasked(false)
    }

    useEffect(() => {
        refreshCards()
    }, [])

    useEffect(() => {
        const points = calPoints(cards)
        setPoints(points)
        if (points >= 21)
            over()
    }, [cards])

    const askForCards = async () => {
        setIsMasked(true)
        await tx_askForCards({ account, setCards, identity })
        setIsMasked(false)
    }

    const over = () => {
        if (identity === "player")
            setPlayerPoints(calPoints(cards))
        setPlayerOver(true)
    }

    const enemyTurn = async () => {
        if (gameOver)
            return
        await askForCards()
    }

    useEffect(() => {
        if (checkGameOver({ identity, playerOver, gameOver, cards, playerPoints, setGameOver }))
            return
        enemyTurn()
    }, [playerOver, cards])

    const admitDefeat = () => {
        setGameOver("LOSE")
        setPlayerOver(true)
    }

    return (
        <div className={identity === "player" ? "relative h-1/3 top-2/3" : "relative h-1/3 bottom-1/3"}>
            <ul className="flex h-full px-60">
                {
                    cards.map(card => <li className="relative flex-auto" key={new Date().getTime().toString() + Math.random().toString()}><Card content={card} /></li>)
                }
            </ul>
            <ul className={"absolute flex flex-col " + (identity === "player" ? "justify-between " : "justify-center ") + "top-0 right-44 h-full py-10 text-white"}>
                <li>Points: {points}</li>
                {
                    identity === "player"
                    &&
                    <>
                        <li>Bet: {bet}</li>
                        <li className={playerOver === false ? "cursor-pointer" : ""} onClick={() => playerOver === false ? askForCards() : {}}>Ask for cards</li>
                        <li className={playerOver === false ? "cursor-pointer" : ""}>Double down</li>
                        <li className={playerOver === false ? "cursor-pointer" : ""} onClick={admitDefeat}>Admit defeat</li>
                        <li className={playerOver === false ? "cursor-pointer" : ""} onClick={over}>Over</li>
                    </>
                }
            </ul>
        </div>
    )
}

export default Hand