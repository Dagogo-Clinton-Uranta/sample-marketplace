import React from 'react'
import {Route} from 'react-router-dom'
import  {useState,useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {LinkContainer} from 'react-router-bootstrap'
import {Container,Nav,Navbar,NavDropdown} from 'react-bootstrap'
import {logout} from '../actions/userActions.js'
import SearchBox from './SearchBox.js'
import bridgeway from './bridgeway-logo.jpg' 

const Header = ({history}) => {
   
  const seller = '(Merchant)'
  const dispatch = useDispatch()
  const [cartVisibility, setCartVisibility] = useState(true)

  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin
  
  useEffect(() => {if(userInfo && (userInfo.isMerchant||userInfo.isAdmin)){
     setCartVisibility(false)}
     else{setCartVisibility(true)}
  },[cartVisibilty,setCartVisibility])
  

  const logoutHandler = () => {
    window.location.reload()
    dispatch(logout())
    history.push('/login')
    
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
     <Nav.Link ><i className='fas fa-shopping-cart'></i>Cart</Nav.Link>
</LinkContainer> }

   {userInfo?(
     <NavDropdown title ={userInfo.name} id='username'>
     <LinkContainer to='/profile'>
          <NavDropdown.Item >Profile  </NavDropdown.Item>
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
            <NavDropdown.Item >Users</NavDropdown.Item>
          </LinkContainer>

{/*2*/}      <LinkContainer to='/admin/productlist'>
            <NavDropdown.Item >Products</NavDropdown.Item>
           </LinkContainer>

{/*3*/}      <LinkContainer to='/admin/orderlist'>
            <NavDropdown.Item >Orders</NavDropdown.Item>
           </LinkContainer>

     </NavDropdown>
   )}




   </Nav>

  </Navbar.Collapse>
  </Container>
 </Navbar>

</header>
    )
}

export default Header
/*export as default means that , that's the only thing coming out of this file*/
