import { useEffect } from "react";
import { useRouter } from "next/router";
import { useCurrentAccount } from "@mysten/dapp-kit";
const NotConnect = () => {
    const router = useRouter()
    const account = useCurrentAccount()
    useEffect(() => {
        if (router.isReady && account)
            router.replace("/")
    }, [router, account])
    return (
        <div>
            NotConnect
        </div>
    );
};

export default NotConnect;