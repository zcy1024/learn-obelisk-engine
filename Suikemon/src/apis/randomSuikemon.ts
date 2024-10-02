import {
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
    SuiTransactionBlockResponse,
    ThunkDispatch,
    initialStateType,
    UnknownAction,
    reduxDispatch as Dispatch
} from "./type"
import { setCongratulation } from "../store/modules/suikemon"

type Props = {
    suikemon_list: string[],
    signAndExecuteTransaction: UseMutateAsyncFunction<SuiTransactionBlockResponse, UseSignAndExecuteTransactionError, UseSignAndExecuteTransactionArgs, unknown>,
    dispatch: ThunkDispatch<{
        suikemon: initialStateType;
    }, undefined, UnknownAction> & Dispatch<UnknownAction>
}

type SuikemonInfo = {
    suikemon_id: string,
    shiny: boolean,
    number: string,
    trainer: string
}

export default async function randomSuikemon({ suikemon_list, signAndExecuteTransaction, dispatch }: Props) {
    const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
    const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
    })
    const tx = new Transaction()
    const world = tx.object(WORLD_ID)
    const index_list = tx.pure.vector("u64", suikemon_list)
    const random = tx.object("0x8")
    const coin = tx.splitCoins(tx.gas, [666666])
    const recipient = tx.pure.address(ACCOUNT)
    const params = [world, index_list, random, coin, recipient]
    await obelisk.tx.suikemon_system.random_suikemon(tx, params, undefined, true)
    await signAndExecuteTransaction(
        {
            transaction: tx,
            chain: `sui:${NETWORK}`
        },
        {
            onSuccess: (e) => {
                const suikemonEvent = e.events.filter(event => event.type === `${PACKAGE_ID}::suikemon_system::GetSuikemonEvent`)[0]
                const suikemonInfo = suikemonEvent.parsedJson as SuikemonInfo
                const suikemon = suikemonInfo.suikemon_id
                const shiny = suikemonInfo.shiny
                // console.log(suikemon, shiny)
                dispatch(setCongratulation({
                    suikemonID: suikemon,
                    shiny,
                }))
            }
        }
    )
}