import React from 'react'
import Profile from '../components/Profile'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'

const ProfilePage = () => {
  return (
    <PageTransition>
      <Navbar />
      <Profile />
      <Footer />
    </PageTransition>
  )
}

export default ProfilePage