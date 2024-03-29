
import React from 'react'
import {BrowserRouter as Router,Route} from 'react-router-dom';
import {Container} from 'react-bootstrap';
import Header from './components/Header.js'
import Footer from './components/Footer.js'
import HomeScreen from './screens/HomeScreen.js'
import ProductScreen from './screens/ProductScreen.js'
import CartScreen from './screens/CartScreen.js'
import LoginScreen from './screens/LoginScreen.js'
import RegisterScreen from './screens/RegisterScreen.js'
import NewAccountScreen from './screens/NewAccountScreen.js'
import ProfileScreen from './screens/ProfileScreen.js'
import ShippingScreen from './screens/ShippingScreen.js'
import PaymentScreen from './screens/PaymentScreen.js'
import PlaceOrderScreen from './screens/PlaceOrderScreen.js'
import PrintOrderScreen from './screens/PrintOrderScreen.js'
import OrderScreen from './screens/OrderScreen.js'
import OrderListScreen from './screens/OrderListScreen.js'
import CommunicationScreen from './screens/CommunicationScreen.js'
import AdminComScreen from './screens/AdminComScreen.js'
import UserListScreen from './screens/UserListScreen.js'
import UserEditScreen from './screens/UserEditScreen.js'
import ProductListScreen from './screens/ProductListScreen.js'
import ProductEditScreen from './screens/ProductEditScreen.js'
import TransactionListScreen from './screens/TransactionListScreen.js'
import TransactionScreen from './screens/TransactionScreen.js'


const App = () => {

    return (
      
      
  <Router> 
      <Header/>
      <main className ='py-3'>
       <Container>
       < Route path='/order/:id' component={OrderScreen}/>
       < Route path='/printorder/:id' component={PrintOrderScreen}/>
       < Route path='/shipping' component={ShippingScreen}/>
       < Route path='/payment' component={PaymentScreen}/>
       < Route path='/placeorder' component={PlaceOrderScreen}/>
       < Route path='/login' component={LoginScreen}/>
       < Route path='/register' component={RegisterScreen}/>
       < Route path='/newaccount' component={NewAccountScreen}/>
       < Route path='/profile' component={ProfileScreen}/>
       < Route path= '/communications' component={CommunicationScreen} />
       
        < Route path='/product/:id' component={ProductScreen}/> 
        < Route path='/cart/:id?' component={CartScreen}/>
        < Route path='/admin/userlist' component={UserListScreen}/>
        < Route path='/admin/user/:id/communications' component={AdminComScreen}/>
        < Route path='/admin/user/:id/edit' component={UserEditScreen}/>
        < Route path='/admin/productlist'  exact component={ProductListScreen}/>
        < Route path='/admin/productlist/:pageNumber'  exact component={ProductListScreen}/>
        < Route path='/admin/product/:id/edit' component={ProductEditScreen}/>
        
        < Route path='/teller/transaction/:id' component={TransactionScreen}/>
        < Route path='/teller/transactionlist' component={TransactionListScreen}/>

        < Route path='/admin/orderlist' component={OrderListScreen}/>
        < Route path='/search/:keyword' component={HomeScreen} exact/>
        < Route path='/page/:pageNumber'exact component={HomeScreen}/>
        < Route path='/search/:keyword/page/:pageNumber'  exact component={HomeScreen}/>
        < Route path='/' exact component={HomeScreen}/>
         
       
       </Container>
      </main>
      <Footer/>
  </Router> 
  
    )
}

export default App
