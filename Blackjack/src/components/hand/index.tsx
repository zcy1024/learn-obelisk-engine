import { useEffect, useState, Dispatch, SetStateAction } from "react"

import Card from "../card"

function dfs(index: number, point: number, cards: string[]): number[] {
    if (index === cards.length)
        return [point]
    if (cards[index] === "A") {
        const res = dfs(index + 1, point + 1, cards)
        return res.concat(dfs(index + 1, point + 11, cards))
    }
    if (cards[index] === "J" || cards[index] === "Q" || cards[index] === "K")
        return dfs(index + 1, point + 10, cards)
    return dfs(index + 1, point + Number(cards[index]), cards)
}

function calPoints(cards: string[]): number {
    if (cards.length === 0)
        return 0
    const points = dfs(0, 0, cards)
    const sorted = points.sort((a, b) => b - a)
    let res = sorted[0]
    let index = 1
    while (res > 21 && index < sorted.length) {
        if (sorted[index] > 21) {
            index++
            continue
        }
        res = sorted[index]
        break
    }
    return res
}

type Props = {
    identity: string,
    playerOver?: boolean,
    setPlayerOver?: Dispatch<SetStateAction<boolean>>,
    playerPoints?: number,
    setPlayerPoints?: Dispatch<SetStateAction<number>>,
    gameOver?: boolean,
    setGameOver?: Dispatch<SetStateAction<boolean>>
}

const Hand = ({ identity, playerOver, setPlayerOver, playerPoints, setPlayerPoints, gameOver, setGameOver }: Props) => {
    const [cards, setCards] = useState<string[]>([])
    const [points, setPoints] = useState<number>(0)

    const randomCard = () => {
        const point = Math.round(Math.random() * 15)
        if (point >= 1 && point <= 10)
            return point.toString()
        if (point === 11)
            return "J"
        if (point === 12)
            return "Q"
        if (point === 13)
            return "K"
        if (point === 14)
            return "A"
        return randomCard()
    }

    useEffect(() => {
        setCards([randomCard(), randomCard()])
    }, [])

    useEffect(() => {
        setPoints(calPoints(cards))
        // TODO: player身份抽爆了直接over()
        // TODO: 21点直接over
    }, [cards])

    const askForCards = () => {
        setCards([
            ...cards,
            randomCard()
        ])
    }

    const over = () => {
        setPlayerOver(true)
        setPlayerPoints(points)
    }

    function delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    const enemyTurn = async () => {
        // TODO: 21点判断
        // TODO: check playerPoints => 爆了直接判负
        await delay(666)
        askForCards()
        // TODO: equal
        // TODO: over? over then 21?
    }

    useEffect(() => {
        if (identity === "player" || playerOver === false || calPoints(cards) > playerPoints)
            return
        enemyTurn()
    }, [playerOver, cards])

    return (
        <div className={identity === "player" ? "relative h-1/3 top-2/3" : "relative h-1/3 bottom-1/3"}>
            <ul className="flex h-full px-60">
                {
                    cards.map(card => <li className="relative flex-auto" key={new Date().getTime().toString() + Math.random().toString()}><Card content={card} /></li>)
                }
            </ul>
            <ul className={"absolute flex flex-col " + (identity === "player" ? "justify-between " : "justify-center ") +  "top-0 right-44 h-full py-10 text-white"}>
                <li>Points: {points}</li>
                {
                    identity === "player"
                    &&
                    <>
                        <li>Bet: 0</li>
                        <li className={playerOver === false ? "cursor-pointer" : ""} onClick={() => playerOver === false ? askForCards() : {}}>Ask for cards</li>
                        <li className={playerOver === false ? "cursor-pointer" : ""}>Double down</li>
                        <li className={playerOver === false ? "cursor-pointer" : ""}>Admit defeat</li>
                        <li className={playerOver === false ? "cursor-pointer" : ""} onClick={over}>Over</li>
                    </>
                }
            </ul>
        </div>
    )
}

export default Hand