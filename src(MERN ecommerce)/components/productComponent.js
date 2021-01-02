import React from 'react'
import {Link} from 'react-router-dom'
import {Card} from 'react-bootstrap'
import Rating from './Rating'



const productComponent = (props) => {
  return (
<Card ClassName='my-3 p-3 rounded'>
      <Link to={`/product/${props.product._id}`}>
       <Card.Img src={props.product.image} variant='top'/>
      </Link>
 /*REMEMBER, LINK IS TO='', ROUTE IS PATH=''*/

  <Card.Body>
     <Link to={`/product/${props.product._id}`}>
      <Card.Title as='div'>
       <strong>{props.product.name}</strong>
      <Card.Title/>
     </Link>


    <Card.Text as='div'>
      <Rating value={props.product.rating} text={`${props.product.numReviews}reviews`}
      color=''/>
     /*theres gonna be a rating component eventually*/
    </Card.Text>

    </Card.Text as='h3'>
     ${props.product.price}
     <Card.Text>
  </Card.Body>
</Card>

  )
}

export default productComponent
