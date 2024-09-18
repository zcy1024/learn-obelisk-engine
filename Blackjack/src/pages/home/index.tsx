import { useState } from "react";

import Card from "../../components/card";
import Hand from "../../components/hand";

const Home = () => {
    const [play, setPlay] = useState<boolean>(false)
    const [ranCard, setRanCard] = useState<boolean>(false)

    return (
        <>
            <Card content="?" setPlay={setPlay} />
            {
                play
                &&
                <>
                    <Hand identity="player" ranCard={ranCard} setRanCard={setRanCard} />
                    <Hand identity="enemy" ranCard={ranCard} setRanCard={setRanCard} />
                </>
            }
        </>
    )
};

export default Home;
