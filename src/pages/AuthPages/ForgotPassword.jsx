import { useState } from "react"
import { AuthLayout } from "@/components/_AuthComponents/AuthLayout"
import { ButtonComponent } from "@/components/ButtonComponent"
import PhoneInput from "@/components/PhoneInput"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import useAuthStore from "@/store/authStore"
import { Link, useNavigate } from "react-router-dom"
import InputComponent from "@/components/InputComponent"

export const ForgotPassword = () => {
  const navigate = useNavigate()
  const { resetPassword, loading } = useAuthStore()

  // State management
  const [formData, setFormData] = useState({
    phoneNumber: "",
   /*  countryCode: "+234",
    fullNumber: "",
    email: "" */
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle phone input change
  /* const handlePhoneChange = (data) => {
    setPhoneData(data)
    setError("")
  } */

  /* const handleEmailChange = (e) => {
    setPhoneData(prev => ({
      ...prev,
      email: e.target.value
    }))
  } */

  const handleInputChange = (e) => {
    setFormData(() => ({
      phoneNumber: e.target.value,
    }));
    //setEmail(e.target.value)
    console.log("phone number:", e.target.value)
  }


  // Validate phone number
  const validatePhoneNumber = () => {
    if (!formData.phoneNumber || formData.phoneNumber.length < 6) {
      setError("Please enter a valid phone number")
      return false
    }

    /* if (!phoneData.countryCode) {
      setError("Please select a country code")
      return false
    } */

    return true
  }

  // Handle continue button click
  const handleContinue = async () => {
    console.log("Sending reset password request with phone:", formData.phoneNumber)
    try {
      setError("")
      setIsSubmitting(true)

      // Validate phone number
      /* if (!validatePhoneNumber()) {
        return
      } */

      // Call the reset password API method
      const response = await resetPassword({
        phone_number: formData.phoneNumber,
      })

      console.log('Reset password response: ', response)

      // Navigate to reset password page after a short delay
      setTimeout(() => {
        if (response.status === "success") {
        navigate("/reset-password", {
          state: {
            /* phoneNumber: phoneData.fullNumber,
            countryCode: phoneData.countryCode,
            phone: phoneData.phoneNumber, */
            email: response.data.email,
            firstname: response.data.firstname,
            id: response.data.id,
          },
        })}
      }, 1500)
    } catch (error) {
      console.error("Reset password error:", error)
      setError(error.message || "Failed to send reset code. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <AuthLayout title="Forgot password?" description="Enter your phone number to continue">
        <div className="space-y-4">
          {/* Success Alert */}
          {/* {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Reset code sent successfully! Redirecting to verification page...
              </AlertDescription>
            </Alert>
          )} */}

          {/* Error Alert */}
          {/* {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )} */}

          {/* Phone Input */}
          {/* <PhoneInput
            label="Phone Number"
            placeholder="Enter your phone number"
            onChange={handlePhoneChange}
            value={phoneData.phoneNumber}
            error={error && !phoneData.phoneNumber ? "Phone number is required" : ""}
            className="space-y-2"
          /> */}

          {/* <InputComponent
            value={phoneData.email}
            onChange={handleEmailChange}
            error={error}
            placeholder="Email address"
            type="email"
          /> */}

          {/* Display selected phone number for confirmation */}
          {/* {phoneData.fullNumber && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <span className="font-medium">Selected number:</span> {phoneData.phoneNumber}
            </div>
          )} */}
          <InputComponent 
          type="phone" 
          placeholder="Enter your phone number" 
          onChange={handleInputChange} 
          value={formData.phoneNumber}
          disabled={loading}
          className="" 
        />
          {/* Continue Button */}
          <ButtonComponent
            variant="primary"
            label={
              isSubmitting || loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </div>
              ) : (
                "Continue"
              )
            }
            buttonStyles="h-[52px] w-full"
            onClick={handleContinue}
            disabled={isSubmitting || loading}
          />

          {/* Back to Login Link */}
          <div className="text-center">
            <Link to="/signin" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </AuthLayout>
    </>
  )
}
