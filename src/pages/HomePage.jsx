import React from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import BlogList from '../components/Bloglist'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'

const HomePage = () => {
  return (
    <PageTransition>
      <Navbar/>
      <Banner/>
      <BlogList/>
      <Footer/>
    </PageTransition>
  )
}

export default HomePage