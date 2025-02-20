

import React, { useContext, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { signup } from '../APIs/AuthAPI';
import { useNavigate } from 'react-router-dom'; 
import AlertContext from '../Contexts/AlertContext';

const SignupForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);

  const [fields, setFields] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
  });
  
  const navigate = useNavigate(); 

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleInputChange = (event:any) => {
    const { name, value } = event.target;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleSubmit = async (event:any) => {
    event.preventDefault();
    try {
      const response = await signup(fields); 
      setAlert(response.message, "success");
      
      navigate('/'); 
    } catch (error: any) {
      setAlert(error.message, "error");

    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="d-flex mb-4 justify-content-center align-items-center">
          <img src="./images/image.png" alt="image" style={{ width: "70px", height: "auto" }} />
          <h4 className="text-center mt-3">Create Your First Account</h4>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="first_name"
                placeholder="First name"
                className="form-control"
                style={{ height: '45px' }}
                value={fields.first_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="col">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="last_name"
                placeholder="Last name"
                className="form-control"
                style={{ height: '45px' }}
                value={fields.last_name}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="form-control"
              style={{ height: '45px' }}
              value={fields.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mobile Number</label>
            <input
              type="text"
              name="phone_number"
              placeholder="Phone"
              className="form-control"
              style={{ height: '45px' }}
              value={fields.phone_number}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label">Password</label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              className="form-control"
              style={{ height: '45px' }}
              value={fields.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="btn btn-outline-secondary position-absolute end-0 top-0 me-2"
              style={{ border: 'none', background: 'transparent', marginTop: '32px' }}
            >
              {passwordVisible ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>

          <div className="mb-4 position-relative">
            <label className="form-label">Confirm Password</label>
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              name="confirm_password" 
              placeholder="••••••••"
              className="form-control"
              style={{ height: '45px' }}
              value={fields.confirm_password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="btn btn-outline-secondary position-absolute end-0 top-0 me-2"
              style={{ border: 'none', background: 'transparent', marginTop: '32px' }}
            >
              {confirmPasswordVisible ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Create account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;

