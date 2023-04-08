import './App.css';
import NavBar from './components/NavBar';
import Login from './screens/Login';
import Register from './screens/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import Profile from './screens/Profile';
import MyProperty from './screens/MyProperty';
import AddProperty from './screens/AddProperty';
import AllProperties from './screens/AllProperties';
import PropertyDetails from './screens/PropertyDetails';
import EditUser from './screens/EditUser';
import Footer from './components/Footer';
import MyTenants from './screens/MyTenants';
import RentalDetails from './screens/RentalDetails';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ResetPassword from './screens/ResetPassword';

function DynamicRoutes() {

  const navigate = useNavigate();
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"))

    if (userData) {
      dispatch({ type: "APISUCCESS", payload: userData })
    } else {
      localStorage.removeItem("token")
      localStorage.removeItem("id")
      localStorage.removeItem("user")
      dispatch({ type: "LOGOUT" })
      navigate("/login")
    }
  }, []);

  return (
    <Routes>
      <Route exact path='/' element={<Home />}></Route>
      <Route exact path='/login' element={<Login />}></Route>
      <Route exact path='/reset' element={<ResetPassword />}></Route>
      <Route exact path='/register' element={<Register />}></Route>
      <Route exact path='/user/profile/:type/:userId' element={<EditUser />}></Route>
      <Route exact path='/allProperties' element={<AllProperties />}></Route>
      <Route exact path='/propertyDetails/:propertyId' element={<PropertyDetails />}></Route>
      <Route exact path='/properties' element={<MyProperty />}></Route>
      <Route exact path='/addProperty' element={<AddProperty />}></Route>
      <Route exact path='/editProperty/:propertyId' element={<AddProperty />}></Route>
      <Route exact path='/userProfile' element={<Profile />}></Route>
      <Route exact path='/userProfile/:userId' element={<Profile />}></Route>
      <Route exact path='/myTenants' element={<MyTenants />}></Route>
      <Route exact path='/rentalDetails/:userId' element={<RentalDetails />}></Route>
    </Routes>
  );
}

function App() {

  return (
    <Router>
      <div className='appbackground'>
        <NavBar />
        <DynamicRoutes />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
