import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import {LinkContainer} from 'react-router-bootstrap'
import {PayPalButton} from 'react-paypal-button-v2'
import { Button, Row ,Col ,Form, ListGroup, Image, Card, ListGroupItem} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message.js'
//import {getUserDetails, updateUserProfile} from '../actions/userActions.js'
import {getOrderDetails,payOrder,deliverOrder,merchantApproveOrder/*,merchantLockOrder*/} from '../actions/orderActions.js'
import Loader from '../components/Loader.js'
import {ORDER_PAY_RESET,ORDER_DELIVER_RESET } from '../constants/orderConstants.js'  //HE MADE AN EXCEPTION HERE DISPATCHING STRAIGHT FROM CONSTANTS WITHOUT CALLING ACTIONS, TO MAKE THINGS FASTER


const OrderScreen =  ({match,history}) => {
     const [sdkReady,setSdkReady] = useState('false') // this is our piece of local state for when the SDK is ready



   const orderId = match.params.id
   const dispatch = useDispatch()
  //const cart = useSelector(state => state.cart) come back and check why you commented this out


  const orderDetails = useSelector((state) => state.orderDetails )
  const {order,loading,error} = orderDetails
  /*the variable below doesnt work out because , order cannot be read at this stage, i assigned the state i needed in the use effect instead */
  /*const zeroArrayBasedOnOrderLength = Array.apply(null,Array(order.orderItems.length)).map((item)=>(0))*/
  
  /*console.log(order)*/


   const [merchantProductsArray,setMerchantProductsArray] = useState([]) /*i never actually change the state of this */
   const [promisedQtyArray,setPromisedQtyArray] = useState([])
   const [committedValue, setCommittedValue] = useState('')
   const [productId,setProductId] = useState([])
   const [highlight,setHighlight] = useState('13px')
   const [colour, setColour] = useState('black')
   

 

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
 order.promisedQtyArray = promisedQtyArray
 order.merchantProductsArray = merchantProductsArray
 /*order.initalState = order.orderItems.filter((item) => (item.vendor === userInfo.name)).map((item) => (item.promisedQty))*/
}



 const initialState = function(order,item){
  const vendorArray = order.orderItems.filter((item) => (item.vendor === userInfo.name))
  setMerchantProductsArray(vendorArray)
  const promisedArray =  order.orderItems.filter((item) => (item.vendor === userInfo.name)).map((item) => (promisedQtyArray[vendorArray.indexOf(item)]))
  setPromisedQtyArray(promisedArray)
  console.log(typeof(productId),'then',productId)
 }



 const liveUpdate =function(e,item){
   /*const vendorArray = order.orderItems.filter((item) => (item.vendor === userInfo.name))
    setMerchantProductsArray(vendorArray)*/
/*const copyArray =  order.orderItems.filter((item) => (item.vendor === userInfo.name)).map((item) => (item.promisedQty)) /*i need to call this ONCE,not everytime the function is called so bring it out of this function */
             const copyArray = promisedQtyArray         
         copyArray[merchantProductsArray.indexOf(item)] = Number(e.target.value)
    
                     setPromisedQtyArray(copyArray)
                     /*console.log(promisedQtyArray,merchantProductsArray)*/
                     console.log(copyArray,promisedQtyArray)
                    }

//AN ARRAY TO CORRESPOND WITH THE LENGTH THE VENDORS ITEMS THAT ARE DISPLAYED ON SCREEN, SO WE CAN EASILY CHANGE ITEM AMOUNTS ON SCREEN
/*let promisedQtyArray = order.orderItems.filter((item) => (item.vendor === userInfo.name)).map((item, index) =>(
  0
))*/

//AN ARRAY TO FILTER ORDER ITEMS THAT HAVE A PARTICULAR VENDOR, TO HELP US PICK promisedQtyArray element, in the order items  
/*const merchantProductsArray =  order.orderItems.filter((item) => (item.vendor === userInfo.name))*/

