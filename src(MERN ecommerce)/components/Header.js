import React from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Container} from 'react-bootstrap';
import {Navbar, Nav ,Container} from 'react-bootstrap';
export default Header = () => {

    return(
<header>

 <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
  <Container>
  <LinkContainer to="/">
  /*why cant we wrap this in a link tag?*/
  <Navbar.Brand >ProShop</Navbar.Brand>
  </LinkContainer>

  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
   <Nav className="ml-auto">

    /*DONT FORGET TO USE THE CDN OF FONT-AWESOME IN INDEX.HTML
    FROM CDN JS.COM ,JUST TYPE FONT AWESOME AND COPY IT*/

<LinkContainer to='/cart'>
     <Nav.Link ><i className='fas fa-shopping-cart'></i>Cart</Nav.Link>
</LinkContainer>

<LinkContainer to='/login'>
     <Nav.Link><i className='fas fa-user'></i>Sign In</Nav.Link>
</LinkContainer>

   </Nav>

  </Navbar.Collapse>
  <Container>
 </Navbar>

</header>
    )
}

export default Header;
/*import as default means that , that's the only thing coming out of this file*/
