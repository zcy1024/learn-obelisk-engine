import {
    Dispatch,
    SetStateAction,
    UseMutateAsyncFunction,
    UseSignAndExecuteTransactionError,
    UseSignAndExecuteTransactionArgs,
    NETWORK,
    PACKAGE_ID,
    WORLD_ID,
    ACCOUNT,
    loadMetadata,
    Obelisk,
    Transaction,
    WalletAccount,
    SuiSignAndExecuteTransactionOutput
} from "./type"

import getBalance from "./getBalance"

type Props = {
    account: WalletAccount,
    signAndExecuteTransaction: UseMutateAsyncFunction<SuiSignAndExecuteTransactionOutput, UseSignAndExecuteTransactionError, UseSignAndExecuteTransactionArgs, unknown>,
    setBalance: Dispatch<SetStateAction<number>>
}

export default async function recharge({ account, signAndExecuteTransaction, setBalance }: Props) {
    const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
    const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
    })
    const tx = new Transaction()
    const world = tx.object(WORLD_ID)
    const chargeAmount = 1000000000
    const coin = tx.splitCoins(tx.gas, [chargeAmount])
    const params = [world, coin, tx.pure.address(ACCOUNT)]
    await obelisk.tx.blackjack_system.recharge(tx, params, undefined, true)
    await signAndExecuteTransaction(
        {
            transaction: tx,
            chain: `sui:${NETWORK}`
        },
        {
            onSuccess: async () => await getBalance({ account, setBalance })
        }
    )
}