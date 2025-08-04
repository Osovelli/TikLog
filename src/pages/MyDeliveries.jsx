/* import { AppLayout } from '@/components/AppLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import { Table } from '@/components/Table';
import useDeliveryStore from '@/store/deliveryStore';
import { Plus } from 'lucide-react'
import React, { useEffect } from 'react'

// Example usage:
const columns = [
  { key: 'rideId', label: 'Ride ID' },
  { key: 'from', label: 'From' },
  { key: 'to', label: 'To' },
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'deliveries', label: 'Deliveries' },
  { key: 'status', label: 'Status' },
  { key: 'fee', label: 'Fee' }
];

const data = [
  {
    id: 1,
    rideId: '#123354',
    from: 'Ikeja, Lagos',
    to: 'Lekki, Lagos',
    vehicle: 'Car',
    deliveries: 2,
    status: 'Delivered',
    fee: '1,600'
  },
  // ... more data
];


export const MyDeliveries = () => {

  return (
    <AppLayout title={'Deliveries'}>
        <div className='p-8'>
            <div className="flex justify-between items-start mb-8">
                <div className='max-w-[10rem] sm:max-w-full'>
                    <h2 className="sm:text-2xl text-base font-semibold">My Deliveries</h2>
                    <span className='sm:text-sm text-xs text-[#868C98]'>Keep track of all your deliveries</span>
                </div>
                <ButtonComponent 
                variant='primary' 
                icon={<Plus size={16}/>} 
                label={"Create New"} 
                buttonStyles="sm:px-4 px-2 h-[30px] sm:h-[52px]" 
                onClick={() => ('')} 
                />
            </div>
            <Table 
            data={data}
            columns={columns}
            onRowClick={(item) => console.log('clicked:', item)}
            itemsPerPage={10}
            />
        </div>
    </AppLayout>
  )
} */

