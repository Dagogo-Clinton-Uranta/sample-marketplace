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


const PrintOrderScreen =  ({match,history}) => {
     const [sdkReady,setSdkReady] = useState('false') // this is our piece of local state for when the SDK is ready



   const orderId = match.params.id
   const dispatch = useDispatch()
  //const cart = useSelector(state => state.cart) come back and check why you commented this out

 const [merchantProductsArray,setMerchantProductsArray] = useState('') /*i never actually change the state of this */
 const [promisedQtyArray,setPromisedQtyArray] = useState('')
 const [committedValue, setCommittedValue] = useState('')
 const [productId,setProductId] = useState('')
 const [highlight,setHighlight] = useState('13px')
 const [colour, setColour] = useState('black')
 const [customerView, setCustomerView] = useState(false)
 const [riderView,setRiderView] = useState(false)
 
 
 const orderDetails = useSelector((state) => state.orderDetails )
  const {order,loading,error} = orderDetails
   /*console.log(order)*/
  
 

   

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
  console.log(typeof(promisedQtyArray),promisedQtyArray)
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
      ))) 
       setMerchantProductsArray(order.orderItems.filter((item) => (item.vendor === userInfo.name)))*/

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
  window.print()
  window.location.reload()
}

const customerPrepHandler = ()=> {
   setCustomerView(true)
    
}

const riderPrepHandler = ()=> {

  setRiderView(true)
}




 /*is there a factor of 18/19 to consider for, --yes */
/*const merchantTotal = order.orderItems.filter((item) => (item.vendor === userInfo.name)).reduce((acc, item)=>acc +(item.price*item.qty),0)*/

        return loading ?( <Loader/> ):error ?( <Message variant='danger'>{error} </Message>):
