import React, { useEffect, useState } from 'react'
import { API_URL } from '../config'
import axios from 'axios';
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux'

function AllProperties() {

  const user = useSelector(state => state.user)

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  };

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false);

  const intrestedUser = async (propertyId) => {
    const request = { userId: localStorage.getItem("id"), propertyId }
    let result;
    try {
      result = await axios.post(`${API_URL}/intrested`, request, CONFIG_OBJ)
      debugger;
      if (result.status == 201) {
        Swal.fire({
          icon: 'success',
          title: 'Your interest has been sent to the owner'
        });
      }
    } catch (error) {
      if (error.response.status == 400) {
        Swal.fire({
          icon: 'error',
          title: 'You have already shown interest in this property'
        });
      }
    }

  }

  const searchHandle = async (e) => {
    setLoading(false);
    let key = e.target.value;
    let result = await axios.get(`${API_URL}/searchproperty?key=` + key)
    if (result) {
      setProperties(result.data)
    }
  }

  const getAllProperties = async () => {
    const propertiesData = await axios.get(`${API_URL}/viewAllProperties`)
    setProperties(propertiesData.data.allProperties)
    //console.log({properties})
    setLoading(false);
  }

  useEffect(() => {
    getAllProperties()
    setLoading(true);
  }, [])

  return (
    <div className='container'>
      <h3 className='text-center mt-3 p-2 shadow border border-light'>All Properties</h3>
      <div className='row'>
        {loading ? <div className='text-center mt-5'>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div> : ''}
        <h5 className='my-2'>All Properties: {properties.length}</h5>
        <div className='container my-3'>
          <input onChange={searchHandle} className="form-control me-2" type="search" placeholder="Search here..." aria-label="Search" />
        </div>
        {properties.length > 0 ? properties.map((property) => {
          return (<div className="col-lg-4 col-md-4 col-sm-12 mb-2" key={property._id}>
            <div className='card'>
              <img src={`${API_URL}/files/${property.propertyImgName}`} className="card-img-top w-10" alt="..."></img>
              <div className="card-body shadow">
                {<h5 className="card-title">{property.title}</h5>}
                <h6 className="card-subtitle mb-2 text-muted">{property.description}</h6>
                <p className="card-text">₹ {property.price}</p>
                <div className='d-flex justify-content-between'>
                  {user.user.role != 'owner' ? <button onClick={() => intrestedUser(property._id)} type="button" className="btn btn-outline-info">Intrested ?</button> : ""}
                  <Link to={`/propertyDetails/${property._id}`} className="btn btn-outline-primary"><i className="fa-solid fa-circle-info me-2"></i>View Details</Link>
                </div>
              </div>
            </div>
          </div>)
        }) : <h4 className='text-danger'>No properties found!!!</h4>
        }
      </div>
    </div>
  )
}

export default AllProperties