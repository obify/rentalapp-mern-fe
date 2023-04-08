import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_URL } from '../config'
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom'

function EditUser() {

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [image, setImage] = useState({ preview: '', data: '' })
    const [status, setStatus] = useState('')
    const [address, setAddress] = useState()
    const [addressLineOne, setAddressLineOne] = useState("");
    const [addressLineTwo, setAddressLineTwo] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("");

    const { userId } = useParams()
    const { type } = useParams()

    const handleImgChange = (e) => {
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
        }
        setImage(img)
    }

    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    };

    const updatePersonalInfo = async (personalData, type) => {
        const updatedData = await axios.put(`${API_URL}/user/profile/${type}/${userId}`, personalData, CONFIG_OBJ)
        setLoading(false);
        Swal.fire({
            icon: 'success',
            title: 'User updated',
            text: 'We will email you once Refresh is completed!',
        });
        navigate('/userProfile')
        return updatedData;
    }

    const addAddress = async (newAddress) => {
        const addAddress = await axios.post(`${API_URL}/addAddress`, newAddress, CONFIG_OBJ)
        return addAddress
    }

    const updateAddress = async (editedAddress, addressId) => {
        const addAddress = await axios.put(`${API_URL}/editAddress/${addressId}`, editedAddress, CONFIG_OBJ)
        setLoading(false);
        Swal.fire({
            icon: 'success',
            title: 'Address updated',
            text: 'We will email you once Refresh is completed!',
        });
        navigate('/userProfile')
        return addAddress
    }


    const uploadImage = async (image) => {
        let formData = new FormData()
        formData.append('file', image.imgName.data)
        const result = await axios.post('http://localhost:5000/uploadFile', formData, CONFIG_OBJ)
        const request = {profileImgName : result.data.fileName}
        updatePersonalInfo(request, 'pp')
        setLoading(false);
        navigate('/userProfile')
    }

    const getUserByuserId = async (userId) => {
        const user = await axios.get(`${API_URL}/user/profile/${userId}`)
        setFname(user.data.user.fname)
        setLname(user.data.user.lname)
        setPhone(user.data.user.phone)
        setAddress(user.data.user.address)
        setAddressLineOne(user.data.user.address.addressLineOne)
        setAddressLineTwo(user.data.user.address.addressLineTwo)
        setCity(user.data.user.address.city)
        setState(user.data.user.address.state)
        setZipCode(user.data.user.address.zipCode)
        setCountry(user.data.user.address.country)
        if(user.data.user.profileImgName){
            let img = { preview: `http://localhost:5000/files/${user.data.user.profileImgName}`, data: '' }
            setImage(img)
        }
    }
    useEffect(() => {
        getUserByuserId(userId)
    }, []);

    const editUserData = (event)=>{
        event.preventDefault();
        setLoading(true);
        if(type === 'pd'){//check if personal info modified then call updatePersonalInfo
            const request = { fname, lname, phone };
            updatePersonalInfo(request, type)
        }else if(type === 'ad'){//check if address modified then call addUpdateAddress
            const request = { addressLineOne, addressLineTwo, city, state, zipCode, country };
            if(address){
                updateAddress(request, address._id)
            }else{
                const request = { addressLineOne, addressLineTwo, city, state, zipCode, country };
                axios.post(`${API_URL}/addAddress`, request, CONFIG_OBJ)
                .then((data)=>{
                    debugger;
                    const reqUp = { address: data.data.savedAddress };
                    const result = updatePersonalInfo(reqUp, type)
                });
        }
        }else if(type === 'pp'){//check if profile img modified then call uploadImage
            const request = { imgName: image };
            uploadImage(request)
        }
    }
    const editUser = (event) => { 
        event.preventDefault();
        setLoading(true);
        let formData = new FormData()
        formData.append('file', image.data)
        axios.post('http://localhost:5000/uploadFile', formData)
        .then((data)=>{
            setStatus(data.statusText)
            const request = { fname, lname, phone, addressLineOne, addressLineTwo, city, state, zipCode, country, imgName: data.data.fileName };
            debugger;
            axios.put(`${API_URL}/user/profile/${userId}`, request, CONFIG_OBJ)
            .then((data) => {
                if (data) {
                    setLoading(false);
                    Swal.fire({
                        icon: 'info',
                        title: 'User edited Successfully',
                        text: 'We will email you once Refresh is completed!',
                    });
                    navigate('/userProfile')
                }
            })
            .catch((err) => {
                setLoading(false);
                Swal.fire({
                    icon: 'info',
                    title: 'User edited Successfully',
                    text: 'We will email you once Refresh is completed!',
                });
            })
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    return (
        <div className='container'>
            <h3 className='text-center pt-3 mt-2'>{type==='pd' ? 'Edit Personal Data' : type === 'ad'? 'Edit Address' : 'Edit Profile Pic' }</h3>
            {loading ? <div className='text-center mt-5'>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div> : ''}
            <form onSubmit={(event) => editUserData(event)}>
               <div className='row'>
               {type==='pd'?<div className="mb-3 col-lg-6">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input onChange={(event) => setFname(event.target.value)} value={fname} type="text" className="form-control" id="firstName" />
                </div>:''}
                {type==='pd'?<div className="mb-3 col-lg-6">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input onChange={(event) => setLname(event.target.value)} value={lname} type="text" className="form-control" id="lastName" />
                </div>:''} 
                
                {type==='pd'?<div className="mb-3 col-lg-6">
                    <label htmlFor="phone" className="form-label">Phone no.</label>
                    <input onChange={(event) => setPhone(event.target.value)} value={phone} type="text" className="form-control" id="phone" />
                </div>:''} 
               {type==='ad'? <div className="mb-3 col-lg-6">
                    <label htmlFor="phone" className="form-label">Address Line 1</label>
                    <input onChange={(event) => setAddressLineOne(event.target.value)} value={addressLineOne} type="text" className="form-control" id="phone" />
                </div>: ''} 
                {type==='ad'?<div className="mb-3 col-lg-6">
                    <label htmlFor="phone" className="form-label">Address Line 2</label>
                    <input onChange={(event) => setAddressLineTwo(event.target.value)} value={addressLineTwo} type="text" className="form-control" id="phone" />
                </div>: ''} 
                {type==='ad'?<div className="mb-3 col-lg-6">
                    <label htmlFor="phone" className="form-label">City</label>
                    <input onChange={(event) => setCity(event.target.value)} value={city} type="text" className="form-control" id="phone" />
                </div>: ''} 
                {type==='ad'?<div className="mb-3 col-lg-6">
                    <label htmlFor="phone" className="form-label">State</label>
                    <input onChange={(event) => setState(event.target.value)} value={state} type="text" className="form-control" id="phone" />
                </div>: ''} 
               {type==='ad'? <div className="mb-3 col-lg-6">
                    <label htmlFor="phone" className="form-label">zipCode</label>
                    <input onChange={(event) => setZipCode(event.target.value)} value={zipCode} type="text" className="form-control" id="phone" />
                </div>: ''} 
                {type==='ad'?<div className="mb-3 col-lg-6">
                    <label htmlFor="phone" className="form-label">Country</label>
                    <input onChange={(event) => setCountry(event.target.value)} value={country} type="text" className="form-control" id="phone" />
                </div>: ''} 
                {type==='pp'?<div className="mb-3">
                    {image.preview && <img src={image.preview} width='100' height='100' />}
                    <hr></hr>
                    <input type='file' name='file' onChange={handleImgChange}></input>
                    {status && <h4>{status}</h4>}
                </div>: ''} 
                <div className='d-grid mt-3'>
                    <button type="submit" className="btn btn-success mb-3">Save</button>
                </div>
               </div>
            </form>
        </div>
    )
}

export default EditUser