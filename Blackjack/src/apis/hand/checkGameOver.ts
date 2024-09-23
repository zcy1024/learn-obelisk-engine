import { Dispatch, SetStateAction } from "react"

import calPoints from "./calPoints"

type Props = {
    identity: string,
    playerOver: boolean,
    gameOver: string,
    cards: string[],
    playerPoints: number,
    setGameOver: Dispatch<SetStateAction<string>>
}

export default function checkGameOver({ identity, playerOver, gameOver, cards, playerPoints, setGameOver }: Props) {
    if (identity === "player" || playerOver === false || gameOver)
        return true
    const points = calPoints(cards)
    if (points > playerPoints || playerPoints >= 21) {
        if (playerPoints > 21)
            setGameOver("LOSE")
        else if (playerPoints === points)
            setGameOver("DRAW")
        else if (points > 21)
            setGameOver("WIN")
        else
            setGameOver(playerPoints > points ? "WIN" : "LOSE")
        return true
    }
    if (points === playerPoints && 21 - points <= 5) {
        const dx = 21 - points
        if (Math.random() * (dx + 1) <= dx / 2) {
            setGameOver("DRAW")
            return true
        }
    }
    return false
}