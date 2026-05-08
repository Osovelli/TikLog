// components/_WalletComponents/WithdrawFlowModal.jsx

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ButtonComponent } from "@/components/ButtonComponent"
import { 
  Loader2, 
  Building2, 
  CreditCard, 
  Trash2, 
  Star, 
  Plus, 
  ChevronRight,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import useWalletStore from "@/store/walletStore"
import useBankStore from "@/store/bankStore"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"

// Step 1: Choose Withdrawal Method
export const WithdrawMethodModal = ({ onSelectMethod, onCancel }) => {
  const methods = [
    {
      id: "bank",
      label: "Bank Transfer",
      description: "Withdraw to your bank account",
      icon: Building2,
    },
    {
      id: "paypal",
      label: "PayPal",
      description: "Withdraw to your PayPal account",
      icon: CreditCard,
      disabled: true,
    },
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Choose how you'd like to receive your funds
      </p>

      <div className="space-y-3">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => !method.disabled && onSelectMethod(method.id)}
            disabled={method.disabled}
            className={`w-full p-4 border rounded-lg flex items-center gap-4 transition-all ${
              method.disabled
                ? "opacity-50 cursor-not-allowed bg-gray-50"
                : "hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
            }`}
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <method.icon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-900">{method.label}</p>
              <p className="text-sm text-gray-500">{method.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        ))}
      </div>

      <ButtonComponent
        label="Cancel"
        variant="secondary"
        buttonStyles="w-full"
        onClick={onCancel}
      />
    </div>
  )
}

