import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';

const ReadData = () => {
    const { entityName } = useParams();
    const [tableData, setTableData] = useState([]);
    const [attr, setAttr] = useState([]);
    const navigate = useNavigate();
    const handleClick = async (id, method) => {
        console.log(id);
        const idData ={
            id:id
        }
        try {
            const res = await fetch(`http://localhost:8000/vahan/deleteData/${entityName}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(idData)
            })

            if(res.ok){
                // navigate(`/readData/${entityName}`)
                window.location.reload();
            }
        } catch (err) {
            console.log({ message: err });
        }

    }
    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/vahan/getData/${entityName}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setTableData(data);
            console.log(tableData)
            const keys = Object.keys(data[0]);
            setAttr(keys);
            console.log(attr)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='form-container dataform'>
            <h1>{entityName}</h1>
            {tableData.length > 0 ?
                <table>
                    <thead>
                        <td><strong>Sr. No</strong></td>
                        {attr.map((attr, index) => (

                            <th key={index}>
                                <td>{attr}</td>
                            </th>
                        ))}
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (
                            <>
                                <tr key={index}>
                                    <td >{index + 1}</td>
                                    {Object.values(row).map((value, index) => (
                                        <td>{value}</td>
                                    )
                                    )}
                                </tr>
                                <div key={index + 1} className='buttons'>
                                    <button className="alterButton" type="button" onClick={(e) => handleClick(tableData[index].id, "PUT")}>Update</button>
                                    <button className="alterButton" type="button" onClick={(e) => handleClick(tableData[index].id, "DELETE")}>Delete</button>
                                </div>

                            </>
                        ))}
                    </tbody>

                </table> : <>No Data to show</>}
        </div>
    );
};

export default ReadData;