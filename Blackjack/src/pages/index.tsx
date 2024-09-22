import type { NextPage } from 'next';
import Home from "./home";

import Heads from "../components/head";
import Header from "../components/header";

import { useState, createContext, Dispatch, SetStateAction } from "react";

export const Balance = createContext<[number, Dispatch<SetStateAction<number>>]>(null)

const IndexPage: NextPage = () => {
    const [balance, setBalance] = useState<number>(0)

    return (
        <main className="h-screen w-screen bg-black select-none" style={{opacity: "0.86"}}>
            <Balance.Provider value={[balance, setBalance]}>
                <Heads />
                <Header />
                <Home />
            </Balance.Provider>
        </main>
    )
}

export default IndexPage


