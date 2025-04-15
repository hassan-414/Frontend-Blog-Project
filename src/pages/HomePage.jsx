import React from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import BlogList from '../components/Bloglist'
import Footer from '../components/Footer'


const HomePage = () => {
  return (
    <>
    <Navbar/>
    <Banner/>
    <BlogList/>
    <Footer/>
    </>
  )
}

export default HomePage