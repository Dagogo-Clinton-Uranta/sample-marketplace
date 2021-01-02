
import React from 'react'
import {BrowserRouter as Router,Route} from 'react-router-dom';
import {Container} from 'react-bootstrap';
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'

const App = () => {

    return (
  <Router> /*we need to wrap our entire appin Router, to use it*/
      <Header/>
      <main className ='py-3'>
       <Container>
       < Route path='/'exact component={HomeScreen}/>
       /*Route is path='', link is to='', why is component JSX?*/
       < Route path='/product/:id' component={ProductScreen}/>

       </Container>
      </main>
      <Footer/>
  </Router>
    )
}

export default App
