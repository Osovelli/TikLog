/* import { AuthLayout } from '@/components/_AuthComponents/AuthLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import OTPWithCountdown from '@/components/_AuthComponents/OTPWithCountdown'


import PhoneInput from '@/components/PhoneInput'

export const ResetPasswordOtp = () => {
  return (
    <div>
    <AuthLayout 
    title='Enter OTP Code'
    description='Check your messages for a code from us.'
    >
      <OTPWithCountdown />
    </AuthLayout>
    </div>
  )
} */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import InputComponent from "@/components/InputComponent"
import { ResetPasswordOtpCountdown } from "@/components/_AuthComponents/ResetPasswordOtpCountdown" 
import { AuthLayout } from "@/components/_AuthComponents/AuthLayout"
import useAuthStore from "@/store/authStore"
import { useLocation, useNavigate } from "react-router"

export const ResetPasswordOtp = ({ onSuccess, onBack }) => {
  // State management
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const { changePassword, resendOtp, loading } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()


  // Validation states
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  const email = location?.state?.email
  const id = location?.state?.id
  const firstname = location?.state?.firstname


  /* console.log("LOCATION STATE", location?.state)

  console.log("LOCATION EMAIL STATE", location?.state?.email)
  console.log("LOCATION NAME STATE", location?.state?.firstname)
  console.log("LOCATION ID STATE", location?.state?.id) */
  

  // Password validation function
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    /* if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number"
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return "Password must contain at least one special character (@$!%*?&)"
    } */
    return ""
  }

  // Handle password input change
  const handleNewPasswordChange = (e) => {
    const value = e.target.value
    setNewPassword(value)

    // Validate password
    const error = validatePassword(value)
    setPasswordError(error)

    // Check if passwords match when new password changes
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
    } else if (confirmPassword && value === confirmPassword) {
      setConfirmPasswordError("")
    }
  }

  // Handle confirm password input change
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value
    setConfirmPassword(value)

    // Check if passwords match
    if (value !== newPassword) {
      setConfirmPasswordError("Passwords do not match")
    } else {
      setConfirmPasswordError("")
    }
  }

  // Handle OTP change from OTPWithCountdown component
  const handleOtpChange = (otpValue) => {
    setOtp(otpValue)
    setError("") // Clear any previous errors when OTP changes
  }

  // Validate form before submission
  const validateForm = () => {
    let isValid = true

    // Check if OTP is provided
    if (!otp || otp.length < 6) {
      setError("Please enter a valid 6-digit OTP")
      isValid = false
    }

    // Check if new password is provided and valid
    if (!newPassword) {
      setPasswordError("New password is required")
      isValid = false
    } else {
      const passwordValidationError = validatePassword(newPassword)
      if (passwordValidationError) {
        setPasswordError(passwordValidationError)
        isValid = false
      }
    }

    // Check if confirm password is provided
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password")
      isValid = false
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
      isValid = false
    }

    return isValid
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Clear previous errors
    setError("")
    setPasswordError("")
    setConfirmPasswordError("")

    // Validate form
    /* if (!validateForm()) {
      return
    } */

    // Construct request body
    const requestBody = {
      otp: otp,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }

    console.log("Reset password request body:", requestBody)

    try {
      setIsLoading(true)
      
      const res = await changePassword(requestBody)
      if (res.status === "success") {
        navigate('/reset-password/success')
      }
    }
    catch (error) {
      console.log(error)
    }
    finally {
      setIsLoading(false)
    }
  }

  // Handle resend OTP
  const handleResendOtp = async () => {
    //console.log("Resending OTP for:", email, id, firstname)
    await resendOtp({email: email, id: id, firstname: firstname})
    
  }

  // Render component
  return (
    <AuthLayout className="w-full max-w-md mx-auto">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Reset Your Password</h3>
        <p>Enter the OTP sent to {email} and create a new password</p>
      </div>

      <div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input */}
          <div className="space-y-2">
            <ResetPasswordOtpCountdown otp={otp} setOtp={handleOtpChange} /* onOtpChange={handleOtpChange} */ onResendOtp={handleResendOtp} email={email} />
          </div>

          {/* New Password Input */}
          <InputComponent
            id="new_password"
            name="new_password"
            type="password"
            password={true}
            label="New Password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            error={passwordError}
            disabled={isLoading}
            required
          />

          {/* Confirm Password Input */}
          <InputComponent
            id="confirm_password"
            name="confirm_password"
            type="password"
            password={true}
            label="Confirm New Password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            error={confirmPasswordError}
            disabled={isLoading}
            required
          />

          {/* Password Requirements */}
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium">Password must contain:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>At least 8 characters</li>
              {/* <li>One uppercase letter (A-Z)</li>
              <li>One lowercase letter (a-z)</li>
              <li>One number (0-9)</li>
              <li>One special character (@$!%*?&)</li> */}
            </ul>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-[#1F1F76] hover:bg-[#1a1a66]"
            onClick={handleSubmit}
            disabled={isLoading || !otp || !newPassword || !confirmPassword || passwordError || confirmPasswordError}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>

          {/* Back Button */}
          {onBack && (
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={onBack}
              disabled={isLoading}
            >
              Back to Login
            </Button>
          )}
        </form>
      </div>
    </AuthLayout>
  )
}


