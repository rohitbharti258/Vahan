import React, { useState } from 'react';
import '../App.css'
import '../css/AddEntity.css'
import '../css/Form.css'
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const AddEntity = () => {
  const [entityName, setEntityName] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');
  // const [successMessage, setSuccessMessage] = useState('');
  const [isLoading,setIsLoading] = useState(false);
  const [attributes, setAttributes] = useState([{ name: '', type: 'None' }]);
  const [dataType,setDataType] = useState([
    {type:'INT',value:'INT'},
    {type:'VARCHAR(255)',value:'VARCHAR(255)'},
    {type:'DATE(YYYY-MM-DD)',value:'DATE'}
  ])
  const navigate = useNavigate();
  
  const handleEntityNameChange = (e) => {
    // setErrorMessage('')
    // setSuccessMessage('')
    setEntityName(e.target.value);
  };

  const handleAttributeChange = (index, key, value) => {
    // setErrorMessage('')
    // setSuccessMessage('')
    let newValue = value.replace(/\s+/g,'_');
    newValue.trim();
    const updatedAttributes = [...attributes];
    updatedAttributes[index][key] = newValue;
    setAttributes(updatedAttributes);
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', type: '' }]);
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const newEntity = entityName.trim();
    if(newEntity.length===0) {
      toast.error('Entity name should be of length greater than 0 ', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        });
        setIsLoading(false)
      return;
    }

    const data ={
      entity:newEntity,
      attr:attributes
    }
    try{
      const res = await fetch("http://localhost:8000/vahan/addEntity",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      console.log(res);
      if(!res.ok && res.status===500){
        // setErrorMessage("Failed to create table")
        setIsLoading(false);
        toast.error('Failure , Please check datatype for once', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          });
        return;
      }

      const message = await res.text();
      console.log(res)
      if(res.status===200){
        toast.success('New Entity Created', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          });
          navigate('/');
      } else {
        toast.error(message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          });
      }
    }catch(err){
      toast.error('ERR Connection Refused', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        });
      // setErrorMessage("Failed To create Table");
    }
  };

  return (
    
    <>
    {isLoading?(
      <Spinner/>
    ):(
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
            <label htmlFor="dropdown" className="dropdown-label">Attribute Type</label>
              <select
                id="dropdown"
                className="dropdown-select"
                value={attribute.type}
                onChange={(e) => handleAttributeChange(index, 'type', e.target.value)}
              >
                <option value="None">None</option>
                {dataType.map((type,index) => (
                  <option key={index} value={type.value}>
                    {type.type}
                  </option>
                ))}
              </select>
            <label htmlFor={`attributeName${index}`}>Attribute Name:</label>
            <input
              type="text"
              id={`attributeName${index}`}
              value={attribute.name}
              onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
              required
            />
            {/* <label htmlFor={`attributeType${index}`}>Attribute Type:</label>
            <input
              type="text"
              id={`attributeType${index}`}
              value={attribute.type}
              onChange={(e) => handleAttributeChange(index, 'type', e.target.value)}
              required
            /> */}
          </div>
        ))}
        <button type="button" onClick={handleAddAttribute}>Add Attribute</button>
        <button type="submit">Create Entity</button>
      </form>
      {/* {errorMessage && <div style={{textAlign:'center' ,color:'red'}}>Error: {errorMessage}</div>} */}
      {/* {successMessage && <div style={{textAlign:'center' ,color:'green'}}>Success: {successMessage} Redirecting to the home page</div>} */}
    </>
    )
  }
    </>
  );
};

export default AddEntity;