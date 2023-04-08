import React, { useEffect, useState } from 'react'
import { API_URL } from '../config'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom'
import Swal from 'sweetalert2';
import './RentalDetails.css';

function RentalDetails() {

  const { userId } = useParams()

  const [tenantId, setTenantId] = useState()
  const [tenant, setTenant] = useState()
  const [property, setProperty] = useState()

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  };

  const makeProperyAvailable = async () => {

    const deleteTenant = await axios.delete(`${API_URL}/deleteTenant/${tenantId}`)

    const request = { isRented: false }
    const result = await axios.put(`${API_URL}/myTenants/${property._id}`, request, CONFIG_OBJ)
    if (deleteTenant.status === 200 && result.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Property Available for Rent',
        text: 'Visit My Properties Page to See the Property!'
      });
    } else {
      Swal.fire({
        icon: 'danger',
        title: 'Property Cannot be Made Available for Rent'
      });
    }
  }
  const getTenantDetail = async (userId) => {
    const res = await fetch(`${API_URL}/myTenants/${userId}`, CONFIG_OBJ);
    const data = await res.json();
    console.log(data)
    setTenantId(data.tenant._id);
    setTenant(data.tenant.user);
    setProperty(data.tenant.property);
  }

  useEffect(() => {
    getTenantDetail(userId);
  }, [])

  return (
    <div>
      <div className='top-banner'>
        <h3 className='text-center mt-3 shadow-sm' style={{ color: "F62459" }}> Manage Tenant</h3>
        <img src='https://images.unsplash.com/photo-1505691723518-36a5ac3be353?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80' />
      </div>
      <div className='container mb-3'>
        <div className='row'>
          <div className='col-md-10 col-sm-12 mx-auto' style={{ marginTop: '-30px' }}>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title h4 pb-2 mb-4 border-bottom border-primary text-center">Tenant Details</h4>
                <div className='bg-light p-2 shadow-sm'>
                  <div className='row'>
                    <div className='text-center col-md-3 col-sm-12 d-flex flex-column justify-center'>
                      <h5 className='fw-semibold text-uppercase'>Name</h5>
                      <h6 className='fw-bolder'>{tenant && tenant.fname} {tenant && tenant.lname}</h6>
                    </div>

                    <div className='text-center col-md-3 col-sm-12 d-flex flex-column justify-center'>
                      <h5 className='fw-semibold text-uppercase'>Email</h5>
                      <h6 className='fw-bolder'>{tenant && tenant.email}</h6>
                    </div>

                    <div className='text-center col-md-3 col-sm-12 d-flex flex-column justify-center'>
                      <h5 className='fw-semibold text-uppercase'>Phone</h5>
                      <h6 className='fw-bolder'>{tenant && tenant.phone}</h6>
                    </div>

                    <div className='text-center col-md-3 col-sm-12 d-flex flex-column justify-center'>
                      <h5 className='fw-semibold text-uppercase'>Property</h5>
                      {property && <Link to={`/propertyDetails/${property._id}`}>
                        <h6 className='fw-bolder'>{property && property.title}</h6>
                      </Link>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='col-md-10 col-sm-12 mx-auto' style={{ marginTop: '-30px' }}>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title h4 pb-2 mb-4 border-bottom border-primary text-center">Rent Details</h4>
                <div className='bg-light p-2 shadow-sm'>
                  <div className='row'>
                    <div className='text-center col-md-3 col-sm-12 d-flex flex-column justify-center'>
                      <h5 className='fw-semibold text-uppercase'>Rented</h5>
                      <h6 className='fw-bolder'>{property && property.isRented ? 'Yes' : 'No'}</h6>
                    </div>

                    <div className='text-center col-md-3 col-sm-12 d-flex flex-column justify-center'>
                      <h5 className='fw-semibold text-uppercase'>Monthly Rent</h5>
                      <h6 className='fw-bolder'>{property && property.price}</h6>
                    </div>

                    <div className='text-center col-md-3 col-sm-12 d-flex flex-column justify-center'>
                      <h5 className='fw-semibold text-uppercase'>Advance Paid</h5>
                      <h6 className='fw-bolder'>2 Months</h6>
                    </div>

                    <div className='text-center col-md-3 col-sm-12 d-flex flex-column justify-center'>
                      <h5 className='fw-semibold text-uppercase'>Rent Pending</h5>
                      <h6 className='fw-bolder'>Yes</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-10 col-sm-12 mx-auto'>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title h4 pb-2 mb-4 border-bottom border-primary text-center">Actions</h4>
                <div className='bg-light p-2 shadow-sm'>
                  <div className='row'>
                    <div className='text-center col-md-6 col-sm-12 d-flex flex-column justify-center'>
                      <button className='fw-bold btn btn-primary'>
                        Monthly Rent Details
                      </button>
                    </div>
                    <div className='text-center col-md-6 col-sm-12 d-flex flex-column justify-center'>
                      <button className='fw-bold btn btn-danger' onClick={() => makeProperyAvailable()}>Make Property Available</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RentalDetails