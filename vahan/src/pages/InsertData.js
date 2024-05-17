import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/InsertData.css'
import '../css/Form.css'

const InsertData = () => {
  const {entityName} = useParams();
  const [attributes, setAttributes] = useState([]);
  const [data,setData] = useState([])
  const [attr,setAttr] = useState([])
  const navigate = useNavigate();
  
  const handleEntityNameChange = (e) => {
    // setEntit/yName(e.target.value);
  };

  const handleValueChange = (index, key ,type,value) => {
    console.log(key,value)

    type = type.toLowerCase();
    if(type ==='int') value =parseInt(value);
    else if(type==='float') value = parseFloat(value);
    else if(type==='dob') value = value.slice(10);
    console.log(key,value)

    const updatedData = [...data];
    const updatedAttr = [...attr];
    const newKey = key.replace(/\s+/g,'_');
    console.log(newKey)
    updatedData[index] = value;
    updatedAttr[index] = newKey;

    setData(updatedData);
    setAttr(updatedAttr);

    console.log(data,attr);
  };

  // const handleAttributeChange = (index, key, value) => {
  //   const updatedData = [...data];
  //   updatedData[index][key] = value;
  //   setData(updatedData);
  // };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const newData = {
      attributes:attr,
      value:data
    }
    
    try{
      const res = await fetch(`http://localhost:8000/vahan/addData/${entityName}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
      })
      console.log(res,res.ok)
      if(res.ok) navigate('/');
    }
    catch(err){
      console.log({message:err});
    }
  }
  const fetchAttributes = async () => {
    try {
      const res = await fetch(`http://localhost:8000/vahan/getattributes/${entityName}`, {
        method: "GET",
      });
      const response = await res.json();
      console.log(response)
      setAttributes(response);
      
    } catch (err) {
      console.log({ error: err });
    }
  }
  useEffect(() => {
    fetchAttributes();
  }, [])
  return (
    <>
      <div className='entityName'>
        <h3>{entityName}</h3>
      </div>
      <form className='form-container' onSubmit={handleSubmit}>
        {attributes.map((attr, index) => (
          <div className='container insertConatiner' key={index}>
            <div className="entity">
              <h2>{attr.Field}({attr.Type})</h2>
              <input
                type="text"
                value={data.name}
                onChange={(e) => handleValueChange(index,attr.Field,attr.Type,e.target.value)}
                required={attr.Null==='NO'}
              />
            </div>
          </div>
        ))}
        <button type="submit">Insert Data</button>
      </form>
    </>

  )
}

export default InsertData