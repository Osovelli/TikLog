import { useRef, useState } from "react"
import {
  Package,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Bike,
  Car,
  Truck,
  AlertCircle,
  Plus,
  Loader2,
  Navigation,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ButtonComponent } from "./ButtonComponent"
import useDeliveryStore from "@/store/deliveryStore"

const vehicleTypes = [
  { name: "Bicycle", icon: Bike, value: "bicycle" },
  { name: "Motorcycle", icon: Bike, value: "motorcycle" },
  { name: "Car", icon: Car, value: "car" },
  { name: "Van", icon: Car, value: "van" },
  { name: "Truck", icon: Truck, value: "truck" },
]

const deliveryTypes = [
  { label: "Any", value: "any" },
  { label: "Perishable", value: "perishable" },
  { label: "Clothing", value: "cloth" },
  { label: "Electronics", value: "electronics" },
  { label: "Document", value: "document" },
  { label: "Others", value: "others" },
]

const deliverySizes = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Big", value: "big" },
]

const SectionHeader = ({ children }) => (
  <h3 className="text-sm font-medium mb-4 text-center relative">
    <span className="bg-white px-4 relative z-10">{children}</span>
    <span className="absolute inset-0 flex items-center" aria-hidden="true">
      <span className="w-full border-t border-gray-300"></span>
    </span>
  </h3>
)

