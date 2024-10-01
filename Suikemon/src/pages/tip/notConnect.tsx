import { useEffect } from "react";
import { useRouter } from "next/router";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { checkNewUser } from "../../apis";

const NotConnect = () => {
    const router = useRouter()
    const account = useCurrentAccount()
    useEffect(() => {
        router.isReady && account && checkNewUser({ account, router })
    }, [router, account])
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tracking-widest">
            <div className="animate-bounce">
                <span className="sprite-icon sprite-icon-000" title="tips"></span>
                Please Connect Wallet First!
            </div>
        </div>
    );
};

export default NotConnect;