import { useAppSelector } from "../../store";

const Home = () => {
    const suikemonData = useAppSelector(state => state.suikemon.suikemonData)
    return (
        <div>
            home
            {suikemonData.get("1009")}
        </div>
    );
};

export default Home;