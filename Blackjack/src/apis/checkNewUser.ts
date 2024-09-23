import {
    Dispatch,
    SetStateAction,
    UseMutateAsyncFunction,
    UseSignAndExecuteTransactionError,
    UseSignAndExecuteTransactionArgs,
    NETWORK,
    PACKAGE_ID,
    WORLD_ID,
    loadMetadata,
    Obelisk,
    Transaction,
    WalletAccount,
    SuiSignAndExecuteTransactionOutput
} from "./type"

type Props = {
    account: WalletAccount,
    signAndExecuteTransaction: UseMutateAsyncFunction<SuiSignAndExecuteTransactionOutput, UseSignAndExecuteTransactionError, UseSignAndExecuteTransactionArgs, unknown>,
    setBalance: Dispatch<SetStateAction<number>>,
    setIsNewUser: Dispatch<SetStateAction<boolean>>
}

export default async function checkNewUser({ account, signAndExecuteTransaction, setBalance, setIsNewUser }: Props) {
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