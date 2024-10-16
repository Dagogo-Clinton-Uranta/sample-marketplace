import axios from 'axios' //when we add to cart, we want to get info for that particular product from our backend, so we can see details
import baseUrl from '../baseUrl'

import {CART_REMOVE_ITEM,
        CART_ADD_ITEM,
        CART_SAVE_SHIPPING_ADDRESS,
        CART_SAVE_PAYMENT_METHOD} from '../constants/cartConstants'


export const addToCart =(id, qty) => async(dispatch, getState) => {
//getState allows us to get our entire state tree
  const {data} = await axios.get(`${baseUrl}/api/products/${id}`)

  dispatch({
    type:CART_ADD_ITEM,
    payload:{
      product:data._id,
      name:data.name,
      image:data.image,
      price:data.price,
      agreedPrice:data.agreedPrice,
      vendor:data.vendor,
      vendorId:data.vendorId,
      vendorAddress:data.vendorAddress,
      vendorAccountNumber:data.vendorAccountNumber,
      countInStock:data.countInStock,
      qty
    }
  })

  //HOW EXACTLY DO THEY USE THIS GETSTATE, HE JUST SEEMED TO INTRODUCE IT
  localStorage.setItem('cartItems',JSON.stringify(getState().cart.cartItems))
  //YOU CAN ONLY STORE STRINGS IN LOCAL STORAGE, TAKE NOTE
}

export const removeFromCart = (id) => async(dispatch, getState) => {
          dispatch({
            type:CART_REMOVE_ITEM,
            payload:id
          })

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const saveShippingAddress= (data) => async(dispatch) => {
          dispatch({
            type:CART_SAVE_SHIPPING_ADDRESS,
            payload:data
          })

  localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (data) => async(dispatch) => {
          dispatch({
            type:CART_SAVE_PAYMENT_METHOD,
            payload:data
          })

  localStorage.setItem('paymentMethod', JSON.stringify(data))
}
