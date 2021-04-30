import React, {useState ,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Form, Button, Row, Col} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message.js'
import Loader from '../components/Message.js'
import {register} from '../actions/userActions.js'
import FormContainer from '../components/FormContainer.js'





const RegisterScreen = ({location, history}) => { //he is taking location & history out of the props, normally it is props.location
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')  //component level state right here, not application level state
  const [password,setPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('')
  const [mumFirstName,setMumFirstName] = useState('')
  const [shoeSize,setShoeSize] = useState('')
  const [closestFriend,setClosestFriend] = useState('')
  const [childhoodStreet,setChildhoodStreet] = useState('')
  const [firstEmployment,setFirstEmployment] = useState('')
  const [message,setMessage] = useState(null)
  const dispatch = useDispatch() //dont forget that real dispatches only take place in action creators, you are only calling useDispatch here
  const userRegister = useSelector(state => state.userRegister);
  const {loading, error,userInfo } = userRegister

  const redirect = location.search ? location.search.split('=')[1]:'/'
//location .search has the url query string, study it a bit

//because we dont want to able to come into the login screen ONCE WE ARE ALREADY LOGGED IN, effect this in the useEffect below

  useEffect( () => {
    if(userInfo){ //cuz user info exists only when you're logged in
       history.push(redirect)
    }
  },[redirect,history,userInfo])



  const submitHandler = (e) => {
          e.preventDefault()
       if(password !== confirmPassword){
         setMessage('Passwords do not Match')
       }else if(!mumFirstName || !shoeSize || !closestFriend || !childhoodStreet || !firstEmployment){
        setMessage('Please Make sure to fill in all entries!')
       }
       else{
         //this is where we want to to call our action to dispatch login
       dispatch(register(name,email,password, mumFirstName,shoeSize,closestFriend,childhoodStreet, firstEmployment)) /* follow the trail of this register dispatch to see where it leads  */
       }

  }

    return (
       <FormContainer>
        <h1>Sign up</h1>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader/>}
        <Form onSubmit={submitHandler}>
  {/*1*/}      <Form.Group controlId='name'>

         <Form.Label>  Name</Form.Label>
         <Form.Control type='name' placeholder="enter name" value={name} onChange={(e)=>setName(e.target.value)}></Form.Control>
          {/*the value of form control is form control from the state. You need to read about form group from react bootstrap*/}
        </Form.Group>

  {/*2*/}        <Form.Group controlId='email'>

          <Form.Label>  Email Address </Form.Label>
          <Form.Control type='email' placeholder="enter email" value={email} onChange={(e)=>setEmail(e.target.value)}></Form.Control>
           {/*the value of form control is form control from the state. You need to read about form group from react bootstrap*/}
         </Form.Group>

  {/*3*/}      <Form.Group controlId='password'>

          <Form.Label>  Password  </Form.Label>
          <Form.Control type='password' placeholder="enter password" value={password} onChange={(e)=>setPassword(e.target.value)}></Form.Control>

         </Form.Group>

 {/*4*/}      <Form.Group controlId='confirmPassword'>

                 <Form.Label>  Confirm password  </Form.Label>
                 <Form.Control type='password' placeholder="confirm password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}></Form.Control>

                </Form.Group>

            { password === confirmPassword && 
            <>
          <Form.Group controlId='mumFirstName'>
        
         <Form.Label> What is your mother's first name ?   </Form.Label>
          <Form.Control type='input' placeholder="please make sure to spell your answers correctly" value={mumFirstName} onChange={(e)=>setMumFirstName(e.target.value)}></Form.Control>

         </Form.Group>

         <Form.Group controlId='shoeSize'>
        
        <Form.Label> What is your shoe size?   </Form.Label>
        <Form.Control type='input' placeholder="please make sure to spell your answers correctly" value={shoeSize} onChange={(e)=>setShoeSize(e.target.value)}></Form.Control>

        </Form.Group>

        <Form.Group controlId='closestFriend'>
        
        <Form.Label> What is the name of your closest friend ?   </Form.Label>
        <Form.Control type='input' placeholder="please make sure to spell your answers correctly" value={closestFriend} onChange={(e)=>setClosestFriend(e.target.value)}></Form.Control>

        </Form.Group>

        <Form.Group controlId='childhoodStreet'>
        
       <Form.Label> What is the name of the street you lived on as a child ?   </Form.Label>
        <Form.Control type='input' placeholder="please make sure to spell your answers correctly" value={childhoodStreet} onChange={(e)=>setChildhoodStreet(e.target.value)}></Form.Control>

        </Form.Group>


        <Form.Group controlId='firstEmployment'>
        
         <Form.Label> What is the name of the first place you worked at (employment) ?   </Form.Label>
        <Form.Control type='input' placeholder="please make sure to spell your answers correctly" value={firstEmployment} onChange={(e)=>setFirstEmployment(e.target.value)}></Form.Control>

        </Form.Group>
        </>
       }

          <Button type='submit' variant='primary'>Register</Button>
        </Form>

        <Row className='py-3'>
         <Col>
           Have an account?<Link to={redirect?`$login/redirect=${redirect}`:'/login'}> Login</Link>
         </Col>
        </Row>

       </FormContainer>

    )

}

export default RegisterScreen
