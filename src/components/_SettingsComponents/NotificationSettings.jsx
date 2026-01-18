import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from 'lucide-react';
import useNotificationStore from '@/store/notificationStore';
import useAuthStore from '@/store/authStore';

const NotificationItem = ({ title, description, enabled, onToggle, loading }) => {
  return (
    <div className="flex items-center justify-between space-x-4 py-4">
      <div className="flex-1">
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex items-center space-x-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          disabled={loading}
          className="data-[state=checked]:bg-[#27115F]"
        />
      </div>
    </div>
  );
};

export const NotificationSettings = () => {
  // State for notification preferences
  const [notifications, setNotifications] = useState({
    deals: true,
    system_update: true,
    email_notification: false,
    delivery_updates: true,
  });

  // State for notification method (push/email/both)
  const [notificationMethod, setNotificationMethod] = useState("push");
  
  // Loading states for individual toggles
  const [loadingStates, setLoadingStates] = useState({
    deals: false,
    system_update: false,
    email_notification: false
  });

  const { updateNotificationPreference, notificationPreferences, getNotification, loading, error } = useNotificationStore();
  const { user } = useAuthStore();

  console.log("Notification Preferences from Store:", notificationPreferences);

  useEffect(() => {
    console.log("User notification preferences data changed:", user?.notificationPreference);
    if (user) {
      setNotifications({
        deals: user?.notificationPreference?.deals,
        system_update: user?.notificationPreference?.system_update,
        email_notification: user?.notificationPreference?.email_notification,
        delivery_updates: user?.notificationPreference?.deliveryUpdates,
        update_system: user?.notificationPreference?.systemUpdate,
      });
    }
  }, [user]);


  // Fetch initial notification preferences
  /* useEffect(() => {
    const fetchPreferences = async () => {
      try {
        await getNotification();
      } catch (error) {
        console.error("Failed to fetch notification preferences:", error);
      }
    };
    fetchPreferences();
  }, [getNotification]); */

  // Load initial preferences from store
  /* useEffect(() => {
    if (notificationPreferences) {
      setNotifications({
        deals: notificationPreferences.deals ?? true,
        system_update: notificationPreferences.system_update ?? true,
        email_notification: notificationPreferences.email_notification ?? false
      });
    }
  }, [notificationPreferences]); */

  const handleToggle = async (key) => {
    // Set loading state for this specific toggle
    setLoadingStates(prev => ({
      ...prev,
      [key]: true
    }));

    // Optimistically update the UI
    const newValue = !notifications[key];
    setNotifications(prev => ({
      ...prev,
      [key]: newValue
    }));

    try {
      // Prepare the API payload
      const updatedPreferences = {
        ...notifications,
        [key]: newValue
      };

      // Make the API call
      await updateNotificationPreference(updatedPreferences);
      
      console.log('Updated Preferences:', updatedPreferences); 
      console.log(`${key} preference updated to:`, newValue);
    } catch (error) {
      console.error(`Failed to update ${key} preference:`, error);
      
      // Revert the optimistic update on error
      setNotifications(prev => ({
        ...prev,
        [key]: !newValue
      }));
    } finally {
      // Clear loading state
      setLoadingStates(prev => ({
        ...prev,
        [key]: false
      }));
    }
  };

  const handleMethodChange = (method) => {
    setNotificationMethod(method);
    // You can also make an API call here if the method needs to be saved
    console.log('Notification method changed to:', method);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-blue-600 text-base">Notification</CardTitle>
        <p className="text-sm text-gray-500">Manage notification settings</p>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notification Method Selection */}
        <div className="space-y-3">
          <Label className="text-base">Notification Method</Label>
          <RadioGroup
            value={notificationMethod}
            onValueChange={handleMethodChange}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="push" className="border-[#27115F] text-[#27115F]" />
              <Label className="text-sm font-normal">Push Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" className="border-[#27115F] text-[#27115F]" />
              <Label className="text-sm font-normal">Email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" className="border-[#27115F] text-[#27115F]" />
              <Label className="text-sm font-normal">Both</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        {/* Notification Categories */}
        <div className="space-y-4">
          <NotificationItem
            title="Deals and more"
            description="Switch off updates on vouchers, promos, and such. You can always find the promos"
            enabled={notifications.deals}
            onToggle={() => handleToggle('deals')}
            loading={loadingStates.deals}
          />
          
          <Separator />
          
          <NotificationItem
            title="Update System"
            description="Updates on your live orders, trips, transaction history, and account"
            enabled={notifications.system_update}
            onToggle={() => handleToggle('system_update')}
            loading={loadingStates.system_update}
          />
          
          <Separator />
          
          <NotificationItem
            title="Email Notification"
            description="Promotions, Tiklog recommendations, and announcements in your email"
            enabled={notifications.email_notification}
            onToggle={() => handleToggle('email_notification')}
            loading={loadingStates.email_notification}
          />

          <Separator />

          <NotificationItem
            title="Delivery Updates"
            description="Get notified about your delivery status and updates"
            enabled={notifications.delivery_updates}
            onToggle={() => handleToggle('delivery_updates')}
            loading={loadingStates.delivery_updates}
          />

        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