/*useEffect(()=>{
  if(!order){promisedArray = []}
  else{ promisedArray =  order.orderItems.filter((item) => (item.vendor === userInfo.name)).map((item) => (item.promisedQty))
setPromisedQtyArray(promisedArray)}

  if(!order){vendorArray =[]}
  else{vendorArray=order.orderItems.filter((item) => (item.vendor === userInfo.name))}
  setMerchantProductsArray(vendorArray)
  

},[order,promisedArray,vendorArray])*/





useEffect(()=> { 
       if(!userInfo){
         history.push('/login')
       }

       if(userInfo && userInfo.isTeller){
        history.push('/teller/transactionlist')
     }
      
       /*setPromisedQtyArray(order.orderItems.filter((item) => (item.vendor === userInfo.name)).map((item, index) =>(
        0
      ))) */
      if(order){ /*setPromisedQtyArray(Array.apply(null,Array(order.orderItems.length)).map((item)=>(0)))*/
                 setPromisedQtyArray(order.orderItems.map((item) => (item.promisedQty)))

                 setProductId(Array.apply(null,Array(order.orderItems.length)).map((item)=>(0)))
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

const submitHandler = (e) => {
    e.preventDefault()
    if( promisedQtyArray.reduce((acc, item)=>acc +item,0) ===0  ){window.alert('please select a value before committing!')}
    else if(promisedQtyArray.indexOf(0) !== -1 ){window.alert('You cannot commit zero for ANY item,please contact admin if you are out of stock')}
    else{window.alert('Committed!')
      dispatch(merchantApproveOrder(order._id, productId, promisedQtyArray))}
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
         {userInfo.isMerchant && <>
         
         <p> 1.) Here you may commit to fulfilling orders. Please select the number of each item that you are sure
            to give the customer once the dispatch rider comes around. </p>

            <p> 2.) PLEASE MAKE EFFORTS TO FULLY FULFILL ALL YOUR ORDERS, FOR A GOOD REPUTATION AMONG CUSTOMERS.</p>
            
             <p> 3.) Initially, You MUST select a value for each product before you click' commit your items' . Subsequently you can commit items individually</p>
            <br/>
            <p>
            4.) If you are only able to partially fulfill your order, (you cannot meet the  expected quantity for any item), be sure to send a message to the admin mentioning
            the order ID, the product in question and how many units you are able to fulfill . The total amount of money you are to recieve will be reflected in the payment summary, based on the quantity you agree to fulfill.
            </p>
            <br/>
            <p>Please commit all your order items by: &nbsp; <span style={{color:'black', fontSize:'1rem'}}>{new Date(new Date(order.createdAt).getTime()+ 48 * 60 * 60 * 1000).toLocaleDateString()}</span></p>
            <br/>
                  
            </>}
        <p> {userInfo.isMerchant||userInfo.isAdmin?(<strong>Order placed by :</strong>):(<strong>Name :</strong>) }{'   '}{order.user.name}</p>

       { !userInfo.isMerchant &&
       <>
       <p> <strong>Email:</strong>{' '} <a href= {`mailto:${order.user.email}`}>{order.user.email}</a> </p>
          <p>
         <strong>Address:</strong>
         {order.shippingAddress.address},{order.shippingAddress.city}{' '},
         {order.shippingAddress.postalCode}{' '},{order.shippingAddress.country}
         </p>
         
      </> }

      {order.isDelivered && <Message variant='success'>Dispatched on {order.deliveredAt.substring(0,10)}</Message> }
                        

         {!order.isPaid  &&
                        <Message variant='warning'> Processing...</Message> }

