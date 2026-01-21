/* import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { ButtonComponent } from '@/components/ButtonComponent';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axiosInstance from '@/lib/utils/axiosInstance';
import { Link } from 'react-router-dom'; */

/* export const FundWalletForm = ({ onContinue }) => {
  const [amount, setAmount] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [reference, setReference] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isPaystackModalOpen, setIsPaystackModalOpen] = useState(false);
  
  const quickAmounts = [
    { value: '1000.00', label: '₦1,000.00' },
    { value: '2000.00', label: '₦2,000.00' },
    { value: '5000.00', label: '₦5,000.00' },
    { value: '10000.00', label: '₦10,000.00' },
  ];

  const handleQuickAmountClick = (value) => {
    setAmount(value);
  };

  const initiatePaystackPayment = async () => {
    console.log("button works")

    //comment this out
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    //comment this out

    try {
      const response = await axiosInstance.post("/wallet/create_payment", {amount: amount }); // Make API call to create payment
      
      setPaymentUrl(response.data.data.data?.authorization_url);
      console.log("payment url", response.data.data.data?.authorization_url) 
        //setIsPaystackModalOpen(true);
        const authUrl = response.data.data.data?.authorization_url;
        window.open(authUrl, "_blank");
        setReference(response.data.data.data?.reference);
        console.log("REFERENCE", reference);

        //comment this out
         window.open(authUrl, "_blank")
         if (newTab) {
          const interval = setInterval(async () => {
            try {
              const verifyResponse = await axiosInstance.get(`/wallet/verify/${reference}`);
  
              if (verifyResponse.data.data.status === "success") {
                clearInterval(interval);
                setPaymentStatus("success");
                setIsModalOpen(true);
              } else if (verifyResponse.data.data.status === "failed") {
                clearInterval(interval);
                setPaymentStatus("failed");
                setIsModalOpen(true);
              }
            } catch (error) {
              console.error("Error verifying payment", error);
            }
          }, 3000);
        }
        //comment this out

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {

    const checkPaymentStatus = async () => {

      if (reference) {

        try {

          const verifyResponse = await axiosInstance.get( `/wallet/verify/${reference}`);
           if (verifyResponse.data.data.status === "success") {

            setPaymentStatus("success");
            console.log('Successful', verifyResponse.data.data.status)

          } else if (verifyResponse.data.data.status === "failed") {

            setPaymentStatus("failed");

          }

          setIsModalOpen(true);

        } catch (error) {

          console.error("Error verifying payment", error);

        }

      }

    };

    const handleFocus = () => {

      checkPaymentStatus(); // Check payment when user returns

    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus)
  }, [reference])

  const handlePaymentCompletion = (event) => {
    if (event.origin !== "https://checkout.paystack.com") return;

    const reference = new URL(event.data).searchParams.get("reference");
    if (reference) {
      verifyPayment(reference);
    }
  };

  const verifyPayment = async (reference) => {
    try {
      const response = await axiosInstance.get(`/wallet/verify/${reference}`);
      setPaymentStatus(response.data.data.status === "success" ? "success" : "failed");
    } catch (error) {
      setPaymentStatus("failed");
    } finally {
      setShowModal(true);
      setPaymentUrl(""); // Close iframe
    }
  };

  window.addEventListener("message", handlePaymentCompletion);

  return (
    <div className="space-y-4">
      <Input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full"
      />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {quickAmounts.map((amt) => (
          <button
            key={amt.value}
            onClick={() => handleQuickAmountClick(amt.value)}
            className="py-2 px-3 text-sm border rounded-lg hover:bg-gray-50"
          >
            {amt.label}
          </button>
        ))}
      </div>
      
      <Select value={selectedCard} onValueChange={setSelectedCard}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select card" />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={1} className="z-[70]">
          <SelectItem value="card1">**** **** **** 9235 (Visa)</SelectItem>
          <SelectItem value="card2">**** **** **** 9235 (Mastercard)</SelectItem>
        </SelectContent>
      </Select>
      
      <ButtonComponent
        //onClick={() => onContinue(amount)}
        onClick={initiatePaystackPayment}
        label="Continue"
        variant="primary"
        buttonStyles="w-full"
      />

      
    </div>
  );
}; */


import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ButtonComponent } from "@/components/ButtonComponent"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useWalletStore from "@/store/walletStore"
import useAuthStore from "@/store/authStore"
import toast from "react-hot-toast"
import { Loader2, ExternalLink } from "lucide-react"

