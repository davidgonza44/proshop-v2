import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";


const initialState =
    localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : {
        cartItems: [], shippingAddress: {}, paymentMethod : 'PayPal'

    }

console.log(initialState)

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {

            const item = action.payload
            const existItem = state.cartItems.find(x => x._id === item._id)
            if (!existItem) {
                state.cartItems = [...state.cartItems, item]
            } else {
                state.cartItems = state.cartItems.map(x =>
                    x._id === existItem._id ? item : x
                    // Se utiliza para actualizar un ítem existente (o mantener los demás ítems sin cambios en el proceso).
                )
            }
            return updateCart(state)
        },
        removeFromCart: (state, action) => {
            const id = action.payload
            state.cartItems = state.cartItems.filter(x => x._id !== id)
            return updateCart(state)
        },

        cleanCart : (state,action) => {
            state.cartItems = []
            localStorage.removeItem("cart")
            return updateCart(state)
        },

        saveShippingAddress : (state,action) => {
            state.shippingAddress = action.payload
            return updateCart(state)
        },

        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload
            return updateCart(state)
        }

    }
})

export const { addToCart, removeFromCart, cleanCart, saveShippingAddress, savePaymentMethod} = cartSlice.actions;
export default cartSlice.reducer;

//redux toolkit toma cada funcion y crea un action creator correspondiente y los
// almanacena en counterSlice.actions, genera un type/unico para cada accion