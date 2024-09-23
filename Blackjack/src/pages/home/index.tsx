import { useEffect, useState, useContext } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import Card from "../../components/card";
import Hand from "../../components/hand";
import Settlement from "../../components/settlement";
import { Balance, Mask } from "..";
import { deposit } from "../../apis";

const Home = ({ isNewUser }: { isNewUser: boolean }) => {
    const account = useCurrentAccount()

    const [play, setPlay] = useState<boolean>(false)
    const [playerOver, setPlayerOver] = useState<boolean>(false)
    const [playerPoints, setPlayerPoints] = useState<number>(0)
    const [gameOver, setGameOver] = useState<string>("")
    const bet = 666666
    const [ready, setReady] = useState<boolean>(false)

    const [balance, setBalance] = useContext(Balance)
    const setIsMasked = useContext(Mask)

    const startGame = async () => {
        if (isNewUser || !ready)
            return
        setIsMasked(true)
        setPlayerOver(false)
        setPlayerPoints(0)
        await deposit({ account, setBalance, bet })
        setPlay(true)
    }

    const oneMoreRound = async () => {
        setIsMasked(true)
        setReady(balance >= bet)
        setPlay(false)
        setGameOver("")
        setIsMasked(false)
    }

    useEffect(() => {
        if (balance < bet)
            return
        if (!isNewUser && !play)
            setReady(true)
    }, [isNewUser, balance])

    return (
        <>
            <Card content="?" playing={play} startGame={startGame} />
            {
                play
                &&
                <>
                    <Hand identity="player" playerOver={playerOver} setPlayerOver={setPlayerOver} setPlayerPoints={setPlayerPoints} setGameOver={setGameOver} bet={bet} />
                    <Hand identity="enemy" playerOver={playerOver} setPlayerOver={setPlayerOver} playerPoints={playerPoints} gameOver={gameOver} setGameOver={setGameOver} />
                </>
            }
            { gameOver && <Settlement result={gameOver} oneMoreRound={oneMoreRound} bet={bet} /> }
        </>
    )
};

export default Home;
