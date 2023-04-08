import React, { useEffect, useState } from 'react'
import { API_URL } from '../config'
import axios from 'axios';
import { Link } from 'react-router-dom'

function Profile() {

  const [fname, setFname] = useState()
  const [lname, setLname] = useState()
  const [email, setEmail] = useState()
  const [phone, setPhone] = useState()
  const [role, setRole] = useState()
  const [addressLineOne, setAddressLineOne] = useState("");
  const [addressLineTwo, setAddressLineTwo] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [profileImg, setProfileImg] = useState()
  const [userId, setUserId] = useState()
  const [loading, setLoading] = useState(false);

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  };

  const getProfile = async (userId) => {
    const profileData = await axios.get(`${API_URL}/user/profile/${userId}`, CONFIG_OBJ)
    setRole(profileData.data.user.role)
    setFname(profileData.data.user.fname)
    setLname(profileData.data.user.lname)
    setEmail(profileData.data.user.email)
    setPhone(profileData.data.user.phone)
    setAddressLineOne(profileData.data.user.address.addressLineOne)
    setAddressLineTwo(profileData.data.user.address.addressLineTwo)
    setCity(profileData.data.user.address.city)
    setState(profileData.data.user.address.state)
    setZipCode(profileData.data.user.address.zipCode)
    setCountry(profileData.data.user.address.country)
    setProfileImg(profileData.data.user.profileImgName)
    setLoading(false);
  }

  useEffect(() => {
    setUserId(localStorage.getItem("id"))
    getProfile(localStorage.getItem("id"))
    setLoading(true);
  }, [])


  return (
    <div>
      {loading ? <div className='text-center mt-5'>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div> : ''}
      <div>
        <div className="container mt-3">
          <h4>My Profile</h4>
          <div className="row">
            <div className="col-lg-4">
              <div className="card mb-4">
                <div className="card-body text-center">
                  <div className='d-flex justify-between' >
                    <Link to={`/user/profile/pp/${userId}`}>
                      <i className="fs-4 fa-solid fa-pen-to-square me-1" style={{ cursor: 'pointer' }}></i>
                    </Link>
                    <img width='250px' height='250px' src={`${API_URL}/files/${profileImg}`} alt="avatar"
                      className="img-fluid" />
                  </div>
                  {/*<div style={{ position:'relative' }} >
                    <i className="fs-4 fa-solid fa-pen-to-square me-1 text-primary" style={{ right: "5%", top: "5%", position:'absolute', cursor: 'pointer' }}></i>
                    <img src={`${API_URL}/files/${profileImg}`} alt="avatar"
                      className="rounded-circle img-fluid" />
                  </div>*/}
                  <h5 className="my-3">{fname} {lname}</h5>
                  <p className="text-muted mb-1">Role: {role}</p>
                  <p className="text-muted mb-4">{addressLineOne}, {city}, {state}</p>
                  {/* <div className="d-flex justify-content-center mb-2">
                    <button type="button" className="btn btn-outline-primary ms-1">Contact</button>
                    <button type="button" className="btn btn-outline-primary ms-1">Message</button>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card mb-4">
                <div className="card-body">
                  <div className='d-flex justify-content-between'>
                    <h4>Personal Details</h4>
                    <Link to={`/user/profile/pd/${userId}`} className="btn btn-warning text-uppercase">
                      <i className="fa-solid fa-pen-to-square"></i>Edit
                    </Link>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Full Name</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{fname} {lname}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Email</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{email}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Phone</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{phone}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card mb-4">
                <div className="card-body">
                  <div className='d-flex justify-content-between'>
                    <h4>Address Details</h4>
                    <Link to={`/user/profile/ad/${userId}`} className="btn btn-warning text-uppercase">
                      <i className="fa-solid fa-pen-to-square"></i>Edit
                    </Link>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Address 1</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{addressLineOne}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Address 2</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{addressLineTwo}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">City</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{city}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">State</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{state}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">ZipCode</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{zipCode}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Country</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{country}</p>
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

export default Profile