// Step 2: Select Bank Account
export const SelectBankModal = ({ 
  onSelectBank, 
  onAddBank, 
  onCancel,
  onRefresh
}) => {
  const { getMyBankAccounts, deleteBankAccount, setDefaultBankAccount, loading } = useBankStore()
  const [savedBanks, setSavedBanks] = useState([])
  const [deletingId, setDeletingId] = useState(null)
  const [settingDefaultId, setSettingDefaultId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch banks on mount
  useEffect(() => {
    const fetchBanks = async () => {
      setIsLoading(true)
      try {
        const response = await getMyBankAccounts()
        if (response?.data) {
          setSavedBanks(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch banks:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBanks()
  }, [getMyBankAccounts])

  const refreshBanks = async () => {
    try {
      const response = await getMyBankAccounts()
      if (response?.data) {
        setSavedBanks(response.data)
      }
    } catch (error) {
      console.error("Failed to refresh banks:", error)
    }
  }

  const handleDelete = async (e, accountId) => {
    e.stopPropagation()
    
    try {
      setDeletingId(accountId)
      const response = await deleteBankAccount(accountId)
      if (response) {
        await refreshBanks()
      }
    } catch (error) {
      console.error("Failed to delete bank:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleSetDefault = async (e, accountId) => {
    e.stopPropagation()
    try {
      setSettingDefaultId(accountId)
      const response = await setDefaultBankAccount(accountId)
      if (response) {
        await refreshBanks()
      }
    } catch (error) {
      console.error("Failed to set default:", error)
    } finally {
      setSettingDefaultId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="mt-2 text-gray-600">Loading bank accounts...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Select a bank account to withdraw to
      </p>

      {savedBanks.length === 0 ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900">No bank accounts saved</p>
            <p className="text-sm text-gray-500">Add a bank account to withdraw funds</p>
          </div>
          <ButtonComponent
            label="Add Bank Account"
            buttonStyles="mx-auto"
            variant="primary"
            icon={<Plus className="w-full h-4" />}
            onClick={onAddBank}
          />
        </div>
      ) : (
        <>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {savedBanks.map((bank) => (
              <div
                key={bank._id || bank.id}
                onClick={() => onSelectBank(bank)}
                className="p-4 border rounded-lg flex items-center gap-3 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 truncate">{bank.accountName}</p>
                    {bank.isDefault && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex-shrink-0">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {bank.bankName} • ****{bank.accountNumber?.slice(-4)}
                  </p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  {!bank.isDefault && (
                    <button
                      onClick={(e) => handleSetDefault(e, bank._id || bank.id)}
                      disabled={settingDefaultId === (bank._id || bank.id)}
                      className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                      title="Set as default"
                    >
                      {settingDefaultId === (bank._id || bank.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin text-yellow-600" />
                      ) : (
                        <Star className="w-4 h-4 text-yellow-600" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDelete(e, bank._id || bank.id)}
                    disabled={deletingId === (bank._id || bank.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete bank"
                  >
                    {deletingId === (bank._id || bank.id) ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-600" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <ButtonComponent
            label="Add New Bank"
            variant="secondary"
            icon={<Plus className="w-4 h-4" />}
            buttonStyles="w-full"
            onClick={onAddBank}
          />
        </>
      )}

      <ButtonComponent
        label="Cancel"
        variant="secondary"
        buttonStyles="w-full"
        onClick={onCancel}
      />
    </div>
  )
}

// Step 3: Add Bank Account
export const AddBankModal = ({ onSuccess, onCancel }) => {
  const [accountNumber, setAccountNumber] = useState("")
  const [bankCode, setBankCode] = useState("")
  const [accountName, setAccountName] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [isValidated, setIsValidated] = useState(false)
  const [validationError, setValidationError] = useState("")

  // Track the last validated combo to avoid duplicate calls
  const [lastValidated, setLastValidated] = useState({ bankCode: "", accountNumber: "" })

  const { getBanks, banks, validateBankAccount, addBankAccount, loading } = useBankStore()

  useEffect(() => {
    getBanks()
  }, [getBanks])

  // Debounced auto-validation
  useEffect(() => {
    // Only validate when we have a 10-digit account number and a bank selected
    if (accountNumber.length !== 10 || !bankCode) {
      // Reset validation if inputs become incomplete
      if (isValidated) {
        setIsValidated(false)
        setAccountName("")
      }
      return
    }

    // Skip if this exact combination was already validated successfully
    if (
      lastValidated.bankCode === bankCode && 
      lastValidated.accountNumber === accountNumber &&
      isValidated
    ) {
      return
    }

    // Reset previous validation
    setAccountName("")
    setIsValidated(false)
    setValidationError("")

    // Debounce: wait 800ms after last change before calling API
    const debounceTimer = setTimeout(async () => {
      setIsValidating(true)

      try {
        const response = await validateBankAccount({ bankCode, accountNumber })
        
        if (response?.data?.account_name || response?.data?.accountName) {
          const name = response.data.account_name || response.data.accountName
          setAccountName(name)
          setIsValidated(true)
          setValidationError("")
          setLastValidated({ bankCode, accountNumber })
          toast.success("Account validated successfully!")
        } else {
          setValidationError("Could not validate this account")
          setIsValidated(false)
        }
      } catch (error) {
        // Handle 429 specifically
        if (error?.response?.status === 429) {
          setValidationError("Too many attempts. Please wait a moment and try again.")
        } else {
          setValidationError("Failed to validate account. Try again.")
        }
        console.error("Account validation error:", error)
        setIsValidated(false)
      } finally {
        setIsValidating(false)
      }
    }, 800) // 800ms debounce

    // Cleanup: cancel the timer if inputs change before it fires
    return () => clearTimeout(debounceTimer)
  }, [accountNumber, bankCode]) // Removed validateBankAccount from deps to prevent extra triggers

  // Manual retry button for when debounced validation fails
  const handleManualValidate = async () => {
    if (accountNumber.length !== 10 || !bankCode || isValidating) return

    setIsValidating(true)
    setValidationError("")
    setAccountName("")
    setIsValidated(false)

    try {
      const response = await validateBankAccount({ bankCode, accountNumber })
      
      if (response?.data?.account_name || response?.data?.accountName) {
        const name = response.data.account_name || response.data.accountName
        setAccountName(name)
        setIsValidated(true)
        setValidationError("")
        setLastValidated({ bankCode, accountNumber })
        toast.success("Account validated successfully!")
      } else {
        setValidationError("Could not validate this account")
      }
    } catch (error) {
      if (error?.response?.status === 429) {
        setValidationError("Too many attempts. Please wait a moment and try again.")
      } else {
        setValidationError("Failed to validate account. Try again.")
      }
      console.error("Account validation error:", error)
    } finally {
      setIsValidating(false)
    }
  }

  // Reset validation state when bank or account number changes
  const handleAccountNumberChange = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10)
    setAccountNumber(cleaned)
    
    // If changing from a validated state, reset
    if (isValidated && cleaned !== lastValidated.accountNumber) {
      setIsValidated(false)
      setAccountName("")
      setValidationError("")
    }
  }

  const handleBankChange = (value) => {
    setBankCode(value)
    
    // If changing from a validated state, reset
    if (isValidated && value !== lastValidated.bankCode) {
      setIsValidated(false)
      setAccountName("")
      setValidationError("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isValidated) {
      toast.error("Please validate your account first")
      return
    }

    try {
      const response = await addBankAccount(accountNumber, bankCode, accountName)
      if (response) {
        onSuccess?.()
      }
    } catch (error) {
      console.error("Failed to add bank:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-500">
        Add a new bank account for withdrawals
      </p>

      {/* Bank Selection */}
      <div className="space-y-2 text-left">
        <Label>Select Bank</Label>
        <Select value={bankCode} onValueChange={handleBankChange} disabled={loading}>
          <SelectTrigger className="w-full h-12">
            <SelectValue placeholder="Choose your bank" />
          </SelectTrigger>
          <SelectContent 
            className="max-h-60 z-[9999] w-96" 
            position="popper" 
            sideOffset={5}
            style={{ zIndex: 9999 }}
          >
            {banks?.map((bank) => (
              <SelectItem key={bank.code} value={bank.code}>
                {bank.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Account Number */}
      <div className="space-y-2 text-left">
        <Label>Account Number</Label>
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter 10-digit account number"
            value={accountNumber}
            onChange={(e) => handleAccountNumberChange(e.target.value)}
            className="h-12 pr-10"
            disabled={loading}
            maxLength={10}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValidating && (
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            )}
            {isValidated && !isValidating && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            {validationError && !isValidating && (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>
        
        {/* Character count */}
        <p className="text-xs text-gray-400 text-right">
          {accountNumber.length}/10
        </p>
      </div>

      {/* Validation Error with Retry */}
      {validationError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{validationError}</p>
          </div>
          <button
            type="button"
            onClick={handleManualValidate}
            disabled={isValidating}
            className="text-sm text-red-600 hover:text-red-800 font-medium whitespace-nowrap hover:underline disabled:opacity-50"
          >
            {isValidating ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      {/* Validating Indicator */}
      {isValidating && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-700">Validating account number...</p>
        </div>
      )}

      {/* Account Name (Auto-filled) */}
      {accountName && isValidated && (
        <div className="space-y-2">
          <Label>Account Name</Label>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="font-medium text-green-800">{accountName}</p>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <ButtonComponent
          type="button"
          label="Cancel"
          variant="secondary"
          buttonStyles="flex-1 w-44 shadow-sm hover:shadow-md"
          onClick={onCancel}
          disabled={loading}
        />
        <ButtonComponent
          type="submit"
          label={loading ? "Adding..." : "Add Bank"}
          variant="primary"
          buttonStyles="flex-1 w-44 shadow-sm hover:shadow-md"
          disabled={!isValidated || loading}
          icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        />
      </div>
    </form>
  )
}

// Step 4: Withdrawal Details Form (unchanged)
export const WithdrawalDetailsForm = ({ selectedBank, onSubmit, onBack, onCancel }) => {
  const [amount, setAmount] = useState("")
  const [otp, setOtp] = useState("")
  const [reason, setReason] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)

  const { createWithdrawalOtp, verifyWithdrawal, loading, walletDetails } = useWalletStore()

  const walletBalance = walletDetails?.balance || 0
  const insufficientBalance = parseFloat(amount || 0) > walletBalance

  const quickAmounts = [1000, 2000, 5000, 10000]

  const handleSendOtp = async () => {
    try {
      setSendingOtp(true)
      const response = await createWithdrawalOtp()
      if (response) {
        setOtpSent(true)
        toast.success("OTP sent to your email!")
      }
    } catch (error) {
      console.error("Failed to send OTP:", error)
    } finally {
      setSendingOtp(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    if (!otp || otp.length < 4) {
      toast.error("Please enter the OTP")
      return
    }

    if (insufficientBalance) {
      toast.error("Insufficient balance")
      return
    }

    try {
      const response = await verifyWithdrawal({
        amount: parseFloat(amount),
        otp,
        bankAccountId: selectedBank._id || selectedBank.id,
        reason: reason || "Withdrawal request"
      })

      if (response) {
        onSubmit?.(amount, selectedBank)
      }
    } catch (error) {
      console.error("Withdrawal failed:", error)
    }
  }

  const formatAmount = (value) => {
    return value.replace(/[^0-9]/g, "")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Selected Bank Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{selectedBank.accountName}</p>
          <p className="text-sm text-gray-500 truncate">
            {selectedBank.bankName} • ****{selectedBank.accountNumber?.slice(-4)}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-blue-600 hover:underline flex-shrink-0"
        >
          Change
        </button>
      </div>

      {/* Available Balance */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Available Balance</p>
        <p className="text-xl font-bold text-gray-900">
          ₦{walletBalance.toLocaleString()}
        </p>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <Label>Amount (₦)</Label>
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
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Insufficient balance
          </p>
        )}
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {quickAmounts.map((quickAmount) => (
          <button
            key={quickAmount}
            type="button"
            onClick={() => setAmount(quickAmount.toString())}
            disabled={loading || quickAmount > walletBalance}
            className={`py-2 px-2 text-sm border rounded-lg transition-colors ${
              parseInt(amount) === quickAmount
                ? "bg-blue-500 text-white border-blue-500"
                : quickAmount > walletBalance
                  ? "opacity-50 cursor-not-allowed border-gray-200"
                  : "hover:bg-gray-50 border-gray-200"
            }`}
          >
            ₦{quickAmount.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Reason (Optional) */}
      <div className="space-y-2">
        <Label>Reason (Optional)</Label>
        <Input
          type="text"
          placeholder="What's this withdrawal for?"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="h-12"
          disabled={loading}
          maxLength={100}
        />
      </div>

      {/* OTP Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>OTP Code</Label>
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={sendingOtp || loading}
            className="text-sm text-blue-600 hover:underline disabled:opacity-50"
          >
            {sendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
          </button>
        </div>
        <Input
          type="text"
          placeholder="Enter OTP from email"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="h-12 text-center text-lg tracking-widest"
          disabled={loading}
          maxLength={6}
        />
        {otpSent && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            OTP sent to your email. Check your inbox.
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <ButtonComponent
          type="button"
          label="Cancel"
          variant="secondary"
          buttonStyles="flex-1"
          onClick={onCancel}
          disabled={loading}
        />
        <ButtonComponent
          type="submit"
          label={loading ? "Processing..." : "Withdraw"}
          variant="primary"
          buttonStyles="flex-1"
          disabled={
            !amount || 
            parseFloat(amount) <= 0 || 
            insufficientBalance || 
            !otp || 
            otp.length < 4 || 
            loading
          }
          icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        />
      </div>
    </form>
  )
}