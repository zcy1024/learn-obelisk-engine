import type { NextPage } from 'next';
import Home from './home';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCurrentAccount } from '@mysten/dapp-kit';

const IndexPage: NextPage = () => {
    const router = useRouter()
    const account = useCurrentAccount()
    useEffect(() => {
        if (router.isReady && !account)
            router.push("/tip/notConnect")
    }, [router, account])
    return (
        <main>
            <Home />
        </main>
    )
}

export default IndexPage


