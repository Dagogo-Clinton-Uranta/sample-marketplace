import React, { useEffect } from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import {Table,Button,Row,Col,ListGroup, Image, Card, ListGroupItem} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message.js'
import Loader from '../components/Message.js'
import Paginate from '../components/Paginate.js'
import {deleteProduct,listProducts,createProduct} from '../actions/productActions.js'
import {PRODUCT_CREATE_RESET } from '../constants/productConstants.js'




const ProductListScreen =({history, match}) => { //he is taking location & history out of the props, normally it is props.location
  const pageNumber = match.params.pageNumber || 1
  const dispatch = useDispatch() //dont forget that real dispatches only take place in action creators, you are only calling useDispatch here

  const productList = useSelector(state => state.productList);
  const {loading, error,products,page,pages} = productList

  const productCreate = useSelector(state => state.productCreate);
  const { loading:loadingCreate, error:errorCreate,success:successCreate , product:createdProduct} = productCreate

  const productDelete = useSelector(state => state.productDelete);
  const { loading:loadingDelete, error:errorDelete,success:successDelete } = productDelete

  const userLogin = useSelector(state => state.userLogin);
  const {userInfo } = userLogin

  /* const keyword = ''just in case you need an empty string in listProducts */

  let vendorName = userInfo.isMerchant ? userInfo.name :''



//location .search has the url query string, study it a bit

//because we dont want to able to come into the login screen ONCE WE ARE ALREADY LOGGED IN, effect this in the useEffect below

useEffect(()=> {
  if(!userInfo){
    
    history.push('/login')
    
  }

  if(userInfo && userInfo.isTeller){
    history.push('/teller/transactionlist')
 }
 
  },[ userInfo,history,dispatch,successCreate])



  /*useEffect(()=> {
    if(userInfo.isMerchant){
      vendorName = userInfo.name
    }
    else if(userInfo.isAdmin){
      
      vendorName = /(.*)/
    }

    },[userInfo])*/




  useEffect( () => {
    dispatch({type: PRODUCT_CREATE_RESET })
  if(userInfo.isAdmin === false && userInfo.isMerchant === false){
  history.push('/login')

  }

  if(successCreate){
   history.push(`/admin/product/${createdProduct._id}/edit`)
 }else{
   dispatch(listProducts(' ',pageNumber,vendorName))
 }


    }
  ,[dispatch,history,userInfo, successDelete,successCreate,createdProduct,pageNumber]) //successDelete was passed into useEffect because youu want the list of users to reload, showing the effective delete



 const deleteHandler = (id) => {
if(window.confirm('Are you sure you want to delete this item ?')){ //window.confirm is good practice for if you want to delete items
  dispatch(deleteProduct(id))
}

  }

  const createProductHandler = () => {
    dispatch(createProduct())
    }

    return (
       <>


       <br/>
       <h1>Products</h1>
       <center><p style={{color:'black'}}>
     { userInfo.isAdmin && 
     <>
    <Card>
   <ListGroup>
       <ListGroup.Item>
         <Row>
       <h5>INSTRUCTIONS:</h5>
        </Row>
        <Row>
     <p>This is a list of all products on the marketplace, you may view them here, and track which items are sold by a particular vendor. 
     If you want to message a vendor regarding a particular product , please keep note of the ID and message the vendor from your profile, using the product ID</p>
        </Row>
     </ListGroup.Item>
     </ListGroup>
     </Card>
     <br/>
     <br/>
     </>
     } 

     { userInfo.isMerchant &&
     
     <Card>
     <ListGroup>
         <ListGroup.Item>
         <Row>
       <h5>INSTRUCTIONS:</h5>
        </Row>
        <Row>
          
       This is a list of all products on the marketplace. You may edit ,create or delete them here.You may also change product stock here. Simply Click the 'edit' button to
       make changes to a product(including updating it's stock), or 'delete' to remove it from the list of products you sell on this platform
       </Row>
       </ListGroup.Item>

       <ListGroup.Item>
         
         <Row  style={{backgroundColor:'rgba(233, 212, 96, 0.4)'}} >
           
       Items in Yellow are products that are ALMOST out of stock (less than 10 items) , please click edit and change the number for "count in stock". Also ensure that you are able to commit this number to our customers.
       </Row> 
        </ListGroup.Item>


       <ListGroup.Item>
         
        <Row  style={{backgroundColor:'rgba(255, 0, 0, 0.2)'}} >
          
      Items in red are products that are out of stock,THEY ARE NOT VISIBLE ON THE MARKET PLACE FOR SALE, please click edit and change the number for "count in stock". Also ensure that you are able to commit this number to our customers.
      </Row> 
       </ListGroup.Item>

       </ListGroup>
       </Card>
     
     }

     </p></center>
        <Row className='align-items-center'>
         <Col>
          
         </Col>
         <Col className="text-right">
          {userInfo.isMerchant  && (<Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> Create Product
          </Button>)}
         </Col>
        </Row>
        {loadingDelete && <Loader/> }
        {errorDelete &&<Message variant='danger'>{errorDelete}</Message> }

        {loadingCreate && <Loader/> }
        {errorCreate &&<Message variant='danger'>{errorCreate}</Message> }

        {loading ? <Loader/>:error ? <Message variant='danger'>{error}</Message>:(
         <>
        <Table striped bordered hover responsive className ='table-sm'>
         <thead>
          <tr>
           <th>ID</th>
           <th>NAME</th>
           <th>AGREED PRICE</th>
           <th>MARKETPLACE PRICE</th>
           <th>SIZE</th>
           {userInfo.isAdmin && <th>VENDOR</th>}
           <th></th>
         </tr>
         </thead>
         <tbody>
          {products.map(product => (
            <tr key={product._id} style={{backgroundColor:product.countInStock<10 && product.countInStock>0 ? 'rgba(233, 212, 96, 0.4)':(product.countInStock<1 && 'rgba(255, 0, 0, 0.2)')}}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>₦ {(product.agreedPrice*1).toFixed(2)}</td>
              <td>₦ {(product.price).toFixed(2)}</td>
              <td>{product.size}</td>
              {userInfo.isAdmin && <td>{product.vendor}</td>}
              {userInfo.isMerchant && (<td>
               <LinkContainer to={`/admin/product/${product._id}/edit`}>
                <Button variant='light' className='btn-sm'>
                   <i className='fas fa-edit'></i> Edit
                </Button>
               </LinkContainer>
               <Button variant='danger' className='btn-sm' onClick={()=>deleteHandler(product._id)}>
                 <i className='fas fa-trash'></i> Delete
               </Button>
              </td>)}
            </tr>
          ))}
         </tbody>
        </Table>

         <Paginate pages={pages} page={page} isAdmin={true}/>
        </>
        )}





       </>

    )

}

export default ProductListScreen
