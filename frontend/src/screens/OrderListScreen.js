import React ,{ useEffect } from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import {Table,Button} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message.js'
import Loader from '../components/Message.js'
import {listOrders} from '../actions/orderActions.js'
import { Row ,Col ,Form, ListGroup, Image, Card, ListGroupItem} from 'react-bootstrap'




const OrderListScreen = ({history}) => { //he is taking location & history out of the props, normally it is props.location
  /*const [name,setName] = useState('')
  const [email,setEmail] = useState('')  //component level state right here, not application level state
  const [password,setPassword] = useState('')
  const [confirmpassword,setConfirmPassword] = useState('')
  const [message,setMessage] = useState(null)*/
  const dispatch = useDispatch() //dont forget that real dispatches only take place in action creators, you are only calling useDispatch here

  const orderList = useSelector(state => state.orderList);
  const {loading, error,orders } = orderList
  
  

  const userLogin = useSelector(state => state.userLogin);
  const {userInfo } = userLogin
   
  let vendorName =userInfo && userInfo.isMerchant ? userInfo.name : ''

  //THE LOGIC FOR CALCULATING THE TOTAL PRICE OF ITEMS THAT IS SPECIFIC TO EACH VENDOR
  /*const addDecimals = (num) => { return(Math.round(num*100)/100).toFixed(2) }
      
    cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item)=>acc +item.price*item.qty,0))*/

    console.log(orders)
   

  useEffect( () => {
  
    if(userInfo && userInfo.isTeller){
      history.push('/teller/transactionlist')
   }
  
    if(userInfo){
  dispatch(listOrders(vendorName)) /*console.log('orders nigga')*/
  }else{
   history.push('/login')
  }
    }
  ,[dispatch,history,userInfo,vendorName]) //successDelete was passed into useEffect because youu want the list of users to reload, showing the effective delete


    return (
       <  >
        <h1>Orders</h1>
        {/*userInfo.isMerchant && 
         <>
        <h5>Here you may view new orders. Click on each order to view details and confirm whether you are able to fulfill them. Please note the colour code below:</h5>
         <br/>
         <p style={{backgroundColor:'rgba(0, 255, 0, 0.2)', width:'50%'}}> Orders in green are newly placed orders from customers, please attend to them before the deadline(stated on the order page of each order) </p>
        <p style={{backgroundColor:'rgba(233, 212, 96, 0.4)',width:'50%'}} >Orders in yellow have been partially attended to. You have committed to delivering some items but not all. Please endeavor to commit to all items before the deadline rolls by</p>
         <p style={{backgroundColor:'rgba(255, 0, 0, 0.2)',width:'50%'}} >Orders in red were not attended to before the deadline, the customer's request has gone unfulfilled </p>
         <br/>
         <br/>
         </>
        */}


     {userInfo.isMerchant && 
        <>
        <Card>
         <ListGroup>
           <ListGroup.Item>
            <Row> <h5>INSTRUCTIONS:</h5></Row>
             
             <Row>
        Here you may view new orders. Click on each order to view details and confirm whether you are able to fulfill them. Please note the colour code below.
         
            </Row>
            
            <hr/>
            
            <Row><h5>Colour code:</h5></Row>
         </ListGroup.Item>
          
         <ListGroup.Item>
           <Row>
        <Col style={{backgroundColor:'rgba(0, 255, 0, 0.2)'}}>  Orders in green are newly placed orders from customers, please attend to them before the deadline(stated on the order page of each order). </Col>
        <Col style={{backgroundColor:'rgba(233, 212, 96, 0.4)'}} > Orders in yellow have been partially attended to. You have committed to delivering some items but not all. Please endeavor to commit to all items before the deadline rolls by. </Col>
          </Row>
       </ListGroup.Item>


       <ListGroup.Item>
           <Row>
        <Col style={{backgroundColor:'rgba(255, 0, 0, 0.2)'}}>  Orders in red were not attended to before the deadline, the customer's request has gone unfulfilled. </Col>
        <Col style={{backgroundColor:'none'}} >If the order has no colour associated with it then you have committed to fulfilling all items,and have done so before the deadline. No further action needs to be taken. The order will be removed from the list after the deadline.</Col>
          </Row>
       </ListGroup.Item>
         </ListGroup>
    
         </Card>
          <br/>
          <br/>
          </>
        }

      










        {userInfo.isAdmin && <h5> The colour codes below indicate
           the status of the order. They will change based on merchant/administrator actions </h5>}
        {userInfo.isAdmin && <p  style={{backgroundColor:'rgba(0, 255, 0, 0.2)', width:'50%'}}> Green - New orders, not checked by respective merchants </p>}
        {userInfo.isAdmin && <p style={{backgroundColor:'rgba(233, 212, 96, 0.4)',width:'50%'}}> Yellow - Some Merchants have viewed and committed to delivering their items, the order may still be put forth for delivery, but customers should be informed on missing items </p>}
        {userInfo.isAdmin && <p style={{backgroundColor:'rgba(0, 0, 255, 0.2)',width:'50%'}}> Blue - All Merchants have committed to delivering their items </p>}
        {userInfo.isAdmin && <p > No Colour - Order has been dealt with and delivered, it may be deleted now </p>}
        {userInfo.isAdmin && <p style={{backgroundColor:'rgba(255, 0, 0, 0.2)',width:'50%'}}> Red - Administrator has not dispatched the order before the expected delivery date </p>}
        {loading ? <Loader/>:error ? <Message variant='danger'>{error}</Message>:(

        <Table striped border hover responsive className ='table-sm'>
         <thead>
          <tr>
           <th>ID</th>
           <th>USER</th>
           <th>PLACED ON</th>
           {userInfo.isAdmin ?(<th>TOTAL</th>):(<th>RECEIVABLE</th> )}{/*AS PER TOTAL PRICE*/}
           {/*<th>PAID</th>*/}
           <th>DELIVERED</th>
           <th></th>
         </tr>
         </thead>
         <tbody>
          {orders.map(order => (  /*english translations of my conditionals: 
                                                          1.) if youre a merchant AND every condition except (all items are zero) AND at least one item has been committed to(i think  i wanna try NOT(all items are fully committed to)), make the bar yellow
                                                        : 2.) if youre not a merchant and the date now is two(or more) days greater than the day the order was put in, give it a red,it has failed to be attended to by the admin
                                                         :3.) if youre an admin and the item hasnt been delivered and it has been 4 days or greater since its creation, give it a red, it's past the due date
                                                         :4.)if all items have no promises, and you're a merchant and it hasnt been up to two days since the order was created, then it's a fresh order, give it green
                                                         :5) if the user is an admin,and at least one item has been promised AND at least one item has been promised(again ,dodgy logic, try !(all have been fully promised) ),  give it a yellow, it is incomplete
                                                         :6)if the logged in user is an admin and all items are fully committed to, then give the color a blue, it is a fully completed order.
                                                         :7)if the user is an admin and all merchants have promised something, give it blue it is a fully committed order ready to go  */
            <tr key={order._id} style={{backgroundColor:/*1*/ userInfo.isMerchant && !(order.orderItems.filter((item) => (item.vendor === userInfo.name)).every((item) => (item.promisedQty === 0))) && order.orderItems.filter((item) => (item.vendor === userInfo.name)).some((item) => (item.promisedQty !== 0))?'rgba(233, 212, 96, 0.4)'
                                                        /*2*/ :(userInfo.isMerchant && (order.orderItems.filter((item) => (item.vendor === userInfo.name)).every((item) => (item.promisedQty === 0))) &&  new Date() > new Date(new Date(order.createdAt).getTime() + 48 * 60 * 60 * 1000)  ?'rgba(255,0,0,0.2)'
                                                        /*3*/  :(!order.isDelivered && userInfo.isAdmin && new Date() > new Date(new Date(order.createdAt).getTime() + 96 * 60 * 60 * 1000) ?  'rgba(255,0,0,0.2)'
                                                        /*4*/ :(order.orderItems.every((item) => (item.promisedQty === 0)) && userInfo.isMerchant && new Date() < new Date(new Date(order.createdAt).getTime() + 48 * 60 * 60 * 1000) ? 'rgba(0, 255, 0, 0.2)'
                                                        /*5*/  :(userInfo.isAdmin && order.orderItems.some((item) => (item.promisedQty !== 0)) && !(order.orderItems.every((item) => (item.promisedQty === 0)))?'rgba(233, 212, 96, 0.4)'
                                                        /*6*/ :(userInfo.isAdmin && order.orderItems.every((item) => (item.promisedQty === item.qty))  ? 'rgba(0, 0, 255, 0.2)'
                                                        /*7*/  :(order.orderItems.every((item) => (item.promisedQty === 0)) && userInfo.isAdmin && (new Date() < new Date(new Date(order.createdAt).getTime() +  96* 60 * 60 * 1000)) && 'rgba(0, 255, 0, 0.2)')))))) }} >
              <td>{order._id}</td>
              <td>{order.user && order.user.name}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>₦ {userInfo.isAdmin ? (order.totalPrice) : (((order.orderItems.filter((item) => (item.vendor === userInfo.name)).reduce((acc, item)=>acc +(item.price*item.qty),0)))*18/19).toFixed(2)}</td>

              {/*<td>{order.isPaid ? (order.paidAt.substring(0,10)): there used to be curly braces around order.paidAt 
                (<i className='fas fa-times' style={{color:'red'}}></i>)}
              </td>*/}

              <td>
                {order.isDelivered ? (order.deliveredAt.substring(0,10)): /*there used to be curly braces around order.deliveredAt */
                (<i className='fas fa-times' style={{color:'red'}}></i>)}
              </td>

              <td>
               <LinkContainer to={`/order/${order._id}`}>
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

export default OrderListScreen
