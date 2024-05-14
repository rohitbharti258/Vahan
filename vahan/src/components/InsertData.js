import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const InsertData = () => {
  const { entityName } = useParams();
  const [attributes, setAttributes] = useState([
    { name: 'Name' },
    { name: 'Roll no' },
    { name: 'Class' },

  ]);

  const [data, setData] = useState([
    { attributeName: '' }
  ])

  // const handleAttributeChange = (index, key, value) => {
  //   const updatedData = [...data];
  //   updatedData[index][key] = value;
  //   setData(updatedData);
  // };

  const fetchAttributes = async () => {
    try {
      const res = await fetch(`http://localhost/vahan/getattributes/:${entityName}`, {
        method: "GET",
      });
      const response = await res.json();
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
      <form className='form-container'>
        {attributes.map((attr, index) => (
          <div className='container insertConatiner' key={index}>
            <div className="entity">
              <h2>{attr.name}</h2>
              <input
                type="text"
                value=""
                required
              />
            </div>
          </div>
        ))}
      </form>
    </>

  )
}

export default InsertData