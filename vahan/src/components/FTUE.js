import React, { useState, useEffect } from 'react';
import '../css/FTUE.css'; // Import CSS for dark tech theme
import { Link } from 'react-router-dom';

const FTUE = ({showIntro}) => {
  const [showHeading, setShowHeading] = useState(false);
  const [showSubheading, setShowSubheading] = useState(false);

  useEffect(() => {
    const headingTimer = setTimeout(() => {
      setShowHeading(true);
    }, 500);

    const subheadingTimer = setTimeout(() => {
      setShowSubheading(true);
    }, 1800);

    return () => {
      clearTimeout(headingTimer);
      clearTimeout(subheadingTimer);
    };
  }, []);

  const headingWords = ["Welcome", "to", "Rohit's", "CMS", "CRUD", "Application"];

  return (
    <div className="dark-tech-container">
      <div className="text-container">
        <h1 className={`heading ${showHeading ? 'animate' : ''}`}>
          {showHeading && headingWords.map((word, index) => (
            <span key={index} style={{ animationDelay: `${index * 0.5}s` }}>{word} </span>
          ))}
        </h1>
        <p className={`subheading ${showSubheading ? 'animate' : ''}`}>Experience the power of content management!</p>
      </div>
    </div>
  );
}

export default FTUE;
