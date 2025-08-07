import { useModal } from "@/lib/ModalContext"
import { SearchCheck, AlertTriangle, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useDeliveryStore from "@/store/deliveryStore"
import { useNavigate } from "react-router"

export const useDeliveryFlow = () => {
  const { openModal, closeModal } = useModal()
  const { createOrder } = useDeliveryStore()
  const navigate = useNavigate()

  const handleCreateOrder = async (deliveryId) => {
    if (!deliveryId) {
      console.error("No delivery ID provided to create order")
      return
    }

    console.log("Creating order for delivery ID:", deliveryId)

    try {
      // Show searching modal
      openModal({
        title: "Search for Riders",
        content: (
          <div className="text-center py-6">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Hang in there while we connect you to the perfect rider</p>
          </div>
        ),
        icon: <SearchCheck />,
        buttons: [{ label: "Cancel", onClick: closeModal }],
      })

      // Call the createOrder API
      const response = await createOrder(deliveryId)
      console.log("CreateOrder Response:", response)

      // Close searching modal
      closeModal()

      // Handle response based on success and rider availability
      if (response?.status === "success" && response?.data?.rider) {
        // Rider found - show rider details modal
        setTimeout(() => {
          openModal({
            title: "Rider Found!",
            content: (
              <div className="text-center py-6">
                <div className="w-20 h-20 mx-auto mb-4">
                  <Avatar className="w-20 h-20 border-4 border-green-200">
                    <AvatarImage
                      src={response.data.rider.image || "/placeholder.svg"}
                      alt={response.data.rider.name}
                      className="object-cover"
                    />
                    <AvatarFallback>{response.data.rider.name?.charAt(0).toUpperCase() || "R"}</AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{response.data.rider.name}</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm">Your rider has been assigned and will contact you shortly!</p>
                </div>
              </div>
            ),
            icon: <SearchCheck className="text-green-600" />,
            buttons: [
              { label: "Close", onClick: closeModal },
              {
                label: "Track Delivery",
                onClick: () => {
                  navigate(`/delivery/${response.data.order}`)
                  closeModal()
                  console.log("Navigate to tracking for order:", response.data)
                },
                primary: true,
              },
            ],
          })
        }, 500)
      } else {
        // No rider found - show no riders available modal
        setTimeout(() => {
          openModal({
            title: "",
            content: (
              <div className="text-center py-8">
                {/* Isometric icon container */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl transform rotate-12 shadow-lg"></div>
                  <div className="absolute inset-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl transform rotate-6 shadow-md"></div>
                  <div className="absolute inset-4 bg-white rounded-lg shadow-sm flex items-center justify-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">No Riders Available</h2>
                <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto mb-8">
                  We currently don't have riders available to complete your delivery request at the moment. Kindly check
                  back soon or retry
                </p>
              </div>
            ),
            buttons: [
              {
                label: "Cancel",
                onClick: closeModal,
                className: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
              },
              {
                label: "Retry",
                onClick: () => {
                  closeModal()
                  setTimeout(() => {
                    handleCreateOrder(deliveryId)
                  }, 300)
                },
                primary: true,
                className: "bg-blue-900 hover:bg-blue-800 text-white",
              },
            ],
          })
        }, 500)
      }
    } catch (error) {
      console.error("Error creating order:", error)

      // Close searching modal
      closeModal()

      // Show error modal
      setTimeout(() => {
        openModal({
          title: "Error",
          content: (
            <div className="text-center py-6">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Failed to create order. Please try again.</p>
              <p className="text-sm text-gray-500">{error.message || "An unexpected error occurred"}</p>
            </div>
          ),
          buttons: [
            { label: "Close", onClick: closeModal },
            {
              label: "Try Again",
              onClick: () => {
                closeModal()
                setTimeout(() => {
                  handleCreateOrder(deliveryId)
                }, 300)
              },
              primary: true,
            },
          ],
        })
      }, 500)
    }
  }

  return {
    handleCreateOrder,
  }
}
