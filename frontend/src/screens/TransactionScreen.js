import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import {LinkContainer} from 'react-router-bootstrap'
import {PayPalButton} from 'react-paypal-button-v2'
import { Button, Row ,Col ,Form, ListGroup, Image, Card, ListGroupItem} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message.js'
//import {getUserDetails, updateUserProfile} from '../actions/userActions.js'
import {getOrderDetails,payOrder,merchantCreditOrder,deliverOrder,merchantApproveOrder,insufficientFundsOrder/*,merchantLockOrder*/} from '../actions/orderActions.js'
import Loader from '../components/Loader.js'
import {ORDER_PAY_RESET,ORDER_DELIVER_RESET } from '../constants/orderConstants.js'  //HE MADE AN EXCEPTION HERE DISPATCHING STRAIGHT FROM CONSTANTS WITHOUT CALLING ACTIONS, TO MAKE THINGS FASTER


const TransactionScreen =  ({match,history}) => {
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
  const orderDetails = useSelector((state) => state.orderDetails )
  const {order,loading,error} = orderDetails
   console.log(order)
  
 

   

   const userLogin = useSelector((state) => state.userLogin )
  const {userInfo} = userLogin

  const orderPay = useSelector((state) => state.orderPay )
  const {loading:loadingPay, success:successPay} = orderPay //this is renaming what you destructured, not making a new object

  const orderInsufficientFunds = useSelector((state) => state.insufficientFundsOrder )
  const {loading:loadingInsufficient, success:successInsufficient} = orderInsufficientFunds


   const merchantCreditForOrder =useSelector((state) => state.merchantCreditOrder)
    const {loading:loadingCredit, success:successCredit} = merchantCreditForOrder

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
      
       /*setPromisedQtyArray(order.orderItems.filter((item) => (item.vendor === userInfo.name)).map((item, index) =>(
        0
      ))) 
       setMerchantProductsArray(order.orderItems.filter((item) => (item.vendor === userInfo.name)))*/
       if(!order){ dispatch(getOrderDetails(orderId)) }
  
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
 


  /*if(!order||successPay||successDeliver){
    dispatch({type:ORDER_PAY_RESET})
    dispatch({type:ORDER_DELIVER_RESET})  //AGAIN HE MADE AN EXCEPTION HERE AND DISPATCHED STRAIGHT FROM CONSTANTS SO HE CAN KEEP IT SHORT

    }

  else if(!order.isPaid){
    if(!window.paypal){
      addPayPalScript()
    }
    else{ setSdkReady(true) }
  }*/
},[dispatch,orderId,order,history,userInfo])

/*const successPaymentHandler = (paymentResult) => {
   console.log(paymentResult)
  dispatch(payOrder(orderId, paymentResult))

}*/

const paidToggleHandler = (e)=> {
     e.preventDefault()
  dispatch(payOrder(order._id))
}

const merchantCreditToggleHandler = (e)=> {
  e.preventDefault()
dispatch(merchantCreditOrder(order._id))
}



const insufficientFundsHandler = (e)=> {
  e.preventDefault()
dispatch(insufficientFundsOrder(order._id, userInfo.isTeller))
}


const deliverHandler = ()=> {
  dispatch(deliverOrder(order))
}


        return loading ?( <Loader/> ):error ?( <Message variant='danger'>{error} </Message>):
