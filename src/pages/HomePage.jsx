import React from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import BlogList from '../components/Bloglist'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import { useAuth } from '../context/AuthContext'


const HomePage = () => {
  const { user } = useAuth();
  console.log(user)
  return (
    <PageTransition>
      <Navbar />
      <Banner/>
      <BlogList/>
      <Footer/>
    </PageTransition>
  
  )
}

export default HomePage