import {
    NETWORK,
    PACKAGE_ID,
    WORLD_ID,
    ADMIN_CAP,
    loadMetadata,
    Obelisk,
    WalletAccount,
} from "./type"

type Props = {
    account: WalletAccount
}

export async function getBackpack({ account }: Props): Promise<(string | boolean)[][]> {
    const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
    const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
    })
    const backpack = await obelisk.getEntity(WORLD_ID, "backpack", account.address)
    return backpack
}

export async function getTrading(): Promise<(string | boolean)[][]> {
    const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
    const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
    })
    const entityId = await obelisk.entity_key_from_object(ADMIN_CAP)
    const trading = await obelisk.getEntity(WORLD_ID, "trading", entityId)
    return trading
}

export async function getCollection({ account }: Props): Promise<(string | boolean)[][]> {
    const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
    const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
    })
    const collection = await obelisk.getEntity(WORLD_ID, "collection", account.address)
    return collection
}