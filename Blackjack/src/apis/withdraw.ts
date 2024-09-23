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
    WalletAccount
} from "./type"

import getBalance from "./getBalance"

type Props = {
    account: WalletAccount,
    balance: number,
    setBalance: Dispatch<SetStateAction<number>>
}

export default async function withdraw({ account, balance, setBalance }: Props) {
    const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
    const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
        secretKey: PRIVATEKEY
    })

    const sui_balance = await obelisk.getBalance()
    while (Number(sui_balance.totalBalance) < balance + 100000000)
        await obelisk.requestFaucet()
    if (Number(sui_balance.totalBalance) < 1000000000)
        await obelisk.requestFaucet()

    const tx = new Transaction()
    const world = tx.object(WORLD_ID)
    const coin = tx.splitCoins(tx.gas, [balance])

    const params = [world, coin, tx.pure.address(account.address)];
    (await obelisk.tx.blackjack_system.withdraw(tx, params, undefined, true)) as TransactionResult;
    const response = await obelisk.signAndSendTxn(tx);
    if (response.effects.status.status == 'success')
        getBalance({ account, setBalance })
}