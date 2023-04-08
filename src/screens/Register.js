import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_URL } from '../config'
import Swal from 'sweetalert2';
import { useNavigate, useParams, Link } from 'react-router-dom'

function Register() {

  const [fname, setFname] = useState()
  const [lname, setLname] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [phone, setPhone] = useState()
  const [role, setRole] = useState()
  const [msg, setMsg] = useState()

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const { userId } = useParams()

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  };

  const getUserByuserId = async (userId) => {
    const user = await axios.get(`${API_URL}/user/profile/${userId}`)
    setFname(user.data.user.fname)
    setLname(user.data.user.lname)
    setEmail(user.data.user.email)
    setPhone(user.data.user.phone)
  }
  useEffect(() => {
    getUserByuserId(userId)
  }, []);

  const registerUser = (event) => {
    debugger;
    event.preventDefault();
    const request = { fname, lname, email, password, phone, role };
    setLoading(true);
    let url = `${API_URL}/register`;
    let msg = 'User register successfully...';
    if (userId) {
      url = `${API_URL}/user/profile/${userId}`;
      msg = 'User edited sussessfully...';
      axios.put(url, request, CONFIG_OBJ)
        .then((data) => {
          if (data) {
            Swal.fire({
              icon: 'info',
              title: msg,
              text: 'We will email you once Refresh is completed!',
            });
            navigate('/userProfile')
          }
        })
        .catch((err) => {
          setMsg("User registration failed!!!")
        })
    } else {
      axios.post(`${API_URL}/register`, request, CONFIG_OBJ)
        .then((data) => {
          if (data) {
            setLoading(false);
            const request = { from: "souravtandi10@gmail.com", to: "10souravtandi@gmail.com", subject: "registration mail", body: "registered" };
            axios.post(`${API_URL}/sendEmail`, request, CONFIG_OBJ)
              .then((data) => {
                if (data) {
                  console.log("email sent")
                }
              })
              .catch((err) => {
                console.log(err + "email not sent")
              })
            Swal.fire({
              icon: 'success',
              title: 'Register successfully...'
            });
            navigate("/login")
          }
        })
        .catch((err) => {
          setLoading(false);
          Swal.fire({
            icon: 'error',
            title: 'Registration failed !!!',
            text: 'Please enter proper data!'
          });
        })
    }


  }

  return (
    <div className='container'>
      <h3 className='text-center mt-4 p-2 shadow'>{userId ? "Edit User" : "Register User"}</h3>
      {loading ? <div className='text-center mt-5'>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div> : ''}
      <form onSubmit={(event) => registerUser(event)} className='form-container mx-auto mt-4'>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">First Name</label>
          <input required onChange={(event) => setFname(event.target.value)} value={fname} type="text" className="form-control" id="firstName" />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <input required onChange={(event) => setLname(event.target.value)} value={lname} type="text" className="form-control" id="lastName" />
        </div>
        {userId ? "" : <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input required onChange={(event) => setEmail(event.target.value)} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>}
        {userId ? "" : <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input required onChange={(event) => setPassword(event.target.value)} type="password" className="form-control" id="exampleInputPassword1" />
        </div>}
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone no.</label>
          <input required onChange={(event) => setPhone(event.target.value)} value={phone} type="text" className="form-control" id="phone" />
        </div>
        <div className='d-flex justify-content-between'>
          <div className="form-check">
            <input required onChange={(event) => setRole(event.target.value)} className="form-check-input" value="owner" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
            <label className="form-check-label" htmlFor="flexRadioDefault1">
              Owner
            </label>
          </div>
          <div className="form-check">
            <input required selected onChange={(event) => setRole(event.target.value)} className="form-check-input" value="tenant" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
            <label className="form-check-label" htmlFor="flexRadioDefault2">
              Tenant
            </label>
          </div>
        </div>
        <div className='d-grid mt-3'>
          <button type="submit" className="btn btn-primary">{userId ? "Save" : "Register"}</button>
        </div>
        <div className="my-4">
          <div id="emailHelp" className="form-text text-primary">Already have an account?
            <Link to="/login"> Click here to Login</Link>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Register