import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { checkNewUser, register } from "../../apis";
import { IsLoading } from "../_app";
import Loading from "../../components/loading";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { refreshAll } from "../../store/modules/suikemon";

const Register = () => {
    const router = useRouter()
    const account = useCurrentAccount()
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        if (router.isReady && !account)
            router.push("/")
        if (router.isReady && account)
            checkNewUser({ account, router, dispatch })
    }, [router, account])

    const [isLoading, setIsLoading] = useContext(IsLoading)
    const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction()
    const handlerClick = async () => {
        setIsLoading(true)
        await register({ signAndExecuteTransaction, router })
        dispatch(refreshAll(account))
        setIsLoading(false)
        router.push("/")
    }

    return (
        <div>
            <div className="fixed w-screen h-screen bg-transparent z-40"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tracking-widest z-50">
                <div className="animate-bounce">
                    <span className="sprite-icon sprite-icon-000" title="tips"></span>
                    Please <span className="text-orange-500 cursor-pointer font-mono font-bold" onClick={handlerClick}>Click</span> To Register First!
                </div>
            </div>
            { isLoading && <Loading /> }
        </div>
    );
};

export default Register;