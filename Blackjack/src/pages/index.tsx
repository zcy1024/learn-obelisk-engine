import type { NextPage } from 'next';
import Home from "./home";

import Heads from "../components/head";
import Header from "../components/header";

const IndexPage: NextPage = () => {
    return (
        <main className="h-screen w-screen bg-black " style={{opacity: "0.86"}}>
            <Heads />
            <Header />
            <Home />
        </main>
    )
}

export default IndexPage


