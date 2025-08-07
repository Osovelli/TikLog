import { AppLayout } from "@/components/AppLayout"
import { DeliveryTable } from "@/components/_HomeOVerviewComponents/DeliveryTable"
import { Truck } from "lucide-react"
import { useEffect } from "react"
import useDeliveryStore from "@/store/deliveryStore"
import { CreateDeliveryButton } from "@/components/CreateDeliveryButton"

export const MyDeliveries = () => {
  const { getDeliveries, deliveriesData } = useDeliveryStore()
  console.log("Deliveries Data", deliveriesData)

  const handleGetDeliveries = async () => {
    await getDeliveries()
    //console.log("Deliveries Data", deliveriesData)
  }

  useEffect(() => {
    handleGetDeliveries()
  }, [])

  return (
    <AppLayout title={"Deliveries"} icon={<Truck />}>
      <div className="p-8 mt-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold">All Deliveries</h2>
            <span className="text-sm text-[#868C98]">Manage and track your deliveries</span>
          </div>
          <CreateDeliveryButton label="New Delivery" buttonStyles="px-6" />
        </div>

        {/* Deliveries content */}
        <div className="rounded-lg shadow-sm">
          <div className="bg-white">
            <DeliveryTable data={deliveriesData} />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
