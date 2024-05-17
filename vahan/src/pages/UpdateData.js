import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/UpdateData.css'
import '../css/Form.css'

const UpdateData = () => {
  const { entityName, id } = useParams();
  const [update, setUpdate] = useState([{ type: '', value: '' }])
  const [attributes, setAttributes] = useState([]);
  const navigate = useNavigate();
  const [totalAttrCount,setTotalAttrcount] = useState();
  const [attrCount,setattrCount] = useState(1);
  const handleUpdateChange = (index, key, value) => {
    // const updatedData = [...update];
    // updatedData[index][key] = value;
    // setUpdate(updatedData);
    // setSelectedOption(value);
    const newUpdate = update.map((val, i) =>
      i === index ? { ...val, [key]: value } : val
    );
    setUpdate(newUpdate);
  };

  const handleAddAttribute = () => {
    setUpdate([...update, { type: '', value: '' }]);
    setattrCount(prev=> prev+1);
    console.log(attrCount)
  };

  const handleSubmit = async (e) => {
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

      if (res.ok) navigate(`/readData/${entityName}`)
      console.log(res)
    }
    catch (err) {
      console.log({ message: err });
    }
  }
  const fetchAttributes = async () => {
    try {
      const res = await fetch(`http://localhost:8000/vahan/getattributes/${entityName}`, {
        method: "GET",
      });
      const response = await res.json();
      response.shift();
      setAttributes(response);
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
                  <option key={attr.Field} value={attr.Field}>
                    {attr.Field}
                  </option>
                ))}
              </select>
            </div>
            <label htmlFor={`updateName${index + 1}`}>New Value:</label>
            <input
              type="text"
              id={`updateName${index + 1}`}
              value={val.value}
              onChange={(e) => handleUpdateChange(index, 'value', e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" className='addmorebutton' onClick={handleAddAttribute} disabled={attrCount===totalAttrCount}>Add More</button>
        <button type="submit">Update Data</button>
      </form>
    </>
  )
}

export default UpdateData;
