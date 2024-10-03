import {
    NETWORK,
    PACKAGE_ID,
    WORLD_ID,
    loadMetadata,
    Obelisk,
    WalletAccount,
    ThunkDispatch,
    initialStateType,
    UnknownAction,
    reduxDispatch as Dispatch
} from "./type"
import { NextRouter } from "next/router"
import { refreshAll } from "../store/modules/suikemon"

type Props = {
    account: WalletAccount,
    router: NextRouter,
    dispatch: ThunkDispatch<{
        suikemon: initialStateType;
    }, undefined, UnknownAction> & Dispatch<UnknownAction>
}

export default async function checkNewUser({ account, router, dispatch }: Props) {
    const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
    const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
    })
    const exist = await obelisk.containEntity(WORLD_ID, "backpack", account.address)
    if (exist[0])
        dispatch(refreshAll(account))
    router.push(exist && exist[0] ? "/" : "/tip/register")
}