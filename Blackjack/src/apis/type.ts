import { Dispatch, SetStateAction } from "react";
import { NETWORK, PACKAGE_ID, WORLD_ID } from '../chain/config';
import { PRIVATEKEY, ACCOUNT } from "../chain/key";
import { loadMetadata, Obelisk, Transaction, TransactionResult } from '@0xobelisk/sui-client';
import type { WalletAccount, SuiSignAndExecuteTransactionOutput, SuiSignAndExecuteTransactionInput } from '@mysten/wallet-standard';
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { PartialBy } from "@mysten/dapp-kit/dist/cjs/types/utilityTypes";
import { WalletFeatureNotSupportedError, WalletNoAccountSelectedError, WalletNotConnectedError } from "@mysten/dapp-kit/dist/cjs/errors/walletErrors";

type UseSignAndExecuteTransactionError = WalletFeatureNotSupportedError | WalletNoAccountSelectedError | WalletNotConnectedError | Error;
type UseSignAndExecuteTransactionArgs = PartialBy<Omit<SuiSignAndExecuteTransactionInput, 'transaction'>, 'account' | 'chain'> & {
    transaction: Transaction | string;
};

export type {
    Dispatch,
    SetStateAction,
    TransactionResult,
    UseMutateAsyncFunction,
    UseSignAndExecuteTransactionError,
    UseSignAndExecuteTransactionArgs
}

export {
    NETWORK,
    PACKAGE_ID,
    WORLD_ID,
    PRIVATEKEY,
    ACCOUNT,
    loadMetadata,
    Obelisk,
    Transaction,
    WalletAccount,
    SuiSignAndExecuteTransactionOutput
}