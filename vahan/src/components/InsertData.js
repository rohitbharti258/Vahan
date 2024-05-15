import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
const InsertData = () => {
  const {entityName} = useParams();
  const [attributes, setAttributes] = useState([]);
  const [data,setData] = useState([])
  const [attr,setAttr] = useState([])

  const navigate = useNavigate();
  
  const handleEntityNameChange = (e) => {
    // setEntit/yName(e.target.value);
  };

  const handleValueChange = (index, key ,value) => {
    console.log(key,value)
    const updatedData = [...data];
    const updatedAttr = [...attr];

    updatedData[index] = value;
    updatedAttr[index] = key;

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
      if(res.ok){
        navigate('/')
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
                onChange={(e) => handleValueChange(index,attr.Field,  e.target.value)}
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