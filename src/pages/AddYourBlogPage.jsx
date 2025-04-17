import React from 'react'
import Add from '../components/Add'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'

const AddYourPage = () => {
  return (
    <PageTransition>
      <Navbar/>
      <Add/>
      <Footer/>
    </PageTransition>
  )
}

export default AddYourPage