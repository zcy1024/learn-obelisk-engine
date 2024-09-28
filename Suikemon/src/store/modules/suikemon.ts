import { createSlice } from "@reduxjs/toolkit";
import suikemonData from "../../data/data"

type tradingType = {
    suikemonID: string,
    price: string,
    stock: string,
    seller: string,
}

type initialStateType = {
    suikemonData: Map<string, string[]>,
    backpack: string[],
    trading: tradingType[],
    collection: string[]
}

const initialState = {
    suikemonData,
    backpack: [],
    trading: [],
    collection: []
} as initialStateType

const suikemonStore = createSlice({
    name: "suikemon",
    initialState,
    reducers: {
    }
})

const {} = suikemonStore.actions

export {}

export default suikemonStore.reducer