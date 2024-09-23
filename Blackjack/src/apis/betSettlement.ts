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

type Props = {
    account: WalletAccount,
    result: string,
    bet: number,
    setBalance: Dispatch<SetStateAction<number>>
}

export default async function betSettlement({ account, result, bet, setBalance }: Props) {
    const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
    const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
        secretKey: PRIVATEKEY
    })
    const tx = new Transaction();
    const world = tx.object(WORLD_ID);
    const tx_balance = await obelisk.getEntity(WORLD_ID, "player", account.address)
    const add = tx.pure.bool(true)
    const tx_bet = tx.pure.u128(result === "WIN" ? bet * 2 : bet)
    const player = tx.pure.address(account.address)
    const params = [world, add, tx_bet, player];
    (await obelisk.tx.blackjack_system.settlement(tx, params, undefined, true)) as TransactionResult;
    const response = await obelisk.signAndSendTxn(tx);
    if (response.effects.status.status == 'success')
        setBalance(Number(tx_balance[0]) + (result === "WIN" ? bet * 2 : bet))
}