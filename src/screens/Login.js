import React, { useState } from 'react'
import { API_URL } from '../config'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2';

function Login() {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [msg, setMsg] = useState()
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const Login = (event) => {
        event.preventDefault();

        const request = { email, password }
        setLoading(true);

        axios.post(`${API_URL}` + "/login", request)
            .then((data) => {
                if (data) {
                    setMsg("Login successfully!")
                    localStorage.setItem("token", data.data.result.token)
                    localStorage.setItem("user", JSON.stringify(data.data.result.user))
                    localStorage.setItem("id", data.data.result.id)
                    dispatch({ type: "APISUCCESS", payload: data.data.result.user })

                    setLoading(false);
                    navigate("/")
                }
            })
            .catch((err) => {
                setLoading(false);
                dispatch({ type: "APIERROR" })
                Swal.fire({
                    icon: 'error',
                    title: 'Login failed!',
                    text: 'Please check your email and password'
                });
            })
    }

    return (
        <div className='container p-4 my-2'>
            <h4>{msg}</h4>
            <h3 className='text-center mt-2 p-2 shadow' style={{ color: "F62459" }}>Login here</h3>
            {loading ? <div className='text-center mt-5'>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div> : ''}
            <form onSubmit={(event) => Login(event)} className='form-container mx-auto mt-5'>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input onChange={(event) => setEmail(event.target.value)} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input onChange={(event) => setPassword(event.target.value)} type="password" className="form-control" id="exampleInputPassword1" required />
                </div>
                <div className='d-grid mt-3'>
                    <button type="submit" className="btn btn-primary">Login</button>
                </div>
                <div className="mt-4">
                    <div id="emailHelp" className="form-text text-primary">New user?
                        <Link className='me-2' to="/register"> Click here to Register</Link>
                        <Link to="/reset"> Forgot Password?</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login