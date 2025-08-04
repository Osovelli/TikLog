import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { ButtonComponent } from '@/components/ButtonComponent';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axiosInstance from '@/lib/utils/axiosInstance';
import { Link } from 'react-router-dom';

export const FundWalletForm = ({ onContinue }) => {
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

<<<<<<< Updated upstream
  const initiatePaystackPayment = async () => {
    console.log("button works")
=======
<<<<<<< Updated upstream
=======
  const initiatePaystackPayment = async () => {
    //console.log("button works")
>>>>>>> Stashed changes
    /* if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    } */

    try {
      const response = await axiosInstance.post("/wallet/create_payment", {amount: amount }); // Make API call to create payment
      
      setPaymentUrl(response.data.data.data?.authorization_url);
      console.log("payment url", response.data.data.data?.authorization_url) 
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        //setIsPaystackModalOpen(true);
        const authUrl = response.data.data.data?.authorization_url;
        window.open(authUrl, "_blank"); // Open Paystack in a new tab
        setReference(response.data.data.data?.reference);
<<<<<<< Updated upstream
        console.log("REFERENCE", reference);
=======
        console.log("REFERENCE: ", reference);
>>>>>>> Stashed changes
        //window.open(authUrl, "_blank")
        /* if (newTab) {
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
          }, 3000); // Check payment status every 3 seconds
        } */
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {

    const checkPaymentStatus = async () => {

      if (reference) {

        try {

<<<<<<< Updated upstream
          const verifyResponse = await axiosInstance.get( `/wallet/verify/${reference}`);
=======
          const verifyResponse = await axiosInstance.get(`/wallet/verify/${reference}`);
          console.log("VERIFY RESPONSE: ", verifyResponse)
>>>>>>> Stashed changes
           if (verifyResponse.data.data.status === "success") {

            setPaymentStatus("success");
            console.log('Successful', verifyResponse.data.data.status)

          } else if (verifyResponse.data.data.status === "failed") {

            setPaymentStatus("failed");
<<<<<<< Updated upstream

=======
            console.log('Failed', verifyResponse.data.data.status)
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  const verifyPayment = async (reference) => {
=======
  /* const verifyPayment = async (reference) => {
>>>>>>> Stashed changes
    try {
      const response = await axiosInstance.get(`/wallet/verify/${reference}`);
      setPaymentStatus(response.data.data.status === "success" ? "success" : "failed");
    } catch (error) {
      setPaymentStatus("failed");
    } finally {
      setShowModal(true);
      setPaymentUrl(""); // Close iframe
    }
<<<<<<< Updated upstream
  };

  window.addEventListener("message", handlePaymentCompletion);

=======
  }; */

  window.addEventListener("message", handlePaymentCompletion);

>>>>>>> Stashed changes
>>>>>>> Stashed changes
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
        /* onClick={() => onContinue(amount)} */
        onClick={initiatePaystackPayment}
        label="Continue"
        variant="primary"
        buttonStyles="w-full"
      />

      
    </div>
  );
};