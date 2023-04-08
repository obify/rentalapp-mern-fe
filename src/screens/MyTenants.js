import React, { useEffect, useState } from 'react'
import { API_URL } from '../config'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


function MyTenants() {

  const navigate = useNavigate()
  const [tenants, setTenants] = useState([])

  const navToRentDetails = (tenantId) => {
    navigate(`/rentalDetails/${tenantId}`);
  }
  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  };

  const getAllTenants = async () => {
    const tenantsData = await axios.get(`${API_URL}/myTenants`, CONFIG_OBJ)
    setTenants(tenantsData.data.allTenants)
  }

  useEffect(() => {
    getAllTenants()
  }, [])

  return (
    <div className='container my-3'>
      <h3 className='text-center my-3 shadow p-2' style={{ color: "F62459" }}>My Tenants</h3>
      <div>
        {!tenants.length > 0 ? <h3>No Tenants Found</h3> : tenants.map((tenant) => {
          return (<div className="card mb-2" key={tenant._id}>
            <h5 className="card-header">{tenant.user.fname} {tenant.user.lname}</h5>
            <div className="card-body">
              <div >
                <p><b>Email:</b> {tenant.user.email}</p>
                <p><b>Phone:</b> {tenant.user.phone}</p>
              </div>
              <hr />
              <div >
                {/* <h5 className="card-title">Property Details</h5>
                <p className="card-text"><b>Type:</b> {tenant.property.title}</p>
                <p className="card-text"><b>Address:</b> {tenant.property.description}</p> */}
                <button onClick={() => navToRentDetails(tenant._id)} className="btn btn-primary">Edit rental details</button>
              </div>
            </div>
          </div>)
        })
        }
      </div>
    </div>
  )
}

export default MyTenants