import { FinancialOverviewChart } from '@/components/_HomeOVerviewComponents/FinancialOverviewChart'
import { AppLayout } from '@/components/AppLayout'
import useOverviewStore from '@/store/overviewStore'
import { BarChart2 } from 'lucide-react'
import React, { useEffect } from 'react'

export const StatisticsPage = () => {
  const { getOverview, overviewData, getTrendForChart } = useOverviewStore()

  useEffect(() => {
    getOverview()
  }, [])
    
  return (
    <AppLayout title={"Statistics"} icon={<BarChart2 />}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Statistics Overview</h1>
        {/* <p className="text-gray-600">This page will display various statistics related to deliveries, rider performance, and more.</p> */}
        {/* Add components for displaying statistics here */}
        <FinancialOverviewChart data={overviewData} />
      </div>
    </AppLayout>    
  )
}
