import { AuthLayout } from "@/components/_AuthComponents/AuthLayout";
import { ButtonComponent } from "@/components/ButtonComponent";
import InputComponent from "@/components/InputComponent";
import PhoneInput from "@/components/PhoneInput";
import useAuthStore from "@/store/authStore";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";

export const ResetPassword = () => {
    const {resetPassword, loading} = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation()
    const [formData, setFormData] = useState({
        newPassword: ''
    });
    const email = location?.state?.email

    const handleChange = (e) => {
        setFormData(() => ({
            /* ...prev, */
            ...formData, 
            [e.target.name]: e.target.value
        }))
    } 

    const handleContinue = async() => {
        try {
          const res = await resetPassword({email: email, newPassword: formData.newPassword});
          if (res && res.status === 200) {
            navigate('/reset-password/success');
          }
        } catch (error) {
          console.log(error);
        }
      };
    return (
        <AuthLayout
        title='Reset your password'
        description='Effortlessly reset your password, providing a new one and confirming for enhanced security.'
        >
        <InputComponent
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            password={true}
            type="password"
            placeholder="New Password"
        />
        <ButtonComponent 
            variant="primary" 
            label={'Continue'} 
            buttonStyles='h-[52px] w-full'
            onClick={handleContinue} 
            disabled={loading || !formData.newPassword}
        />
        </AuthLayout>
    )

}