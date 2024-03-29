import {createStore,combineReducers,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import {productListReducer,productListByMerchantReducer, productDetailsReducer, productDeleteReducer,productCreateReducer,productUpdateReducer,productUpdateStockReducer, productCreateReviewReducer,productTopRatedReducer} from './reducers/productReducers.js'
import {cartReducer} from './reducers/cartReducers.js'
import {userLoginReducer,userSendReducer,adminSendReducer, userVerifyReducer, userRegisterReducer, userDetailsReducer, userProfileUpdateReducer,userNotesUpdateReducer,userListReducer,userDeleteReducer,userUpdateReducer} from './reducers/userReducers.js'
import {orderCreateReducer, orderDetailsReducer, orderPayReducer,insufficientFundsOrderReducer,orderDeliverReducer, orderListMyReducer,orderListReducer, unpaidOrderListReducer ,orderApproveReducer, merchantCreditOrderReducer } from './reducers/orderReducers.js'

const reducer = combineReducers({
  productList: productListReducer,
  productListByMerchant:productListByMerchantReducer,
  productDetails:productDetailsReducer,
  productDelete:productDeleteReducer,
  productCreate:productCreateReducer,
  productUpdate:productUpdateReducer,
  productUpdateStock:productUpdateStockReducer,
  productCreateReview:productCreateReviewReducer,
  productTopRated:productTopRatedReducer,
  cart: cartReducer,
  userLogin:userLoginReducer,
  userSend:userSendReducer,
  adminSend:adminSendReducer,
  userVerify:userVerifyReducer,
  userRegister:userRegisterReducer,
  userDetails:userDetailsReducer,
  userProfileUpdate:userProfileUpdateReducer,
  userNotesUpdate:userNotesUpdateReducer,
  userList:userListReducer,
  userDelete:userDeleteReducer,
  userUpdate:userUpdateReducer,
  orderCreate:orderCreateReducer,
  orderDetails:orderDetailsReducer,
  orderPay:orderPayReducer,
  merchantCreditOrder:merchantCreditOrderReducer,
  insufficientFundsOrder:insufficientFundsOrderReducer,
  orderDeliver:orderDeliverReducer,
  orderListMy:orderListMyReducer,
  orderList:orderListReducer,
  unpaidOrderList:unpaidOrderListReducer,
  orderApprove:orderApproveReducer 

})
//WE JSON.PARSE LOCAL STORAGE CUZ ITS IN STRING FORM AND WE WANT OUR OBJECT BACK
const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')):[]
const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')):null
const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')):{}

const initialState = {
  cart: {cartItems:cartItemsFromStorage, shippingAddress:shippingAddressFromStorage},
  userLogin : {userInfo: userInfoFromStorage}
}

const middleware =[thunk]

const store = createStore(reducer, initialState,composeWithDevTools(applyMiddleware(...middleware)));

export default store
