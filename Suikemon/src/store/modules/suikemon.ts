import { createSlice } from "@reduxjs/toolkit";
import suikemonData from "../../data/data"

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
    suikemonData: Map<string, string[]>,
    backpack: suikemonType[],
    trading: tradingType[],
    collection: suikemonType[]
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