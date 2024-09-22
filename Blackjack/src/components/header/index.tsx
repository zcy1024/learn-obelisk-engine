import Link from "next/link";
import { useEffect, useContext, Dispatch, SetStateAction } from "react";
import { Popover } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from "react";

import { NETWORK, PACKAGE_ID, WORLD_ID } from '../../chain/config';
import { loadMetadata, Obelisk, Transaction, TransactionResult } from '@0xobelisk/sui-client';
import { PRIVATEKEY, ACCOUNT } from "../../chain/key";
import { ConnectButton, useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';

import { Balance, Mask } from "../../pages";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function MenuIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M5 6h14M5 18h14M5 12h14"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function ChevronUpIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M17 14l-5-5-5 5"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}


const Header = ({ isNewUser }: { isNewUser: boolean }) => {
    const [balance, setBalance] = useContext(Balance)
    const setIsMasked = useContext(Mask)

    const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction()
    const account = useCurrentAccount()

    const getBalance = async () => {
        const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
        const obelisk = new Obelisk({
            networkType: NETWORK,
            packageId: PACKAGE_ID,
            metadata: metadata,
        })
        let res = await obelisk.getEntity(WORLD_ID, "player", account.address)
        setBalance(Number(res[0]))
    }

    const handlerRecharge = async () => {
        if (isNewUser)
            return

        setIsMasked(true)

        const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
        const obelisk = new Obelisk({
            networkType: NETWORK,
            packageId: PACKAGE_ID,
            metadata: metadata,
        })
        const tx = new Transaction()
        const world = tx.object(WORLD_ID)
        const chargeAmount = 1000000000
        const coin = tx.splitCoins(tx.gas, [chargeAmount])
        const params = [world, coin, tx.pure.address(ACCOUNT)]
        await obelisk.tx.blackjack_system.recharge(tx, params, undefined, true)
        await signAndExecuteTransaction(
            {
                transaction: tx,
                chain: `sui:${NETWORK}`
            },
            {
                onSuccess: () => getBalance()
            }
        )
        setIsMasked(false)
    }

    useEffect(() => {
        if (!isNewUser)
            getBalance()
    }, [isNewUser])

    const handlerWithdraw = async () => {
        if (isNewUser || balance === 0)
            return

        setIsMasked(true)

        const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
        const obelisk = new Obelisk({
            networkType: NETWORK,
            packageId: PACKAGE_ID,
            metadata: metadata,
            secretKey: PRIVATEKEY
        })

        const sui_balance = await obelisk.getBalance()
        while (Number(sui_balance.totalBalance) < balance + 100000000)
            await obelisk.requestFaucet()
        if (Number(sui_balance.totalBalance) < 1000000000)
            await obelisk.requestFaucet()

        const tx = new Transaction()
        const world = tx.object(WORLD_ID)
        const coin = tx.splitCoins(tx.gas, [balance])

        const params = [world, coin, tx.pure.address(account.address)];
        (await obelisk.tx.blackjack_system.withdraw(tx, params, undefined, true)) as TransactionResult;
        const response = await obelisk.signAndSendTxn(tx);
        if (response.effects.status.status == 'success')
            getBalance()
        setIsMasked(false)
    }

    return (
        <div className={classNames("py-4 ", "flex fixed mx-auto z-40 inset-x-0 px-4 sm:px-6 lg:px-8 xl:px-24 2xl:px-56  w-full justify-between transition-all duration-700 ease-in-out  items-center")}>
            <div className={"relative z-10 items-center flex "}>
                <Link href="/" legacyBehavior>
                    <a>
                        <img
                            className="w-10 h-10 rounded-full flex lg:mr-5"
                            src="/assets/logo.png"
                            alt=""
                        />
                    </a>
                </Link>
                <div className="hidden lg:flex lg:gap-10" style={{ height: "52px" }}>
                    <ConnectButton />
                </div>
            </div>
            <div className="flex items-center  gap-6">

                <Popover className="lg:hidden">

                    {({ open }) => (
                        <>
                            <Popover.Button
                                className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-500 p-2 outline-none"
                                aria-label="Toggle site navigation"
                            >

                                {({ open }) =>
                                    open ? (
                                        <ChevronUpIcon className="h-10 w-10" />
                                    ) : (
                                        <MenuIcon className="h-10 w-10" />
                                    )
                                }
                            </Popover.Button>
                            <AnimatePresence initial={false}>
                                {open && (
                                    <>
                                        <Popover.Overlay
                                            static
                                            as={motion.div}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur"
                                        />
                                        <Popover.Panel
                                            static
                                            as={motion.div}
                                            initial={{ opacity: 0, y: -32 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{
                                                opacity: 0,
                                                y: -32,
                                                transition: { duration: 0.2 },
                                            }}
                                            className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl  bg-[#2E2E2E] px-6 pb-6 pt-24 shadow-2xl shadow-gray-900/20"
                                        >

                                            <div className="space-y-4 " style={{ height: "52px" }}>
                                                <ConnectButton />
                                            </div>


                                        </Popover.Panel>
                                    </>
                                )}
                            </AnimatePresence>
                        </>
                    )}
                </Popover>

                <div className="hidden lg:flex gap-4 items-center ">
                    <div className="hidden lg:flex lg:gap-10">
                        <button className="text-sm lg:text-base font-medium text-white transition duration-700 " onClick={handlerRecharge}>
                            Recharge
                        </button>
                        <button className="text-sm lg:text-base font-medium text-white transition duration-700 " onClick={handlerWithdraw}>
                            Withdraw
                        </button>
                        <button className="text-sm lg:text-base font-medium text-white transition duration-700 " disabled>
                            Game Balance: {balance}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Header
