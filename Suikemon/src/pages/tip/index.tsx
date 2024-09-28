import { useEffect } from "react";
import { useRouter } from "next/router";
import { useCurrentAccount } from "@mysten/dapp-kit";

const Tip = ({ tips }: { tips: string }) => {
    const router = useRouter()
    const account = useCurrentAccount()

    const delay = async (ms: number) => {
        const sleep = async (ms: number) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        await sleep(ms)
        router.back()
    }

    useEffect(() => {
        if (router.isReady && !account)
            router.push("/tip/notConnect")
        else if (router.isReady && account)
            delay(3000)
    }, [router, account])
    return (
        <div className="relative w-screen h-screen z-50">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tracking-widest">
                <div className="animate-bounce">
                    <span className="sprite-icon sprite-icon-000" title="tips"></span>
                    {tips}
                </div>
            </div>
        </div>
    );
};

export default Tip;