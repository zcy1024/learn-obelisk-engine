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
} from "./type"

import playGame from "./playGame"

type Props = {
    account: WalletAccount,
    setBalance: Dispatch<SetStateAction<number>>,
    bet: number
}

export default async function deposit({ account, setBalance, bet }: Props) {
    const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
    const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
        secretKey: PRIVATEKEY
    })
    const tx = new Transaction();
    const world = tx.object(WORLD_ID);
    const tx_balance = await obelisk.getEntity(WORLD_ID, "player", account.address);
    const add = tx.pure.bool(false)
    const tx_bet = tx.pure.u128(bet)
    const player = tx.pure.address(account.address)
    const params = [world, add, tx_bet, player];
    (await obelisk.tx.blackjack_system.settlement(tx, params, undefined, true)) as TransactionResult;
    const response = await obelisk.signAndSendTxn(tx);
    if (response.effects.status.status == 'success') {
        await playGame({ account, bet })
        setBalance(Number(tx_balance[0]) - bet)
    }
}