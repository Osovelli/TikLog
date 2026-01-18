import { AuthLayout } from '@/components/_AuthComponents/AuthLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import OTPWithCountdown from '@/components/_AuthComponents/OTPWithCountdown'
import useAuthStore from '@/store/authStore'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

export const SignUpOTP = () => {
  const location = useLocation()
  const email = location.state?.email || "";
  const [OTPValue, setOTPValue] = useState("");
  const { verifyOtp, isOtp} = useAuthStore()
  const navigate = useNavigate();

  const handleOTPSignUp = async (e) => {
    //e.preventDefault();
    console.log("Verifying OTP", {otp: OTPValue, email})

      await verifyOtp({
        email,
        otp: OTPValue
    }) 
  }

  useEffect(() => {
      if(isOtp){
        navigate("/signup/get-to-know")
      }
      },[isOtp]
    )

  return (
    <div>
    <AuthLayout 
    title='Enter OTP Code'
    description='Check your messages for a code from us.'
    >
      <OTPWithCountdown email={email} otp={OTPValue} setOtp={setOTPValue} handleContinue={handleOTPSignUp}  />
    </AuthLayout>
    </div>
  )
}