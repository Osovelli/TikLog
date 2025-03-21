mport React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";

const PaystackPayment = () => {
  const [amount, setAmount] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const initiatePayment = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/create-payment", {
        email: "customer@example.com",
        amount: Number(amount),
      });

      setPaymentUrl(response.data.payment_url);
    } catch (error) {
      alert("Failed to initialize payment.");
    }
  };

  const handlePaymentCompletion = (event) => {
    if (event.origin !== "https://checkout.paystack.com") return;

    const reference = new URL(event.data).searchParams.get("reference");
    if (reference) {
      verifyPayment(reference);
    }
  };

  const verifyPayment = async (reference) => {
    try {
      const response = await axios.get(`http://localhost:5000/verify-payment/${reference}`);
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
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Enter Amount (NGN)</h2>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: "10px", width: "200px", marginBottom: "10px" }}
      />
      <br />
      <button onClick={initiatePayment} style={{ padding: "10px 20px", cursor: "pointer" }}>
        Pay with Paystack
      </button>

      {paymentUrl && <iframe src={paymentUrl} style={{ width: "100%", height: "600px", marginTop: "20px" }} />}

      <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)}>
        <h2 style={{ color: paymentStatus === "success" ? "green" : "red" }}>
          {paymentStatus === "success" ? "Payment Successful!" : "Payment Failed!"}
        </h2>
        <button onClick={() => setShowModal