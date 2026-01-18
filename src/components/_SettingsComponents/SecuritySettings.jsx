import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ButtonComponent } from '../ButtonComponent';
import { useModal } from '@/lib/ModalContext';
import ChangePasswordForm from './ChangePasswordForm';
import useAuthStore from '@/store/authStore';


const NotificationItem = ({ title, description, enabled, onToggle }) => {
  return (
    <div className="flex items-center justify-between space-x-4 py-4">
      <div className="flex-1">
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-[#27115F]"
      />
    </div>
  );
};

export const SecuritySettings = () => {
  // State for notification preferences
  const [notifications, setNotifications] = useState({
    fingerprint: false,
  });
  const [isLoading, setIsLoading] = useState(false)
  const {openModal, closeModal} = useModal()
  const {changePassword, loading, error} = useAuthStore()

  const handlePasswordSubmit = async (formData) => {
    const { currentPassword, newPassword, confirmPassword } = formData

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      openModal({
        title: "Validation Error",
        content: (
          <div className="text-center py-4">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Please fill in all password fields.</p>
          </div>
        ),
        buttons: [{ label: "OK", onClick: closeModal, primary: true }],
      })
      return
    }

    if (newPassword !== confirmPassword) {
      openModal({
        title: "Password Mismatch",
        content: (
          <div className="text-center py-4">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">New password and confirm password do not match.</p>
          </div>
        ),
        buttons: [{ label: "OK", onClick: closeModal, primary: true }],
      })
      return
    }

    if (newPassword.length < 6) {
      openModal({
        title: "Password Too Short",
        content: (
          <div className="text-center py-4">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">New password must be at least 6 characters long.</p>
          </div>
        ),
        buttons: [{ label: "OK", onClick: closeModal, primary: true }],
      })
      return
    }

    setIsLoading(true)

    try {
      // Call the change password API
      const response = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword
      })


      setIsLoading(false)
      closeModal()

      // Show success modal
      setTimeout(() => {
        openModal({
          title: "Password Changed Successfully",
          content: (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Your password has been updated successfully.</p>
              <p className="text-sm text-gray-500">Please use your new password for future logins.</p>
            </div>
          ),
          buttons: [{ label: "OK", onClick: closeModal, primary: true }],
        })
      }, 300)
    } catch (error) {
      setIsLoading(false)
      console.error("Password change error:", error)

      // Show error modal
      openModal({
        title: "Password Change Failed",
        content: (
          <div className="text-center py-4">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Failed to change password. Please try again.</p>
            <p className="text-sm text-gray-500">{error.message || "An unexpected error occurred"}</p>
          </div>
        ),
        buttons: [
          { label: "Cancel", onClick: closeModal },
          {
            label: "Try Again",
            onClick: () => {
              closeModal()
              setTimeout(() => handleOpenChangePasswordModal(), 300)
            },
            primary: true,
          },
        ],
      })
    }
  }

  const handleToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleOpenChangePasswordModal = () => {
   /*  send api here */
    openModal({
      title: 'Change Password',
      content: <ChangePasswordForm onClose={closeModal} onSubmit={handlePasswordSubmit} />,
      size: 'sm',
      buttons: [
        {
          label: "Cancel",
          onClick: closeModal,
          disabled: isLoading,
        },
        {
          label: isLoading ? "Changing..." : "Change Password",
          onClick: () => {
            // The form submission is handled by the ChangePasswordForm component
            const form = document.querySelector("form")
            if (form) {
              form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
            }
          },
          primary: true,
          disabled: isLoading,
        },
      ],
    });
  }


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-blue-600 text-base">Account security</CardTitle>
        <p className="text-sm text-gray-500">Manage password and biometrics</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <Separator />

        <div className="flex items-center justify-between space-x-4 py-4">
            <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900">Manage Password</h3>
                <p className="text-sm text-gray-500">xxxx</p>
            </div>
            <ButtonComponent label={'Change Password'} variant={'white'} onClick={handleOpenChangePasswordModal} />
        </div>
        {/* Notification Categories */}
        <div className="space-y-4">
          <NotificationItem
            title="Fingerprint for Login"
            description="You can make login faster & secure with fingerprint in your devices"
            enabled={notifications.fingerprint}
            onToggle={() => handleToggle('fingerprint')}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;