export const NewDeliveryForm = ({ openDeliveryModal }) => {
  const [deliveryItems, setDeliveryItems] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGettingCoordinates, setIsGettingCoordinates] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [coordinates, setCoordinates] = useState({
    from_lat: "",
    from_long: "",
    to_lat: "",
    to_long: "",
  })

  const [formValues, setFormValues] = useState({
    pickupLocation: "",
    deliveryLocation: "",
    receiverName: "",
    receiverPhone: "",
    deliveryType: "",
    deliverySize: "",
    itemValue: "",
    additionalNote: "",
  })

  const scrollContainerRef = useRef(null)
  const { createDelivery, loading } = useDeliveryStore()

  // Free geocoding function using OpenStreetMap Nominatim
  const getCoordinatesFromAddress = async (address) => {
    try {
      // Add Nigeria context to improve accuracy
      const searchQuery = `${address}, Nigeria`

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=ng&addressdetails=1`,
        {
          headers: {
            "User-Agent": "DeliveryApp/1.0 (contact@deliveryapp.com)",
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch coordinates")
      }

      const data = await response.json()

      if (data.length > 0) {
        const result = data[0]
        console.log("Geocoding result:", result)

        return {
          lat: result.lat,
          lng: result.lon,
          display_name: result.display_name,
        }
      } else {
        throw new Error("Address not found")
      }
    } catch (error) {
      console.error("Geocoding error:", error)
      throw error
    }
  }

  // Function to get coordinates for both addresses
  const fetchCoordinates = async () => {
    if (!formValues.pickupLocation || !formValues.deliveryLocation) {
      setError("Please enter both pickup and delivery locations")
      return false
    }

    try {
      setIsGettingCoordinates(true)
      setError("")

      console.log("Fetching coordinates for addresses...")
      console.log("Pickup:", formValues.pickupLocation)
      console.log("Delivery:", formValues.deliveryLocation)

      // Get coordinates for both addresses
      const [fromCoords, toCoords] = await Promise.all([
        getCoordinatesFromAddress(formValues.pickupLocation),
        getCoordinatesFromAddress(formValues.deliveryLocation),
      ])

      console.log("From coordinates:", fromCoords)
      console.log("To coordinates:", toCoords)

      setCoordinates({
        from_lat: fromCoords.lat,
        from_long: fromCoords.lng,
        to_lat: toCoords.lat,
        to_long: toCoords.lng,
      })

      return true
    } catch (error) {
      console.error("Error fetching coordinates:", error)

      // Provide fallback coordinates for common Lagos areas
      const lagosAreas = {
        ikeja: { lat: "6.5954", lng: "3.3364" },
        "victoria island": { lat: "6.4281", lng: "3.4219" },
        lekki: { lat: "6.4474", lng: "3.4647" },
        surulere: { lat: "6.4969", lng: "3.3481" },
        yaba: { lat: "6.5158", lng: "3.3696" },
        ikorodu: { lat: "6.6194", lng: "3.5106" },
        anthony: { lat: "6.5618", lng: "3.3712" },
      }

      // Try to match common areas
      const pickupArea = Object.keys(lagosAreas).find((area) => formValues.pickupLocation.toLowerCase().includes(area))
      const deliveryArea = Object.keys(lagosAreas).find((area) =>
        formValues.deliveryLocation.toLowerCase().includes(area),
      )

      if (pickupArea || deliveryArea) {
        setCoordinates({
          from_lat: pickupArea ? lagosAreas[pickupArea].lat : "6.5244",
          from_long: pickupArea ? lagosAreas[pickupArea].lng : "3.3792",
          to_lat: deliveryArea ? lagosAreas[deliveryArea].lat : "6.5244",
          to_long: deliveryArea ? lagosAreas[deliveryArea].lng : "3.3792",
        })

        setError("Using approximate coordinates for your locations. Please verify the addresses are correct.")
        return true
      } else {
        // Use default Lagos coordinates
        setCoordinates({
          from_lat: "6.5244",
          from_long: "3.3792",
          to_lat: "6.5244",
          to_long: "3.3792",
        })

        setError(
          "Could not find exact coordinates. Using default Lagos coordinates. Please ensure your addresses are correct.",
        )
        return true
      }
    } finally {
      setIsGettingCoordinates(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (error) {
      setError("")
    }
    setSuccess(false)

    // Clear coordinates when addresses change
    if (field === "pickupLocation" || field === "deliveryLocation") {
      setCoordinates({
        from_lat: "",
        from_long: "",
        to_lat: "",
        to_long: "",
      })
    }
  }

  // Handle vehicle selection
  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle.value)
    setError("")
  }

  // Validate form data
  const validateForm = () => {
    const requiredFields = [
      { field: "pickupLocation", message: "Pickup location is required" },
      { field: "deliveryLocation", message: "Delivery location is required" },
      { field: "receiverName", message: "Receiver name is required" },
      { field: "receiverPhone", message: "Receiver phone number is required" },
      { field: "deliveryType", message: "Delivery type is required" },
      { field: "deliverySize", message: "Delivery size is required" },
      { field: "itemValue", message: "Item value is required" },
    ]

    // Check required fields
    for (const { field, message } of requiredFields) {
      if (!formValues[field] || formValues[field].trim() === "") {
        setError(message)
        return false
      }
    }

    // Check vehicle selection
    if (!selectedVehicle) {
      setError("Please select a vehicle type")
      return false
    }

    // Validate phone number (Nigerian format)
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/
    const cleanPhone = formValues.receiverPhone.replace(/\s+/g, "")
    if (!phoneRegex.test(cleanPhone) && !/^[0-9]{10,15}$/.test(cleanPhone.replace(/\D/g, ""))) {
      setError("Please enter a valid Nigerian phone number (e.g., 08138459019)")
      return false
    }

    // Validate item value
    const itemValue = Number.parseFloat(formValues.itemValue)
    if (isNaN(itemValue) || itemValue <= 0) {
      setError("Please enter a valid item value")
      return false
    }

    // Check if coordinates are available
    if (!coordinates.from_lat || !coordinates.to_lat) {
      setError("Location coordinates are required. Please fetch coordinates first.")
      return false
    }

    return true
  }

  // Handle continue button click
  const handleContinue = async () => {
    try {
      setIsSubmitting(true)
      setError("")

      // First, get coordinates if not already available
      if (!coordinates.from_lat || !coordinates.to_lat) {
        const coordsSuccess = await fetchCoordinates()
        if (!coordsSuccess) {
          return
        }
      }

      // Validate form
      if (!validateForm()) {
        return
      }

      console.log("Creating delivery with form data:", formValues)
      console.log("Coordinates:", coordinates)
      console.log("Selected vehicle:", selectedVehicle)

      // Prepare API payload exactly as specified
      const deliveryPayload = {
        from_address: formValues.pickupLocation.trim(),
        to_address: formValues.deliveryLocation.trim(),
        from_lat: coordinates.from_lat,
        from_long: coordinates.from_long,
        to_lat: coordinates.to_lat,
        to_long: coordinates.to_long,
        reciever_name: formValues.receiverName.trim(),
        reciever_phone: formValues.receiverPhone.trim(),
        delivery_type: formValues.deliveryType,
        delivery_type_size: formValues.deliverySize,
        item_value: formValues.itemValue,
        additional_notes: formValues.additionalNote.trim() || "",
        driving_mode: selectedVehicle,
      }

      console.log("API Payload:", deliveryPayload)

      // Call the createDelivery API
      const response = await createDelivery(deliveryPayload)

      console.log("Delivery created successfully:", response)
      setSuccess(true)

      // Reset form after successful creation
      setFormValues({
        pickupLocation: "",
        deliveryLocation: "",
        receiverName: "",
        receiverPhone: "",
        deliveryType: "",
        deliverySize: "",
        itemValue: "",
        additionalNote: "",
      })
      setSelectedVehicle("")
      setCoordinates({
        from_lat: "",
        from_long: "",
        to_lat: "",
        to_long: "",
      })

      // Open delivery modal with the created delivery details
      if (openDeliveryModal) {
        setTimeout(() => {
          openDeliveryModal(response)
        }, 500)
      }
    } catch (error) {
      console.error("Delivery creation error:", error)
      setError(error.message || "Failed to create delivery. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle get coordinates button click
  const handleGetCoordinates = async () => {
    await fetchCoordinates()
  }

  const handleAddItem = () => {
    // Validate current form before adding item
    if (!formValues.pickupLocation || !formValues.itemValue) {
      setError("Please fill in pickup location and item value before adding")
      return
    }

    const newItem = {
      id: Date.now().toString(),
      location: formValues.deliveryLocation || formValues.pickupLocation,
      timestamp: new Date().toLocaleString(),
      cost: Number.parseFloat(formValues.itemValue) || 0,
      deliveryType: formValues.deliveryType,
      deliverySize: formValues.deliverySize,
      receiverName: formValues.receiverName,
      receiverPhone: formValues.receiverPhone,
      additionalNote: formValues.additionalNote,
    }

    setDeliveryItems([...deliveryItems, newItem])

    // Reset form after adding item (keep pickup location)
    setFormValues((prev) => ({
      ...prev,
      deliveryLocation: "",
      receiverName: "",
      receiverPhone: "",
      deliveryType: "",
      deliverySize: "",
      itemValue: "",
      additionalNote: "",
    }))

    // Clear coordinates for delivery location
    setCoordinates((prev) => ({
      ...prev,
      to_lat: "",
      to_long: "",
    }))

    setError("")
  }

  const handleEditItem = (id) => {
    setEditingId(id)
    const item = deliveryItems.find((item) => item.id === id)
    if (item) {
      setFormValues((prev) => ({
        ...prev,
        deliveryLocation: item.location || "",
        receiverName: item.receiverName || "",
        receiverPhone: item.receiverPhone || "",
        deliveryType: item.deliveryType || "",
        deliverySize: item.deliverySize || "",
        itemValue: item.cost?.toString() || "",
        additionalNote: item.additionalNote || "",
      }))
    }
  }

  const handleDeleteItem = (id) => {
    setDeliveryItems(deliveryItems.filter((item) => item.id !== id))
    if (editingId === id) {
      setEditingId(null)
    }
  }

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -120 : 120
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <div className="bg-white h-[88vh] w-full max-w-md mx-auto flex flex-col overflow-y-auto my-6 space-y-4">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Success Alert */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Delivery created successfully! Opening details...
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Delivery Items List */}
        {deliveryItems.length > 0 && (
          <div className="p-4 border-b">
            <h4 className="text-sm font-medium mb-3">Added Items ({deliveryItems.length})</h4>
            <div className="space-y-2">
              {deliveryItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.receiverName || "No name"}</div>
                    <div className="text-xs text-gray-500">{item.location}</div>
                    <div className="text-xs text-gray-500">
                      ₦{item.cost} • {item.deliveryType}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditItem(item.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Address Inputs */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
            <Package className="h-6 w-6 text-gray-500 flex-shrink-0" />
            <Input
              placeholder="Pickup location (e.g., 2 Ebute Ipakodo Road, Ikorodu, Lagos)"
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              value={formValues.pickupLocation}
              onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
              disabled={isSubmitting || isGettingCoordinates}
            />
          </div>
          <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
            <MapPin className="h-6 w-6 text-gray-500 flex-shrink-0" />
            <Input
              placeholder="Delivery location (e.g., Anthony Village Recreation Center, Lagos)"
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              value={formValues.deliveryLocation}
              onChange={(e) => handleInputChange("deliveryLocation", e.target.value)}
              disabled={isSubmitting || isGettingCoordinates}
            />
          </div>

          {/* Get Coordinates Button */}
          {formValues.pickupLocation && formValues.deliveryLocation && (
            <Button
              onClick={handleGetCoordinates}
              disabled={isGettingCoordinates || isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isGettingCoordinates ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Coordinates...
                </div>
              ) : (
                <div className="flex items-center">
                  <Navigation className="mr-2 h-4 w-4" />
                  Get Location Coordinates
                </div>
              )}
            </Button>
          )}

          {/* Coordinates Display */}
          {(coordinates.from_lat || coordinates.to_lat) && (
            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded border">
              <div className="font-medium mb-1">📍 Coordinates Found:</div>
              <div className="space-y-1">
                <div>
                  <span className="font-medium">From:</span> {coordinates.from_lat}, {coordinates.from_long}
                </div>
                <div>
                  <span className="font-medium">To:</span> {coordinates.to_lat}, {coordinates.to_long}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Vehicle Type Selection */}
        <div>
          <h3 className="text-sm font-medium mb-2">Vehicle type</h3>
          <div className="relative">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 z-10 bg-white bg-opacity-75"
                onClick={() => scroll("left")}
                disabled={isSubmitting || isGettingCoordinates}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Scroll left</span>
              </Button>
              <div ref={scrollContainerRef} className="flex overflow-x-auto space-x-2 py-2 px-8 scrollbar-hide">
                {vehicleTypes.map((vehicle) => (
                  <Button
                    key={vehicle.name}
                    variant={selectedVehicle === vehicle.value ? "default" : "outline"}
                    className="flex flex-col items-center p-2 h-auto min-w-[80px] flex-shrink-0"
                    onClick={() => handleVehicleSelect(vehicle)}
                    disabled={isSubmitting || isGettingCoordinates}
                  >
                    <vehicle.icon className="w-10 h-10 mb-1" />
                    <span className="text-xs">{vehicle.name}</span>
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 z-10 bg-white bg-opacity-75"
                onClick={() => scroll("right")}
                disabled={isSubmitting || isGettingCoordinates}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Scroll right</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Receiver Information */}
        <div>
          <SectionHeader>RECEIVER'S INFORMATION</SectionHeader>
          <div className="space-y-2">
            <Input
              placeholder="Receiver's name* (e.g., Awodele Blessing)"
              value={formValues.receiverName}
              onChange={(e) => handleInputChange("receiverName", e.target.value)}
              disabled={isSubmitting || isGettingCoordinates}
            />
            <Input
              placeholder="Phone number* (e.g., 08138459019)"
              value={formValues.receiverPhone}
              onChange={(e) => handleInputChange("receiverPhone", e.target.value)}
              disabled={isSubmitting || isGettingCoordinates}
            />
          </div>
        </div>

        {/* Delivery Information */}
        <div>
          <SectionHeader>DELIVERY INFORMATION</SectionHeader>
          <div className="space-y-2">
            <Select
              value={formValues.deliveryType}
              onValueChange={(value) => handleInputChange("deliveryType", value)}
              disabled={isSubmitting || isGettingCoordinates}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select delivery type*" />
              </SelectTrigger>
              <SelectContent>
                {deliveryTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={formValues.deliverySize}
              onValueChange={(value) => handleInputChange("deliverySize", value)}
              disabled={isSubmitting || isGettingCoordinates}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select delivery size*" />
              </SelectTrigger>
              <SelectContent>
                {deliverySizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Item estimated value* (e.g., 6000)"
              value={formValues.itemValue}
              onChange={(e) => handleInputChange("itemValue", e.target.value)}
              type="number"
              min="1"
              disabled={isSubmitting || isGettingCoordinates}
            />
            <Input
              placeholder="Additional note (e.g., goodmorning jesus)"
              value={formValues.additionalNote}
              onChange={(e) => handleInputChange("additionalNote", e.target.value)}
              disabled={isSubmitting || isGettingCoordinates}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t">
        <div className="flex justify-around gap-4">
          <ButtonComponent
            variant="outline"
            label="Add More"
            icon={<Plus className="w-4 h-4 mr-2 bg-transparent" />}
            buttonStyles="flex-1"
            onClick={handleAddItem}
            disabled={isSubmitting || isGettingCoordinates}
          />
          <ButtonComponent
            variant="primary"
            label={
              isSubmitting || loading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </div>
              ) : (
                "Continue"
              )
            }
            buttonStyles="flex-1"
            onClick={handleContinue}
            disabled={isSubmitting || loading || isGettingCoordinates}
          />
        </div>
      </div>
    </div>
  )
}
