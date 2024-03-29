import React ,{ useEffect } from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import {Table,Button} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message.js'
import Loader from '../components/Message.js'
import {/*listOrders,*/ listUnpaidOrders} from '../actions/orderActions.js'





const TransactionListScreen = ({history}) => { //he is taking location & history out of the props, normally it is props.location
  /*const [name,setName] = useState('')
  const [email,setEmail] = useState('')  //component level state right here, not application level state
  const [password,setPassword] = useState('')
  const [confirmpassword,setConfirmPassword] = useState('')
  const [message,setMessage] = useState(null)*/
  const dispatch = useDispatch() //dont forget that real dispatches only take place in action creators, you are only calling useDispatch here

  /*const orderList = useSelector(state => state.orderList);
  const {loading, error,orders } = orderList*/
  
  const unpaidOrderList = useSelector(state => state.unpaidOrderList);
  const {loading, error,orders } = unpaidOrderList

  const userLogin = useSelector(state => state.userLogin);
  const {userInfo } = userLogin
   
  let vendorName =userInfo && userInfo.isMerchant ? userInfo.name : ''

  //THE LOGIC FOR CALCULATING THE TOTAL PRICE OF ITEMS THAT IS SPECIFIC TO EACH VENDOR
  /*const addDecimals = (num) => { return(Math.round(num*100)/100).toFixed(2) }
      
    cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item)=>acc +item.price*item.qty,0))*/

    console.log(orders)
   

  useEffect( () => {
  if(userInfo && userInfo.isTeller){
  /*dispatch(listOrders(vendorName)) */
    dispatch(listUnpaidOrders()) 
  }else{
   history.push('/login')
  }
    }
  ,[dispatch,history,userInfo,vendorName]) //successDelete was passed into useEffect because youu want the list of users to reload, showing the effective delete


    return (
       <>
        <h1>Transactions to Carry Out</h1>
        {userInfo/*.isTeller*/ && 
         <>
        <h6>Below are a list of transactions to be carried out on the bank-One platform. </h6>
        <h6> Click "Details" on each item to view the exact transactions to be carried out for each order  </h6>
        <p style={{backgroundColor:'rgba(233, 212, 96, 0.4)',width:'50%'}} >transactions in yellow are of highest priority and should be performed first </p>
         <br/>
         <h6>Please perform these transactions as soon as possible, so that goods may be sent to clients without delay </h6>
         
         {/*<p style={{backgroundColor:'rgba(0, 255, 0, 0.2)', width:'50%'}}> Orders in green are newly placed orders from customers, please attend to them before the deadline(stated on the order page of each order) </p>
        <p style={{backgroundColor:'rgba(233, 212, 96, 0.4)',width:'50%'}} >Orders in yellow have been partially attended to. You have committed to delivering some items but not all. Please endeavor to commit to all items before the deadline rolls by</p>
         <p style={{backgroundColor:'rgba(255, 0, 0, 0.2)',width:'50%'}} >Orders in red were not attended to before the deadline, the customer's request has gone unfulfilled </p>*/}
         <br/>
         <br/>
         </>
         }



        {/*userInfo.isAdmin && <h5> The colour codes below indicate
           the status of the order. They will change based on merchant/administrator actions </h5>}
        {userInfo.isAdmin && <p  style={{backgroundColor:'rgba(0, 255, 0, 0.2)', width:'50%'}}> Green - New orders, not checked by respective merchants </p>}
        {userInfo.isAdmin && <p style={{backgroundColor:'rgba(233, 212, 96, 0.4)',width:'50%'}}> Yellow - Some Merchants have viewed and committed to delivering their items, the order may still be put forth for delivery, but customers should be informed on missing items </p>}
        {userInfo.isAdmin && <p style={{backgroundColor:'rgba(0, 0, 255, 0.2)',width:'50%'}}> Blue - All Merchants have committed to delivering their items </p>}
        {userInfo.isAdmin && <p > No Colour - Order has been dealt with and delivered, it may be deleted now </p>}
        {userInfo.isAdmin && <p style={{backgroundColor:'rgba(255, 0, 0, 0.2)',width:'50%'}}> Red - Administrator has not dispatched the order before the expected delivery date </p>*/}
        
        {loading ? <Loader/>:error ? <Message variant='danger'>{error}</Message>:(

        <Table striped border hover responsive className ='table-sm'>
         <thead>
          <tr>
           <th>ID</th>
          
           <th>TRANSACTION TYPE</th>
           <th>PLACED ON</th>
           {userInfo/*.isTeller*/ ?(<th>CASH TOTAL</th>):(<th>RECEIVABLE</th> )}{/*We want to give tellers a taste of  what transactions to make, so the are eager to press details*/}
           {/*<th>CREDIT (TO BRIDGEWAY)</th>*/}
           
           <th>SUFFICIENT FUNDS?</th>
          {/*<th>DELIVERED</th>*/}
           
         </tr>
         </thead>
         <tbody>
          {orders.map(order => (  /*english translations of my conditionals for background color below: 
                                                          1.) if it's a debit, (or teller hasn't clicked order isPaid, mark it yellow, as that is more urgent than  credits to merchants and refunds*/
                                                       
            <tr key={order._id} style ={{backgroundColor: !order.isPaid && 'rgba(233, 212, 96, 0.4)'}} >
              <td>{order._id}</td>
              
              <td>{order.isPaid ? 'CREDIT':'DEBIT'}  </td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>₦ {/*userInfo.isAdmin ? (order.totalPrice) :*/ (((order.orderItems.reduce((acc, item)=>acc +(item.price*item.qty),0)))).toFixed(2)}</td>
              {/*<td>₦ {/*userInfo.isAdmin ? (order.totalPrice) : (((order.orderItems.filter((item) => (item.vendor === userInfo.name)).reduce((acc, item)=>acc +(item.price*item.qty),0)))*1/19).toFixed(2)}</td>*/}

              {/*<td>{order.isPaid ? (order.paidAt.substring(0,10)):  
                (<i className='fas fa-times' style={{color:'red'}}></i>)}
              </td>*/}
      
              {<td>{order.insufficientFunds ? (<i className='fas fa-times' style={{color:'red'}}></i>):  
               <i className='fas fa-check' style={{color:'green'}}></i> }
              </td>}


              {/*<td>
                {order.isDelivered ? (order.deliveredAt.substring(0,10)): 
                (<i className='fas fa-times' style={{color:'red'}}></i>)}
              </td>*/}

              <td>
               <LinkContainer to={`/teller/transaction/${order._id}`}>
                <Button variant='light' className='btn-sm'>
                   Details
                </Button>
               </LinkContainer>

              </td>
            </tr>
          ))}
         </tbody>
        </Table>
        )}





       </>

    )

}

export default TransactionListScreen
