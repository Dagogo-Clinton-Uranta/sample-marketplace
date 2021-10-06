import React from 'react'
import {Link} from 'react-router-dom'
import {Card} from 'react-bootstrap'
import Rating from './Rating'
import {useDispatch, useSelector} from 'react-redux'


const ProductComponent = ({product}) => {

  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin
  




  return (
<Card className='my-3 p-3 rounded'>
      <Link to={`/product/${product._id}`}>
       <Card.Img src={product.image} variant='top'/>
      </Link>
 {/*REMEMBER, LINK IS TO='', ROUTE IS PATH=''*/}

  <Card.Body>
     <Link to={`/product/${product._id}`}>
      <Card.Title as='div'>
       <strong>{product.stageName}</strong>
      </Card.Title>
     </Link>


    <Card.Text as='div'>
    <span style={{ fontSize:'0.8rem'}}><Rating value={product.rating} text={`${product.numReviews} review(s)`} color='#f8e825'/></span>
     {/*theres gonna be a rating component eventually, and its there now*/}
    </Card.Text>

    <Card.Text as='h3'>
     ₦ {(product.price*1).toFixed(2)}
     </Card.Text>
     
      <Card.Text as='h6'>
      Vendor: {userInfo && userInfo.isMerchant ?userInfo.name:'Bridgeway'}
  </Card.Text> 

  </Card.Body>
</Card>

  )
}

export default ProductComponent
