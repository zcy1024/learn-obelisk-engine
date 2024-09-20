import { useState } from "react";

import Card from "../../components/card";
import Hand from "../../components/hand";
import Settlement from "../../components/settlement";

const Home = () => {
    const [play, setPlay] = useState<boolean>(false)
    const [playerOver, setPlayerOver] = useState<boolean>(false)
    const [playerPoints, setPlayerPoints] = useState<number>(0)
    const [gameOver, setGameOver] = useState<string>("")

    const startGame = () => {
        setPlay(true)
        setPlayerOver(false)
        setPlayerPoints(0)
    }

    const oneMoreRound = () => {
        setPlay(false)
        setGameOver("")
    }

    return (
        <>
            <Card content="?" playing={play} startGame={startGame} />
            {
                play
                &&
                <>
                    <Hand identity="player" playerOver={playerOver} setPlayerOver={setPlayerOver} setPlayerPoints={setPlayerPoints} setGameOver={setGameOver} />
                    <Hand identity="enemy" playerOver={playerOver} playerPoints={playerPoints} gameOver={gameOver} setGameOver={setGameOver} />
                </>
            }
            { gameOver && <Settlement result={gameOver} oneMoreRound={oneMoreRound} /> }
        </>
    )
};

export default Home;
