import { useCallback } from "react"
import { useModal } from "@/lib/ModalContext"
import { DeliveryDetails } from "@/components/_HomeOVerviewComponents/DeliveryDetails"
import { WalletCard as WalletIcon } from "@/icon/Icons"
import useDeliveryStore from "@/store/deliveryStore"
import { useDeliveryFlow } from "./useDeliveryFlow"

export const useDeliveryModal = () => {
  const { openModal, closeModal } = useModal()
  const { handleCreateOrder } = useDeliveryFlow()

  const openDeliveryModal = useCallback(() => {
    // Always get the latest deliveryInfo from the store
    const latestDeliveryData = useDeliveryStore.getState().deliveryInfo
    console.log("Opening delivery modal with data:", latestDeliveryData)

    if (!latestDeliveryData) {
      console.error("No delivery info available")
      return
    }

    openModal({
      title: "",
      content: <DeliveryDetails data={latestDeliveryData} />,
      icon: <WalletIcon />,
      buttons: [
        { label: "Cancel", onClick: closeModal },
        {
          label: "Continue",
          onClick: () => {
            closeModal()
            handleCreateOrder(latestDeliveryData._id)
          },
          primary: true,
        },
      ],
    })
  }, [openModal, closeModal, handleCreateOrder])

  return {
    openDeliveryModal,
  }
}
