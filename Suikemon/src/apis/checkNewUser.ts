import {
    NETWORK,
    PACKAGE_ID,
    WORLD_ID,
    loadMetadata,
    Obelisk,
    WalletAccount,
} from "./type"
import { NextRouter } from "next/router"

type Props = {
    account: WalletAccount,
    router: NextRouter
}

export default async function checkNewUser({ account, router }: Props) {
    const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
    const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
    })
    const exist = await obelisk.containEntity(WORLD_ID, "backpack", account.address)
    router.push(exist ? "/" : "/tip/register")
}