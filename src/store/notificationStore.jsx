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

    closeErrorModal: () => set({ showErrorModal: false, error: null }),
}));

export default useNotificationStore;