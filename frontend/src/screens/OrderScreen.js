import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import {PayPalButton} from 'react-paypal-button-v2'
import { Button, Row ,Col , ListGroup, Image, Card, ListGroupItem} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message.js'
//import {getUserDetails, updateUserProfile} from '../actions/userActions.js'
import {getOrderDetails,payOrder,deliverOrder} from '../actions/orderActions.js'
import Loader from '../components/Loader.js'
import {ORDER_PAY_RESET,ORDER_DELIVER_RESET } from '../constants/orderConstants.js'  //HE MADE AN EXCEPTION HERE DISPATCHING STRAIGHT FROM CONSTANTS WITHOUT CALLING ACTIONS, TO MAKE THINGS FASTER


const OrderScreen =  ({match,history}) => {
     const [sdkReady,setSdkReady] = useState('false') // this is our piece of local state for when the SDK is ready

   const orderId = match.params.id
   const dispatch = useDispatch()
  //const cart = useSelector(state => state.cart) come back and check why you commented this out

  const orderDetails = useSelector((state) => state.orderDetails )
  const {order,loading,error} = orderDetails
   console.log(order)
  
 /*  const addDecimals = (num) => { return(Math.round(num*100)/100).toFixed(2) }
 YOU'RE HERE
   cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item)=>acc +item.price*item.qty,0))*/

   let merchantItems 

   const userLogin = useSelector((state) => state.userLogin )
  const {userInfo} = userLogin

  const orderPay = useSelector((state) => state.orderPay )
  const {loading:loadingPay, success:successPay} = orderPay //this is renaming what you destructured, not making a new object

  const orderDeliver = useSelector((state) => state.orderDeliver )
  const {loading:loadingDeliver, success:successDeliver} = orderDeliver

if(!loading){
  //calculating the prices for orders
 const addDecimals = (num) => { return(Math.round(num*100)/100).toFixed(2) }

 order.itemsPrice = addDecimals(order.orderItems.reduce((acc, item)=>acc +item.price*item.qty,0))
}

/*console.log(order.orderItems)*/

  useEffect(()=> { 
       if(!userInfo){
         history.push('/login')
       }
       


  const addPayPalScript = async () => {
    const {data:clientId} = await axios.get('/api/config/paypal')
    const script = document.createElement('script') //this script being created will not be in the source code, cuz it comes to life AFTER the source code loads
    script.type ='text/javascript'
    document.body.appendChild(script)
    script.async=true
    script.onload =()=> {  
        setSdkReady(true)
    }
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}` //this is the software development kit that paypal gives us
    
  }


  if(!order||successPay||successDeliver){
    dispatch({type:ORDER_PAY_RESET})
    dispatch({type:ORDER_DELIVER_RESET})  //AGAIN HE MADE AN EXCEPTION HERE AND DISPATCHED STRAIGHT FROM CONSTANTS SO HE CAN KEEP IT SHORT

    dispatch(getOrderDetails(orderId))}

  else if(!order.isPaid){
    if(!window.paypal){
      addPayPalScript()
    }
    else{ setSdkReady(true) }
  }
},[dispatch,orderId,successPay,successDeliver,order,history,userInfo])

const successPaymentHandler = (paymentResult) => {
   console.log(paymentResult)
  dispatch(payOrder(orderId, paymentResult))

}

const deliverHandler = ()=> {
  dispatch(deliverOrder(order))
}
 /*is there a factor of 18/19 to consider for, --yes */
/*const merchantTotal = order.orderItems.filter((item) => (item.vendor === userInfo.name)).reduce((acc, item)=>acc +(item.price*item.qty),0)*/

        return loading ?( <Loader/> ):error ?( <Message variant='danger'>{error} </Message>):
(<>

    <h1>Order ID: {order._id}</h1>
    <Row>
     <Col md={8}>

      <ListGroup variant="flush">
       <ListGroup.Item>
         <h2>Delivery</h2>
        <p> {userInfo.isMerchant||userInfo.isAdmin?(<strong>Order placed by:</strong>):(<strong>Name:</strong>) }{''}{order.user.name}</p>

       { !userInfo.isMerchant &&
       <>
       <p> <strong>Email:</strong>{' '} <a href= {`mailto:${order.user.email}`}>{order.user.email}</a> </p>
          <p>
         <strong>Address:</strong>
         {order.shippingAddress.address},{order.shippingAddress.city}{' '},
         {order.shippingAddress.postalCode}{' '},{order.shippingAddress.country}
         </p>
         
      </> }

         {order.isDelivered ?<Message variant='success'>Delivered on {order.deliveredAt}</Message> :
                        <Message variant='danger'> Not delivered</Message> }

          </ListGroup.Item>

          {/*<ListGroup.Item>
           <h2>Payment Method</h2>

            <p>
            <strong>Method:</strong>
            {order.paymentMethod}
            </p>
       {order.isPaid ?<Message variant='success'>Paid on {order.paidAt}</Message> :
                      <Message variant='danger'> Not paid</Message> }
           </ListGroup.Item>*/}

           <ListGroup.Item>
           <ListGroup>
             <ListGroupItem>
            <h2>Order Items</h2>
          <Row>
          <Col md={2}>S/N</Col>
          <Col md={2}>Item</Col>
          <Col md={2}>Vendor</Col>
          <Col md={4}>Total</Col>
          </Row>
          </ListGroupItem>
          </ListGroup>
          { order.orderItems.length === 0 ? ( <Message>Order is empty </Message>):(userInfo.isMerchant ?
            (<>
               
            <ListGroup variant="flush">
              { 
                /*merchantItems = order.orderItems.filter((item) => (item.vendor === userInfo.vendor))*/
                order.orderItems.filter((item) => (item.vendor === userInfo.name)).map((item, index) =>(

                <ListGroup.Item key ={index}>
                <Row>
                <Col md={2}>{index + 1}</Col>
                 <Col md={2}>
                  <Image src={item.image} alt={item.name} fluid rounded/>
                  <Link to={`product/${item.product}`/*remember product property is the id in the cart*/}>
                   {item.name}
                  </Link>
                  </Col>
                  <Col md={2}>
                   {item.vendor}
                   </Col>

                   <Col md={3}>
                   {item.qty} x ₦ {item.price} = ₦ {item.qty*item.price}
                   </Col>

                  </Row>

                </ListGroup.Item>
              ))}
              </ListGroup>
          </>):
            (
            <ListGroup variant="flush">
              {order.orderItems.map((item, index) =>(

                <ListGroup.Item key ={index}>
                <Row>
                <Col md={2}>{index + 1}</Col>
                 <Col md={2}>
                  <Image src={item.image} alt={item.name} fluid rounded/>
                  <Link to={`product/${item.product}`/*remember product property is the id in the cart*/}>
                   {item.name}
                  </Link>
                  </Col>
                  <Col md={2}>
                   {item.vendor}
                   </Col>

                   <Col md={3}>
                   {item.qty} x ₦ {item.price} = ₦ {item.qty*item.price}
                   </Col>

                  </Row>

                </ListGroup.Item>
                )
              )}
            </ListGroup>
           ))
               } 
               
               </ListGroup.Item>
      </ListGroup>
     </Col>

     <Col md={4}>
      {(!userInfo.isAdmin && !userInfo.isMerchant) && <Card>
          <ListGroup variant='flush'>
           <ListGroup.Item>
            <h2>Order Summary</h2>
           </ListGroup.Item>

           <ListGroup.Item>
            <Row>

             <Col>Items </Col>
             <Col>₦ {order.itemsPrice} </Col>
               {console.log(order)}
            </Row>
           </ListGroup.Item>

            <ListGroup.Item>
            <Row>

             <Col>Delivery Cost </Col>
             <Col>₦ {order.deliveryCost} </Col>

            </Row>
           </ListGroup.Item>

            

           <ListGroup.Item>
            <Row>

             <Col>Total </Col>
             <Col>₦ {order.totalPrice} </Col>

            </Row>
           </ListGroup.Item>

          {/*!order.isPaid && (
            <ListGroup.Item>
             {loadingPay && <Loader/>}
             {!sdkReady ?<Loader/> :(<PayPalButton amount ={order.totalPrice} onSuccess={successPaymentHandler}/>)  }
            </ListGroup.Item>
          )*/}


         </ListGroup>
       </Card> }
         
         
       { userInfo.isMerchant && <Card>
          <ListGroup variant='flush'>
           <ListGroup.Item>
            <h2>Order Summary</h2>
           </ListGroup.Item>

           <ListGroup.Item>
            <Row>

             <Col>Items </Col>
             <Col>₦ {(order.orderItems.filter((item) => (item.vendor === userInfo.name)).reduce((acc, item)=>acc +(item.price*item.qty),0)).toFixed(2)} </Col> 
               
            </Row>
           </ListGroup.Item>

            <ListGroup.Item>
            <Row>

             <Col>Delivery Cost </Col>
             <Col>₦ {order.deliveryCost} </Col>

            </Row>
           </ListGroup.Item>

            

           <ListGroup.Item>
            <Row>

             <Col>Total </Col>
             <Col>₦ {(Number(order.deliveryCost) + Number(order.orderItems.filter((item) => (item.vendor === userInfo.name)).reduce((acc, item)=>acc +(item.price*item.qty),0))).toFixed(2)} </Col>

            </Row>
           </ListGroup.Item>

          {/*!order.isPaid && (
            <ListGroup.Item>
             {loadingPay && <Loader/>}
             {!sdkReady ?<Loader/> :(<PayPalButton amount ={order.totalPrice} onSuccess={successPaymentHandler}/>)  }
            </ListGroup.Item>
          )*/}


         </ListGroup>
       </Card> }



       {userInfo.isAdmin && <Card>
          <ListGroup variant='flush'>
           <ListGroup.Item>
            <h2>Teller Transactions</h2>
           </ListGroup.Item>

           <ListGroup.Item>
            <p>Please, ONLY perform these transactions when
            the respective merchants have confirmed that they can deliver the goods. </p>
           </ListGroup.Item>


           <ListGroup.Item>
            <Row>

             <Col>TO BridgeWay Co-operative Account: </Col>
             <Col>₦ {(order.itemsPrice * (1/19) ).toFixed(2)} </Col>

            </Row>
           </ListGroup.Item>
      {order.orderItems.map((item, index) =>(
            <ListGroup.Item  key ={index}>
            <Row>

             <Col> {index + 1}. TO {item.vendor} account:  </Col>
             <Col>₦ {((18/19) * item.price).toFixed(2) * item.qty } </Col>

            </Row>
           </ListGroup.Item>
           ))}
      
      <ListGroup.Item>
            <Row>

             <Col>To dispatch company account: </Col>
             <Col>₦ {(Number(order.deliveryCost)).toFixed(2)} </Col>

            </Row>
           </ListGroup.Item>

        <ListGroup.Item>
            <Row>

             <Col>Total: </Col>
             <Col>₦ {(order.totalPrice).toFixed(2)} </Col>

            </Row>
           </ListGroup.Item>
      
           
          {/*!order.isPaid && (
            <ListGroup.Item>
             {loadingPay && <Loader/>}
             {!sdkReady ?<Loader/> :(<PayPalButton amount ={order.totalPrice} onSuccess={successPaymentHandler}/>)  }
            </ListGroup.Item>
          )*/}

       {loadingDeliver && <Loader/>}
      {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
        <ListGroup.Item>
        <Button type='button' className='btn btn-block' onClick={deliverHandler}> Mark As Delivered</Button>
        </ListGroup.Item>
      )}

         </ListGroup>
       </Card>}
     </Col>
    </Row>
   
   

</>)
}


export default OrderScreen;
