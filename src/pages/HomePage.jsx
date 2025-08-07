import { AppLayout } from "@/components/AppLayout"
import { DeliveryOverview } from "@/components/DeliveryOverview"
import { DeliveryTable } from "@/components/_HomeOVerviewComponents/DeliveryTable"
import { OngoingDelivery } from "@/components/_HomeOVerviewComponents/OngoingDelivery"
import { WalletCard } from "@/components/_HomeOVerviewComponents/WalletCard"
import { HomeIcon } from "lucide-react"
import { useEffect } from "react"
import useDeliveryStore from "@/store/deliveryStore"
import { CreateDeliveryButton } from "@/components/CreateDeliveryButton"

export const HomePage = () => {
  const { getDeliveries, deliveriesData, getDeliveryOverview, deliveryOverview, deliveryInfo } = useDeliveryStore()

  const handleGetDeliveriesOverview = async () => {
    await getDeliveryOverview()
  }

  const handleGetDeliveries = async () => {
    await getDeliveries()
    console.log("Deliveries Data", deliveriesData)
  }

  useEffect(() => {
    deliveryInfo && console.log("Delivery Info", deliveryInfo)
  }, [deliveryInfo])

  useEffect(() => {
    handleGetDeliveries()
    handleGetDeliveriesOverview()
  }, [])

  return (
    <AppLayout title={"Home"} icon={<HomeIcon />}>
      <div className="p-8 mt-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold">Overview</h2>
            <span className="text-sm text-[#868C98]">Last updated Tue 25 Sep, 2024 09:45pm</span>
          </div>
          <CreateDeliveryButton />
        </div>

        {/* Main content */}
        <div className="rounded-lg shadow-sm">
          <div className="bg-white grid grid-cols-1 md:grid-cols-2 gap-2">
            <DeliveryOverview data={deliveryOverview} />
            <WalletCard />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <DeliveryTable data={deliveriesData} />
            <OngoingDelivery />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
