import React, {useState ,useEffect} from 'react'
import {LinkContainer} from 'react-router-bootstrap'

import { Table, Button, Row ,Col ,Form, ListGroup, Image, Card, ListGroupItem} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message.js'
import Loader from '../components/Message.js'
import {getUserDetails, updateUserProfile,updateUserNotes} from '../actions/userActions.js'
import {listMyOrders} from '../actions/orderActions.js'
import FormContainer from '../components/FormContainer.js'





const ProfileScreen = ({location, history}) => { //he is taking location & history out of the props, normally it is props.location
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')  //component level state right here, not application level state
  const [password,setPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('')
  const [notes,setNotes] =useState('')
  const [message,setMessage] = useState(null)
  
  const dispatch = useDispatch() //dont forget that real dispatches only take place in action creators, you are only calling useDispatch here

  const userDetails = useSelector((state) => state.userDetails);
  const {loading, error,user} = userDetails
   
  
  
   const userLogin = useSelector((state) => state.userLogin);
  const {userInfo} = userLogin

  const userProfileUpdate = useSelector((state) => state.userProfileUpdate);
  const {success} = userProfileUpdate


  const userNotesUpdate = useSelector((state) => state.userNotesUpdate);
  const {success:successNotes} = userNotesUpdate
 
  const orderListMy  = useSelector((state) => state.orderListMy);
  const {loading: loadingOrders,error: errorOrders, orders} = orderListMy
//location .search has the url query string, study it a bit

//because we dont want to able to come into the login screen ONCE WE ARE ALREADY LOGGED IN, effect this in the useEffect below
console.log(user)





  useEffect( () => {
    if(!userInfo){ //cuz user info exists only when you're logged in
       history.push('/login')
    }else{
      if(!user.name){ /*i changed user.name to userInfo.name,to test */
        dispatch(getUserDetails('profile')/*profile serves as the ID here, so that in the get userDetails route, it hits  /api/users/profile route, and not an actual id*/)
          dispatch(listMyOrders())
      }else{
     setName(user.name)
     setEmail(user.email)
     setNotes(user.notes)
     
      }
      
    }

  },[dispatch,history,userInfo ,user])



  const submitHandler = (e) => {
          e.preventDefault()
       if(password !== confirmPassword){
         setMessage('Passwords do not Match')
       }else{
         //this is where we want to to call our action to dispatch login
         
         dispatch(updateUserProfile({id: user._id, name,email, password}))
       }

  }


  const noteSubmitHandler = (e) => {
    e.preventDefault()
 
    dispatch(updateUserNotes({id:userInfo._id,notes}))

}


    return (
      <>
      <br/>
      <hr/>
      <br/>
      
     <center><p style={{color:'black', maxWidth:'600px', fontSize:'1.3rem' }}><span style={{color:'red' , fontSize:'1.8rem' }}>{userInfo.name}</span>, Welcome to your profile! Here you may update your username and password.
     { !userInfo.isAdmin && ' You may also send and reply to messages.'} 
     { (userInfo.isAdmin || userInfo.isMerchant) && ' You can write notes which you\'ll refer to later, for your operation on this platform. Finally you may view instructions regarding how to operate, while on this platform '}
     
     </p></center>
     

      <br/>
      <hr/>
      <br/>
      <br/>
     <Row>
       
      <Col md={3}>
      <h2>User Profile</h2>
      <p>This is your profile information, if you click update, it will take the information you entered and use it as your new profile info.</p>
      <Form onSubmit={submitHandler}>
{/*1*/}      <Form.Group controlId='name'>

       <Form.Label>Enter New Name</Form.Label>
       <Form.Control type='name' placeholder="enter name" value={name} onChange={(e)=>setName(e.target.value)}></Form.Control>
       {/*the value of form control is form control from the state. You need to read about form group from react bootstrap*/}
      </Form.Group>

{/*2*/}       <Form.Group controlId='email'>

        <Form.Label>Enter New Email Address </Form.Label>
        <Form.Control type='email' placeholder="enter email" value={email} onChange={(e)=>setEmail(e.target.value)}></Form.Control>
        {/*the value of form control is form control from the state. You need to read about form group from react bootstrap*/}
       </Form.Group>

{/*3*/}      <Form.Group controlId='password'>

        <Form.Label> Enter New Password  </Form.Label>
        <Form.Control type='password' placeholder="enter password" value={password} onChange={(e)=>setPassword(e.target.value)}></Form.Control>

       </Form.Group>

{/*4*/}     <Form.Group controlId='confirmPassword'>

               <Form.Label>  Confirm New password  </Form.Label>
               <Form.Control type='password' placeholder="confirm password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}></Form.Control>

              </Form.Group>

        <Button type='submit' variant='primary'> Update </Button>
      </Form>
       
       
       <br/>
       <br/>
       <br/>

       <ListGroup variant='flush'>
         <ListGroup.Item>
       { !userInfo.isAdmin && userInfo.adminMessage? (
       <>
       <Row style={{color:'red'}}>
        <i className='fas fa-circle' style={{color:'red', fontSize:'9px', padding:'4px'}}></i> 
         New message! 
       </Row>
       <Row>
          (click chat to view)
       </Row>
       </>
       ):(!userInfo.isAdmin && <Row>
        Want to make an enquiry/complaint ? click chat below
        </Row>)}
        </ListGroup.Item>
        
        <br/>
        {!userInfo.isAdmin && <ListGroup.Item >
        <Row>
      <LinkContainer to='/communications'>
      <Button type='submit' variant='primary'> Chat </Button>
      </LinkContainer>
        </Row>
        </ListGroup.Item>
        }
        </ListGroup>

      </Col>

      <Col md={9}>
      <h2>{!userInfo.isAdmin && !userInfo.isMerchant ? 'My Orders':''}</h2>



{!(userInfo.isAdmin||userInfo.isMerchant) && 
        <>
        <Card>
         <ListGroup>
         <ListGroup.Item>
           <Row>
        <Col ><p>All orders you have made on this platform are in the list below, click on "DETAILS" for each order to view more information about it. It will also tell you whether that order has been dispatched or not. </p> </Col>
       
          </Row>
       </ListGroup.Item>
           <ListGroup.Item>
            
            <Row><h5>Colour code:</h5></Row>
         </ListGroup.Item>
       <ListGroup.Item>
           <Row>
        <Col style={{backgroundColor:'rgba(255, 0, 0, 0.2)'}}>   Red - If the order is in red ,it could not be processed due to insufficient funds. If you still want the order, fund your account, click 'DETAILS' and then click 'I HAVE FUNDED MY ACCOUNT', so that we may continue with it's  processing. </Col>
       
          </Row>
       </ListGroup.Item>
        
         </ListGroup>

         
         </Card>
          <br/>
          <br/>
          </>
        }
      {loadingOrders ? <Loader/>:errorOrders? <Message variant='danger'>{errorOrders}</Message>:(
        
        !(userInfo.isAdmin || userInfo.isMerchant) ?
        <Table striped bordered hover responsive className='table-sm'>
         <thead>
          <tr>
           <th>ID</th>
           <th>PLACED ON</th>
           <th>TOTAL(₦)</th>
           <th>PAID</th>
           <th>DELIVERED</th>
           <th></th>
          </tr>
         </thead>
         <tbody>
          {orders.map(order =>(
            <tr key={order._id} style = {{backgroundColor: order.insufficientFunds && !order.isDelivered?'rgba(255, 0, 0,0.2)':'none' }}>
             <td>{order._id}</td>
             <td>{order.createdAt.substring(0,10)}</td>
             <td>{(order.totalPrice*1).toFixed(2)}</td>
             <td>{order.isPaid ? <i className='fas fa-check'style={{color:'green'}}></i>:(<i className='fas fa-times'style={{color:'red'}}></i>)} </td>

             <td>{order.isDelivered ? order.deliveredAt.substring(0,10):(<i className='fas fa-times'style={{color:'red'}}></i>)} </td>
                 
             <td>
             <LinkContainer to={`/order/${order._id}`}>
              <Button variant='light' className='btn-sm'> Details </Button>
             </LinkContainer>
            </td>
            </tr>
          ))}
         </tbody>
        </Table>
        
      :(
      <>
      
        <h1> My Notes </h1>
       <p> {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader/>}
        </p>

        
         <Form onSubmit={noteSubmitHandler}>
        


          <Form.Group controlId='reply-message'>

          <Form.Label>  Update your notes below: </Form.Label>
          <Form.Control as ="textarea" rows={12}  value={notes} placeholder='type message here...' onChange={(e)=>{setNotes(e.target.value)}}></Form.Control>

         </Form.Group>

         
         <Button type='submit'  /*onClick={noteSubmitHandler}*/ variant='primary'>Save Notes</Button>
         

        </Form>
       
        
        
      </> 
       
       ))}

      </Col>
      </Row>
        {/*<h1>User Profile</h1>*/}
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {success && <Message variant='success'>Profile Updated! changes will be reflected on your next login</Message>}
        {successNotes && <Message variant='success'>Notes Updated!</Message>}
        {loading && <Loader/>}


        {userInfo.isAdmin && 
        <>
        <Card>
         <ListGroup>
           <ListGroup.Item>
            <Row> <h5>YOUR DUTIES ON THIS PLATFORM ARE AS FOLLOWS:</h5></Row>
            <hr/>
            <Row><h5>FOR USERS AND MERCHANTS:</h5></Row>
             <Row>
         <p>1.) Please prompt the teller to debit the customer so that the merchant and delivery deadlines may be recieved</p>      
       <p>2.) Check the merchant's deadline and arrange for a dispatch rider to pick up items from the merchants' various addresses, after the deadline, for each order. </p>
        <p>3.)Ensure a dispatch rider is sent to the customer who made the order on , or before each delivery deadline.  </p>
        <p>4.) If you are unsure of what to do, please refer to the comprehensive instructions in your profile section</p>
        <p> 5.) Click on 'details' for each order,to view order items and the respective merchants' committment to fulfill. You may print the order list for dispatch riders and customers after clicking details. </p>
         <p>6.)Please note the colour code below: </p>
            </Row>
            
            <hr/>
            
            <Row><h5> FOR ORDERS:</h5></Row>
         </ListGroup.Item>
          
         <ListGroup.Item>
           <Row>
        <Col style={{backgroundColor:'rgba(0, 255, 0, 0.2)'}}>   Green - New orders, please ensure they have been paid for by the teller, so that merchants may begin processing them.  </Col>
        <Col style={{backgroundColor:'rgba(233, 212, 96, 0.4)'}} > Yellow - Some Merchants have viewed and committed to providing their items, the order may still be put forth for delivery, but customers should be informed on missing items. </Col>
          </Row>
       </ListGroup.Item>


       <ListGroup.Item>
           <Row>
        <Col style={{backgroundColor:'rgba(255, 0, 0, 0.2)'}}>   Red - Administrator (You) have not dispatched the order before the expected delivery date.  </Col>
        <Col style={{backgroundColor:'rgba(0, 0, 255, 0.2)'}}>Blue - All Merchants have committed to providing  their items to the dispatch rider, upon his arrival  </Col>
          </Row>
       </ListGroup.Item>



       <ListGroup.Item>
           <Row>
        
        <Col style={{backgroundColor:'none'}} >If the order has no colour associated with it then you have committed to fulfilling all items,and have done so before the deadline. No further action needs to be taken. The order will be removed from the list after the deadline.</Col>
          </Row>
       </ListGroup.Item>
       <hr/>
         <ListGroup.Item>
         <Row><h5>FOR PRODUCTS:</h5></Row>
             <Row>
         <p>1.) Please prompt the teller to debit the customer so that the merchant and delivery deadlines may be recieved</p>      
       <p>2.) Check the merchant's deadline and arrange for a dispatch rider to pick up items from the merchants' various addresses, after the deadline, for each order. </p>
        <p>3.)Ensure a dispatch rider is sent to the customer who made the order on , or before each delivery deadline.  </p>
       
            </Row>

         </ListGroup.Item>


         </ListGroup>
        
           
         
         </Card>
          <br/>
          <br/>
          </>
        }


