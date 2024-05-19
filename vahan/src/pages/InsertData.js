import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/InsertData.css'
import '../css/Form.css'
import Spinner from '../components/Spinner';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InsertData = () => {
  const {entityName} = useParams();
  const [attributes, setAttributes] = useState([]);
  const [data,setData] = useState([])
  const [attr,setAttr] = useState([])
  const [isLoading,setIsLoading] = useState(true);
  const [index,setIndex] = useState(null);
  const navigate = useNavigate();
  
  const handleValueChange = (index, key ,type,value) => {
    // setErrorMessage('')
    console.log(key,value)
    type = type.toLowerCase();
    if(type ==='int') value = parseInt(value);
    else if(type==='dob') setIndex(index);

    // console.log(value)
    const updatedData = [...data];
    const updatedAttr = [...attr];
    const newKey = key.replace(/\s+/g,'_');
    // console.log(newKey)
    updatedData[index] = value;
    updatedAttr[index] = newKey;

    setData(updatedData);
    setAttr(updatedAttr);

    // console.log(data,attr);
  };

  const handleSubmit = async (e)=>{
    setIsLoading(true)
    e.preventDefault();
    // data[index] = data[index].slice(10)
    console.log(data)
    const newData = {
      attributes:attr,
      value:data,
      index:index
    }
    
    try{
      const res = await fetch(`http://localhost:8000/vahan/addData/${entityName}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
      })

      
      // console.log(await JSON.parse(text))
      if(res.ok) {
        setIsLoading(false)
        toast.success('Data Inserted successFully', {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          });
            navigate('/')
      }else{
        const text = await res.text();
        const errmsg = await JSON.parse(text).sqlMessage;
        toast.error(errmsg, {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          });
        // setErrorMessage('Failed to add data . Retry enter value with correct data type ');
        setIsLoading(false);
        // return;
      }
    }
    catch(err){
      toast.error(err, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        });
      console.log({message:err});
      setIsLoading(false);
    }
  }
  const fetchAttributes = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:8000/vahan/getattributes/${entityName}`, {
        method: "GET",
      });
      const response = await res.json();
      response.shift();
      console.log(response)
      if(res.ok){
        setIsLoading(false)
        setAttributes(response);
      }
    } catch (err) {
      console.log({ error: err });
    }
  }
  useEffect(() => {
    fetchAttributes();
  }, [])
  return (
    <>
    {isLoading?(<Spinner/>):
      (
        <>
        <div className='entityName'>
          <h3>{entityName}</h3>
        </div>
        <form className='form-container' onSubmit={handleSubmit}>
          {attributes.map((attr, index) => (
            <div className=' insertConatiner' key={index}>
              <div className="entity">
                <h2>{attr.Field}({attr.Type})</h2>
                <input
                  type={attr.Type.toLowerCase()==='date'?'date':"text"}
                  value={data.name}
                  onChange={(e) => handleValueChange(index,attr.Field,attr.Type,e.target.value)}
                  required={attr.Null==='NO'}
                />
              </div>
            </div>
          ))}
          <button type="submit" >Insert Data</button>
        </form>
        {/* {errorMessage && <p style={{textAlign:'center',color:'red'}}>Error : {errorMessage}</p>} */}
      </>
      )
    } 
</>
  )
}

export default InsertData