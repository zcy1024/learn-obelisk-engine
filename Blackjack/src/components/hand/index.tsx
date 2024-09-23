import { useEffect, useState, Dispatch, SetStateAction, useContext } from "react"

import { NETWORK, PACKAGE_ID, WORLD_ID } from '../../chain/config';
import { loadMetadata, Obelisk, Transaction, TransactionResult } from '@0xobelisk/sui-client';
import { useCurrentAccount } from "@mysten/dapp-kit";
import { PRIVATEKEY } from "../../chain/key";

import Card from "../card"
import { Mask } from "../../pages";

function dfs(index: number, point: number, cards: string[]): number[] {
    if (index === cards.length)
        return [point]
    if (cards[index] === "A") {
        const res = dfs(index + 1, point + 1, cards)
        return res.concat(dfs(index + 1, point + 11, cards))
    }
    if (cards[index] === "J" || cards[index] === "Q" || cards[index] === "K")
        return dfs(index + 1, point + 10, cards)
    if (cards[index] === "*")
        return dfs(index + 1, point, cards)
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
    gameOver?: string,
    setGameOver?: Dispatch<SetStateAction<string>>,
    bet?: number
}

const Hand = ({ identity, playerOver, setPlayerOver, playerPoints, setPlayerPoints, gameOver, setGameOver, bet }: Props) => {
    const account = useCurrentAccount()

    const [cards, setCards] = useState<string[]>([])
    const [points, setPoints] = useState<number>(0)
    const setIsMasked = useContext(Mask)

    const pointToCard = (point: number) => {
        if (point === 11)
            return "J"
        if (point === 12)
            return "Q"
        if (point === 13)
            return "K"
        if (point === 1)
            return "A"
        if (point === 0)
            return "*"
        return point.toString()
    }

    const refreshCards = async () => {
        const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
        const obelisk = new Obelisk({
            networkType: NETWORK,
            packageId: PACKAGE_ID,
            metadata: metadata,
        })
        // 0: enemy
        // 1: player
        // 2: bet
        let res = await obelisk.getEntity(WORLD_ID, "game", account.address)
        if (identity === "player")
            setCards(res[1].map((point: number) => pointToCard(point)))
        else
            setCards(res[0].reverse().map((point: number) => pointToCard(point)))

        setIsMasked(false)
    }

    useEffect(() => {
        setIsMasked(true)
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

        const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
        const obelisk = new Obelisk({
            networkType: NETWORK,
            packageId: PACKAGE_ID,
            metadata: metadata,
            secretKey: PRIVATEKEY
        })
        const tx = new Transaction();
        const world = tx.object(WORLD_ID);
        const tx_identity = tx.pure.string(identity)
        const random = tx.object("0x8")
        const player = tx.pure.address(account.address)
        const params = [world, tx_identity, random, player];
        (await obelisk.tx.blackjack_system.ran_card(tx, params, undefined, true)) as TransactionResult;
        const response = await obelisk.signAndSendTxn(tx);
        if (response.effects.status.status == 'success')
            refreshCards()
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
        if (identity === "player" || playerOver === false || gameOver)
            return
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
            return
        }
        if (points === playerPoints && 21 - points <= 5) {
            const dx = 21 - points
            if (Math.random() * (dx + 1) <= dx / 2) {
                setGameOver("DRAW")
                return
            }
        }
        enemyTurn()
    }, [playerOver, cards])

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
                        <li className={playerOver === false ? "cursor-pointer" : ""}>Admit defeat</li>
                        <li className={playerOver === false ? "cursor-pointer" : ""} onClick={over}>Over</li>
                    </>
                }
            </ul>
        </div>
    )
}

export default Hand