import { useEffect, useContext } from "react"

import { NETWORK, PACKAGE_ID, WORLD_ID } from '../../chain/config';
import { loadMetadata, Obelisk, Transaction, TransactionResult } from '@0xobelisk/sui-client';
import { useCurrentAccount } from "@mysten/dapp-kit";
import { PRIVATEKEY } from "../../chain/key";

import { Balance, Mask } from "../../pages";

let boundary = 666666

const Settlement = ({ result, oneMoreRound, bet }: { result: string, oneMoreRound: () => void, bet: number }) => {
    const account = useCurrentAccount()
    const [balance, setBalance] = useContext(Balance)
    const setIsMasked = useContext(Mask)

    const getResultColor = () => {
        if (result === "LOSE")
            return "text-red-600"
        if (result === "WIN")
            return "text-green-600"
        return ""
    }

    const refreshBalance = async () => {
        const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
        const obelisk = new Obelisk({
            networkType: NETWORK,
            packageId: PACKAGE_ID,
            metadata: metadata,
        })
        let res = await obelisk.getEntity(WORLD_ID, "player", account.address)
        setBalance(res ? Number(res[0]) : 0)
        setIsMasked(false)
        boundary = 666666
    }

    const betSettlement = async () => {
        if (result === "DRAW")
            return

        const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
        const obelisk = new Obelisk({
            networkType: NETWORK,
            packageId: PACKAGE_ID,
            metadata: metadata,
            secretKey: PRIVATEKEY
        })
        const tx = new Transaction();
        const world = tx.object(WORLD_ID);
        const add = tx.pure.bool(result === "WIN")
        const tx_bet = tx.pure.u128(bet)
        const player = tx.pure.address(account.address)
        const params = [world, add, tx_bet, player];
        (await obelisk.tx.blackjack_system.settlement(tx, params, undefined, true)) as TransactionResult;
        const response = await obelisk.signAndSendTxn(tx);
        if (response.effects.status.status == 'success')
            refreshBalance()
    }

    useEffect(() => {
        setIsMasked(true)
        boundary = 666666 * 2
        betSettlement()
    }, [])

    return (
        <div className="absolute flex flex-col justify-between content-between left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 h-44 text-center text-white font-mono bg-black ">
            <h3 className={"text-4xl " + getResultColor()}>{result}</h3>
            <p className="text-xl">Profit/Deficit: 1000000000</p>
            <button className="animate-bounce w-36 bg-sky-500/75 self-center rounded-lg" onClick={() => balance >= boundary ? oneMoreRound() : {}}>One More Round</button>
        </div>
    )
}

export default Settlement