import React from 'react';
import '../css/Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/"><h1 className="brand-text">Headless CMS</h1></Link>
    </nav>
  );
};

export default Navbar;
