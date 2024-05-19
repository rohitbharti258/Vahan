import React, { useEffect } from 'react'
import { useState } from 'react';
import '../css/Home.css'
import '../css/Form.css'
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { FaPlus } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { CiRead } from "react-icons/ci";
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [entities, setEntities] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  // const[errorMessage,setErrorMessage]  = useState('')

  const navigate = useNavigate();
  const handleDeleteEntity = async (tableName) => {
    setIsLoading(true)
    try{
      const res = await fetch(`http://localhost:8000/vahan/deleteEntity/${tableName}`,{
        method:"DELETE"
      });

      if(res.ok) {
        setEntities(entities.filter((val) => val.Tables_in_vahandb != tableName))
        setIsLoading(false)
        toast.success('Table Deleted successFully', {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          });
      }else{
        toast.error('Table cant be Deleted', {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          pauseOnHover: false,
          closeOnClick: true,
          });
      }

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
      // console.log(response);

      if(!res.ok){
        // setErrorMessage("Failed to get entitites")
        setIsLoading(false);
          const text = await res.text();
          const errmsg = await JSON.parse(text).sqlMessage;
          toast.error(errmsg, {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          pauseOnHover: false,
          closeOnClick: true,
          });
        return;
      }
      setEntities(response);
      setIsLoading(false);
      // toast.success('Entities fetched', {
      //   position: "top-center",
      //   autoClose: 2000,
      //   hideProgressBar: false,
      //   pauseOnHover: false,
      //   closeOnClick: true,
      //   });
      
    } catch (err) {
      // setErrorMessage("Failed to get entitites")
      toast.error('Internal Server Error', {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        pauseOnHover: false,
        closeOnClick: true,
        });
      setIsLoading(false);
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
      {/* {successMessage && <p style={{textAlign:'center',color:'green'}}>{successMessage}</p>} */}

      {entities.length>0 ?
<>
      {entities.map((entity,index) => (
        <div className='container' key={index}>
          <div className="entity">
            <Link to={`/readData/${entity.Tables_in_vahandb}`}><h2>{entity.Tables_in_vahandb}</h2></Link>
            <div className='entityButton'>
              <Link to={`/insertData/${entity.Tables_in_vahandb}`} className='crudButtons'><button className='HomeButtons green' type="button"><FaPlus /></button></Link>
              <Link to={`/readData/${entity.Tables_in_vahandb}`} className='crudButtons'><button className='HomeButtons yellow' type="button"><CiRead/></button></Link>
              <span className='crudButtons'><button  className='HomeButtons red'type="button" onClick={()=>handleDeleteEntity(entity.Tables_in_vahandb)}><MdDeleteForever/></button></span>
            </div>
          </div>
        </div>
      ))}
      </>:
      <div style={{padding:"20px"}}>No Entity Created Yet</div>

      // <div style={{padding:"20px",display:`${errorMessage===''?'block':'none'}`}}>No Entity Created Yet</div>
      }
      {/* {errorMessage && <p style={{color:'red',textAlign:"center"}}>{errorMessage}</p>} */}
      </>
      )}
      </div>
  
  )
}



export default Home;
