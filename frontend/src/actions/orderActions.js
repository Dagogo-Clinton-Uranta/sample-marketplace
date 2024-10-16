import {ORDER_CREATE_REQUEST,
        ORDER_CREATE_SUCCESS,
        ORDER_CREATE_FAILURE,
        ORDER_DETAILS_REQUEST,
        ORDER_DETAILS_SUCCESS,
        ORDER_DETAILS_FAILURE,
        ORDER_PAY_REQUEST,
        ORDER_PAY_SUCCESS,
        ORDER_PAY_FAILURE,
        ORDER_MERCHANT_CREDIT_REQUEST,
        ORDER_MERCHANT_CREDIT_SUCCESS,
        ORDER_MERCHANT_CREDIT_FAILURE,
        ORDER_MERCHANT_CREDIT_RESET,
        ORDER_INSUFFICIENT_REQUEST,  
        ORDER_INSUFFICIENT_SUCCESS,
        ORDER_INSUFFICIENT_FAILURE,
        ORDER_APPROVE_REQUEST,
        ORDER_APPROVE_SUCCESS,
        ORDER_APPROVE_FAILURE,
        //ORDER_PAY_RESET,
        ORDER_LIST_MY_REQUEST,
        ORDER_LIST_MY_SUCCESS,
        ORDER_LIST_MY_FAILURE,
        ORDER_LIST_REQUEST,
        ORDER_LIST_SUCCESS,
        ORDER_LIST_FAILURE,
        UNPAID_ORDER_LIST_REQUEST,
        UNPAID_ORDER_LIST_SUCCESS,
        UNPAID_ORDER_LIST_FAILURE,
        ORDER_DELIVER_REQUEST,
        ORDER_DELIVER_SUCCESS,
        ORDER_DELIVER_FAILURE
        //ORDER_DELIVER_RESET,
       } from '../constants/orderConstants'
import axios from 'axios'
import baseUrl from '../baseUrl'

                              /*the entire order object*/
