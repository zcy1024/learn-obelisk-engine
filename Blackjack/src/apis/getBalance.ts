import {
    Dispatch,
    SetStateAction,
    NETWORK,
    PACKAGE_ID,
    WORLD_ID,
    loadMetadata,
    Obelisk,
    WalletAccount,
} from "./type"

type Props = {
    account: WalletAccount,
    setBalance: Dispatch<SetStateAction<number>>
}

export default async function getBalance({ account, setBalance }: Props) {
    const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
    const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
    })
    let res = await obelisk.getEntity(WORLD_ID, "player", account.address)
    setBalance(res ? Number(res[0]) : 0)
}