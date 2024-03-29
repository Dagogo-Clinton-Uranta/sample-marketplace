import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {Row, Col , ListGroup, Image , Form ,Button, Card} from 'react-bootstrap'
import Message from '../components/Message.js'
import {addToCart,removeFromCart} from '../actions/cartActions.js'

const CartScreen = ({match, location, history}) => {
      const productId = match.params.id
      const qty =location.search ? Number( location.search.split('=')[1]):1

    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)

    const {cartItems} = cart
    console.log(cart)
    
    const userLogin = useSelector(state => state.userLogin)
  const {loading,error,userInfo} = userLogin

  useEffect(()=>{  
    if(!userInfo){
    history.push(`/login`)
    }
    else if(userInfo.isMerchant||userInfo.isAdmin){
     history.push(`/`)
    }

    if(userInfo && userInfo.isTeller){
      history.push('/teller/transactionlist')
   }
  })


    useEffect(()=>{
     if(productId){
       dispatch(addToCart(productId ,qty))
     }

   },[dispatch,productId,qty])

   const removeFromCartHandler =(id) => {dispatch(removeFromCart(id))}
   const checkoutHandler = () => {history.push('/login?redirect=shipping')} //learn how redirect works properly

   return (

    <Row>
     <Col md={8}>
     <h1>Shopping Cart</h1>
     {cartItems.length===0?<Message>Your cart is empty <Link to='/'>Go Back</Link></Message>:
     (<ListGroup variant='flush'>
      {cartItems.map(item =>{return(
        <ListGroup.Item key ={item.product /*product is the ID here*/}>
      <Row>
       <Col md={2}>

        <Image src={item.image} alt={item.name} fluid rounded></Image>

       </Col>

       <Col md={3}>
        <Link to={`/product/${item.product /*product here is the id*/}`}>
         {item.name}
        </Link>
       </Col>

       <Col md={2}>
        ₦ {(item.price*1).toFixed(2)}
       </Col>

       <Col md={2}>
       <Form.Control as='select' value={item.qty} onChange={(e) =>{dispatch(addToCart(item.product/*prod =id*/, Number(e.target.value)
         )
        )
       }
      } >
         {[...Array(item.countInStock).keys()].map((x) =>(
           <option key={x+1} value={x+1}>
            {x +1}
           </option>
         ))}
       </Form.Control>
       </Col>

       <Col md={2}>
       <Button type='button' variant="light" onClick={() => removeFromCartHandler(item.product
        /*prod =id*/)}> 

         <i className="fas fa-trash"></i> Remove

        </Button>
       </Col>

       </Row>
        </ListGroup.Item>
      )})}
     </ListGroup>)}
     </Col>


     <Col md={4}>
      <Card>
      <ListGroup variant='flush'>
       <ListGroup.Item>
        <h2>Subtotal ({cartItems.reduce((acc,item)=>
          (acc + item.qty),0
    )
     }
      ) items</h2>

      ₦ {cartItems.reduce((acc,item)=>
        (acc + item.qty*item.price),0
  ).toFixed(2)
   }

      </ListGroup.Item>

       <ListGroup.Item>
         <Button type="button" className='btn-block' disabled={cartItems.length===0} onClick={checkoutHandler}>
         Proceed to Checkout
         </Button>

       </ListGroup.Item>

      </ListGroup>
      </Card>
     </Col>

    </Row>
   )

}

export default CartScreen
