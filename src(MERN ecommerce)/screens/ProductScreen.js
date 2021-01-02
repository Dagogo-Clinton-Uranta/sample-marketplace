import React {useState useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Row, Col, Image, ListGroup, Card, Button} from 'react-bootstrap'
import Rating from '../components/Rating'

import axios from 'axios'

const ProductScreen = (props) => {
      /*cuz we need a single product from the array of products,and we gotta do it PER PAGE, we use.find method
      TO FILTER IT OUT FROM THE ARRAY*/
   const[product, setProduct] = useState({})

 useEffect(()=>{
   const fetchProduct =async ()=>{
     const res = axios.get('/api/product/${props.match.params.id}')
    setProduct(res.data) }
    fetchProduct()
 },[match])

    // const singleProduct = products.find((p) =>{p._id===props.match.params.id})



      return(
        <div>
        <Link className='btn btn-light my-3' to='/'>GO BACK</Link>
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
             Rating value={product.rating} text={`${product.numReviews} reviews`}/>
            </ListGroup.Item>

            <ListGroup.Item>
             Price:${product.price}
            </ListGroup.Item>

            <ListGroup.Item>
            Description:${product.description}
            </ListGroup.Item>


          </ListGroup>
         </Col>
          <Col md={3}>
           <Card>
            <ListGroup variant='flush'>

             <ListGroup.Item>
               <Row>
                 <Col>Price:</Col>
                 <Col>
                  <strong>${product.price}</strong>
                 </Col>
               </Row>
             </ListGroup.Item>

             <ListGroup.Item>
               <Row>
                 <Col>Status:</Col>
                 <Col>
                  <strong>{product.countInStock > 4 ?'In Stock':product.countInStock <= 3 ?'Few Left !!':product.countInStock = 0 ? 'Out of Stock'}</strong>

                 </Col>
               </Row>
             </ListGroup.Item>

             <ListGroupItem>
               <Button className='btn-block' type='button' disabled={product.countInStock===0}>
                 Add To Cart
               </Button>
             </ListGroupItem>

            </ListGroup>
           </Card>
          </Col>

           <Col></Col>
        </Row>
        </div>
      )

}

export default ProductScreen
