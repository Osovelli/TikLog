import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Wallet, CreditCard, PiggyBank } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

export const FinancialOverviewChart = ({ data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [selectedMetric, setSelectedMetric] = useState("income")

  // Process the API data for chart display
  const processedData = useMemo(() => {
    if (!data?.trends?.monthly) return []

    return data.trends.monthly.map((item) => ({
      month: item.monthName,
      monthShort: item.monthName.substring(0, 3),
      income: item.income || 0,
      expenses: item.expenses || 0,
      netIncome: item.netIncome || 0,
      totalTransactions: item.totalTransactions || 0,
    }))
  }, [data])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!data) return { totalIncome: 0, totalExpenses: 0, netEarnings: 0, avgIncome: 0, growth: 0 }

    const totalIncome = data.income?.total || 0
    const totalExpenses = data.expenses?.total || 0
    const netEarnings = data.netEarnings?.total || 0
    const avgIncome = data.income?.average || 0

    // Calculate growth percentage (mock calculations)
    const currentMonth = processedData[processedData.length - 1]
    const previousMonth = processedData[processedData.length - 2]
    const growth =
      previousMonth && previousMonth.income > 0
        ? ((currentMonth?.income - previousMonth.income) / previousMonth.income) * 100
        : 0

    return {
      totalIncome,
      totalExpenses,
      netEarnings,
      avgIncome,
      growth,
    }
  }, [data, processedData])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-NG").format(num)
  }

  // Get current date range
  const getDateRange = () => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    return `${firstDay.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    })} - ${lastDay.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">Income: {formatCurrency(data.income)}</p>
            <p className="text-red-600">Expenses: {formatCurrency(data.expenses)}</p>
            <p className="text-green-600">Net: {formatCurrency(data.netIncome)}</p>
          </div>
        </div>
      )
    }
    return null
  }

  // Get the data key based on selected metric
  const getDataKey = () => {
    switch (selectedMetric) {
      case "expenses":
        return "expenses"
      case "net":
        return "netIncome"
      default:
        return "income"
    }
  }

  // Get metric color
  const getMetricColor = () => {
    switch (selectedMetric) {
      case "expenses":
        return "#ef4444"
      case "net":
        return "#10b981"
      default:
        return "#3b82f6"
    }
  }

  // Get metric label
  const getMetricLabel = () => {
    switch (selectedMetric) {
      case "expenses":
        return "Total Expenses"
      case "net":
        return "Net Earnings"
      default:
        return "Total Income"
    }
  }

  // Get current metric value
  const getCurrentMetricValue = () => {
    switch (selectedMetric) {
      case "expenses":
        return summaryStats.totalExpenses
      case "net":
        return summaryStats.netEarnings
      default:
        return summaryStats.totalIncome
    }
  }

  /* if (!data || !processedData.length) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-400 mb-2">
              <BarChart className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500">No financial data available</p>
          </div>
        </CardContent>
      </Card>
    )
  } */

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-600">
              Avg Monthly {selectedMetric === "income" ? "Income" : selectedMetric === "expenses" ? "Expenses" : "Net"}{" "}
              ({getDateRange()})
            </h3>
          </div>
          <div className="flex gap-1">
            <Button
              variant={selectedMetric === "income" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric("income")}
              className="text-xs"
            >
              Income
            </Button>
            <Button
              variant={selectedMetric === "expenses" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric("expenses")}
              className="text-xs"
            >
              Expenses
            </Button>
            <Button
              variant={selectedMetric === "net" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric("net")}
              className="text-xs"
            >
              Net
            </Button>
          </div>
        </div>

        {/* Main Amount Display */}
        <div className="mt-4">
          <div className="text-3xl font-bold text-gray-900">{formatCurrency(getCurrentMetricValue())}</div>
          <div className="flex items-center mt-1">
            <div
              className={`flex items-center text-sm ${summaryStats.growth >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {summaryStats.growth >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(summaryStats.growth).toFixed(2)}%
            </div>
            <span className="text-gray-500 text-sm ml-2">{formatCurrency(summaryStats.avgIncome)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Chart */}
        <div className="h-48 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="monthShort" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey={getDataKey()}
                fill={getMetricColor()}
                radius={[4, 4, 0, 0]}
                opacity={0.8}
                onMouseEnter={(data, index) => {
                  // You can add hover effects here
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Wallet className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Total Income</span>
            </div>
            <span className="font-semibold text-gray-900">{formatCurrency(summaryStats.totalIncome)}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Total Expenses</span>
            </div>
            <span className="font-semibold text-gray-900">{formatCurrency(summaryStats.totalExpenses)}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <PiggyBank className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Net Earnings</span>
            </div>
            <span className="font-semibold text-gray-900">{formatCurrency(summaryStats.netEarnings)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
