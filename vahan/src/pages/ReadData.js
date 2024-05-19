import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import '../css/Form.css'
import '../css/ReadData.css'
import { GrUpdate } from "react-icons/gr";
import Spinner from '../components/Spinner';
import { MdDeleteForever } from "react-icons/md";
import { toast } from 'react-toastify';


const ReadData = () => {
    const { entityName } = useParams();
    const [tableData, setTableData] = useState([]);
    const [attr, setAttr] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    // const [errorMessage,setErrorMessage] = useState('')
    const handleClick = async (id, method) => {
        setIsLoading(true);
        const idData = {
            id: id
        }
        try {
            const res = await fetch(`http://localhost:8000/vahan/deleteData/${entityName}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(idData)
            })
            console.log(res);
            
            if (res.ok) {
                // setErrorMessage('')
                setTableData(tableData.filter((val) => val.ID != id))
                toast.success('Entry Deleted successFully', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    });
                  navigate(`/readData/${entityName}`)
                setIsLoading(false);
            }
            else{
                // setErrorMessage('Failed to Delete data . Retry!!! ');
                setIsLoading(false);
                toast.error('Failure during Deleteion', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    });
                return;
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
            
            const keys =  Object.keys(data[0]);
            setAttr(keys);
            // data.map((val,index)=>{
            //    attr.map((key)=>{
            //     console.log(typeof val[key])
            //       if(typeof val[key]==='string' && val[key].includes('18:30:00.000Z')) {
            //         console.log(val[key].substring(0,10))

            //         new Date(val[key])
            //       }
            //    }) 
            //     val.map((col)=>{
            // console.log("col "+col);

            //         if(col.contains('18:30:00.000Z')){
            //             // data[val][col] =  
            //         }
                // })
            // })
            setTableData(data);
            console.log(data)
            
            console.log(attr)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        // setErrorMessage('')
        fetchData();
    }, []);

    return (
        <>
            {isLoading ? (
                <Spinner />
            ):(
                <>
                <h1>{entityName}</h1>

                    <div className='form-container dataform'>
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
                                                {Object.values(row).map((value) => (
                                                    <td>{value===null?"Null":value}</td>
                                                )
                                                )}
                                            </tr>
                                            <div key={index + 1} className='buttons'>
                                                <Link to={`/updateData/${entityName}/${tableData[index].ID}`}>
                                                    <button className="alterButton yellow" type="button" ><GrUpdate className='icons' /></button>
                                                </Link>
                                                <span><button className="alterButton red" type="button"  onClick={(e) => handleClick(tableData[index].ID, "DELETE")}><MdDeleteForever className='icons' /></button></span>
                                            </div>
                                        </>
                                    ))}
                                </tbody>
                            </table> : <>No Data to show</>}
                    </div>
        {/* {errorMessage && <p style={{textAlign:'center',color:'red'}}>{errorMessage}</p>} */}

                </>
            )
            }
        </>

    );
};

export default ReadData;