import { Dispatch, SetStateAction } from "react";
import { NETWORK, PACKAGE_ID, WORLD_ID, ADMIN_CAP } from '../chain/config';
import { PRIVATEKEY, ACCOUNT } from "../chain/key";
import { loadMetadata, Obelisk, Transaction, TransactionResult, SuiTransactionBlockResponse } from '@0xobelisk/sui-client';
import type { WalletAccount, SuiSignAndExecuteTransactionOutput, SuiSignAndExecuteTransactionInput } from '@mysten/wallet-standard';
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { PartialBy } from "@mysten/dapp-kit/dist/cjs/types/utilityTypes";
import { WalletFeatureNotSupportedError, WalletNoAccountSelectedError, WalletNotConnectedError } from "@mysten/dapp-kit/dist/cjs/errors/walletErrors";
import { ThunkDispatch, UnknownAction, Dispatch as reduxDispatch } from "@reduxjs/toolkit";
import { initialStateType } from "../store/modules/suikemon"

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
    UseSignAndExecuteTransactionArgs,
    SuiTransactionBlockResponse,
    ThunkDispatch,
    UnknownAction,
    reduxDispatch,
    initialStateType
}

export {
    NETWORK,
    PACKAGE_ID,
    WORLD_ID,
    ADMIN_CAP,
    PRIVATEKEY,
    ACCOUNT,
    loadMetadata,
    Obelisk,
    Transaction,
    WalletAccount,
    SuiSignAndExecuteTransactionOutput,
}