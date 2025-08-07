import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { UserStatusChart } from "@/components/_StatisticsComponents/UserStatusChart"
import { UserDistributionChart } from "@/components/_StatisticsComponents/UserDistributionChart"
import useDashboardStore from "@/store/DashboardStore"
import { AppLayout } from "@/components/AppLayout"

export const StatisticsPage = () => {
  const { getDashboardUserAnalytics, getDashboardUserDetails, dashboardUserDetails, dashboardUserAnalytics, loading } =
    useDashboardStore()

  useEffect(() => {
    // Fetch both datasets when component mounts
    getDashboardUserDetails()
    getDashboardUserAnalytics()
  }, [getDashboardUserDetails, getDashboardUserAnalytics])

  const isLoading = loading || !dashboardUserDetails?.data || !dashboardUserAnalytics?.data

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loading skeleton for both charts */}
        {[...Array(2)].map((_, index) => (
          <Card key={index} className="p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <AppLayout title="Statistics" icon={<span className="icon-statistics" />}>
      <div className="p-8 mt-10">
        <h2 className="text-2xl font-semibold mb-6">User Statistics Overview</h2>
        <p className="text-sm text-gray-600 mb-6">
          Detailed insights into user statuses and distributions across all categories.
        </p>
      </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Status Breakdown Chart */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">User Status Overview</h3>
          <p className="text-sm text-gray-600">Detailed breakdown of user statuses across all categories</p>
        </div>
        <UserStatusChart data={dashboardUserDetails?.data} />
      </Card>

      {/* User Distribution Pie Chart */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">User Distribution</h3>
          <p className="text-sm text-gray-600">Total users by category</p>
        </div>
        <UserDistributionChart data={dashboardUserAnalytics?.data} />
      </Card>
    </div>
    </AppLayout>
  )
}
