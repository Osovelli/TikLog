/* import React from 'react';
import { Eye } from 'lucide-react';
import { Table } from '../Table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ButtonComponent } from '../ButtonComponent';

export const DeliveryTable = ({data}) => {
  // Sample delivery data
  const deliveries = [
    {
      id: '#123354',
      from: 'Ikeja, Lagos',
      to: 'Lekki, Lagos',
      vehicle: 'Car',
      status: 'On Going',
      fee: '1,600'
    },
    {
      id: '#123355',
      from: 'Ikeja, Lagos',
      to: 'Lekki, Lagos',
      vehicle: 'Car',
      status: 'Cancelled',
      fee: '1,600'
    },
    {
      id: '#123356',
      from: 'Ikeja, Lagos',
      to: 'Lekki, Lagos',
      vehicle: 'Car',
      status: 'Delivered',
      fee: '1,600'
    }
  ];

  // Define table columns
  const columns = [
    {
      key: 'id',
      label: 'Ride ID'
    },
    {
      key: 'from',
      label: 'From'
    },
    {
      key: 'to',
      label: 'To'
    },
    {
      key: 'vehicle',
      label: 'Vehicle'
    },
    {
      key: 'status',
      label: 'Status'
    },
    {
      key: 'fee',
      label: 'Fee'
    }
  ];

  // Handle row click for viewing delivery details
  const handleViewDelivery = (delivery) => {
    console.log('Viewing delivery:', delivery);
    // Add your view delivery logic here
  };

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
            buttonStyles={'h-8'}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table 
          data={deliveries}
          columns={columns}
          onRowClick={handleViewDelivery}
          showSearch={false}
          itemsPerPage={5}
        />
      </CardContent>
    </Card>
  );
}; */

import { Table } from "../Table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ButtonComponent } from "../ButtonComponent"
import { useNavigate } from "react-router"

export const DeliveryTable = ({ data }) => {
  const navigate = useNavigate()


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
    deliveries = transformDeliveryData(data).slice(0, 5)
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
    // Add your view delivery logic here
  }

  // Handle "All Deliveries" button click
  const handleAllDeliveries = () => {
    console.log("Navigate to all deliveries page")
    navigate("/deliveries")
    // Add navigation logic here
  }

  // Debug logging
  console.log("DeliveryTable received data:", data)
  console.log("Transformed deliveries:", deliveries)

  // Loading state
  if (!data) {
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
              onClick={handleAllDeliveries}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-gray-500">Loading deliveries...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (!Array.isArray(data)) {
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
              onClick={handleAllDeliveries}
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
              onClick={handleAllDeliveries}
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
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Deliveries</CardTitle>
            <CardDescription>Keep track of all your deliveries ({deliveries.length} total)</CardDescription>
          </div>
          <ButtonComponent
            variant={"primary"}
            label={"+ All Deliveries"}
            buttonStyles={"h-8"}
            onClick={handleAllDeliveries}
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
    </Card>
  )
}
