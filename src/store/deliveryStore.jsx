import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useDeliveryStore = create((set) => ({
    deliveriesData: [],
    deliveryOverview: null,
    loading: false,
    error: null,
    showErrorModal: false,

    getDeliveries: async () => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get("/history/order-history");
            console.log("Deliveries result", res)
            set({ loading: false,  deliveriesData: res.data?.data});
        } catch (error) {
             set({ error: error.response?.data?.message || "Error fetching overview", loading: false });
            console.error("Error fetching deliveries:", error)
            //toast.error(error.response.data.message || "An error occurred");
        }
    },

    createDelivery: async (deliveryData) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post("/user/delivery/create", deliveryData);
            toast.success("Delivery created successfully!");
            set({ loading: false, deliveryInfo: response.data?.data });
            return response.data;
        } catch (error) {
            set({
                loading: false,
                error: error?.response?.data?.message,
                showErrorModal: true
            });
            console.error("Error creating delivery:", error);
            toast.error("Failed to create delivery");
            return null;
        }
        finally {
            set({ loading: false });
        }
    },

    createOrder: async (deliveryId) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post("/user/order/create", {
                delivery_id: deliveryId,
            });
            toast.success("Order created successfully!");
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({
                loading: false,
                error: error?.response?.data?.message || "Failed to create order",
                showErrorModal: true
            });
            toast.error("Failed to create order");
            console.error("Error creating order:", error);  
            return null;
        }
        finally {
            set({ loading: false });
        }
    },

    /**
     * Fetch delivery overview with dynamic query params.
     * @param {Object} params - Query params, e.g. { timeframe: "all", status: "delivered" }
     */
    /* getDeliveryOverview: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            // Build query string from params object
            const query = new URLSearchParams(params).toString();
            const url = `/delivery/overview${query ? `?${query}` : ""}`;
            const response = await axiosInstance.get(url);
            set({ deliveryOverview: response.data?.data, loading: false });
            return response.data?.data;
        } catch (error) {
            set({
                loading: false,
                error: error?.response?.data?.message || "Failed to fetch delivery overview",
                showErrorModal: true
            });
            toast.error("Failed to fetch delivery overview");
            return null;
        } finally {
            set({ loading: false });
        }
    }, */

    getDeliveryOverview: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get(`/delivery/overview`);
            set({ deliveryOverview: response.data?.data?.data, loading: false });
            console.log("Delivery Overview", response.data?.data);
            //toast.success("Delivery overview fetched successfully!")
            return response.data?.data;
        } catch (error) {
            set({
                loading: false,
                error: error?.response?.data?.message || "Failed to fetch delivery overview",
                showErrorModal: true
            });
            console.log("Error fetching delivery overview", error)
            //toast.error("Failed to fetch delivery overview")
            //toast.error("Failed to fetch delivery overview");
            return null;
        } finally {
            set({ loading: false });
        }
    },

    closeErrorModal: () => set({ showErrorModal: false, error: null }),
}));

export default useDeliveryStore;