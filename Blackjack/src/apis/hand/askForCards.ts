import {
    Dispatch,
    SetStateAction,
    TransactionResult,
    NETWORK,
    PACKAGE_ID,
    WORLD_ID,
    PRIVATEKEY,
    loadMetadata,
    Obelisk,
    Transaction,
    WalletAccount,
} from "../type"

import refreshCards from "./refreshCards"

type Props = {
    account: WalletAccount,
    setCards: Dispatch<SetStateAction<string[]>>,
    identity: string
}

export default async function askForCards({ account, setCards, identity }: Props) {
    const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
    const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
        secretKey: PRIVATEKEY
    })
    const tx = new Transaction();
    const world = tx.object(WORLD_ID);
    const tx_identity = tx.pure.string(identity)
    const random = tx.object("0x8")
    const player = tx.pure.address(account.address)
    const params = [world, tx_identity, random, player];
    (await obelisk.tx.blackjack_system.ran_card(tx, params, undefined, true)) as TransactionResult;
    const response = await obelisk.signAndSendTxn(tx);
    if (response.effects.status.status == 'success')
        await refreshCards({ account, setCards, identity })
}