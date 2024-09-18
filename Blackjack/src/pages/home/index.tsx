import { useState } from "react";

import Card from "../../components/card";
import Hand from "../../components/hand";

const Home = () => {
    const [play, setPlay] = useState<boolean>(false)
    const [playerOver, setPlayerOver] = useState<boolean>(false)
    const [playerPoints, setPlayerPoints] = useState<number>(0)
    const [gameOver, setGameOver] = useState<boolean>(false)

    const startGame = () => {
        setPlay(true)
        setPlayerOver(false)
        setPlayerPoints(0)
        setGameOver(false)
    }

    return (
        <>
            <Card content="?" playing={play} startGame={startGame} />
            {
                play
                &&
                <>
                    <Hand identity="player" playerOver={playerOver} setPlayerOver={setPlayerOver} setPlayerPoints={setPlayerPoints} />
                    <Hand identity="enemy" playerOver={playerOver} playerPoints={playerPoints} gameOver={gameOver} setGameOver={setGameOver} />
                </>
            }
        </>
    )
};

export default Home;
