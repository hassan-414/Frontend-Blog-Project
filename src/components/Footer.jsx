import React from 'react'
import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "../assets/logo1.png";

const Footer = () => {
  return (
    <>
    <div className="app-wrapper">


    <div className="footer">

      <div className="footer-left">
        <Link to="/" className="logo">
          <img src={logo} alt="Blog Logo" className="logo-img" />
        </Link>
      </div>
      <div>
        <p className='policy'>Privacy Policy | Terms of Use | Contact Us</p>
        <p className='copy'>Copyright 2025. All Rights Reserved.</p>

      </div>

    </div>

    </div>
    </>
  )
}

export default Footer;