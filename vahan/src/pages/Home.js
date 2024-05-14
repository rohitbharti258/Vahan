import React, { useEffect } from 'react'
import { useState } from 'react';
import '../App.css'
import { Link } from 'react-router-dom';
const Home = () => {
  const [entities, setEntities] = useState([
    
  ]);

  const handleAddEnitity = () => {

  }
  const fetchEntitites = async () => {
    try {
      const res = await fetch(`http://localhost:8000/allEntities`, {
        method: "GET",
      });
      const response = await res.json();
      // console.log(response)
      setEntities(response);
      // console.log(entities)

    } catch (err) {
      console.log({ error: err });
    }
  }
  useEffect(() => {
    fetchEntitites();
  }, [])
  return (
    <div>
      <div className='button'>
        <Link  to='/createEntity'>
          <button type="button" onClick={() => { handleAddEnitity() }}>
            Create New Entity
          </button>
        </Link>
      </div>

      {entities.map((entity,index) => (
        <div className='container' key={index}>
          <div className="entity">
            <h2>{entity.Tables_in_vahandb}</h2>
            <div className='entityButton'>
              <Link to={`/insertData/${entity.Tables_in_vahandb}`} ><button type="button">Insert Data</button></Link>
              <Link to="/deleteData"><button type="button">Delete Data</button></Link>
              <Link to="/updateData"><button type="button">Update Data</button></Link>
              <Link to="/readData"><button type="button">Read Data</button></Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}



export default Home;
