import React from 'react';
import {Container, Row ,Col} from {react-bootstrap};

export default Footer = () => {

    return(
      <footer>
       <Container>
         <Row>
          <Col className='text-center py-3'>
           Copyright &copy; /* &copy is the HTML entity for the copyright sign*/
          </Col>
         </Row>
       </Container>
      </footer>
    )
}

export default Footer;
