import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useNotificationStore = create((set) => ({
    loading: false,
    error: null,
    notifications: null,
    showErrorModal: false,

    getNotifications: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get(`/notification/history`);
            console.log("Notifications fetched:", response.data.data);
            //toast.success("Notifications fetched successfully!");
            set({ loading: false, notifications: response?.data?.data });
            return response.data;
        } catch (error) {
            set({
                loading: false,
                error: error?.response?.data?.message || "Failed to fetch notifications",
                showErrorModal: true
            });
            //toast.error("Failed to fetch notifications");
            console.error("Error fetching notifications:", error)
            return null;
        }
        finally {
            set({ loading: false });
        }
    },

    updateNotificationPreference: async ( preference) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.put('/notification/update', { preference });
            console.log("Notification preference updated:", response.data);
            toast.success("Notification preference updated successfully!");
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({
                loading: false,
                error: error?.response?.data?.message || "Failed to update notification preference",
                showErrorModal: true
            });
            toast.error("Failed to update notification preference");
            console.error("Error updating notification preference:", error);
            return null;
        }
    },

    getNotification: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get(`/notification`);
            console.log("Notification fetched:", response.data.data);
            set({ loading: false, notifications: response?.data?.data });
            return response.data;
        } catch (error) {
            set({
                loading: false,
                error: error?.response?.data?.message || "Failed to fetch notification",
                showErrorModal: true
            });
            console.error("Error fetching notification:", error);
            return null;
        }
        finally {
            set({ loading: false });
        }
    },


    openErrorModal: (error) => set({ showErrorModal: true, error }),
    

    closeErrorModal: () => set({ showErrorModal: false, error: null }),
}));

export default useNotificationStore;