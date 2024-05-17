import React, { useEffect } from 'react'
import { useState } from 'react';
import '../css/Home.css'
import '../css/Form.css'
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { FaPlus } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { CiRead } from "react-icons/ci";

const Home = () => {
  const [entities, setEntities] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleDeleteEntity = async (tableName) => {
    setIsLoading(true)
    try{
      const res = await fetch(`http://localhost:8000/vahan/deleteEntity/${tableName}`,{
        method:"DELETE"
      });

      if(res.ok) {
        fetchEntitites()
        setIsLoading(true)
      };

    }catch(err){
      console.log(err);
    }
  }
  const fetchEntitites = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/allEntities`, {
        method: "GET",
      });
      const response = await res.json();
      setEntities(response);
      setIsLoading(false)
    } catch (err) {
      console.log({ error: err });
    }
  }
  useEffect(() => {
    fetchEntitites();
  }, [])
  return (
      <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
      <div className='button create-entity-button'>
        <Link  to='/createEntity'>
          <button type="button">
            Create New Entity
          </button>
        </Link>
      </div>
      {entities.length>0 ?
<>
      {entities.map((entity,index) => (
        <div className='container' key={index}>
          <div className="entity">
            <h2>{entity.Tables_in_vahandb}</h2>
            <div className='entityButton'>
              <Link to={`/insertData/${entity.Tables_in_vahandb}`} ><button className='HomeButtons green' type="button"><FaPlus /></button></Link>
              <Link to={`/readData/${entity.Tables_in_vahandb}`}><button className='HomeButtons yellow' type="button"><CiRead/></button></Link>
              <button  className='HomeButtons red'type="button" onClick={()=>handleDeleteEntity(entity.Tables_in_vahandb)}><MdDeleteForever/></button>
            </div>
          </div>
        </div>
      ))}
      </>:<div style={{padding:"20px"}}>No Entity Created Yet</div>}
      </>
      )}
      </div>
  
  )
}



export default Home;
