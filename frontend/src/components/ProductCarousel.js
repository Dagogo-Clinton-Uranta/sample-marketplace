import React ,{useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Carousel,Image} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import Loader from './Loader'
import Message from './Message'
import {listTopProducts} from '../actions/productActions'

const ProductCarousel = () => {
   const dispatch = useDispatch()

   const productTopRated = useSelector(state => state.productTopRated)
   const {loading,error,products } = productTopRated

    /* useEffect(()=>{
      dispatch(listTopProducts())
    },[dispatch])*/ 

    
    return loading ? <Loader/>:error?<Message variant='danger'>{error}</Message> :(
      <>
       <Carousel variant="dark" fade pause='hover' className="bg-dark carousel-main">
       
   {/*image 1 */}    <Carousel.Item  interval={3500}>
           
            <Image src={'/images/festival.jpg'} alt={'african kids running'} fluid/>
            <Carousel.Caption className="carousel-caption">

             <h1>
              When we come together...
             </h1>
            </Carousel.Caption>
           
          </Carousel.Item>
        
    {/*image 2 */}       <Carousel.Item  interval={3500}>
           
            <Image src={'/images/womansmiling.jpg'} alt={'a smiling woman carrying a bunch of bananas'} fluid/>
            <Carousel.Caption className="carousel-caption">

             <h1>
             life becomes a litte easier ...
             </h1>
            </Carousel.Caption>
          
          </Carousel.Item>
         
     {/*image 3 */}      <Carousel.Item  interval={3500}>
           
            <Image src={'/images/finalised-hero.jpg'} alt={'bridgway logo '} fluid/>
            <Carousel.Caption className="carousel-caption-special">

             <h1><span className="red">Bridgeway</span> <span className="bright-blue">Co-operative</span> </h1>
              <center>
             <h2 className="vanish">
              Pick your products below
             </h2>
             </center>
             
            </Carousel.Caption>
           
          </Carousel.Item>
        
        
        {/*products.map(product =>(
          <Carousel.Item key={product._id} interval={2500}>
           <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid/>
            <Carousel.Caption className="carousel-caption">

             <h4>
              {product.name} - ₦{product.price}
             </h4>
            </Carousel.Caption>
           </Link>
          </Carousel.Item>
        ))*/}

       </Carousel>

      </>

    )

}


export default ProductCarousel
