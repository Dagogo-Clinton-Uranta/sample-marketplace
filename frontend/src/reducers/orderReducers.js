import {ORDER_CREATE_REQUEST,
        ORDER_CREATE_SUCCESS,
        ORDER_CREATE_FAILURE,
        ORDER_DETAILS_REQUEST,
        ORDER_DETAILS_SUCCESS,
        ORDER_DETAILS_FAILURE,
        ORDER_PAY_REQUEST,
        ORDER_PAY_SUCCESS,
        ORDER_PAY_FAILURE,
        ORDER_PAY_RESET,
        ORDER_INSUFFICIENT_REQUEST,
        ORDER_INSUFFICIENT_SUCCESS,
        ORDER_INSUFFICIENT_FAILURE,
        ORDER_INSUFFICIENT_RESET,
        ORDER_MERCHANT_CREDIT_REQUEST,
        ORDER_MERCHANT_CREDIT_SUCCESS,
        ORDER_MERCHANT_CREDIT_FAILURE,
        ORDER_MERCHANT_CREDIT_RESET,
        ORDER_APPROVE_REQUEST,
        ORDER_APPROVE_SUCCESS,
        ORDER_APPROVE_FAILURE,
        ORDER_LIST_MY_REQUEST,
        ORDER_LIST_MY_SUCCESS,
        ORDER_LIST_MY_FAILURE,
        ORDER_LIST_MY_RESET,
        ORDER_LIST_REQUEST,
        ORDER_LIST_SUCCESS,
        ORDER_LIST_FAILURE,
        UNPAID_ORDER_LIST_REQUEST,
        UNPAID_ORDER_LIST_SUCCESS,
        UNPAID_ORDER_LIST_FAILURE,
        ORDER_DELIVER_REQUEST,
        ORDER_DELIVER_SUCCESS,
        ORDER_DELIVER_FAILURE,
        ORDER_DELIVER_RESET
      } from '../constants/orderConstants'


export const orderCreateReducer = (state={}, action) => {
    switch (action.type) {
      case ORDER_CREATE_REQUEST: return {loading:true}
      case ORDER_CREATE_SUCCESS:return {loading:false,success:true, order:action.payload}
      case ORDER_CREATE_FAILURE: return {loading:false, error:action.payload}
      default: return state
    }
}


export const orderDetailsReducer = ( state={loading:true, orderItems:[],shippingAddress:{} }, action) => {
    switch (action.type) {
      case ORDER_DETAILS_REQUEST: return {...state,loading:true}
      case ORDER_DETAILS_SUCCESS:return {loading:false, order:action.payload}
      case ORDER_DETAILS_FAILURE: return {loading:false, error:action.payload}
      default: return state
    }
}


export const orderDeliverReducer = ( state={}, action) => {
    switch (action.type) {
      case ORDER_DELIVER_REQUEST: return {loading:true}
      case ORDER_DELIVER_SUCCESS:return {loading:false, success:true}
      case ORDER_DELIVER_FAILURE: return {loading:false, error:action.payload}
      case ORDER_DELIVER_RESET: return {}
      default: return state
    }
}

export const orderPayReducer = ( state={}, action) => {
    switch (action.type) {
      case ORDER_PAY_REQUEST: return {loading:true}
      case ORDER_PAY_SUCCESS:return {loading:false, success:action.payload.isPaid}
      case ORDER_PAY_FAILURE: return {loading:false, error:action.payload}
      case ORDER_PAY_RESET: return {}
      default: return state
    }
}

export const merchantCreditOrderReducer = ( state={}, action) => {
  switch (action.type) {
    case ORDER_MERCHANT_CREDIT_REQUEST: return {loading:true}
    case ORDER_MERCHANT_CREDIT_SUCCESS:return {loading:false, success:action.payload.merchantsCredited}
    case ORDER_MERCHANT_CREDIT_FAILURE: return {loading:false, error:action.payload}
    case ORDER_MERCHANT_CREDIT_RESET: return {}

    default: return state
  }
}

export const insufficientFundsOrderReducer = ( state={}, action) => {
  switch (action.type) {
    case ORDER_INSUFFICIENT_REQUEST: return {loading:true}
    case ORDER_INSUFFICIENT_SUCCESS:return {loading:false, success:true}
    case ORDER_INSUFFICIENT_FAILURE: return {loading:false, error:action.payload}
    case ORDER_INSUFFICIENT_RESET: return {}
    default: return state
  }
}

 
export const orderListMyReducer = ( state={orders:[]}, action) => {
    switch (action.type) {
      case ORDER_LIST_MY_REQUEST: return {loading:true}
      case ORDER_LIST_MY_SUCCESS:return {loading:false, orders:action.payload}
      case ORDER_LIST_MY_FAILURE: return {loading:false, error:action.payload}
      case ORDER_LIST_MY_RESET: return { orders:[] }
      default: return state
    }
}   


export const orderListReducer = ( state={orders:[]}, action) => {
    switch (action.type) {
      case ORDER_LIST_REQUEST: return {loading:true}
      case ORDER_LIST_SUCCESS:return {loading:false, orders:action.payload}
      case ORDER_LIST_FAILURE: return {loading:false, error:action.payload}

      default: return state
    }
}


export const unpaidOrderListReducer = ( state={orders:[]}, action) => {
  switch (action.type) {
    case UNPAID_ORDER_LIST_REQUEST: return {loading:true}
    case UNPAID_ORDER_LIST_SUCCESS:return {loading:false, orders:action.payload}
    case UNPAID_ORDER_LIST_FAILURE: return {loading:false, error:action.payload}

    default: return state
  }
}


export const orderApproveReducer = (state={}, action) => {
  switch (action.type) {
    case ORDER_APPROVE_REQUEST: return {loading:true}
    case ORDER_APPROVE_SUCCESS:return {loading:false,success:true, order:action.payload}
    case ORDER_APPROVE_FAILURE: return {loading:false, error:action.payload}
    default: return state
  }
}