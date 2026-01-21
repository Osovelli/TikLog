// src/pages/PaymentCallback.jsx
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import axiosInstance from "@/lib/utils/axiosInstance"
import useAuthStore from "@/store/authStore"
import useWalletStore from "@/store/walletStore"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { ButtonComponent } from "@/components/ButtonComponent"

export const PaymentCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { getMe } = useAuthStore()
  const { createDeposit, verifyDeposit } = useWalletStore()
  const { getWalletHistory } = useWalletStore()
  
  const [status, setStatus] = useState("verifying") // verifying | success | failed
  const [message, setMessage] = useState("")

  useEffect(() => {
    const verifyPayment = async () => {
      // Get reference from URL params
      const reference = searchParams.get("reference") || searchParams.get("trxref")
      
      if (!reference) {
        setStatus("failed")
        setMessage("No payment reference found")
        return
      }

      try {
        const response = await verifyDeposit({reference})
        
        const paymentStatus = response.data?.data?.status?.toLowerCase()
        
        if (paymentStatus === "success") {
          setStatus("success")
          setMessage("Your wallet has been funded successfully!")
          
          // Refresh wallet data
          await getMe()
          await getWalletHistory()
        } else if (paymentStatus === "failed") {
          setStatus("failed")
          setMessage("Payment failed. Please try again.")
        } else {
          // Pending or other status
          setStatus("failed")
          setMessage("Payment is still processing. Please check back later.")
        }
      } catch (error) {
        console.error("Error verifying payment:", error)
        setStatus("failed")
        setMessage(error?.response?.data?.message || "Failed to verify payment")
      }
    }

    verifyPayment()
  }, [searchParams, getMe, getWalletHistory])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        
        {/* Verifying State */}
        {status === "verifying" && (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-gray-500">Please wait while we confirm your payment...</p>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-green-600">Payment Successful!</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <ButtonComponent
              label="Go to Wallet"
              variant="primary"
              onClick={() => navigate("/wallet")}
              buttonStyles="w-full"
            />
          </>
        )}

        {/* Failed State */}
        {status === "failed" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-red-600">Payment Failed</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <div className="space-y-3">
              <ButtonComponent
                label="Try Again"
                variant="primary"
                onClick={() => navigate("/wallet")}
                buttonStyles="w-full"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentCallback