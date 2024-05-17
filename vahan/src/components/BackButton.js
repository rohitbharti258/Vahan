import React from 'react';
import {  useLocation, useNavigate } from 'react-router-dom';
import '../css/backButton.css'
const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
    console.log(location)
    const goBack = ()=>{
        window.history.back();
    }
  return location.pathname !== '/' ? (
    <button className="backButton" onClick={goBack} >⬅</button>
  ) : null;
};

export default BackButton;
