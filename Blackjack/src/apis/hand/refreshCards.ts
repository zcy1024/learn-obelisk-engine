import {
    Dispatch,
    SetStateAction,
    NETWORK,
    PACKAGE_ID,
    WORLD_ID,
    loadMetadata,
    Obelisk,
    WalletAccount,
} from "../type"

import pointToCard from "./pointToCard"

type Props = {
    account: WalletAccount,
    setCards: Dispatch<SetStateAction<string[]>>,
    identity: string
}

export default async function refreshCards({ account, setCards, identity }: Props) {
    const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
    const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
    })
    // 0: enemy
    // 1: player
    // 2: bet
    let res = await obelisk.getEntity(WORLD_ID, "game", account.address)
    if (identity === "player")
        setCards(res[1].map((point: number) => pointToCard(point)))
    else
        setCards(res[0].reverse().map((point: number) => pointToCard(point)))
}