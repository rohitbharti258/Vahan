import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/UpdateData.css'
import '../css/Form.css'
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
const UpdateData = () => {
  const { entityName, id } = useParams();
  const [update, setUpdate] = useState([{ type: '', value: ''}])
  const [attributes, setAttributes] = useState([]);
  const navigate = useNavigate();
  const [totalAttrCount,setTotalAttrcount] = useState();
  const [attrCount,setattrCount] = useState(1);
  const [isLoading,setIsLoading] = useState(true);
  const [errorMessage,setErrorMessage] = useState('');
  const [dateKey,setKey] = useState('None')
  const handleUpdateChange = (index, key, value) => {
    setErrorMessage('')
    console.log(key,value)
    const newUpdate = update.map((val, i) =>
      i === index ? { ...val, [key]: value } : val
    );
    setUpdate(newUpdate);
    console.log(update)
  };

  const handleAddAttribute = () => {
    setUpdate([...update, { type: '', value: '' }]);
    setattrCount(prev=> prev+1);
    console.log(attrCount)
  };

  const handleSubmit = async (e) => {
    if(errorMessage!=='') return;
    setIsLoading(true)
    e.preventDefault();
    const newData = {
      update: update,
      id: id
    }
    try {
      const res = await fetch(`http://localhost:8000/vahan/updateData/${entityName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
      })
      console.log(res);

      if (res.ok) {
        setIsLoading(false)
        toast.success('Data Updated successFully', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          });
        navigate(`/readData/${entityName}`)
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
        setErrorMessage("Internal server error")
        setIsLoading(false);
        return;
      }
      console.log(res)
    }
    catch (err) {
      console.log({ message: err });
    }
  }
  const fetchAttributes = async () => {
    setIsLoading(true)
    
    try {
      const res = await fetch(`http://localhost:8000/vahan/getattributes/${entityName}`, {
        method: "GET",
      });
      if(!res.ok){
        const text = await res.text();
        const errmsg = await JSON.parse(text).sqlMessage;
        toast.error(errmsg, {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          });
        setErrorMessage("Internal server error")
        setIsLoading(false);
        return;
        // throw new Error("Internal server Error")
      }
      const response = await res.json();
      response.shift();
      setAttributes(response);
      response.map(val=>{
        if(val.Type.toLowerCase()==='date'){
          setKey(val.Field);
        }
      })
      setIsLoading(false)
      console.log(response);      
      const length = response.length;
      setTotalAttrcount(response.length);
      console.log(length)
    } catch (err) {
      console.log({ error: err });
    }
  }

  useEffect(() => {
    fetchAttributes();
  }, [])
  return (
    <>
    {isLoading?(<Spinner/>):(<>
      <div className='entityName'>
        <h3>Update {entityName}</h3>
      </div>
      <form className='form-container' onSubmit={handleSubmit}>
        {update.map((val, index) => (
          <div key={index}>
            <div className='dropdown-container'>
              <label htmlFor="dropdown" className="dropdown-label">Add Attribute:</label>
              <select
                id="dropdown"
                className="dropdown-select"
                value={val.type}
                onChange={(e) => handleUpdateChange(index, 'type', e.target.value)}
              >
                <option value="None">None</option>
                {attributes.map((attr,index) => (
                  <option key={attr.Field} value={attr.Field} onChange={(e) => handleUpdateChange(index, 'DataType', attr.Type)}>
                    {attr.Field}({attr.Type})
                  </option>
                ))}
              </select>
            </div>
            <label htmlFor={`updateName${index + 1}`}>New Value:</label>
            <input
             type ={dateKey=== val.type ?'date':'text'}
              id={`updateName${index + 1}`}
              value={val.value}
              onChange={(e) => handleUpdateChange(index, 'value', e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" className='addmorebutton' onClick={handleAddAttribute} disabled={attrCount===totalAttrCount}>Add More</button>
        <button type="submit" disabled={errorMessage!==''}>Update Data</button>
      </form>
      {/* {errorMessage && <p style={{color:'red',textAlign:'center'}}>{errorMessage}</p>} */}
      </>
    )}
      
    </>
  )
}

export default UpdateData;
