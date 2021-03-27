import React, {useState ,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Form, Button, Row, Col} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message.js'
import Loader from '../components/Message.js'
import {login} from '../actions/userActions.js'
import FormContainer from '../components/FormContainer.js'





const CommunicationScreen = ({location, history}) => { //he is taking location & history out of the props, normally it is props.location
  const [email,setEmail] = useState('')  //component level state right here, not application level state
  const [password,setPassword] = useState('')
  const dispatch = useDispatch() //dont forget that real dispatches only take place in action creators, you are only calling useDispatch here
  const userLogin = useSelector(state => state.userLogin);
  const {loading, error,userInfo } = userLogin
  

  const redirect = location.search ? location.search.split('=')[1]:'/'
//location .search has the url query string, study it a bit

//because we dont want to able to come into the login screen ONCE WE ARE ALREADY LOGGED IN, effect this in the useEffect below

  useEffect( () => {
    /*if(userInfo){ 
       history.push(redirect)
    }*/
  },[/*redirect,history,userInfo*/])



  const submitHandler = (e) => {
          e.preventDefault()
          //this is where we want to to call our action to dispatch login
          window.alert('Message Sent!')
        //dispatch(/*login(email,password)*/)
  }

    return (
       <FormContainer>
        <h1>Send A Message  ...</h1>
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader/>}
        
         <Form onSubmit={submitHandler}>

             {/*okay so if the user is an admin, i want to show a name and email, otherwise
    i want to to hide the name and email stuff*/}

        {userInfo.isAdmin && (
           <>
        <Form.Group controlId='name'>

            <Form.Label> Name: </Form.Label>
            <Form.Control plaintext readOnly defaultValue ={' value from global state '}></Form.Control>
                {/* local state used to be here i don't wish to change the state here, for name and password, so maybe i will eliminate local state */}
          </Form.Group>


         <Form.Group controlId='email'>

          <Form.Label>  Email Address: </Form.Label>
          <Form.Control plaintext readOnly defaultValue='dagogouranta@gmail.com'></Form.Control>
        
         </Form.Group> 
         </>)}

         <Form.Group controlId='reply-message'>

          <Form.Label>  From Customer Service: </Form.Label>
          <Form.Control as ="textarea" rows={6} plaintext readOnly defaultValue={"i will put the message from the database here"}></Form.Control>

         </Form.Group>
         
        

          <Form.Group controlId='reply-message'>

          <Form.Label>  Send New Message </Form.Label>
          <Form.Control as ="textarea" rows={6} placeholder='type message here'></Form.Control>

         </Form.Group>

         
         <Button type='submit' variant='primary'>Send</Button>
         

        </Form>
       
        
        <br/>
        <br/>
        <Row className='py-3'>
         <Col>                       
           Alternatively, you can send an email to <a href={`mailto:customerservice@bridgeway.com?subject=Correspondence from `}> customerservice@bridgeway.com</a>
         </Col>                       
        </Row>              

       </FormContainer>

    )

}

export default CommunicationScreen
