import React from 'react'
import Myblog from '../components/Myblog'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'

const MyBlogPage = () => {
  return (
    <PageTransition>
      <Navbar/>
      <Myblog/>
      <Footer/>
    </PageTransition>
  )
}

export default MyBlogPage