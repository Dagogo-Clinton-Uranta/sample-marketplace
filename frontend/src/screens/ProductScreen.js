import React ,{useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Row, Col, Image, ListGroup, Card, Button,Form} from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import {useDispatch, useSelector} from 'react-redux'
import {listProductDetails,createProductReview} from '../actions/productActions.js'
import {PRODUCT_CREATE_REVIEW_RESET} from '../constants/productConstants.js'


const ProductScreen = ({history,match}) => {
      /*cuz we need a single product from the array of products,and we gotta do it PER PAGE, we use.find method
      TO FILTER IT OUT FROM THE ARRAY*/
   const [qty ,setQty] = useState(1)
   const [rating ,setRating] = useState(0)
   const [comment ,setComment] = useState('')

  const dispatch = useDispatch()
  
  const productDetails = useSelector(state => state.productDetails)
  const {product,loading, error} = productDetails

  const productCreateReview = useSelector(state => state.productCreateReview)
  const {success:successProductReview, error:errorProductReview} = productCreateReview
  

  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin
  
 useEffect(()=>{
  dispatch(listProductDetails(match.params.id))
  
  if(successProductReview){
    alert("Thank you for your review!")
    setRating(0)
    setComment('')
    dispatch({type:PRODUCT_CREATE_REVIEW_RESET})
  }

   
 },[dispatch,match,successProductReview])


const addToCartHandler = () => {
  if(!userInfo){
    window.alert('Please sign in to purchase')
  }
  else if(userInfo && (userInfo.isAdmin||userInfo.isMerchant)){
    window.alert('Only customers may make purchases, please register as a customer')
  }
    else{history.push(`/cart/${match.params.id}?qty=${qty}`)} //there was a blank set of curly braces here, you just put quantity in 
}
  
const previousPageHandler = () => {
  
  window.history.back()
}

 

  console.log(productDetails)



const submitHandler =(e) =>{
  e.preventDefault() //since submit handler is being called inside a form
  dispatch(createProductReview(match.params.id,{
    rating,
    comment //both rating and comment are coming from local/comment state
  }))
}

  

      return(
        <>
        <Button className='btn btn-light my-3' onClick={previousPageHandler}>GO BACK</Button>
        {loading ? <Loader/>:error ?<Message variant='danger'>{error}</Message>:(
          <>
          <Meta title={product.name}/>
          <Row>
           <Col md={6}>
           <Image src={product.image} alt={product.name} fluid>
           </Image>
           </Col>
           <Col md={3}>
            <ListGroup variant='flush'>

              <ListGroup.Item>
               <h3>{product.name}</h3>
              </ListGroup.Item>

              <ListGroup.Item>
               <Rating value={product.rating} text={`${product.numReviews} ${product.numReviews===1?'review':'reviews'}`}/>
              </ListGroup.Item>

              <ListGroup.Item>
               Price:₦ {product.price}
              </ListGroup.Item>

              <ListGroup.Item>
              Description:{product.description}
              </ListGroup.Item>


            </ListGroup>
           </Col>
            <Col md={3}>
             <Card>
              <ListGroup variant='flush'>
              <ListGroup.Item>
                 <Row>
                   <Col>Vendor:</Col>
                   <Col>
                    <strong> {product.vendor}</strong>
                   </Col>
                 </Row>
               </ListGroup.Item>

               <ListGroup.Item>
                 <Row>
                   <Col>Price:</Col>
                   <Col>
                    <strong>₦ {product.price}</strong>
                   </Col>
                 </Row>
               </ListGroup.Item>

               <ListGroup.Item>
                 <Row>
                   <Col>Status:</Col>
                   <Col>
                    <strong>{product.countInStock > 4 ?'In Stock':product.countInStock <= 3 ?'Few Left !!':product.countInStock === 0 ? 'Out of Stock':'Currently being restocked' /*this currenty being restocked is not the right thing, you just put it there as filler, till the need comes to fix it */}</strong>

                   </Col>
                 </Row>
               </ListGroup.Item>
             {product.countInStock > 0 && (
               <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                    <Form.Control as='select' value={qty} onChange={(e) =>{setQty(e.target.value)}} >
                      {[...Array(product.countInStock).keys()].map(x =>(
                        <option key={x+1} value={x+1}>
                         {x +1}
                        </option>
                      ))}
                    </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
             )}

               <ListGroup.Item>
                 <Button onClick={addToCartHandler} className='btn-block' type='button' disabled={product.countInStock===0}>
                   Add To Cart
                 </Button>
               </ListGroup.Item>

              </ListGroup>
             </Card>
            </Col>


          </Row>
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews </Message>}
              <ListGroup variant="flush">
               {product.reviews.map(review =>( /*i changed products to product, come bacck here if you're having probs */
                 <ListGroup.Item key={review._id}>
                  <strong>{review.name}</strong>
                   <Rating value={review.rating} />
                   <p>{review.createdAt.substring(0,10)}</p>
                   <p>{review.comment}</p>
                 </ListGroup.Item>
               ) )}
               <ListGroup.Item>
                <h2>Write a Customer Review</h2>
                {errorProductReview && <Message variant='danger'>{errorProductReview} </Message>}

                {userInfo && (!userInfo.isAdmin || !userInfo.isMerchant)?(<Form onSubmit={submitHandler}>
                <Form.Group controlId='rating'>
                <Form.Label>Rating</Form.Label>
                 <Form.Control as='select' value={rating} onChange={(e)=>setRating(e.target.value)}>

                  <option value=''>Select...</option>
                   <option value='1'>1-Poor</option>
                   <option value='2'>2-Fair</option>
                   <option value='3'>3-Good</option>
                   <option value='4'>4-Very Good</option>
                   <option value='5'>5-Excellent</option>

                 </Form.Control>
               </Form.Group>

               <Form.Group controlId='comment'>
                 <Form.Label>Comment</Form.Label>
                 <Form.Control as='textarea' row='3' value={comment} onChange={(e)=>setComment(e.target.value)}>
                 </Form.Control>
               </Form.Group>

              <Button type='submit' variant='primary'> Submit </Button>

                </Form>):
                  <Message> Please<Link to='/login'>sign in</Link> to write a review {' '} </Message>}
               </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          </>
        )}

        </>
      )

}

export default ProductScreen
