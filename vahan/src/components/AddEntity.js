import React, { useState } from 'react';
import '../App.css'
import { useNavigate } from 'react-router';
const AddEntity = () => {
  const [entityName, setEntityName] = useState('');
  const [attributes, setAttributes] = useState([{ name: '', type: '' }]);
  const navigate = useNavigate();
  
  const handleEntityNameChange = (e) => {
    setEntityName(e.target.value);
  };

  const handleAttributeChange = (index, key, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index][key] = value;
    setAttributes(updatedAttributes);
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', type: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data ={
      entity:entityName,
      attr:attributes
    }
    try{
      console.log(data)
      // if(!entityName.trim().length>0 || attributes.every(a =>
      //    a.name.trim().length>0 && a.type.trim().length>0))
      //   return;
      const res = await fetch("http://localhost:8000/vahan/addEntity",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      console.log('Submitted:', { entityName, attributes });
      navigate('/');
    }catch(err){
      console.log({message:err});
    }
  };

  return (
    <>
      <div className='entityName'>
        <label htmlFor="entityName">Entity Name:</label>
        <input
          type="text"
          id="entityName"
          value={entityName}
          onChange={handleEntityNameChange}
          required
        />
      </div>
      <form className='form-container' onSubmit={handleSubmit}>

        {attributes.map((attribute, index) => (
          <div key={index}>
            <label htmlFor={`attributeName${index}`}>Attribute Name:</label>
            <input
              type="text"
              id={`attributeName${index}`}
              value={attribute.name}
              onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
              required
            />
            <label htmlFor={`attributeType${index}`}>Attribute Type:</label>
            <input
              type="text"
              id={`attributeType${index}`}
              value={attribute.type}
              onChange={(e) => handleAttributeChange(index, 'type', e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddAttribute}>Add Attribute</button>
        <button type="submit">Create Entity</button>
      </form>
    </>

  );
};

export default AddEntity;