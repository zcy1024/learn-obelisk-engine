import { createSlice } from "@reduxjs/toolkit";
import type { WalletAccount } from '@mysten/wallet-standard';
import { getBackpack, getTrading, getCollection } from "../../apis";
import { ThunkDispatch, UnknownAction, Dispatch } from "@reduxjs/toolkit";

type suikemonType = {
    suikemonID: string,
    shiny: boolean,
    number?: string
}

type tradingType = {
    suikemon: suikemonType,
    price: string,
    stock: string,
    seller: string,
}

type initialStateType = {
    backpack: suikemonType[],
    trading: tradingType[],
    collection: suikemonType[]
}

const initialState = {
    backpack: [],
    trading: [],
    collection: []
} as initialStateType

const suikemonStore = createSlice({
    name: "suikemon",
    initialState,
    reducers: {
        setBackpack(state, action: { payload: suikemonType[] }) {
            state.backpack = action.payload
        },
        setTrading(state, action: { payload: tradingType[] }) {
            state.trading = action.payload
        },
        setCollection(state, action: { payload: suikemonType[] }) {
            state.collection = action.payload
        }
    }
})

const { setBackpack, setTrading, setCollection } = suikemonStore.actions

const fetchBackpack = (account: WalletAccount) => {
    return async (dispatch: ThunkDispatch<{
        suikemon: initialStateType;
    }, undefined, UnknownAction> & Dispatch<UnknownAction>) => {
        const origin = await getBackpack({ account })
        // console.log(origin[0], origin[1], origin[2])
        const data = origin[0].map((_, index): suikemonType => {
            return {
                suikemonID: origin[0][index] as string,
                shiny: origin[1][index] as boolean,
                number: origin[2][index] as string
            }
        })
        // console.log(data)
        dispatch(setBackpack(data))
    }
}

const fetchTrading = () => {
    return async (dispatch: ThunkDispatch<{
        suikemon: initialStateType;
    }, undefined, UnknownAction> & Dispatch<UnknownAction>) => {
        const origin = await getTrading()
        // console.log(origin)
        const data = origin[0].map((_, index): tradingType => {
            return {
                suikemon: {
                    suikemonID: origin[0][index] as string,
                    shiny: origin[1][index] as boolean
                },
                price: origin[2][index] as string,
                stock: origin[3][index] as string,
                seller: origin[4][index] as string
            }
        })
        // console.log(data)
        dispatch(setTrading(data))
    }
}

const fetchCollection = (account: WalletAccount) => {
    return async (dispatch: ThunkDispatch<{
        suikemon: initialStateType;
    }, undefined, UnknownAction> & Dispatch<UnknownAction>) => {
        const origin = await getCollection({ account })
        // console.log(origin)
        const data = origin[0].map((_, index): suikemonType => {
            return {
                suikemonID: origin[0][index] as string,
                shiny: origin[1][index] as boolean
            }
        })
        // console.log(data)
        dispatch(setCollection(data))
    }
}

const refreshAll = (account: WalletAccount) => {
    return async (dispatch: ThunkDispatch<{
        suikemon: initialStateType;
    }, undefined, UnknownAction> & Dispatch<UnknownAction>) => {
        await dispatch(fetchBackpack(account))
        await dispatch(fetchTrading())
        await dispatch(fetchCollection(account))
    }
}

export { setBackpack, setTrading, setCollection }

export { fetchBackpack, fetchTrading, fetchCollection, refreshAll }

export default suikemonStore.reducer