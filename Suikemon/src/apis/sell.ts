import {
    UseMutateAsyncFunction,
    UseSignAndExecuteTransactionError,
    UseSignAndExecuteTransactionArgs,
    NETWORK,
    PACKAGE_ID,
    WORLD_ID,
    loadMetadata,
    Obelisk,
    Transaction,
    SuiSignAndExecuteTransactionOutput,
} from "./type"

type Props = {
    suikemon: string,
    is_shiny: boolean,
    sell_number: string,
    sell_price: string,
    signAndExecuteTransaction: UseMutateAsyncFunction<SuiSignAndExecuteTransactionOutput, UseSignAndExecuteTransactionError, UseSignAndExecuteTransactionArgs, unknown>
}

export default async function sell({ suikemon, is_shiny, sell_number, sell_price, signAndExecuteTransaction }: Props) {
    const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
    const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
    })
    const tx = new Transaction()
    const world = tx.object(WORLD_ID)
    const params = [world, tx.pure.u64(suikemon), tx.pure.bool(is_shiny), tx.pure.u64(sell_number), tx.pure.u128(sell_price)]
    await obelisk.tx.suikemon_system.sell(tx, params, undefined, true)
    await signAndExecuteTransaction(
        {
            transaction: tx,
            chain: `sui:${NETWORK}`
        },
        {
            onSuccess: () => {}
        }
    )
}