(<>

    <h1>Order ID: {order._id}</h1>
    <Row>
     

     <Col md={12}>
    
         
         
       
{/*!order.isPaid && (
            <ListGroup.Item>
             {loadingPay && <Loader/>}
             {!sdkReady ?<Loader/> :(<PayPalButton amount ={order.totalPrice} onSuccess={successPaymentHandler}/>)  }
            </ListGroup.Item>
          )*/}
      

       { <Card>
          <ListGroup variant='flush'>
           <ListGroup.Item>
            <Row>
              <Col md ={8}>
            <h2>Teller Transaction{order.isDelivered?" Performed":" Instructions"}</h2>
             </Col>
            {order && !order.isPaid &&  <Col md ={4}>
               
                <Button type='button' variant='primary' onClick={insufficientFundsHandler}> INSUFFICIENT FUNDS </Button>
               
             </Col>
           }

            </Row>
            { order && !order.isPaid && successInsufficient && !successPay && <Row>
            <Message variant='warning'>Inusufficient Funding in {`${order.user.name}'s`} account, remember to try again later </Message>

            </Row>}
           </ListGroup.Item>

          {!order.isPaid && <ListGroup.Item>
            <p style={{color:'red'}}>NOTE: PLEASE RELOAD THE SCREEN FIRST, OTHERWISE YOU MAY END UP PERFORMING THE WRONG TRANSACTION !!! </p>
            <p>1.) PLEASE PERFORM THE FOLLOWING TRANSACTIONS TO A HOLDING ACCOUNT</p>
            <p>2.) IF THE DEBIT CANNOT BE PERFORMED (on Bank One), PLEASE SELECT 'INSUFFICIENT FUNDS' </p>
            <p> 3.)   MESSAGE THE ADMIN TO COMMUNICATE THAT THE CLIENT HAD INSUFFICIENT FUNDS</p>
            <p>4.)  IF THE DEBIT IS SUCCESSFUL, CLICK  'CHANGE PAYMENT STATUS' .</p>
            <p>5.) YOU MAY CHANGE PAYMENT STATUS AS MUCH AS YOU LIKE, UNTIL YOU ARE READY TO LEAVE THE PAGE.</p>
            <p>6.) IF YOU LEAVE THIS PAGE WITH THE PAYMENT STATUS SET TO PAID, YOU WILL NOT BE ALLOWED TO RETURN, </p>
            <p>    AND A SIGNAL WILL BE SENT TO THE ADMIN THAT YOU HAVE SUCCESSFULLY PERFORMED THE ABOVE TRANSACTION(S) </p>
           </ListGroup.Item>}



           {order.isPaid && (new Date(order.paidAt) <= new Date(new Date().getTime() -/* 48*60 **/ 60 * 1000)) && <ListGroup.Item>
            <p style={{color:'red'}}>NOTE: PLEASE RELOAD THE SCREEN FIRST, OTHERWISE YOU MAY END UP PERFORMING THE WRONG TRANSACTION !!! </p>
            
            <p>1.) PLEASE PERFORM THE FOLLOWING TRANSACTIONS FROM A HOLDING ACCOUNT</p>
            <p> 2.) AFTER EACH TRANSACITON IS PERFORMED, YOU MAY CLICK THE CHECKBOX UNDER THE 'Done?' COLUMN, TO HELP YOU KEEP TRACK</p>
            <p>3.)  ONCE ALL CREDITS ARE SUCCESSFUL, CLICK  'CHANGE PAYMENT STATUS' .</p>
            <p>4.) YOU MAY CHANGE PAYMENT STATUS AS MUCH AS YOU LIKE, UNTIL YOU ARE READY TO LEAVE THE PAGE.</p>
            <p>5.) IF YOU LEAVE THIS PAGE WITH THE PAYMENT STATUS SET TO PAID, YOU WILL NOT BE ALLOWED TO RETURN, </p>
            <p>    AND A SIGNAL WILL BE SENT TO THE ADMIN THAT YOU HAVE SUCCESSFULLY PERFORMED THE ABOVE TRANSACTION(S) </p>
           </ListGroup.Item>}



           <ListGroup.Item>
            <Row>

             <Col>Account Name </Col>
             <Col>Account Number </Col>
             <Col>Transaction Type </Col> 
             <Col>Amount</Col>
             <Col>Description</Col>
             <Col>Done?</Col>

            </Row>
           </ListGroup.Item>


           {!order.isPaid && 
           
            <>
           <ListGroup.Item>
            <Row>

             <Col>{order.user.name} </Col>
             
             <Col>{order.user.nuban} </Col>
             <Col>DEBIT </Col>
             <Col>₦ {(order.itemsPrice * (1) ).toFixed(2)} </Col>
             <Col>Purchase of goods from bridgeway co-operative</Col>
            <Col>
             <Form.Check 
              type={'checkbox'}
              id={`default-checkbox`}
            
             />
             </Col>
            </Row>
           </ListGroup.Item>

           <ListGroup.Item>
            <Row style ={{color:'red'}}> 

             <Col>TOTAL DEBIT: </Col>
             <Col> </Col>
             <Col> </Col>
             <Col>₦ {(order.totalPrice).toFixed(2)} </Col>
             <Col></Col>
             <Col></Col>
            </Row>
           </ListGroup.Item>
           </>}




           <ListGroup.Item>
            <Row>

             <Col> </Col>
             
             <Col></Col>
             <Col></Col>
             <Col> </Col>
             <Col></Col>

            </Row>
           </ListGroup.Item>

           {order.isPaid &&  (new Date(order.paidAt) <= new Date(new Date().getTime() - /*48*60 * */60 * 1000)) && <ListGroup.Item>
            <Row>

             <Col>Bridgeway Co-operative: </Col>
             
             <Col>{order.bridgewayProfitAccount} </Col>
             <Col>CREDIT </Col>
             <Col>₦ {(order.itemsPrice -(order.orderItems.reduce((acc, item)=>acc +(item.price*item.qty),0) - order.orderItems.reduce((acc, item)=>acc +(item.price*item.promisedQty),0)) - (1*order.orderItems.reduce((acc, item)=>acc +(item.agreedPrice*item.promisedQty),0)) ).toFixed(2)} </Col>
             <Col>Percentage on sale of goods from Bridgeway-cooperative</Col>
             <Col>
             <Form.Check 
              type={'checkbox'}
              id={`default-checkbox`}
            
             />
             </Col>
            </Row>
           </ListGroup.Item>}

           
      {order.isPaid && (new Date(order.paidAt) <= new Date(new Date().getTime() - /*48*60 * */60 * 1000)) && order.orderItems.map((item, index) =>(
            <ListGroup.Item  key ={index}>
            <Row>

             <Col> {index + 1}. {item.vendor}:  </Col>
             <Col>{item.vendorAccountNumber}</Col>
             <Col>CREDIT</Col>
             <Col>₦ {((1) * item.agreedPrice  * item.promisedQty ).toFixed(2)} </Col>
             <Col> Payment for goods sold on Bridgeway-cooperative.</Col>
             <Col>
             <Form.Check 
              type={'checkbox'}
              id={`default-checkbox`}
            
             />
             </Col>
            </Row>
           </ListGroup.Item>
           ))}



