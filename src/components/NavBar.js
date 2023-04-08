import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'


function NavBar() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user = useSelector(state => state.user)

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("id")
        localStorage.removeItem("user")
        dispatch({ type: "LOGOUT" })
        navigate("/login")
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#003171" }}>
            <div className="container-fluid">
                <NavLink className="navbar-brand fw-bold" style={{ fontFamily: "'Cinzel', serif" }} to="/">Rental App</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-bold me-2">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/allProperties">All Properties</NavLink>
                        </li>
                        {user && user.user.fname && user.user.role == 'owner' ? <li className="nav-item">
                            <NavLink className="nav-link" to="/properties">My Properties</NavLink>
                        </li> : ''}
                        {user && user.user.fname && user.user.role == 'owner' ? <li className="nav-item">
                            <NavLink className="nav-link" to="/addProperty">Add Property</NavLink>
                        </li> : ''}
                        {user && user.user.fname ? '' : <li className="nav-item">
                            <NavLink className="nav-link" to="/login">Login</NavLink>
                        </li>}
                        {user && user.user.fname ? '' : <li className="nav-item">
                            <NavLink className="nav-link" to="/register">Register</NavLink>
                        </li>}
                        {user && user.user.fname && user.user.role == 'owner' ? <li className="nav-item">
                            <NavLink className="nav-link" to="/myTenants">My Tenants</NavLink>
                        </li> : ''}
                        {user && user.user.fname ? <li className="nav-item">
                            <NavLink className="nav-link" to="/userProfile">Profile</NavLink>
                        </li> : ''}
                    </ul>
                    <form className="d-flex">
                        {user && user.user.fname ? <button className="btn btn-danger" onClick={() => logout()}>Logout</button> : ''}
                    </form>
                    {/* <p>{user.user.fname}</p> */}
                </div>
            </div>
        </nav>
    )
}

export default NavBar