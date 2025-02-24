export const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
}

export const updateCart = (state) => {
    // Calculate Items price
    state.itemsPrice = addDecimals(state.cartItems.reduce((a, item) => a + item.price * item.qty, 0))
    // Calculate shipping price
    state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)
    // Calculate tax price
    state.taxPrice = addDecimals(Number(state.itemsPrice * 0.15).toFixed(2))
    // Calculate total price
    state.totalPrice = addDecimals((
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)).toFixed(2)
    )

    localStorage.setItem("cart", JSON.stringify(state))
    return state
}