{order.isPaid && (new Date(order.paidAt) <= new Date(new Date().getTime() - /*48*60 **/ 60 * 1000)) && (order.orderItems.reduce((acc, item)=>acc +(item.price*item.promisedQty),0) !== order.orderItems.reduce((acc, item)=>acc +(item.price*item.qty),0) ) && <ListGroup.Item>
            <Row>

             <Col>{order.user.name} </Col>
             
             <Col>{order.user.nuban} </Col>
             <Col>CREDIT </Col>
             <Col>₦ {(order.orderItems.reduce((acc, item)=>acc +(item.price*item.qty),0) - order.orderItems.reduce((acc, item)=>acc +(item.price*item.promisedQty),0) ).toFixed(2)} </Col>
             <Col>Refund on goods requested but not delivered.</Col>
             <Col>
             <Form.Check 
              type={'checkbox'}
              id={`default-checkbox`}
            
             />
             </Col>
            </Row>
           </ListGroup.Item>}
      
      {/*<ListGroup.Item>
            <Row>

             <Col> dispatch rider: </Col>
             <Col></Col>
             <Col></Col>
             
             <Col>₦ {(Number(order.deliveryCost)).toFixed(2)} </Col>

            </Row>
      </ListGroup.Item>*/}

        {order.isPaid && (new Date(order.paidAt) <= new Date(new Date().getTime() - /*48*60 **/ 60 * 1000)) && <ListGroup.Item>
            <Row style ={{color:'red'}}>

             <Col>TOTAL CREDIT: </Col>
             <Col> </Col>
             <Col> </Col>
             <Col>₦ {(order.totalPrice).toFixed(2)} </Col>
             <Col></Col>
             <Col></Col>
            </Row>
           </ListGroup.Item>}
      
           
          {/*!order.isPaid && (
            <ListGroup.Item>
             {loadingPay && <Loader/>}
             {!sdkReady ?<Loader/> :(<PayPalButton amount ={order.totalPrice} onSuccess={successPaymentHandler}/>)  }
            </ListGroup.Item>
          )*/}






       
        
       
       {<center>
         <ListGroup > 
      <ListGroup.Item > 
        
    

  <LinkContainer to={`/communications?specificOrderId=${order._id}`}>
  <Button type='submit' variant='primary'> CLICK TO MESSAGE ADMIN </Button>
  </LinkContainer>
     
    
    </ListGroup.Item>
    </ListGroup>
    </center>}



       {/* THE BUTTON FOR DEBITING I THE DATABASE*/}
       {!order.isPaid &&
       
      ( <center>
         <ListGroup > 
      <ListGroup.Item > 
        
       <Button type='button' variant='primary' onClick={paidToggleHandler}> CHANGE TRANSACTION STATUS </Button>
    
     </ListGroup.Item>
     </ListGroup>
    </center>)}

    
     {/* THE BUTTON FOR CREDITING MERCHANTS IN THE DATABASE*/}
    {order.isPaid && (new Date(order.paidAt) <= new Date(new Date().getTime() - /*48*60 **/ 60 * 1000)) && !order.merchantsCredited &&
       
       ( <center>
          <ListGroup > 
       <ListGroup.Item > 
         
        <Button type='button' variant='primary' onClick={merchantCreditToggleHandler}> CHANGE TRANSACTION STATUS </Button>
          
      </ListGroup.Item>
      </ListGroup>
     </center>)
     }
 



  
   { <center>
         <ListGroup > 
      <ListGroup.Item > 
    {/*message && <Message variant='danger'>{message}</Message>*/}
        {error && <Message variant='danger'>{error}</Message>}
       {order && !order.isPaid && successInsufficient &&  !successPay && <Message variant='warning'>Inusufficient Funding in {`${order.user.name}'s`} account, remember to try again later </Message>} 
       {order && !order.isPaid && ( 
         successPay===true ? <Message variant='success'>Order marked as Paid</Message>:
         <Message variant='danger'>Order NOT Paid</Message>
        )
        }
        {order && order.isPaid && (new Date(order.paidAt) < new Date(new Date().getTime() - /*48 * 60 **/ 60 * 1000))  && !order.merchantsCredited ?(
        successCredit? <Message variant='success'>All merchants credited.</Message>:
          <Message variant='danger'>transacations not carried out</Message>
      
         ):(order && order.isPaid && (new Date(order.paidAt) < new Date(new Date().getTime() -  /*48 * 60  **/ 60 * 1000))  && order.merchantsCredited  && <Message variant='success'>All merchants credited.</Message>)
          }
        
        {loading && <Loader/>}
        </ListGroup.Item>
    </ListGroup>

        </center>}


         </ListGroup>
       </Card>}
     </Col>
    </Row>
   
   

</>)
}


export default TransactionScreen;
