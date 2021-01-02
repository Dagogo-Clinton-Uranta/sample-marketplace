import React {useState, useEffect} from 'react';
//import products from '../products';
import {Row, Col} from 'react-bootstrap';
import ProductComponent from '../components/productComponent'
import axios from 'axios'
/*dont forget to npm install axios*/

 const HomeScreen = () => {
   const[products,setProducts]=useState([]);

useEffect(()=>{ //we can' make the useEffect function async
 const fetchProducts = async() => {
   const res = await axios.get('/api/products')
    setProducts(res.data)

 }
 fetchProducts() /*why do we need to call it after creaing it?
  seems like a useEffect thing*/
}, [])
   return (
     <>
      <h1>Latest Products</h1>
       <Row>
        {products.map((product)={
          <Col key={product._id} sm={11} md={6} lg={4} xl={3}>
          <ProductComponent productprop={product} />
          </Col>
        })}
      </Row>
     </>
   )
 };




export default HomeScreen;
