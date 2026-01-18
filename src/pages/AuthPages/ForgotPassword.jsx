/* import { AuthLayout } from '@/components/_AuthComponents/AuthLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import PhoneInput from '@/components/PhoneInput'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/reset-password');
  };

  return (
    <>
    <AuthLayout 
    title='Forgot password?'
    description='Enter your phone number to continue'
    >
      <PhoneInput />
      <ButtonComponent 
        variant="primary" 
        label={'Continue'} 
        buttonStyles='h-[52px] w-full'
        onClick={handleContinue}
        />
    </AuthLayout>
    </>
  )
} */

import { AuthLayout } from '@/components/_AuthComponents/AuthLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import InputComponent from '@/components/InputComponent'
import PhoneInput from '@/components/PhoneInput'
import useAuthStore from '@/store/authStore'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone_number: '',
    email: ''
  });

  const {forgotPassword, loading} = useAuthStore();

  const handleChange = (e) => {
    setFormData(() => ({
      /* ...prev, */
      ...formData, 
      email: e.target.value
    }))
  }

  const handleContinue = async() => {
    console.log("PHonE", formData.phone_number);
    try {
      const res = await forgotPassword({email: formData.email});
      if (res.status === 200) {
        navigate('/reset-password-otp', {
          state: {
            email: res?.data?.data?.email,
            firstname: res?.data?.data?.firstname,
            id: res?.data?.data?.id,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <AuthLayout 
    title='Forgot password?'
    description='Enter your phone number to continue'
    >
      {/* <PhoneInput /> */}
      {/* <InputComponent
        value={formData.phone_number}
        onChange={handleChange}
        placeholder="Phone number"
        type="tel"
      /> */}

      {/* email input */}
      <InputComponent
        value={formData.email}
        onChange={handleChange}
        placeholder="Email address"
        type="email"
      />
      <ButtonComponent 
        variant="primary" 
        label={'Continue'} 
        buttonStyles='h-[52px] w-full'
        onClick={handleContinue}
        />
    </AuthLayout>
    </>
  )
}