export const createOrder  = (order) => async (dispatch,getState)=> {
   //redux thunk was used just now in the form of async (dispatch) above
  try {
    dispatch({type: ORDER_CREATE_REQUEST})

     const {userLogin:{userInfo}} = getState()
    //we do config cus we wanna send he headers a content type of application/json
    const config = {
      headers:{
        'Content-Type':'application/json',
        Authorization:`Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.post(`${baseUrl}/api/orders`,order,config)
    //i'm gonna take a stab here and say that the third argument for axios is for setting header property

    dispatch({
              type: ORDER_CREATE_SUCCESS,
              payload:data })

  }
   catch(error){
     dispatch({type:ORDER_CREATE_FAILURE,
               payload: error.response && error.response.data.message?
                error.response.data.message:error.message })
   }
}


export const getOrderDetails  = (id) => async (dispatch,getState)=> {
//form of async (dispatch) above
  try {
    dispatch({type: ORDER_DETAILS_REQUEST})

     const {userLogin:{userInfo}} = getState()
    //we do config cus we wanna send the headers a content type of application/json
    const config = {
      headers:{
        //'Content-Type':'application/json' |you dont really need content type in GET requests for some reason
        Authorization:`Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.get(`${baseUrl}/api/orders/${id}`,config)
    //i'm gonna take a stab here and say that the third argument for axios is for setting header property

    dispatch({
              type: ORDER_DETAILS_SUCCESS,
              payload:data /*this data variable is file specific*/

    })

  }
   catch(error){
     dispatch({type:ORDER_DETAILS_FAILURE,
               payload: error.response && error.response.data.message?
                error.response.data.message:error.message })
   }
}



export const payOrder  = (orderId) => async (dispatch,getState) =>{
//form of async (dispatch) above
  try {
    dispatch({type: ORDER_PAY_REQUEST})

     const {userLogin:{userInfo}} = getState()
    //we do config cus we wanna send he headers a content type of application/json
    const config = {
      headers:{
        'Content-Type':'application/json',
        Authorization:`Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.put(`${baseUrl}/api/orders/${orderId}/pay`,{},config)
    //i'm gonna take a stab here and say that the third argument for axios is for setting header property

    dispatch({
              type: ORDER_PAY_SUCCESS,
              payload:data
            })/*this data variable is file specific
export const getOrderDetails  = (id/*this is not the entire object, just an order id*/


  }
   catch(error){
     dispatch({type:ORDER_PAY_FAILURE,
               payload: error.response && error.response.data.message?
                error.response.data.message:error.message })
   }
}


export const merchantCreditOrder  = (orderId) => async (dispatch,getState) =>{
  //form of async (dispatch) above
    try {
      dispatch({type: ORDER_MERCHANT_CREDIT_REQUEST})
  
       const {userLogin:{userInfo}} = getState()
      //we do config cus we wanna send he headers a content type of application/json
      const config = {
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${userInfo.token}`
        }
      }
      const {data} = await axios.put(`${baseUrl}/api/orders/${orderId}/paymerchants`,{},config)
      //i'm gonna take a stab here and say that the third argument for axios is for setting header property
  
      dispatch({
                type: ORDER_MERCHANT_CREDIT_SUCCESS,
                payload:data
              })/*this data variable is file specific
  export const getOrderDetails  = (id/*this is not the entire object, just an order id*/
  
  
    }
     catch(error){
       dispatch({type:ORDER_MERCHANT_CREDIT_FAILURE,
                 payload: error.response && error.response.data.message?
                  error.response.data.message:error.message })
     }
  }



export const insufficientFundsOrder  = (orderId,userType) => async (dispatch,getState) =>{
  //form of async (dispatch) above
    try {
      dispatch({type: ORDER_INSUFFICIENT_REQUEST})
  
       const {userLogin:{userInfo}} = getState()
      //we do config cus we wanna send he headers a content type of application/json
      const config = {
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${userInfo.token}`
        }
      }
      const {data} = await axios.put(`${baseUrl}/api/orders/${orderId}/funds`,{userType},config)
      //i'm gonna take a stab here and say that the third argument for axios is for setting header property
  
      dispatch({
                type: ORDER_INSUFFICIENT_SUCCESS,
                payload:data
              })/*this data variable is file specific
  export const getOrderDetails  = (id/*this is not the entire object, just an order id*/
  
  
    }
     catch(error){
       dispatch({type:ORDER_INSUFFICIENT_FAILURE,
                 payload: error.response && error.response.data.message?
                  error.response.data.message:error.message })
     }
  }


export const deliverOrder  = (order) => async (dispatch,getState)=> {
//form of async (dispatch) above
  try {
    dispatch({type: ORDER_DELIVER_REQUEST})

     const {userLogin:{userInfo}} = getState()
    //we do config cus we wanna send he headers a content type of application/json
    const config = {
      headers:{
        Authorization:`Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.put(`${baseUrl}/api/orders/${order._id}/deliver`,{},config)
    //i'm gonna take a stab here and say that the third argument for axios is for setting header property

    dispatch({
              type: ORDER_DELIVER_SUCCESS,
              payload:data
            })/*this data variable is file specific*/



  }
   catch(error){
     dispatch({type:ORDER_DELIVER_FAILURE,
               payload: error.response && error.response.data.message?
                error.response.data.message:error.message })
   }
}


export const listMyOrders  = () => async (dispatch,getState)=> {
//form of async (dispatch) above
  try {
    dispatch({type: ORDER_LIST_MY_REQUEST})

     const {userLogin:{userInfo}} = getState()
    //we do config cus we wanna send he headers a content type of application/json
    const config = {
      headers:{

        Authorization:`Bearer ${userInfo.token}`
      }
    } 
    const {data} = await axios.get(`${baseUrl}/api/orders/myorders`,config)
    //i'm gonna take a stab here and say that the third argument for axios is for setting header property

    dispatch({
              type: ORDER_LIST_MY_SUCCESS,
              payload:data /*this data variable is file specific*/



    })
  }
   catch(error){
     dispatch({type:ORDER_LIST_MY_FAILURE,
               payload: error.response && error.response.data.message?
                error.response.data.message:error.message })
   }
}


export const listOrders  = (vendorName=''/*try a reg ex of all allowable characters, not just an empty object */) => async (dispatch,getState)=> {
//form of async (dispatch) above
  try {
    dispatch({type: ORDER_LIST_REQUEST})

     const {userLogin:{userInfo}} = getState()
    //we do config cus we wanna send he headers a content type of application/json
    const config = {
      headers:{

        Authorization:`Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.get(`${baseUrl}/api/orders?vendorName=${vendorName}`,config)
    //i'm gonna take a stab here and say that the third argument for axios is for setting header property

    dispatch({
              type: ORDER_LIST_SUCCESS,
              payload:data /*this data variable is file specific*/



    })
  }
   catch(error){
     dispatch({type:ORDER_LIST_FAILURE,
               payload: error.response && error.response.data.message?
                error.response.data.message:error.message })
   }
}



export const listUnpaidOrders  = () => async (dispatch,getState)=> {
  //form of async (dispatch) above
    try {
      dispatch({type: UNPAID_ORDER_LIST_REQUEST})
  
       const {userLogin:{userInfo}} = getState()
      //we do config cus we wanna send he headers a content type of application/json
      const config = {
        headers:{
  
          Authorization:`Bearer ${userInfo.token}`
        }
      }
      const {data} = await axios.get(`${baseUrl}/api/orders/unpaidorders`,config)
      //i'm gonna take a stab here and say that the third argument for axios is for setting header property
  
      dispatch({
                type: UNPAID_ORDER_LIST_SUCCESS,
                payload:data /*this data variable is file specific*/
  
  
  
      })
    }
     catch(error){
       dispatch({type:UNPAID_ORDER_LIST_FAILURE,
                 payload: error.response && error.response.data.message?
                  error.response.data.message:error.message })
     }
  }


export const merchantApproveOrder  = (orderId,productId,updatedQty) => async (dispatch,getState)=> {
  //redux thunk was used just now in the form of async (dispatch) above
 try {
   dispatch({type: ORDER_APPROVE_REQUEST})

    const {userLogin:{userInfo}} = getState()
   //we do config cus we wanna send he headers a content type of application/json
   const config = {
     headers:{
       'Content-Type':'application/json',
       Authorization:`Bearer ${userInfo.token}`
     }
   }
   const {data} = await axios.put(`${baseUrl}/api/orders`,{orderId,productId,updatedQty},config)
   //i'm gonna take a stab here and say that the third argument for axios is for setting header property

   dispatch({
             type: ORDER_APPROVE_SUCCESS,
             payload:data })

 }
  catch(error){
    dispatch({type:ORDER_APPROVE_FAILURE,
              payload: error.response && error.response.data.message?
               error.response.data.message:error.message })
  }
}


export const merchantLockOrder  = (order) => async (dispatch,getState)=> {
  //redux thunk was used just now in the form of async (dispatch) above
 try {
   dispatch({type: ORDER_CREATE_REQUEST})

    const {userLogin:{userInfo}} = getState()
   //we do config cus we wanna send he headers a content type of application/json
   const config = {
     headers:{
       'Content-Type':'application/json',
       Authorization:`Bearer ${userInfo.token}`
     }
   }
   const {data} = await axios.post(`${baseUrl}/api/orders`,order,config)
   //i'm gonna take a stab here and say that the third argument for axios is for setting header property

   dispatch({
             type: ORDER_CREATE_SUCCESS,
             payload:data })

 }
  catch(error){
    dispatch({type:ORDER_CREATE_FAILURE,
              payload: error.response && error.response.data.message?
               error.response.data.message:error.message })
  }
}