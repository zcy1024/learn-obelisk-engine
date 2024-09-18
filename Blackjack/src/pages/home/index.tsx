import Card from "../../components/card";
import Hand from "../../components/hand";

const Home = () => {
    return (
        <>
            <Card content="?" />
            <Hand identity="player" />
            <Hand identity="enemy" />
        </>
    )
};

export default Home;
