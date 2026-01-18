import { create } from "zustand";
import axiosInstance from "@/lib/utils/axiosInstance";


 const useOverviewStore = create((set, get) => ({
    overviewData: null,
    trendData: null,
    loading: false,
    error: null,
    message: null,

    getOverview: async () => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get("/statistics/user");
            console.log("Overview result", res)
            set({ loading: false,  overviewData: res.data?.data});
        } catch (error) {
             set({ error: error.response?.data?.message || "Error fetching overview", loading: false });
            console.log(error);
            //toast.error(error.response.data.message || "An error occurred");
        }
    },

    getTrendForChart: async () => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get("/statistics/user/monthly_trend");
            console.log("Trend result", res)
            set({ loading: false,  trendData: res.data?.data});
        } catch (error) {
            set({ error: error.response?.data?.message || "Error fetching trend", loading: false });
            console.error(error)
            throw error;
        }
    }        
}));

export default useOverviewStore;