{order.insufficientFunds && <Message variant='danger'>Insufficient funds , please put money in your account and indicate by clicking the button below</Message> }
                         



          </ListGroup.Item>

          {userInfo.isAdmin &&<ListGroup.Item>
            <h2>Payment </h2>

            
        {order.isPaid ?(<Message variant='success'>Paid on {new Date(order.paidAt).toLocaleDateString()}</Message> ):
                      (<Message variant='danger'> Not paid, please contact the teller to request for the customer to be debited.</Message>)}
           </ListGroup.Item>}

           <ListGroup.Item>
           <ListGroup>
             <ListGroupItem>
            <h2>Order Items</h2>
          <Row>
          {!(userInfo.isMerchant||userInfo.isAdmin) && <Col md={2}>S/N</Col>}
          <Col md={2}>Item</Col>
          {userInfo.isMerchant?<Col md={2}>To Fulfill</Col>:<Col md={2}>Vendor</Col>}
          {userInfo.isAdmin && <Col md={2}>Requested Quantity</Col>}
          {userInfo.isMerchant?(<Col md={4}>How many can you fulfill?</Col>):(userInfo.isAdmin && <Col md={2}>Merchant's promised amount</Col>)}
          {userInfo.isMerchant && <Col md={2}>Item Total</Col>}
          
          {!userInfo.isMerchant && <Col md={2}>Total</Col>}
          
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
                {/*<Col md={2}>{index + 1}</Col>*/}
                 <Col md={2}>
                  <Image src={item.image} alt={item.name} fluid rounded/>
                  <Link to={`product/${item.product}`/*remember product property is the id in the cart*/}>
                   {item.name}
                  </Link>
                  </Col>
                  <Col md={2}>
                   {item.qty}
                   </Col>
                   
                   <Col md={4}>
                 <Form className="form-inline" onSubmit={submitHandler}>
                   
                   <Form.Group>
                   <Form.Row>
                   <Col md={2}>
                   <Form.Control as='select' defaultValue={item.promisedQty} onMouseEnter ={(e)=>{initialState(order,item)}} onChange ={(e)=>{   
                                                                   liveUpdate(e,item) 
                                                                   setCommittedValue(Number(e.target.value))
                                                                   
                                                                   /*JUST IN CASE I NEED TO CHANGE TO A SINGLE COMMITS INSTEAD OF A GROUP ONE */
                                                                   /*setProductId(item.product)*/
                                                                   
                                                                   
                                                                  if(productId.indexOf(item.product) === -1){ 
                                                                     const dummyArray = productId /*I USED PROMISED QTY ARRAY HERE CUZ I JUST NEEED ANY ARRAY WITH THE SAME LENGTH AS THE PRODUCTS IN THE order items */
                                                                     dummyArray[merchantProductsArray.indexOf(item)] = item.product
                                                                    
                                                                    setProductId(dummyArray)}
                                                                     
                                                                                
                                                                                }}>
          {[...Array(item.qty+1).keys()].map((x) =>(
            <option key={x} value={x} disabled={item.merchantPromise} >
             {x}
            </option>
             
          ))}
               
        </Form.Control>
        
                  </Col>
                   
                  </Form.Row>
                  </Form.Group>
                    
                  {/* <Form.Group>
                   <Form.Row>
                   
                   <Col md={{span:2,offset:2}}>
                   
                      <Button type='submit' variant='primary' className='btn-sm'  >
                       COMMIT
                    
                       </Button>
                   </Col>
                   </Form.Row>
                   </Form.Group>*/}

              </Form>
              </Col>
                   <Col md={3} style={{fontSize:highlight, color:colour}}>
                   {promisedQtyArray.reduce((acc, item)=>acc +item,0) ===0 ?(item.promisedQty):(typeof(promisedQtyArray[merchantProductsArray.indexOf(item)])!=='number'? 0:promisedQtyArray[merchantProductsArray.indexOf(item)])} x ₦ {(18/19*item.price).toFixed(2)} = ₦ {((promisedQtyArray.reduce((acc, item)=>acc +item,0) ===0?(item.promisedQty):(typeof(promisedQtyArray[merchantProductsArray.indexOf(item)])!=='number'? 0:promisedQtyArray[merchantProductsArray.indexOf(item)]))*item.price*18/19).toFixed(2)}
                   </Col>

                  
                  </Row>

                </ListGroup.Item>
              )
               ) 
                }
              </ListGroup>
             
              <ListGroup>
              <ListGroup.Item>
              
              <Row>
                <Col></Col>
                <Col></Col>
                <Col></Col>
                <Col>  <Button type='buton' variant='primary' className='btn-md'  onClick={submitHandler} >
                       COMMIT YOUR ITEMS
                    
                       </Button>
                       
                       </Col>
              </Row>
              </ListGroup.Item>
              </ListGroup>
          </>):
            (
            <ListGroup variant="flush">
              {order.orderItems.map((item, index) =>(

                <ListGroup.Item key ={index}>
                <Row>
               {!userInfo.isAdmin && <Col md={2}>{index + 1}</Col>}
                 <Col md={2}>
                  <Image src={item.image} alt={item.name} fluid rounded/>
                  <Link to={`product/${item.product}`/*remember product property is the id in the cart*/}>
                   {item.name}
                  </Link>
                  </Col>
                  <Col md={2}>
                   {item.vendor}
                   </Col>

                   {userInfo.isAdmin && <Col md={2}>
                   {item.qty}
                   </Col>}
                   
                   {userInfo.isAdmin && <Col md={2}>
                   {item.promisedQty}
                   </Col>}

                   {<Col md={3}>
                   {item.qty} x ₦ {(item.price*1).toFixed(2)} = ₦ {(item.qty*item.price).toFixed(2)}
                   </Col>}


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

             <Col> Items </Col>
             <Col>₦ {order.itemsPrice} </Col>
               
            </Row>
           </ListGroup.Item>

           

           { /* WE STILL HAVEN'T SORTED OUT WHO BEARS THE DELIVERY COST
            <ListGroup.Item>
            <Row>

             <Col>Delivery Cost </Col>
             <Col>₦ {(order.deliveryCost*1).toFixed(2)} </Col>

            </Row>
      </ListGroup.Item>*/}

            

           <ListGroup.Item>
            <Row>

             <Col>Total </Col>
             <Col>₦ {(order.totalPrice).toFixed(2)} </Col>

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
            <h2>Payment Summary</h2>
           </ListGroup.Item>

           <ListGroup.Item>
            <Row>

             <Col>For completely fulfilling, you will gain: </Col>
             <Col>₦ {(18/19*order.orderItems.filter((item) => (item.vendor === userInfo.name)).reduce((acc, item)=>acc +(item.price*item.qty),0)).toFixed(2)} </Col> 
               
            </Row>
           </ListGroup.Item>

           <ListGroup.Item>   
            <Row>

             <Col> Current gain for items committed: </Col>
             {/*<Col>₦ {(order.orderItems.filter((item) => (item.vendor === userInfo.name)).reduce((acc, item)=>acc +(item.price*item.promisedQty),0)).toFixed(2)} </Col> */}
             {/*<Col>{(promisedQtyArray===''?(item.promisedQty):(typeof(promisedQtyArray[merchantProductsArray.indexOf(item)])!=='number'? 0:promisedQtyArray[merchantProductsArray.indexOf(item)]))*item.price}</Col>*/}
            {<Col>₦ {(promisedQtyArray.reduce((acc, item)=>acc +item,0)) ===0 ?(18/19*order.orderItems.filter((item) => (item.vendor === userInfo.name)).reduce((acc, item)=>acc +(item.price*item.promisedQty),0)).toFixed(2):(18/19*order.orderItems.filter((item) => (item.vendor === userInfo.name)).map((item,index)=>(item.price*promisedQtyArray[index]/*YOU ARE HERE */)).reduce((acc, item)=>acc +(item),0)).toFixed(2)} </Col> }
            </Row>
           </ListGroup.Item>

            {/*BECAUSE WE DONT KNOW WHO BEARS THE BRUNT OF DELIVERY
            
            <ListGroup.Item>
            <Row>

             <Col>Delivery Deductions: </Col>
             <Col>-₦{(Number(order.deliveryCost)).toFixed(2)} </Col>

            </Row>
           </ListGroup.Item>*/}

            

           <ListGroup.Item>
            <Row>

             <Col>Total to recieve :</Col>
             {<Col>₦ {(promisedQtyArray.reduce((acc, item)=>acc +item,0)) ===0 ?(18/19 * order.orderItems.filter((item) => (item.vendor === userInfo.name)).reduce((acc, item)=>acc +(item.price*item.promisedQty),0)).toFixed(2):(18/19*order.orderItems.filter((item) => (item.vendor === userInfo.name)).map((item,index)=>(item.price*promisedQtyArray[index]/*YOU ARE HERE */)).reduce((acc, item)=>acc +(item),0)).toFixed(2)} </Col> }

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

       {userInfo.isMerchant && 
       
       <center>
         <ListGroup > 
      <ListGroup.Item > 
        
    

  <LinkContainer to={`/communications?specificOrderId=${order._id}`}>
  <Button type='button' variant='primary'> CLICK TO MESSAGE ADMIN </Button>
  </LinkContainer>
     
    
    </ListGroup.Item>
    </ListGroup>
    </center>}
  

       {userInfo.isAdmin && <Card>
          <ListGroup variant='flush'>
           <ListGroup.Item>
            <h2>Teller Transactions{order.isDelivered?" Performed":" To Perform"}</h2>
           </ListGroup.Item>

          {userInfo.isAdmin && !order.isDelivered && <ListGroup.Item>
            <p >ORDER MADE AT: <span style={{color:'red'}}>({new Date(new Date(order.createdAt).getTime()).toLocaleDateString()})</span> </p>
            <p > MERCHANT DEADLINE: <span style={{color:'red'}}>({new Date(new Date(order.createdAt).getTime()+ 48 * 60 * 60 * 1000).toLocaleDateString()})</span> </p>
           </ListGroup.Item>}


           <ListGroup.Item>
            <Row>

             <Col>To BridgeWay Co-operative Account: </Col>
             <Col>₦ {(order.itemsPrice -(order.orderItems.reduce((acc, item)=>acc +(item.price*item.qty),0) - order.orderItems.reduce((acc, item)=>acc +(item.price*item.promisedQty),0)) - (18/19 *order.orderItems.reduce((acc, item)=>acc +(item.price*item.promisedQty),0)) ).toFixed(2)} </Col>

            </Row>
           </ListGroup.Item>
      {order.orderItems.map((item, index) =>(
            <ListGroup.Item  key ={index}>
            <Row>

             <Col> {index + 1}. TO {item.vendor} account:  </Col>
             <Col>₦ {((18/19) * item.price).toFixed(2) * item.promisedQty } </Col>

            </Row>
           </ListGroup.Item>
           ))}
      
       
            { (order.orderItems.reduce((acc, item)=>acc +(item.price*item.promisedQty),0) !== order.orderItems.reduce((acc, item)=>acc +(item.price*item.qty),0))  &&
              
              <ListGroup.Item>
            <Row>

             <Col>REFUND (for goods unfulfilled): </Col>
             <Col>₦ {((order.orderItems.reduce((acc, item)=>acc +(item.price*item.qty),0) - order.orderItems.reduce((acc, item)=>acc +(item.price*item.promisedQty),0))).toFixed(2)} </Col>

            </Row>
           </ListGroup.Item>}


      {/*<ListGroup.Item>
            <Row>

             <Col>To dispatch rider account: </Col>
             <Col>₦ {(Number(order.deliveryCost)).toFixed(2)} </Col>

            </Row>
           </ListGroup.Item>*/}

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
      {userInfo && userInfo.isAdmin && order.isPaid && (order.orderItems.every((item) => (item.promisedQty === item.qty))||new Date() > new Date(new Date(order.createdAt).getTime() + 48 * 60 * 60 * 1000) ) ?(
        <ListGroup.Item>
        

        <LinkContainer to={`/printorder/${order._id}`}>
        <Button type='button' className='btn btn-block'> Proceed to Print Order</Button>
                   
                
               </LinkContainer>

        </ListGroup.Item>
      ):(
        <ListGroup.Item>
        
             <p>You may print out this order (to give to the dispatch rider) ONLY AFTER the deadline for merchants <span style={{color:'red'}}>({new Date(new Date(order.createdAt).getTime()+ 48 * 60 * 60 * 1000).toLocaleDateString()})</span> has passed by, OR if all merchants have fulfilled their orders before the deadline. The button to print will appear once these conditions are met</p>

        </ListGroup.Item>

      )}

         </ListGroup>
       </Card>}
     </Col>
    </Row>
   
   

</>)
}


export default OrderScreen;
