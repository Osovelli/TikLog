import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, User, Phone, AlertCircle, CheckCircle, Search } from "lucide-react"
import { ButtonComponent } from "../ButtonComponent"
import useWalletStore from "@/store/walletStore"

export const TransferForm = ({ onContinue }) => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [foundRider, setFoundRider] = useState(null)
  const [showManualForm, setShowManualForm] = useState(false)
  const [manualDetails, setManualDetails] = useState({
    name: "",
    role: "rider",
    phoneNumber: "",
  })

  const { getRiderByPhone, loading } = useWalletStore()

  // Handle phone number search
  const handleSearchRider = async () => {
    if (!phoneNumber.trim()) {
      setSearchError("Please enter a phone number")
      return
    }

    // Basic phone number validation
    const cleanPhone = phoneNumber.replace(/\D/g, "")
    if (cleanPhone.length < 10) {
      setSearchError("Please enter a valid phone number")
      return
    }

    try {
      setIsSearching(true)
      setSearchError("")
      setFoundRider(null)

      console.log("Searching for rider with phone:", cleanPhone)

      // Call the API to search for rider
      const response = await getRiderByPhone({ phone_number: cleanPhone })

      console.log("Rider search response:", response)

      if (response && response.data) {
        // Rider found
        setFoundRider({
          name: `${response.data.firstname || ""} ${response.data.lastname || ""}`.trim(),
          phoneNumber: cleanPhone,
          role: "rider",
          id: response.data._id || response.data.id,
          email: response.data.email,
        })
        setShowManualForm(false)
      } else {
        // No rider found
        setSearchError("No rider found with this phone number")
        setShowManualForm(true)
        setManualDetails((prev) => ({
          ...prev,
          phoneNumber: cleanPhone,
        }))
      }
    } catch (error) {
      console.error("Error searching for rider:", error)
      setSearchError("No rider found with this phone number. You can enter details manually.")
      setShowManualForm(true)
      setManualDetails((prev) => ({
        ...prev,
        phoneNumber: cleanPhone,
      }))
    } finally {
      setIsSearching(false)
    }
  }

  // Handle manual form input changes
  const handleManualInputChange = (field, value) => {
    setManualDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle continue with found rider
  const handleContinueWithRider = () => {
    if (foundRider) {
      onContinue({
        name: foundRider.name,
        phoneNumber: foundRider.phoneNumber,
        role: foundRider.role,
        id: foundRider.id,
        email: foundRider.email,
      })
    }
  }

  // Handle continue with manual details
  const handleContinueWithManual = () => {
    if (!manualDetails.name.trim()) {
      setSearchError("Please enter the recipient's name")
      return
    }

    onContinue({
      name: manualDetails.name,
      phoneNumber: manualDetails.phoneNumber,
      role: manualDetails.role,
    })
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchRider()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600">
        Enter the phone number to search for a rider, or input details manually if not found.
      </div>

      {/* Phone Number Search */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Phone Number</label>
          <div className="flex gap-2">
            <Input
              type="tel"
              placeholder="Enter phone number (e.g., 08148482126)"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value)
                setSearchError("")
                setFoundRider(null)
                setShowManualForm(false)
              }}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isSearching}
            />
            <Button onClick={handleSearchRider} disabled={isSearching || !phoneNumber.trim()} className="px-4">
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Search Error */}
        {searchError && (
          <Alert variant={foundRider ? "default" : "destructive"}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{searchError}</AlertDescription>
          </Alert>
        )}

        {/* Found Rider Display */}
        {foundRider && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium text-green-800">Rider Found!</div>
                <div className="space-y-1 text-sm text-green-700">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{foundRider.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{foundRider.phoneNumber}</span>
                  </div>
                  {foundRider.email && (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 text-center">@</span>
                      <span>{foundRider.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Manual Input Form */}
        {showManualForm && (
          <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="text-sm font-medium text-gray-700">Enter Recipient Details Manually</div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Recipient Name</label>
                <Input
                  placeholder="Enter recipient's full name"
                  value={manualDetails.name}
                  onChange={(e) => handleManualInputChange("name", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={manualDetails.phoneNumber}
                  onChange={(e) => handleManualInputChange("phoneNumber", e.target.value)}
                  className="mt-1"
                  disabled
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Recipient Role</label>
                <Select value={manualDetails.role} onValueChange={(value) => handleManualInputChange("role", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rider">Rider</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    {/* <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        {foundRider ? (
          <ButtonComponent
            variant="primary"
            label="Continue with Rider"
            onClick={handleContinueWithRider}
            buttonStyles="px-6"
          />
        ) : showManualForm ? (
          <ButtonComponent
            variant="primary"
            label="Continue"
            onClick={handleContinueWithManual}
            disabled={!manualDetails.name.trim()}
            buttonStyles="px-6"
          />
        ) : (null
        )}
      </div>
    </div>
  )
}

export const AmountForm = ({ userData, onConfirm }) => {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { transferTo, loading } = useWalletStore()

  // Validate amount
  const validateAmount = () => {
    if (!amount || isNaN(amount) || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return false
    }

    if (Number.parseFloat(amount) < 1) {
      setError("Minimum transfer amount is ₦1")
      return false
    }

    // You can add maximum amount validation here
    // if (parseFloat(amount) > maxWalletBalance) {
    //   setError("Insufficient wallet balance")
    //   return false
    // }

    return true
  }

  // Handle transfer confirmation
  const handleConfirm = async () => {
    setError("")

    if (!validateAmount()) {
      return
    }

    if (!description.trim()) {
      setError("Please enter a description")
      return
    }

    try {
      setIsSubmitting(true)

      // Prepare transfer payload
      const transferPayload = {
        reciever_role: userData.role || "rider",
        reciever_phone_number: userData.phoneNumber,
        amount: Number.parseFloat(amount),
        description: description.trim(),
      }

      console.log("Transfer payload:", transferPayload)

      // Call the transfer API
      const response = await transferTo(transferPayload)

      console.log("Transfer response:", response)

      // Call the parent confirmation handler
      onConfirm(amount, userData, response)
    } catch (error) {
      console.error("Transfer error:", error)
      setError(error.message || "Transfer failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Recipient Info */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-700 mb-2">Transfer to:</div>
        <div className="space-y-1">
          <div className="font-medium">{userData.name}</div>
          <div className="text-sm text-gray-600">{userData.phoneNumber}</div>
          <div className="text-xs text-gray-500 capitalize">{userData.role}</div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Amount Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              setError("")
            }}
            className="pl-8"
            min="1"
            step="0.01"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <Textarea
          placeholder="Enter transfer description (e.g., Payment for delivery)"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            setError("")
          }}
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      {/* Transfer Summary */}
      {amount && Number.parseFloat(amount) > 0 && (
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">Transfer Summary</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">₦{Number.parseFloat(amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transfer Fee:</span>
              <span className="font-medium">₦0.00</span>
            </div>
            <div className="flex justify-between border-t pt-1 mt-2">
              <span className="font-medium">Total:</span>
              <span className="font-medium">₦{Number.parseFloat(amount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Button */}
      <div className="flex justify-end">
        <ButtonComponent
          variant="primary"
          label={
            isSubmitting || loading ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </div>
            ) : (
              "Confirm Transfer"
            )
          }
          onClick={handleConfirm}
          disabled={isSubmitting || loading || !amount || !description.trim()}
          buttonStyles="px-6"
        />
      </div>
    </div>
  )
}
