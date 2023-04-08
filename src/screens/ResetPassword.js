import React, { useEffect, useState } from 'react'
import { API_URL } from '../config'
import axios from 'axios';
import Swal from 'sweetalert2';

const ResetPassword = () => {

    const [phone, setPhone] = useState()
    const [showPassword, setShowPassword] = useState(false);

    const sendOtpByEmail = (user, otpval) => {
        let emailBody = `Hello: ${user.fname} ${user.lname},
           Your OTP for password reset is: ${otpval}`
        const request = { from: "sender@mosambalpur.in", to: user.email, subject: "OTP for Password Reset", body: emailBody };
        axios.post(`${API_URL}/sendEmail`, request)
            .then((data) => {
                if (data) {
                    console.log("email sent")
                    Swal.fire({
                        icon: 'info',
                        title: 'OTP sent Successfully Via Email',
                        text: 'Check your registered email and enter the OTP in the box',
                    });
                }
            })
            .catch((err) => {
                console.log(err + "email not sent")
            })

    }
    const updateOTP = async (user, otpval) => {
        const request = { email: user.email, phone: user.phone, otp: otpval }
        return await axios.put(`${API_URL}/user/update-otp`, request);
    }
    const sendOTPViaSMS = async (otpval) => {
        const request = { to: '+91' + phone, body: 'Password Reset OTP is ' + otpval }
        return await axios.post(`${API_URL}/sendFastSms`, request);
    }

    //Logic to generate random 4 digit OTP
    const generateOTP = () => {
        return Math.floor(1000 + Math.random() * 9000);
    }
    const changePassword = (event) => {
        event.preventDefault();
    }
    const fetchUserByNo = async (event) => {
        event.preventDefault();
        const otpval = generateOTP();
        const res = await axios.get(`${API_URL}/user/get-user-by-phone/${phone}`);
        console.log(res);
        if (res.data.user != null) {
            //sendOTPViaSMS(otpval);
            sendOtpByEmail(res.data.user, otpval);
            const result = updateOTP(res.data.user, otpval);
        } else {
            Swal.fire({
                icon: 'danger',
                title: 'Cannot find the number'
            });
        }
    }

    useEffect(() => {
        axios.get('https://obifyconsulting.vercel.app/api/products')
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])
    return (
        <div className='container p-4 my-2'>
            <h3 className='text-center mt-2 p-2 shadow' style={{ color: "F62459" }}>Reset Password</h3>

            <form onSubmit={(event) => fetchUserByNo(event)} className='form-container mx-auto mt-5'>
                <div className="mb-3">
                    <label htmlFor="exampleInputPhone1" className="form-label">Your Registered Number</label>
                    <input placeholder='Enter 10 digit mobile number' onChange={(event) => setPhone(event.target.value)} type="text" className="form-control" id="exampleInputPhone1" aria-describedby="emailHelp" required />
                    <div id="phoneHelp" className="form-text">We'll never share your number with anyone else.</div>
                </div>
                <div className='d-grid mt-3'>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
            {showPassword ? <form onSubmit={(event) => changePassword(event)} className='form-container mx-auto mt-5'>
                <div className="mb-3">
                    <label htmlFor="exampleInputPhone1" className="form-label">Your Registered Number</label>
                    <input placeholder='Enter 10 digit mobile number' onChange={(event) => setPhone(event.target.value)} type="text" className="form-control" id="exampleInputPhone1" aria-describedby="emailHelp" required />
                    <div id="phoneHelp" className="form-text">We'll never share your number with anyone else.</div>
                </div>
                <div className='d-grid mt-3'>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form> : ''}
        </div>
    )
}

export default ResetPassword