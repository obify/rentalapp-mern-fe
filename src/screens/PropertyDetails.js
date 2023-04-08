import React, { useEffect, useState } from 'react'
import { API_URL } from '../config'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2';

function PropertyDetails() {

  const user = useSelector(state => state.user)

  const navigate = useNavigate()
  const [property, setProperty] = useState({})
  const [address, setAddress] = useState({})
  const [tenants, setTenants] = useState([])

  const [loading, setLoading] = useState(false);

  const { propertyId } = useParams()

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  };

  const delTenant = async (tenantId) => {
    const deleteTenant = await axios.delete(`${API_URL}/deleteIntrestedTenantById/${tenantId}`, CONFIG_OBJ)
    if (deleteTenant.status === 200) {
      getTenantsList(propertyId);
    }
  }
  const updateRentStatus = async (propertyId, isRented) => {
    const request = { isRented: isRented }
    return axios.put(`${API_URL}/myTenants/${propertyId}`, request, CONFIG_OBJ)
  }

  const removeTenant = async (propertyId) => {
    return axios.delete(`${API_URL}/deleteIntrestedTenant/${propertyId}`)
  }

  const addTenant = async (tenantId) => {
    const request = { userId: tenantId, propertyId }
    const addTenantDetails = await axios.post(`${API_URL}/addTenant`, request, CONFIG_OBJ)
    if (addTenantDetails.status === 201) {
      await updateRentStatus(propertyId, true)
      await removeTenant(propertyId)
      Swal.fire({
        icon: 'success',
        title: 'You have successfully rented the property',
        text: 'We will email you once Refresh is completed!'
      });
      getTenantsList(propertyId)
    } else {
      Swal.fire({
        icon: 'danger',
        title: 'Tenant not added',
        text: 'We will email you once Refresh is completed!'
      });
    }

  }

  const getTenantsList = async (propertyId) => {
    const result = await axios.get(`${API_URL}/intrestedUsers/${propertyId}`, CONFIG_OBJ)
    setTenants(result.data.allInterestedTenants)
  }

  const getPropertyDetails = async () => {
    const result = await axios.get(`${API_URL}/viewProperties/${propertyId}`)
    console.log(result)
    setProperty(result.data.property)
    setAddress(result.data.property.address)
  }


  const contactOwner = () => {
    if (localStorage.getItem("token")) {//user is logged in
      setLoading(false);
      let emailBody = `User name: ${user.user.fname} ${user.user.lname}, 
      User email: ${user.user.email}, 
      User phone: ${user.user.phone}, 
      Owner name: ${property.user.fname} ${property.user.fname}, 
      Owner phone: ${property.user.phone}, 
      Owner property: ${property.description}`
      const request = { from: "sender@mosambalpur.in", to: property.user.email, subject: "contact owner", body: emailBody };
      axios.post(`${API_URL}/sendEmail`, request, CONFIG_OBJ)
        .then((data) => {
          if (data) {
            console.log("email sent")
            Swal.fire({
              icon: 'info',
              title: 'Owner contacted successfully...',
              text: 'Owner will get back to you on your registered phone no. within 24hrs',
            });
          }
        })
        .catch((err) => {
          console.log(err + "email not sent")
        })

    } else {
      navigate('/register')
    }
  }

  useEffect(() => {
    getPropertyDetails()
    getTenantsList(propertyId)
  }, [])
  return (
    <div className='container'>
      <h3 className='text-center mt-2 p-2 shadow' style={{ color: "F62459" }}>Property Details</h3>
      <Link to={"/allProperties"} className='btn btn-outline-primary'>Go Back <i className="fa-solid fa-circle-arrow-left"></i></Link>
      {loading ? <div className='text-center mt-5'>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div> : ''}
      <div className='profileDtls my-3'>
        <div className='pimg col-8 me-2'>
          <img src={`${API_URL}/files/${property.propertyImgName}`} className="card-img-top" alt="..." />
        </div>
        <div className="col-lg-5">
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">Title</p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0">{property.title}</p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">Description</p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0">{property.description}</p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">Price</p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0">{property.price}</p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">Address 1</p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0">{address.addressLineOne}</p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">Address 2</p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0">{address.addressLineTwo}</p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">City</p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0">{address.city}</p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">State</p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0">{address.state}</p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">ZipCode</p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0">{address.zipCode}</p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">Country</p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0">{address.country}</p>
                </div>
              </div>
              <hr />
              {user.user.role != 'owner' ? <button onClick={() => { contactOwner() }} className='btn btn-primary'>Contact Owner</button> : ""}
              {user.user.role == 'owner' ? <Link to={`/editProperty/${property._id}`} className="btn btn-info px-4">Edit</Link> : ""}
            </div>
          </div>
        </div>
      </div>
      {tenants.length > 0 ? <div>
        {user.user.role == 'owner' ? <h4>Intrested Tenants</h4> : ""}
        {user.user.role == 'owner' ? <div className='table-responsive'><table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">Action</th>
              <th scope="col">Decline</th>
            </tr>
          </thead>
          <tbody >
            {tenants.map((tenant, index) => {
              return (<tr key={tenant.user._id}>
                <th scope="row">{index + 1}</th>
                <td>{tenant.user.fname} {tenant.user.lname}</td>
                <td>{tenant.user.email}</td>
                <td>{tenant.user.phone}</td>
                <td><button className='btn btn-sm btn-primary' onClick={() => addTenant(tenant.user._id)}>Add</button></td>
                <td><button className='btn btn-sm btn-danger' onClick={() => delTenant(tenant._id)}><i class="fa-solid fa-circle-xmark"></i></button></td>
              </tr>)
            })
            }
          </tbody>
        </table></div> : ""}
      </div> : ""}
    </div>

  )
}

export default PropertyDetails