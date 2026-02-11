/* import { useState} from "react";
import { Input } from "../ui/input";

// Create a TransferForm component (can be in the same file or separate)
export const TransferForm = ({ onContinue }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  
  return (
    <div className='w-full flex items-center flex-col gap-2 space-y-10'>
      <p className='text-sm'>Transfer funds securely to other Tiklog users..</p>
      <Input 
        className="w-72" 
        placeholder="Recipient's Phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button 
        className="w-72 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        onClick={() => onContinue(phoneNumber)}
      >
        Continue
      </button>
    </div>
  );
};

// New component for the amount form
export const AmountForm = ({ userData, onConfirm }) => {
  const [amount, setAmount] = useState('');

  const predefinedAmounts = [
    { value: 1000, label: 'N1,000.00' },
    { value: 2000, label: 'N2,000.00' },
    { value: 5000, label: 'N5,000.00' },
    { value: 10000, label: 'N10,000.00' }
  ];

  return (
    <div className='w-full flex flex-col items-center gap-2'>
      <p>Transfer funds securely to other Tiklog users..</p>
      <div className="bg-gray-50 p-4 rounded-lg w-72 mt-6">
        <p className="font-medium">{userData.name}</p>
        <p className="text-gray-600">{userData.phoneNumber}</p>
      </div>
      
      <Input 
        className="w-72 h-12" 
        placeholder="Enter amount" 
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      
      <div className="grid grid-cols-2 md:flex gap-2 mt-4">
        {predefinedAmounts.map((preset) => (
          <button 
            key={preset.value}
            className="p-2 border rounded-lg hover:bg-gray-50"
            onClick={() => setAmount(preset.value)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <button 
        className="w-72 mt-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        onClick={() => onConfirm(amount)}
      >
        Confirm
      </button>
    </div>
  );
}; */

// components/_WalletComponents/TransferFlowModal.jsx

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ButtonComponent } from "@/components/ButtonComponent"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Phone, User } from "lucide-react"
import useWalletStore from "@/store/walletStore"
import useAuthStore from "@/store/authStore"
import toast from "react-hot-toast"

export const TransferForm = ({ onContinue, onCancel }) => {
  const [phone, setPhone] = useState("")
  const [ownerType, setOwnerType] = useState("customer") // Changed from "user" to "customer"
  
  const { loading } = useWalletStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate phone number
    if (!phone) {
      toast.error("Please enter a phone number")
      return
    }
    
    if (phone.length < 10) {
      toast.error("Please enter a valid phone number")
      return
    }

    //console.log("Submitting with:", { phone, ownerType }) // Debug log
    
    await onContinue(phone, ownerType)
  }

  const formatPhoneNumber = (value) => {
    // Remove non-numeric characters and limit to 11 digits
    return value.replace(/[^0-9]/g, "").slice(0, 11)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Owner Type Selection */}
      <div className="space-y-2 text-start">
        <Label className="text-sm font-semibold">Recipient Type</Label>
        <Select value={ownerType} onValueChange={setOwnerType} disabled={loading}>
          <SelectTrigger className="w-full h-12">
            <SelectValue placeholder="Select recipient type" />
          </SelectTrigger>
          <SelectContent className="max-h-60 z-[9999] w-96">
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
            <SelectItem value="rider">Rider</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Phone Number Input */}
      <div className="space-y-2 text-start">
        <Label className="text-sm font-semibold">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            className="pl-10 h-12"
            disabled={loading}
            maxLength={11}
          />
        </div>
        <p className="text-xs text-gray-500">Enter the recipient's registered phone number</p>
      </div>

      {/* Buttons */}
      <div className="flex w-full justify-center gap-3 pt-2">
        <ButtonComponent
          type="button"
          label="Cancel"
          variant="secondary"
          buttonStyles="w-40 flex-1"
          onClick={onCancel}
          disabled={loading}
        />
        <ButtonComponent
          type="submit"
          label={loading ? "Validating..." : "Continue"}
          variant="primary"
          buttonStyles="flex-1 w-40"
          disabled={!phone || phone.length < 10 || loading}
          icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        />
      </div>
    </form>
  )
}

export const AmountForm = ({ userData, onConfirm, onCancel }) => {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  
  const { loading } = useWalletStore()
  const { walletDetails } = useAuthStore()

  const quickAmounts = [500, 1000, 2000, 5000]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!amount || parseFloat(amount) <= 0) {
      return
    }

    await onConfirm(amount, description)
  }

  const formatAmount = (value) => {
    return value.replace(/[^0-9]/g, "")
  }

  const insufficientBalance = walletDetails?.balance < parseFloat(amount || 0)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Recipient Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{userData.name}</p>
          <p className="text-sm text-gray-500">{userData.phone}</p>
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-2 text-start">
        <Label className="text-sm text-left font-semibold">Amount (₦)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₦</span>
          <Input
            type="text"
            placeholder="0.00"
            value={amount ? parseInt(amount).toLocaleString() : ""}
            onChange={(e) => setAmount(formatAmount(e.target.value.replace(/,/g, "")))}
            className="pl-8 h-12 text-lg font-semibold"
            disabled={loading}
          />
        </div>
        {insufficientBalance && amount && (
          <p className="text-xs text-red-500">Insufficient wallet balance</p>
        )}
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {quickAmounts.map((quickAmount) => (
          <button
            key={quickAmount}
            type="button"
            onClick={() => setAmount(quickAmount.toString())}
            disabled={loading}
            className={`py-2 px-2 text-sm border rounded-lg transition-colors ${
              parseInt(amount) === quickAmount
                ? "bg-blue-500 text-white border-blue-500"
                : "hover:bg-gray-50 border-gray-200"
            }`}
          >
            ₦{quickAmount.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Description (Optional) */}
      <div className="space-y-2 text-start">
        <Label className="text-sm text-left font-semibold">Description (Optional)</Label>
        <Input
          type="text"
          placeholder="What's this for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-12"
          disabled={loading}
          maxLength={100}
        />
      </div>

      {/* Transfer Summary */}
      {amount && parseFloat(amount) > 0 && !insufficientBalance && (
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount</span>
            <span className="font-medium">₦{parseInt(amount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Fee</span>
            <span className="font-medium text-green-600">Free</span>
          </div>
          <div className="border-t pt-2 flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-semibold text-blue-600">₦{parseInt(amount).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <ButtonComponent
          type="button"
          label="Back"
          variant="secondary"
          buttonStyles="flex-1 w-40"
          onClick={onCancel}
          disabled={loading}
        />
        <ButtonComponent
          type="submit"
          label={loading ? "Transferring..." : "Transfer"}
          variant="primary"
          buttonStyles="flex-1 w-40"
          disabled={!amount || parseFloat(amount) <= 0 || insufficientBalance || loading}
          icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        />
      </div>
    </form>
  )
}