{userInfo.isMerchant && 
        <>
        <Card>
         <ListGroup>
           <ListGroup.Item>
            <Row> <h5>YOUR DUTIES ON THIS PLATFORM ARE AS FOLLOWS:</h5></Row>
            <hr/>
            <Row><h5>FOR USERS AND MERCHANTS:</h5></Row>
             <Row>
         <p>1.) Please prompt the teller to debit the customer so that the merchant and delivery deadlines may be recieved</p>      
       <p>2.) Check the merchant's deadline and arrange for a dispatch rider to pick up items from the merchants' various addresses, after the deadline, for each order. </p>
        <p>3.)Ensure a dispatch rider is sent to the customer who made the order on , or before each delivery deadline.  </p>
        <p>4.) If you are unsure of what to do, please refer to the comprehensive instructions in your profile section</p>
        <p> 5.) Click on 'details' for each order,to view order items and the respective merchants' committment to fulfill. You may print the order list for dispatch riders and customers after clicking details. </p>
         <p>6.)Please note the colour code below: </p>
            </Row>
            
            <hr/>
            
            <Row><h5> FOR ORDERS:</h5></Row>
         </ListGroup.Item>
          
         <ListGroup.Item>
           <Row>
        <Col style={{backgroundColor:'rgba(0, 255, 0, 0.2)'}}>   Green - New orders, please ensure they have been paid for by the teller, so that merchants may begin processing them.  </Col>
        <Col style={{backgroundColor:'rgba(233, 212, 96, 0.4)'}} > Yellow - Some Merchants have viewed and committed to providing their items, the order may still be put forth for delivery, but customers should be informed on missing items. </Col>
          </Row>
       </ListGroup.Item>


       <ListGroup.Item>
           <Row>
        <Col style={{backgroundColor:'rgba(255, 0, 0, 0.2)'}}>   Red - Administrator (You) have not dispatched the order before the expected delivery date.  </Col>
        <Col style={{backgroundColor:'rgba(0, 0, 255, 0.2)'}}>Blue - All Merchants have committed to providing  their items to the dispatch rider, upon his arrival  </Col>
          </Row>
       </ListGroup.Item>



       <ListGroup.Item>
           <Row>
        
        <Col style={{backgroundColor:'none'}} >If the order has no colour associated with it then you have committed to fulfilling all items,and have done so before the deadline. No further action needs to be taken. The order will be removed from the list after the deadline.</Col>
          </Row>
       </ListGroup.Item>
       <hr/>
         <ListGroup.Item>
         <Row><h5>FOR PRODUCTS:</h5></Row>
             <Row>
         <p>1.) Please prompt the teller to debit the customer so that the merchant and delivery deadlines may be recieved</p>      
       <p>2.) Check the merchant's deadline and arrange for a dispatch rider to pick up items from the merchants' various addresses, after the deadline, for each order. </p>
        <p>3.)Ensure a dispatch rider is sent to the customer who made the order on , or before each delivery deadline.  </p>
       
            </Row>

         </ListGroup.Item>


         </ListGroup>
        
           
         
         </Card>
          <br/>
          <br/>
          </>
        }
       
        </>
    )

}

export default ProfileScreen
