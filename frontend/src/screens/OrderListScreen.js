import React ,{ useEffect } from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import {Table,Button} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message.js'
import Loader from '../components/Message.js'
import {listOrders} from '../actions/orderActions.js'





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


  useEffect( () => {
  if(userInfo && userInfo.isAdmin ){
  dispatch(listOrders())
  }else{
   history.push('/login')
  }
    }
  ,[dispatch,history,userInfo]) //successDelete was passed into useEffect because youu want the list of users to reload, showing the effective delete


    return (
       <>
        <h1>Orders</h1>
        {loading ? <Loader/>:error ? <Message variant='danger'>{error}</Message>:(

        <Table striped border hover responsive className ='table-sm'>
         <thead>
          <tr>
           <th>ID</th>
           <th>USER</th>
           <th>DATE</th>
           <th>TOTAL</th> {/*AS PER TOTAL PRICE*/}
           <th>PAID</th>
           <th>DELIVERED</th>
           <th></th>
         </tr>
         </thead>
         <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user && order.user.name}</td>
              <td>{order.createdAt.substring(0,10)}</td>
              <td>${order.totalPrice}</td>

              <td>{order.isPaid ? (order.paidAt.substring(0,10)): /*there used to be curly braces around order.paidAt */
                (<i className='fas fa-times' style={{color:'red'}}></i>)}
              </td>

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
