import React from 'react'
import {Route} from 'react-router-dom'
import  {useState,useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {LinkContainer} from 'react-router-bootstrap'
import {Container,Nav,Navbar,NavDropdown} from 'react-bootstrap'
import {logout,listUsers} from '../actions/userActions.js'
import {listOrders} from '../actions/orderActions.js'
import SearchBox from './SearchBox.js'
import bridgeway from './bridgeway-logo.jpg' 



  

const Header = () => {
   
  
  const seller = '(Merchant)'
  const dispatch = useDispatch()
  const [cartVisibility, setCartVisibility] = useState(true)

  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin

  const userList = useSelector(state => state.userList);
  const {loading, error,users } = userList
  /*console.log(users)*/

  const orderList = useSelector(state => state.orderList);
  const {loading:loadingOrders, error:errorOrders,orders } = orderList
  
  if(users && userInfo){
userInfo.newMessages = /*users.some((user)=>{user.userMessageNotification % 2===0}) === true?true :false*/true
  }
 

  if(orders && userInfo){
    userInfo.newOrders = /*orders.map(function(order){order.orderItems}).every(function(item){item.promisedQty===0})===true?true:false*/true
  }
  
  useEffect(() => {if(userInfo && (userInfo.isMerchant||userInfo.isAdmin)){
     setCartVisibility(false)}
     else{setCartVisibility(true)}

     if(userInfo && userInfo.isAdmin ){
      dispatch(listUsers())
      }

      if(userInfo && (userInfo.isAdmin || userInfo.isMerchant) ){
        dispatch(listOrders())
        }
      
      

  },[userInfo,orders])
  

  const logoutHandler = () => {
    
    dispatch(logout())
    window.location.assign('/')
     
    
  }
  
    return(
<header>

 <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
  <Container>
  <LinkContainer to="/">
  {/*why cant we wrap this in a link tag?*/}
  <Navbar.Brand ><img src={bridgeway} alt={'the logo of bridgeway bank'} /></Navbar.Brand>
  </LinkContainer>

  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
  <Route render ={({history})=> <SearchBox history={history}/>} /> {/*THERE IS A VERY IMPORTANT THING TO LEARN HERE, IF YOU PUT IN A COMPONONENT DIRECTLY IN THE NAVBAR, IT HAS NO ACCESS TO PROPS, SO YOU GOTTA PUT IT IN A ROUTE AND THEN USE THE RENDER FUNCTION TO PASS IN PROPS..YOU GOTTA STUDY THIS*/}
   <Nav className="ml-auto">

    {/*DONT FORGET TO USE THE CDN OF FONT-AWESOME IN INDEX.HTML
    FROM CDN JS.COM ,JUST TYPE FONT AWESOME AND COPY IT*/}
{cartVisibility &&
<LinkContainer to='/cart'>
     <Nav.Link ><i className='fas fa-shopping-cart'></i>Cart
     {userInfo && userInfo.adminMessageNotification && <i className='fas fa-circle' style={{color:'red', fontSize:'8px', marginLeft:'15px' , marginRight:'-12px'}}></i>}
     </Nav.Link>
     
</LinkContainer> }

   {userInfo?(
     <NavDropdown title ={userInfo.name} id='username'>
     <LinkContainer to='/profile'>
          <NavDropdown.Item >Profile { userInfo && userInfo.adminMessageNotification &&<i className='fas fa-circle' style={{color:'red', fontSize:'7px'}}></i>} </NavDropdown.Item>
          
     </LinkContainer>

       <NavDropdown.Item onClick={logoutHandler} >Logout </NavDropdown.Item>
     </NavDropdown>
   ):(
     <LinkContainer to='/login'>
          <Nav.Link><i className='fas fa-user'></i>Sign In</Nav.Link>
     </LinkContainer>
   )}


{userInfo && userInfo.isMerchant && (
     <NavDropdown title ={'Merchant Functions'} id='username'>

{/*i need to make a merchant token, so that merchants have access to a productlist distinct of admins*/}
{/*1*/}      <LinkContainer to='/admin/productlist'>
            <NavDropdown.Item >Products</NavDropdown.Item>
           </LinkContainer> 

{/*2*/}      <LinkContainer to='/admin/orderlist'>
            <NavDropdown.Item >Orders</NavDropdown.Item>
           </LinkContainer>

     </NavDropdown>
   )}


   {userInfo && userInfo.isAdmin && (
  
  <NavDropdown title ='Admin Functions' id='adminmenu'>

{/*1*/}     <LinkContainer to='/admin/userlist'>
            <NavDropdown.Item >Users {/*(users && userInfo.newMessages) &&<i className='fas fa-circle' style={{color:'red', fontSize:'7px'}}></i>*/}</NavDropdown.Item>
          </LinkContainer>

{/*2*/}      <LinkContainer to='/admin/productlist'>
            <NavDropdown.Item >Products</NavDropdown.Item> {/*i dont think admin is allowed to see products*/}
           </LinkContainer>

{/*3*/}      <LinkContainer to='/admin/orderlist'>
            <NavDropdown.Item >Orders{/* (orders &&userInfo.newOrders) &&<i className='fas fa-circle' style={{color:'red', fontSize:'7px'}}></i>*/}</NavDropdown.Item>
           </LinkContainer>

     </NavDropdown>
     
   )}

{/*console.log(users.some(function(user){user.userMessageNotification}))*/}

{/*console.log(orders.map(function(order){order.orderItems}).every(function(item){item.qty>0} ))*/}

   </Nav>

  </Navbar.Collapse>
  </Container>
 </Navbar>

</header>
    )
}

export default Header
/*export as default means that , that's the only thing coming out of this file*/
