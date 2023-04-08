import React, { useEffect, useState } from 'react'
import { API_URL } from '../config'
import axios from 'axios';
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';

function MyProperty() {

  const [properties, setProperties] = useState([])

  const [loading, setLoading] = useState(false);

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  };

  const searchHandle = async (e) => {
    setLoading(false);
    let key = e.target.value;
    let result = await axios.get(`${API_URL}/searchproperty?key=` + key)
    if (result) {
      setProperties(result.data)
    }
  }

  const deleteProperty = (propertyId) => {

    Swal.fire({
      title: 'Do you want to delete the property?',
      showDenyButton: true,
      //showCancelButton: true,
      confirmButtonText: 'Delete',
      denyButtonText: `Don't delete`,
    }).then((result) => {
      setLoading(true)
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        axios.delete(`${API_URL}/deletepost/${propertyId}`, CONFIG_OBJ)
          .then((data) => {
            setLoading(false)
            getAllPropertiesForUser(localStorage.getItem("id"))//to get the remaining properties
            Swal.fire(data.data, '', 'success')
          })
          .catch((err) => {
            setLoading(false)
            Swal.fire(err, '', 'success')
          })

      } else if (result.isDenied) {
        setLoading(false)
        Swal.fire('Property not deleted', '', 'info')
      }
    })

  }

  const getAllPropertiesForUser = async (userId) => {
    const propertiesData = await axios.get(`${API_URL}/viewAllProperties/${userId}`, CONFIG_OBJ)
    setProperties(propertiesData.data.allProperties)
    console.log({ properties })
    setLoading(false);
  }

  useEffect(() => {
    const userId = localStorage.getItem("id")
    getAllPropertiesForUser(userId)
    setLoading(true);
  }, [])

  return (
    <div className='container'>
      <h3 className='text-center mt-3 p-2 shadow'>My Properties</h3>
      <div className='row'>
        {loading ? <div className='text-center mt-5'>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div> : ''}
        {!loading ? <div><h5 className='my-2'>My properties: {properties.length}</h5></div> : ""}
        <div className='container my-3'>
          <input type="text" placeholder=" Search Title..." onChange={searchHandle} />
        </div>
        {properties.length > 0 ? properties.map((property) => {
          return (<div className="col-lg-4 col-md-4 col-sm-12 mb-2" key={property._id}>
            <div className='card'>
              <img src={`http://localhost:5000/files/${property.propertyImgName}`} className="card-img-top w-10" alt="..."></img>
              <div className="card-body shadow">
                <div className='d-flex justify-content-between'>
                  <h5 className="card-title">{property.title}</h5>
                  {property.isRented == true ? <h6 className='bg-success border border-primary p-1 text-white'>Rented</h6> : ""}
                </div>
                <h6 className="card-subtitle mb-2 text-muted">{property.description}</h6>
                <p className="card-text">{property.price}</p>
                <div className='d-flex justify-content-evenly'>
                  <Link to={`/propertyDetails/${property._id}`} className="btn btn-primary">Details</Link>
                  <Link to={`/editProperty/${property._id}`} className="btn btn-info px-4">Edit</Link>
                  <button onClick={() => deleteProperty(property._id)} className="btn btn-danger">Delete</button>
                </div>
              </div>
            </div>
          </div>)
        }) : ""

        }
        {properties.length < 1 ? <h4 className='text-danger'>No properties found!!!</h4> : ""}
      </div>
    </div>
  )
}

export default MyProperty