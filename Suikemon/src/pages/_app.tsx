import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import '../css/font-awesome.css';
import '@mysten/dapp-kit/dist/index.css';
import '../css/suikemon-pos.css'

import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getFullnodeUrl } from '@mysten/sui/client';
import Heads from '../components/head';
import Header from '../components/header';
import { Provider } from 'react-redux';
import store from '../store';
import { createContext, Dispatch, SetStateAction, useState } from 'react';

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
    localnet: { url: getFullnodeUrl('localnet') },
    testnet: { url: getFullnodeUrl('testnet') },
    mainnet: { url: getFullnodeUrl('mainnet') },
});
const queryClient = new QueryClient();

export const IsLoading = createContext<[boolean, Dispatch<SetStateAction<boolean>>]>([false, null])

function MyApp({ Component, pageProps }: AppProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
                <WalletProvider autoConnect>
                    <Provider store={store}>
                        <IsLoading.Provider value={[isLoading, setIsLoading]}>
                            <div className='min-h-screen bg-slate-50 bg-local'>
                                <Heads />
                                <Header />
                                <Component {...pageProps} />
                            </div>
                        </IsLoading.Provider>
                    </Provider>
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
}

export default MyApp;
