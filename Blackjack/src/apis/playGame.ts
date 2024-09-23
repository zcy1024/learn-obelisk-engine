import {
    TransactionResult,
    NETWORK,
    PACKAGE_ID,
    WORLD_ID,
    PRIVATEKEY,
    loadMetadata,
    Obelisk,
    Transaction,
    WalletAccount
} from "./type"

type Props = {
    account: WalletAccount,
    bet: number
}

export default async function playGame({ account, bet }: Props) {
    const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
    const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
        secretKey: PRIVATEKEY
    })
    const tx = new Transaction();
    const world = tx.object(WORLD_ID);
    const random = tx.object("0x8")
    const tx_bet = tx.pure.u128(bet)
    const player = tx.pure.address(account.address)
    const params = [world, random, tx_bet, player];
    (await obelisk.tx.blackjack_system.play_game(tx, params, undefined, true)) as TransactionResult;
    await obelisk.signAndSendTxn(tx);
}