import { Bell, CheckCircle2, HelpCircle, Menu, Search, Settings, Tag, Wallet } from "lucide-react"
import { useState, useMemo } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { AnimatePresence, motion } from "framer-motion"
import { NotificationOverlay } from "./NotificationOverlay"
import { NotificationItem } from "./NotificationItem"
import { Logo } from "@/icon/Icons"

export const AppHeader = ({ icon, name, toggleSidebar, notification = [] }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)
  const [readNotifications, setReadNotifications] = useState(new Set())

  // Transform API notifications to match UI format
  const transformedNotifications = useMemo(() => {
    return notification?.map((notif) => {
      // Determine icon based on subject
      let notificationIcon = Settings // default icon
      if (notif.subject === "wallet update") {
        notificationIcon = Wallet
      } else if (notif.subject === "wallet top-up") {
        notificationIcon = CheckCircle2
      } else if (notif.subject === "delivery") {
        notificationIcon = Tag
      }

      // Format time - you can customize this based on your needs
      const formatTime = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInMinutes = Math.floor((now - date) / (1000 * 60))
        const diffInHours = Math.floor(diffInMinutes / 60)
        const diffInDays = Math.floor(diffInHours / 24)

        if (diffInMinutes < 1) return "Now"
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`
        if (diffInHours < 24) return `${diffInHours}h ago`
        if (diffInDays < 7) return `${diffInDays}d ago`
        return date.toLocaleDateString()
      }

      // Create title from subject
      const formatTitle = (subject) => {
        return subject
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      }

      return {
        id: notif._id,
        icon: notificationIcon,
        title: formatTitle(notif.subject),
        message: notif.message,
        time: formatTime(notif.createdAt),
        isRead: readNotifications.has(notif._id),
        originalData: notif, // Keep original data if needed
      }
    })
  }, [notification, readNotifications])

  const handleMarkAllAsRead = () => {
    const allIds = new Set(notification.map((notif) => notif._id))
    setReadNotifications(allIds)
  }

  const handleMarkAsRead = (id) => {
    setReadNotifications((prev) => new Set([...prev, id]))
  }

  const unreadCount = transformedNotifications?.filter((n) => !n.isRead).length

  return (
    <>
      <NotificationOverlay isVisible={isOverlayVisible} onClose={() => setIsOverlayVisible(false)} />

      <div className="fixed top-0 left-0 right-0 bg-white border-b shadow-sm dark:bg-gray-900 px-4 sm:px-8 py-4 flex items-center z-40 h-16 md:ml-64">
        {/* Left section with hamburger and logo for mobile */}
        <div className="flex items-center md:hidden">
          <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full" onClick={toggleSidebar}>
            <Menu size={24} className="dark:text-white" />
          </button>
          <div className="mx-4">
            <Logo />
          </div>
        </div>

        {/* Center/Left section with page icon and title */}
        <div className="hidden md:flex items-center dark:text-white">
          {icon}
          <span className="ml-3 font-medium">{name}</span>
        </div>

        {/* Right section with actions */}
        <div className="flex gap-2 ml-auto items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full"
          >
            <Search size={18} className="dark:text-white" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full"
          >
            <HelpCircle size={18} className="dark:text-white" />
          </motion.button>

          <Popover onOpenChange={setIsOverlayVisible}>
            <PopoverTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full relative bg-white z-40"
              >
                <Bell size={18} className="dark:text-white" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                  />
                )}
              </motion.button>
            </PopoverTrigger>

            <PopoverContent className="w-[380px] min-h-[500px] dark:bg-gray-900 dark:border-gray-800" align="end">
              <div className="flex items-center justify-between p-3 border-b dark:border-gray-800">
                <h3 className="font-medium dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark All As Read
                  </button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {transformedNotifications?.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <Bell size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {transformedNotifications?.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        {...notification}
                        onMarkRead={() => handleMarkAsRead(notification.id)}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  )
}