(<>

<h1>Order ID: {order._id}</h1>
{ (!customerView && !riderView ) &&
        <>
        <Card>
         <ListGroup>
           <ListGroup.Item>
            
           <Row>
               <h5>NOTE: </h5><span> After you click any of the buttons below,  refresh the screen to return to this page</span>
               </Row>
              <br/>
              

            <Row>
               <h5>INSTRUCTIONS:</h5></Row>
             
             <Row>
               Click on the two buttons below to print a receipt for the customer and a dispatch list for the dispatch rider
       <span style={{color:'red'}}> YOU MUST PERFORM THE PRINT ACTION TWICE,</span> once for the dispatch rider and a second time as a reciept for the customer. You must click one of the two prepare buttons before you print. They are explained as follows:
               
            </Row>
            
            <hr/>
            
            <Row><h5>BUTTON EXPLANATIONS:</h5></Row>
         </ListGroup.Item>
          
         <ListGroup.Item>
           <Row>
        <Col >  <Button type='button' className='btn btn-block' onClick={customerPrepHandler}> PREPARE FOR CUSTOMER</Button> </Col>
        <Col  >Click this button to convert the page to a receipt to be printed for the customer. Click it  then click 'PRINT' to print out the page. This print out is to be given along with the goods, to the customer. </Col>
          </Row>
       </ListGroup.Item>


       <ListGroup.Item>
           <Row>
        <Col> <Button type='button' className='btn btn-block' onClick={riderPrepHandler}> PREPARE FOR DISPATCH RIDER</Button></Col>
        <Col  >Click this button to convert the page to a list of items for the dispatch rider to pick up, from their respective locations. Click it then click 'PRINT' to print out the page. This print out is solely for the dispatch rider and NOT for the customer.</Col>
          </Row>
       </ListGroup.Item>
         </ListGroup>
    
         </Card>
          <br/>
          <br/>
          </>
        }





    
    <Row>
    
    {/*default view , also dipatch rider view*/} {(!customerView && riderView ) && <Col md={14}>

      <ListGroup variant="flush">
       
      {loadingDeliver && <Loader/>}
      {userInfo && userInfo.isAdmin /*&& order.isPaid*/ && (
        <ListGroup>
        <ListGroup.Item>
        <Button type='button' className='btn btn-block' onClick={deliverHandler}> PRINT </Button>
        </ListGroup.Item>
        </ListGroup>
      )}
       
       
       
       
       
       <ListGroup.Item>
         <h2>Delivery Instructions</h2>
         {userInfo.isAdmin && <>
           
          <p> Please go to all vendor addresses, collect all items and deliver them to the Address for final delivery (below)</p>
            
            <p>
         <strong>Address for Final Delivery: &nbsp; </strong>
         {order.shippingAddress.address},{order.shippingAddress.city}{' '},
         {order.shippingAddress.postalCode}{' '},{order.shippingAddress.country}
         </p>

         <p>Please deliver all items by: &nbsp; <span style={{color:'black', fontSize:'1rem'}}>{new Date(new Date(order.createdAt).getTime()+ 96 * 60 * 60 * 1000).toLocaleDateString()}</span></p>
                  
            </>}
        <p> {userInfo.isMerchant||userInfo.isAdmin?(<strong>Order placed by :</strong>):(<strong>Name :</strong>) }{'   '}{order.user.name}</p>

       { !userInfo.isMerchant &&
       <>
       <p> <strong>Email:</strong>{' '} <a href= {`mailto:${order.user.email}`}>{order.user.email}</a> </p>
          
         
      </> }
     
      

         {order.isDelivered ?<Message variant='success'>This order has already beeb dispatched, on {order.deliveredAt.substring(0,10)}</Message> :
                        <Message variant='danger'> Not dispatched</Message> }

          </ListGroup.Item>

          

           <ListGroup.Item>
           <ListGroup>
             <ListGroupItem>
            <h2>Order Items</h2>
          <Row>
          {/*!userInfo.isMerchant && <Col md={2}>S/N</Col>*/}
          <Col md={2}>Item</Col>
          { <Col md={2}>Vendor Name</Col>}
          { <Col md={4}>Vendor Address </Col>}
          {(userInfo.isAdmin && <Col md={2}> Promised Quantity</Col>)}
          
          
          {!userInfo.isMerchant && <Col md={2}>CREDITED</Col>}
          
          </Row>
          </ListGroupItem>
          </ListGroup>
          { order.orderItems.length === 0 ? ( <Message>Order is empty </Message>):
            
            (
            <ListGroup variant="flush">
              {order.orderItems.map((item, index) =>(

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
                   {item.vendor}
                   </Col>
                   
                   <Col md={4}>
                   {item.vendorAddress}
                   </Col>


                   {userInfo.isAdmin && <Col md={2}>
                   {item.promisedQty}
                   </Col>}

                   <Col md={2}>
                   {/*{item.promisedQty} x ₦ {item.price} =*/} ₦ {item.promisedQty*item.price}
                   </Col>

                  </Row>

                </ListGroup.Item>
                )
              )}
            </ListGroup>
           )
               } 
               
               </ListGroup.Item>
      </ListGroup>
     </Col>}


 {/*view for customers */}    { customerView && <Col md={9}>

      <ListGroup variant="flush">
       
      {loadingDeliver && <Loader/>}
      {userInfo && userInfo.isAdmin /*&& order.isPaid*/ && (
        <ListGroup>
        <ListGroup.Item>
         
        <Button type='button' className='btn btn-block' onClick={deliverHandler}> PRINT </Button>
        
        </ListGroup.Item>
        </ListGroup>
      )}
       
        
       
       <ListGroup.Item>
         <h2>Delivery</h2>
         {userInfo.isAdmin && <>
         
            
            
            <p>
         <strong>Address for Final Delivery: &nbsp; </strong>
         {order.shippingAddress.address},{order.shippingAddress.city}{' '},
         {order.shippingAddress.postalCode}{' '},{order.shippingAddress.country}
         </p>
                  
            </>}
         <p> {userInfo.isMerchant||userInfo.isAdmin?(<strong>Order placed by :</strong>):(<strong>Name :</strong>) }{'   '}{order.user.name}</p>

            { !userInfo.isMerchant &&
            <>
          <p> <strong>Email:</strong>{' '} <a href= {`mailto:${order.user.email}`}>{order.user.email}</a> </p>
          
         
           </> }
     
      

             {order.isDelivered ?<Message variant='success'>Dispatched on {order.deliveredAt.substring(0,10)}</Message> :
                        <Message variant='danger'> Not dispatched</Message> }

          </ListGroup.Item>

          
     
           <ListGroup.Item>
           <ListGroup>
             <ListGroupItem>
            <h2>Order Items</h2>
          <Row>
          {/*!userInfo.isMerchant && <Col md={2}>S/N</Col>*/}
          <Col md={3}>Item</Col>
          {/* <Col md={2}>Vendor Name</Col>*/}
          { <Col md={3}>Quantity Requested </Col>}
          {(userInfo.isAdmin && <Col md={3}> Quantity Delivered</Col>)}
          
          
          {!userInfo.isMerchant && <Col md={3}>PAID</Col>}
          
          </Row>
          </ListGroupItem>
          </ListGroup>

          { order.orderItems.length === 0 ? ( <Message>Order is empty </Message>):
            
            (
            <ListGroup variant="flush">
              {order.orderItems.map((item, index) =>(

                <ListGroup.Item key ={index}>
                <Row>
                {/*<Col md={2}>{index + 1}</Col>*/}
                 <Col md={3}>
                  <Image src={item.image} alt={item.name} fluid rounded/>
                  <Link to={`product/${item.product}`/*remember product property is the id in the cart*/}>
                   {item.name}
                  </Link>
                  </Col>

                 {/* <Col md={2}>
                   {item.vendor}
              </Col> */}
                   
                  {<Col md={3}>
                   {item.qty}
                   </Col>}


                   {userInfo.isAdmin && <Col md={3}>
                   {item.promisedQty}
                   </Col>}

                   <Col md={3}>
                   {/*{item.promisedQty} x ₦ {item.price} =*/} ₦ {item.promisedQty*item.price}
                   </Col>

                  </Row>

                </ListGroup.Item>
                )
              )}

                  <ListGroup.Item>
                    <Row>
                      <Col></Col>
                      <Col></Col>
                      <Col>TOTAL PAID:</Col>
                      <Col>₦ {(order.orderItems.reduce((acc, item)=>acc +(item.price*item.promisedQty),0)).toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>

                  {(order.orderItems.reduce((acc, item)=>acc +(item.price*item.promisedQty),0) !== order.orderItems.reduce((acc, item)=>acc +(item.price*item.qty),0) ) && 
                  <ListGroup.Item>
                    <Row>
                      <Col></Col>
                      <Col></Col>
                      <Col>REFUNDED:</Col>
                      <Col>₦ {(order.orderItems.reduce((acc, item)=>acc +(item.price*item.qty),0) - order.orderItems.reduce((acc, item)=>acc +(item.price*item.promisedQty),0)).toFixed(2)}</Col>
                      <br/>
                      <br/>
                    </Row>
                  </ListGroup.Item>}

            </ListGroup>
           )
               } 
               
               </ListGroup.Item>
      </ListGroup>
     </Col>}
     
    </Row>
    
   {customerView && <Row>
    
      <Col></Col>
      <center><h5>THANK YOU FOR USING OUR SERVICE !</h5></center>
      <Col></Col>
    </Row>
    }
   

</>)
}


export default PrintOrderScreen;