import { Table } from "@/components/Table"
import { ButtonComponent } from "@/components/ButtonComponent"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import useDeliveryStore from "@/store/deliveryStore"
import { useNavigate } from "react-router"
import { useCallback, useEffect, useState } from "react"
import { AppLayout } from "@/components/AppLayout"
import { Plus } from "lucide-react"
import NewDeliverySideMenu from "@/components/_HomeOVerviewComponents/DeliverySideMenu"
import { useModal } from "@/lib/ModalContext"
import { CreateDeliveryButton } from "@/components/CreateDeliveryButton"
  
  export const MyDeliveries = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {getDeliveries, deliveriesData} = useDeliveryStore()
    const navigate = useNavigate()
    const {openModal, closeModal} = useModal()

  //open create delivery modal
  const handleDeliveryModal = useCallback(() => {
    setIsMenuOpen(false);
    openModal({
      title: "",
      content: <DeliveryDetails />,
      icon: <WalletIcon />,
      buttons: [
        { label: 'Cancel', onClick: closeModal },
        { 
          label: 'Continue', 
          onClick: () => {
            closeModal();
            setTimeout(() => {
              openModal({
                title: "Search for Riders",
                content: 'Hang in there while we connect you to the perfect rider',
                icon: <SearchCheck />,
                buttons: [
                  { label: 'Cancel', onClick: closeModal },
                ]
              });
            }, 600); // 300ms delay, adjust as needed
          }, 
          primary: true 
        }
      ]
    });
  }, [openModal, closeModal]);
  
  //fetch user deliveries  
  const handleGetDeliveries = async() => {
      await getDeliveries()
      console.log("Deliveries Data", deliveriesData)
    }

    useEffect(() => {
        handleGetDeliveries()
      }, []
    )

    // Transform API data to match table structure
    const transformDeliveryData = (apiData) => {
      if (!apiData || !Array.isArray(apiData)) {
        console.log("DeliveryTable: Invalid data format", apiData)
        return []
      }
  
      return apiData.map((delivery, index) => {
        // Safely extract values and convert to strings
        const safeString = (value) => {
          if (value === null || value === undefined) return "N/A"
          if (typeof value === "object") {
            // If it's an object, try to extract meaningful info
            if (value.name) return String(value.name)
            if (value.address) return String(value.address)
            if (value.location) return String(value.location)
            return "N/A"
          }
          return String(value)
        }
  
        // Extract and format delivery ID
        const deliveryId = delivery.delivery_id._id || delivery._id || delivery.id || `DEL-${index + 1}`
        const formattedId = deliveryId.toString().startsWith("#") ? deliveryId : `#${deliveryId}`
  
        return {
          id: formattedId,
          from: safeString(delivery.pickupLocation.address || delivery.pickup_location || delivery.from),
          to: safeString(delivery.deliveryLocation.address|| delivery.delivery_location || delivery.to),
          vehicle: safeString(delivery.driving_mode || delivery.vehicle_type || delivery.vehicle),
          status: safeString(delivery.status),
          fee: safeString(delivery.payment.amount || delivery.fee || delivery.amount || "0"),
          // Keep original data for detailed view
          originalData: delivery,
        }
      })
    }
  
    // Get transformed deliveries data with error handling
    let deliveries = []
    try {
      deliveries = transformDeliveryData(deliveriesData)
    } catch (error) {
      console.error("Error transforming delivery data:", error)
      deliveries = []
    }
  
    // Define table columns
    const columns = [
      {
        key: "id",
        label: "Ride ID",
      },
      {
        key: "from",
        label: "From",
      },
      {
        key: "to",
        label: "To",
      },
      {
        key: "vehicle",
        label: "Vehicle",
      },
      {
        key: "status",
        label: "Status",
      },
      {
        key: "fee",
        label: "Fee",
      },
    ]
  
    // Custom cell renderer for status and fee formatting
    const renderCustomCell = (key, value, row) => {
      // Ensure value is always a string or renderable element
      const safeValue = value === null || value === undefined ? "N/A" : String(value)
  
      if (key === "status") {
        // Normalize status for consistent styling
        const normalizedStatus = safeValue.toLowerCase()
        let statusClass = "px-2 py-1 rounded-full text-xs "
  
        switch (normalizedStatus) {
          case "ongoing":
          case "on going":
          case "in progress":
          case "active":
          case "in_progress":
            statusClass += "bg-yellow-100 text-yellow-800"
            break
          case "cancelled":
          case "canceled":
          case "failed":
          case "rejected":
            statusClass += "bg-red-100 text-red-800"
            break
          case "delivered":
          case "completed":
          case "success":
          case "successful":
            statusClass += "bg-green-100 text-green-800"
            break
          case "pending":
          case "waiting":
          case "assigned":
            statusClass += "bg-blue-100 text-blue-800"
            break
          default:
            statusClass += "bg-gray-100 text-gray-800"
        }
  
        return <span className={statusClass}>{safeValue}</span>
      }
  
      if (key === "fee") {
        // Format fee with currency symbol
        const numericFee = safeValue.replace(/[^\d.]/g, "")
        const feeNumber = Number.parseFloat(numericFee) || 0
        return `₦${feeNumber.toLocaleString()}`
      }
  
      if (key === "vehicle") {
        // Capitalize vehicle type
        const vehicleStr = safeValue.toLowerCase()
        return vehicleStr.charAt(0).toUpperCase() + vehicleStr.slice(1)
      }
  
      if (key === "from" || key === "to") {
        // Truncate long addresses
        return safeValue.length > 30 ? `${safeValue.substring(0, 30)}...` : safeValue
      }
  
      if (key === "id") {
        //truncate long ids
        return safeValue.length > 10 ? `${safeValue.substring(0, 10)}...` : safeValue
      }
  
      return safeValue
    }
  
    // Handle row click for viewing delivery details
    const handleViewDelivery = (delivery) => {
      console.log("Viewing delivery:", delivery)
      console.log("Original API data:", delivery.originalData)
      navigate(`/delivery/${delivery.originalData._id}`)
      // Add your view delivery logic here
    }
  
    // Handle "All Deliveries" button click
    const handleAllDeliveries = () => {
      console.log("Navigate to all deliveries page")
      // Add navigation logic here
    }

    const handlecreateDeliveries = () => {
      setIsMenuOpen(true);
    }
  
  
    // Debug logging
    console.log("DeliveryTable received data:", deliveriesData)
    console.log("Transformed deliveries:", deliveries)
  
    // Loading state
    if (!deliveriesData) {
      return (
        <AppLayout title={"Deliveries"}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Deliveries</CardTitle>
                <CardDescription>Keep track of all your deliveries</CardDescription>
              </div>         
              {/* <ButtonComponent 
                variant='primary' 
                icon={<Plus size={16}/>} 
                label={"Create New"} 
                buttonStyles="sm:px-4 px-2 h-[30px] sm:h-[52px]" 
                onClick={handlecreateDeliveries} 
                /> */}
                <CreateDeliveryButton />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <div className="animate-pulse text-gray-500">Loading deliveries...</div>
            </div>
          </CardContent>
        </Card>
        </AppLayout>
      )
    }
  
    // Error state
    if (!Array.isArray(deliveriesData)) {
      return (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Deliveries</CardTitle>
                <CardDescription>Keep track of all your deliveries</CardDescription>
              </div>
              <ButtonComponent
                variant={"primary"}
                label={"+ All Deliveries"}
                buttonStyles={"h-8"}
                onClick={handlecreateDeliveries}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-32 text-red-500">
              <div className="mb-2">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm">Error loading deliveries</p>
              <p className="text-xs text-gray-400">Invalid data format received</p>
            </div>
          </CardContent>
        </Card>
      )
    }
  
    // Empty state
    if (deliveries.length === 0) {
      return (
        <AppLayout title={"Deliveries"}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Deliveries</CardTitle>
                <CardDescription>Keep track of all your deliveries</CardDescription>
              </div>
              <ButtonComponent
                variant={"primary"}
                label={"+ All Deliveries"}
                buttonStyles={"h-8"}
                onClick={handlecreateDeliveries}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <div className="mb-2">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5"
                  />
                </svg>
              </div>
              <p className="text-sm">No deliveries found</p>
              <p className="text-xs text-gray-400">Your delivery history will appear here</p>
            </div>
          </CardContent>
        </Card>
        </AppLayout>
      )
    }
  
    return (
      <AppLayout title={"Deliveries"}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Deliveries</CardTitle>
              <CardDescription>Keep track of all your deliveries ({deliveries.length} total)</CardDescription>
            </div>
             <ButtonComponent 
                variant='primary' 
                icon={<Plus size={16}/>} 
                label={"Create New"} 
                buttonStyles="sm:px-4 px-2 h-[30px] sm:h-[52px]" 
                onClick={handlecreateDeliveries} 
              />
          </div>
        </CardHeader>
        <CardContent>
          <Table
            data={deliveries}
            columns={columns}
            onRowClick={handleViewDelivery}
            renderCustomCell={renderCustomCell}
            showSearch={false}
            itemsPerPage={5}
          />
        </CardContent>
        <NewDeliverySideMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          openModal={handleDeliveryModal}

        />
      </AppLayout>
    )
  }