export const FundWalletForm = ({ onSuccess, onClose }) => {
  const [amount, setAmount] = useState("")
  const [selectedCard, setSelectedCard] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [paymentInitiated, setPaymentInitiated] = useState(false)
  
  // Store methods
  const { createDeposit, verifyDeposit, loading } = useWalletStore()
  const { getMe } = useAuthStore()
  
  // Use ref to persist reference across renders
  const referenceRef = useRef(null)
  const verificationInProgress = useRef(false)

  const quickAmounts = [
    { value: "1000", label: "₦1,000" },
    { value: "2000", label: "₦2,000" },
    { value: "5000", label: "₦5,000" },
    { value: "10000", label: "₦10,000" },
  ]

  const handleQuickAmountClick = (value) => {
    setAmount(value)
  }

  const handleVerifyPayment = async () => {
    const reference = referenceRef.current
    
    if (!reference || verificationInProgress.current) return
    
    console.log("Verifying payment for reference:", reference)
    try {
      verificationInProgress.current = true
      setIsVerifying(true)
      
      const response = await verifyDeposit(reference)
      
      // Check response structure - adjust based on your API response
      const status = response?.data?.transaction?.status?.toLowerCase() || response?.status?.toLowerCase()
      
      if (status === "success" || status === "completed") {
        toast.success("Wallet funded successfully!")
        referenceRef.current = null
        setPaymentInitiated(false)
        
        // Refresh wallet balance
        await getMe()
        
        onSuccess?.(amount)
      } else if (status === "failed" || status === "cancelled") {
        toast.error("Payment failed. Please try again.")
        referenceRef.current = null
        setPaymentInitiated(false)
      } else {
        // Still pending
        toast("Payment still processing. Click 'Verify' again in a moment.", { 
          icon: "⏳",
          duration: 4000 
        })
      }
    } catch (error) {
      console.error("Error verifying payment:", error)
    } finally {
      setIsVerifying(false)
      verificationInProgress.current = false
    }
  }

  const initiatePaystackPayment = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    try {
      const response = await createDeposit({ amount: parseFloat(amount) })
      
      console.log("Create deposit response:", response)
      
      // fall back to different possible response structures
      const authUrl = response?.data?.authorization_url || 
                      response?.authorization_url ||
                      response?.data?.data?.authorization_url
                      
      const ref = response?.data?.reference || 
                  response?.reference ||
                  response?.data?.data?.reference

      if (authUrl && ref) {
        // Store reference
        referenceRef.current = ref
        setPaymentInitiated(true)
        
        // Open Paystack in new tab
        window.open(authUrl, "_blank")
        
        toast.success("Complete payment in the new tab, then return here", { 
          duration: 6000,
          icon: "💳"
        })
      } else {
        console.error("Missing authUrl or reference:", { authUrl, ref, response })
        toast.error("Failed to initiate payment. Please try again.")
      }
    } catch (error) {
      console.error("Failed to initiate deposit:", error)
    }
  }

  // Verify payment when user returns to this tab
  useEffect(() => {
    const handleFocus = () => {
      if (referenceRef.current && !verificationInProgress.current) {
        handleVerifyPayment()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && referenceRef.current && !verificationInProgress.current) {
        handleVerifyPayment()
      }
    }

    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    
    return () => {
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [amount])

  return (
    <div className="space-y-4">
      {paymentInitiated ? (
        // Payment initiated - waiting for user to complete
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            {isVerifying ? (
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            ) : (
              <ExternalLink className="w-8 h-8 text-blue-500" />
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-lg">
              {isVerifying ? "Verifying Payment..." : "Complete Your Payment"}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {isVerifying 
                ? "Please wait while we verify your payment" 
                : "Complete the payment in the Paystack tab, then click the button below"
              }
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              Amount: <span className="font-bold">₦{parseInt(amount).toLocaleString()}</span>
            </p>
          </div>

          <div className="space-y-2">
            <ButtonComponent
              onClick={handleVerifyPayment}
              label={isVerifying ? "Verifying..." : "I've Completed Payment"}
              variant="primary"
              buttonStyles="w-full"
              disabled={isVerifying}
              icon={isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            />
            <ButtonComponent
              onClick={() => {
                referenceRef.current = null
                setPaymentInitiated(false)
                setAmount("")
              }}
              label="Cancel"
              variant="secondary"
              buttonStyles="w-full"
              disabled={isVerifying}
            />
          </div>
          
          <p className="text-xs text-gray-400">
            Payment will auto-verify when you return to this tab
          </p>
        </div>
      ) : (
        // Initial form
        <>
          {/* Amount Input */}
          <div className="space-y-2">
            <Label>Amount (₦)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₦</span>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 h-12 text-lg"
                disabled={loading}
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label className="text-gray-500 text-sm">Quick select</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt.value}
                  type="button"
                  onClick={() => handleQuickAmountClick(amt.value)}
                  disabled={loading}
                  className={`py-2.5 px-3 text-sm border rounded-lg transition-all ${
                    amount === amt.value
                      ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                      : "hover:bg-gray-50 border-gray-200 hover:border-gray-300"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {amt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Card Selection */}
          <Select value={selectedCard} onValueChange={setSelectedCard} disabled={loading}>
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Select card (optional)" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={1} className="z-[70]">
              <SelectItem value="card1">**** **** **** 9235 (Visa)</SelectItem>
              <SelectItem value="card2">**** **** **** 9235 (Mastercard)</SelectItem>
            </SelectContent>
          </Select>

          {/* Amount Summary */}
          {amount && parseFloat(amount) > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount</span>
                <span className="font-medium">₦{parseInt(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Fee</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <ButtonComponent
            onClick={initiatePaystackPayment}
            label={loading ? "Processing..." : "Continue to Payment"}
            variant="primary"
            buttonStyles="w-full"
            disabled={!amount || parseFloat(amount) <= 0 || loading}
            icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          />

          <p className="text-xs text-gray-500 text-center">
            🔒 Secured by Paystack. You'll be redirected to complete payment.
          </p>
        </>
      )}
    </div>
  )
}