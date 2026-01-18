import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/_AuthComponents/AuthLayout';
import { ButtonComponent } from '@/components/ButtonComponent';
import InputComponent from '@/components/InputComponent';
import PhoneInput from '@/components/PhoneInput';
import useAuthStore from '@/store/authStore';
import { toast } from 'react-hot-toast';

export const Signup = () => {
  const { signup, isSignup, loading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    countryCode: '+234',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  /* const [loading, setLoading] = useState(false); */
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    /* if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    } */
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = ({ phoneNumber, countryCode }) => {
    setFormData(prev => ({
      ...prev,
      phoneNumber,
      countryCode
    }));
  };

  /* const handleVisibilityToggle = () => {
    setShowPassword(prev => !prev);
  } */

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log({formData});
    /* setLoading(true) */

     signup({
      email: formData.email,
      phone: formData.phoneNumber,
      code: formData.countryCode,
      password: formData.password
    })

    /* if (response.success) {
      setLoading(false)
      navigate("/signup-otp")
    } */

    /* setLoading(true);
    try {
      const response = await signup({
        email: formData.email,
        phone_number: formData.phoneNumber,
        country_code: formData.countryCode,
        password: formData.password
      }
      
    );

      if (response.success) {
        toast.success("Signup successful");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Signup failed", error);
      if (error.response?.status === 409) {
        toast.error("This phone number is already registered.");
      } else if (error.response?.status === 400) {
        toast.error("Invalid input. Please check your details and try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    } */ 
  };

  useEffect(() => {
    if(isSignup){
      //toast.success("Signup successful");
      navigate("/signup-otp", {state: {email: formData.email }})
    }
    },[isSignup]
  )


  return (
    <AuthLayout 
      title='Enter your phone number'
      description="Enter your phone number to continue. We'll use this to keep your account secure."
    >
      <form onSubmit={handleSignup} className="space-y-4">
        <PhoneInput 
          value={formData.phoneNumber}
          onChange={handlePhoneChange}
          error={errors.phoneNumber}
          defaultCountryCode={formData.countryCode}
        />
        {/* {errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
        )} */}
        
        <InputComponent 
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          error={errors.email}
          placeholder="Email address"
          type="email"
        />
        {/* {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )} */}
        
        <InputComponent 
          password={true}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          error={errors.password}
        />
        {/* {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )} */}
        
        {/* <InputComponent 
          password={true}
          type={showPassword ? "text" : "password"}
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          error={errors.confirmPassword}
        /> */}
        {/* {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )} */}
        
        <ButtonComponent 
          variant="primary"
          label={loading ? 'Signing up...' : 'Continue'}
          buttonStyles='h-[52px] w-full mt-4'
          type="submit"
          disabled={loading}
        />
      </form>
      <div className="px-8 py-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          Already have an account? {' '}
          <Link to="/signin" className="text-[#3B3B8F] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};