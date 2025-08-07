import { useState } from "react"
import { Plus } from "lucide-react"
import { ButtonComponent } from "@/components/ButtonComponent"
import NewDeliverySideMenu from "@/components/_HomeOVerviewComponents/DeliverySideMenu"
import { useDeliveryModal } from "@/hooks/useDeliveryModal"

export const CreateDeliveryButton = ({
  label = "Create New Delivery",
  variant = "primary",
  buttonStyles = "px-4",
  className = "",
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { openDeliveryModal } = useDeliveryModal()

  const handleDeliveryModal = () => {
    setIsMenuOpen(false)
    openDeliveryModal()
  }

  return (
    <>
      <ButtonComponent
        variant={variant}
        icon={<Plus size={16} />}
        label={label}
        buttonStyles={`${buttonStyles} ${className}`}
        onClick={() => setIsMenuOpen(true)}
      />

      <NewDeliverySideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} openModal={handleDeliveryModal} />
    </>
  )
}
