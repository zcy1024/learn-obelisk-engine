import type { NextPage } from 'next';
import Home from "./home";

import Heads from "../components/head";
import Header from "../components/header";

import { useState, createContext, Dispatch, SetStateAction, useEffect } from "react";
import { NETWORK, PACKAGE_ID, WORLD_ID } from '../chain/config';
import { loadMetadata, Obelisk, Transaction } from '@0xobelisk/sui-client';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';

export const Balance = createContext<[number, Dispatch<SetStateAction<number>>]>(null)
export const Mask = createContext<Dispatch<SetStateAction<boolean>>>(null)

const IndexPage: NextPage = () => {
    const account = useCurrentAccount()
    const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction()

    const [balance, setBalance] = useState<number>(0)
    const [isMasked, setIsMasked] = useState<boolean>(false)
    const [isNewUser, setIsNewUser] = useState<boolean>(true)

    const checkNewUser = async () => {
        const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
        const obelisk = new Obelisk({
            networkType: NETWORK,
            packageId: PACKAGE_ID,
            metadata: metadata,
        })
        let res = await obelisk.getEntity(WORLD_ID, "player", account.address)
        // new user
        if (!res) {
            const tx = new Transaction()
            const world = tx.object(WORLD_ID)
            const params = [world]
            await obelisk.tx.blackjack_system.register(tx, params, undefined, true)
            await signAndExecuteTransaction(
                {
                    transaction: tx,
                    chain: `sui:${NETWORK}`
                },
                {
                    onSuccess: async () => {
                        res = await obelisk.getEntity(WORLD_ID, "player", account.address)
                        setBalance(res ? Number(res[0]) : 0)
                        setIsNewUser(false)
                    }
                }
            )
        } else {
            setIsNewUser(false)
        }
    }

    useEffect(() => {
        if (account)
            checkNewUser()
    }, [account])

    return (
        <main className="h-screen w-screen bg-black select-none" style={{ opacity: "0.86" }}>
            <Balance.Provider value={[balance, setBalance]}>
                <Mask.Provider value={setIsMasked}>
                    <Heads />
                    <Header isNewUser={isNewUser} />
                    <Home isNewUser={isNewUser} />
                </Mask.Provider>
            </Balance.Provider>
            {
                isMasked
                &&
                <div className="fixed w-full h-full z-50 ">
                    <div className='fixed left-2/4 top-2/4 -translate-x-1/4 -translate-y-3/4 '>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
            }
        </main>
    )
}

export default IndexPage


