import React from 'react';
import '../css/Navbar.css';
import { Link } from 'react-router-dom';
import BackButton from './BackButton';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className='back'>
      <BackButton/>
        
      </div>
      <Link to="/"><h1 className="brand-text">Headless CMS</h1></Link>
    </nav>
  );
};

export default Navbar;
